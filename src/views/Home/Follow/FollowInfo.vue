<!-- 带单详情 -->
<template>
    <div class="page-followinfo">
        <Top :backFunc="backFunc" :title="$t('copy.copy_order_detail_title')"></Top>
        <MyFollowItem :item="info" :stopJump="true" :showDetail="true" @cancel="backFunc" />
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue";
import MyFollowItem from "../components/MyFollowItem.vue"
import { computed } from "vue";
import store from "@/store";
import router from "../../../router";
const emits = defineEmits(['back'])

const backFunc = () => {
    emits('back')
}
const info = computed(() => store.state.copyItemDetail)

</script>

<style lang="less">
.page-followinfo {
    padding: 1.2rem 0.32rem 0.48rem 0.32rem;
}
</style>