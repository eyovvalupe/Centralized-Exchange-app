<!-- 借贷列表 -->
<template>
    <div class="page page-loanlist">

        <Top :title="'借贷列表'"></Top>

        <div>
            <div class="btn" @click="router.push({
                name: 'loan'
            })">去借贷</div>
        </div>

        <div class="list">
            <div class="item" v-for="i in 3" :key="i">
                <div class="left">
                    <div class="date">2024-07-11</div>
                    <div class="money">借款金额：<span>9900.00</span></div>
                </div>
                <div class="return">去还款</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import router from "@/router"
</script>

<style lang="less" scoped>
.page-loanlist {
    padding: 1.4rem 0.32rem 1.5rem 0.32rem;

    .btn {
        height: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #eee;
    }

    .list {
        .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.28rem 0;
            border-bottom: 1px solid #eee;

            .date {
                font-size: 0.24rem;
                color: #999;
                margin-bottom: 0.2rem;
                font-weight: 400;
            }

            .money {
                color: #666;
                font-weight: 400;

                span {
                    color: #000;
                    margin-left: 0.08rem;
                    font-weight: 500;
                }
            }

            .return {
                color: dodgerblue;
            }
        }
    }
}
</style>