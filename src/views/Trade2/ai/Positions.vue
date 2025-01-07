<!-- ai持仓 -->
<template>
    <div class="page_ai_position">
        <NoData v-if="!loading && !aiPositionsList.length" />
        <div class="list">
            <div class="item" v-for="(item, i) in aiPositionsList" :key="i" @click="openInfo(item)"
                v-show="item.endtime > 0">
                <div class="ai_icon">
                    <img :src="getStaticImgUrl('/static/img/trade/ai.svg')" alt="ai">
                </div>
                <div class="mid">
                    <div class="name">{{ item.name }}</div>
                    <div class="grid van-omit1">{{ item.order_no }}</div>
                </div>
                <div class="right">
                    <div class="endtime" v-html="formatEndtime(item.endtime)"></div>
                </div>
            </div>
        </div>
        <LoadingMore :loading="loading" v-if="loading && !aiPositionsList.length" />
    </div>

    <!-- 详情 -->
    <AiInfo ref="infoRef" />
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { useSocket } from "@/utils/ws";
import { onMounted, onUnmounted, computed, ref } from "vue"
import store from '@/store';
import AiInfo from "../components/AiInfo.vue"
import LoadingMore from "@/components/LoadingMore.vue"
import NoData from '@/components/NoData.vue';
import { formatSec2 } from "@/utils/time"


// 详情
const infoRef = ref()
const openInfo = item => {
    infoRef.value && infoRef.value.open(item)
}

const formatEndtime = (endtime) => {
    let time = formatSec2(endtime)
    let html = ''
    time.split(":").map((t, i) => {
        if (i > 0) {
            html += '<span class="split">:</span>'
        }
        html += '<span class="num">' + t + '</span>'
    })
    return html
}


const token = computed(() => store.state.token)
const aiPositionsList = computed(() => store.state.aiPositionsList || [])

const { startSocket } = useSocket();
store.commit('setAiPositionsList', [])

// 订阅
const loading = ref(false)
const subs = () => {
    loading.value = true
    const socket = startSocket(() => {
        socket && socket.off('user')
        socket && socket.off('aiquantorder')
        socket && socket.emit('user', token.value)
        socket && socket.emit('aiquantorder', '#all')
        socket.on('aiquantorder', res => {
            store.commit('setAiPositionsList', (res.data || []))
            loading.value = false
        })
        setTimeout(() => {
            loading.value = false
        }, 1500)
    });
}
// 取消订阅
const cancelSubs = () => {
    const socket = startSocket(() => {
        socket && socket.off('user')
        socket && socket.off('aiquantorder')
        socket && socket.emit('user', '')
        socket && socket.emit('aiquantorder', '')
    })
}

onMounted(() => {
    if (token.value) {
        subs()
    }
})
onUnmounted(() => {
    cancelSubs()
})

watch(() => store.state.token, () => {
    if (store.state.token) {
        subs()
    } else {
        cancelSubs()
    }
})
</script>

<style lang="less" scoped>
.page_ai_position {
    .list {
        padding: 0.2rem 0 0.32rem 0;
    }

    .item {
        display: flex;
        align-items: center;
        background-color: var(--ex-bg-white2);
        line-height: 100%;
        padding: 0.32rem 0.28rem;
        border-radius: 0.32rem;
        margin-bottom: 0.2rem;

        .ai_icon {
            width: 0.8rem;
            height: 0.8rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.24rem;
            background-color: rgb(var(--ex-primary-color-rgb) / 0.10);

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
                font-size: 0.25rem;
                margin-top: 0.18rem;
            }
        }

        .right {
            text-align: right;

            .amount {
                font-size: 0.32rem;
                font-weight: 600;
            }

            .endtime {
                display: flex;
                align-items: center;
                height: 0.6rem;
                line-height: 0.58rem;

                :deep(.num) {
                    width: 0.6rem;
                    height: 0.6rem;
                    text-align: center;
                    color: var(--ex-status-color1);
                    font-weight: 600;
                    font-size: 0.32rem;
                    border: 1px solid var(--ex-status-color1);
                    background-color: var(--ex-status-bg1);
                    box-sizing: border-box;
                    border-radius: 0.12rem;

                }

                :deep(.split) {
                    font-size: 0.32rem;
                    font-weight: 600;
                    width: 0.3rem;
                    color: var(--ex-status-color1);
                    text-align: center;
                }
            }
        }
    }

    .item:last-child {
        border-bottom: 0px;
    }
}
</style>