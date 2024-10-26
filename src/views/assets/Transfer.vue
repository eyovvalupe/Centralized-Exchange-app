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

            <div class="form_box" :class="{ 'form_box_active': clickKey == 'from' }">
                <div class="flex justify-between" @click="openDialog('from')">
                    <div class="flex items-center">
                        <div class="form_text">从</div>
                        <div class="account_item">
                            <div class="account_item_icon">
                                <img :src="`/static/img/crypto/${form.from.toUpperCase()}.png`" alt="icon">
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

                <FormItem background="#fff" v-model="form.amount" btn-show-mode="focus" title="转入" @btnClick="maxIpt" show-btn :btn-placeholder="form.fromCurrency.name">
                    <template #title-right>
                        <={{ balance }}
                    </template>

                </FormItem>
                
            </div>
            
            <div class="form_box"  :class="{ 'form_box_active': clickKey == 'to' }">
                <div class="trans_icon" @click="transAccount" :class="[transing ? 'transing_icon' : 'transing_stop']">
                    <img src="/static/img/assets/recharge_trans.png" alt="img">
                </div>
                <!-- 到 -->
                <div class="flex justify-between" @click="openDialog('to')">
                    <div class="flex items-center">
                        <div class="form_text">到</div>
                        <div class="account_item">
                            <div class="account_item_icon">
                                <img :src="`/static/img/crypto/${form.to.toUpperCase()}.png`" alt="icon">
                            </div>
                            <div class="item_content">
                                <span>{{ _accountMap[form.to] }}</span>
                            </div>
                            
                        </div>

                        <div class="account_item">
                            <div class="account_item_icon">
                                <img :src="`/static/img/crypto/${form.toCurrency.name.toUpperCase()}.png`" alt="img">
                            </div>
                            <div class="item_content">
                                <span class="monty_span">{{ form.toCurrency.name || '' }}</span>
                            </div>
                            
                        </div>
                    </div>
                    <div class="more">
                        <img src="/static/img/assets/arrow_right.svg" alt="arrow_right">
                    </div>
                    
                </div>
                <FormItem background="#EFF3F8" custom btn-show-mode="focus" title="转出" show-btn :btn-placeholder="form.toCurrency.name">
                    <template #title-right>
                        <={{ balance }}
                    </template>
                    <div>
                        <span v-show="formType == 'transfer'">自动换算</span>
                        <span :style="{color:form.amount === '' ? '#A4ACB9' : ''}" v-show="formType == 'swap'">{{ form.amount === '' ? '自动换算' : new Decimal(form.amount || 0).mul(rate) || '--' }}</span>
                    </div>

                </FormItem>
                
            </div>

            <div class="rate_tip" v-if="formType == 'swap'"> 1{{ form.fromCurrency.name }} ≈ {{ rateLoading ? '--' :
                rate
                }} {{ form.toCurrency.name }}
            </div>
            
        </div>

        <Button @click="openSafePass" :loading="loading" round color="#014CFA" class="submit" type="primary">划转</Button>

        <!-- 充提记录 -->
        <RecordList ref="RecordListRef" />

        <!-- 安全密码弹窗 -->
        <SafePassword @submit="submit" ref="safeRef" />

        <!-- 账户和币种 -->
        <Popup class="van-popup-custom--bottom" v-model:show="showPicker" closeable round position="bottom" @closed="clickKey=''">
            <div class="van-popup-custom__top-rbtn" @click="hideDialog">确认</div>
            <div class="van-popup-custom-title">转入账户</div>
            
            <Picker :swipe-duration="200" :show-toolbar="false" :columns="columns" :columns-field-names="customFieldName"
                @cancel="hideDialog" @confirm="hideDialog" @change="onConfirm">
                <template #option="option">
                        <div class="picker-item">
                            <span class="picker-item__icon">
                                <img :src="`/static/img/crypto/${option.key.toUpperCase()}.png`" alt="icon">
                            </span>
                            <span class="picker-item__text">
                                {{ option.value }}
                            </span>
                        </div>
                    
                </template>
            </Picker>

        </Popup>
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { Button, Popup, showToast, Picker,Row,Col } from "vant"
import { ref, computed } from "vue"
import { _accountMap, _accountMapList } from "@/utils/dataMap"
import store from "@/store"
import SafePassword from "@/components/SafePassword.vue"
import { _transfer, _swapRate } from "@/api/api"
import RecordList from "@/components/RecordList.vue"
import FormItem from '@/components/Form/FormItem.vue'
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
const clickKey = ref('') // 从哪里点开弹窗
const openDialog = val => {
    clickKey.value = val
    showPicker.value = true
}
const hideDialog = ()=>{
    clickKey.value = ''
    showPicker.value = false
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

console.log(columns.value)

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
            position: relative;
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
            width: 1rem;
            height: 1rem;
            position: absolute;
            left:50%;
            margin-left: -0.5rem;
            top:-0.76rem;

        }

        .transing_icon {
            transition: all ease .5s;
            transform: rotate(360deg);
        }

        .transing_stop {
            transition: none;
            transform: rotate(0deg);
        }

        .rate_tip {
            font-size: 0.24rem;
            margin-top: 0.2rem;
            line-height: 0.4rem;
            color:#8F92A1;
           
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
        margin-top:0.84rem;
        font-size: 0.36rem;
    }

    .picker-item{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding-left: 0.6rem;
        &__icon{
            width: 0.48rem;
            height: 0.48rem;
            margin-right: 0.16rem;
            img{
                border-radius: 50%;
            }
        }
         
    }

    :deep(.action-sheet-active)::after{
        display: none;
    }   
    
}
</style>