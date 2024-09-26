<!-- 查询 -->
<template>
    <div class="inquire" v-if="token">
        <NoData v-if="!loading && !aiInquireList.length" />

        <div class="tr" v-for="(item, i) in aiInquireList" :key="i" @click="openInfo(item)">
            <div class="ai_icon">
                <img src="/static/img/trade/ai_order2.png" alt="ai">
            </div>
            <div class="mid">
                <div class="name">{{ item.name }}</div>
                <div class="mid_block">
                    <!-- <div class="tag" :class="[item.offset == 'long' ? 'up' : 'down']">{{ item.offset == 'long'
                        ? '买涨' : '买跌' }}</div> -->
                    <div class="grid">{{ item.order_no }}</div>
                </div>
            </div>
            <div class="right">
                <div class="amount">{{ item.profit > 0 ? '+' : '' }}{{
                    item.profit }} <span>USDT</span></div>
                <!-- <div class="time">{{ item.date }}</div> -->
                <div class="status" :class="[item.profit < 0 ? 'down_status' : 'up_status']">{{ item.profit < 0 ? '负盈利'
                    : '盈利' }}</div>
                </div>
            </div>
            <LoadingMore :loading="loading" :finish="finish" v-if="(finish && aiInquireList.length) || (!finish)" />
        </div>

        <UnLogin @loginfinish="loginfinish" v-show="!token" />


        <!-- 详情 -->
        <AiInfo ref="infoRef" />
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import store from "@/store"
import NoData from '@/components/NoData.vue';
import LoadingMore from "@/components/LoadingMore.vue"
import { _ailist } from "@/api/api"
import AiInfo from "../components/AiInfo.vue"
import UnLogin from "@/components/UnLogin.vue"


const loginfinish = () => {
    setTimeout(() => {
        init()
    }, 100)
}

const aiInquireList = computed(() => store.state.aiInquireList || [])
const token = computed(() => store.state.token)


// 详情
const infoRef = ref()
const openInfo = item => {
    infoRef.value && infoRef.value.open(item)
}

const page = ref(0)
const loading = ref(false)
const finish = ref(false)
const init = () => {
    if (token.value) {
        page.value = false
        loading.value = false
        finish.value = false
        setTimeout(() => {
            getList()
        }, 0)
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
        // console.error('----', res)
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
init()
defineExpose({
    init
})
</script>

<style lang="less" scoped>
.inquire {
    padding: 0.2rem 0.32rem;

    .tr {
        padding: 0.24rem 0.32rem;
        display: flex;
        align-items: center;
        padding: 0.2rem;
        border-bottom: 1px solid #EAEAEA;
        color: #333;
        line-height: 0.5rem;

        .ai_icon {
            width: 0.56rem;
            height: 0.56rem;
            margin: 0 0.04rem;
        }

        .mid {
            flex: 1;
            margin: 0 0.2rem 0 0.36rem;

            .name {
                font-size: 0.32rem;
                color: #000;
                font-weight: bold;
            }

            .mid_block {
                display: flex;
                align-items: center;
                margin-top: 0.1rem;

                .tag {
                    padding: 0 0.08rem;
                    border-radius: 0.04rem;
                    margin-right: 0.1rem;
                    font-size: 0.24rem;
                }

            }
        }

        .right {
            text-align: right;

            .amount {
                font-size: 0.32rem;
                color: #000;
                font-weight: bold;

                >span {
                    font-weight: 400;
                    font-size: 0.28rem;
                }
            }

            .status {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0 0.16rem;
                border-radius: 0.04rem;
                font-size: 0.24rem;
                width: auto;
                margin-top: 0.1rem;
            }

            .down_status {
                color: #E8503A;
                background-color: #FFF3F3;
            }

            .up_status {
                color: #0AB27D;
                background-color: #EBFEED;
            }
        }
    }

}
</style>