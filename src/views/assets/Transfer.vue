<!-- 划转 -->
<template>
    <div class="page page_trnsfer">
        <Top :title="'划转'">
            <template #right>
                <div class="top-record" @click="goRecord">
                    <div class="top-record-icon">
                        <img src="/static/img/assets/record.png" />
                    </div>
                    <span>
                        {{$t("transfer.transferRecord")}}
                    </span>
                </div>
            </template>
        </Top>

        <!-- 表单 -->
        <div class="form">

            <div class="form_box" :class="{ 'form_box_active': showPicker }" @click="openDialog('from')">
                <div class="flex justify-between">
                    <div class="flex items-center">
                        <div class="form_text">从</div>
                        <div class="account_item">
                            <div class="account_item_icon">
                                <img v-if="form.from == 'money'" src="/static/img/assets/cash_icon.png" alt="icon">
                                <img v-else :src="`/static/img/crypto/${form.from.toUpperCase()}.png`" alt="img">
                            </div>
                            <div class="item_content">
                                <span>{{ _accountMap[form.from] }}</span>
                            </div>
                        </div>

                        <div class="account_item">
                            <div class="account_item_icon">
                                <img :src="`/static/img/crypto/${form.fromCurrency.name.toUpperCase()}.png`" alt="img">
                            </div>
                            <div class="item_content">
                                <span class="monty_span">{{ form.fromCurrency.name || '' }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="more">
                        <img src="/static/img/assets/arrow_right.svg" alt="arrow_right">
                    </div>
                </div>
                
            </div>
            
            <div class="form_box"  @click="openDialog('to')">
                    <!-- 到 -->
                   
                    <div class="form_text">到</div>
                    <div class="item account_item">
                        <div class="account_item_icon">
                            <img v-if="form.to == 'money'" src="/static/img/assets/cash_icon.png" alt="icon">
                            <img v-else :src="`/static/img/crypto/${form.to.toUpperCase()}.png`" alt="img">
                        </div>
                        <div class="item_content">
                            <span>{{ _accountMap[form.to] }}</span>
                        </div>
                        <div style="flex:1"></div>
                        <!-- <div class="more">
                            <img src="/static/img/assets/more.png" alt="more">
                        </div> -->
                    </div>

                    <div class="item account_item" style="flex: 1">
                        <div class="account_item_icon">
                            <img :src="`/static/img/crypto/${form.toCurrency.name.toUpperCase()}.png`" alt="img">
                        </div>
                        <div class="item_content">
                            <span class="monty_span">{{ form.toCurrency.name || '' }}</span>
                        </div>
                        <div style="flex:1"></div>
                        <div class="more">
                            <img src="/static/img/assets/more_icon.svg" alt="more">
                        </div>
                    </div>

                    <!-- <div class="item ipt_item" style="background-color: #f5f5f5">
                    <div class="ipt" v-show="formType == 'transfer'">{{ form.amount || '--' }}</div>
                    <div class="ipt" v-show="formType == 'swap'">{{ new Decimal(form.amount || 0).mul(rate) || '--' }}
                    </div>
                </div> -->
            </div>
            <div class="trans_icon" @click="transAccount" :class="[transing ? 'transing_icon' : 'transing_stop']">
                <img src="/static/img/assets/trans_icon2.png" alt="img">
            </div>
        </div>


        <!-- 输入 -->
        <div class="subtitle" style="margin-bottom: 0.32rem;">转出金额</div>
        <div class="item_box">
            <div class="item border_item ipt_item" :class="{ 'err_ipt': errStatus }">
                <div class="ipt_tip" v-show="form.amount === '' || focus">最多可转&nbsp;&nbsp;<span>{{ balance }}</span>

                </div>
                <input @focus="focus = true" @blur="blurInput" v-model="form.amount" type="number" :placeholder="``"
                    class="ipt">
                <div :style="{ opacity: focus ? '1' : '0', pointerEvents: focus ? 'all' : 'none' }" class="btn"
                    @click="maxIpt">
                    全部</div>
                <div style="font-size: 0.24rem;color: #999;">{{ form.fromCurrency.name || '' }}</div>
            </div>
        </div>
        <div class="subtitle" style="margin-bottom: 0.32rem;margin-top: 0.64rem">转入金额</div>
        <div class="item_box">
            <div class="item border_item ipt_item">
                <div class="ipt">
                    <span v-show="formType == 'transfer'">{{ form.amount || '--' }}</span>
                    <span v-show="formType == 'swap'">{{ new Decimal(form.amount || 0).mul(rate) || '--' }}</span>
                </div>
                <div style="font-size: 0.24rem;color: #999;">{{ form.toCurrency.name || '' }}</div>
            </div>
        </div>
        <div class="right_tip" v-if="formType == 'swap'"> 1{{ form.fromCurrency.name }} ≈ {{ rateLoading ? '--' :
            rate
            }} {{ form.toCurrency.name }}
        </div>


        <Button @click="openSafePass" :loading="loading" round color="#014CFA" class="submit" type="primary">确定</Button>

        <!-- 充提记录 -->
        <RecordList ref="RecordListRef" />

        <!-- 安全密码弹窗 -->
        <SafePassword @submit="submit" ref="safeRef" />

        <!-- 账户和币种 -->
        <Popup v-model:show="showPicker" round position="bottom">
            <Picker :swipe-duration="200" :columns="columns" :columns-field-names="customFieldName"
                @cancel="showPicker = false" @confirm="showPicker = false" @change="onConfirm" />
        </Popup>
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { Button, Popup, showToast, Picker } from "vant"
import { ref, computed } from "vue"
import { _accountMap, _accountMapList } from "@/utils/dataMap"
import store from "@/store"
import SafePassword from "@/components/SafePassword.vue"
import { _transfer, _swapRate } from "@/api/api"
import RecordList from "@/components/RecordList.vue"
import { useRoute } from "vue-router"
import router from "@/router"
import Decimal from 'decimal.js';


const route = useRoute()
const focus = ref(false) // 是否在输入中
const blurInput = () => {
    setTimeout(() => { errStatus.value = focus.value = false }, 0)
}
const assets = computed(() => store.state.assets || {})
const wallet = computed(() => store.state.wallet || []) // 钱包
const elseWallet = computed(() => store.state.elseWallet || []) // 其他账户钱包
const elseCoinMap = computed(() => store.state.elseCoinMap || {}) // 其他账户的币种

// 表单
const loading = ref(false)
const form = ref({
    from: route.query.from || 'money',
    fromCurrency: {},
    to: route.query.to || 'stock',
    toCurrency: {},
    amount: "",
})
const formType = computed(() => { // 币种相同是划转  币种不同是兑换
    if (form.value.fromCurrency.currency == form.value.toCurrency.currency) return 'transfer'
    return 'swap'
})
// 设置默认货币
if (wallet.value[0]) {
    form.value.fromCurrency = wallet.value[0]
}
const t1 = elseWallet.value.find(item => item.account == form.value.to)
if (t1) {
    form.value.toCurrency = t1
}
setTimeout(() => {
    if (formType.value == 'swap') {
        getRate()
    }
}, 0)
const maxIpt = () => {
    form.value.amount = balance.value
}



// 账户选择
const showPicker = ref(false)
const clickKey = ref('from') // 从哪里点开弹窗
const openDialog = val => {
    clickKey.value = val
    showPicker.value = true
}
const columns = computed(() => {
    return _accountMapList.map(item => {
        item.className = clickKey.value == 'from' ? (form.value.from == item.key ? 'action-sheet-active' : '') : (form.value.to == item.key ? 'action-sheet-active' : '')
        if (item.key == 'money') { // 现金账户
            item.currencys = wallet.value.map(w => {
                return {
                    key: w.currency,
                    currency: w.currency,
                    value: w.name,
                    name: w.name,
                    className: clickKey.value == 'from' ? (form.value.fromCurrency.currency == w.currency ? 'action-sheet-active' : '') : (form.value.toCurrency.currency == w.currency ? 'action-sheet-active' : ''),
                }
            })
        } else { // 其他账户
            const target = elseWallet.value.find(a => a.account == item.key)
            if (target) {
                item.currencys = [{
                    key: target.currency,
                    value: target.name,
                    currency: target.currency,
                    name: target.name,
                    className: clickKey.value == 'from' ? (form.value.fromCurrency.currency == target.currency ? 'action-sheet-active' : '') : (form.value.toCurrency.currency == target.currency ? 'action-sheet-active' : ''),
                }]
            } else {
                item.currencys = [{
                    key: '',
                    value: '',
                    currency: '',
                    name: ''
                }]
            }
        }
        return item
    })
})

const customFieldName = {
    text: 'value',
    value: 'key',
    children: 'currencys'
}
const onConfirm = ({ selectedOptions }) => {
    if (clickKey.value == 'from') {
        form.value.from = selectedOptions[0].key
        form.value.fromCurrency = selectedOptions[1]
    } else {
        form.value.to = selectedOptions[0].key
        form.value.toCurrency = selectedOptions[1]
    }
    // showPicker.value = false
    setTimeout(() => {
        if (formType.value == 'swap') {
            getRate()
        }
    }, 0)
}


const balance = computed(() => { // 余额
    if (form.value.from == 'money') {  // 转出
        const w = wallet.value.find(item => item.currency == form.value.fromCurrency.key)
        return w ? w.amount : 0
    } else { // 转入
        const w = elseWallet.value.find(item => item.account == form.value.from)
        return w ? w.amount : 0
    }
})



// 表单提交
const safeRef = ref()
const errStatus = ref(false)
const openSafePass = () => {
    if (!form.value.amount || form.value.amount <= 0) {
        errStatus.value = true
        return showToast('请输入金额')
    }
    if (balance.value < form.value.amount) {
        return showToast('余额不足')
    }
    if (form.value.from == form.value.to && form.value.fromCurrency.currency == form.value.toCurrency.currency) {
        return showToast('同一账户无法划转')
    }
    safeRef.value.open()
}
const submit = s => {
    const params = {
        // ...form.value,
        account_from: form.value.from,
        from: form.value.fromCurrency.currency,
        account_to: form.value.to,
        to: form.value.toCurrency.currency,
        amount: form.value.amount,
        safeword: s,
        token: sessionToken.value
    }
    if (loading.value) return
    loading.value = true
    _transfer(params).then(res => {
        if (res.code == 200) {
            showToast('划转成功');
            form.value.amount = ''
            store.dispatch('updateWallet') // 更新资产
            setTimeout(() => {
                router.back()
            }, 500)
        }
    }).finally(() => {
        getSessionToken()
        loading.value = false
    })
}


// 弹窗
const transing = ref(false) // 转换动画中
const goTransing = () => {
    transing.value = true
    setTimeout(() => {
        transing.value = false
    }, 500)
}
const transAccount = () => {
    goTransing()
    const to = form.value.to
    form.value.to = form.value.from
    form.value.from = to
    const currency = form.value.toCurrency
    form.value.toCurrency = form.value.fromCurrency
    form.value.fromCurrency = currency
    setTimeout(() => {
        if (formType.value == 'swap') {
            getRate()
        }
    }, 0)
}


// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    loading.value = true
    store.dispatch("updateSessionToken").finally(() => {
        loading.value = false
    })
}
getSessionToken()


const rate = ref(0)
const rateLoading = ref(false)
const getRate = () => { // 获取汇率
    rateLoading.value = true
    _swapRate({
        from: form.value.fromCurrency.currency,
        to: form.value.toCurrency.currency,
        amount: 0
    }).then(res => {
        if (res.code == 200) {
            rate.value = res.data.exchange_rate
        }
    }).finally(() => {
        rateLoading.value = false
    })
}


// 跳转记录
const RecordListRef = ref()
const goRecord = () => {
    router.push({
        name: 'recordList',
        query: {
            tab: 2
        }
    })
}
</script>

<style lang="less" scoped>
.page_trnsfer {
    padding: 1rem 0.32rem 1.44rem 0.32rem;
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

    .form {
       
        .form_box {
            border-radius: 0.32rem;
            background-color: #F5F7FC;
            border: 1px solid #EFF3F8;
            padding: 0.42rem 0.32rem 0.4rem 0.32rem;
            margin-top: 0.52rem;
        }
        .form_text{
            color:#666D80;
            margin-right: 0.32rem;
        }

        .form_box_active {
            border: 1px solid #014CFA;

        }

        .err_ipt {
            border: 1px solid #E8503A;
        }

        .account_item {
            display: flex;
            align-items: center;
            .account_item_icon {
                width: 0.48rem;
                height: 0.48rem;
                margin-right: 0.16rem;
                img{
                    border-radius: 50%;
                }
            }
        }
        .account_item + .account_item{
            margin-left: 0.4rem;
        }

        .trans_icon {
            width: 0.6rem;
            height: 0.6rem;
        }

        .transing_icon {
            transition: all ease .5s;
            transform: rotate(360deg);
        }

        .transing_stop {
            transition: none;
            transform: rotate(0deg);
        }

        .subtitle {
            font-size: 0.28rem;
            color: #333333;
            font-weight: 400;
            line-height: 0;
            margin: 0 0.2rem 0 0;
        }

        .right_tip {
            font-size: 0.24rem;
            text-align: right;
            margin-top: 0.2rem;
            padding-right: 0.12rem;

            span {
                margin-left: 0.2rem;
            }
        }

        .tip {
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
    }

    .submit {
        width: 100%;
        height: 1.12rem;
        margin: 2.5rem 0 0.4rem 0;
    }
}
</style>

<style lang="less" scoped>
.transfer_accounr_dialog {
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

    .transfer_dialog_item {
        overflow: auto;
        height: 1.12rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #F5F5F5;
    }

    .transfer_dialog_item_active {
        color: #014CFA;
        font-weight: 600;
        position: relative;

        .check_icon {
            position: absolute;
            right: 0.64rem;
            color: #014CFA;
            font-size: 0.28rem;
        }
    }
}
</style>