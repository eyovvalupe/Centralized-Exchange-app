<template>
    <div class="staking_page">
        <Tabs type="custom-card-stake" @change="onChange" style="height: calc(var(--vh) * 100 - 0.88rem); overflow-y: auto;" :swipeable="false" animated >
            <Tab :title="t('finance.portfolio_title')">
                <div class="px-[0.1rem]">
                    <StakingList />
                </div>
            </Tab>
            <Tab class="mb-[1.2rem]" :title="t('finance.portfolio_order')">
                <div class="px-[0.1rem]">
                    <Order />
                </div>
            </Tab>
        </Tabs>
    </div>
</template>
<script setup>
import { Tabs, Tab } from 'vant';
import StakingList from './components/StakingList.vue';
import { useI18n } from 'vue-i18n';
import Order from './components/Order.vue';

const { t } = useI18n();

const onChange = () => {

}
</script>
<style lang="less">
.staking_page {
    padding: 0 0.32rem;
}
</style>