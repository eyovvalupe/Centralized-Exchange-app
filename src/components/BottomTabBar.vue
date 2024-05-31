<!-- 底部导航 -->
<template>
    <div class="max-width  bottom_nav">
        <div @click="handleClick(item)" class="ripple_button bottom_nav_item"
            :class="[activeRoute == item.route ? 'bottom_nav_active' : '']" v-for="(item, i) in navs" :key="i">
            <div class="bottom_nav_icon">
                <img v-if="activeRoute != item.route" :src="item.icon" :alt="item.name">
                <img v-if="activeRoute == item.route" :src="item.icon2" :alt="item.name">
            </div>

            <div class="bottom_nav_name">{{ item.name }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue"
import icon1 from "@/assets/bottom/bottom_1.png"
import icon11 from "@/assets/bottom/bottom_1_1.png"
import icon2 from "@/assets/bottom/bottom_2.png"
import icon22 from "@/assets/bottom/bottom_2_2.png"
import icon3 from "@/assets/bottom/bottom_3.png"
import icon33 from "@/assets/bottom/bottom_3_3.png"
import icon4 from "@/assets/bottom/bottom_4.png"
import icon44 from "@/assets/bottom/bottom_4_4.png"
import icon5 from "@/assets/bottom/bottom_5.png"
import icon55 from "@/assets/bottom/bottom_5_5.png"
import { useRoute } from "vue-router";
import router from "@/router"

const route = useRoute();
const activeRoute = computed(() => route.name)

const navs = ref([
    { name: '首页', route: 'home', icon: icon1, icon2: icon11 },
    { name: '市场', route: '', icon: icon2, icon2: icon22 },
    { name: '交易', route: '', icon: icon3, icon2: icon33 },
    { name: '钱包', route: '', icon: icon4, icon2: icon44 },
    { name: '用户', route: 'user', icon: icon5, icon2: icon55 },
])

const handleClick = item => {
    if (!item.route) return
    router.push({
        name: item.route
    })
}

</script>

<style scoped lang="less">
.bottom_nav {
    border-top: 1px solid #EAEEF3;
    display: flex;
    position: fixed;
    overflow: hidden;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1.4rem;
    left: 50%;
    transform: translateX(-50%);

    .bottom_nav_item {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #636468;

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
    }

    .bottom_nav_active {
        color: #014CFA;
    }
}
</style>
