<!-- 自选区 -->
<template>
    <div class="buycoin_self">

        <!-- tab -->
        <div class="tabs">
            <div class="tab" @click="changeTab('buy')" :class="{ 'active_tab': offset == 'buy' }">买入</div>
            <div class="tab" @click="changeTab('sell')" :class="{ 'active_tab': offset == 'sell' }">卖出</div>
            <div style="flex:1"></div>
            <div style="display: flex;align-items: center;" @click="showDialog = true">
                <span>{{ currCurrency.name }}</span>
            </div>

            <div class="icon">
                <img src="/static/img/market/trans.png" alt="img">
            </div>

            <div style="display: flex;align-items: center;" @click="showDialog2 = true">
                <span>{{ currCrypto.name }}</span>
            </div>
        </div>
        <!-- <div class="subtabs">
            <div @click="clickCrypto(item)" class="subtab" :class="{ 'active_subtab': item.name == currCrypto.name }"
                v-for="(item, i) in dryptoWallet" :key="i">{{ item.name }}</div>
        </div> -->

        <!-- list -->
        <div class="list">

            <div class="item" v-for="(item, i) in list" :key="i">
                <div class="top">
                    <div class="avatar">
                        {{ item.merchant.slice(0, 1) }}
                        <!-- <div class="avatar_status"></div> -->
                    </div>
                    <div class="top_content">
                        <div class="name">{{ item.merchant }}</div>
                        <div class="info">
                            <span>成交量 {{ item.volume }}</span>
                            <span>|</span>
                            <span>成交率 {{ item.volumerate }}%</span>
                            <div class="time_icon">
                                <img src="/static/img/market/time.png" alt="img">
                            </div>
                            <span>{{ item.avetime }}</span>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="price">
                        <div class="amount">{{ item.price }} <span style="font-size: 0.28rem;">{{ currCurrency.name
                                }}</span></div>
                        <div>订单限额{{ item.limitmin }}-{{ item.limitmax }}</div>
                    </div>
                    <div v-if="token" class="btn" @click="goBuy(item)">{{ offset == 'buy' ? '购买' : '出售' }}</div>
                </div>
            </div>
            <NoData v-if="!loading && !list.length" />
            <LoadingMore :classN="'buycoin_buss'" :loading="loading" :finish="finish"
                v-if="(finish && list.length) || (!finish)" />
        </div>
    </div>

    <!-- 表单提交 -->
    <Popup teleport="body" v-model:show="showFormDialog" round position="bottom" closeable>
        <div class="buycoin_form_dialog">
            <div class="title">{{ offset == 'buy' ? '买入' : '卖出' }}{{ currCrypto.name }}</div>

            <div class="form">
                <div class="item form_item" :class="{ 'focus_item': amountFocus }">
                    <div class="tip_text" v-show="offset == 'sell'" v-if="!(!amountFocus && amount !== '')">≤ {{
                        maxAmount }} {{
                            offset == 'sell' ? currCrypto.name :
                                currCurrency.name }}</div>
                    <input v-model="amount" @blur="amountFocus = false" @focus="amountFocus = true" type="number"
                        class="ipt">
                    <div class="all" @click="amount = currWallet.amount">全部</div>
                </div>
                <div class="tip">订单限额：{{ currItem.limitmin }}-{{ currItem.limitmax }} {{ offset == 'sell' ?
                    currCrypto.name : currCurrency.name }}</div>
                <div class="tip" v-if="offset == 'sell'">预计收到：{{ showAmount }} {{ currCurrency.name }}</div>

                <div class="btn" @click="preSubmit">确认{{ offset == 'buy' ? '买入' : '卖出' }}</div>
            </div>

        </div>
    </Popup>

    <!-- 订单弹窗 -->
    <Popup teleport="body" v-model:show="showPopupInfo" round position="bottom" closeable>
        <div class="buycoin_orderinfo_dialog">
            <div class="orderinfo_dialog_title">订单详情</div>
            <OrderInfo />
        </div>
    </Popup>

    <!-- 法币币种 -->
    <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" class="self_van_popup" v-model:show="showDialog"
        position="bottom" teleport="body">
        <div class="withdraw_accounr_dialog">
            <div class="close_icon" @click="showDialog = false">
                <img src="/static/img/common/close.png" alt="x">
            </div>
            <div class="title">币种选择</div>
            <div @click="clickItem(item)" class="swap_dialog_item"
                :class="{ 'swap_dialog_item_active': currCurrency.name == item.name }" v-for="(item, i) in fiatWallet"
                :key="i">
                <div class="icon">
                    <img :src="`/static/img/crypto/${item.name.toUpperCase()}.png`" alt="currency">
                </div>
                <span>{{ item.name.toUpperCase() }}</span>
                <Icon v-if="currCurrency.name == item.name" class="check_icon" name="success" />
            </div>
        </div>
    </Popup>
    <!-- 加密币种 -->
    <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" class="self_van_popup" v-model:show="showDialog2"
        position="bottom" teleport="body">
        <div class="withdraw_accounr_dialog">
            <div class="close_icon" @click="showDialog2 = false">
                <img src="/static/img/common/close.png" alt="x">
            </div>
            <div class="title">币种选择</div>
            <div @click="clickCrypto(item)" class="swap_dialog_item"
                :class="{ 'swap_dialog_item_active': currCrypto.name == item.name }" v-for="(item, i) in dryptoWallet"
                :key="i">
                <div class="icon">
                    <img :src="`/static/img/crypto/${item.name.toUpperCase()}.png`" alt="currency">
                </div>
                <span>{{ item.name.toUpperCase() }}</span>
                <Icon v-if="currCrypto.name == item.name" class="check_icon" name="success" />
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
                    :class="{ 'dialog_account_item_active': currAccount.id == item.id }" class="dialog_account_item"
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
                    <div v-if="currAccount.id == item.id" class="checked"
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
import { Popup, Icon, showToast, showConfirmDialog } from "vant"
import OrderInfo from "./OrderInfo.vue"
import NoData from '@/components/NoData.vue';
import LoadingMore from "@/components/LoadingMore.vue"
import { _adList, _buysell } from "@/api/api"
import { ref, onMounted, onUnmounted, computed, onActivated } from "vue"
import store from "@/store"
import Decimal from 'decimal.js';
import router from "@/router"
import { _hiddenAccount } from "@/utils/index"
import SafePassword from "@/components/SafePassword.vue"

const userInfo = computed(() => store.state.userInfo || {})
const safeRef = ref()

const showPopupInfo = ref(false)
const showDialog = ref(false)
const showDialog2 = ref(false)
const token = computed(() => store.state.token)
const wallet = computed(() => store.state.wallet || []) // 所有钱包
const fiatWallet = computed(() => wallet.value.filter(item => item.type == 'fiat')) // 法币钱包
const dryptoWallet = computed(() => wallet.value.filter(item => item.type == 'drypto')) // 加密钱包
const accountList = computed(() => store.state.accountList || []) // 收款方式列表
const bankList = computed(() => accountList.value.filter(item => item.channel == 'bank')) // 银行账号列表

const currWallet = computed(() => {
    if (offset.value == 'buy') {
        return wallet.value.find(item => item.name == currCurrency.value.name)
    } else {
        return wallet.value.find(item => item.name == currCrypto.value.name)
    }
})



// 表单
const offset = ref('buy')
const currCurrency = ref({}) // 计价货币
if (fiatWallet.value[0]) currCurrency.value = fiatWallet.value[0]
const currCrypto = ref({}) // 加密货币
if (dryptoWallet.value[0]) {
    const target = dryptoWallet.value.find(item => item.name == 'USDT')
    currCrypto.value = target || dryptoWallet.value[0]
}
const clickItem = item => {
    currCurrency.value = item
    showDialog.value = false
    list.value = []
    init()
}
const clickCrypto = item => {
    currCrypto.value = item
    showDialog2.value = false
    list.value = []
    init()
}
const changeTab = name => {
    offset.value = name
    list.value = []
    init()
}

// 表单弹窗
const showFormDialog = ref(false)
const currItem = ref({})
const amountFocus = ref(false)
const amount = ref('')
const maxAmount = computed(() => {
    if (!currWallet.value.amount || !currItem.value.price) return 0
    if (offset.value == 'buy') {
        return new Decimal(currWallet.value.amount).div(currItem.value.price)
    } else {
        return currWallet.value.amount
    }
})
const showAmount = computed(() => {
    if (!amount.value || amount.value <= 0) return '--'
    if (offset.value == 'buy') {
        return new Decimal(amount.value).div(currItem.value.price)
    } else {
        return new Decimal(amount.value).mul(currItem.value.price)
    }
})
const goBuy = item => {
    // router.push({
    //     name: 'deal',
    //     query: {
    //         ...item,
    //         offset: offset.value
    //     }
    // })
    // if (offset.value) return
    amount.value = ''
    currItem.value = item
    showFormDialog.value = true
}

// 提交表单
const preSubmit = () => {
    if (!amount || amount.value < currItem.value.limitmin || amount.value > currItem.value.limitmax) return showToast(`限额：${currItem.value.limitmin}-${currItem.value.limitmax}`)
    showFormDialog.value = false
    setTimeout(() => {
        if (offset.value == 'buy') {
            safeRef.value.open()
        } else {
            showAccountDialog.value = true
        }
    }, 0)
}
const submitSell = (s) => {
    const params = {
        ad_id: currItem.value.id,
        volume: amount.value,
        account_id: offset.value == 'buy' ? null : currAccount.value.id,
        token: sessionToken.value,
        safeword: s
    }
    if (loading.value) return
    loading.value = true
    _buysell(params).then(res => {
        console.error('???', res)
        if (res.code == 200) {
            showToast('下单成功')
        }
    }).finally(() => {
        loading.value = false
        getSessionToken()
    })
}


// 列表
const loading = ref(false)
const finish = ref(false)
const list = ref([])
try {
    list.value = JSON.parse(sessionStorage.getItem('deal_list') || '[]')
} catch { }
const page = ref(0)
const getData = () => {
    if (loading.value || finish.value) return
    loading.value = true
    page.value++
    let req = {
        offset: offset.value,
        crypto: currCrypto.value.currency,
        currency: currCurrency.value.currency
    }
    _adList({
        page: page.value,
        ...req
    }).then(res => {
        if (req.offset != offset.value || req.crypto != currCrypto.value.currency || req.currency != currCurrency.value.currency) return
        loading.value = false
        if (page.value == 1) {
            list.value = res.data || []
        } else {
            list.value.push(...(res.data || []))
        }
        if (!res.data?.length) {
            finish.value = true
        }
        setTimeout(() => {
            sessionStorage.setItem('deal_list', JSON.stringify(list.value))
        }, 100)
    }).catch(() => {
        loading.value = false
    })
}
const init = () => {
    page.value = 0
    loading.value = false
    finish.value = false
    setTimeout(() => {
        getData()
    }, 0)
    setTimeout(() => {
        moreDom = document.querySelector('.buycoin_buss')
    }, 500)
}
init()

// 监听
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
let moreDom = null
const scrollHandle = () => {
    if (!moreDom) return
    const rect = moreDom.getBoundingClientRect()
    if (rect.top <= totalHeight) {
        console.error('加载更多')
        // 加载更多
        getData()
    }
}

onActivated(() => {
    setTimeout(() => {
        moreDom = document.querySelector('.buycoin_buss')
    }, 500)
})
onMounted(() => {
    setTimeout(() => {
        moreDom = document.querySelector('.buycoin_buss')
        document.querySelector('.page').addEventListener('scroll', scrollHandle)
    }, 500)
})
onUnmounted(() => {
    try {
        document.querySelector('.page').removeEventListener('scroll', scrollHandle)
    } catch { }
})



// 账户选择
const showAccountDialog = ref(false)
const currAccount = ref({})
const clickAccountItem = item => {
    currAccount.value = item
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

const goLogin = () => {
    router.push({
        name: 'login'
    })
}

// 跳转
const jump = name => {
    router.push({
        name: name
    })
}
</script>

<style lang="less" scoped>
.buycoin_self {
    padding: 0 0.32rem;

    .tabs {
        height: 0.8rem;
        padding-top: 0.2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        // border-bottom: 1px solid rgba(59, 130, 246, 0.3);

        .tab {
            margin-right: 0.24rem;
            min-width: 1rem;
            color: #9EA3AE;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .active_tab {
            font-weight: bold;
            color: #000;
            // border-bottom: 3px solid #014cfa;
        }

        .icon {
            font-size: 0.28rem;
            height: 0.28rem;
            margin: 0 0.2rem;
        }
    }

    .subtabs2 {
        margin: 0.2rem 0;
        padding: 0 0.1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .subtabs {
        overflow-x: auto;
        white-space: nowrap;
        margin: 0.2rem 0;
        padding-left: 0.1rem;

        .subtab {
            display: inline-block;
            margin-right: 0.4rem;
            color: #9EA3AE;
        }

        .active_subtab {
            color: #000;
            font-weight: bold;
        }
    }

    .list {
        .item {
            padding: 0.4rem 0;
            color: #666;
            border-bottom: 1px solid #e8e8e8;

            .top {
                display: flex;
                align-items: flex-start;

                .avatar {
                    width: 0.64rem;
                    height: 0.64rem;
                    border-radius: 50%;
                    background-color: #014cfa;
                    margin-right: 0.24rem;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.48rem;
                    color: #fff;
                    line-height: 0;

                    .avatar_status {
                        position: absolute;
                        width: 0.13rem;
                        height: 0.13rem;
                        border-radius: 50%;
                        background-color: #30BF87;
                        bottom: 0.04rem;
                        right: 0.04rem;
                    }
                }

                .top_content {
                    padding-top: 0.16rem;

                    .name {
                        margin-bottom: 0.2rem;
                        color: #000;
                    }

                    .info {
                        font-size: 0.24rem;
                        display: flex;
                        align-items: center;

                        span {
                            margin-right: 0.1rem;
                        }

                        .time_icon {
                            width: 0.24rem;
                            height: 0.24rem;
                            margin-right: 0.1rem;
                        }
                    }
                }
            }

            .bottom {
                margin-top: 0.4rem;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .price {
                    .amount {
                        color: #000;
                        font-weight: bold;
                        font-size: 0.36rem;
                        margin-bottom: 0.2rem;
                    }
                }

                .btn {
                    width: 40%;
                    height: 0.64rem;
                    border-radius: 0.64rem;
                    background-color: #014cfa;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
    }
}
</style>

<style lang="less">
.buycoin_form_dialog {
    position: relative;

    .title {
        font-size: 0.32rem;
        line-height: 0.6rem;
        text-align: center;
        margin-bottom: 0.2rem;
        margin-top: 0.2rem;
        font-weight: bold;
    }

    .form {
        padding: 0.32rem;

        .form_item {
            border: 1px solid #D0D8E2;
            height: 0.96rem;
            display: flex;
            align-items: center;
            padding: 0 0.24rem;
            position: relative;
            border-radius: 0.24rem;
            margin-bottom: 0.12rem;

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

        .focus_item {
            height: 1.12rem;
            padding-top: 0.2rem;

            .tip_text {
                transform: translateY(-0.36rem);
                font-size: 0.24rem;
            }
        }

        .tip {
            color: #333;
        }

        .btn {
            margin-top: 0.32rem;
            height: 0.96rem;
            background-color: #014CFA;
            border-radius: 0.96rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
        }
    }
}

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
