<!-- 市场详情 -->
<template>
    <div class="page page_marketinfo" :class="{ 'innerpage_marketinfo': props.innerPage }">
        <!-- 头部 -->
        <div class="max-width info_header">
            <div class="top">
                <div v-if="!props.innerPage" class="ripple_button back" @click="backFunc">
                    <Icon name="arrow-left" />
                </div>
                <div class="title">
                    <div>{{ item.symbol || '--' }}</div>
                    <div class="info">{{ item.name || '--' }}</div>
                </div>
                <div class="title_shadow"></div>
                <div v-if="!props.innerPage" class="search star" @click="addCollect"
                    :style="{ opacity: loading ? '0.5' : '1' }">
                    <img v-if="item.watchlist == 0" src="/static/img/market/unstar.png" alt="⭐">
                    <img v-if="item.watchlist == 1" src="/static/img/market/star.png" alt="⭐">
                </div>
                <div v-if="!props.innerPage" class="search" @click="fullScreen(true)">
                    <Icon name="enlarge" />
                </div>
            </div>
            <div class="header-price">
                <h1 class="info" :class="[updown === 0 ? '' : (updown > 0 ? 'up' : 'down')]">
                    <template v-if="item.price || item.close">
                        {{ Number(item.price || item.close).toFixed(2) }}
                    </template>
                    <span v-else>--</span>
                </h1>
                <div style="display: flex;align-items: center;margin-left: 0.4rem" class="ratio "
                    :class="[updown === 0 ? '' : (updown > 0 ? 'up' : 'down')]">
                    <div class="ratio_price" v-if="Number(item.price * (item.ratio || 0))">{{ Number(item.price *
                        (item.ratio ||
                            0)).toFixed(2) }}</div>
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
                    <div class="tab" :class="{ 'active_tab': timeType == '1D' }" @click="changeType('1D')">1D</div>
                    <div class="tab" :class="{ 'active_tab': timeType == '1W' }" @click="changeType('1W')">1W</div>
                    <div class="tab" :class="{ 'active_tab': timeType == '1M' }" @click="changeType('1M')">1M</div>
                    <div style="flex:1"></div>
                    <!-- <div class="full-tab" @click="fullScreen(true)">
                        <Icon name="enlarge" />
                    </div>
                    <div class="full-tab" @click="addCollect" :style="{ opacity: loading ? '0.5' : '1' }">
                        <img v-if="item.watchlist == 0" src="/static/img/market/unstar.png" alt="⭐">
                        <img v-if="item.watchlist == 1" src="/static/img/market/star.png" alt="⭐">
                    </div> -->
                </div>
                <div class="chart_container" :class="{ 'fullscreen_container': fullWindow }">
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
        <!-- 交易按钮 -->
        <div class="bot-buysell" :class="{ 'sell_key_open': switchKey }" v-if="!props.innerPage">
            <div @click="goBuy(true)" class="submit btn-red  van-col van-col--8">
                买涨
            </div>
            <div @click="goBuy(false)" class="submit btn-green  van-col van-col--8">
                买跌
            </div>

            <div class="sell_key" @click="switchKey = !switchKey">
                <div class="sell_key_icon">
                    <img src="/static/img/trade/down.png" alt="img">
                </div>
                <span>{{ switchKey ? '收起' : '展开' }}</span>
            </div>
        </div>
        <!-- 时间选择弹窗 -->
        <!-- <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" v-model:show="showPicker" round
            position="bottom">
            <div class="times_list">
                <div v-for="item in minList" :key="item" @click="chooseTime(item)" class="ripple_button item"
                    :class="{ 'active_item': currMin == item }">{{ item }}
                </div>
            </div>
        </Popup> -->

        <!-- 下单弹窗 -->
        <!-- <teleport to="body">
            <ActionSheet v-model:show="showBuy" close-on-click-action>
                <div style="padding: 1.16rem 0 0.6rem 0;background-color: #fff;">
                    <div style="height:0.96rem;border-bottom:1px solid #F5F5F5;display: flex;align-items: center;justify-content: center;color: #333333;font-weight: 400;"
                        v-for="(item, i) in actions" :key="i">
                        {{ item.name }}
                    </div>
                </div>
            </ActionSheet>
        </teleport> -->

    </div>
</template>

<script setup>
import { Icon, Popup, ActionSheet, showNotify } from "vant"
import router from "@/router"
import { computed, ref } from "vue"
import store from "@/store";
import AreaChart from "@/components/KlineCharts/AreaChart.vue"
import KlineChart from "@/components/KlineCharts/KlineChart.vue"
import { _formatNumber } from "@/utils/index"
import { _basic, _profile, _add, _del } from "@/api/api"

// const activeTab = ref(1)
const props = defineProps({
    innerPage: { // 作为内置展示页
        type: Boolean,
        default: false
    }
})
const showBuy = ref(false) // 购买弹窗
const actions = ref([
    { name: '股票买涨', key: 'up' },
    { name: '股票买跌', key: 'down' },
])

// 添加自选
const loading = ref(false)
const addCollect = () => {
    if (loading.value) return
    loading.value = true
    if (item.value.watchlist == 0) {
        _add({
            symbol: item.value.symbol
        }).then(res => {
            if (res.code == 200) {
                store.commit('setCurrStock', { watchlist: 1 })
                showNotify({ type: 'success', message: '添加成功' })
            }
        }).finally(() => {
            loading.value = false
        })
    } else {
        _del({
            symbol: item.value.symbol
        }).then(res => {
            if (res.code == 200) {
                store.commit('setCurrStock', { watchlist: 0 })
                showNotify({ type: 'success', message: '移除成功' })
            }
        }).finally(() => {
            loading.value = false
        })
    }


}


// 股票信息
const item = computed(() => store.state.currStock || {})
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
    _profile({ symbol: item.value.symbol }).then(res => {
        if (res.code == 200) {
            store.commit('setCurrStock', {
                ...item.value,
                ...res.data
            })
        }
    })
}


// 图表信息  Time 1m 5m 10m 15m 30m 1h 1D 1W 1M
const timeType = ref('1h')
const showPicker = ref(false) // 时间选择弹窗
const currMin = ref('1m')
const minList = ['1m', '5m', '10m', '15m', '30m']
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
    store.commit('setActive', key)
    router.push({
        name: 'trade',
        query: {
            symbol: item.value.symbol,
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
</script>

<style lang="less" scoped>
.page_marketinfo {
    padding: 1.8rem 0 0 0;
    overflow: hidden;

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
                width: 100%;
                top: 50%;
                transform: translateY(-50%);
                left: 0;
                padding: 0 0.4rem;
                text-align: center;
                color: #061023;
                font-size: 0.32rem;
                line-height: 0.44rem;

                .info {
                    font-size: 0.24rem;
                    line-height: 0.32rem;
                    color: #8F92A1;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    text-align: center;

                }
            }

            .search {
                width: 0.36rem;
                height: 0.36rem;
                font-size: 0.4rem;
                margin-left: 0.2rem;
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

    .bot-buysell {
        background-color: #fff;
        z-index: 99;
        border-top: 1px solid #efefef;
        position: absolute;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        bottom: 0;
        width: 100%;
        padding: .2rem 1rem 0.2rem 0.2rem;
        transition: all ease .3s;
        transform: translateY(100%);

        /*兼容 IOS>11.2*/
        .submit {
            margin: 0 0.4rem;
        }

        .sell_key {
            position: absolute;
            bottom: 1.2rem;
            right: 0;
            padding: 0.2rem 0.4rem 0.2rem 0.4rem;
            border-radius: 0.1rem;
            font-size: 0.2rem;
            color: #999;
            display: flex;
            align-items: center;
            background-color: #fff;

            .sell_key_icon {
                width: 0.28rem;
                height: 0.28rem;
                margin-right: 0.05rem;
                transition: all ease .3s;
                transform: rotate(180deg)
            }
        }
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
            height: calc(var(--app-height) - 1.8rem);
            display: flex;
            flex-direction: column;
            overflow: hidden;

            .tabs {
                padding: 0 .2rem;
                height: 0.48rem;
                display: flex;
                align-items: center;
                justify-content: flex-start;

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
                    margin-right: 0.18rem;
                    padding: 0 0.12rem;
                    min-width: 0.8rem;
                }

                .active_tab {
                    background-color: #014CFA;
                    color: #fff;
                }
            }

            .full-tab {
                color: #333;
                font-size: 0.4rem;
                width: 0.4rem;
                height: 0.4rem;
                margin-left: 0.2rem;
            }

            .chart_container {
                flex: 1;
                width: 100%;
                height: 100%;
                transition: all ease .3s;
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
</style>