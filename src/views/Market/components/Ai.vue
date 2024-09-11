<!-- AI量化 -->
<template>
    <div class="page_ai">
        <Tabs type="card" sticky class="tab_content tabs" v-if="!pageLoading" @change="changeTab"
            v-model:active="active" :swipeable="false" animated shrink>
            <Tab :title="'默认'">
                <div class="list">
                    <AiItem v-for="(item, i) in list" :key="i" :item="item" />
                    <LoadingMore v-if="!(finish && list.length == 0) && active == 0" :loading="loading"
                        :finish="finish" />
                    <NoData v-if="(finish && list.length == 0)" />
                </div>
            </Tab>
            <Tab :title="'历史高收益率'">
                <div class="list">
                    <AiItem v-for="(item, i) in list" :key="i" :item="item" />
                </div>
            </Tab>
            <Tab :title="'24小时高收益率'">
                <div class="list">
                    <AiItem v-for="(item, i) in list" :key="i" :item="item" />
                </div>
            </Tab>
            <Tab :title="'高杠杆'">
                <div class="list">
                    <AiItem v-for="(item, i) in list" :key="i" :item="item" />
                </div>
            </Tab>
        </Tabs>

    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import { Tabs, Tab } from "vant"
import AiItem from "./AiItem.vue"
import { _aiquant } from "@/api/api"
import Loaidng from "@/components/Loaidng.vue"
import LoadingMore from "@/components/LoadingMore.vue"
import NoData from "@/components/NoData.vue"

const active = ref(0)
const changeTab = (val) => {
    console.error(val)
}


const list = ref([])
const page = ref(0)
const loading = ref(false)
const finish = ref(false)
const reset = () => {
    list.value = []
    page.value = 0
    loading.value = false
    finish.value = false
    getList()
}
const getList = () => {
    if (loading.value || finish.value) return
    loading.value = true
    page.value++
    _aiquant({
        page: page.value
    }).then(res => {
        if (page.value == 1) {
            list.value = res.data || []
        } else {
            list.value.push(...res.data)
        }
        if (!res.data || !res.data.length) {
            finish.value = true
        }
    }).finally(() => {
        loading.value = false
    })
}
reset()


const pageLoading = ref(true)
// 滚动监听
let loadingMore = ''
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
const scrollHandler = () => {
    if (!loadingMore) return
    const rect = loadingMore.getBoundingClientRect()
    if (rect.top <= totalHeight) {
        // 加载更多
        getList()
    }
}
onMounted(() => {
    setTimeout(() => {
        pageLoading.value = false
        setTimeout(() => {
            loadingMore = document.querySelector('.loading_more')
            try {
                document.querySelector('.page').addEventListener('scroll', scrollHandler)
            } catch { }
        }, 200)
    }, 300)
})
onBeforeUnmount(() => {
    try {
        document.querySelector('.page').removeEventListener('scroll', scrollHandler)
    } catch { }
})
</script>

<style lang="less" scoped>
.page_ai {
    .list {
        padding: 0 0.32rem 0.32rem 0.32rem;
    }
}
</style>