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
                <div class="search" @click="router.push({ name: 'search' })">
                    <img src="/static/img/common/search_box.png" alt="🔍">
                </div>
            </div>
            <div class="count">
                <div class="count_item flex10">
                    <div style="margin-bottom: 0.1rem;">
                        <span>开</span>
                        <span class="num">{{ item.open || '--' }}</span>
                    </div>
                    <div>
                        <span>闭</span>
                        <span class="num">{{ item.close || '--' }}</span>
                    </div>
                </div>
                <div class="count_item flex10">
                    <div style="margin-bottom: 0.1rem;">
                        <span>高</span>
                        <span class="num">{{ item.high || '--' }}</span>
                    </div>
                    <div>
                        <span>低</span>
                        <span class="num">{{ item.low || '--' }}</span>
                    </div>
                </div>
                <div class="count_item flex12">
                    <div style="margin-bottom: 0.1rem;">
                        <span>量</span>
                        <span class="num">{{ _formatNumber(item.amount) || '--' }}</span>
                    </div>
                    <div>
                        <span>换</span>
                        <span class="num">{{ item.ratio ? `${(item.ratio * 100).toFixed(2)}%` : '--' }}</span>
                    </div>
                </div>
                <div class="count_item flex12">
                    <div style="margin-bottom: 0.1rem;">
                        <span>市盈</span>
                        <span class="num">{{ item.trailing_pe ? `${Number(item.trailing_pe).toFixed(2)}%` : '--'
                            }}</span>
                    </div>
                    <div>
                        <span>市值</span>
                        <span class="num">{{ item.market_cap ? _formatNumber(item.market_cap) : '--' }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 内容 -->
        <div class="market_content">
            <!-- 功能项 -->
            <div class="funcs">
                <div class="ripple_button tab active_tab">图表</div>
                <div class="ripple_button tab">概述</div>
                <div style="flex: 1;"></div>
                <div class="icon fullscreen" @click="fullScreen(true)">
                    <img src="/static/img/market/fullscreen.png" alt="fullscreen">
                </div>
                <div class="icon star">
                    <img src="/static/img/market/stared.png" alt="⭐">
                </div>
            </div>

            <!-- 详情 -->
            <div class="info">
                <div class="left">
                    <div class="price" :class="[updown === 0 ? '' : (updown > 0 ? 'up' : 'down')]">{{ item.price }}
                    </div>
                    <div class="time">
                        Update time <span>{{ item.timestamp ? getTimestr(item.timestamp * 1000, 2) : '--' }}</span>
                    </div>
                </div>
                <div class="mid" :class="[updown === 0 ? '' : (updown > 0 ? 'up' : 'down')]">
                    <div>--</div>
                    <div>{{ item.ratio === undefined ? '--' : (item.ratio * 100).toFixed(2) + '%' }}</div>
                </div>
                <div class="right">
                    <b>{{ item.market || '--' }}</b>
                    <div>{{ item.market_status == 'open' ? '开市' : (item.market_status == 'close' ? '闭市' : '--') }}</div>
                </div>
            </div>

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
                </div>
                <div class="chart_container" :class="{ 'fullscreen_container': fullWindow }">
                    <!-- 分时图 -->
                    <AreaChart ref="AreaChartRef" v-if="timeType == 'Time'" :showY="true" />
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
        <div class="max-width ripple_button ripple_button2 submit">
            <span>交易</span>
        </div>


        <!-- 时间选择弹窗 -->
        <Popup v-model:show="showPicker" round position="bottom">
            <div class="times_list">
                <div v-for="item in minList" :key="item" @click="chooseTime(item)" class="ripple_button item"
                    :class="{ 'active_item': currMin == item }">{{ item }}
                </div>
            </div>
        </Popup>
    </div>
</template>

<script setup>
import { Icon, Popup } from "vant"
import router from "@/router"
import { computed, ref } from "vue"
import store from "@/store";
import AreaChart from "@/components/KlineCharts/AreaChart.vue"
import KlineChart from "@/components/KlineCharts/KlineChart.vue"
import { _formatNumber } from "@/utils/index"
import { _basic, _profile } from "@/api/api"
import { getTimestr } from "@/utils/time"

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
    padding: 2.6rem 0.3rem 3.72rem 0.3rem;

    .info_header {
        height: 2.6rem;
        width: calc(100% - 0.6rem);
        border-bottom: 0.2rem solid #F9FAFB;
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        background-color: #fff;
        z-index: 100;

        .top {
            display: flex;
            height: 1.36rem;
            align-items: center;
            justify-content: space-between;

            .back {
                width: 0.4rem;
                height: 0.4rem;
                margin-right: 0.4rem;
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
                }
            }

            .search {
                width: 0.8rem;
                height: 0.8rem;
            }
        }

        .count {
            padding: 0.1rem 0;
            display: flex;

            .count_item {
                flex: 1;
                flex-shrink: 0;
                overflow: hidden;
                color: #55555E;
                font-size: 0.28rem;
                font-weight: 400;
                line-height: 0.4rem;
                white-space: nowrap;

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

    .submit {
        overflow: hidden;
        width: calc(100% - 0.6rem);
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        color: #fff;
        background-color: #014CFA;
        height: 1.12rem;
        border-radius: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.28rem;
        z-index: 100;
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
        padding: 0.4rem 0 0 0;

        .funcs {
            display: flex;
            align-items: center;

            .tab {
                color: #061023;
                font-size: 0.32rem;
                font-weight: 400;
                margin-right: 0.32rem
            }

            .active_tab {
                height: 0.72rem;
                background-color: #F6F8FF;
                border-radius: 0.48rem;
                color: #014CFA;
                padding: 0 0.6rem;
                display: flex;
                align-items: center;
            }

            .icon {
                width: 0.8rem;
                height: 0.8rem;
                margin-left: 0.2rem;
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
            height: 6.16rem;
            display: flex;
            flex-direction: column;
            overflow: hidden;

            .tabs {
                height: 0.64rem;
                margin-bottom: 0.24rem;
                display: flex;
                align-items: center;

                .tab {
                    height: 0.64rem;
                    background-color: #EFF6FF;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 0.3rem;
                    color: #0A54F9;
                    font-size: 0.28rem;
                    font-weight: 400;
                    margin-right: 0.18rem;
                    padding: 0 0.16rem;
                    min-width: 1rem;

                }

                .active_tab {
                    background-color: #014CFA;
                    color: #fff;
                }
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
                height: 100vh;
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