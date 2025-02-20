<template>
    <div class="staking_list w-full mb-[0.2rem]">
        <StakingItem v-if="stakingList.length" :list="stakingList" />
        <NoData class="mt-[0.64rem]" v-if="!loading && !stakingList.length" />
        <!-- <div class="w-full flex justify-center pt-[0.64rem]">
            <Loading v-if="loading" />
        </div> -->
        <LoadingMore :classN="'stake-loading'" :loading="loading" :finish="finish"
            v-if="(finish && stakingList.length) || !finish" />
    </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
// import { getStaticImgUrl } from "@/utils/index.js";
import StakingItem from './StakingItem.vue';
import { _miningList } from '@/api/api';
import { onMounted, onUnmounted, ref } from 'vue';
import { Loading } from 'vant';
import NoData from '@/components/NoData.vue';
import LoadingMore from "@/components/LoadingMore.vue"

const page = ref(1);

const stakingList = ref([])

const loading = ref(false);
const finish = ref(false)

const getList = () => {
    if (loading.value || finish.value) return;
    if (page.value == 1) {
        try {
            stakingList.value = JSON.parse(sessionStorage.getItem('stakeList') || '[]')
        } catch {
            stakingList.value = []
        }
    }
    loading.value = true;
    _miningList({ page: page.value })
        .then((res) => {
            if (res.code == 200) {
                if (page.value == 1) {
                    stakingList.value = res.data
                    sessionStorage.setItem('stakeList', JSON.stringify(res.data || []))
                } else {
                    stakingList.value.concat(res.data || [])
                }
                page.value++
            }
            if (!res.data || !res.data.length) {
                finish.value = true
            }
        })
        .finally(() => {
            setTimeout(() => {
                loading.value = false;
            }, 300)
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
        getList();
    }
}

onMounted(() => {
    getList()
    setTimeout(() => {
        try {
            moreDom = document.querySelector('.stake-loading')
            document.querySelector('.staking_page').addEventListener('scroll', scrolHandle)
        } catch {
        }
    }, 300)
})
onUnmounted(() => {
    try {
        document.querySelector('.staking_page').removeEventListener('scroll', scrolHandle)
    } catch { }
})
</script>