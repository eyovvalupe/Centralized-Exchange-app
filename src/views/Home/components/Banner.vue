<!-- banner -->
<template>
    <Swipe class="banner_box" lazy-render :initial-swipe="currIndex" :autoplay="3000" loop indicator-color="white"
        @change="onChange">
        <SwipeItem v-for="(item, i) in banners" :key="i">
            <div class="banner_items">
                <div class="banner_item">
                    <RecommendItem :item="itemData" />
                </div>
                <div class="banner_item">
                    <RecommendItem :item="itemData" />
                </div>
                <div class="banner_item">
                    <RecommendItem :item="itemData" />
                </div>
            </div>
        </SwipeItem>
        <template #indicator="{ active, total }">
            <div class="custom-indicator">
                <div v-for="i in total" :key="i" class="indicator" :class="{ 'active_indicator': active == i - 1 }">
                </div>
            </div>
        </template>
    </Swipe>
</template>

<script setup>
import { Swipe, SwipeItem } from 'vant';
import { ref, onMounted } from "vue"
import RecommendItem from "./RecommendItem.vue"

const itemData = ref({ "market": "NSE", "symbol": "CHENNPETRO", "name": "CHENNAI PETRO CP", "ratio": "+12.01%" })
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

    .banner_items {
        height: 1.9rem;
        padding: 0 0.32rem;
        color: #fff;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;

        .banner_item {
            height: 1.5rem;
            width: 32%;
        }
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