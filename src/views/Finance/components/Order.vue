<template>
    <div>
        <div class="order_page w-full mt-[0.32rem]" v-if="!earnLoading && !isEmpty(myEarn)">
            <div class="flex w-full h-[1.74rem] bg-color6 rounded-[0.32rem]">
                <div class="flex flex-col items-center justify-center w-1/2">
                    <div class="text-[0.3rem] text-color2 mb-[0.24rem]">{{ t('finance.portfolio_revenue') }}<span
                            class="text-[0.24rem] text-color2">(USDT)</span></div>
                    <div class="text-[0.4rem]">{{ Number(myEarn.earn).toLocaleString() }}</div>
                </div>
                <div class="flex flex-col items-center justify-center w-1/2">
                    <div class="text-[0.3rem] text-color2 mb-[0.24rem]">{{ t('finance.portfolio_investment_amt') }}<span
                            class="text-[0.24rem] text-color2">(USDT)</span></div>
                    <div class="text-[0.4rem]">{{ Number(myEarn.amount).toLocaleString() }}</div>
                </div>
            </div>
            <Tabs key="form" type="sub-stake" v-model="activeTab" :swipeable="false" :color="'var(--ex-primary-color)'"
                shrink @change="changeTab">
                <Tab :active="activeTab == 0" style="min-width: 2rem" :title="t('finance.portfolio_order_tab1')"
                    name="0">
                    <div class="h-[9.2rem] mt-[0.4rem] overflow-auto" v-if="!loading">
                        <NoData v-if="!orderList.length" />
                        <OrderList :list="orderList" :type="'position'" />
                    </div>
                    <div v-if="loading" class="w-full h-[3rem] flex items-center justify-center">
                        <Loading />
                    </div>
                </Tab>
                <Tab :active="activeTab == 1" style="min-width: 2rem" :title="t('finance.portfolio_order_tab2')"
                    name="1">
                    <div class="mt-[0.4rem]" v-if="!loading">
                        <NoData v-if="!orderList.length" />
                        <OrderList :list="orderList" :type="'redeem'"/>
                    </div>
                    <div v-if="loading" class="w-full h-[3rem] flex items-center justify-center">
                        <Loading />
                    </div>
                </Tab>
            </Tabs>
        </div>
        <div v-if="earnLoading" class="full flex justify-center h-[5rem] items-center">
            <Loading />
        </div>
    </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { Tabs, Tab, Loading } from 'vant';
import NoData from '@/components/NoData.vue';
import OrderList from './OrderList.vue';
import { onMounted, ref } from 'vue';
import { _myEarn, _stakeOrder } from '@/api/api';
import { isEmpty } from '@/utils/isEmpty';

const { t } = useI18n();
const activeTab = ref(0);

const page = ref(1);

const changeTab = (e) => {
    activeTab.value = e;
    if (e == 0) getData('open');
    if (e == 1) getData('close');
}

const orderList = ref([])

const loading = ref(false)
const getData = (val) => {
    if (loading.value) return;
    loading.value = true;
    _stakeOrder({
        page: page.value,
        status: val
    })
    .then(res => {
        if (res.code == 200) {
            orderList.value = res.data;
            console.log('order list =========> ', orderList.value)
        }
    })
    .catch(err => console.error(err))
    .finally(() => {
        setTimeout(() => {
            loading.value = false;
        }, 500);
    })
}

const earnLoading = ref(false)
const myEarn = ref({})
const getMyEarn = () => {
    if (earnLoading.value) return;
    earnLoading.value = true;
    _myEarn()
    .then(res => {
        if (res.code == 200) {
            myEarn.value = res.data
        }
    })
    .catch(err => console.error(err))
    .finally(() => earnLoading.value = false);
}

onMounted(() => {
    getMyEarn();
})
</script>
<style lang="less"></style>