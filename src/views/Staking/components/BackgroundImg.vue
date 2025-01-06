<template>
    <div class="chart_item_bg w-full absolute">
        <div class="w-full h-auto relative top-[2rem]">
            <img :src="getStaticImgUrl('/static/img/staking/chart.png')" alt="img" />
        </div>
        <div class="">
        </div>
    </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js";

</script>
<style lang="less">
.chart_item_bg {
    
}
</style>