<!-- 跟单详情 -->
<template>
    <div class="page-follow-detail">

        <Top :title="'跟单详情'"></Top>

        <!-- Tab -->
        <div class="tabs">
            <div class="tab" @click="tab = item.val" :class="{ 'active_tab': item.val == tab }" v-for="(item, i) in tabs"
                :key="i">{{ item.name }}</div>
        </div>


        <div class="content">

            <!-- 带单表现 -->
            <template v-if="tab == 1">
                <!-- 收益周表现 -->
                <div class="recommend-title" style="margin-top: 0.32rem;">
                    <div class="point">
                        <img :src="getStaticImgUrl('/static/home2/point.svg')" alt="">
                    </div>
                    <div style="flex: 1;">收益周表现</div>
                    <div class="subtitle">
                        按收益金额
                    </div>
                </div>
                <div class="canvas-box"></div>

                <!-- 报酬率 -->
                <div class="recommend-title">
                    <div class="point">
                        <img :src="getStaticImgUrl('/static/home2/point.svg')" alt="">
                    </div>
                    <div style="flex: 1;">报酬率</div>
                    <div class="subtitle">
                        按收益率
                    </div>
                </div>
                <div class="canvas-box"></div>

                <!-- 带单情况 -->
                <div class="recommend-title">
                    <div class="point">
                        <img :src="getStaticImgUrl('/static/home2/point.svg')" alt="">
                    </div>
                    <div style="flex: 1;">带单情况</div>
                    <div class="subtitle"></div>
                </div>
                <div class="info-bar-box">
                    <div class="info-bar">
                        <div class="inner-bar"></div>
                    </div>
                    <div class="bar-texts">
                        <div class="bar-text">
                            <span class="name">获利天数</span>
                            <span class="up">69</span>
                        </div>
                        <div class="bar-text">
                            <span class="name">亏损天数</span>
                            <span class="down">24</span>
                        </div>
                    </div>
                </div>
                <div class="info-box">
                    <div class="info-item">
                        <div class="name">获胜</div>
                        <div class="val">92</div>
                    </div>
                    <div class="info-item">
                        <div class="name">盈亏比</div>
                        <div class="val">41</div>
                    </div>
                    <div class="info-item">
                        <div class="name">平均订单价值</div>
                        <div class="val">4231231</div>
                    </div>
                </div>


                <!-- 附单员总览 -->
                <div class="recommend-title">
                    <div class="point">
                        <img :src="getStaticImgUrl('/static/home2/point.svg')" alt="">
                    </div>
                    <div style="flex: 1;">附单员总览</div>
                    <div class="subtitle"></div>
                </div>
                <div class="info-box">
                    <div class="info-item">
                        <div class="name">带单天数</div>
                        <div class="val">92</div>
                    </div>
                    <div class="info-item">
                        <div class="name">交易员带单资产(USDT)</div>
                        <div class="val">12313</div>
                    </div>
                    <div class="info-item">
                        <div class="name">带单规模</div>
                        <div class="val">12313</div>
                    </div>
                    <div class="info-item">
                        <div class="name">目前跟单用户收益(USDT)</div>
                        <div class="val">12313</div>
                    </div>
                    <div class="info-item">
                        <div class="name">跟单人数</div>
                        <div class="val">12313</div>
                    </div>
                    <div class="info-item">
                        <div class="name">分润比例</div>
                        <div class="val">12313</div>
                    </div>
                </div>

                <!-- 跟单用户 -->
                <div class="recommend-title">
                    <div class="point">
                        <img :src="getStaticImgUrl('/static/home2/point.svg')" alt="">
                    </div>
                    <div style="flex: 1;">跟单用户</div>
                    <div class="subtitle"></div>
                </div>
                <div class="info-box">
                    <div class="info-item">
                        <div class="name">累计跟单用户</div>
                        <div class="val">92</div>
                    </div>
                    <div class="info-item">
                        <div class="name">近7日人数变化</div>
                        <div class="val">41(+44.57%)</div>
                    </div>
                </div>
            </template>

            <template v-else>
                <NoData />
            </template>
        </div>

        <div class="bot">
            <div class="bot-btn">跟单</div>
        </div>
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue";
import { getStaticImgUrl } from "@/utils/index.js"
import { ref } from "vue"
import NoData from "@/components/NoData"

const tab = ref(1)
const tabs = ref([
    { name: '带单表现', val: 1 },
    { name: '目前带单', val: 2 },
    { name: '历史带单', val: 3 },
    { name: '跟单者', val: 4 },
])

</script>

<style lang="less" scoped>
.page-follow-detail {
    padding: 1.28rem 0.32rem 0.32rem 0.32rem;

    display: flex;
    height: 100%;
    flex-direction: column;
    overflow: hidden;
    .content {
        flex: 1;
        overflow-y: auto;
    }
    .bot {
        padding: 0.2rem 0 ;
        .bot-btn {
            height: 0.96rem;
            border-radius: 0.12rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--ex-white);
            background-color: var(--ex-primary-color);
            font-size: 0.3rem;
        }
    }

    .tabs {
        border-bottom: 1px solid var(--ex-border-color);
        display: flex;

        .tab {
            font-size: 0.3rem;
            padding: 0 0.24rem;
            position: relative;
            padding-bottom: 0.24rem;
            color: var(--ex-placeholder-color);
            transition: all ease .3s;

            &::after {
                content: '';
                width: 0%;
                height: 0.06rem;
                border-radius: 0.32rem;
                background-color: var(--ex-primary-color);
                position: absolute;
                bottom: -0.03rem;
                left: 50%;
                transition: all ease .3s;
                transform: translateX(-50%);
            }
        }

        .active_tab {
            color: var(--ex-primary-color);

            &::after {
                width: 1rem;
            }

        }
    }

    .recommend-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--ex-white);
        font-size: 0.28rem;
        font-weight: 500;
        margin-bottom: 0.32rem;

        .point {
            width: 0.28rem;
            height: 0.28rem;
            margin-right: 0.2rem;
        }

        .subtitle {
            color: var(--ex-info-color);
            font-size: 0.24rem;
        }
    }

    .info-bar-box {
        margin-bottom: 0.16rem;
        padding: 0.12rem;

        .info-bar {
            height: 0.2rem;
            border-radius: 0.08rem;
            background-color: var(--ex-down-color);
            position: relative;
            margin-bottom: 0.12rem;

            .inner-bar {
                height: 100%;
                border-radius: 0.08rem;
                background-color: var(--ex-up-color);
                width: 70%;
            }
        }

        .bar-texts {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .bar-text {
                font-size: 0.28rem;

                .name {
                    font-size: 0.24rem;
                    color: var(--ex-placeholder-color);
                    margin-right: 0.08rem;
                }
            }
        }
    }

    .info-box {
        width: 100%;
        border-radius: 0.32rem;
        background-color: var(--ex-bg-color3);
        padding: 0.28rem;
        margin-bottom: 0.32rem;

        .info-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 0.52rem;

            .name {
                color: var(--ex-placeholder-color);
            }

            .val {
                display: flex;
                align-items: center;
            }
        }
    }

    .canvas-box {
        margin-bottom: 0.32rem;
        background-color: var(--ex-black);
        height: 4rem;
    }
}
</style>