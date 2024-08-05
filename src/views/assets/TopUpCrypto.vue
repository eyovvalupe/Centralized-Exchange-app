<!-- 充值-虚拟货币 -->
<template>
    <div class="page page_topup_crypto">
        <Top :title="'充值'">
            <template #right>
                <div class="top-record" @click="goRecord">
                    <img src="/static/img/user/withdraw_record_icon.png" alt="img">
                </div>
            </template>
        </Top>

        <div class="form">
            <div class="subtitle">
                <span>币种</span>
                <span style="margin-left: 0.6rem">网络</span>
            </div>
            <div class="item">
                <div class="select_item border_item" @click="showDialog = true">
                    <div class="currency" v-if="form.currency">
                        <div class="currency_icon">
                            <img :src="`/static/img/crypto/${form.currency.toUpperCase()}.png`" alt="currency">
                        </div>
                        <span>{{ form.currency.toUpperCase() }}</span>
                    </div>
                    <div class="more">
                        <img src="/static/img/assets/more.png" alt="more">
                    </div>
                </div>
                <div class="select_item border_item" style="margin-left: 0.6rem" @click="showNetDialog = true">
                    <div class="currency" v-if="form.network">
                        <span>{{ form.network.toUpperCase() }}</span>
                    </div>
                    <div class="more">
                        <img src="/static/img/assets/more.png" alt="more">
                    </div>
                </div>
            </div>

            <div class="subtitle">
                <span>充值金额</span>
                <span class="subtitle_right" @click="topUpMode = topUpMode == 1 ? 2 : 1">切换为 <b>{{ topUpMode == 1 ? 'MAIN' : form.currency.toUpperCase() }}</b></span>
            </div>
            <div class="item border_item" :class="{ 'err_ipt': errStatus }">
                <div class="item_content">
                    <input class="ipt" @blur="errStatus = false" type="number" v-model="form.amount" placeholder="请输入">
                </div>
                <div>{{ topUpMode == 1 ? form.currency.toUpperCase() : 'MAIN' }}</div>
            </div>
            <div class="tip" v-if="topUpMode == 2">
                <span style="margin: 0 0.1rem">≈ {{targetAmount}}{{form.currency.toUpperCase()}}</span>
                <Loading v-show="rateLoading" type="spinner" size="12px" />
            </div>

            <div class="border_item act_body">
                <div>活动内容</div>
                <div>--</div>
            </div>

        </div>

        <Button @click="goTopUp" :loading="loading" round color="#014CFA" class="submit" type="primary">确定</Button>


        <!-- 币种选择弹窗 -->
        <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" class="self_van_popup"
            v-model:show="showDialog" position="bottom" teleport="body">
            <div class="topup_accounr_dialog">
                <div class="close_icon" @click="showDialog = false">
                    <img src="/static/img/common/close.png" alt="x">
                </div>
                <div @click="clickItem(keyStr)" class="swap_dialog_item"
                    :class="{ 'swap_dialog_item_active': form.currency == keyStr }" v-for="(val, keyStr) in networkMapList"
                    :key="keyStr">
                    <div class="icon">
                        <img :src="`/static/img/crypto/${keyStr.toUpperCase()}.png`" alt="currency">
                    </div>
                    <span>{{ keyStr.toUpperCase() }}</span>

                    <Icon v-if="form.currency == keyStr" class="check_icon" name="success" />
                </div>
            </div>
        </Popup>

        <!-- 网路选择弹窗 -->
        <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" class="self_van_popup"
            v-model:show="showNetDialog" position="bottom" teleport="body">
            <div class="topup_accounr_dialog">
                <div class="close_icon" @click="showNetDialog = false">
                    <img src="/static/img/common/close.png" alt="x">
                </div>
                <div @click="clickNetItem(item)" class="swap_dialog_item"
                    :class="{ 'swap_dialog_item_active': form.network == item }" v-for="(item, i) in currNetwork"
                    :key="i">
                    <span>{{ item.toUpperCase() }}</span>

                    <Icon v-if="form.network == item" class="check_icon" name="success" />
                </div>
            </div>
        </Popup>


        <!-- 充提记录 -->
        <RecordList ref="RecordListRef" />

        <!-- 安全密码弹窗 -->
        <SafePassword @submit="submit" ref="safeRef"></SafePassword>

        <!-- 账号验证 -->
        <AccountCheck ref="AccountCheckRef" />
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import router from "@/router"
import { ref, computed, onBeforeUnmount } from "vue"
import store from "@/store";
import { Popup, Button, Icon, showToast, Loading, showLoadingToast, closeToast } from "vant"
import { useRoute } from "vue-router"
// import { _networkMapList } from "@/utils/dataMap.js"
import RecordList from "@/components/RecordList.vue"
import SafePassword from "@/components/SafePassword.vue"
import AccountCheck from "@/components/AccountCheck.vue"
import { _swapRate } from "@/api/api"
import Decimal from "decimal.js";
import { _cryptoCoin } from "@/api/api"

const safeRef = ref()

const RecordListRef = ref()
const route = useRoute()
const loading = ref(false)
// 表单
const form = ref({
    amount: '',
    currency: '',
    network: '',
})

const topUpMode = ref(1) // 1-选择的币种 2-法币

// 货币选择
const showDialog = ref(false)
// 钱包
const wallet = computed(() => { // 可选钱包列表
    return store.state.wallet.filter(item => !['stock', 'contract', 'main', 'USD'].includes(item.currency)) || []
})
form.value.currency = route.query.currency || 'BTC' // 初始化默认币种
const clickItem = item => {
    form.value.currency = item
    showDialog.value = false
    initNetwork()
}

// 网络选择
const networkMapList = ref({})
const currNetwork = computed(() => {
    return networkMapList.value[form.value.currency.toUpperCase()] || []
})
const initNetwork = () => {
    form.value.network = currNetwork.value[0]
    setTimeout(() => {
        getRate()
    }, 0)
}
const showNetDialog = ref(false)
const clickNetItem = item => {
    form.value.network = item
    showNetDialog.value = false
}
// initNetwork()
const getCoinNet = () => {
    showLoadingToast({
            duration: 0,
            loadingType: 'spinner',
        })
    _cryptoCoin().then(res => {
        networkMapList.value = res.data || {}
        const k = Object.keys(networkMapList.value)[0]
        if (k) {
            clickItem(k)
        }
    }).finally(() => {
        closeToast();
    })
}
getCoinNet()

const goRecord = () => {
    // router.push({
    //     name: 'topUpRecord'
    // })
    RecordListRef.value && RecordListRef.value.open()
}
const errStatus = ref(false)
const AccountCheckRef = ref()
const goTopUp = () => {
    if (!form.value.amount || form.value.amount <= 0) {
        errStatus.value = true
        return showToast('请输入金额')
    }
    if (topUpMode == 2 && !rate.value) {
        return showToast('正在获取汇率')
    }
    if (AccountCheckRef.value.check()) {
        // safeRef.value.open()
        submit()
    }
}
const submit = () => {
    router.push({
        name: 'recharging',
        query: {
            amount: topUpMode == 1 ? form.value.amount : targetAmount.value,
            currency: form.value.currency,
            network: form.value.network,
        }
    })
}


// 汇率
const rate = ref('')
const targetAmount = computed(() => {
    return new Decimal(form.value.amount || 0).div(rate.value || 1).toFixed(2)
})
let timeout = null
let interval = null
const timeDown = ref(10)
const rateLoading = ref(false)
const getRate = () => {
    if (timeout) clearTimeout(timeout)
    if (interval) clearInterval(interval)
    timeDown.value = 10
    rateLoading.value = true
    _swapRate({
        from: form.value.currency,
        to: 'main',
        amount: 0
    }).then(res => {
        if (res.code == 200) {
            rate.value = res.data.exchange_rate
            console.error(rate.value)
            interval = setInterval(() => {
                timeDown.value--
                if (timeDown.value <= 0) {
                    getRate()
                }
            }, 1000)
        }
    }).finally(() => {
        rateLoading.value = false
    })
}

onBeforeUnmount(() => {
    if (interval) clearInterval(interval)
})
</script>

<style lang="less" scoped>
.page_topup_crypto {
    padding: 1rem 0.32rem 1.5rem 0.32rem;

    position: relative;

    .top-record {
        width: 0.64rem;
        height: 0.64rem;
        border-radius: 50%;
        background-color: #EDEDED;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            width: 0.36rem !important;
            height: 0.36rem !important;
        }
    }

    .form {
        margin-top: 0.5rem;

        .item {
            width: 100%;
            height: 1.12rem;
            margin-bottom: 0.6rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-weight: 400;

            .item_pre {
                width: 1rem;
                font-size: 0.28rem;
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

                .ipt {
                    width: 100%;
                    height: 100%;
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
        }

        .border_item {
            border-radius: 0.12rem;
            border: 1px solid #D0D8E2;
            padding: 0 0.4rem 0 0.76rem;

            &:has(.ipt:focus) {
                border: 1px solid #014CFA;
            }
        }
        .tip {
            font-size: 0.24rem;
            position: relative;
            top: -0.4rem;
            display: flex;
            align-items: flex-start;
            justify-content: flex-start;
        }

        .err_ipt {
            border: 1px solid #E8503A;
        }

        .select_item {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 100%;
        }

        .subtitle {
            display: flex;
            font-size: 0.28rem;
            color: #333333;
            font-weight: 400;
            line-height: 0.36rem;
            margin: 0rem 0 0.12rem 0;

            >span {
                flex: 1;
            }
            .subtitle_right {
                text-align: right;
                b {
                    color: #014CFA;
                }
            }
        }

        .act_body {
            padding: 0.4rem;
            font-size: 0.28rem;
            line-height: 0.36rem;
        }
    }

    .submit {
        width: calc(100% - 0.64rem);
        height: 1.12rem;
        position: absolute;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>
<style lang="less" scoped>
.topup_accounr_dialog {
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
}
</style>