<!-- 现金账户 -->
<template>
    <div class="page_assets_cash">
        <!-- 总览 -->
        <div class="overview" :style="{ backgroundImage: `url(/static/img/assets/one.png)` }">
            <div class="top">
                <div class="title">总资金</div>
                <div class="eyes" @click="hidden = !hidden">
                    <Icon v-show="!hidden" name="eye-o" />
                    <Icon v-show="hidden" name="closed-eye" />
                </div>
            </div>
            <div class="money">
                <span>{{ hidden ? '****' : '43534535.00' }}</span>
            </div>
            <div class="navs">
                <div class="nav">
                    <div>借贷</div>
                    <div class="num">{{ hidden ? '***' : '232424.00' }}</div>
                </div>
                <div class="line"></div>
                <div class="nav">
                    <div>冻结</div>
                    <div class="num">{{ hidden ? '****' : '232424.00' }}</div>
                </div>
            </div>
        </div>

        <!-- 内容 -->
        <Tabs class="cash_tabs" @change="changeTab" v-model:active="activeTab" :swipeable="false" animated
            :color="'#014CFA'" shrink>
            <Tab :title="'余额'">
                <div class="cash_tab_content">
                    <div class="cash_tab_item" v-for="i in 20" :key="i">
                        <span>美元</span>
                        <span>23,213.00</span>
                    </div>
                </div>
            </Tab>
            <Tab :title="'充值记录'">
                <div class="cash_tab_content">
                    <RechargeItem v-for="i in 20" :key="i" />
                </div>
            </Tab>
            <Tab :title="'提现记录'">
                <div class="cash_tab_content">
                    <WithdrawItem v-for="i in 20" :key="i" />
                </div>
            </Tab>
        </Tabs>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { Icon, Tabs, Tab } from "vant"
import RechargeItem from "./components/RechargeItem"
import WithdrawItem from "./components/WithdrawItem"

const hidden = ref(false)

const activeTab = ref(0)
const changeTab = val => {
    console.error(val)
}
</script>

<style lang="less" scoped>
.page_assets_cash {
    .overview {
        background-size: 100% 100%;
        margin: 0.2rem 0.32rem 0.24rem 0.32rem;
        padding: 0.4rem 0.3rem 0.24rem 0.3rem;

        .top {

            font-size: 0.28rem;
            font-weight: 400;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            .title {
                color: #fff;
                margin-right: 0.32rem;
            }

            .eyes {
                width: 0.32rem;
                height: 0.32rem;
                color: #fff;
                font-size: 0.32rem;
            }

        }

        .money {
            font-size: 0.68rem;
            font-weight: 500;
            color: #fff;
            margin-top: 0.3rem;
            margin-bottom: 0.25rem;
        }

        .navs {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            line-height: 0.44rem;

            .line {
                width: 1px;
                height: 0.44rem;
                background-color: rgba(255, 255, 255, 0.4);
            }

            .nav {
                color: #fff;
                font-weight: 400;
                font-size: 0.24rem;
                text-align: center;
                flex: 1;
            }
        }
    }

    .cash_tab_content {
        padding: 0 0.32rem 0.32rem 0.32rem;

        .cash_tab_item {
            height: 1.2rem;
            border-bottom: 1px solid #EAEAEA;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }

    .cash_tabs {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        :deep(.van-tabs__wrap) {
            padding: 0 0.32rem !important;
        }

        :deep(.van-tabs__nav) {
            position: relative;
            height: 1rem;

            &::after {
                content: '';
                width: 100%;
                height: 1px;
                background-color: #3B82F6;
                position: absolute;
                bottom: 16px;
                left: 0;
                opacity: 0.3;
            }
        }

        :deep(.van-tab) {
            margin-left: 0.36rem;
        }

        :deep(.van-tabs__content) {
            flex: 1;

            .van-swipe-item {
                overflow-y: auto;
                padding-bottom: 0.2rem;
            }
        }
    }
}
</style>