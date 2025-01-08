<!-- 跟单广场 -->
<template>
    <div class="page-my-follow">
        <Top :title="'我的跟单'"></Top>

        <!-- Tab -->
        <div class="tabs">
            <div class="tab">期权</div>
        </div>

        <!-- 统计 -->
        <div class="total">
            <div class="left">
                <div class="title">跟单总收益(USDT)</div>
                <div class="num">0.08 USDT</div>
                <div class="today">今日 <span class="num">0.00</span></div>
            </div>
            <div class="right">
                <div class="title">跟单总额</div>
                <div class="num">1.08 USDT</div>
                <div class="today">&nbsp;</div>
            </div>
        </div>

        <!-- 列表 -->
        <div class="list">
            <div class="list-i" v-for="i in 20">
                <MyFollowItem />
            </div>
        </div>
    </div>
 </template>

 <script setup>
import Top from "@/components/Top.vue";
import MyFollowItem from "../components/MyFollowItem.vue"
import router from "@/router";


const jump = name => {
    router.push({name})
}

</script>

 <style lang="less" scoped>
.page-my-follow{
    padding: 1.28rem 0.32rem 0.32rem 0.32rem;
    .tabs {
        border-bottom: 1px solid var(--ex-border-color);
        display: flex;
        .tab {
            font-size: 0.3rem;
            color: var(--ex-primary-color);
            padding: 0 0.24rem;
            position: relative;
            padding-bottom: 0.24rem;
            &::after {
                content: '';
                width: 100%;
                height: 0.06rem;
                border-radius: 0.32rem;
                background-color: var(--ex-primary-color);
                position: absolute;
                bottom: -0.03rem;
                left: 0;
            }
        }
    }

    .total {
        border-radius: 0.32rem;
        background: var(--ex-bg-color3);
        flex-shrink: 0;
        padding: 0.12rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0.32rem 0;
        padding: 0.24rem;
        color: var(--ex-white);
        line-height: 1.6;
        .left {
            flex: 1;
            text-align: left;
        }
        .right {
            text-align: left;
        }
        .num {
                color: var(--ex-primary-color);
            }
            .title {
                font-size: 0.3rem;
            }
            .today {
                font-size: 0.26rem;
                color: var(--ex-placeholder-color);
            }
    }

    .list {
        .list-i {
            margin-bottom: 0.32rem;
        }
    }
}
</style>