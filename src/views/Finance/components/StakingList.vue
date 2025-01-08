<template>
    <div class="w-full mt-[0.32rem] mb-[2rem]">
        <StakingItem :list="[1, 2]" />
    </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { getStaticImgUrl } from "@/utils/index.js";
import StakingItem from './StakingItem.vue';

const { t } = useI18n();
</script>