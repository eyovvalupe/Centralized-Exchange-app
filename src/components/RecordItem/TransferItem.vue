<!-- 划转记录 -->
<template>
    <div class="transfer_item">
        <div class="item_box flex justify-between">
            <div class="flex items-center">
                <span class="item_icon"><img :src="`/static/img/crypto/${item.account_from.toUpperCase()}.png`" alt="currency"></span>
                <span>{{ _accountMap[item.account_from] || '未知' }}</span>
            </div>
            <span class="amount">{{ item.amount_from }}</span>
        </div>
        
        <div class="item_box flex justify-between">
            <div class="icon_to">
                <img src="/static/img/assets/to.png" alt="to">
            </div>
            <div class="flex items-center">
                <span class="item_icon"><img :src="`/static/img/crypto/${item.account_to.toUpperCase()}.png`" alt="currency"></span>
                <span>{{ _accountMap[item.account_to] || '未知' }}</span>
            </div>
            <span class="amount">{{ item.amountt_to }}</span>
        </div>
        <div class="time">{{ item.created }}</div>
    </div>
</template>

<script setup>
import { _accountMap } from "@/utils/dataMap"
const props = defineProps({
    item: {
        type: Object,
        default: () => { }
    }
})
</script>

<style lang="less" scoped>
.transfer_item {
    margin-top: 0.2rem;
    background-color: #F5F7FC;
    border: 1px solid #EFF3F8;
    border-radius: 0.32rem;
    overflow: hidden;
    .item_box {
        background-color: #fff;
        border: 1px solid #EFF3F8;
        align-items: center;
        padding:0.3rem 0.32rem;
        border-radius: 0.32rem;
        position: relative;
        width: calc(100% + 2px);
        left:-1px;
    }
    .item_box:first-child{
        top:-1px;
    }
    .item_box + .item_box{
        margin-top: 0.12rem;
    }
    .item_icon {
        width: 0.4rem;
        height: 0.4rem;
        margin-right: 0.12rem;
    }

    .icon_to{
        width: 0.48rem;
        position: absolute;
        left:50%;
        margin-left: -0.24rem;
        top:-0.3rem;
        height: 0.48rem;
    }
    .time {
        color: #8F92A1;
        font-weight: 400;
        font-size: 0.24rem;
        line-height: 100%;
        padding: 0.16rem 0;
        text-align: center;
    }
    .amount{
        font-size: 0.3rem;
        font-weight: 600;
    }
}
</style>