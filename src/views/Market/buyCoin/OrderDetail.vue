<!-- 买币-订单详情 -->
<template>
    <div class="page-detail">
        <Top :title="statusEnum[currItem.status]?.title" class="!z-20" :back-func="goBack" />
        <!-- Tabs -->
        <div class="tabs">
            <div @click="active = 1" class="tab" :class="{ 'tab_active': active == 1 }">
                <span>买入</span>
            </div>
            <div @click="active = 2" class="tab" :class="{ 'tab_active': active == 2 }">
                <span style="position: relative;">
                    联系商家

                    <div class="hint" v-if="c2cUnread[currItem.order_no] || currItem.unread">{{
                        c2cUnread[currItem.order_no] || currItem.unread }}</div>
                </span>

            </div>
        </div>

        <template v-if="active == 1">
            <!-- 详情 -->
            <div class="detail_box">
                <!-- 状态 -->
                <div class="status">
                    <!-- 等待买家付款 -->
                    <div v-if="currItem.status == 'waitpayment' && currItem.offset == 'buy'" class="status_wait">
                        <div style="display: flex; align-items: center">
                            <div class="amount">等待买家付款</div>
                            <div class="time">{{ formatSec2(currItem.endtime) }}</div>
                        </div>
                        <div>请根据总价，向商家提供的银行卡转账</div>
                    </div>
                    <!-- 等待商家付款 -->
                    <div v-if="currItem.status == 'waitpayment' && currItem.offset == 'sell'" class="status_wait">
                        <div style="display: flex; align-items: center">
                            <div class="amount">等待商家付款</div>
                            <div class="time">{{ formatSec2(currItem.endtime) }}</div>
                        </div>
                        <div>等待商家付款</div>
                    </div>
                    <!-- 等待确认 -->
                    <div v-if="currItem.status == 'waitconfirm' && currItem.offset == 'buy'" class="status_wait">
                        <div style="display: flex; align-items: center">
                            <div class="amount">等待确认</div>
                            <div class="time">{{ formatSec2(currItem.endtime) }}</div>
                        </div>
                        <div>已付款，等待商家确认资金是否到账</div>
                    </div>
                    <div v-if="currItem.status == 'waitconfirm' && currItem.offset == 'sell'" class="status_wait">
                        <div style="display: flex; align-items: center">
                            <div class="amount">等待确认</div>
                            <div class="time">{{ formatSec2(currItem.endtime) }}</div>
                        </div>
                        <div>商家已付款，请确认资金是否到账</div>
                    </div>

                    <!-- 已完成 -->
                    <div v-if="currItem.status == 'done'" class="finish_status success_status">
                        <div>已完成</div>
                    </div>
                    <!-- 已取消 -->
                    <div v-if="currItem.status == 'cancel'" class="finish_status">
                        <div>已取消</div>
                    </div>
                </div>
                <!-- 卖家 -->
                <div class="detail_content">
                    <div class="seller">
                        <div style="display: flex;align-items: center;justify-content: flex-start;">
                            <div class="avatar">
                                {{ currItem.merchant_name ? currItem.merchant_name.slice(0, 1) : '' }}
                            </div>
                            <div class="title">{{ currItem.merchant_name }}</div>
                        </div>
                        <div style="display: flex;align-items: center;justify-content: flex-start;margin-top: 0.06rem;">
                            <div class="avatar" style="opacity: 0;"></div>
                            <div class="info">成交量 {{ currItem.merchant_volume || '0' }}</div>
                            <div class="line"></div>
                            <div class="info">成交率 {{ currItem.merchant_volumerate || '0' }}%</div>
                            <div class="line"></div>
                            <div class="info">
                                <IconSvg name="clock" class="sizi-[0.25rem] mr-1" />
                                <span>{{ currItem.merchant_avetime }}分钟</span>
                            </div>
                        </div>
                    </div>

                    <!-- 银行卡 -->
                    <div class="bank_none" v-if="currItem.bank_status == 'undone' && currItem.offset == 'buy'">
                        <div class="img">
                            <img src="/static/img/market/waitFor.svg" alt="" />
                        </div>
                        <div class="name">请等待商家提供银行卡</div>
                    </div>
                    <div class="bank" v-if="currItem.bank_status == 'done'">
                        <div class="tr">
                            <div class="td">银行卡</div>
                            <div class="td td2">{{ currItem.bank_name }}</div>
                        </div>
                        <div class="tr" @click="copy(currItem.bank_card_number)">
                            <div class="td">卡号</div>
                            <div class="td td2">
                                <span>{{ currItem.bank_card_number }}</span>
                                <div class="copy">
                                    <img src="/static/img/trade/copy.png" alt="" />
                                </div>
                            </div>
                        </div>
                        <div class="tr">
                            <div class="td">账号</div>
                            <div class="td td2">{{ currItem.account_name }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 订单 -->
            <div class="order">
                <div class="top" @click="copy(currItem.order_no)">
                    <div class="order_no">{{ currItem.order_no }}</div>
                    <div class="copy_icon">
                        <img src="/static/img/trade/copy.png" alt="" />
                    </div>
                    <div style="flex: 1;"></div>
                    <div>{{ currItem.date }}</div>
                </div>
                <div class="info_block">
                    <div class="info">
                        <div class="amount">{{ currItem.totalprice }}</div>
                        <div>总价({{ currItem.currency }})</div>
                    </div>
                    <div class="info">
                        <div class="amount">{{ currItem.price }}</div>
                        <div>价格({{ currItem.currency }})</div>
                    </div>
                    <div class="info">
                        <div class="amount">{{ currItem.volume }}</div>
                        <div>数量({{ currItem.currency }})</div>
                    </div>
                </div>
            </div>

            <!-- 按钮 -->
            <div class="max-width btns" v-if="['waitpayment', 'waitconfirm'].includes(currItem.status)">
                <div v-if="currItem.offset == 'buy' && currItem.status == 'waitpayment'" class="btn"
                    style="margin-right: 0.32rem" @click="cancelOrder">取消订单
                </div>
                <div v-if="currItem.status == 'waitpayment' && currItem.offset == 'sell'" class="btn active_btn"
                    :style="{ backgroundColor: '#ddd' }">等待确认</div>
                <div v-if="currItem.offset == 'buy' && currItem.status == 'waitpayment'" class="btn active_btn"
                    @click="confirmOrder">我已付款
                </div>
                <div v-if="currItem.offset == 'sell' && currItem.status == 'waitconfirm'" class="btn active_btn"
                    @click="confirmOrder">我已收款
                </div>

            </div>
        </template>

        <!-- 聊天 -->
        <Chat v-else :curr-item="currItem" class="size-full" />

        <!-- 安全密码弹窗 -->
        <SafePassword ref="safeRef" @submit="orderAction" />
    </div>
</template>

<script setup>
import Top from '@/components/Top.vue'
import router from "@/router"
import { _c2cOrderInfo, _c2cOrderStatus } from '@/api/api'
import { useRoute } from "vue-router"
import { ref, computed, onBeforeUnmount, onMounted } from "vue"
import store from "@/store"
import { formatSec2 } from '@/utils/time'
import IconSvg from '@/components/IconSvg.vue'
import { _copyTxt } from '@/utils'
import { closeToast, showLoadingToast, showToast } from 'vant'
import SafePassword from '@/components/SafePassword.vue'
import Chat from './Chat.vue'

const route = useRoute()
// 未读消息
const c2cUnread = computed(() => store.state.c2cUnread || {})
const active = ref(1) // 1-详情 2-聊天
const safeRef = ref()

const statusEnum = {
    waitpayment: { name: '待付款', title: '待付款', color: 'var(--main-color)' },
    waitconfirm: { name: '待确认', title: '待确认', color: 'var(--main-color)' },
    done: { name: '交易完成', title: '交易完成', color: '#18B762' },
    cancel: { name: '交易已取消', title: '交易完成', color: '#8F92A1' },
}

// 订单数据
const currItem = ref({
    order_no: '', // 订单号
    offset: '', // 方向
    crypto: '', // 加密货币
    currency: '', // 计价货币
    price: 0, // 价格
    volume: 0, // 数量
    totalprice: 0, // 总价
    status: '', // 状态
    date: '', // 订单时间，格式：MM-dd hh:mm
    endtime: '', // 结束时间
    bank_status: '', // 银行状态
    bank_name: '', // 银行
    bank_card_number: '', // 银行卡号
    account_name: '', // 账户
    merchant_name: '', // 商户-名称
    merchant_volume: 0, // 商户-成交量
    merchant_volumerate: 0, // 商户-成交率
    merchant_avetime: '', // 商户-平均时效
    unread: 0, // 对话未读消息数
})

// 获取详情
const infoLoading = ref(false)
const getInfo = () => {
    if (infoLoading.value) return
    if (!route.query.order_no) return
    infoLoading.value = true
    _c2cOrderInfo({
        order_no: route.query.order_no,
    }).then(res => {
        console.error('--订单详情', res.data)
        Object.assign(currItem.value, res.data)
    }).finally(() => {
        setTimeout(() => {
            infoLoading.value = false
        }, 1000)
    })
}
getInfo()

// 操作状态
const action = ref('')
const loading = ref(false)
// 撤销订单
const cancelOrder = () => {
    if (loading.value) return
    action.value = 'cancel'
    safeRef.value.open()
}
// 下一步
const confirmOrder = () => {
    if (loading.value) return
    // 购买-待付款-商家未提供银行卡
    if (!currItem.value.bank_card_number && currItem.value.offset == 'buy' && currItem.value.status == 'waitpayment') {
        getInfo()
        return showToast('请等待商家提供银行卡')
    }
    action.value = currItem.value.offset == 'buy' ? 'payment' : 'confirm'
    safeRef.value.open()
}
const orderAction = s => {
    loading.value = true
    showLoadingToast({ duration: 0, loadingType: 'spinner' })
    _c2cOrderStatus({
        order_no: currItem.value.order_no,
        status: action.value,
        token: sessionToken.value,
        safeword: s,
    })
        .then(res => {
            if (res.code == 200) {
                setTimeout(() => {
                    showToast({
                        payment: '付款成功',
                        confirm: '放行成功',
                        cancel: '取消成功'
                    }[action.value])
                }, 500)
            }
            getInfo()
        })
        .finally(() => {
            setTimeout(() => {
                loading.value = false
            }, 500)
            closeToast()
            getSessionToken()
        })
}


let interval = null
let countInterval = null
onMounted(() => {
    interval = setInterval(() => {
        if (currItem.value.status == 'waitpayment' || currItem.value.status == 'waitconfirm') {
            getInfo()
        }
    }, 5000)
    countInterval = setInterval(() => {
        if (currItem.value.endtime) {
            currItem.value.endtime--
            if (currItem.value.endtime == 0) {
                clearInterval(countInterval)
                setTimeout(() => {
                    getInfo()
                }, 1000)
            }
        }
    }, 1000)
})
onBeforeUnmount(() => {
    if (interval) clearInterval(interval)
    if (countInterval) clearInterval(countInterval)
})

const goBack = () => {
    router.back()
}

//  复制
const copy = text => {
    _copyTxt(text)
    showToast('已复制')
}

// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    store.dispatch('updateSessionToken')
}
getSessionToken()
</script>

<style lang="less" scoped>
.page-detail {
    padding: 1.44rem 0.32rem 2.4rem 0.32rem;

    .tabs {
        height: 0.8rem;
        border-radius: 1.3rem;
        background-color: #F5F7FC;
        display: flex;
        overflow: hidden;
        margin-bottom: 0.4rem;

        .tab {
            flex: 1;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666D80;
            text-align: center;
            font-size: 0.3rem;
            font-weight: 400;
            transition: all ease .2s;
            position: relative;

            .hint {
                min-width: 0.24rem;
                height: 0.24rem;
                background-color: #E8503A;
                padding: 0.06rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #FFF;
                font-size: 0.16rem;
                font-weight: 400;
                border-radius: 0.12rem;
                position: absolute;
                right: 0;
                top: 0;
                transform: translateX(100%) translateY(-100%);
            }
        }

        .tab_active {
            background-color: #014CFA;
            color: #fff;
            border-radius: 1.3rem;
        }
    }

    .detail_box {
        background-color: #F5F7FC;
        border: 1px solid #D0D8E2;
        border-radius: 0.32rem;

        .status {
            min-height: 1rem;
            padding: 0.24rem 0.32rem;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;

            .status_wait {
                color: #8F92A1;
                font-size: 0.24rem;
                font-weight: 400;
                line-height: 0.5rem;

                .amount {
                    color: #000;
                    font-size: 0.3rem;
                    font-weight: 600;
                }

                .time {
                    color: #E8503A;
                    font-size: 0.32rem;
                    font-weight: 600;
                    margin-left: 0.16rem;
                }
            }

            .finish_status {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                color: #8F92A1;
                font-size: 0.3rem;
                font-weight: 600;
                line-height: 0.5rem;
            }

            .success_status {
                color: #18B762;
            }
        }

        .detail_content {
            padding: 0.2rem 0 0.36rem 0;
            border: 1px solid #D0D8E2;
            border-radius: 0.32rem;
            position: relative;
            bottom: -1px;
            background-color: #fff;

            .bank {
                background-color: #F5F7FC;
                border-radius: 0.32rem;
                overflow: hidden;
                margin: 0.32rem 0.32rem 0 0.32rem;

                .tr {
                    display: flex;
                    align-items: stretch;
                    border-bottom: 0.08rem solid #fff;
                    min-height: 0.7rem;

                    &:nth-last-child {
                        border-bottom: none
                    }

                    .td {
                        flex: 1;
                        border-right: 0.08rem solid #fff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #666D80;
                        font-size: 0.28rem;
                        font-weight: 400;

                        .copy {
                            width: 0.2rem;
                            height: 0.2rem;
                            margin-left: 0.08rem
                        }
                    }

                    .td2 {
                        flex: 2;
                        border-right: none;
                        color: #061023;
                        font-size: 0.28rem;
                        font-weight: 400;
                    }
                }
            }

            .bank_none {
                padding-top: 0.4rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                .img {
                    width: 1.82rem;
                    height: 1.46rem
                }

                .name {
                    color: #8F92A1;
                    font-size: 0.24rem;
                    font-weight: 400;
                    margin-top: 0.2rem
                }
            }

            .seller {
                padding: 0 0.32rem 0.2rem 0.32rem;
                border-bottom: 0.02rem dashed #EFF3F8;

                .avatar {
                    width: 0.48rem;
                    height: 0.48rem;
                    margin-right: 0.12rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background-color: #A7BEF4;
                    color: #014CFA;
                    font-size: 0.24rem;
                    font-weight: 600;
                }

                .title {
                    color: #061023;
                    font-size: 0.32rem;
                    font-weight: 400;
                }

                .info {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    color: #8F92A1;
                    font-size: 0.24rem;
                    font-weight: 400;


                }

                .line {
                    width: 1px;
                    height: 0.24rem;
                    background-color: #8F92A1;
                    margin: 0 0.12rem;
                }
            }
        }
    }

    .order {
        background-color: #F5F7FC;
        border-radius: 0.32rem;
        margin-top: 0.2rem;

        .top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.2rem 0.32rem;
            border-bottom: 1px solid #EFF3F8;
            color: #8F92A1;
            font-size: 0.24rem;
            font-weight: 400;

            .order_no {
                color: #666;
                font-size: 0.28rem;
                font-weight: 400;
            }

            .copy_icon {
                width: 0.32rem;
                height: 0.32rem;
                cursor: pointer;
                margin-left: 0.04rem;
            }
        }

        .info_block {
            display: flex;
            align-items: stretch;
            padding: 0.36rem 0.32rem 0.46rem 0.32rem;
            margin-top: 0.2rem;

            .info {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #666D80;
                font-size: 0.24rem;
                font-weight: 400;
                line-height: 0.28rem;

                .amount {
                    margin-bottom: 0.2rem;
                    color: #061023;
                    text-align: center;
                    font-size: 0.32rem;
                    font-weight: 600;
                    line-height: 0.32rem;
                }
            }
        }
    }

    .btns {
        width: 100%;
        display: flex;
        align-items: center;
        position: fixed;
        bottom: 0.4rem;
        left: 50%;
        transform: translateX(-50%);
        padding: 0 0.32rem;
        justify-content: space-between;

        .btn {
            flex: 1;
            height: 100%;
            height: 0.96rem;
            border-radius: 1.26rem;
            border: 1px solid #D0D8E2;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666D80;
            text-align: center;
            font-size: 16px;
            font-weight: 400;
            line-height: 24px;
        }

        .active_btn {
            background-color: #014CFA;
            color: #fff;
        }
    }
}
</style>