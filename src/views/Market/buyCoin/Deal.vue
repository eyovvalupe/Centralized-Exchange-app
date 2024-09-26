<!-- 自选买卖 -->
<template>
    <div class="page-deal">
        <Top :title="title" />

        <!-- 买入 -->
        <div class="form" v-if="info.offset == 'buy'">
            <!-- 信息 -->
            <div class="info" style="margin-bottom: 0.32rem">
                <div>{{ info.merchant }}</div>
                <div class="info_item">{{ info.price }} {{ info.currWallet }}</div>
                <div>订单限额 {{ info.limitmin }}-{{ info.limitmax }}</div>
            </div>

            <div style="margin-bottom: 0.12rem">数量</div>
            <div class="item form_item">
                <input v-model="amount" type="number" class="ipt">
                <span>{{ info.currCrypto }}</span>
            </div>
            <div class="tip">预计支付 {{ showAmount }} {{ info.currWallet }}</div>

            <Button size="large" class="btn" style="margin-top: 4rem;" round :loading="loading" :color="'#18B762'"
                @click="goSubmit">买入</Button>
        </div>

        <!-- 卖出 -->
        <div class="form" v-if="info.offset == 'sell'">
            <!-- 信息 -->
            <div class="info" style="margin-bottom: 0.32rem">
                <div>{{ info.merchant }}</div>
                <div class="info_item">{{ info.price }} {{ info.currWallet }}</div>
                <div>订单限额 {{ info.limitmin }}-{{ info.limitmax }}</div>
            </div>
            <div style="margin-bottom: 0.12rem;display: flex;align-items: center;justify-content: space-between;">
                <span>数量</span>
                <span style="color: #b7b7b7;font-size: 0.24rem;">余额 {{ currWallet.amount }} {{ info.currCrypto }}</span>
            </div>
            <div class="item form_item">
                <input v-model="amount" type="number" class="ipt">
                <div class="all" @click="amount = currWallet.amount">全部</div>
            </div>
            <div class="tip">预计收到：{{ showAmount }} {{ info.currCurrency }}</div>

            <!-- 银行卡 -->
            <div style="margin-bottom: 0.12rem;margin-top:0.32rem">账户</div>
            <div class="card_box" v-if="bankList.length" @click="showAccountDialog = true">
                <div class="card_icon">
                    <img src="/static/img/user/card_type_b.png" alt="img">
                </div>
                <div class="card">
                    <div class="code">{{ _hiddenAccount(bank.bankCardNumber) }}
                    </div>
                    <div class="name">{{ bank.bankName }}</div>

                </div>
            </div>
            <div class="no_card" v-else @click="goAddAccount">
                <span>+ 添加收款账户</span>
            </div>
            <Button size="large" style="margin-top: 1rem;" class="btn" round :loading="loading" :color="'#E8503A'"
                @click="goSubmit">卖出</Button>
        </div>
    </div>

    <!-- 安全密码弹窗 -->
    <SafePassword @submit="submitSell" ref="safeRef"></SafePassword>

    <!-- 账户选择弹窗 -->
    <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" class="self_van_popup"
        v-model:show="showAccountDialog" position="bottom" teleport="body">
        <div class="withdraw_accounr_dialog">
            <div class="close_icon" @click="showAccountDialog = false">
                <img src="/static/img/common/close.png" alt="x">
            </div>
            <div class="title">账户选择</div>
            <div class="list">
                <div class="add_item" @click="goAddAccount">
                    <Icon style="font-size:0.48rem;" name="add-o" />
                    <span style="margin-left: 0.2rem;color:#999999;font-size: 0.24rem;">添加收款账户</span>
                </div>
                <div @click="clickAccountItem(item)" :class="{ 'dialog_account_item_active': bank.id == item.id }"
                    class="dialog_account_item" v-for="(item, i) in bankList" :key="i">
                    <div class="card_icon">
                        <img v-if="item.bankName" src="/static/img/user/card_type_b.png" alt="img">
                        <img v-else src="/static/img/user/card_type_c.png" alt="img">
                    </div>
                    <div class="card">
                        <div class="code">{{ _hiddenAccount(item.bankCardNumber || item.address) }}
                        </div>
                        <div class="name">{{ item.symbol ? `${item.symbol}-${item.network}` :
                            `${item.bankName}` }}</div>

                    </div>
                    <div v-if="bank.id == item.id" class="checked"
                        style="background-image: url('/static/img/user/check_bg.png');">
                        <img src="/static/img/common/ok.png" alt="img">
                    </div>
                </div>
            </div>
        </div>
    </Popup>
</template>

<script setup>
import { ref, computed } from "vue"
import Top from "@/components/Top.vue"
import { useRoute } from "vue-router"
import { Button, showToast, Popup, Icon } from "vant"
import store from "@/store"
import SafePassword from "@/components/SafePassword.vue"
import router from "@/router"
import { _buysell } from "@/api/api"
import Decimal from 'decimal.js';
import { _hiddenAccount } from "@/utils/index"

const accountList = computed(() => store.state.accountList || []) // 收款方式列表
const bankList = computed(() => accountList.value.filter(item => item.channel == 'bank')) // 银行账号列表
const wallet = computed(() => store.state.wallet || []) // 所有钱包
const userInfo = computed(() => store.state.userInfo || {})
const safeRef = ref()

const route = useRoute()
const title = ref(route.query.offset == 'buy' ? '买入' : '卖出')

// 表单
const loading = ref(false)
const info = ref(route.query || {})
const amount = ref('')
const showAmount = computed(() => {
    if (!amount.value || amount.value <= 0) return '--'
    if (info.value.offset == 'buy') {
        return new Decimal(amount.value).mul(info.value.price)
    } else {
        return new Decimal(amount.value).mul(info.value.price)
    }
})
const currWallet = computed(() => {
    return wallet.value.find(item => item.name == info.value.currCrypto)
})

// 账户
const showAccountDialog = ref(false)
const bank = ref(bankList.value[0] || {})
const clickAccountItem = item => {
    bank.value = item
    showAccountDialog.value = false
}
// 跳转添加
const goAddAccount = () => {
    // google检测
    if (!userInfo.value.googlebind) {
        return showConfirmDialog({
            title: '谷歌验证器',
            message:
                '你还未绑定谷歌验证器，是否去绑定?',
        }).then(() => {
            jump('google')
        })
    }
    router.push({
        name: 'account'
    })
}


const goSubmit = () => {
    if (!amount.value || amount.value <= 0) return showToast('请输入金额')
    if (amount.value < info.value.limitmin || amount.value > info.value.limitmax) return showToast(`限额：${info.value.limitmin}-${info.value.limitmax}`)
    if (info.value.offset == "sell") {
        const cueeWallet = wallet.value.find(item => item.name == info.value.currCrypto)
        if (amount.value > cueeWallet.amount) return showToast('余额不足')
        if (!bank.value.id) return showToast('请选择先添加收款账户')
    }
    // 打开密码
    safeRef.value.open()
}

const submitSell = (s) => {
    const params = {
        ad_id: info.value.id,
        volume: amount.value,
        account_id: info.value.offset == 'buy' ? null : bank.value.id,
        token: sessionToken.value,
        safeword: s
    }
    if (loading.value) return
    loading.value = true
    _buysell(params).then(res => {
        if (res.code == 200) {
            showToast('下单成功')
            setTimeout(() => {
                router.back()
            }, 500)
        }
    }).finally(() => {
        setTimeout(() => {
            loading.value = false
        }, 1000)
        getSessionToken()
    })
}


// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    store.dispatch("updateSessionToken")
}
getSessionToken()
</script>

<style lang="less" scoped>
.page-deal {
    padding-top: 1.12rem;

    .form {
        padding: 0 0.32rem 0.32rem 0.32rem;

        .card_box {
            border-radius: 0.12rem;
            height: 1.44rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            background-color: #F6F7FA;
            padding: 0 0.4rem 0 0.36rem;
            overflow: hidden;
            margin-bottom: 0.36rem;

            .card_icon {
                background-color: #D9E4FF;
                width: 0.96rem;
                height: 0.96rem;
                border-radius: 0.16rem;
                display: flex;
                align-items: center;
                justify-content: center;

                >img {
                    width: 0.64rem !important;
                    height: 0.64rem !important;
                }
            }

            .card {
                flex: 1;
                margin: 0 0.2rem 0 0.36rem;
                text-align: left;
                font-size: 0.24rem;
                color: #061023;
                font-weight: 500;
                line-height: 1;

                .code {
                    font-size: 0.28rem;
                    margin-bottom: 0.1rem;
                    font-weight: 400;
                }
            }
        }

        .no_card {
            padding: 0.32rem;
            border-radius: 0.12rem;
            border: 1px dashed #D0D8E2;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .tip {
            color: #b7b7b7;
            font-size: 0.24rem;
            margin-top: 0.24rem;
        }

        .form_item {
            border: 1px solid #D0D8E2;
            height: 0.96rem;
            display: flex;
            align-items: center;
            padding: 0 0.24rem;
            position: relative;
            border-radius: 0.24rem;

            .ipt {
                flex: 1;
                height: 100%;
            }

            .all {
                color: #014CFA;
            }

            .tip_text {
                font-size: 0.28rem;
                color: #A4ACB9;
                position: absolute;
                left: 0.24rem;
                pointer-events: none;
            }
        }

        .info {
            padding: 0.32rem;
            border: 1px solid #D0D8E2;
            border-radius: 0.12rem;

            .info_item {
                font-weight: bold;
                margin: 0.32rem 0;
                font-size: 0.32rem;
            }
        }

        .btn {
            height: 0.96rem;
            color: #fff;
        }
    }
}
</style>
<style lang="less" scoped>
.withdraw_accounr_dialog {
    background-color: #fff;
    border-top-left-radius: 0.4rem;
    border-top-right-radius: 0.4rem;
    overflow: hidden;
    padding: 1.2rem 0.32rem 0.8rem 0.32rem;
    position: relative;

    .title {
        height: 1rem;
        position: absolute;
        top: 0.2rem;
        left: 0;
        text-align: center;
        line-height: 1rem;
        font-size: 0.32rem;
        width: 100%;
        color: #121826;
        pointer-events: none;
        font-weight: bold;
    }

    .close_icon {
        position: absolute;
        width: 0.4rem;
        height: 0.4rem;
        top: 0.24rem;
        right: 0.32rem;
    }

    .swap_dialog_item {
        height: 1.12rem;
        line-height: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #F5F5F5;
        overflow: hidden;
        position: relative;

        .icon {
            width: 0.4rem;
            height: 0.4rem;
            margin-right: 0.24rem;
        }
    }

    .swap_dialog_item_active {
        color: #014CFA;
        font-weight: 600;

        .check_icon {
            position: absolute;
            right: 0.24rem;
            color: #014CFA;
            font-size: 0.28rem;
        }
    }

    .search_box {
        height: 0.8rem;
        background-color: #F5F5F5;
        border-radius: 0.4rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.32rem;
        padding: 0 0.4rem;

        input {
            flex: 1;
            color: #121826;
        }
    }

    .tabs {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 0.4rem;

        .tab {
            height: 0.72rem;
            border-radius: 0.72rem;
            display: flex;
            align-items: center;
            padding: 0 0.4rem;
            color: #061023;
            font-size: 0.32rem;
            font-weight: 400;
        }

        .active_tab {
            background-color: #F6F8FF;
            color: #014CFA;
            font-weight: 500;
        }
    }

    .list {
        max-height: 70vh;
        overflow-y: auto;

        .add_account {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.4rem 0;
        }
    }

    .add_item {
        margin-bottom: 0.36rem;
        border: 1px dashed #CCD7FD;
        border-radius: 0.12rem;
        height: 1.44rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .dialog_account_item {
        border-radius: 0.12rem;
        height: 1.44rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        background-color: #F6F7FA;
        padding: 0 0.4rem 0 0.36rem;
        overflow: hidden;
        margin-bottom: 0.36rem;

        .card_icon {
            background-color: #D9E4FF;
            width: 0.96rem;
            height: 0.96rem;
            border-radius: 0.16rem;
            display: flex;
            align-items: center;
            justify-content: center;

            >img {
                width: 0.64rem !important;
                height: 0.64rem !important;
            }
        }

        .card {
            flex: 1;
            margin: 0 0.2rem 0 0.36rem;
            text-align: left;
            font-size: 0.24rem;
            color: #061023;
            font-weight: 500;
            line-height: 1;

            .code {
                font-size: 0.28rem;
                margin-bottom: 0.1rem;
                font-weight: 400;
            }
        }


    }

    .dialog_account_item_active {
        border: 1px solid #1A59F6;

        .checked {
            position: absolute;
            top: -0.04rem;
            right: -0.04rem;
            background-size: 100% 100%;
            width: 0.46rem;
            height: 0.42rem;

            >img {
                width: 0.18rem !important;
                height: 0.12rem !important;
                position: absolute;
                right: 0.06rem;
                top: 0.08rem;
            }
        }
    }

}
</style>
