<!-- 顶部菜单 -->
<template>
    <div class="max-width top">
        <div class="ripple_button back" @click="router.back()">
            <Icon name="arrow-left" />
        </div>
        <span>{{ props.title }}</span>
    </div>
</template>

<script setup>
import { defineProps } from "vue"
import { Icon } from "vant";
import router from "@/router";

const props = defineProps({
    title: { // 标题
        type: String,
        default: ''
    },
})
</script>


<style lang="less" scoped>
.top {
    top: 0;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 1.12rem;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.8rem;
    color: #121826;
    font-size: 0.36rem;
    font-weight: 400;
    text-align: center;
    line-height: 1.05;

    .back {
        position: absolute;
        left: 0.32rem;
        width: 0.4rem;
        height: 0.4rem;
    }
}
</style>
