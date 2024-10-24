<!-- 记录列表 -->
<template>
    <div class="page page_record_list">
        <Top :title="title" />
         <!-- 兑换记录 -->
         <div ref="list_3" class="list active_list" v-if="active == 3">
            <NoData v-if="!loading && !list.length" />
            <template v-if="active == 3">
                <div v-for="(item, i) in list" :key="i">
                    <TransferItem :item="item" />
                </div>
            </template>
            <LoadingMore class="active_more" :loading="loading" :finish="finish"
                v-if="((finish && list.length) || (!finish)) && active == 3" />
        </div>
        
        <Tabs type="oval-card" v-else v-model:active="active" :swipeable="false" animated 
            shrink @change="onChange" >
            <Tab title="充值记录" name="0">
                 <div>
                    <NoData v-if="!loading && !list.length" />
                    <div v-for="(item, i) in list" :key="i" class="list_0_item">
                        <div class="date" @click="dateClick(getDate(item.date))" v-if="i == 0 || getDate(item.date) != getDate(list[i - 1].date)">
                            {{ getDate(item.date) }}
                            <span class="date_more" :class="{'date_more_up':!openDates.includes(getDate(item.date))}"><img src="/static/img/assets/more.png" alt="more"></span>
                        </div>
                        <transition name="opacity">
                            <RechargeItem @close="showBottom = false" :item="item" v-show="!openDates.includes(getDate(item.date))" />
                        </transition>
                    </div>
                    <LoadingMore class="active_more" :loading="loading" :finish="finish"
                        v-if="((finish && list.length) || (!finish)) && active == 0" />
                 </div>
            </Tab>
            <Tab title="提现记录" name="1">
                 <div>
                    <NoData v-if="!loading && !list.length" />
                    <div v-for="(item, i) in list" :key="i">
                        <WithdrawItem :item="item" />
                    </div>
                    <LoadingMore class="active_more" :loading="loading" :finish="finish"
                        v-if="((finish && list.length) || (!finish)) && active == 1" />
                 </div>
            </Tab>
            <Tab title="划转" name="2">
                <div>
                    <NoData v-if="!loading && !list.length" />
                    <div v-for="(item, i) in list" :key="i">
                        <TransferItem :item="item" />
                    </div>
                    <LoadingMore class="active_more" :loading="loading" :finish="finish"
                        v-if="((finish && list.length) || (!finish)) && active == 2" />
                </div>
            </Tab>
        </Tabs>


       
    </div>
</template>

<script setup>
import Top from '@/components/Top.vue';
import { Tab, Tabs } from 'vant';
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import { _depositList, _withdrawList, _transferLog, _converterLog } from "@/api/api"
import NoData from '@/components/NoData.vue';
import LoadingMore from "@/components/LoadingMore.vue"
import RechargeItem from "@/components/RecordItem/RechargeItem.vue"
import WithdrawItem from "@/components/RecordItem/WithdrawItem.vue"
import TransferItem from "@/components/RecordItem/TransferItem.vue"

import { useRoute } from "vue-router"

const openDates = ref([])

const route = useRoute()
const dateClick = (date)=>{
    const index = openDates.value.indexOf(date)
    if(index > -1){
        openDates.value.splice(index,1)
    }else{
        openDates.value.push(date)
    }
}

const titles = ['充值记录', '提现记录', '划转记录', '兑换记录']
const active = ref(route.query.tab || 0)
const title = computed(() => titles[active.value])
const reqs = {
    0: _depositList,
    1: _withdrawList,
    2: _transferLog,
    // 3: _converterLog,
    3: _transferLog
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
    setTimeout(() => {
        lastTop.value = 0
    }, 100)
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
    const saveActive = active.value
    reqs[active.value]({
        page: page.value
    }).then(res => {
        if (saveActive != active.value) return // 不是当前列表的请求返回
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

const lastTop = ref(0)
const scrollHandle = (event) => {
    // 获取当前滚动位置
    let scrollTop = event.target.scrollTop;
    // 更新上一次滚动位置
    lastTop.value = scrollTop;
    const rect = moreDom.getBoundingClientRect()
    if (rect.top <= totalHeight) {
        // 加载更多
        getData()
    }
}

let moreDom = ''
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
// 滚动监听
const initWatch = () => {
    setTimeout(() => {
        destoryWatch()
        moreDom = document.querySelector('.active_more');
        document.querySelector('.page_record_list').addEventListener('scroll', scrollHandle)
    }, 300)
}
const destoryWatch = () => {
    document.querySelector('.page_record_list').removeEventListener('scroll', scrollHandle)
}

onMounted(() => {
    setTimeout(() => {
        init()
    }, 0)
})
onBeforeUnmount(() => {
    boforeClose()
})
const boforeClose = () => {
    destoryWatch()
}


// 获取日期
const getDate = str => {
    if (str) {
        return str.split(' ')[0] || str
    }
    return str
}
</script>

<style lang="less" scoped>
.page_record_list {
    padding: 1.12rem 0.32rem 0.32rem 0.32rem;
    
}
.date{
    height: 0.32rem;
    padding: 0.1rem 0;
    margin-top: 0.3rem;
    display: flex;
    align-items: center;
    justify-content: center
}
.date_more{
    width: 0.32rem;
    height: 0.32rem;
    margin-left: 0.06rem;
    img{
        transition: .3s;
    }
}
.date_more_up img{
    transform: rotate(-180deg);
}

</style>