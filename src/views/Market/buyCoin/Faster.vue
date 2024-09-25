<!-- 快捷区 -->
<template>
    <div class="page_fasters">
        <div class="form">

            <div class="tabs">
                <div class="tab" @click="changeTab('buy')" :class='{ "active_tab": form1.offset == "buy" }'>买入</div>
                <div class="tab" @click="changeTab('sell')" :class='{ "active_tab": form1.offset == "sell" }'>卖出</div>
            </div>

            <!-- 售出 -->
            <div class="item_box">
                <div class="item_box_left">
                    <div class="subtitle">
                        <span>售出</span>
                        <span v-if="form1.offset == 'sell' && token">最大可用 {{ currOut.amount }}</span>
                    </div>
                    <div class="item" :class="{ 'item_focus': priceFocus }">
                        <span class="ipt_tip" v-if="form1.offset == 'sell' && token"
                            v-show="form1.volume === '' || priceFocus">≤
                            {{ currOut.amount }}</span>
                        <input v-model="form1.volume" @focus="priceFocus = true" @blur="priceFocus = false"
                            type="number" class="ipt">
                    </div>
                </div>
                <div class="item_box_right">
                    <div class="subtitle" v-if="token" @click="jump('transfer')"><span>&nbsp;</span><span
                            class="link">划转</span>
                    </div>
                    <div class="subtitle" v-if="!token">&nbsp;</div>
                    <div @click="openDialog(1)" class="item" :class="{ 'item_focus': priceFocus }"
                        style="justify-content: center;border:1px solid #d0d8e2!important">
                        <div class="icon" v-if="currOut.name">
                            <img :src="`/static/img/crypto/${currOut.name.toUpperCase()}.png`" alt="currency">
                        </div>
                        <span>{{ currOut.name || '--' }}</span>
                        <div class="more_icon">
                            <img src="/static/img/trade/down.png" alt="↓">
                        </div>
                    </div>
                </div>

            </div>

            <!-- 收到 -->
            <div class="item_box">
                <div class="item_box_left">
                    <div class="subtitle"><span>收到</span></div>
                    <div class="item">
                        {{ getMoney }}
                    </div>
                </div>
                <div class="item_box_right">
                    <div class="subtitle"><span>&nbsp;</span></div>
                    <div @click="openDialog(2)" class="item" :class="{ 'item_focus': priceFocus }"
                        style="justify-content: center;border:1px solid #d0d8e2!important">
                        <div class="icon" v-if="currIn.name">
                            <img :src="`/static/img/crypto/${currIn.name.toUpperCase()}.png`" alt="currency">
                        </div>
                        <span>{{ currIn.name || '--' }}</span>
                        <div class="more_icon">
                            <img src="/static/img/trade/down.png" alt="↓">
                        </div>
                    </div>
                </div>

            </div>
            <div class="tip">预计价格&nbsp;&nbsp;1&nbsp;{{ currOut.name }} ≈ {{ rate || '--' }}&nbsp;{{ currIn.name }}</div>

            <Button v-if="token" size="large" class="submit" round :loading="loading" @click="sell"
                :color="form1.offset == 'sell' ? '#E8503A' : '#18B762'">{{ form1.offset == 'sell' ? '卖出' : '买入'
                }}</Button>

            <Button size="large" color="#014cfa" round v-if="!token" style="margin-bottom: 0.34rem;margin-top: 1.6rem;"
                @click="store.commit('setIsLoginOpen', true)">登录</Button>
            <Button size="large" color="#f2f2f2" round v-if="!token" style="color: #999999"
                @click="jump('register')">注册</Button>
        </div>
    </div>

    <!-- 售出币种 -->
    <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" class="self_van_popup" v-model:show="showDialog"
        position="bottom" teleport="body">
        <div class="withdraw_accounr_dialog">
            <div class="close_icon" @click="showDialog = false">
                <img src="/static/img/common/close.png" alt="x">
            </div>
            <div class="title">币种选择</div>
            <div @click="clickItem(item)" class="swap_dialog_item"
                :class="{ 'swap_dialog_item_active': (showDialogType == 1 ? currOut.name == item.name : currIn.name == item.name) }"
                v-for="(item, i) in (showDialogType == 1 ? outWallet : inWallet)" :key="i">
                <div class="icon">
                    <img :src="`/static/img/crypto/${item.name.toUpperCase()}.png`" alt="currency">
                </div>
                <span>{{ item.name.toUpperCase() }}</span>
                <Icon v-if="(showDialogType == 1 ? currOut.name == item.name : currIn.name == item.name)"
                    class="check_icon" name="success" />
            </div>
        </div>
    </Popup>

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
                <div @click="clickAccountItem(item)"
                    :class="{ 'dialog_account_item_active': form1.account_id == item.id }" class="dialog_account_item"
                    v-for="(item, i) in bankList" :key="i">
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
                    <div v-if="form1.account_id == item.id" class="checked"
                        style="background-image: url('/static/img/user/check_bg.png');">
                        <img src="/static/img/common/ok.png" alt="img">
                    </div>
                </div>
            </div>
        </div>
    </Popup>

    <!-- 安全密码弹窗 -->
    <SafePassword @submit="submitSell" ref="safeRef"></SafePassword>
</template>

<script setup>
import { ref, computed } from "vue"
import { Button, Popup, Icon, showToast, showConfirmDialog } from "vant"
import store from "@/store"
import router from "@/router"
import { _swapRate, _orderFast } from "@/api/api"
import Decimal from 'decimal.js';
import { _hiddenAccount } from "@/utils/index"
import SafePassword from "@/components/SafePassword.vue"

const safeRef = ref()
const token = computed(() => store.state.token)
const wallet = computed(() => token.value ? store.state.wallet : currencyList.value) // 所有钱包
const accountList = computed(() => store.state.accountList || []) // 收款方式列表
const bankList = computed(() => accountList.value.filter(item => item.channel == 'bank')) // 银行账号列表
const userInfo = computed(() => store.state.userInfo || {})
const currencyList = computed(() => store.state.currencyList || [])

// 售出
const loading = ref(false)
const sell = () => {
    if (!form1.value.volume || form1.value.volume <= 0) return showToast('请输入金额')
    if (form1.value.offset == "sell") {
        if (form1.value.volume > currOut.value.amount) return showToast('余额不足')
        showAccountDialog.value = true
    } else {
        safeRef.value.open()
    }
}
const submitSell = (s) => {
    loading.value = true
    const params = {
        offset: form1.value.offset,
        account_id: form1.value.offset == 'sell' ? form1.value.account_id : null,
        volume: form1.value.volume,
        crypto: form1.value.offset == 'sell' ? currOut.value.currency : currIn.value.currency,
        currency: form1.value.offset == 'sell' ? currIn.value.currency : currOut.value.currency,
        token: sessionToken.value,
        safeword: s
    }
    _orderFast(params).then(res => {
        console.error('???', res)
    }).finally(() => {
        loading.value = false
        getSessionToken()
    })
}


const priceFocus = ref(false)
const getMoney = computed(() => {
    if (!form1.value.volume || !rate.value) return '--'
    return new Decimal(form1.value.volume).mul(rate.value) || '--'
})
const form1 = ref({
    offset: 'buy',
    volume: '',
    crypto: '',
    currency: '',
    account_id: ''
})
const outWallet = computed(() => { // 售出钱包
    if (form1.value.offset == 'buy') {
        return wallet.value.filter(item => item.type == 'fiat')
    } else {
        return wallet.value.filter(item => item.type == 'drypto')
    }
})
const currOut = ref({}) // 当前售出钱包
if (outWallet.value[0]) currOut.value = outWallet.value[0]

const inWallet = computed(() => { // 收到钱包
    if (form1.value.offset == 'buy') {
        return wallet.value.filter(item => item.type == 'drypto')
    } else {
        return wallet.value.filter(item => item.type == 'fiat')
    }
})
const currIn = ref({}) // 当前收到钱包
if (inWallet.value[0]) currIn.value = inWallet.value[0]

// 币种弹窗
const showDialog = ref(false);
const showDialogType = ref(1) // 1-售出 2-收到
const openDialog = type => {
    showDialogType.value = type
    showDialog.value = true
}
const clickItem = item => {
    if (showDialogType.value == 1) {
        currOut.value = item
    } else {
        currIn.value = item
    }
    showDialog.value = false

    setTimeout(() => {
        getRate()
    }, 100);
}




// 切换方向
const changeTab = (val) => {
    form1.value.offset = val
    // 切换币种
    const obj = currOut.value
    currOut.value = currIn.value
    currIn.value = obj
    setTimeout(() => {
        getRate()
    }, 100);
}

//  获取汇率
const rateLoading = ref(false)
const rate = ref('')
const getRate = () => {
    rateLoading.value = true
    rate.value = ''
    _swapRate({
        from: currOut.value.currency,
        to: currIn.value.currency,
        amount: 0,
    }).then(res => {
        if (res.data.exchange_rate) {
            rate.value = res.data.exchange_rate
        }
    }).finally(() => {
        rateLoading.value = false
    })
}
setTimeout(() => {
    getRate()
}, 100);



// 账户选择
const showAccountDialog = ref(false)
const clickAccountItem = item => {
    form1.value.account_id = item.id
    showAccountDialog.value = false
    safeRef.value.open()
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


// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    store.dispatch("updateSessionToken")
}
if (token.value) {
    getSessionToken()
}


// 跳转
const jump = name => {
    router.push({
        name: name
    })
}
</script>

<style lang="less" scoped>
.page_fasters {
    .form {
        padding: 0.64rem 0.32rem;

        .tabs {
            margin: 0 0 0.6rem 0;
            display: flex;
            align-items: center;
            justify-content: center;

            .tab {
                color: #9EA3AE;
                margin: 0 0.4rem;
            }

            .active_tab {
                font-weight: bold;
                color: #000;
                ;
            }
        }

        .tip {
            color: #b7b7b7;
            font-size: 0.24rem;
            position: relative;
            top: -0.2rem
        }

        .subtitle {
            color: #333;
            font-size: 0.28rem;
            margin-bottom: 0.1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .link {
                color: #034cfa;
            }
        }

        .item_box {
            display: flex;
            align-items: stretch;
            margin-bottom: 0.5rem;

            .item {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: relative;
                height: 0.88rem;
                border-radius: 0.12rem;
                border: 1px solid #d0d8e2;
                padding: 0 0.24rem;


                .icon {
                    margin-right: 0.06rem;
                    width: 0.3rem;
                    height: 0.3rem;
                    position: relative;
                    top: -0.02rem;
                }

                .info {
                    flex: 1;
                    text-align: right;
                    margin-left: 0.2rem;
                    font-size: 0.28rem;
                    font-weight: 400;
                    color: #333;
                    position: absolute;
                    right: 0.24rem;
                    pointer-events: none;
                }

                .ipt_tip {
                    color: #b7b7b7;
                    font-size: 0.24rem;
                    position: absolute;
                    left: 0.24rem;
                    transition: all ease .3s;
                }

                .ipt_tip2 {
                    left: auto;
                    right: 0.24rem;
                }

                .ipt {
                    flex: 1;
                    height: 100%;
                    width: 2rem;
                    font-size: 0.28rem;
                    padding: 0;
                    color: #034cfa;
                    position: relative;
                    z-index: 1;
                }

                .base_ipt {
                    font-size: 0.28rem;
                    color: #b7b7b7;
                    position: absolute;
                    left: 0.24rem;
                    z-index: 0;
                }

                .more_icon {
                    width: 0.32rem;
                    height: 0.32rem;
                    margin-left: 0.08rem;
                }
            }

            .disabled_item {
                background-color: #f5f5f5;
            }

            .item_focus {
                height: 1.12rem;
                // padding-top: 0.2rem;
                border: 1px solid #034cfa;

                .ipt_tip {
                    font-size: 0.2rem;
                    transform: translateY(-0.36rem);
                }
            }

            .item_box_left {
                width: 4.2rem;
                margin-right: 0.2rem;
                display: flex;
                flex-direction: column;
            }

            .item_box_right {
                flex: 1;
            }

            .mode_btn {
                padding: 0 0.6rem;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 1.26rem;
                background: #f2f2f2;
                height: 0.72rem;
                color: #999;
                text-align: center;
                font-size: 0.28rem;
                font-weight: 600;
                margin-left: 0.16rem;
                margin-top: 0.08rem;
            }

            .active_btn {
                background: #014cfa;
                color: #fff;
            }
        }
    }

    .submit {
        margin-top: 3rem;
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