<!-- 市场详情 -->
<template>
    <div class="page page_marketinfo">
        <!-- 头部 -->
        <div class="max-width info_header">
            <div class="top">
                <div class="ripple_button back" @click="router.back()">
                    <Icon name="arrow-left" />
                </div>
                <div class="title">
                    <div>{{ item.symbol || '--' }}</div>
                    <div class="info">{{ item.name || '--' }}</div>
                </div>
                <div class="search star">
                    <img src="/static/img/market/stared.png" alt="⭐">
                </div>
                <!-- <div class="search" @click="router.push({ name: 'search' })">
                    <img src="/static/img/common/search_box.png" alt="🔍">
                </div> -->
            </div>
            <div class="header-price van-row van-row--justify-space-between">
                <h1 class="info van-col van-col--10 align-content"
                    :class="[updown === 0 ? '' : (updown > 0 ? 'up' : 'down')]">
                    <template v-if="item.price || item.close">
                        {{ Number(item.price || item.close).toFixed(2) }}
                    </template>
                    <span v-else>--</span>
                </h1>
                <div style="display: flex;align-items: center;" class="ratio "
                    :class="[updown === 0 ? '' : (updown > 0 ? 'up' : 'down')]">
                    <div class="ratio_price">{{ Number(item.price * (item.ratio || 0)).toFixed(2) }}</div>
                    <div>{{ item.ratio === undefined ? '--' : (item.ratio * 100).toFixed(2) + '%'
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
                    <div class="full-tab" @click="fullScreen(true)">
                        <Icon name="enlarge" />
                    </div>
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
        <div class="bot-buysell van-row van-row--justify-space-between align-content">
            <div class="txt-center van-col van-col--6">
                <span class="icon-heyue">
                    <img src="/static/img/market/heyue.png">
                </span>
                <span class="fn-12">合约</span>
            </div>
            <div @click="showBuy = true" class="submit btn-red  van-col van-col--8">
                买涨
            </div>
            <div @click="showBuy = true" class="submit btn-green  van-col van-col--8">
                买跌
            </div>
        </div>
        <!-- 时间选择弹窗 -->
        <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" v-model:show="showPicker" round
            position="bottom">
            <div class="times_list">
                <div v-for="item in minList" :key="item" @click="chooseTime(item)" class="ripple_button item"
                    :class="{ 'active_item': currMin == item }">{{ item }}
                </div>
            </div>
        </Popup>

        <!-- 下单弹窗 -->
        <teleport to="body">
            <ActionSheet v-model:show="showBuy" close-on-click-action>
                <div style="padding: 1.16rem 0 0.6rem 0;background-color: #fff;">
                    <div style="height:0.96rem;border-bottom:1px solid #F5F5F5;display: flex;align-items: center;justify-content: center;color: #333333;font-weight: 400;"
                        v-for="(item, i) in actions" :key="i">
                        {{ item.name }}
                    </div>
                </div>
            </ActionSheet>
        </teleport>

    </div>
</template>

<script setup>
import { Icon, Popup, ActionSheet } from "vant"
import router from "@/router"
import { computed, ref } from "vue"
import store from "@/store";
import AreaChart from "@/components/KlineCharts/AreaChart.vue"
import KlineChart from "@/components/KlineCharts/KlineChart.vue"
import { _formatNumber } from "@/utils/index"
import { _basic, _profile } from "@/api/api"
import { getTimestr } from "@/utils/time"

const activeTab = ref(1)
const showBuy = ref(false) // 购买弹窗
const actions = ref([
    { name: '股票买涨', key: 'up' },
    { name: '股票买跌', key: 'down' },
])


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
</script>

<style lang="less" scoped>
.page_marketinfo {
    padding: 1.8rem 0 0 0;

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

            .back {
                width: 0.4rem;
                height: 0.4rem;
            }

            .title {
                flex: 1;
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
                width: 0.6rem;
                height: 0.6rem;
            }
        }

        .header-price {
            padding-top: 0.1rem;

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
        background: #ffffffde;
        // position:fixed;
        // bottom: 0;
        // z-index: 1;
        width: 100%;
        padding: .2rem 0;
        padding-bottom: calc(.2rem + constant(safe-area-inset-bottom));
        /*兼容 IOS<11.2*/
        padding-bottom: calc(.2rem + env(safe-area-inset-bottom));
        /*兼容 IOS>11.2*/
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
            height: calc(var(--app-height) - 3.2rem);
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
                font-size: 20px;
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