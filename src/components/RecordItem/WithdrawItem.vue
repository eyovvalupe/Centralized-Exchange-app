<!-- 提现记录-元素 -->
<template>
    <div class="withdraw_item" @click="goInfo">
        <div class="icon_box">
            <img v-if="item.account && item.account.symbol" :src="`/static/img/crypto/${item.account.symbol}.png`" alt="img">
            <img v-else src="/static/img/crypto/MAIN.png" alt="img">
        </div>
        <div class="content">
            <div class="address">{{ item.account && item.account.address ? getAddress(item.account.address) : getAddress(item.bank_card_number) }}</div>
            <div class="item_title">{{ item.account && item.account.symbol ? item.account.symbol : item.bank_name }}</div>
            <div class="time">{{ item.date }}</div>
        </div>
        <div class="right">
            <div class="amount">{{ item.amount }}</div>
            <div class="status" :class="['status_' + item.status]">{{ _withdrawStatusMap[item.status] || '未知' }}</div>
        </div>
    </div>
</template>

<script setup>
import router from "@/router"
import { _withdrawStatusMap } from "@/utils/dataMap"
const props = defineProps({
    item: {
        type: Object,
        default: () => { }
    }
})

const emits = defineEmits(['close'])
const goInfo = () => {
    emits('close')
    router.push({
        name: 'withdrawInfo',
        query: {
            order_no: props.item.order_no
        }
    })
}
const getAddress = (address)=>{
    if(!address){
        return '--'
    }
    return '**** **** **** '+address.substr(address.length-4)
}
</script>

<style lang="less" scoped>
.withdraw_item {
    display: flex;
    justify-content: space-between;
    padding: 0.3rem 0.32rem;
    border: 1px solid #D0D8E2;
    border-radius: 0.32rem;
    margin-top: 0.2rem;
    .icon_box {
        width: 0.8rem;
        height: 0.8rem;
    }

    .content {
        padding: 0 0.2rem;
        flex: 1;
        display: flex;
        flex-direction: column;

        .address {
            color: #061023;
            font-size: 0.3rem;
            font-weight: 400;
            line-height: 0.3rem;
        }

        .item_title {
            color: #121212;
            font-weight: 400;
            margin-top: 0.08rem;
            font-size: 0.28rem;
        }

        .time {
            color: #8F92A1;
            font-size: 0.24rem;
            font-weight: 400;
            line-height: 0.24rem;
            margin-top: 0.28rem
        }
    }

    .right {
        height: 100%;
        text-align: right;
        line-height: 0.3rem;
        .amount {
            font-size: 0.3rem;
            color: #000000;
            font-weight: 600;
        }

        .status {
            font-size: 0.28rem;
            color:#014CFA;
            margin-top: 0.14rem;
        }

        .status_success {
            color: #18B762;
        }

        .status_failed {
            color: #8F92A1;
        }
    }
}
</style>