<!-- 订单详情 -->
<template>
    <div class="order_info">

        <!-- tabs -->
        <div class="tabs">
            <div class="tab" @click="active = 1" :class="{ 'active_tab': active == 1 }">
                <span>购买</span>
            </div>
            <div class="tab" @click="active = 2" :class="{ 'active_tab': active == 2 }">
                <span>联系商家</span>
                <div class="hint">2</div>
            </div>
        </div>

        <!-- 详情 -->
        <template v-if="active == 1">
            <!-- 顶部详情 -->
            <div class="top">
                <span>{{ currItem.date || '--' }}</span>
                <span style="margin-left: 0.1rem;">{{ currItem.order_no }}</span>
                <div class="copy_icon" @click="copy(currItem.order_no)">
                    <img src="/static/img/common/copy_default.png" alt="copy">
                </div>
            </div>

            <!-- 价格详情 -->
            <div class="info">
                <div class="info_item">
                    <div class="title">总价</div>
                    <div class="val">{{ currItem.totalprice }} {{ currItem.currency }}</div>
                </div>
                <div class="info_item">
                    <div class="title">价格</div>
                    <div class="val">{{ currItem.price }} {{ currItem.currency }}</div>
                </div>
                <div class="info_item">
                    <div class="title">数量</div>
                    <div class="val">{{ currItem.volume }} {{ currItem.crypto }}</div>
                </div>
            </div>

            <!-- 商家详情 -->
            <div class="seller">
                <div class="title_box">
                    <div class="avatar">
                        {{ currItem.merchant_name ? currItem.merchant_name.slice(0, 1) : '' }}
                    </div>
                    <div class="title">{{ currItem.merchant_name }}</div>
                </div>
                <div class="remark">备注 --</div>
            </div>

            <!-- 银行卡 -->
            <div class="bank">
                <div class="bank_title">
                    <div class="bank_icon">
                        <img src="/static/img/user/card_type_b.png" alt="img">
                    </div>
                    <div>银行卡</div>
                </div>

                <div v-if="currItem.bank_status == 'undone'"
                    style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
                    <div style="width: 1rem;height: 1rem;margin-bottom: 0.2rem;">
                        <img src="/static/img/chat/wait.png" alt="img">
                    </div>
                    <div>等待商家提供银行卡</div>
                </div>
                <div class="table" v-if="currItem.bank_status == 'done'">
                    <div class="tr" @click="copy(currItem.bank_name)">
                        <div class="td">银行卡</div>
                        <div class="td td-3">{{ currItem.bank_name }}</div>
                    </div>
                    <div class="tr" @click="copy(currItem.bank_card_number)">
                        <div class="td">卡号</div>
                        <div class="td td-3">{{ currItem.bank_card_number }}</div>
                    </div>
                    <div class="tr" @click="copy(currItem.account_name)">
                        <div class="td">账号</div>
                        <div class="td td-3">{{ currItem.account_name }}</div>
                    </div>
                </div>
            </div>

            <!-- 状态 -->
            <div class="status">
                <!-- 等待买家付款 -->
                <div class="status_wait" v-if="currItem.status == 'waitpayment'">
                    <div style="display: flex;align-items: center;">
                        <div class="amount">等待买家付款</div>
                        <div class="time">{{ formatSec2(currItem.endtime) }}</div>
                    </div>
                    <div>请根据总价，向商家提供的银行卡转账</div>
                </div>
                <!-- 等待确认 -->
                <div class="status_wait" v-if="currItem.status == 'waitconfirm'">
                    <div style="display: flex;align-items: center;">
                        <div class="amount">等待确认</div>
                        <div class="time">{{ formatSec2(currItem.endtime) }}</div>
                    </div>
                    <!-- <div>请根据总价，向商家提供的银行卡转账</div> -->
                </div>
                <!-- 已完成 -->
                <div class="finish_status success_status" v-if="currItem.status == 'done'">
                    <div>已完成</div>
                </div>
                <!-- 已取消 -->
                <div class="finish_status" v-if="currItem.status == 'cancel'">
                    <div>已取消</div>
                </div>
            </div>

            <!-- 按钮 -->
            <div class="btns" :style="{ opacity: loading ? '0.5' : 1 }" v-if="currItem.status = 'waitpayment'">
                <div class="btn" style="margin-right: 0.64rem;" @click="cancelOrder">取消订单</div>
                <div class="btn active_btn" @click="confirmOrder">我已付款</div>
            </div>
        </template>

        <!-- 聊天 -->
        <template v-if="active == 2">
            <Chat style="flex: 1;" />
        </template>

    </div>

    <!-- 安全密码弹窗 -->
    <SafePassword @submit="orderAction" ref="safeRef"></SafePassword>
</template>

<script setup>
import Chat from "./Chat.vue"
import { ref, computed } from "vue"
import { _c2cOrderInfo, _c2cOrderStatus } from "@/api/api"
import { _copyTxt } from "@/utils/index"
import { showToast, showConfirmDialog } from "vant";
import { formatSec2 } from "@/utils/time"
import SafePassword from "@/components/SafePassword.vue"
import store from "@/store"


const emits = defineEmits(['successHanlde'])
const active = ref(1) // 1-详情 2-聊天
const safeRef = ref()

// 详情
const loading = ref(false)
const getInfo = () => {
    loading.value = true
    _c2cOrderInfo({
        order_no: currItem.value.order_no
    }).then(res => {
        if (res.data) {
            currItem.value = JSON.parse(JSON.stringify(res.data || {}))
        }
    }).finally(() => {
        loading.value = false
    })
}
const currItem = ref({})
const open = item => {
    currItem.value = item
    getSessionToken()
    setTimeout(() => {
        getInfo()
    }, 0)
}

defineExpose({
    open
})


const moreDialog = ref(false)
// 放行
const confirmOrder = () => {
    if (loading.value) return
    moreDialog.value = true
    showConfirmDialog({
        title: '确认付款',
        message:
            '确认已经付款给商家?',
    })
        .then(() => {
            action.value = 'confirm'
            safeRef.value.open()
        })
        .catch(() => { }).finally(() => moreDialog.value = false);
}

// 取消
const cancelOrder = () => {
    if (loading.value) return
    moreDialog.value = true
    showConfirmDialog({
        title: '取消',
        message:
            '确认取消该订单?',
    })
        .then(() => {
            action.value = 'cancel'
            safeRef.value.open()
        })
        .catch(() => { }).finally(() => moreDialog.value = false);
}

// 操作状态
const action = ref('')
const orderAction = (s) => {
    loading.value = true
    _c2cOrderStatus({
        order_no: currItem.value.order_no,
        status: action.value,
        token: sessionToken.value,
        safeword: s
    }).then(res => {
        console.error(res)
        if (res.code == 200) {
            showToast('操作成功')
            emits('successHanlde', '')
        }
    }).finally(() => {
        loading.value = false
        getSessionToken()
    })
}

const copy = (val) => {
    if (!val) return
    _copyTxt(val)
    showToast('已复制')
}
// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    store.dispatch("updateSessionToken")
}

</script>


<style lang="less" scoped>
.order_info {
    padding: 0 0.32rem 0.32rem 0.32rem;
    height: 85vh;
    display: flex;
    flex-direction: column;

    .tabs {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .tab {
            margin-right: 0.6rem;
            color: #9EA3AE;
            position: relative;

            .hint {
                position: absolute;
                right: -0.2rem;
                top: -0.1rem;
                background-color: #FD4938;
                border-radius: 0.12rem;
                font-size: 0.24rem;
                color: #fff;
                line-height: 0.2rem;
                padding: 0.04rem 0.08rem;
            }
        }

        .active_tab {
            color: #000;
            font-weight: bold;
        }
    }

    .top {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: #666666;
        font-size: 0.24rem;
        padding: 0.28rem 0;

        .copy_icon {
            width: 0.32rem;
            height: 0.32rem;
        }
    }

    .info {
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        padding: 0.24rem 0;
        border-top: 1px dashed #CBCBCB;
        border-bottom: 1px dashed #CBCBCB;

        .info_item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            text-align: center;

            .title {
                color: #666;
                margin-bottom: 0.24rem;
            }

            .val {
                color: #333;
            }
        }
    }

    .seller {
        padding: 0.24rem 0;
        border-bottom: 1px dashed #CBCBCB;

        .title_box {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: 0.18rem;

            .avatar {
                width: 0.52rem;
                height: 0.52rem;
                border-radius: 50%;
                background-color: #014CFA;
                margin-right: 0.32rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                font-size: 0.36rem;
            }

            .title {
                color: #000;
            }
        }

        .remark {
            font-size: 0.24rem;
            color: #666666;
        }
    }

    .bank {
        padding: 0.24rem 0;

        .bank_title {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: 0.2rem;

            .bank_icon {
                width: 0.4rem;
                height: 0.4rem;
                border-radius: 50%;
                padding: 0.04rem;
                background-color: #D8E4FF;
                margin-right: 0.16rem;
            }
        }

        .table {
            border-left: 1px solid #D4D4D4;
            border-top: 1px solid #D4D4D4;

            .tr {
                display: flex;
                align-items: stretch;

                .td {
                    flex: 1;
                    height: 0.64rem;
                    padding: 0 0.32rem;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    border-right: 1px solid #D4D4D4;
                    border-bottom: 1px solid #D4D4D4;
                }

                .td-3 {
                    flex: 3;
                    justify-content: center;
                }
            }
        }
    }

    .status {
        padding: 0.24rem 0;

        .status_wait {
            line-height: 0.56rem;
            color: #333;

            .amount {
                font-weight: bold;
                color: #000;
                margin-right: 0.2rem;
            }

            .time {
                color: #FD4938;
                font-weight: bold;
                font-size: 0.32rem;
            }
        }

        .finish_status {
            padding: 0.2rem 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.32rem;
            font-weight: bold;
            color: #888888;
        }

        .success_status {
            color: #0AB27D;
        }
    }

    .btns {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0.32rem 0;

        .btn {
            flex: 1;
            height: 0.88rem;
            border-radius: 0.88rem;
            background-color: #EFF6FF;
            color: #014CFA;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .active_btn {
            background-color: #014CFA;
            color: #fff;
        }
    }
}
</style>