<!-- 查询 -->
<template>
    <div class="inquire" v-if="token">

        <NoData v-if="!loading && !aiInquireList.length" />
        <div class="list">
            <div class="item mask-btn" v-for="(item, i) in aiInquireList" :key="i" @click="openInfo(item)">
                <div class="ai_icon">
                    <img v-lazy="getStaticImgUrl('/static/img/trade/ai.svg')" alt="ai">
                </div>
                <div class="mid">
                    <div class="name">{{ item.name }}</div>
                    <div class="grid">{{ item.order_no }}</div>
                </div>
                <div class="right">
                    <div class="amount" :class="[item.profit < 0 ? 'text-down' : 'text-up']">
                        {{ item.profit >= 0 ? '+' : '' }}
                        {{ item.profit }}
                    </div>
                    <div class="date">{{ formatDate(item.date) }}</div>
                </div>
            </div>

        </div>
        <LoadingMore :loading="loading" :finish="finish" v-if="(finish && aiInquireList.length) || (!finish)" />
    </div>


    <UnLogin @loginfinish="loginfinish" v-show="!token" />


    <!-- 详情 -->
    <AiInfo ref="infoRef" />
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { computed, ref, onMounted, onUnmounted } from 'vue'
import store from "@/store"
import NoData from '@/components/NoData.vue';
import LoadingMore from "@/components/LoadingMore.vue"
import { _ailist } from "@/api/api"
import AiInfo from "../components/AiInfo.vue"
import UnLogin from "@/components/UnLogin.vue"

const props = defineProps({
    scrollDom: {
        type: String,
        default: '.page'
    }
})
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
const formatDate = (date) => {
    if (date) {
        let mat = date.match(/\d+\-(\d+\-\d+)\s(\d+:\d+)/) || []
        return mat[1] + ' ' + mat[2]
    }
    return ''
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
            arr.push(...(res.data || []))
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
    if (token.value) {
        init()
    }
    setTimeout(() => {
        try {
            moreDom = document.querySelector('.loading_more')
            document.querySelector(props.scrollDom).addEventListener('scroll', scrolHandle)
        } catch {
        }
    }, 500)
})
onUnmounted(() => {
    try {
        document.querySelector(props.scrollDom).removeEventListener('scroll', scrolHandle)
    } catch { }
})
init()
defineExpose({
    init
})
</script>

<style lang="less" scoped>
.inquire {
    .list {
        padding: 0.2rem 0 0.32rem 0;

    }

    .item {
        display: flex;
        align-items: center;
        line-height: 100%;
        padding: 0.32rem 0.28rem;
        border-radius: 0.32rem;
        margin-bottom: 0.2rem;
        background-color: var(--ex-bg-color3);

        .ai_icon {
            width: 0.8rem;
            height: 0.8rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.24rem;
            background-color: var(--ex-bg-color2);

            img {
                width: 0.53rem !important;
                height: 0.53rem !important;
            }
        }

        .mid {
            flex: 1;
            margin: 0 0.2rem 0 0.18rem;
            overflow: hidden;

            .name {
                font-size: 0.3rem;
                color: var(--ex-text-color);
                font-weight: bold;
            }

            .grid {
                color: var(--ex-text-color3);
                font-weight: 400;
                font-size: 0.28rem;
                margin-top: 0.18rem;
            }
        }

        .right {
            text-align: right;

            .amount {
                font-size: 0.32rem;
                font-weight: 600;
            }

            .date {
                color: var(--ex-text-color3);
                font-size: 0.28rem;
                margin-top: 0.18rem;
            }

        }
    }

    .item:last-child {
        border-bottom: 0px;
    }
}
</style>