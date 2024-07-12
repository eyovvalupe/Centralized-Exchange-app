<!-- 记录列表 -->
<template>
    <Popup :before-close="boforeClose" teleport="body" v-model:show="showBottom" position="bottom"
        style="background-color: rgba(0,0,0,0)">
        <div class="record_list_popup">
            <div class="title">
                <span>{{ title }}</span>
                <div class="close_icon" @click="close">
                    <img src="/static/img/common/close.png" alt="img">
                </div>
            </div>
            <Tabs @change="init" v-model:active="active" :lazy-render="true">
                <Tab :title="titles[0]">
                    <div ref="list_0" class="list" :class="{ 'active_list': active == 0 }">
                        <NoData v-if="!loading && !list.length" />
                        <div v-for="(item, i) in list" :key="i">{{ item }}</div>
                        <LoadingMore class="active_more" :loading="loading" :finish="finish"
                            v-if="((finish && list.length) || (!finish)) && active == 0" />
                    </div>
                </Tab>
                <Tab :title="titles[1]">
                    <div ref="list_1" class="list" :class="{ 'active_list': active == 1 }">
                        <NoData v-if="!loading && !list.length" />
                        <div v-for="(item, i) in list" :key="i">{{ item }}</div>
                        <LoadingMore class="active_more" :loading="loading" :finish="finish"
                            v-if="((finish && list.length) || (!finish)) && active == 1" />
                    </div>
                </Tab>
                <Tab :title="titles[2]">
                    <div ref="list_2" class="list" :class="{ 'active_list': active == 2 }">
                        <NoData v-if="!loading && !list.length" />
                        <div v-for="(item, i) in list" :key="i">{{ item }}</div>
                        <LoadingMore class="active_more" :loading="loading" :finish="finish"
                            v-if="((finish && list.length) || (!finish)) && active == 2" />
                    </div>
                </Tab>
                <Tab :title="titles[3]">
                    <div ref="list_3" class="list" :class="{ 'active_list': active == 3 }">
                        <NoData v-if="!loading && !list.length" />
                        <div v-for="(item, i) in list" :key="i">{{ item }}</div>
                        <LoadingMore class="active_more" :loading="loading" :finish="finish"
                            v-if="((finish && list.length) || (!finish)) && active == 3" />
                    </div>
                </Tab>
            </Tabs>
        </div>
    </Popup>
</template>

<script setup>
import { Popup, Tab, Tabs } from 'vant';
import { ref, computed } from "vue"
import { _depositList, _withdrawList, _transferLog, _converterLog } from "@/api/api"
import NoData from '@/components/NoData.vue';
import LoadingMore from "@/components/LoadingMore.vue"

const showBottom = ref(false)
const open = (tabIndex = 0) => {
    active.value = tabIndex
    showBottom.value = true
    setTimeout(() => {
        init()
    }, 0)
}
const close = () => {
    showBottom.value = false
}
const boforeClose = () => {
    destoryWatch()
}


const title = computed(() => '标题')
const titles = ['充值记录', '提现记录', '划转记录', '兑换记录']
const active = ref(0)
const reqs = {
    0: _depositList,
    1: _withdrawList,
    2: _transferLog,
    3: _converterLog,
}

// 初始化
const loading = ref(false)
const finish = ref(false)
const page = ref(0)
const list = ref([])
const init = () => {
    loading.value = false
    finish.value = false
    page.value = 0
    list.value = []
    initWatch()
    getData()
}
const getData = () => { // 获取数据
    if (loading.value || finish.value) return
    loading.value = true
    page.value++
    // 先从缓存拿值
    if (page.value == 1) {
        try {
            list.value = JSON.parse(sessionStorage.getItem('popup_record_' + active.value) || '[]')
        } catch {

        }
    }
    reqs[active.value]({
        page: page.value
    }).then(res => {

        if (!res.data?.length) {
            finish.value = true
        }
        if (page.value == 1) { // 缓存首页数据
            list.value = res.data || []
            sessionStorage.setItem('popup_record_' + active.value, JSON.stringify(res.data || []))
        } else {
            list.value.push(...(res.data || []))
        }
    }).finally(() => {
        loading.value = false
    })
}

const scrollHandle = () => {
    const rect = moreDom.getBoundingClientRect()
    if (rect.top <= totalHeight) {
        // 加载更多
        getData()
    }
}

const list_0 = ref()
const list_1 = ref()
const list_2 = ref()
const list_3 = ref()
let moreDom = ''
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
// 滚动监听
const initWatch = () => {
    setTimeout(() => {
        destoryWatch()
        moreDom = document.querySelector('.active_more');
        const domMap = {
            0: list_0,
            1: list_1,
            2: list_2,
            3: list_3,
        }
        domMap[active.value].value.addEventListener('scroll', scrollHandle)
    }, 300)
}
const destoryWatch = () => {
    list_0.value && list_0.value.removeEventListener('scroll', scrollHandle)
    list_1.value && list_1.value.removeEventListener('scroll', scrollHandle)
    list_2.value && list_2.value.removeEventListener('scroll', scrollHandle)
    list_3.value && list_3.value.removeEventListener('scroll', scrollHandle)
}

defineExpose({
    open
})
</script>

<style lang="less">
.record_list_popup {
    background-color: #fff;
    border-top-left-radius: 0.24rem;
    border-top-right-radius: 0.24rem;
    overflow: hidden;

    .title {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 1rem;
        font-size: 0.28rem;
        color: #121826;

        .close_icon {
            width: 0.32rem;
            height: 0.32rem;
            position: absolute;
            right: 0.4rem;
        }
    }

    .list {
        height: 60vh;
        padding: 0.32rem;
        overflow-y: auto;
    }
}
</style>