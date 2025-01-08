<template>
    <div class="w-full mt-[0.32rem] mb-[2rem]">
        <StakingItem :list="[1, 2]" />
    </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { getStaticImgUrl } from "@/utils/index.js";
import StakingItem from './StakingItem.vue';
import { _miningList } from '@/api/api';
import { onMounted, ref } from 'vue';

const page = ref(1);

const loading = ref(false);

const getList = () => {
    if (loading.value) return;
    loading.value = true;
    _miningList({page: page.value})
        .then((res) => {
            console.log("mining list ==========> ", res.code, res.data)
        })
        .catch(err => console.error(err))
        .finally(() => {
            loading.value = false;
        })
}

const { t } = useI18n();

onMounted(() => {
    getList();
})
</script>