<template>
    <div class="staking_list w-full mt-[0.1rem] mb-[2rem]">
        <StakingItem v-if="stakingList.length" :list="stakingList" />
        <NoData v-if="!loading && !stakingList.length" />
        <div class="w-full flex justify-center">
            <Loading v-if="loading" />
        </div>
    </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { getStaticImgUrl } from "@/utils/index.js";
import StakingItem from './StakingItem.vue';
import { _miningList } from '@/api/api';
import { onMounted, onUnmounted, ref } from 'vue';
import { Loading } from 'vant';
import NoData from '@/components/NoData.vue';

const page = ref(1);

const stakingList = ref([])

const loading = ref(false);

const getList = () => {
    if (loading.value) return;
    loading.value = true;
    _miningList({page: page.value})
        .then((res) => {
            if (res.code == 200) {
                stakingList.value = res.data
            }
        })
        .catch(err => {
            console.error(err)
        })
        .finally(() => {
            loading.value = false;
        })
}

const { t } = useI18n();

let moreDom = null
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
const scrolHandle = () => {
    const rect = moreDom.getBoundingClientRect()
    if (rect.top <= totalHeight) {
        // 加载更多
        console.error('加载更多')
        if (active.value == 1) {
            getList();
        }
        if (active.value == 2) {
            getList();
        }
    }
}

onMounted(() => {
    getList()
    // setTimeout(() => {
    //     try {
    //         moreDom = document.querySelector('.loading_more')
    //         document.querySelector('.list').addEventListener('scroll', scrolHandle)
    //     } catch {
    //     }
    // }, 300)
})
// onUnmounted(() => {
//     try {
//         document.querySelector('.list').removeEventListener('scroll', scrolHandle)
//     } catch { }
// })
</script>