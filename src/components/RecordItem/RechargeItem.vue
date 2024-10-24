<!-- 充值记录-元素 -->
<template>
    <div class="recgarge_item" @click="goInfo">
        <div class="icon_box">
            <img :src="`/static/img/crypto/${item.currency.toUpperCase()}.png`" alt="currency">
        </div>
        <div class="content">
            <div class="item_title">{{ item.currency }}</div>
            <!-- <div class="address">{{ item.address }}</div> -->
            <div class="time">{{ item.date ? (item.date.split(' ')[1] || item.date) : '--' }}</div>
        </div>
        <div class="right">
            <div class="amount">{{ item.amount }}</div>
            <div class="status" :class="['status_' + item.status]">{{ _topUpStatusMap[item.status] || '未知' }}</div>
        </div>
    </div>
</template>

<script setup>
import router from "@/router"
import { _topUpStatusMap } from "@/utils/dataMap"

const props = defineProps({
    item: {
        type: Object,
        default: () => { }
    }
})

const emits = defineEmits(['close'])
const goInfo = () => {
    emits('close')
    if (props.item.status == 'success' || props.item.status == 'failure') {
        router.push({
            name: 'rechargeInfo',
            query: {
                order_no: props.item.order_no
            }
        })
    } else {
        router.push({
            name: 'recharging',
            query: {
                order_no: props.item.order_no
            }
        })
    }
}
</script>

<style lang="less" scoped>
.recgarge_item {
    display: flex;
    justify-content: space-between;
    padding: 0.3rem 0.32rem;
    border: 1px solid #D0D8E2;
    border-radius: 0.32rem;
    margin-top: 0.2rem;
    .icon_box {
        width: 0.84rem;
        height: 0.84rem;
    }

    .content {
        padding: 0 0.16rem;
        flex: 1;
        display: flex;
        flex-direction: column;

        .item_title {
            color: #061023;
            font-size: 0.3rem;
            font-weight: 400;
            line-height: 0.3rem;
        }

        .address {
            color: #121212;
            font-weight: 400;
            font-size: 0.28rem;
        }

        .time {
            color: #8F92A1;
            font-size: 0.24rem;
            font-weight: 400;
            line-height: 0.24rem;
            margin-top: 0.2rem
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