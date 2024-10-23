<!-- 充值中 -->
<template>
    <div class="page page_recharge">
        <Top :title="'充值'">
            <template #right>
                <div class="top-record" @click="goRecord">
                    <img src="/static/img/user/server.png" alt="img">
                </div>
            </template>
        </Top>

        <div class="recharge_box">

            <div class="time_box" v-if="s && !loading">
                <div class="time_box_label">充值倒计时</div>
                <div class="time">{{ showS }}</div>
                <div class="network-tag" v-if="form.name">
                    <span>{{form.name}} · {{form.network }}</span>
                </div>
                <div class="amount" @click="copyPrice">
                    {{ form.amount }}
                    <span>{{form.name}}</span>
                    <!-- <div v-if="rate">{{ratePrice }} USDT</div> -->

                </div>
                <div class="network-tag">
                    <span style="color:#000;">$20,991.18</span>
                </div>
            </div>
        </div>

        <div class="recharge_box">
            <div class="qrcode_box">
                <Loading :loading="loading" v-show="loading" />
                <div id="qrcode" ref="qrcodeRef" v-show="!loading"></div>

                <!-- 已过期  -->
                <div v-if="s == 0 && !loading" style="width:100%;height:100%;position: absolute;top:0;left:0;z-index:1">
                    <img src="/static/img/assets/Expired.png" alt="Expired">
                </div>
                <div class="timeout_box" v-if="s == 0 && !loading">
                    <div class="warning_icon">
                        <img src="/static/img/common/warning.png" alt="img">
                    </div>
                    <div>二维码已过期</div>
                </div>
            </div>

            <div class="address" v-if="address">
                <div class="address_label">收款人钱包地址</div>
                <div class="address_val">{{ address }}</div>
                <div class="address_copy_btn" @click="copy">复制</div>
            </div>

            <div class="tip">
                提示：请在截至时间内完成充值<br/>
                订单到期作废
            </div>
        </div>

        <!-- <div class="circle_box">
            <Circle class="circle" :start-position="'right'" :stroke-linecap="'butt'" :stroke-width="150"
                :layer-color="'#E5E5E5'" :color="'#014CFA'" size="40px" v-if="s && !loading"
                v-model:current-rate="currentRate" :rate="0" :text="''" />
            <div class="time_box" v-if="s && !loading">
                <div class="time">{{ showS }}</div>
                <div>截至时间</div>
            </div>
        </div> -->
        
        <div class="btns">
           
            <Button v-if="orderStatus == 'success'" @click="router.back()" :loading="loading" round color="#18B762"
                style="width:100%" class="submit" type="info"><span style="color:#fff">成功</span></Button>
            <Button v-else-if="orderStatus == 'failure'" @click="router.back()" :loading="loading" round color="#E8503A"
                style="width:100%" class="submit" type="info"><span style="color:#fff">失败</span></Button>
            <Button v-else @click="router.back()" :loading="loading" round color="#014CFA" style="width:100%"
                class="submit" type="info"><span style="color:#fff">完成</span></Button>
        </div>

    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { useRoute } from "vue-router"
import { ref, computed } from "vue"
import { Button, showToast, Circle } from "vant"
import { _copyTxt } from "@/utils/index.js"
import Loading from "@/components/Loaidng.vue"
import { _deposit1, _deposit, _depositGet, _swapRate } from "@/api/api"
import store from "@/store"
import router from "@/router"
import Decimal from "decimal.js"

const route = useRoute()

// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    loading.value = true
    return store.dispatch("updateSessionToken")
}


// 表单
const orderStatus = ref('') // 状态
const loading = ref(false)
const order_no = ref(route.query.order_no) // 订单编号
const form = ref({
    name: route.query.name,
    amount: Number(route.query.amount),
    currency: route.query.currency,
    network: route.query.network,
    // swap: route.query.swap ? JSON.parse(route.query.swap) : false
})
const address = ref('')


// 获取充值地址
const getAddress = () => {
    loading.value = true
    _deposit1({
        currency: form.value.currency,
        network: form.value.network,
        amount: form.value.amount,
        token: sessionToken.value,
        swap: form.value.swap
    }).then(res => {
        if (res.code == 200) {
            address.value = res.data?.address || ''
            drawQrcode()
            startCountDown(res.data?.timeout || 60)
            order_no.value = res.data?.order_no

            setTimeout(() => {
                getRate()
                router.replace({
                    name: 'recharging',
                    query: {
                        order_no: order_no.value
                    }
                })
            }, 200)
        }
    }).finally(() => {
        loading.value = false
    })
}

// 获取订单详情
const getOrderInfo = () => {
    loading.value = true
    _depositGet({
        order_no: order_no.value
    }).then(res => {
        if (res.data) {
            orderStatus.value = res.data.status
            form.value = {
                amount: res.data.amount,
                currency: res.data.currency,
                network: res.data.network,
                swap: false
            }
            address.value = res.data.address
            drawQrcode()
            startCountDown(res.data?.timeout || 60)

            setTimeout(() => {
                getRate()
            }, 200)
        }
    }).finally(() => {
        loading.value = false
    })
}

if (order_no.value) { // 查看订单详情
    getOrderInfo()
} else { // 获取充值地址
    getSessionToken().then(res => {
        getAddress()
    })
}


// 倒计时
const s = ref(0)
const showS = computed(() => {
    if (s.value > 0) {
        if (s.value < 3600) {
            const m = Math.floor(s.value / 60)
            const sec = s.value % 60
            return `${m >= 10 ? m : '0' + m}:${sec >= 10 ? sec : '0' + sec}`
        } else {
            const h = Math.floor(s.value / 3600)
            const m = Math.floor(s.value % 3600 / 60)
            const sec = s.value % 60
            return `${h}:${m >= 10 ? m : '0' + m}:${sec >= 10 ? sec : '0' + sec}`
        }
    }
    return '--'
})
const currentRate = computed(() => {
    return s.value * 100 / timeoutMax.value
})
let interval = null
const timeoutMax = ref(1)
const startCountDown = (max) => {
    if (!max || max <= 0) max = 0
    timeoutMax.value = max
    s.value = max
    interval && clearInterval(interval)
    interval = setInterval(() => {
        s.value--
        if (s.value == 0) {
            clearInterval(interval)
        }
    }, 1000);
}

// 生成二维码
const qrcodeRef = ref()
const drawQrcode = () => {
    setTimeout(() => {
        if (!qrcodeRef.value || !address.value) return
        new QRCode(qrcodeRef.value, {
            text: address.value,
            width: 128,
            height: 128,
        });
    }, 100)
}

const rate = ref(0)
const rateLoading = ref(false)
const ratePrice = computed(() => {
    if (!rate.value || rateLoading.value) return '--'
    return new Decimal(form.value.amount).mul(rate.value)
})
const getRate = () => { // 获取汇率
    rateLoading.value = true
    _swapRate({
        from: form.value.currency,
        to: 'USDT',
        amount: 0
    }).then(res => {
        if (res.code == 200) {
            rate.value = res.data.exchange_rate
        }
    }).finally(() => {
        rateLoading.value = false
    })
}



// 复制
const copy = () => {
    _copyTxt(address.value)
    showToast('已复制');
}
const copyPrice = () => {
    _copyTxt(form.value.amount)
    showToast('已复制');
}



</script>

<style lang="less" scoped>
.page_recharge {
    padding: 1.12rem 0.32rem 0.32rem 0.32rem;

    position: relative;

    .top-record {
        width: 0.4rem;
        height: 0.4rem;
    }

    .recharge_box {
        border-radius: 0.32rem;
        margin-top: 0.2rem;
        background: #FFF;
        box-shadow: 0px 0.02rem 0.2rem 0 rgba(1, 76, 250, 0.20);
        padding:0.32rem;
        .amount {
            color: #014CFA;
            text-align: center;
            font-size: 0.48rem;
            font-weight: 600;
            line-height: 0.36rem;
            span{
                font-size: 0.32rem;
                font-weight: 400;
            }
        }

        .time_box {
            margin-left: 0.12rem;
            color: #666;
            font-size: 0.24rem;
            font-weight: 400;
            text-align: left;
            &_label{
                color: #666D80;
                text-align: center;
                font-size: 0.28rem;
                line-height: 0.36rem; 
            }
            .time {
                color: #E8503A;
                font-size: 0.32rem;
                font-weight: 500;
                margin-bottom: 0.07rem;
            }
            .network-tag{
                display: flex;
                justify-content: center;
                align-content: center;
                span{
                    height: 0.6rem;
                    padding: 0 0.28rem;
                    border-radius: 0.5rem;
                    background-color:#F5F7FC;
                    color: #014CFA;
                    font-size: 0.28rem;
                }
            }
        }

        .subtitle {
            font-weight: 400;
            font-size: 0.28rem;
            color: #323235;
            line-height: 0.44rem;
            margin-bottom: 0.4rem;
        }

        .qrcode_box {
            border: 1px solid #DFE2E4;
            background-color: #fff;
            width: 3rem;
            height: 3rem;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.1rem;
            position: relative;

            .timeout_box {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;
                position: absolute;
                z-index: 9;
                top: 0;
                left: 0;
                background-color: rgba(255, 255, 255, 0.8);

                .warning_icon {
                    width: 1rem;
                    height: 1rem;
                    margin-bottom: 0.4rem;
                }
            }

            #qrcode {
                width: 100%;
                height: 100%;

                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        .address {
            border-radius: 0.08rem;
            padding: 0 0.4rem 0 0.24rem;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 0.1rem;

            >span {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: #121212;
                font-weight: 400;
                font-size: 0.28rem;
            }

            .copy_icon {
                width: 0.36rem;
                height: 0.36rem;
                margin-left: 0.1rem;
                overflow: hidden;
            }
        }
    }


    .tip {
        color: #8F92A1;
        text-align: center;
        font-family: Inter;
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.32rem; 
    }

    .btns {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 0.6rem;
        padding: 0 0.32rem;
        .submit {
            width: 100%;
            height: 1.12rem;
        }
    }

}
</style>