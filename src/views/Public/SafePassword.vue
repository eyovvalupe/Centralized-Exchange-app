<!-- 设置安全密码 -->
<template>
    <div class="page page-safepass">
        <Top :title="''" />

        <div class="title">{{ title }}</div>

        <transition :name="aniName">
            <!-- 设置密码 -->
            <template v-if="step == 1">
                <div class="form">
                    <PasswordInput :focused="showKeyboard" @focus="focus" class="code_ipt" :value="safeword" :length="6"
                        :gutter="'0.16rem'" />
                    <div v-if="errorText" class="error_text">{{ errorText }}</div>
                    <Button :style="{ marginBottom: showKeyboard ? '5.5rem' : '1rem' }" round color="#014CFA"
                        class="btn" type="primary" :disabled="(!safeword || safeword.length != 6)"
                        @click="next">继续</Button>
                    <NumberKeyboard @blur="showKeyboard = false" :show="showKeyboard" v-model="safeword" />
                </div>
            </template>
            <!-- 确认密码 -->
            <template v-else>
                <div class="form">
                    <PasswordInput :focused="showKeyboard" @focus="focus" class="code_ipt" :value="safeword2"
                        :length="6" :gutter="'0.16rem'" />
                    <Button :loading="loading" :style="{ marginBottom: showKeyboard ? '5.5rem' : '1rem' }" round
                        color="#014CFA" class="btn" type="primary" :disabled="(!safeword2 || safeword2.length != 6)"
                        @click="submit">创建账户</Button>
                    <NumberKeyboard @blur="showKeyboard = false" :show="showKeyboard" v-model="safeword2" />
                </div>
            </template>
        </transition>

        <!-- 验证码 -->
        <VerifCode @submit="submitCode" to="body" ref="verifCodeRef" />
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { computed, ref, watch } from "vue";
import { PasswordInput, NumberKeyboard, Button, showToast } from "vant"
import { _sessionToken, _register } from "@/api/api"
import router from "@/router"
import VerifCode from "@/components/VerifCode.vue"
import store from "@/store"

// 获取注册参数
let form = {}
try {
    form = JSON.parse(sessionStorage.getItem('registerForm'))
} catch {
}
if (!form.username) {
    router.replace({
        name: 'register'
    })
}

const verifCodeRef = ref()
const verifcode = ref('')
const title = computed(() => {
    return step.value == 1 ? '设置您的交易密码' : '确认您的交易密码'
})
const step = ref(1) // 1-设置交易密码 2-确认交易密码
const aniName = ref('slide-right')

const showKeyboard = ref(false)
const safeword = ref('') // 安全密码
watch(safeword, v => {
    if (v && v.length == 6) {
        showKeyboard.value = false
    }
})
const safeword2 = ref('') // 确认安全密码
watch(safeword2, v => {
    if (v && v.length == 6) {
        showKeyboard.value = false
    }
})


const next = () => {
    aniName.value = 'slide-right'
    step.value = 2
}
const errorText = ref('')
const loading = ref(false)
const submit = async () => {
    if (safeword.value != safeword2.value) {
        safeword.value = ''
        safeword2.value = ''
        aniName.value = 'slide-left'
        step.value = 1
        errorText.value = '两次密码不一致, 请再次设置'
        return
    }
    if (!sessionToken.value) {
        const rs = await getSessionToken()
        if (!rs) return showToast('网络异常，请重试')
    }
    if (loading.value) return
    loading.value = true
    _register({
        ...form,
        token: sessionToken.value,
        safeword: safeword.value,
        verifcode: verifcode.value
    }).then(res => {
        if (res.code == 200) {
            store.dispatch('reset')
            setTimeout(() => {
                store.commit('setToken', res.data.auth)
                store.commit('setUserInfo', res.data)
            }, 100)
            setTimeout(() => {
                store.dispatch('updateUserInfo')
                router.replace({
                    name: 'registerSuccess'
                })
            }, 300)
        }
    }).catch(err => {
        if (err.code == '1001') { // 弹出验证码
            if (verifcode.value) { // 如果输入了验证码，旧提示验证码错误
                showToast(err.message)
            }
            setTimeout(() => {
                verifCodeRef.value.open()
            }, 1000)
        } else {
            showToast(err.message || "网络异常")
        }
    }).finally(() => {
        setTimeout(() => {
            verifcode.value = ''
            getSessionToken()
            loading.value = false
        }, 1000)
    })
}

// 通过验证码提交
const submitCode = code => {
    verifcode.value = code
    submit()
}

const sessionToken = ref('')
const getSessionToken = () => {
    loading.value = true
    return new Promise(resolve => {
        _sessionToken().then(res => {
            if (res?.code == 200) {
                sessionToken.value = res.data
                resolve(true)
            } else {
                resolve(false)
            }
        }).catch(() => {
            resolve(false)
        }).finally(() => {
            loading.value = false
        })
    })
}
getSessionToken()

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

</script>

<style lang="less" scoped>
.page-safepass {
    padding: 1.4rem 0.32rem 0 0.32rem;

    .title {
        font-weight: 600;
        font-size: 0.56rem;
        line-height: 0.8rem;
        color: #0D0D12;
    }

    .form {
        margin-top: 3rem;

        .error_text {
            font-size: 0.28rem;
            color: #FF5757;
            margin-top: 0.2rem;
        }

        .btn {
            margin-top: 1.6rem;
            width: 100%;
            height: 1.12rem;
        }
    }

    .code_ipt {
        padding: 0;
        margin: 0;

        :deep(.van-password-input__item) {
            border: 1px solid rgba(11, 10, 17, 0.3);
            width: 1rem;
            height: 1rem;
            box-sizing: border-box;
            border-radius: 0.16rem;

            &:has(*) {
                border: 1px solid #014CFA;
            }
        }
    }
}
</style>