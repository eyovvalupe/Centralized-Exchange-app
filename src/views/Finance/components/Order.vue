<template>
    <div class="order_page w-full mt-[0.32rem]">
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
        <Tabs class="px-[0.2rem]" type="sub" v-model:active="active" :swipeable="false"
            :color="'var(--ex-primary-color)'" shrink @change="onChange">
            <Tab style="min-width: 2rem" :title="t('finance.portfolio_order_tab1')" name="0">
                <div class="mt-[0.2rem]">
                    <NoData />
                </div>
            </Tab>
            <Tab style="min-width: 2rem" :title="t('finance.portfolio_order_tab2')" name="1">
                <div class="mt-[0.2rem]">
                    <NoData />
                </div>
            </Tab>
        </Tabs>
    </div>
</template>
<script setup>
import Top from '@/components/Top.vue';
import { useI18n } from 'vue-i18n';
import { Tabs, Tab } from 'vant';
import NoData from '@/components/NoData.vue';

const { t } = useI18n();
</script>
<style lang="less">
</style>