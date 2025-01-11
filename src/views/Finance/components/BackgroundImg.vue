<template>
    <div class="chart_item_bg w-full absolute bottom-0">
        <div class="w-full h-auto">
            <!-- <img :src="getStaticImgUrl('/static/img/finance/chart.svg')" alt="img" /> -->
            <SparkLine :style="['width: 100%; height: 1rem;']" :points="props.points" :ytimes="2"
               />
        </div>
    </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js";
import SparkLine from "@/components/SparkLine.vue";

const props = defineProps({
    points: {
        type: String,
        default: ''
    }
})
</script>
<style lang="less">
.chart_item_bg {
    .effect {
        animation-name: animation;
        animation-duration: 1s;
        animation-timing-function: ease-in;
    }

    @keyframes animation {
        0% {
            transform: translateX(-100%);
        }

        100% {
            transform: translateX(0);
        }
    }
}
</style>