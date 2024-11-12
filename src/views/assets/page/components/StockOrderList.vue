<template>
    <div class="stock_order_list">
        <div class="stock_order_tabs">
            <span class="stock_order_tab mr-[0.6rem]">当前持仓</span>
            <span class="stock_order_tab">历史查询</span>
        </div>
    </div>
</template>
<script setup></script>
<style lang="less">
.stock_order_list {
    .stock_order_tabs {
        width: 100%;
        height: 0.52rem;
        border-bottom: 0.02rem solid #eff3f8;

        .stock_order_tab {
            font-size: 0.24rem;
            color: #666d80;
        }
    }
}
</style>