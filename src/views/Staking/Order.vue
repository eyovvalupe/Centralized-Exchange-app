<template>
    <div class="order_page w-full">
        <Top :title="t('Investment Order')" />
        <Tabs class="mt-[1.5rem] px-[0.2rem]" type="custom-card" v-model:active="active" :swipeable="false" :color="'var(--ex-primary-color)'" shrink @change="onChange">
            <Tab style="min-width: 2rem" :title="t('In Progress')" name="0">
                <div class="mt-[0.2rem]">
                    <NoData />
                </div>
            </Tab>
            <Tab style="min-width: 2rem" :title="t('Completed')" name="1">
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
.order_style {

}
</style>