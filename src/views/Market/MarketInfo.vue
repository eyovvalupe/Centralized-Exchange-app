<!-- 市场详情 -->
<template>
    <div class="page page_marketinfo">
        <!-- 头部 -->
        <div class="info_header">
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
                <div class="count_item">
                    <div style="margin-bottom: 0.1rem;">
                        <span>开</span>
                        <span class="num">{{ item.open || '--' }}</span>
                    </div>
                    <div>
                        <span>闭</span>
                        <span class="num">{{ item.close || '--' }}</span>
                    </div>
                </div>
                <div class="count_item">
                    <div style="margin-bottom: 0.1rem;">
                        <span>高</span>
                        <span class="num">{{ item.high || '--' }}</span>
                    </div>
                    <div>
                        <span>低</span>
                        <span class="num">{{ item.low || '--' }}</span>
                    </div>
                </div>
                <div class="count_item">
                    <div style="margin-bottom: 0.1rem;">
                        <span>量</span>
                        <span class="num">{{ _formatNumber(item.amount) || '--' }}</span>
                    </div>
                    <div>
                        <span>换</span>
                        <span class="num">{{ item.ratio ? `${(item.ratio * 100).toFixed(2)}%` : '--' }}</span>
                    </div>
                </div>
                <div class="count_item">
                    <div style="margin-bottom: 0.1rem;">
                        <span>市盈</span>
                        <span class="num">--</span>
                    </div>
                    <div>
                        <span>市值</span>
                        <span class="num">--</span>
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
                <div class="icon fullscreen">
                    <img src="/static/img/market/fullscreen.png" alt="fullscreen">
                </div>
                <div class="icon star">
                    <img src="/static/img/market/stared.png" alt="⭐">
                </div>
            </div>

            <!-- 详情 -->
            <div class="info">
                <div class="left">
                    <div class="price">40.23</div>
                    <div class="time">
                        Update time <span>07:30:15</span>
                    </div>
                </div>
                <div class="mid">
                    <div>0.00555</div>
                    <div>+0.28％</div>
                </div>
                <div class="right">
                    <b>BSC</b>
                    <div>闭市</div>
                </div>
            </div>

            <!-- 图表 -->
            <div class="chart_box">
                <div class="tabs"></div>
                <div class="chart_container">
                    <AreaChart :showY="true" />
                </div>
            </div>
        </div>


        <!-- 交易按钮 -->
        <div class="ripple_button ripple_button2 submit">
            <span>交易</span>
        </div>
    </div>
</template>

<script setup>
import { Icon } from "vant"
import router from "@/router"
import { computed } from "vue"
import store from "@/store";
import AreaChart from "@/components/KlineCharts/AreaChart.vue"
import { _formatNumber } from "@/utils/index"


const item = computed(() => store.state.currStock || {})

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
                    margin-left: 0.2rem
                }
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
                    color: #18B762;
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
                color: #18B762;
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
            }

            .chart_container {
                flex: 1;
            }
        }

    }
}
</style>