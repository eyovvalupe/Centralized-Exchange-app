<template>
    <!-- 拖动 -->
    <div style="width: 100%;">
        <div class="slider-container" :class="['slider-container--'+status]">
            <Slider class="slider-dom" v-model="sliderValue" bar-height="0.28rem" :active-color="statusMap[status]"
                inactive-color="var(--ex-bg-white2)" @change="onSliderChange">
                <template #button>
                    <div class="slider-custom-num">
                        <!-- <span class="number" v-show="sliderValue">{{ Math.floor(sliderValue) }}%</span> -->
                    </div>
                </template>
            </Slider>
        </div>
        <div class="percentages">
            <div  class="percentage">
                0%
            </div>
            <div v-for="percent in percentages" :key="percent" class="percentage">
                {{ percent }}%
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { Slider } from 'vant'

const emit = defineEmits(['update:modelValue', 'change'])
const props = defineProps({
    modelValue: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'normal'
    }
})

const percentages = [25, 50, 75, 100];
const sliderValue = ref(props.modelValue);

const statusMap = ref({
    normal: 'var(--ex-primary-color)',
    success: 'var(--ex-success-color)',
    error: 'var(--ex-error-color)'
})

watch(() => props.modelValue, (newValue) => {
    if (newValue != sliderValue) {
        sliderValue.value = newValue
    }
})

const onSliderChange = (newValue) => {
    emit('update:modelValue', newValue)
    emit('change', newValue)
}


</script>
<style lang="less" scoped>
.slider-container {
    // margin: 0 0.2rem;
    line-height: 100%;
    display: flex;
    align-items: center;

    .slider-dom {
        // width: calc(100% - 1rem);
    }

}
.slider-container--error{
    :deep(.slider-custom-num) {
        background: var(--ex-error-color) !important;
    }
}
.slider-container--success{
    :deep(.slider-custom-num) {
        background: var(--ex-success-color) !important;
    }
}
.percentages {
    display: flex;
    justify-content: space-between;
    z-index: 7;
    height: 0.62rem;
    align-items: center;
    // margin: 0 0.2rem;
    line-height: 100%;

    .percentage {
        color: var(--ex-text-color3);
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 400;
        text-align: center;
        width: 25%;
        position: relative;
        &:first-child {
            text-align: left;
        }
        &:nth-child(2) {
            padding-right: 10%;
        }
        &:nth-child(4) {
            padding-left: 10%;
        }
        &:last-child {
            text-align: right;
        }
    }

    .percentage:last-child .line {
        display: none;
    }

    .line {
        width: 0.07rem;
        height: 0.28rem;
        position: absolute;
        right: -0.03rem;
        top: -0.44rem;
        background: #26272f;
        z-index: 88;
    }
}
</style>