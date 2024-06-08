<!-- banner -->
<template>
    <div>
        <Swipe v-if="!isFixed" class="banner_box" lazy-render :initial-swipe="currIndex" :autoplay="3000" loop
            indicator-color="white" @change="onChange">
            <SwipeItem v-for="(item, i) in banners" :key="i">
                <div class="banner_item">{{ i }}</div>
            </SwipeItem>
            <template #indicator="{ active, total }">
                <div class="custom-indicator">
                    <div v-for="i in total" :key="i" class="indicator" :class="{ 'active_indicator': active == i - 1 }">
                    </div>
                </div>
            </template>
        </Swipe>

        <div v-if="isFixed" style="height: 7.4rem;"></div>
    </div>
</template>

<script setup>
import { Swipe, SwipeItem } from 'vant';
import { ref, onMounted, defineProps } from "vue"

const props = defineProps({
    isFixed: { // 为True的时候 展示为虚拟dom
        type: Boolean,
        default: false
    }
})

const banners = ref([{}, {}, {}])

const currIndex = ref(banners.value.length - 1)
const onChange = key => {
    setTimeout(() => {
        currIndex.value = key
    }, 500)
}
onMounted(() => {
    onChange(0)
})
</script>

<style lang="less" scoped>
.banner_box {

    .banner_item {
        height: 7.4rem;
        background: linear-gradient(202.14deg, #0F2CE0 6.53%, #3854f4 85.54%);
        color: #fff;
    }

    .custom-indicator {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0.4rem;
        display: flex;

        .indicator {
            border-radius: 0.26rem;
            width: 0.14rem;
            height: 0.08rem;
            background-color: #D2D2D2;
            margin: 0 0.08rem;
        }

        .active_indicator {
            width: 0.4rem;
            background-color: #0063F5;
        }
    }
}
</style>