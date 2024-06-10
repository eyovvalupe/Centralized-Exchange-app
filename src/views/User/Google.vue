<!-- 谷歌验证器 -->
<template>
    <div class="page page_google">
        <Top :title="''" />

        <div class="title">绑定谷歌验证器</div>
        <div class="subtitle">谷歌验证器密钥</div>
        <div class="qrcode">
            <img :src="gg.qrcode" alt="qrcode" v-if="gg.qrcode">
        </div>
        <div class="code_box">
            <div class="code">{{ gg.googlesecret }}</div>
            <div class="ripple_button btn" @click="copy" v-if="gg.googlesecret">复制</div>
        </div>

        <div class="subtitle">请输入上方密钥生成的验证码</div>
        <PasswordInput :focused="showKeyboard" @focus="focus" class="code_ipt" :class="{ 'error_ipt': errText }"
            :value="val" :length="6" :gutter="'0.16rem'" :mask="false" />
        <div class="error_text" v-if="errText">{{ errText }}</div>

        <Button :style="{ marginBottom: showKeyboard ? '5.5rem' : '1rem' }" :loading="loading" :disabled="disabled"
            round color="#014CFA" class="submit" type="primary" @click="goBind">绑定</Button>

        <NumberKeyboard @blur="blur" :show="showKeyboard" v-model="val" />
    </div>
</template>

<script setup>
import Top from '@/components/Top.vue';
import { PasswordInput, NumberKeyboard, Button, showToast, showLoadingToast, closeToast } from "vant"
import { ref, computed, watch } from "vue"
import { _google, _googleBind } from "@/api/api"
import QRCode from "qrcode"
import { _copyTxt } from "@/utils/index"
import router from '@/router';
import store from '@/store';

const loading = ref(false)
const disabled = computed(() => {
    return !(val.value && val.value.length == 6)
})
const showKeyboard = ref(false)
const val = ref('')
watch(val, v => {
    if (v && v.length == 6) {
        showKeyboard.value = false
    }
    if (!v || v.length == 0) {
        errText.value = ''
    }
})

// 获取谷歌状态
const gg = ref({})
const getGoogle = () => {
    showLoadingToast({
        duration: 0,
        loadingType: 'spinner',
    })
    _google().then(res => {
        console.error(res)
        if (res.code == 200) {
            gg.value = res.data
            QRCode.toDataURL(res.data.googlesecretqr)
                .then((url) => {
                    gg.value.qrcode = url
                })
        }
    }).finally(() => {
        closeToast()
    })
}
getGoogle()

// 绑定
const errText = ref('')
const goBind = () => {
    if (loading.value) return
    errText.value = ''
    loading.value = true
    _googleBind({
        googlesecret: gg.value.googlesecret,
        googlecode: val.value
    }).then(res => {
        if (res.code == 200) {
            store.dispatch('updateUserInfo')
            setTimeout(() => {
                showToast('绑定成功')
            }, 300)
            router.replace({
                name: 'googleCode'
            })
        }
    }).catch(err => {
        errText.value = err.message
    }).finally(() => {
        loading.value = false
    })
}

const focus = () => { // 聚焦
    showKeyboard.value = true
    setTimeout(() => {
        try {
            document.querySelector('.page').scrollTo({ top: 99999, behavior: 'smooth' });
        } catch {
            console.error('滚动失败')
        }
    }, 100)
}
const blur = () => { // 失去焦点
    showKeyboard.value = false
}
const copy = () => {
    _copyTxt(gg.value.googlesecret)
    showToast('复制成功')
}
</script>

<style lang="less" scoped>
.page_google {
    padding: 1.52rem 0.32rem 0.4rem 0.32rem;

    .title {
        color: #0D0D12;
        font-weight: 600;
        font-size: 0.56rem;
        line-height: 0.8rem;
        margin-bottom: 0.4rem;
    }

    .qrcode {
        width: 3.2rem;
        height: 3.2rem;
        margin: 0 auto 0.32rem auto;
    }

    .subtitle {
        font-weight: 400;
        font-size: 0.28rem;
        color: #666D80;
        line-height: 0.42rem;
        margin-bottom: 0.4rem;
    }

    .code_box {
        display: flex;
        align-items: center;
        margin-bottom: 2rem;

        .code {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #F8FAFB;
            border: 1px solid #D0D8E2;
            border-radius: 0.08rem;
            height: 0.76rem;
            color: #333333;
            font-size: 0.32rem;
        }

        .btn {
            margin-left: 0.22rem;
            border: 1px solid #0063F5;
            background-color: #ECF4FF;
            height: 0.76rem;
            border-radius: 0.08rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #0063F5;
            font-weight: 400;
            font-size: 0.28rem;
            padding: 0 0.52rem;
        }
    }

    .submit {
        width: 100%;
        height: 1.12rem;
        border-radius: 1.2rem;
        font-size: 0.28rem;
        margin-top: 1.2rem;
    }

    .code_ipt {
        padding: 0;
        margin: 0;

        :deep(.van-password-input__item) {
            border: 1px solid #ECEFF3;
            width: 1rem;
            height: 1rem;
            box-sizing: border-box;
            border-radius: 0.16rem;

            &:has(*) {
                border: 1px solid #014CFA;
            }
        }
    }

    .error_ipt {
        :deep(.van-password-input__item) {
            border: 1px solid #E8503A;

        }
    }

    .error_text {
        color: #E8503A;
        margin-top: 0.12rem;
        font-weight: 400;
        font-size: 0.28rem;
        line-height: 0.42rem;
    }
}
</style>