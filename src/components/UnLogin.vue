<!-- 未登录 -->
<template>
    <div class="unlogin_box">
        <NoData :tip="''" />
        <div class="unlogin" @click="goLogin">
            <span>还未登录账号？</span>
            <span class="link">马上登录</span>
        </div>
    </div>
</template>

<script setup>
import NoData from './NoData.vue';
import router from "@/router"
import { useRoute } from "vue-router"

const route = useRoute()

const goLogin = () => {
    // router.push({
    //     name: 'login',
    //     query: {
    //         reurl: route.name
    //     }
    // })
    store.commit('setIsLoginOpen', true)
}
</script>

<style lang="less" scoped>
.unlogin_box {
    .unlogin {
        text-align: center;
        color: #A5AFBA;
        position: relative;
        top: -1rem;

        .link {
            color: #014cfa;
        }
    }
}
</style>