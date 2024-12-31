<template>
    <div class="count_down" v-html="timeCode"></div>
</template>

<script setup>
import { onBeforeUnmount, computed } from 'vue'
const emit = defineEmits(['update:time'])
const props = defineProps({
    time: {
        type: Number,
        default: 0
    }
})

const timeCode = computed(() => {
    if (props.time > 0) {
        if (props.time < 3600) {
            const m = Math.floor(props.time / 60)
            const sec = props.time % 60
            return `<span class="num">00</span><span class="split">:</span><span class="num">${m >= 10 ? m : '0' + m}</span><span class="split">:</span><span class="num">${sec >= 10 ? sec : '0' + sec}</span>`
        } else {
            const h = Math.floor(props.time / 3600)
            const m = Math.floor(props.time % 3600 / 60)
            const sec = props.time % 60
            return `<span class="num">${h}</span><span class="split">:</span><span class="num">${m >= 10 ? m : '0' + m}</span><span class="split">:</span><span class="num">${sec >= 10 ? sec : '0' + sec}</span>`
        }
    }
    return '--'
})


const interval = setInterval(() => {
    if (props.time > 0) {
        emit('update:time', props.time - 1)
    }
}, 1000);

onBeforeUnmount(() => {
    clearInterval(interval)
})


</script>
<style lang="less" scoped>
.count_down {
    display: flex;
    align-items: center;
    height: 0.6rem;
    line-height: 0.58rem;
    justify-content: center;

    :deep(.num) {
        width: 0.6rem;
        height: 0.6rem;
        text-align: center;
        color: var(--ex-count-color);
        font-weight: 600;
        font-size: 0.32rem;
        border: 1px solid var(--ex-count-color);
        background-color: rgb(var(--ex-count-color-rgb) / 0.10);
        box-sizing: border-box;
        border-radius: 0.12rem;

    }

    :deep(.split) {
        font-size: 0.32rem;
        font-weight: 600;
        width: 0.3rem;
        color: var(--ex-count-color);
        text-align: center;
    }
}
</style>