<!-- 登录弹窗 -->
<template>
    <div class="login_dialog" :class="{ 'login_dialog_open': isLoginOpen }">
        登录弹窗
    </div>
</template>

<script setup>
import { ref, computed } from "vue"
import store from "@/store"

const isLoginOpen = computed(() => store.state.isLoginOpen)


</script>

<style lang="less" scoped>
.login_dialog {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999;
    background-color: antiquewhite;
    width: 100%;
    height: 100%;
    transform: translateY(-100%);
    overflow: hidden;
    transition: all ease .2s;
}

.login_dialog_open {
    transform: translateY(0);
}
</style>