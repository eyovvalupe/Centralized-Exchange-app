<!-- 自选买卖 -->
<template>
    <div class="page-deal">
        <Top :title="title" />

        <!-- 买入 -->
        <div class="form">
            <!-- 信息 -->
            <div></div>
        </div>

        <!-- 卖出 -->
        <div class="form">
            <!-- 信息 -->
            <div></div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import Top from "@/components/Top.vue"
import { useRoute } from "vue-router"

const route = useRoute()
const title = ref(route.query.offset == 'buy' ? '买入' : '卖出')
</script>

<style lang="less" scoped>
.page-deal {
    padding-top: 1.12rem;

    .form {
        padding: 0 0.32rem 0.32rem 0.32rem;
    }
}
</style>