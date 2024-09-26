<!-- 订单列表 -->
<template>
    <div class="buycoin_list" v-if="token">

        <div class="list">

            <!-- 当前订单 -->
            <div class="item" v-for="(item, i) in list" :key="i" @click="openOrderInfo(item)">
                <div class="avatar">
                    <img src="/static/img/crypto/USDT.png" alt="coin">

                    <div class="nav_num" v-if="c2cUnread[item.order_no]">{{ c2cUnread[item.order_no] }}</div>
                </div>
                <div class="left">
                    <div style="margin-bottom: 0.2rem;">
                        <span class="type">{{ item.offset == 'buy' ? '购入' : '售出' }} {{ item.crypto }}</span>
                        <span>{{ item.volume }}</span>
                    </div>
                    <div class="no">{{ item.order_no }}</div>
                </div>
                <div class="right">
                    <div class="right_top">
                        <!-- 进行中 -->
                        <template v-if="item.status == 'waitpayment' || item.status == 'waitconfirm'">
                            <div class="amount">{{ formatSec2(item.endtime) }}</div>
                        </template>
                        <!-- 完成 -->
                        <template v-if="item.status == 'done' || item.status == 'cancel'">
                            <div class="amount" :class="item.offset == 'buy' ? 'down' : 'up'">{{ item.offset == 'buy' ?
                                '-'
                                : '+' }}{{ item.totalprice }}</div>
                            <div class="unit">{{ item.currency }}</div>
                        </template>
                    </div>
                    <div class="status" :class="['status_' + item.status]">{{ statusMap(item.status, item.offset) }}
                    </div>
                </div>
            </div>


            <NoData v-if="!loading && !list.length" />
            <LoadingMore :classN="'buycoin_self'" :loading="loading" :finish="finish"
                v-if="(finish && list.length) || (!finish)" />
        </div>
    </div>
    <UnLogin @loginfinish="loginfinish" v-show="!token" />


    <!-- 订单弹窗 -->
    <Popup teleport="body" v-model:show="showPopupInfo" round position="bottom" closeable>
        <div class="buycoin_orderinfo_dialog">
            <div class="orderinfo_dialog_title">订单详情</div>
            <OrderInfo v-if="showPopupInfo" @successHanlde="successOrder" ref="OrderInfoRef" />
        </div>
    </Popup>
</template>

<script setup>

import { onMounted, onUnmounted, computed, ref, onActivated } from "vue"
import store from '@/store';
import NoData from "@/components/NoData.vue"
import UnLogin from "@/components/UnLogin.vue"
import { formatSec2 } from "@/utils/time"
import OrderInfo from "./OrderInfo.vue"
import { Popup } from "vant"
import { _c2cOrderList } from "@/api/api"
import LoadingMore from "@/components/LoadingMore.vue"

const loginfinish = () => {
    setTimeout(() => {
        init()
    }, 100)
}

// 未读消息
const c2cUnread = computed(() => store.state.c2cUnread || {})

// 订单详情
const OrderInfoRef = ref()
const showPopupInfo = ref(false)
const openOrderInfo = item => {
    showPopupInfo.value = true
    setTimeout(() => {
        OrderInfoRef.value && OrderInfoRef.value.open(item)
    }, 100)
}
const successOrder = () => {
    showPopupInfo.value = false
    // 获取列表数据
    store.commit('setC2cList', [])
    setTimeout(() => {
        init()
    }, 100)
}


// 状态
const statusMap = (key, type) => {
    return {
        waitpayment: type == 'buy' ? '等待付款' : '等待收款',
        waitconfirm: '等待确认',
        done: '完成',
        cancel: '取消'
    }[key]
}

const token = computed(() => store.state.token)
const c2cList = computed(() => store.state.c2cList || [])
const c2cLasttime = computed(() => store.state.c2cList || {})

// 列表
const loading = ref(false)
const finish = ref(false)
const list = ref([])
const page = ref(0)
const getData = () => {
    if (loading.value || finish.value) return
    loading.value = true
    page.value++
    _c2cOrderList({
        page: page.value,
    }).then(res => {
        setTimeout(() => {
            loading.value = false
        }, 100)
        if (page.value == 1) {
            list.value = res.data || []
        } else {
            list.value.push(...(res.data || []))
        }

        if (!res.data?.length) {
            finish.value = true
        }

        setTimeout(() => {
            const obj = {}
            list.value.forEach(item => {
                if (c2cLasttime.value[item.order_no]) {
                    obj[item.order_no] = c2cLasttime.value[item.order_no]
                } else {
                    obj[item.order_no] = Date.now()
                }
            })
            store.commit('setC2cLasttime', obj)
        }, 0)
    }).catch(() => {
        loading.value = false
    })
}
const init = () => {
    page.value = 0
    loading.value = false
    finish.value = false
    setTimeout(() => {
        if (token.value) {
            getData()
        }
    }, 0)
}
init()
// 监听
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
let moreDom = null
const scrollHandle = () => {
    if (!moreDom) return
    const rect = moreDom.getBoundingClientRect()
    if (rect.top <= totalHeight) {
        // 加载更多
        getData()
    }
}


let interval = null

onActivated(() => {
    setTimeout(() => {
        moreDom = document.querySelector('.buycoin_self')
    }, 500)
})
onMounted(() => {
    interval = setInterval(() => {
        list.value.forEach(item => {
            if (item.endtime) {
                item.endtime--
            }
        })
    }, 1000)
    if (token.value) {
        setTimeout(() => {
            moreDom = document.querySelector('.buycoin_self')
            document.querySelector('.page').addEventListener('scroll', scrollHandle)
        }, 500)
    }
})
onUnmounted(() => {
    if (interval) clearInterval(interval)
    try {
        document.querySelector('.page').removeEventListener('scroll', scrollHandle)
    } catch { }
})

defineExpose({
    init
})
</script>

<style lang="less" scoped>
.buycoin_orderinfo_dialog {
    position: relative;

    .orderinfo_dialog_title {
        font-size: 0.32rem;
        line-height: 0.6rem;
        text-align: center;
        margin-bottom: 0.2rem;
        margin-top: 0.2rem;
        font-weight: bold;
    }

}

.buycoin_list {
    .list {
        padding: 0.2rem 0.32rem;

        .item {
            padding: 0.24rem 0.32rem;
            border-bottom: 1px dashed #e8e8e8;
            display: flex;
            align-items: center;
            line-height: 0.36rem;

            .avatar {
                width: 0.64rem;
                height: 0.64rem;
                margin-right: 0.4rem;
                flex-shrink: 0;
                position: relative;

                .nav_num {
                    width: 0.28rem;
                    height: 0.28rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #FF3B30;
                    font-size: 0.2rem;
                    color: #fff;
                    font-weight: 400;
                    border-radius: 50%;
                    position: absolute;
                    top: -0.1rem;
                    right: -0.12rem;
                }
            }

            .left {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: space-between;

                .type {
                    margin-right: 0.32rem;
                    color: #000;
                }

                .no {
                    font-size: 0.24rem;
                    color: #999;
                    padding: 0.05rem 0;
                }
            }

            .right {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                justify-content: space-between;

                .right_top {
                    display: flex;
                    align-items: center;
                }

                .amount {
                    font-size: 0.36rem;
                    font-weight: bold;
                }

                .unit {
                    margin-left: 0.1rem;
                }

                .status {
                    margin-top: 0.24rem;
                    font-size: 0.24rem;
                    padding: 0.05rem 0.32rem;
                    background-color: #F6F6F6;
                    color: #888888;
                }

                .status_waitpayment {
                    color: #FFAF2A;
                    background-color: #FFFAF2;
                }

                .status_waitconfirm {
                    color: #FFAF2A;
                    background-color: #FFFAF2;
                }

                .status_done {
                    color: #30BF87;
                    background-color: #EBFEED;
                }
            }
        }
    }
}
</style>