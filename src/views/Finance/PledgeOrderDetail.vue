<template>
    <div class="pledge_order_detail">
        <Top :title="'订单详情'">
        </Top>
        <div class="">
            
        </div>

    </div>
</template>

<script setup>
import Top from "@/components/Top.vue";
import { Tabs,Tab } from 'vant';
const active = ref(1)
const onChange = () => {

}
</script>

<style lang="less">
.pledge_page {
    padding: 0 0.32rem;
}
</style>