<!-- 跟单广场 -->
 <template>
    <div class="page-follow">
        <Top :title="'跟单广场'"></Top>

        <!-- Tab -->
        <div class="tabs">
            <div class="tab">期权</div>
        </div>

        <!-- 统计 -->
        <div class="total" @click="jump('myfollow')">
            <div class="left">
                <div class="title">跟单总收益(USDT)</div>
                <div class="num">0.08 USDT</div>
                <div class="today">今日 <span class="num">0.00</span></div>
            </div>
            <div class="right">
                <img :src="getStaticImgUrl('/static/img/user/back.svg')" alt="">
            </div>
        </div>

        <!-- 列表 -->
        <div class="list">
            <div class="list-i" v-for="i in 20">
                <FollowItem :showDetail="true" />
            </div>
        </div>
    </div>
 </template>

 <script setup>
import Top from "@/components/Top.vue";
import FollowItem from "../components/FollowItem.vue"
import { getStaticImgUrl } from "@/utils/index.js"
import router from "@/router";


const jump = name => {
    router.push({name})
}

</script>

 <style lang="less" scoped>
.page-follow {
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
        justify-content: center;
        margin: 0.32rem 0;
        padding: 0.24rem;
        .left {
            color: var(--ex-white);
            line-height: 1.6;
            flex: 1;
            text-align: left;
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
        .right {
            width: 0.4rem;
            height: 0.4rem;
            transform: rotate(180deg);
        }
    }

    .list {
        .list-i {
            margin-bottom: 0.32rem;
        }
    }
}
</style>