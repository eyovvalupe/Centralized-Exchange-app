<!-- ai持仓 -->
<template>
    <div class="page_ai_position">
        <div class="list">
            <div class="item" v-for="(item, i) in aiPositionsList" :key="i" @click="openInfo(item)">
                <div class="ai_icon">
                    <img src="/static/img/trade/ai_order.png" alt="ai">
                </div>
                <div class="mid">
                    <div class="name">{{ item.name }}</div>
                    <div class="mid_block">
                        <div class="tag" :class="[item.offset == 'long' ? 'up' : 'down']">{{ item.offset == 'long'
                            ? '买涨' : '买跌' }}</div>
                        <div class="grid">{{ item.lever }}</div>
                    </div>
                </div>
                <div class="right">
                    <div class="amount">{{ item.amount }}</div>
                    <div class="time">{{ item.date }}</div>
                </div>
            </div>
        </div>
    </div>

    <!-- 详情 -->
    <AiInfo ref="infoRef" />
</template>

<script setup>
import { useSocket } from "@/utils/ws";
import { onMounted, onUnmounted, computed, ref } from "vue"
import store from '@/store';
import AiInfo from "../components/AiInfo.vue"

// 详情
const infoRef = ref()
const openInfo = item => {
    infoRef.value && infoRef.value.open(item)
}



const token = computed(() => store.state.token)
const aiPositionsList = computed(() => store.state.aiPositionsList || [])
const { startSocket } = useSocket();


// 订阅
const loading = ref(false)
const subs = () => {
    const socket = startSocket(() => {
        socket && socket.off('user')
        socket && socket.off('aiquantorder')
        socket && socket.emit('user', token.value)
        socket && socket.emit('aiquantorder', '#all')
        loading.value = true
        socket.on('aiquantorder', res => {
            // console.error('持仓', res)
            store.commit('setAiPositionsList', (res.data || []))
            loading.value = false
        })
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
</script>

<style lang="less" scoped>
.page_ai_position {
    .list {
        padding: 0.2rem 0.32rem;

    }

    .item {
        display: flex;
        align-items: center;
        padding: 0.2rem;
        border-bottom: 1px solid #EAEAEA;
        color: #333;
        line-height: 0.5rem;

        .ai_icon {
            width: 0.64rem;
            height: 0.64rem;
        }

        .mid {
            flex: 1;
            margin: 0 0.2rem 0 0.3rem;

            .name {
                font-size: 0.32rem;
                color: #000;
                font-weight: bold;
            }

            .mid_block {
                display: flex;
                align-items: center;

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
            }
        }
    }
}
</style>