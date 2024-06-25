<!-- 提现 -->
<template>
    <div class="page page_withdraw">
        <Top :title="'提现'">
            <template #right>
                <div class="top-record" @click="goRecord">
                    <img src="/static/img/user/record.png" alt="img">
                </div>
            </template>
        </Top>

        <!-- 表单 -->
        <div class="form">
            <div class="subtitle">金额</div>
            <div class="item">
                <div class="item_content">
                    <input @change="changeAmount" type="number" v-model="form.amount" placeholder="请输入">
                    <span class="all" @click="maxIpt">全部</span>
                </div>
                <div class="currency" @click="showDialog = true">
                    <div class="currency_icon">
                        <img :src="`/static/img/crypto/${form.from.toUpperCase()}.png`" alt="currency">
                    </div>
                    <span>{{ form.from.toUpperCase() }}</span>
                </div>
                <div class="more" @click="showDialog = true">
                    <img src="/static/img/assets/more.png" alt="more">
                </div>
            </div>
            <div class="tip">
                <div>
                    <span>手续费: </span>
                    <span class="num">{{ loading ? '--' : fee }}</span>
                </div>
                <div>
                    <span>可用余额: </span>
                    <span class="num">{{ balance }}</span>
                </div>
            </div>


            <!-- 提款方式 -->
            <div class="account_box">

                <div v-if="showAccount.length">
                    <div class="card_box">
                        <div class="card">
                            <div class="name">{{ currAccount.symbol ? `${currAccount.symbol}-${currAccount.network}` :
                                `${currAccount.bankName}` }}</div>
                            <div class="code">{{ _hiddenAccount(currAccount.bankCardNumber || currAccount.address) }}
                            </div>
                            <div class="logo">
                                <img :src="`/static/img/crypto/${currAccount.symbol || 'MAIN'}.png`" alt="currency">
                            </div>
                        </div>
                        <div class="more_card" @click="showAccountDialog = true">
                            <Icon name="exchange" />
                        </div>

                    </div>
                </div>
                <div v-else>
                    <div class="add_account" @click="goAddAccount">
                        <Icon name="plus" />
                        <span style="margin-left: 0.08rem;">添加收款方式</span>
                    </div>
                </div>

            </div>
        </div>

        <Button @click="openSafePass" :loading="loading" :disabled="disabled" round color="#014CFA" class="submit"
            type="primary">确定</Button>


        <!-- 账户种类选择弹窗 -->
        <Popup class="self_van_popup" v-model:show="showDialog" position="bottom" teleport="body"
            :safe-area-inset-bottom="true">
            <div class="withdraw_accounr_dialog">
                <div class="close_icon" @click="showDialog = false">
                    <img src="/static/img/common/close.png" alt="x">
                </div>
                <div @click="clickItem(item)" class="swap_dialog_item" v-for="(item, i) in wallet" :key="i">
                    <div class="icon">
                        <img :src="`/static/img/crypto/${item.currency.toUpperCase()}.png`" alt="currency">
                    </div>
                    <span>{{ item.currency.toUpperCase() }}</span>
                </div>
            </div>
        </Popup>

        <!-- 账户选择弹窗 -->
        <Popup class="self_van_popup" v-model:show="showAccountDialog" position="bottom" teleport="body"
            :safe-area-inset-bottom="true">
            <div class="withdraw_accounr_dialog">
                <div class="close_icon" @click="showAccountDialog = false">
                    <img src="/static/img/common/close.png" alt="x">
                </div>
                <div class="search_box">
                    <input v-model.trim="searchStr" type="text" placeholder="搜索" />
                    <Icon name="search" />
                </div>
                <div class="list">
                    <div @click="clickAccountItem(item)" class="dialog_account_item" v-for="(item, i) in searchList"
                        :key="i">
                        <div class="name">{{ item.symbol ? `${item.symbol}-${item.network}` :
                            `${item.bankName}` }}</div>
                        <div class="code">{{ _hiddenAccount(item.bankCardNumber || item.address) }}</div>
                        <div class="logo">
                            <img :src="`/static/img/crypto/${item.symbol || 'MAIN'}.png`" alt="currency">
                        </div>
                    </div>
                    <div class="add_account" v-if="!searchList.length" @click="goAddAccount">
                        <Icon name="plus" />
                        <span style="margin-left: 0.08rem;">添加收款方式</span>
                    </div>
                </div>
            </div>
        </Popup>

        <!-- 安全密码弹窗 -->
        <SafePassword @submit="submit" ref="safeRef">
        </SafePassword>
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { ref, computed } from "vue"
import store from "@/store"
import { Icon, Button, Popup, showNotify } from "vant"
import router from "@/router"
import { _withdrawFee, _withdraw } from "@/api/api"
import SafePassword from "@/components/SafePassword.vue"
import { _hiddenAccount } from "@/utils/index"

const loading = ref(false)
const disabled = computed(() => {
    return !(form.value.amount && form.value.amount > 0 && form.value.amount <= balance.value)
})
// 表单
const form = ref({
    amount: '',
    from: 'main',
    account: '',
})
const maxIpt = () => {
    form.value.amount = balance.value
    setTimeout(() => {
        getFee()
    }, 0)
}
const changeAmount = () => {
    setTimeout(() => {
        getFee()
    }, 0)
}

// 提交
const safeRef = ref()
const openSafePass = () => {
    safeRef.value.open()
}
const submit = s => {
    if (loading.value) return
    loading.value = true
    _withdraw({
        currency: form.value.from,
        amount: form.value.amount,
        account_id: currAccount.value.id,
        safeword: s,
        token: sessionToken.value,
    }).then(res => {
        if (res.code == 200) {
            showNotify({ type: 'success', message: '操作成功' });
            form.value.amount = ''
            store.dispatch('updateWallet') // 更新钱包
        }
    }).finally(() => {
        getSessionToken()
        loading.value = false
    })
}

// 手续费
const fee = ref(0)
const getFee = () => {
    if (!form.value.amount) return
    loading.value = true
    _withdrawFee({
        currency: form.value.from,
        amount: form.value.amount,
    }).then(res => {
        if (res.code == 200) {
            fee.value = res.data
        }
    }).finally(() => {
        loading.value = false
    })
}


// 钱包
const wallet = computed(() => { // 可选钱包列表
    return store.state.wallet.filter(item => !['stock', 'contract', form.value.from].includes(item.currency)) || []
})
const balance = computed(() => { // main钱包余额
    let b = 0
    const main = store.state.wallet.find(item => item.currency == form.value.from)
    if (main) b = main.amount
    return b
})

// 收款方式
// store.dispatch('updateAccountList')
const accountList = computed(() => store.state.accountList || []) // 收款方式列表
// 可用钱包列表
const showAccount = computed(() => {
    if (form.value.from.toUpperCase() == 'MAIN') { // 银行卡
        return accountList.value.filter(item => !item.symbol) || []
    } else { // 虚拟货币
        return accountList.value.filter(item => item.symbol == form.value.from) || []
    }
})
// 当前钱包
const currAccount = computed(() => {
    if (form.value.account) {
        return showAccount.value.find(item => item.id == form.value.account)
    } else {
        return showAccount.value[0] || {}
    }
})
const showAccountDialog = ref(false)
const searchStr = ref('') // 账号搜索
const searchList = computed(() => {
    return showAccount.value.filter(item => {
        return (item.accountName && item.accountName.includes(searchStr.value))
            || (item.address && item.address.includes(searchStr.value))
            || (item.bankCardNumber && item.bankCardNumber.includes(searchStr.value))
            || (item.bankName && item.bankName.includes(searchStr.value))
            || (item.network && item.network.includes(searchStr.value))
            || (item.symbol && item.symbol.includes(searchStr.value))
    })
})
const clickAccountItem = item => {
    form.value.account = item.id
    showAccountDialog.value = false
}


// 账户弹窗
const showDialog = ref(false)
const clickItem = item => {
    form.value.from = item.currency
    form.value.account = ''
    form.value.amount = ''
    showDialog.value = false
}




// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    store.dispatch("updateSessionToken")
}
getSessionToken()

// 跳转记录
const goRecord = () => {
    router.push({
        name: 'withdrawRecord'
    })
}
// 跳转添加
const goAddAccount = () => {
    router.push({
        name: 'account'
    })
}
</script>

<style lang="less" scoped>
.page_withdraw {
    padding: 1.4rem 0.32rem 1.5rem 0.32rem;

    position: relative;

    .top-record {
        width: 0.4rem;
        height: 0.4rem;
    }

    .form {
        .item {
            width: 100%;
            height: 1.12rem;
            border: 1px solid #D0D8E2;
            border-radius: 0.32rem;
            padding: 0 0.4rem 0 0.76rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-weight: 400;

            .item_pre {
                width: 1rem;
                font-size: 0.32rem;
                color: #707070;
            }

            .item_content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex: 1;
                font-size: 0.28rem;
                color: #000;
                position: relative;
                line-height: 0.28rem;
                height: 100%;

                .all {
                    color: #1A59F6;
                    position: absolute;
                    right: 0.24rem;
                }
            }

            .currency {
                display: flex;
                align-items: center;
                margin-right: 0.24rem;
                line-height: 0;

                .currency_icon {
                    width: 0.56rem;
                    height: 0.56rem;
                    margin-right: 0.12rem;
                }
            }

            .more {
                width: 0.32rem;
                height: 0.32rem;
            }

            .ipt {
                flex: 1;
                color: #292929;
                font-size: 0.28rem;
            }

            .btn {
                color: #1A59F6;
                font-size: 0.28rem;
                margin-left: 0.4rem;
            }
        }

        .subtitle {
            font-size: 0.28rem;
            color: #333333;
            font-weight: 400;
            line-height: 0.36rem;
            margin: 0rem 0 0.12rem 0;
        }

        .tip {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-weight: 400;
            font-size: 0.24rem;
            color: #707070;
            line-height: 0.4rem;
            margin-top: 0.12rem;

            .num {
                color: #333333;
                margin-left: 0.04rem;
                font-weight: 500;
            }

        }

        .account_box {
            margin-top: 1rem;
            padding-right: 0.24rem;

            .add_account {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0.4rem 0;
            }

            .card_box {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .card {
                    background: linear-gradient(161.26deg, #FFA498 -25.84%, #FF4747 106.1%);
                    padding: 0.28rem 0.28rem 0.24rem 0.32rem;
                    color: #fff;
                    position: relative;
                    flex: 1;
                    border-radius: 0.16rem;

                    .name {
                        font-size: 0.36rem;
                        margin-bottom: 0.2rem;
                    }

                    .code {
                        font-size: 0.28rem;
                    }

                    .logo {
                        width: 0.8rem;
                        height: 0.8rem;
                        right: 0.3rem;
                        top: 0.28rem;
                        position: absolute;
                    }
                }

                .more_card {
                    font-size: 0.4rem;
                    margin-left: 0.4rem;
                }
            }
        }
    }

    .submit {
        width: 100%;
        height: 1.12rem;
        margin: 1.2rem 0 0.4rem 0;
    }
}
</style>
<style lang="less" scoped>
.withdraw_accounr_dialog {
    background-color: #fff;
    border-top-left-radius: 0.4rem;
    border-top-right-radius: 0.4rem;
    overflow: hidden;
    padding: 0.86rem 0.32rem 0.8rem 0.32rem;
    position: relative;

    .close_icon {
        position: absolute;
        width: 0.4rem;
        height: 0.4rem;
        top: 0.24rem;
        right: 0.32rem;
    }

    .swap_dialog_item {
        height: 1.12rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #F5F5F5;
        overflow: hidden;

        .icon {
            width: 0.4rem;
            height: 0.4rem;
            margin-right: 0.24rem;
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

    .list {
        max-height: 50vh;
        overflow-y: auto;

        .add_account {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.4rem 0;
        }
    }

    .dialog_account_item {
        position: relative;
        background: linear-gradient(161.26deg, #FFA498 -25.84%, #FF4747 106.1%);
        padding: 0.28rem 0.28rem 0.24rem 0.32rem;
        color: #fff;
        flex: 1;
        border-radius: 0.16rem;
        margin-top: 0.4rem;

        .name {
            font-size: 0.36rem;
            margin-bottom: 0.2rem;
        }

        .code {
            font-size: 0.28rem;
        }

        .logo {
            width: 0.8rem;
            height: 0.8rem;
            right: 0.3rem;
            top: 0.28rem;
            position: absolute;
        }
    }

}
</style>