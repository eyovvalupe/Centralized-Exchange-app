<!-- loading 组件封装 -->
<template>
    <Loading class="loading_dom" :size="props.size" type="spinner" v-show="props.loading" />
</template>

<script setup>
import { Loading } from 'vant';
const props = defineProps({
    loading: false,
    size: 48
})
</script>

<style scoped>
.loading_dom {
    margin: 40px auto;
    text-align: center;
}
</style>