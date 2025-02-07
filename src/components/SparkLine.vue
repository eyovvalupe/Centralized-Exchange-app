<!-- 折线图标 -->
<template>
    <div ref="root" class="stock-chart-svg_4vRMv" style="height: 100%;width: 100%;">
        <div class="hide_svg" :class="[{ 'full_svg': onShow }, {'transition': !route.path.includes('trade')}]">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" :key="color">
                <line x1="0" y1="30%" :x2="'100%'" y2="30%" stroke-dasharray="2 2"
                    :style="{ stroke: color, 'stroke-width': 1 }"></line>
                <defs>
                    <linearGradient :id="props.ratio + ''" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" :stop-color="stopStartColor"></stop>
                        <stop offset="100%" :stop-color="stopEndColor"></stop>
                    </linearGradient>
                </defs>
                <polygon :points="shadowPoints"
                    :style="`fill:url(#${Number(props.ratio)}); stroke: none; opacity: 1; width:100%`">
                </polygon>
                <polyline width="100%" height="100%" :points="newPoints"
                    :style="`fill: none; stroke: ${color}; stroke-width:1; width:100%`">
                </polyline>
            </svg>
        </div>
    </div>
</template>

<script setup>
import router from '@/router';
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const onShow = ref(false)
onMounted(() => {
    setTimeout(() => {
        scaleX.value = (root.value ? root.value.clientWidth : 70) / 70
        scaleY.value = (root.value ? root.value.clientHeight : 30) / 30
        onShow.value = true
    }, 100)
})
const root = ref()

const props = defineProps({
    points: {
        type: [Number, String],
        default: ''
    },
    polylineStrokeWidth: {
        type: Number,
        default: 1
    },
    ratio: {
        type: [Number, String],
        default: 0
    },
})

const color = computed(() => {
    if (props.ratio >= 0) {
        return 'var(--ex-up-color)'
    } else if (props.ratio < 0) {
        return 'var(--ex-down-color)'
    } else {
        return 'var(--ex-info-color)'
    }
})
const lineWidth = ref(0);
const scaleX = ref(1)
const scaleY = ref(1)
const height = ref(30)
const newPoints = computed(() =>
    props.points ? props.points.split(' ').map((val) => { const [x, y] = val.split(','); return `${parseFloat(x) * scaleX.value},${parseFloat(y) * scaleY.value}` }).join(' ') : props.points)
const shadowPoints = computed(() => {
    // 获取 polyline 的点
    const points = newPoints.value.split(' ').map(point => point.split(','));
    // 获取 SVG 的高度
    lineWidth.value = parseFloat(points[points.length - 1][0]) - parseFloat(points[0][0]);
    // 构建 shadowPoints，多边形覆盖 polyline 并扩展到底部
    const shadowPoints = points.map(p => p.join(',')).join(' ') + ` ${points[points.length - 1][0]},${height.value * scaleY.value} ${points[0][0]},${height.value * scaleY.value}`;
    return shadowPoints;
})

const stopStartColor = computed(() => {
    if (props.ratio >= 0) {
        return 'rgb(var(--ex-up-color-rgb) / 0.5)'
    } else if (props.ratio < 0) {
        return 'rgb(var(--ex-down-color-rgb) / 0.5)'
    } else {
        return 'rgb(var(--ex-info-color-rgb) / 0.5)'
    }
})
const stopEndColor = computed(() => {
    if (props.ratio > 0) {
        return 'rgb(var(--ex-up-color-rgb) / 0)'
    } else if (props.ratio < 0) {
        return 'rgb(var(--ex-down-color-rgb) / 0)'
    } else {
        return 'rgb(var(--ex-info-color-rgb) / 0)'
    }
})
</script>

<style lang="less" scoped>
.hide_svg {
    width: 0%;
    height: 100%;
}

.transition {
    transition: all linear 0.6s;
}

.full_svg {
    width: 100%;
}
</style>