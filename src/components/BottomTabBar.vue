<!-- 底部导航 -->
<template>
    <div class="max-width  bottom_nav">
        <div @touchstart="handleClick(item)" @click="handleClick(item)" class="ripple_button bottom_nav_item"
            :class="[checkActive(item) ? 'bottom_nav_active' : '']" v-for="(item, i) in navs" :key="i">
            <div class="bottom_nav_icon">
                <img v-if="!checkActive(item)" :src="item.icon" :alt="item.name">
                <img v-if="checkActive(item)" :src="item.icon2" :alt="item.name">
            </div>

            <div class="bottom_nav_name">{{ item.name }}</div>

            <!-- 角标 -->
            <div v-if="item.route == 'user'" class="nav_num">2</div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRoute } from "vue-router";
import router from "@/router"
import { _playVoice } from "@/utils/voice"

const route = useRoute();
const activeRoute = computed(() => route.name)

const navs = ref([
    { name: '首页', route: 'home', icon: '/static/img/bottom/bottom_1.png', icon2: '/static/img/bottom/bottom_1_1.png' },
    { name: '市场', route: 'market', children: ['market_info', 'financial_info', 'trading_rules'], icon: '/static/img/bottom/bottom_2.png', icon2: '/static/img/bottom/bottom_2_2.png' },
    { name: '交易', route: 'trade', icon: '/static/img/bottom/bottom_3.png', icon2: '/static/img/bottom/bottom_3_3.png' },
    { name: '钱包', route: '', icon: '/static/img/bottom/bottom_4.png', icon2: '/static/img/bottom/bottom_4_4.png' },
    { name: '用户', route: 'user', icon: '/static/img/bottom/bottom_5.png', icon2: '/static/img/bottom/bottom_5_5.png' },
])

const handleClick = item => {
    if (!item.route) return
    router.push({
        name: item.route
    })
    _playVoice()
}

const checkActive = item => {
    if (activeRoute.value == item.route || (item.children && item.children.includes(activeRoute.value))) return true
    return false
}

</script>

<style scoped lang="less">
.bottom_nav {
    border-top: 1px solid #EAEEF3;
    background-color: #fff;
    display: flex;
    position: fixed;
    overflow: hidden;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1.4rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;

    .bottom_nav_item {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #636468;
        position: relative;

        .bottom_nav_name {
            font-size: 0.24rem;
            line-height: 0.32rem;
            margin-top: 0.1rem;
        }

        .bottom_nav_icon {
            width: 0.48rem;
            height: 0.48rem;
            object-fit: contain;
        }

        .nav_num {
            width: 0.32rem;
            height: 0.32rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #FF3B30;
            font-size: 0.2rem;
            color: #fff;
            font-weight: 400;
            border-radius: 50%;
            position: absolute;
            top: 0.26rem;
            right: 0.3rem;
        }
    }

    .bottom_nav_active {
        color: #014CFA;
    }
}
</style>
