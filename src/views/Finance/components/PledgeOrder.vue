<template>
    <div class="pledge_order_list_page">
       
        <Tabs key="form" type="sub-stake" v-model:active="activeTab" @click-tab="onTabClick" :swipeable="false" shrink>
            <Tab name="open" style="min-width: 2rem" :title="t('finance.defi_borrow_on')">
            </Tab>
            <Tab name="close" style="min-width: 2rem" :title="t('finance.defi_borrow_repay')">
            </Tab>
        </Tabs>
        <div class="min-h-[10rem] mt-[0.4rem]">
            <div class="flex items-center justify-center p-[0.4rem]" v-if="isLoading">
                <Loading />
            </div>
            <NoData v-if="!isLoading && !list.length"/>
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

const activeTab = ref('open')
const { t } = useI18n();
const page = ref(0)
const list = ref([])
const isLoading = ref(false)
const getList = ()=>{
    isLoading.value = true
    page.value ++
    _pledgeOrders({
        page:page.value,
        status:activeTab.value
    }).then(res=>{
        if(res.code == 200){
            list.value = res.data || []
        }
    }).finally(()=>{
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