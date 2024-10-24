<!-- 提现 -->
<template>
    <div class="page page_withdraw">
        <Top :title="$t('withdraw.withdraw')">
            <template #right>
                <div class="top-record" @click="goRecord">
                    <div class="top-record-icon">
                        <img src="/static/img/assets/record.png" />
                    </div>
                    <span>
                        {{$t("withdraw.withdrawRecord")}}
                    </span>
                </div>
            </template>
        </Top>

         <Tabs type="custom-card" v-model:active="tabActive" :swipeable="false"
            shrink>
            <Tab :title="$t('withdraw.cryptocurrency')" name="cryptocurrency">
                 <!-- 表单 -->
                <div class="form">
                     <FormItem custom :title="$t('withdraw.currency')">
                        <div class="select_item"  @click="showDialog = true">
                            <div class="currency" v-if="form.from">
                                <div class="currency_icon">
                                    <img :src="`/static/img/crypto/${form.from.toUpperCase()}.png`" alt="currency">
                                </div>
                                <span>{{ form.from.toUpperCase() }}</span>
                            </div>
                            <div class="more">
                                <img src="/static/img/assets/more.png" alt="more">
                            </div>
                        </div>
                        
                    </FormItem>
                   <FormItem  v-model="form.amount" show-all-btn title="提现金额"  @change="changeAmount" @allBtnClick="maxIpt">
                        <template #title-right>可提现：{{ balance }}</template>
                   </FormItem>

                    <div class="tip">
                        <span>手续费</span>
                        <span class="num">{{ loading ? '--' : fee }}</span>
                    </div>

                    <!-- 提款方式 -->
                    <div class="subtitle">收款账户</div>
                    <div class="account_box">

                        <div class="card_box" v-if="showAccount.length" @click="showAccountDialog = true">
                            <div class="card_icon">
                                <img v-if="form.from.toUpperCase() == 'MAIN'" src="/static/img/user/card_type_b.png"
                                    alt="img">
                                <img v-else :src="`/static/img/crypto/${currAccount.symbol.toUpperCase()}.png`" alt="currency">
                            </div>
                            <div class="card">
                                <div class="code">{{ _hiddenAccount(currAccount.bankCardNumber || currAccount.address)
                                    }}
                                </div>
                                <div class="name">{{ currAccount.symbol ? `${currAccount.symbol}-${currAccount.network}`
                                    :
                                    `${currAccount.bankName}` }}</div>

                            </div>
                            <div class="more_card">更改</div>


                        </div>
                        <div v-else class="add_account" @click="showAccountDialog = true">
                            <Icon size="0.48rem" color="#014CFA" name="add-o" />
                            <div class="add_account_text">添加收款方式</div>
                        </div>

                    </div>
                </div>

                <Button @click="openSafePass" :loading="loading" round color="#014CFA" class="submit" type="primary">提现</Button>
            </Tab>
            <Tab :title="$t('withdraw.bankCard')" name="bankCard">
            </Tab>
         </Tabs>

        <!-- 账户种类选择弹窗 -->
        <Popup v-model:show="showDialog" position="bottom" round closeable teleport="body">
            <div class="van-popup-custom-title">{{$t("withdraw.currencySelection")}}</div>
             
            <div class="withdraw_accounr_dialog">
                <!-- 搜索 -->
                <div class="search_box">
                    <div class="search_icon">
                        <img src="/static/img/common/search.png" alt="🔍">
                    </div>
                    <input v-model.trim="searchDialogStr" type="text" class="ipt"
                        :placeholder="$t('withdraw.searchPlaceholder')">
                </div>
                <div class="lists">
                    <div @click="clickItem(item)" class="swap_dialog_item"
                        :class="{ 'swap_dialog_item_active': form.from == item.name }" v-for="(item, i) in wallet" :key="i" v-show="!searchDialogStr || item.name.toUpperCase().indexOf(searchDialogStr) > -1">
                        <div class="icon">
                            <img :src="`/static/img/crypto/${item.name.toUpperCase()}.png`" alt="currency">
                        </div>
                        <span>{{ item.name.toUpperCase() }}</span>
                        <div v-if="form.from == item.name" class="check_icon">
                            <img src="/static/img/assets/success.svg" />
                        </div>
                    </div>
                </div>
            </div>
        </Popup>

        <!-- 账户选择弹窗 -->
        <Popup v-model:show="showAccountDialog" position="bottom" round closeable teleport="body">
        
            <div class="van-popup-custom-title">加密货币账户选择</div>

            <div class="withdraw_accounr_dialog">
               
                <div class="lists card_lists">
                    <div class="add_account" @click="goAddAccount">
                        <Icon size="0.48rem" color="#014CFA" name="add-o" />
                        <div class="add_account_text">添加收款账户</div>
                    </div>
                    <div @click="clickAccountItem(item)"
                        :class="{ 'card_box_active': currAccount.id == item.id }" class="card_box"
                        v-for="(item, i) in searchList" :key="i">
                        <div class="card_icon">
                            <img v-if="item.bankName" src="/static/img/user/card_type_b.png" alt="img">
                            <img v-else :src="`/static/img/crypto/${item.symbol.toUpperCase()}.png`" alt="currency">
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
        <SafePassword @submit="submit" ref="safeRef">
        </SafePassword>

        <!-- 充提记录 -->
        <RecordList ref="RecordListRef" />

        <!-- 账号验证 -->
        <AccountCheck ref="AccountCheckRef" />
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { ref, computed, onMounted } from "vue"
import store from "@/store"
import { Icon, Button, Popup, showToast,Tabs,Tab, showConfirmDialog } from "vant"
import router from "@/router"
import { _withdrawFee, _withdraw } from "@/api/api"
import SafePassword from "@/components/SafePassword.vue"
import { _hiddenAccount } from "@/utils/index"
import RecordList from "@/components/RecordList.vue"
import AccountCheck from "@/components/AccountCheck.vue"
import FormItem from "@/components/form/FormItem.vue"
const RecordListRef = ref()
const userInfo = computed(() => store.state.userInfo || {})
const tabActive = ref("cryptocurrency")
const focus = ref(false)
const loading = ref(false)
// 表单
const form = ref({
    amount: '',
    from: '',
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

const searchDialogStr = ref('')

// 提交
const safeRef = ref()
const errStatus = ref(false)
const AccountCheckRef = ref()
const openSafePass = () => {
    if (!form.value.amount || form.value.amount <= 0) {
        errStatus.value = true
        return showToast('请输入金额')
    }
    if (form.value.amount > balance.value) {
        return showToast('余额不足')
    }
    if (!showAccount.value.length) {
        return showToast('请添加收款账户')
    }
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
            showToast('操作成功');
            form.value.amount = ''
            store.dispatch('updateWallet') // 更新钱包
            router.push({
                name: 'withdrawInfo'
            })
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
    return store.state.wallet || []
})
if (wallet.value[0]) {
    form.value.from = wallet.value[0].name
}
const balance = computed(() => { // main钱包余额
    let b = 0
    const main = store.state.wallet.find(item => item.name == form.value.from)
    if (main) b = main.amount
    return b
})

// 收款方式
store.dispatch('updateAccountList')
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
    form.value.from = item.name
    form.value.account = ''
    form.value.amount = ''
    showDialog.value = false
}




// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    store.dispatch("updateSessionToken")
}


// 跳转记录
const goRecord = () => {
    router.push({
        name: 'recordList',
        query: {
            tab: 1
        }
    })
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
    const target = wallet.value.find(a => a.name == form.value.from)
    if (target.type == 'fiat') {
        if (userInfo.value.kycl2 != 2) {
            return showConfirmDialog({
                title: '身份认证',
                message:
                    '你还未完成身份认证，是否去认证?',
            }).then(() => {
                jump('kyc')
            })
        }
        router.push({
            name: 'bank'
        })
    } else {
        router.push({
            name: 'crypto',
            query: {
                currency: form.value.from
            }
        })
    }
}


onMounted(() => {
    if (AccountCheckRef.value.check()) {
        getSessionToken()
    }
})

// 添加
const jump = (name) => {
    router.push({
        name
    })
}

Promise.all([
    import('@/views/User/Account/Bank.vue'),
    import('@/views/User/Account/Crypto.vue'),
])
</script>

<style lang="less" scoped>
.page_withdraw {
    padding: 1.32rem 0.32rem 1.44rem 0.32rem;
    position: relative;
    :deep(.top){
        z-index: 10;
    }
    .top-record {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0953fa;
        font-size:0.28rem;
        .top-record-icon {
            width: 0.3rem;
            height: 0.3rem;
            margin-right: 0.06rem;
        }
    }
    
    .submit {
        width: 100%;
        height: 1.12rem;
        font-size: 0.36rem;
        margin-top:0.8rem;
    }
    
    .form {
        .tip {
            color: #666D80;
            font-size: 0.28rem;
            line-height: 0.36rem; 
            margin-top:0.24rem;
        }

        .subtitle{
            display: flex;
            align-items: center;
            font-size: 0.28rem;
            color: #061023;
            font-weight: 400;
            line-height: 0.36rem;
            margin-top: 0.4rem;
            margin-bottom: 0.12rem;
            justify-content: space-between;
        }
        .select_item {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 100%;
             .currency {
                display: flex;
                align-items: center;
                margin-right: 0.24rem;
                line-height: 1;

                .currency_icon {
                    width: 0.48rem;
                    height: 0.48rem;
                    margin-right: 0.16rem;
                    img{
                        border-radius: 50%;
                    }
                }
            }

            .more {
                width: 0.32rem;
                height: 0.32rem;
            }
        }

    }

}

.add_account {
    background-color: #F5F7FC;
    border-radius: 0.32rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 0.24rem 0 0.2rem 0;
}
.add_account_text{
    color:#014CFA;
    text-align: center;
    font-size: 0.24rem;
    font-weight: 400;
    line-height: 0.44rem; 
    margin-top: 0.08rem;
}

.card_box {
    border-radius: 0.32rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    border: 1px solid #D0D8E2;
    background-color: #fff;
    padding: 0.2rem 0.32rem 0.28rem 0.32rem;
   

    .card_icon {
        width: 0.96rem;
        height: 0.96rem;
        margin-right: 0.18rem;
        img{
            border-radius: 50%;
        }
    }

    .card {
        flex: 1;
        margin-right: 0.32rem;
        line-height: 0.44rem;
        .code {
            font-size: 0.32rem;
            font-weight: 600;
        }
        .name{
            font-size: 0.28rem;
            color:#666D80;
        }
    }

    .more_card {
        color: #1A59F6;
        font-size: 0.24rem;
        font-weight: 400;
    }


}

 .card_box_active {
    border: 1px solid #1A59F6;

    .checked {
        position: absolute;
        top: -1px;
        right: -1px;
        background-size: 100% 100%;
        width: 0.42rem;
        height: 0.36rem;

        >img {
            width: 0.17rem !important;
            height: 0.14rem !important;
            position: absolute;
            right: 0.06rem;
            top: 0.08rem;
        }
    }
}

.withdraw_accounr_dialog {
    
    .lists{
        height: 60vh;
        overflow-y: auto;
        margin-top:0.2rem;
        padding-bottom: 0.32rem;
    }
    .card_lists{
        padding: 0.2rem 0.32rem 0.32rem 0.32rem;
    }
    .search_box {
        height: 0.8rem;
        padding: 0 0.32rem;
        margin:0.52rem 0.3rem 0 0.3rem;
        display: flex;
        align-items: center;
        background-color: #F5F7FC;
        border-radius: 0.6rem;
        border: 1px solid #D0D8E2;

        .search_icon {
            width: 0.48rem;
            height: 0.48rem;
            margin-right: 0.24rem;
        }

        .ipt {
            height: 100%;
            font-weight: 400;
            color:#061023 !important;
        }
        .ipt::placeholder{
            color:#A4ACB9;
        }
    }
    .swap_dialog_item {
        height: 1.04rem;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #EFF3F8;
        overflow: hidden;
        position: relative;
        font-size:0.3rem;
        margin:0 0.32rem;
        .icon {
            width: 0.64rem;
            height: 0.64rem;
            margin-right: 0.2rem;
        }
    }
    .swap_dialog_item:last-child{
        border-bottom: 0px;
    }
    .swap_dialog_item_active {
        color: #014CFA;
        font-weight: 600;
        .check_icon {
            position: absolute;
            right: 0.24rem;
            color: #014CFA;
            width: 0.48rem;
            height: 0.48rem;
            top:50%;
            margin-top: -0.24rem;
        }
    }
    .card_box{
        margin-top: 0.22rem;
    }

}

</style>