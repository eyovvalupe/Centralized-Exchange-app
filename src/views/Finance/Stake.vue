<template>
    <div class="staking_page">
        <Tabs type="custom-card-stake" @change="onChange" v-model="activeTab" :swipeable="false" animated>
            <Tab :title="t('finance.portfolio_title')" :active="activeTab == 0" :name="'0'">
                <StakingList v-if="activeTab == 0" />
            </Tab>
            <Tab class="mb-[1.2rem]" :title="t('finance.portfolio_order')" :active="activeTab == 1" :name="'1'">
                <Order v-if="token && activeTab == 1" />
                <NoData v-if="!token" />
            </Tab>
        </Tabs>
    </div>
</template>
<script setup>
import { Tabs, Tab } from 'vant';
import StakingList from './components/StakingList.vue';
import { useI18n } from 'vue-i18n';
import Order from './components/Order.vue';
import store from '@/store';
import NoData from '@/components/NoData.vue';

const { t } = useI18n();
const token = computed(() => store.state.token);


const activeTab = ref(0)

const onChange = (val) => {
    activeTab.value = val
}

</script>
<style lang="less">
.staking_page {
    height: 100%;
    overflow-y: auto;
}
</style>