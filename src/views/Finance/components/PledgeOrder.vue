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
        <Tabs key="form" type="sub-stake" v-model="activeTab" :swipeable="false" shrink>
            <Tab :active="activeTab == 0" style="min-width: 2rem" :title="t('finance.defi_borrow_on')">
                <div class="h-[10rem] mt-[0.4rem]">
                    <NoData v-if="false"/>
                    <PledgeOrderList :list="[1,2]"/>
                </div>
            </Tab>
            <Tab :active="activeTab == 0" style="min-width: 2rem" :title="t('finance.defi_borrow_repay')">
                <div class="h-[10rem] mt-[0.4rem]">
                    <NoData v-if="false"/>
                    <PledgeOrderList :list="[1,2]"/>
                </div>
            </Tab>
        </Tabs>
        <div class="h-[1.5rem]"></div>
    </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { Tabs,Tab } from 'vant'
import NoData from '@/components/NoData.vue';
import PledgeOrderList from './PledgeOrderList.vue';
const activeTab = ref(0)
const { t } = useI18n();
</script>