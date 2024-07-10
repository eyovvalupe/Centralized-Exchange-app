<!-- 股票账户 -->
<template>
    <div class="page_assets_stock">
        <!-- 总览 -->
        <div class="overview">
            <div class="top">
                <div class="title">持仓资金</div>
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
                    <div>可借资金</div>
                    <div class="num">{{ hidden ? '****' : '232424.00' }}</div>
                </div>
            </div>
        </div>

        <!-- 列表 -->
        <div class="th">
            <div class="td td12">股票/状态</div>
            <div class="td">开仓/数量</div>
            <div class="td">现价/成本</div>
            <div class="td">盈亏/盈亏比</div>
        </div>
        <div style="padding: 0 0.32rem;">
            <StockItem v-for="i in 20" :key="i" />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { Icon } from "vant"
import StockItem from "./components/StockItem.vue"

const hidden = ref(false)

</script>

<style lang="less" scoped>
.page_assets_stock {
    padding-bottom: 1.6rem;

    .overview {
        background-size: 100% 100%;
        margin: 0 0.32rem 0.36rem 0.32rem;
        padding: 0.4rem 0.3rem 0.24rem 0.3rem;
        background-color: #3629B7;
        border-radius: 0.32rem;
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

    .th {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 0.72rem;
        color: #9EA3AE;
        font-size: 0.28rem;
        font-weight: 400;
        border-bottom: 1px solid #E8E8E8;
        padding: 0 0.32rem;
        text-align: center;

        .td {
            flex: 10;

        }

        .td12 {
            flex: 12;
            text-align: left;
        }
    }
}
</style>