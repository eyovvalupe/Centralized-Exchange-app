<template>
    <div class="staking_page">
        <Tabs type="custom-card-stake" @change="onChange" v-model="activeTab"
            style="height: calc(var(--vh) * 100 - 0.88rem);" :swipeable="false" animated>
            <Tab :title="t('finance.portfolio_title')" :active="activeTab == 0" :name="'0'">
                <div class="px-[0.1rem]">
                    <StakingList />
                </div>
            </Tab>
            <Tab class="mb-[1.2rem]" :title="t('finance.portfolio_order')" :active="activeTab == 1" :name="'1'">
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

const activeTab = ref(1)

const onChange = (val) => {
    activeTab.value = val
}

</script>
<style lang="less">
.staking_page {
    padding: 0 0.32rem;
}
</style>