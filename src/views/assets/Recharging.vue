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

        <div class="form">
            <div class="amount">
                <div>{{ form.currency }}</div>
                <div class="num">{{ form.amount }}</div>
            </div>
            <div class="subtitle">充币网络</div>
            <div class="net_box">
                <div @click="changeNet(item)" class="net" :class="{ 'active_net': form.network == item }"
                    v-for="item in _networkMapList" :key="item">
                    <span>{{ item }}</span>
                    <div class="ok" v-if="form.network == item">
                        <img src="/static/img/common/ok.png" alt="ok">
                    </div>

                </div>
            </div>
            <div class="subtitle">充币地址</div>
            <div class="qrcode_box">
                <Loading :loading="loading" v-show="loading" />
                <div id="qrcode" ref="qrcodeRef" v-show="!loading"></div>
            </div>
            <div class="address">
                <span>{{ address }}</span>
                <div class="ripple_button copy_icon" @click="copy">
                    <img src="/static/img/common/copy.png" alt="img">
                </div>
            </div>
        </div>

        <Circle class="circle" size="60px" v-if="s && !loading" v-model:current-rate="currentRate" :rate="0"
            :text="s + 's'" />
        <div class="tip">请扫码支付后，点击完成 <span v-if="s && !loading">（支付时间：{{ s }}s）</span></div>
        <Button @click="openSure" :loading="loading" round color="#014CFA" class="submit" type="primary">确定</Button>

    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { _networkMapList } from "@/utils/dataMap.js"
import { useRoute } from "vue-router"
import { ref, computed } from "vue"
import { Button, showNotify, showToast, showConfirmDialog, Circle } from "vant"
import { _copyTxt } from "@/utils/index.js"
import Loading from "@/components/Loaidng.vue"
import { _paycode, _deposit } from "@/api/api"
import store from "@/store"
import router from "@/router"

const route = useRoute()

// 表单
const loading = ref(false)
const form = ref({
    amount: route.query.amount,
    currency: route.query.currency,
    network: _networkMapList[0],
})
const address = ref('')
const changeNet = item => { // 切换网络
    if (loading.value) return
    form.value.network = item
    if (qrcodeRef.value) {
        qrcodeRef.value.innerHTML = ''
    }
    setTimeout(() => {
        getAddress()
    }, 0)
}

// 获取充值地址
const getAddress = () => {
    if (loading.value) return
    loading.value = true
    _paycode({
        currency: form.value.currency,
        network: form.value.network
    }).then(res => {
        if (res.code == 200) {
            address.value = res.data?.address || '1234567890'
            drawQrcode()
            startCountDown()
        }
    }).finally(() => {
        loading.value = false
    })
}
getAddress()

// 倒计时
const s = ref(0)
const max = 60
const currentRate = computed(() => {
    return s.value * 100 / 60
})
let interval = null
const startCountDown = () => {
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
        new QRCode(document.getElementById("qrcode"), {
            text: address.value,
            width: 128,
            height: 128,
        });
    }, 50)
}


// 提交确认
const openSure = () => {
    showConfirmDialog({
        title: '确认操作',
        message:
            '确认提交充值申请？',
        confirmButtonColor: '#014CFA',
        cancelButtonColor: '#323233'
    })
        .then(() => {
            submit()
        }).catch(() => { })
}
// 提交表单
const submit = () => {
    if (loading.value) return
    loading.value = true
    _deposit({
        currency: form.value.currency,
        amount: form.value.amount,
        network: form.value.network,
        token: sessionToken.value,
    }).then(res => {
        if (res.code == 200) {
            showNotify({ type: 'success', message: '操作成功' });
            // 跳转充值详情
            router.replace({
                name: "topUpItem",
                query: {
                    order_no: "1122334455"
                }
            })
        }
    }).finally(() => {
        getSessionToken()
        loading.value = false
    })
}


// 复制
const copy = () => {
    _copyTxt(address.value)
    showToast('已复制');
}


// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    store.dispatch("updateSessionToken")
}
getSessionToken()
</script>

<style lang="less" scoped>
.page_recharge {
    padding: 1.4rem 0.32rem 0.2rem 0.32rem;

    position: relative;

    .top-record {
        width: 0.4rem;
        height: 0.4rem;
    }

    .form {
        .amount {
            text-align: center;
            color: #000000;
            font-size: 0.4rem;
            line-height: 0.48rem;
            font-weight: 400;

            .num {
                font-weight: 500;
                font-size: 1rem;
                line-height: 1.4rem;
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
            width: 3.34rem;
            height: 3.34rem;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.1rem;

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
            border: 1px solid #DFE2E4;
            height: 1rem;
            border-radius: 0.08rem;
            padding: 0 0.4rem 0 0.24rem;
            display: flex;
            align-items: center;
            margin-top: 0.4rem;

            >span {
                white-space: nowrap;
                overflow: hidden;
                flex: 1;
                text-overflow: ellipsis;
                color: #121212;
                font-weight: 400;
                font-size: 0.32rem;
            }

            .copy_icon {
                width: 0.48rem;
                height: 0.48rem;
                margin-left: 0.3rem;
                overflow: hidden;
            }
        }

        .net_box {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .net {
                height: 0.74rem;
                background-color: #F2F2F2;
                width: 3.3rem;
                border-radius: 0.08rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.28rem;
                color: #061023;
                line-height: 0;
                margin-bottom: 0.4rem;
                position: relative;
                overflow: hidden;
            }

            .active_net {
                border: 1px solid #1A59F6;
                color: #1A59F6;

                .ok {
                    width: 0.2rem;
                    height: 0.2rem;
                    position: absolute;
                    right: 0.02rem;
                    top: 0.02rem;
                    z-index: 22;
                }

                &::after {
                    content: "";
                    width: 1rem;
                    height: 1rem;
                    background-color: #1A59F6;
                    position: absolute;
                    right: -0.65rem;
                    top: -0.65rem;
                    transform: rotate(-48deg);
                    z-index: 11;
                }
            }
        }
    }

    .circle {
        margin: 0.9rem auto 0.2rem auto;
        display: block;
    }

    .tip {
        font-weight: 400;
        color: #8F92A1;
        font-size: 0.24rem;
        line-height: 0.32rem;
        margin: 0 0 0.4rem 0;
        text-align: center;
    }

    .submit {
        width: 100%;
        height: 1.12rem;
        margin: 0 0 0.4rem 0;
    }
}
</style>