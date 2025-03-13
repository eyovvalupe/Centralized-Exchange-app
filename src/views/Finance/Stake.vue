<template>
    <div class="staking_page">
        <StakingList />
    </div>
</template>
<script setup>
import StakingList from './components/StakingList.vue';

</script>
<style lang="less" scoped>
.staking_page {
    height: 100%;
    overflow-y: auto;
}
</style>