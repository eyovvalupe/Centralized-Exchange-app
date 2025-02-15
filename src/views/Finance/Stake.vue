<template>
    <div class="staking_page">
        <Tabs type="custom-card-stake" @change="onChange" v-model="activeTab"
            style="height: calc(var(--vh) * 100 - 0.88rem);" :swipeable="false" animated>
            <Tab :title="t('finance.portfolio_title')" :active="activeTab == 0" :name="'0'">
                <StakingList />
            </Tab>
            <Tab class="mb-[1.2rem]" :title="t('finance.portfolio_order')" :active="activeTab == 1" :name="'1'">
                    <Order v-if="token"/>
                    <NoData v-if="!token"/>
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

</style>