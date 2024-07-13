<!-- 划转记录 -->
<template>
    <div class="transfer_item">
        <div class="left">
            <div class="item_title">
                <span>{{ _accountMap[item.from] || '未知' }}</span>
                <div class="icon_box">
                    <img src="/static/img/account/to.png" alt="to">
                </div>
                <span>{{ _accountMap[item.to] || '未知' }}</span>
            </div>
            <div class="time">{{ item.created }}</div>
        </div>
        <div class="right">{{ item.amount }}</div>
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
    padding: 0.24rem 0;
    border-bottom: 1px dashed #CBCBCB;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
        .item_title {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            color: #343434;
            font-weight: 0.28rem;
            font-weight: 600;

            .icon_box {
                width: 0.4rem;
                height: 0.4rem;
                margin: 0 0.24rem;
            }
        }

        .time {
            color: #919193;
            font-weight: 400;
            font-size: 0.28rem;
            margin-top: 0.1rem;
        }
    }

    .right {
        color: #000;
        font-size: 0.32rem;
        font-weight: 700;
    }
}
</style>