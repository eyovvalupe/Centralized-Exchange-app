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
                <div>{{ form.currency }} -- {{ form.network }}</div>
                <div class="num">{{ form.amount }}</div>
            </div>
            <div class="qrcode_box">
                <Loading :loading="loading" v-show="loading" />
                <div id="qrcode" ref="qrcodeRef" v-show="!loading"></div>
            </div>
            <div class="address" @click="copy">
                <span>{{ address }}</span>
                <div class=" copy_icon">
                    <img src="/static/img/common/copy.png" alt="img">
                </div>
            </div>
        </div>

        <div class="circle_box">
            <Circle class="circle" :start-position="'right'" :stroke-linecap="'butt'" :stroke-width="150"
                :layer-color="'#E5E5E5'" :color="'#014CFA'" size="60px" v-if="s && !loading"
                v-model:current-rate="currentRate" :rate="0" :text="''" />
            <div class="time_box">
                <div class="time">{{ s ? s + 's' : '--' }}</div>
                <div>超时时间</div>
            </div>
        </div>
        <div class="tip">
            <div>提示：请在1分钟内完成充值</div>
            <div>{{ s ? s + 's' : '--' }}后二维码刷新</div>
        </div>
        <div class="btns">
            <Button round color="#EFF6FF" class="submit" type="info" @click="router.back()">
                <span style="color:#014CFA">取消</span>
            </Button>
            <Button @click="openSure" :loading="loading" round color="#014CFA" class="submit" type="primary">确定</Button>
        </div>

    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
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
    network: route.query.network,
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
            address.value = res.data?.address || ''
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
            getAddress()
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
                font-weight: 600;
                font-size: 1rem;
                line-height: 1.4rem;
                font-family: fangsong;
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
            border-radius: 0.08rem;
            padding: 0 0.4rem 0 0.24rem;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 0.2rem;

            >span {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: #121212;
                font-weight: 400;
                font-size: 0.32rem;
            }

            .copy_icon {
                width: 0.4rem;
                height: 0.4rem;
                margin-left: 0.1rem;
                overflow: hidden;
            }
        }
    }

    .circle_box {
        margin: 0.9rem auto 0.5rem auto;
        display: flex;
        align-items: center;
        justify-content: center;

        .circle {
            display: block;
        }

        .time_box {
            margin-left: 0.2rem;
            text-align: center;
            color: #666;
            font-size: 0.24rem;
            font-weight: 400;

            .time {
                color: #000;
                font-size: 0.32rem;
                font-weight: 600;
                margin-bottom: 0.2rem;
            }
        }
    }


    .tip {
        font-weight: 400;
        color: #191B1E;
        font-size: 0.24rem;
        line-height: 0.32rem;
        margin: 0 0 0.4rem 0;
        text-align: center;
    }

    .btns {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 1rem 0 0.4rem 0;

        .submit {
            width: 47%;
            height: 1.12rem;
        }
    }

}
</style>