<template>
    <div class="pledge_order_list_page">
        <div class="flex  rounded-[0.32rem] mt-[0.32rem] bg-color3 p-[0.32rem]">
            <div class="flex-1 flex flex-col justify-center items-center gap-[0.24rem]">
                <div class="text-color2 text-[0.3rem]">
                    {{ t('finance.defi_borrow_already') }}<span class="text-[0.24rem]">(USDT)</span>
                </div>
                <div class="text-[0.4rem] font-[600] text-color leading-[0.6rem]">
                    10,000.00
                </div>
            </div>
            <div class="flex-1  flex flex-col justify-center items-center gap-[0.24rem]">
                <div class="text-color2 text-[0.3rem]">
                    {{ t('finance.defi_borrow_remain') }}<span class="text-[0.24rem]">(USDT)</span>
                </div>
                <div class="text-[0.4rem] font-[600] text-color leading-[0.6rem]">
                    10,000.00
                </div>
            </div>
        </div>
        <Tabs key="form" type="sub-stake" v-model="activeTab" @click-tab="onTabClick" :swipeable="false" shrink>
            <Tab :active="activeTab == 0" style="min-width: 2rem" :title="t('finance.defi_borrow_on')">
            </Tab>
            <Tab :active="activeTab == 0" style="min-width: 2rem" :title="t('finance.defi_borrow_repay')">
                
            </Tab>
        </Tabs>
        <div class="min-h-[10rem] mt-[0.4rem]">
            <div class="flex items-center justify-center p-[0.4rem]" v-if="isLoading">
                <Loading />
            </div>
            <NoData v-if="false"/>
            <PledgeOrderList :list="list"/>
        </div>
        <div class="h-[1.5rem]"></div>
    </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { Tabs,Tab,Loading } from 'vant'
import NoData from '@/components/NoData.vue';
import PledgeOrderList from './PledgeOrderList.vue';
import {_pledgeOrders} from '@/api/api'
import eventBus from "@/utils/eventBus";
import { onBeforeUnmount, onMounted } from "vue";
const activeTab = ref(0)
const { t } = useI18n();
const page = ref(0)
const list = ref([])
const isLoading = ref(false)
const getList = ()=>{
    isLoading.value = true
    page.value ++
    const status = activeTab.value == 0 ? 'open' : 'close'
    _pledgeOrders({
        page:page.value,
        status
    }).then(res=>{
        
        console.log(res)
    }).finally(()=>{
        list.value = [{
            order_no:"921581771",
            symbol:"USDT",
            amount:Math.round(1e8 * Math.random()),
            loan:Math.round(1e9 * Math.random()),
            status,
            days:7,
            totainterest:Math.round(1e4 * Math.random()),
            fee:Math.round(1e3 * Math.random())
        }]
        isLoading.value = false
    })
}
getList()
const onTabClick = ()=>{
    page.value = 0
    list.value = []
    getList()
}
const onPledgeSuccess = ()=>{
    getList()
}
onMounted(()=>{
    eventBus.on("pledgeSuccess",onPledgeSuccess)
})
onBeforeUnmount(()=>{
    eventBus.off("pledgeSuccess",onPledgeSuccess)
})
</script>