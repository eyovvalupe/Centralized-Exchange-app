<template>
    <div class="pledge_order_list_page px-[0.32rem]">
       
        <Tabs key="form" type="sub-stake" style="margin-top:0.32rem;" v-model:active="activeTab" @click-tab="onTabClick" :swipeable="false" shrink>
            <Tab name="open" style="min-width: 2rem" :title="t('finance.defi_borrow_on')">
            </Tab>
            <Tab name="close" style="min-width: 2rem" :title="t('finance.defi_borrow_repay')">
            </Tab>
        </Tabs>
        <div class="min-h-[10rem] mt-[0.32rem]">
           
            <UnLogin v-if="!isLoading && !list.length && !token" @loginfinish="getList()" />
            <NoData v-else-if="!isLoading && !list.length"/>
            <PledgeOrderList :list="list"/>
            <div class="flex items-center justify-center p-[0.4rem]" v-if="isLoading">
                <Loading />
            </div>
        </div>
    </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { Tabs,Tab,Loading } from 'vant'
import NoData from '@/components/NoData.vue';
import PledgeOrderList from './PledgeOrderList.vue';
import {_pledgeOrders} from '@/api/api'
import eventBus from "@/utils/eventBus";
import store from '@/store'
import UnLogin from "@/components/UnLogin.vue";
import { computed, onBeforeUnmount, onMounted } from "vue";

const activeTab = ref('open')
const { t } = useI18n();
const finish = ref(false)
const list = ref([])
const isLoading = ref(false)
const token = computed(()=>store.state.token)
const currentPage = ref(1)
const getList = (page=1)=>{
    if(!token.value){
        return
    }
    finish.value = false
    isLoading.value = true
    _pledgeOrders({
        page,
        status:activeTab.value
    }).then(res=>{
        if(res.code == 200){
            if(res.data && res.data.length){
                currentPage.value = page
                list.value = page > 1 ? list.value.concat(res.data || []) : res.data || []
            }else{
                finish.value = true
            }
        }
    }).finally(()=>{
        isLoading.value = false
    })
}
getList()
const onPledgeLoad = ()=>{
    if(isLoading.value || finish.value){
        return
    }
    getList(currentPage.value + 1)
}
const onTabClick = ()=>{
    list.value = []
    getList()
}
const onPledgeSuccess = ()=>{
    list.value = []
    getList()
}
onMounted(()=>{
    eventBus.on("pledgeSuccess",onPledgeSuccess)
    eventBus.on("pledgeLoad",onPledgeLoad)
})
onBeforeUnmount(()=>{
    eventBus.off("pledgeSuccess",onPledgeSuccess)
    eventBus.off("pledgeLoad",onPledgeLoad)
})
</script>