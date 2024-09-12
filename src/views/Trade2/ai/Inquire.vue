<!-- 查询 -->
<template>
    <div class="inquire" v-if="token">
        <NoData v-if="!loading && !aiInquireList.length" />

        <div class="tr" v-for="(item, i) in aiInquireList" :key="i">
            {{ i }}
        </div>
        <LoadingMore :loading="loading" :finish="finish" v-if="(finish && aiInquireList.length) || (!finish)" />
    </div>

    <UnLogin v-else />
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import store from "@/store"
import NoData from '@/components/NoData.vue';
import LoadingMore from "@/components/LoadingMore.vue"
import { _ailist } from "@/api/api"
import UnLogin from "@/components/UnLogin.vue"

const aiInquireList = computed(() => store.state.aiInquireList || [])
const token = computed(() => store.state.token)


const page = ref(0)
const loading = ref(false)
const finish = ref(false)
const init = () => {
    if (token.value) {
        page.value = false
        loading.value = false
        finish.value = false
        getList()
    }
}
const getList = () => {
    if (loading.value || finish.value) return
    page.value++
    const params = {
        page: page.value
    }
    loading.value = true
    _ailist(params).then(res => {
        if (page.value == 1) {
            store.commit('setAiInquireList', res.data || [])
        } else {
            const arr = aiInquireList.value
            arr.push(...LoadingMore(res.data || []))
            store.commit('setAiInquireList', arr)
        }
        if (!res.data?.length) {
            finish.value = true
        }
    }).finally(() => {
        loading.value = false
    })
}


let moreDom = null
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
const scrolHandle = () => {
    const rect = moreDom.getBoundingClientRect()
    if (rect.top <= totalHeight) {
        // 加载更多
        getList()
    }
}
onMounted(() => {
    setTimeout(() => {
        try {
            moreDom = document.querySelector('.loading_more')
            document.querySelector('.page').addEventListener('scroll', scrolHandle)
        } catch {
        }
    }, 500)
})
onUnmounted(() => {
    try {
        document.querySelector('.page').removeEventListener('scroll', scrolHandle)
    } catch { }
})

defineExpose({
    init
})
</script>

<style lang="less" scoped>
.inquire {
    padding-bottom: 2rem;

    .tr {
        padding: 0.24rem 0.32rem;
        border-bottom: 1px solid #e8e8e8;
        display: flex;
        align-items: stretch;
    }

}
</style>