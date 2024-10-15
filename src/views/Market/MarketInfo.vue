<!-- 市场详情 -->
<template>
    <div class="page page_marketinfo" :class="{ 'innerpage_marketinfo': props.innerPage }">
        <!-- 头部 -->
        <div class="max-width info_header">
            <div class="top">
                <div v-if="!props.innerPage" class=" back" @click="backFunc">
                    <Icon name="arrow-left" />
                </div>
                <!-- 标题 -->
                <div class="title" v-if="route.query.type == 'stock'">
                    <div class="title_name">{{ item.symbol || '--' }}</div>
                    {{ item.name || '--' }}
                </div>
                <div class="title" v-else>
                    <div class="title_name">{{ item.name || '--' }}</div>
                </div>
                <!-- 详情 -->
                <div class="title_shadow"></div>
                <div v-if="!props.innerPage" class="search star" @click="addCollect"
                    :style="{ opacity: loading ? '0.5' : '1' }">
                    <img v-if="item.watchlist == 1" src="/static/img/common/collected.svg" alt="⭐">
                    <img v-else src="/static/img/common/collect.svg" alt="⭐">
                </div>
                <!-- <div v-if="!props.innerPage" class="search" @click="fullScreen(true)">
                    <Icon name="enlarge" />
                </div> -->
            </div>
            <div class="header-price">
                <h1 class="info" :class="[updown === 0 ? '' : (updown > 0 ? 'up' : 'down')]">
                    <template v-if="item.price || item.close">
                        {{ Number(item.price || item.close) }}
                    </template>
                    <span v-else>--</span>
                </h1>
                <div style="display: flex;align-items: center;margin-left: 0.4rem" class="ratio "
                    :class="[updown === 0 ? '' : (updown > 0 ? 'up' : 'down')]">
                    <div class="ratio_price" v-if="Number(item.price * (item.ratio || 0))">{{ Number(item.price *
                        (item.ratio ||
                            0)).toFixed(4) }}</div>
                    <div v-if="item.ratio">{{ item.ratio === undefined ? '--' : (item.ratio * 100).toFixed(2) + '%'
                        }}</div>
                </div>
                <!-- <div class="count van-col van-col--5">
                    <div class="count_item">
                        <div class="txt">最高</div>
                        <span>{{ item.high || '--' }}</span>
                    </div>
                    <div class="count_item">
                        <div class="txt">最低</div>
                        <span>{{ item.low || '--' }}</span>
                    </div>
                </div> -->
            </div>
        </div>
        <!-- 内容 -->
        <div class="market_content">
            <!-- 图表 -->
            <div class="chart_box">
                <div class="tabs">
                    <div class="tab" :class="{ 'active_tab': timeType == 'Time' }" @click="changeType('Time')">Time
                    </div>
                    <div class="tab" @click="showPicker = true" :class="{ 'active_tab': minList.includes(timeType) }">
                        {{ currMin }}
                        <Icon style="transform: rotate(90deg);" name="play" />
                    </div>
                    <div class="tab" :class="{ 'active_tab': timeType == '1h' }" @click="changeType('1h')">1h</div>
                    <div class="tab" v-if="!['stocks', 'forex'].includes(periodType)"
                        :class="{ 'active_tab': timeType == '4h' }" @click="changeType('4h')">4h</div>
                    <div class="tab" :class="{ 'active_tab': timeType == '1D' }" @click="changeType('1D')">1D</div>
                    <div class="tab" :class="{ 'active_tab': timeType == '1W' }" @click="changeType('1W')">1W</div>
                    <div class="tab" :class="{ 'active_tab': timeType == '1M' }" @click="changeType('1M')">1M</div>
                    <div class="tab" v-if="!['stocks', 'forex'].includes(periodType)"
                        :class="{ 'active_tab': timeType == '1Y' }" @click="changeType('1Y')">1Y</div>
                    <!-- <div style="flex:1"></div> -->
                    <div class="full-tab" @click="fullScreen(true)">
                        <img src="/static/img/common/full.svg" alt="">
                    </div>
                    <!-- <div class="full-tab" @click="addCollect" :style="{ opacity: loading ? '0.5' : '1' }">
                        <img v-if="item.watchlist == 0" src="/static/img/market/unstar.png" alt="⭐">
                        <img v-if="item.watchlist == 1" src="/static/img/market/star.png" alt="⭐">
                    </div> -->
                </div>
                <div class="chart_container" :class="{ 'fullscreen_container': fullWindow }">
                    <!-- 时区 -->
                    <div v-if="showDate" class="chart_time">{{ showDate }}</div>
                    <!-- 分时图 -->
                    <AreaChart ref="AreaChartRef" v-if="timeType == 'Time'" :showY="true" :symbol="item.symbol" />
                    <!-- K线图 -->
                    <KlineChart ref="KlineChartRef" v-if="timeType != 'Time'" :symbol="item.symbol"
                        :period="timeType" />
                    <!-- 全屏关闭按钮 -->
                    <div class="full_close" v-if="fullWindow" @click="fullScreen(false)">
                        <Icon name="cross" />
                    </div>
                </div>
            </div>
        </div>
        <!-- 操作 -->
        <div class="market_bottom" v-if="!props.innerPage">
            <div>
                <div class="symbol">{{ item.symbol || "--" }}</div>
                <div class="time_type">{{ timeType }}</div>
            </div>

            <!-- <div class="bottom_btn" @click="showBuy = true">
                <span>交易</span>
            </div>
            -->
            <div style="display: flex">
                <div class="bottom_btn" style="background-color: #014cfa" @click="showInfo = true">
                    <!-- <div class="bottom_btn_icon">
                            <img src="/static/img/market/data_icon.png" alt="img">
                        </div> -->
                    <span>数据</span>
                </div>
                <div class="bottom_btn" @click="goBuy(true)" style="background-color: #00af70">
                    <!-- <div class="bottom_btn_icon">
                            <img src="/static/img/market/data_icon.png" alt="img">
                        </div> -->
                    <span>买涨</span>
                </div>
                <div class="bottom_btn" @click="goBuy(false)" style="background-color: #e8503a">
                    <!-- <div class="bottom_btn_icon">
                            <img src="/static/img/market/data_icon.png" alt="img">
                        </div> -->
                    <span>买跌</span>
                </div>
            </div>
        </div>
        <!-- 时间选择弹窗 -->
        <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" v-model:show="showPicker" round
            position="bottom">
            <div class="times_list">
                <div v-for="item in minList" :key="item" @click="chooseTime(item)" class=" item"
                    :class="{ 'active_item': currMin == item }">{{ item }}
                </div>
            </div>
        </Popup>
        <!-- 交易弹窗 -->
        <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" v-model:show="showBuy" round position="bottom"
            closeable>
            <div class="buy_popup">
                <div class="buy_name">交易</div>
                <div class="buy_popup_btn" @click="goBuy(true)">
                    <span>买涨</span>
                    <div class="btn_icon">
                        <img src="/static/img/market/market.png" alt="img">
                    </div>
                </div>
                <div class="buy_popup_btn buy_popup_btn2" @click="goBuy(false)">
                    <span>买跌</span>
                    <div class="btn_icon">
                        <img src="/static/img/market/market.png" alt="img">
                    </div>
                </div>
            </div>
        </Popup>

        <!-- 数据弹窗 -->
        <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" v-model:show="showInfo" round
            position="bottom" closeable>
            <div class="info_popup">
                <div class="info_name">数据</div>
                <div class="info_price">
                    <div class="info_num" :class="[updown === 0 ? '' : (updown > 0 ? 'up' : 'down')]">
                        <template v-if="item.price || item.close">
                            {{ Number(item.price || item.close).toFixed(2) }}
                        </template>
                        <span v-else>--</span>
                    </div>
                    <div style="display: flex;align-items: center;margin-left: 0.4rem"
                        :class="[updown === 0 ? '' : (updown > 0 ? 'up' : 'down')]">
                        <div v-if="Number(item.price * (item.ratio || 0))">{{ Number(item.price *
                            (item.ratio ||
                                0)).toFixed(2) }}</div>
                        <div v-if="item.ratio" style="margin-left:0.32rem">{{ item.ratio === undefined ? '--' :
                            (item.ratio *
                                100).toFixed(2) + '%'
                            }}</div>
                    </div>
                </div>
                <div class="info_items">
                    <div class="info_item">
                        <div class="name">开</div>
                        <div>{{ item.open }}</div>
                    </div>
                    <div class="info_item">
                        <div class="name">高</div>
                        <div>{{ item.high }}</div>
                    </div>
                    <div class="info_item">
                        <div class="name">量</div>
                        <div>{{ _formatNumber(item.volume) }}</div>
                    </div>
                    <div class="info_item">
                        <div class="name">收</div>
                        <div>{{ item.close }}</div>
                    </div>
                    <div class="info_item">
                        <div class="name">低</div>
                        <div>{{ item.low }}</div>
                    </div>
                    <div class="info_item">
                        <div class="name">额</div>
                        <div>{{ _formatNumber(item.amount) }}</div>
                    </div>
                </div>
            </div>
        </Popup>

    </div>
</template>

<script setup>
import { Icon, Popup, showToast } from "vant"
import router from "@/router"
import { useRoute } from "vue-router"
import { computed, ref } from "vue"
import store from "@/store";
import AreaChart from "@/components/KlineCharts/AreaChart.vue"
import KlineChart from "@/components/KlineCharts/KlineChart.vue"
import { _formatNumber } from "@/utils/index"
import { _basic, _profile, _add, _del } from "@/api/api"
import { formatTimestamp } from "@/utils/time"

const route = useRoute()
const token = computed(() => store.state.token)

// const activeTab = ref(1)
const props = defineProps({
    innerPage: { // 作为内置展示页
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: ''
    }
})

// 添加自选
const loading = ref(false)
const addCollect = () => {
    if (!token.value) return store.commit('setIsLoginOpen', true)
    if (loading.value) return
    loading.value = true
    if (!item.value.watchlist) {
        _add({
            symbol: item.value.symbol
        }).then(res => {
            if (res.code == 200) {
                switch (route.query.type) {
                    case 'constract': // 合约
                        store.commit('setCurrConstract', { watchlist: 1 })
                        break
                    default:
                        store.commit('setCurrStock', { watchlist: 1 })
                }
                showToast('添加成功')
            }
        }).finally(() => {
            loading.value = false
        })
    } else {
        _del({
            symbol: item.value.symbol
        }).then(res => {
            if (res.code == 200) {
                switch (route.query.type) {
                    case 'constract': // 合约
                        store.commit('setCurrConstract', { watchlist: 0 })
                        break
                    default:
                        store.commit('setCurrStock', { watchlist: 0 })
                }
                showToast('移除成功')
            }
        }).finally(() => {
            loading.value = false
        })
    }


}


const periodType = computed(() => route.query.type || props.type)
// 股票信息
const item = computed(() => {
    let it = {}
    const type = route.query.type || props.type
    switch (type) {
        case 'constract': // 合约
            it = store.state.currConstact || {}
            break
        case 'ai': // 合约
            it = store.state.currAi || {}
            break
        default:
            it = store.state.currStock || {}
    }
    return it
})

const showDate = computed(() => { // 展示的数据时间
    if (item.value.timestamp || item.value.ts) {
        return formatTimestamp(item.value.timestamp || item.value.ts, item.value.timezone)
    }
    return ''
})



const updown = computed(() => { // 1-涨 -1-跌 0-平
    if (item.value.ratio === undefined) return 0
    return item.value.ratio > 0 ? 1 : -1
})

// 获取股票最新信息
if (item.value.symbol) {
    _basic({ symbol: item.value.symbol }).then(res => {
        if (res.code == 200) {
            store.commit('setCurrStock', {
                ...item.value,
                ...res.data
            })
        }
    })
    // _profile({ symbol: item.value.symbol }).then(res => {
    //     if (res.code == 200) {
    //         store.commit('setCurrStock', {
    //             ...item.value,
    //             ...res.data
    //         })
    //     }
    // })
}


// 图表信息  Time 1m 5m 10m 15m 30m 1h 4h 1D 1W 1M 1Y
const timeType = ref('1h')
const showPicker = ref(false) // 时间选择弹窗
const currMin = ref('1m')
const minList = computed(() => {
    if (periodType.value == 'futures' || periodType.value == 'aiquant' || periodType.value == 'constract') {
        return ['1m', '5m', '15m', '30m']
    }
    return ['1m', '5m', '10m', '15m', '30m']
})
const chooseTime = time => {
    showPicker.value = false
    currMin.value = time
    changeType(time)
}
const changeType = type => {
    if (timeType.value == type) return
    timeType.value = type
}

// 投注折叠
const switchKey = ref(false)

// 全屏
store.commit('setFullscreen', false)
const fullWindow = computed(() => store.state.fullscreen)
const KlineChartRef = ref()
const AreaChartRef = ref()
const fullScreen = (key) => {
    store.commit('setFullscreen', key)
    if (KlineChartRef.value) KlineChartRef.value.resetSize()
    if (AreaChartRef.value) AreaChartRef.value.resetSize()
}



// 下单
const goBuy = key => {
    showBuy.value = false
    // store.commit('setActive', key)
    router.push({
        name: 'trade',
        query: {
            symbol: item.value.symbol,
            type: key ? 1 : 2,
            to: route.query.type
        }
    })
}

// 返回
const emits = defineEmits(['back'])
const backFunc = () => {
    if (props.innerPage) {
        emits('back')
    } else {
        router.back()
    }
}


// 弹窗
const showBuy = ref(false)
const showInfo = ref(false)
</script>

<style lang="less" scoped>
.page_marketinfo {
    padding: 1.8rem 0 0 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;

    .has_padding_x {
        padding: 0 0.3rem;
    }

    .info_header {
        width: calc(100% - 0.6rem);
        // border-bottom: 0.1rem solid #F9FAFB;
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        background-color: #fff;
        z-index: 100;

        .top {
            display: flex;
            min-height: 1rem;
            align-items: center;
            justify-content: space-between;
            position: relative;


            .back {
                width: 0.36rem;
                height: 0.36rem;
                font-size: 0.36rem;
            }

            .title_shadow {
                flex: 1;
            }

            .title {
                pointer-events: none;
                position: absolute;
                width: calc(100% - 1.6rem);
                top: 50%;
                transform: translateY(-50%) translateX(-50%);
                left: 50%;
                text-align: center;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                font-size: 0.24rem;
                line-height: 0.32rem;
                color: #8F92A1;

                .title_name {
                    color: #061023;
                    font-size: 0.32rem;
                    line-height: 0.44rem;
                }
            }

            .search {
                width: 0.64rem;
                height: 0.64rem;
                padding: 0.12rem;
                font-size: 0.4rem;
                margin-left: 0.2rem;
                // background-color: #EDEDED;
                border-radius: 50%;
                position: relative;
                left: 0.15rem;
            }
        }

        .header-price {
            padding: 0.1rem 0;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            .info {
                align-items: center;
                margin: 0;
            }
        }

        .count {
            .count_item {
                color: #55555E;
                font-size: 0.24rem;
                font-weight: 400;
                line-height: 0.36rem;

                .txt {
                    flex: none;
                    display: block;
                    width: 100%;
                    color: #bbb;
                }

                .num {
                    color: #000;
                    margin-left: 0.1rem
                }
            }

            .flex10 {
                flex: 5;
            }

            .flex12 {
                flex: 6;
            }
        }
    }

    h1.info {
        font-size: .6rem;
    }

    .submit {
        color: #fff;
        height: .8rem;
        border-radius: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.28rem;
        z-index: 100;
        margin-right: .2rem;
    }

    .btn-green {
        background: #18b762;
    }

    .btn-red {
        background: #f3485e;
    }

    .info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        vertical-align: middle;
    }

    .ratio {
        font-size: .4rem;
        line-height: .5rem;
    }


    .sell_key_open {
        transform: translateY(0);

        .sell_key {
            background-color: rgba(0, 0, 0, 0);

            .sell_key_icon {
                transform: rotate(0deg)
            }
        }
    }

    .ratio_price {
        margin-right: 0.3rem
    }

    .align-content {
        align-content: center;
    }

    .txt-center {
        text-align: center;
    }

    .icon-heyue {
        display: block;
        height: .6rem;
    }

    @media (min-width: 751px) {
        .submit {
            max-width: 340px;
        }

        .info_header {
            max-width: 340px;
        }
    }

    .market_content {
        flex: 1;
        overflow: hidden;

        .funcs {
            display: flex;
            align-items: center;

            .tab {
                color: #061023;
                font-size: 0.28rem;
                font-weight: 400;
                margin-right: 0.32rem;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 0.2rem;
                // height: 0.72rem;
            }

            .active_tab {
                // background-color: #F6F8FF;
                border-radius: 0.48rem;
                color: #014CFA;
                font-weight: bold;
            }

            .icon {
                width: 0.5rem;
                height: 0.5rem;
                margin-left: 0.2rem;
            }

            .submit_btn {
                padding: 0.12rem 0.4rem;
                color: #fff;
                background-color: #014CFA;
                border-radius: 0.5rem;
                font-weight: 600;
                font-size: 0.26rem;
                margin-left: 0.3rem;
            }
        }

        .info {
            display: flex;
            align-items: stretch;
            margin-top: 0.16rem;
            margin-bottom: 0.3rem;

            .left {
                .price {
                    font-size: 0.9rem;
                    line-height: 1.06rem;
                    color: #55555E;
                    margin-bottom: 0.12rem;
                }

                .time {
                    color: #55555E;
                    font-size: 0.28rem;
                    line-height: 0.48rem;

                    span {
                        color: #0F0F1B;
                        margin-left: 0.2rem;
                    }
                }
            }

            .mid {
                flex: 1;
                margin-left: 0.36rem;
                margin-right: 0.2rem;
                color: #55555E;
                font-size: 0.36rem;
                line-height: 0.48rem;
            }

            .right {
                font-size: 0.24rem;
                line-height: 0.48rem;
                color: #818898;
                font-weight: 400;

                b {
                    color: #0D0D12;
                    font-weight: 700;
                    font-size: 0.28rem;
                    line-height: 0.4rem;
                }
            }
        }

        .chart_box {
            width: 100%;
            height: calc(var(--app-height) - 3.7rem);
            display: flex;
            flex-direction: column;
            overflow: hidden;

            .tabs {
                padding: 0 .2rem;
                height: 0.48rem;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .tab {
                    height: 0.48rem;
                    background-color: #EFF6FF;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 0.3rem;
                    color: #0A54F9;
                    font-size: 0.24rem;
                    font-weight: 400;
                    margin-right: 0.16rem;
                    padding: 0 0.1rem;
                    min-width: 0.64rem;
                }

                .active_tab {
                    background-color: #014CFA;
                    color: #fff;
                }
            }

            .full-tab {
                color: #333;
                font-size: 0.32rem;
                width: 0.48rem;
                height: 0.48rem;
                // margin-left: 0.2rem;
                // background-color: #EDEDED;
                border-radius: 50%;
                padding: 0.08rem;
                display: center;
                align-items: center;
                justify-content: center;
                text-align: center;
                line-height: 0;
            }

            .chart_container {
                height: calc(100% - 0.48rem);
                width: 100%;
                padding: 0 0.28rem;
                position: relative;

                .chart_time {
                    position: absolute;
                    z-index: 999;
                    top: 0.24rem;
                    left: 0.24rem;
                    color: #999;
                }
            }

            .fullscreen_container {
                position: fixed;
                z-index: 9999;
                width: 100vw;
                height: var(--app-height);
                top: 0;
                // left: 100vw;
                left: 0;
                background-color: #fff;
                // transform: rotate(90deg);
                // transform-origin: 0% 0%;

                .full_close {
                    width: 0.4rem;
                    height: 0.4rem;
                    position: absolute;
                    right: 0.4rem;
                    top: 0.4rem;
                    color: #000;
                    font-size: 0.4rem;
                    z-index: 99999;
                }
            }

            @media (min-width: 751px) {

                .fullscreen_container {
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    transform: none;
                }
            }
        }

    }

    .market_bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.12rem 0.32rem;
        border-top: 1px solid #EAEEF3;
        height: 1.4rem;
        font-size: 0.28rem;

        .symbol {
            color: #061023;
            margin-bottom: 0.12rem;
        }

        .time_type {
            width: 50%;
            text-align: center;
            box-sizing: border-box;
            color: #8f92a1;
            border-radius: 20px;
            border: 0.5px solid #d0d8e2;
            padding: 2px;
            font-size: 0.24rem;
        }

        .bottom_line {
            flex: 1;
            height: 0.32rem;
            border-left: 1px solid #EAEEF3;
        }

        .bottom_btn {
            color: white;
            border-radius: 40px;
            padding: 16px 24px;
            font-size: 0.24rem;
            margin-left: 0.2rem;
            display: flex;
            align-items: center;
            justify-content: center;

            .bottom_btn_icon {
                margin-right: 0.08rem;
                width: 0.32rem;
                height: 0.32rem;
            }
        }
    }

    .intro_box {
        padding-top: 0.4rem;

        .intro_title {
            color: #000;
            font-size: 0.36rem;
            font-weight: 600;
            margin-bottom: 0.2rem;
        }

        .intro_content {
            font-size: 0.28rem;
            font-weight: 400;
            color: #121826;
            line-height: 0.54rem;
            margin-bottom: 0.4rem;
        }

        .intro_area {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 0.6rem;
            margin-bottom: 0.28rem;
            font-size: 0.28rem;
            color: #121826;
            font-weight: 400;

            .intro_area_box {
                width: 2.6rem;
                font-size: 0.2rem;
                font-weight: 500;
                color: #000;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
        }
    }
}

.innerpage_marketinfo {
    width: 100%;
    height: 100%;
    padding-top: 0;

    .info_header {
        position: relative;
        background-color: rgba(0, 0, 0, 0);
        pointer-events: none;
    }

    .market_content {
        height: calc(100% - 1.8rem);

        .chart_box {
            height: 100%;
        }
    }
}

.times_list {
    padding: 0.5rem 0;

    .item {
        height: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.28rem;
        color: #55555E;
        overflow: hidden
    }

    .active_item {
        background-color: #F4F5F7;
        color: #014CFA;
    }
}

.buy_popup {
    padding: 0.8rem 0.32rem 0.2rem 0.32rem;

    .buy_name {
        color: #121826;
        margin-bottom: 0.54rem;
        padding-left: 0.24rem;
    }

    .buy_popup_btn {
        height: 0.9rem;
        border-radius: 0.9rem;
        background-color: #E8503A;
        color: #fff;
        font-size: 0.28rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.54rem;
        position: relative;

        .btn_icon {
            width: 0.4rem;
            height: 0.4rem;
            position: absolute;
            right: 0.64rem;
        }
    }

    .buy_popup_btn2 {
        background-color: #18B762;
    }
}

.info_popup {
    padding: 0.8rem 0.32rem 0.2rem 0.32rem;

    .info_name {
        color: #121826;
        margin-bottom: 0.54rem;
        padding-left: 0.24rem;
    }

    .info_price {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 0.32rem;

        .info_num {
            font-size: 0.46rem;
            font-weight: 600;
            margin-right: 0.06rem;
        }
    }

    .info_items {
        margin: 0.32rem 0 0 0;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;

        .info_item {
            margin-bottom: 0.32rem;
            width: 31%;
            height: 1.08rem;
            background: #F2F3F8;
            padding: 0.2rem;

            .name {
                padding-left: 0.1rem;
                margin-bottom: 0.15rem;
            }
        }
    }
}
</style>