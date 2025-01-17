<template>
    <!-- 拖动 -->
    <div style="width: 100%;">
        <div class="slider-container">
            <Slider class="slider-dom" v-model="sliderValue" bar-height="0.28rem" :active-color="statusMap[status]"
                inactive-color="var(--ex-border-color)" @change="onSliderChange">
                <template #button>
                    <div class="slider-custom-num">
                        <!-- <span class="number" v-show="sliderValue">{{ Math.floor(sliderValue) }}%</span> -->
                    </div>
                </template>
            </Slider>
            <span style="font-size: 0.24rem;margin: 0 auto 0 0.24rem;">{{
                Math.floor(sliderValue) }}%</span>
        </div>
        <!-- <div class="percentages">
            <div v-for="percent in percentages" :key="percent" class="percentage">
                <div class="line"></div>
                {{ percent }}%
            </div>
        </div> -->
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
    normal: 'var(--ex-white)',
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
        width: calc(100% - 1rem);
    }




}

.percentages {
    display: flex;
    justify-content: space-between;
    z-index: 7;
    height: 0.62rem;
    align-items: center;
    margin: 0 0.2rem;
    line-height: 100%;

    .percentage {
        color: var(--ex-text-color3);
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 400;
        text-align: center;
        width: 25%;
        position: relative;
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
        background: var(--bg-color);
        z-index: 88;
    }
}
</style>