<template>
    <div class="chart_item_bg w-full h-full absolute">
        <div class="w-full h-full bg-color5 effect">
            
        </div>
    </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js";

</script>
<style lang="less">
.chart_item_bg {
    .effect {
        animation-name: animation;
        animation-duration: 1s;
        animation-timing-function: ease;
        animation-fill-mode: forwards;
    }

    @keyframes animation {
        0% {
            transform: translateX(0);
        }

        100% {
            transform: translateX(102%);
        }
    }
}
</style>