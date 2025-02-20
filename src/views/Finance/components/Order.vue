<template>
    <div class="">
        <div class="order_page mt-[0.32rem] mx-[0.32rem]" v-if="!isEmpty(myEarn)">
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
            <Tabs key="form" type="sub-stake" style="margin-top:0.2rem;" v-model="activeTab" :swipeable="false"
                :color="'var(--ex-primary-color)'" shrink @change="changeTab">
                <Tab :active="activeTab == 0" style="min-width: 2rem" :title="t('finance.portfolio_order_tab1')"
                    name="0">
                    <div ref="orderListRef" class="order_list mt-[0.2rem]">
                        <NoData v-if="!orderList.length" />
                        <OrderList :list="orderList" :type="'position'" />
                    </div>
                </Tab>
                <Tab :active="activeTab == 1" style="min-width: 2rem" :title="t('finance.portfolio_order_tab2')"
                    name="1">
                    <div class="mt-[0.2rem]">
                        <NoData v-if="!myOrderList.length" />
                        <OrderList :list="myOrderList" :type="'redeem'" />
                    </div>
                </Tab>
            </Tabs>

            <LoadingMore :classN="'stakelist-loading'" :loading="loading" :finish="finish"
                v-if="(finish && (activeTab == 0 ? orderList.length : myOrderList.length)) || !finish" />
        </div>
    </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { Tabs, Tab, Loading } from 'vant';
import NoData from '@/components/NoData.vue';
import OrderList from './OrderList.vue';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { _myEarn, _stakeOrder } from '@/api/api';
import { isEmpty } from '@/utils/isEmpty';
import LoadingMore from '@/components/LoadingMore.vue';

const { t } = useI18n();
const activeTab = ref(0);

const page = ref(1);
const orderListRef = ref(null)

const changeTab = (e) => {
    activeTab.value = e;
    page.value = 1
    loading.value = false
    finish.value = false
    setTimeout(() => {
        if (e == 0) getData(0);
        if (e == 1) getData(1);
    }, 0)
}

const orderList = ref([])
const myOrderList = ref([])
const loading = ref(false)
const finish = ref(false)
const getData = (type) => {
    if (loading.value || finish.value) return;
    if (page.value == 1) {
        try {
            orderList.value = JSON.parse(sessionStorage.getItem('stakeOrderList') || '[]')
        } catch {
            orderList.value = []
        }
        try {
            myOrderList.value = JSON.parse(sessionStorage.getItem('stakeMyOrderList') || '[]')
        } catch {
            myOrderList.value = []
        }
    }
    loading.value = true;
    _stakeOrder({
        page: page.value,
        status: type == 0 ? 'open' : 'close'
    })
        .then(res => {
            if (type != activeTab.value) return
            if (res.code == 200) {
                if (type == 0) {
                    if (page.value == 1) {
                        orderList.value = res.data
                        sessionStorage.setItem('stakeOrderList', JSON.stringify(res.data || []))
                    } else {
                        orderList.value.concat(res.data || [])
                    }
                } else {
                    if (page.value == 1) {
                        myOrderList.value = res.data
                        sessionStorage.setItem('stakeMyOrderList', JSON.stringify(res.data || []))
                    } else {
                        myOrderList.value.concat(res.data || [])
                    }
                }

                page.value++
            }
            if (!res.data || !res.data.length) {
                finish.value = true
            }
        })
        .catch(err => console.error(err))
        .finally(() => {
            setTimeout(() => {
                loading.value = false;
            }, 300)
        })
}


const earnLoading = ref(false)
const myEarn = ref({})
const getMyEarn = () => {
    if (earnLoading.value) return;
    try {
        myEarn.value = JSON.parse(sessionStorage.getItem('myEarn') || '{}')
    } catch { }
    console.error('myEarn', myEarn.value)
    earnLoading.value = true;
    _myEarn()
        .then(res => {
            if (res.code == 200) {
                myEarn.value = res.data
                sessionStorage.setItem('myEarn', JSON.stringify(res.data || {}))
            }
        })
        .catch(err => console.error(err))
        .finally(() => earnLoading.value = false);
}

let moreDom = null
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
const scrolHandle = () => {
    const rect = moreDom.getBoundingClientRect()
    if (rect.top <= totalHeight) {
        // 加载更多
        console.error('加载更多')
        getData(activeTab.value);
    }
}

onMounted(() => {
    getMyEarn();

    setTimeout(() => {
        try {
            moreDom = document.querySelector('.stakelist-loading')
            document.querySelector('.staking_page').addEventListener('scroll', scrolHandle)
        } catch {
        }
    }, 1000)
})
onUnmounted(() => {
    try {
        document.querySelector('.staking_page').removeEventListener('scroll', scrolHandle)
    } catch { }
})

</script>
<style lang="less"></style>