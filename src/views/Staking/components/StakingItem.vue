<template>
    <div class="w-full px-[0.2rem]">
        <div v-if="list.length" v-for="(item, i) in list"
            class="w-full h-[7.32rem] bg-color2 mb-[0.4rem] rounded-[0.2rem] px-[0.32rem] py-[0.4rem] flex flex-col justify-between">
            <div class="flex flex-col">
                <div>BTC+ETH+XRP</div>
                <div>{{ t('investment amount: ') + '3500`99999999' }}</div>
            </div>
            <div class="flex flex-col">
                <div class="flex">
                    <div>{{ t('Yield') }}</div>
                    <div>{{ t('Duration:') + ' ' + 15 + t('Days') }}</div>
                </div>
                <div>0.3-0.4%/{{ t('Day') }}</div>
                <Button class="bg-"></Button>
            </div>
        </div>
    </div>
</template>
<script setup>
import SparkLine from '@/components/SparkLine.vue';
import { useI18n } from 'vue-i18n';
import { Button } from 'vant';

const { t } = useI18n();
const props = defineProps({
    list: {
        type: Array,
        default: []
    }
})
</script>