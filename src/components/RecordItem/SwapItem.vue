<!-- 兑换记录 -->
<template>
    <div class="swap_item">
        <div class="time">{{ item.created }}</div>
        <div class="item_title">
            <div class="item_label">
                <div class="currency_icon" v-if="item.from">
                    <img v-lazy="getStaticImgUrl(`/static/img/crypto/${item.from.toUpperCase()}.svg`)"
                        :alt="item.from.toUpperCase()">
                </div>
                <div class="item_name">
                    <span v-if="item.from">{{ item.from.toUpperCase() }}</span>
                    <div>{{ item.amount_from }}</div>
                </div>
            </div>


            <div class="icon_box">
                <img v-lazy="getStaticImgUrl('/static/img/account/to.svg')" alt="to">
            </div>

            <div class="item_label">
                <div class="currency_icon" v-if="item.to">
                    <img v-lazy="getStaticImgUrl(`/static/img/crypto/${item.to.toUpperCase()}.svg`)"
                        :alt="item.from.toUpperCase()">
                </div>
                <div class="item_name">
                    <span v-if="item.to">{{ item.to.toUpperCase() }}</span>
                    <div>{{ item.amount_to }}</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { _accountMap } from "@/utils/dataMap"
const props = defineProps({
    item: {
        type: Object,
        default: () => { }
    }
})
</script>

<style lang="less" scoped>
.swap_item {
    padding: 0.24rem 0;
    border-bottom: 1px dashed var(--ex-border-color2);

    .item_title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--ex-text-color);
        font-weight: 0.28rem;
        font-weight: 600;

        .item_label {
            display: flex;
            align-items: center;
        }

        .icon_box {
            width: 0.4rem;
            height: 0.4rem;
            margin: 0 0.24rem;
        }

        .item_name {
            margin: 0 0.1rem 0 0.2rem;
            line-height: 0.32rem;
        }

        .currency_icon {
            width: 0.48rem;
            height: 0.48rem;
        }
    }

    .time {
        color: var(--ex-text-color3);
        font-weight: 400;
        font-size: 0.28rem;
        margin-bottom: 0.1rem;
    }
}
</style>