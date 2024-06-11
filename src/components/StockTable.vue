<!-- 股票列表样式架子 -->
<template>
    <div class="stock_table">
        <!-- <div class="tr th">
            <div class="td td5">名称</div>
            <div class="td td2">行情</div>
            <div class="td td2 td_r">涨跌幅</div>
        </div> -->
        <Loading v-show="!props.list.length && props.loading" />
        <div class="tr" v-for="(item, i) in props.list" :key="i">
            <StockItem :deleteItem="props.deleteItem" @remove="remove" :scrollBox="props.scrollBox" :item="item" />
        </div>
        <NoData v-if="!props.loading && !props.list.length" />
    </div>
</template>

<script setup>
import { defineEmits } from "vue"
import Loading from "./Loaidng.vue"
import StockItem from "./StockItem.vue"
import NoData from "./NoData.vue"

const emits = defineEmits(['remove'])
const props = defineProps({
    loading: {
        type: Boolean,
        default: true,
    },
    list: {
        type: Array,
        default: () => [],
    },
    scrollBox: {
        type: String,
        default: '.page'
    },
    deleteItem: { // 是否可以滑动删除
        type: Boolean,
        default: false
    }
})

const remove = item => {
    emits('remove', item)
}
</script>


<style lang="less" scoped>
.stock_table {
    padding: 0;
    width: 100%;

    .tr {
        display: flex;
        align-items: center;

        .td {
            flex: 1;
        }

        .td5 {
            flex: 5;
        }

        .td2 {
            flex: 2;
        }
    }

    .th {
        padding: 0 0.3rem 0.16rem 0.3rem;
        height: 0.64rem;
        color: #9EA3AE;
        font-size: 0.28rem;
        font-weight: 400;
        // border-bottom: 1px solid #E8E8E8;

        .td_r {
            text-align: right;
        }
    }
}
</style>