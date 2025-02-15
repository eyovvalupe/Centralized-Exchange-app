<template>
    <div class="">
        <div class="order_page mt-[0.32rem] mx-[0.32rem]" v-if="!earnLoading && !isEmpty(myEarn)">
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
            <Tabs key="form" type="sub-stake" style="margin-top:0.2rem;" v-model="activeTab" :swipeable="false" :color="'var(--ex-primary-color)'"
                shrink @change="changeTab">
                <Tab :active="activeTab == 0" style="min-width: 2rem" :title="t('finance.portfolio_order_tab1')"
                    name="0">
                    <div ref="orderListRef" class="order_list h-[9.2rem] mt-[0.2rem] overflow-auto" v-if="!loading">
                        <NoData v-if="!orderList.length" />
                        <OrderList :list="orderList" :type="'position'" />
                    </div>
                    <div v-if="loading" class="w-full h-[3rem] flex items-center justify-center">
                        <Loading />
                    </div>
                    <!-- <LoadingMore :loading="true"/> -->
                </Tab>
                <Tab :active="activeTab == 1" style="min-width: 2rem" :title="t('finance.portfolio_order_tab2')"
                    name="1">
                    <div class="mt-[0.2rem]" v-if="!loading">
                        <NoData v-if="!orderList.length" />
                        <OrderList :list="orderList" :type="'redeem'" />
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
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { _myEarn, _stakeOrder } from '@/api/api';
import { isEmpty } from '@/utils/isEmpty';
// import LoadingMore from '@/components/LoadingMore.vue';

const { t } = useI18n();
const activeTab = ref(0);

const page = ref(1);
const orderListRef = ref(null)

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
            }
        })
        .catch(err => console.error(err))
        .finally(() => {
            setTimeout(() => {
                loading.value = false;
            }, 500);
        })
}

const loading2 = ref(false)
const getMyData = (val) => {
    if (loading2.value) return;
    loading2.value = true;
    page.value++;
    _stakeOrder({
        page: page.value,
        status: val
    })
        .then(res => {
            if (res.code == 200) {
                orderList.value = res.data;
            }
        })
        .catch(err => console.error(err))
        .finally(() => {
            setTimeout(() => {
                loading2.value = false;
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

let moreDom = null
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
const scrolHandle = () => {
    console.log('scroll')
    const rect = moreDom.getBoundingClientRect()
    if (rect.top <= totalHeight) {
        // 加载更多
        console.error('加载更多')
        if (active.value == 1) {
            getData();
        }
        if (active.value == 2) {
            getMyData()
        }
    }
}

onMounted(() => {
    getMyEarn();

    setTimeout(() => {
        try {
            moreDom = document.querySelector('.loading_more')
            document.querySelector('#order_list').addEventListener('scroll', scrolHandle)
        } catch {
        }
    }, 1000)
})
onUnmounted(() => {
    try {
        document.querySelector('#order_list').removeEventListener('scroll', scrolHandle)
    } catch { }
})

</script>
<style lang="less"></style>