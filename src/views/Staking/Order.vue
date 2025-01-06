<template>
    <div class="w-full">
        <Top :title="t('Investment Order')" />
    </div>
</template>
<script setup>
import Top from '@/components/Top.vue';
import { useI18n } from 'vue-i18n';
import { Tabs, Tab } from 'vant';

const {t} = useI18n();
</script>