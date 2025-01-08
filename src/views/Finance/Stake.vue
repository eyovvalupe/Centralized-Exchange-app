<template>
    <div class="staking_page">
        <Tabs type="custom-card-stake">
            <Tab :title="t('质押挖矿')">
                <StakingList />
            </Tab>
            <Tab :title="t('订单')"></Tab>
        </Tabs>

    </div>
</template>
<script setup>
import { Tabs, Tab } from 'vant';
import StakingList from './components/StakingList.vue';
import { useI18n } from 'vue-i18n';

const {t} = useI18n();
</script>
<style lang="less">
.staking_page {
    padding: 0 0.32rem;
}
</style>