<template>
    <div>
        <div class="order_page w-full mt-[0.32rem]" v-if="true">
            <div class="flex w-full h-[1.74rem] bg-color6 rounded-[0.32rem]">
                <div class="flex flex-col items-center justify-center w-1/2">
                    <div class="text-[0.3rem] text-color2 mb-[0.24rem]">{{ t('finance.portfolio_revenue') }}<span
                            class="text-[0.24rem] text-color2">(USDT)</span></div>
                    <div class="text-[0.4rem]">{{ Number(100000).toLocaleString() }}</div>
                </div>
                <div class="flex flex-col items-center justify-center w-1/2">
                    <div class="text-[0.3rem] text-color2 mb-[0.24rem]">{{ t('finance.portfolio_investment_amt') }}<span
                            class="text-[0.24rem] text-color2">(USDT)</span></div>
                    <div class="text-[0.4rem]">{{ Number(100000).toLocaleString() }}</div>
                </div>
            </div>
            <Tabs key="form" type="sub-stake" v-model="activeTab" :swipeable="false" :color="'var(--ex-primary-color)'"
                shrink @change="changeTab">
                <Tab :active="activeTab == 0" style="min-width: 2rem" :title="t('finance.portfolio_order_tab1')"
                    name="0">
                    <div class="h-[10rem] mt-[0.4rem]">
                        <NoData v-if="false" />
                        <OrderList :list="[1, 2]" />
                    </div>
                </Tab>
                <Tab :active="activeTab == 1" style="min-width: 2rem" :title="t('finance.portfolio_order_tab2')"
                    name="1">
                    <div class="mt-[0.4rem]">
                        <NoData />
                    </div>
                </Tab>
            </Tabs>
        </div>
        <div v-if="false" class="full flex justify-center">
            <Loading />
        </div>
    </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { Tabs, Tab, Loading } from 'vant';
import NoData from '@/components/NoData.vue';
import OrderList from './OrderList.vue';
import { ref } from 'vue';
import { _stakeOrder } from '@/api/api';

const { t } = useI18n();
const activeTab = ref(0);

const page = ref(1);

const changeTab = (e) => {
    activeTab.value = e;
    if (e == 0) getData('open');
    if (e == 1) getData('close')
}

const loading = ref(false)
const getData = (val) => {
    if (loading.value) return;
    loading.value = true;
    _stakeOrder({
        page: page.value,
        status: val
    })
    .then(res => {
        console.log("order list =========> ", res.data)
    })
    .catch(err => console.error(err))
    .finally(() => {
        loading.value = false;
    })
}

</script>
<style lang="less"></style>