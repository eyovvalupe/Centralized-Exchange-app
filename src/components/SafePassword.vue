<!-- 输入安全密码 -->
<template>
    <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" class="self_van_popup" v-model:show="show"
        position="bottom" teleport="body" :close-on-popstate="true" :close-on-click-overlay="false">
        <!--  :class="{ 'typing_dialog': showKeyboard }" -->
        <div class="safepassword_dialog">
            <slot name="top"></slot>
            <div class="title">输入交易密码</div>
            <!-- <div class="subtitle">正在进行谷歌验证码</div> -->
            <!-- <PasswordInput :focused="showKeyboard" @focus="focus" class="code_ipt" :value="val" :length="6"
                :gutter="'0.16rem'" :mask="true" /> -->
            <input type="password" @blur="errStatus = false" :class="{ 'err_ipt': errStatus }" v-model="val"
                ref="iptDom" class="pass_ipt" enterkeyhint="done" @keydown.enter="submit">
            <div class="btns">
                <Button @click="close" round color="#EFF6FF" class="btn" type="primary"><span
                        style="color: #014CFA;">取消</span></Button>
                <Button :loading="loading" round color="#014CFA" class="btn" type="primary" @click="submit">确定</Button>
            </div>

            <!-- <NumberKeyboard @blur="showKeyboard = false" :show="showKeyboard" v-model="val" /> -->
        </div>
    </Popup>
</template>

<script setup>
import { Popup, PasswordInput, NumberKeyboard, Button, showToast } from "vant"
import { ref, computed, watch } from "vue"
const emits = defineEmits(['submit'])
const iptDom = ref()

const errStatus = ref(false)
const loading = ref(false)
// const disabled = computed(() => {
//     return !(val.value)
// })

const show = ref(false)
const showKeyboard = ref(true)
const val = ref('')
// watch(val, v => {
//     if (v && v.length == 6) {
//         showKeyboard.value = false
//     }
// })

const close = () => {
    show.value = false
}
const open = () => {
    val.value = ''
    show.value = true
    showKeyboard.value = true
    focus()

}
const submit = () => {
    if (!val.value) {
        errStatus.value = true
        showToast('请输入密码')
        return
    }
    close()
    emits('submit', val.value)
}

const focus = () => {
    showKeyboard.value = true
    setTimeout(() => {
        iptDom.value && iptDom.value.focus()
    }, 300)
}

defineExpose({
    open,
    close
})
</script>

<style lang="less" scoped>
.safepassword_dialog {
    background-color: #FEFEFE;
    padding: 0.64rem 0.32rem;
    border-top-left-radius: 0.4rem;
    border-top-right-radius: 0.4rem;

    .btns {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 0.6rem;

        .btn {
            height: 0.96rem;
            border-radius: 0.96rem;
            width: 45%;
        }
    }

    .title {
        font-size: 0.28rem;
        line-height: 0.44rem;
        color: #121826;
        margin-bottom: 0.4rem;
        text-align: center;
    }

    .pass_ipt {
        height: 0.88rem;
        border: 1px solid #D0D8E2;
        width: 100%;
        display: block;
        box-sizing: border-box;
        border-radius: 0.12rem;
        padding: 0 0.4rem;

        &:focus {
            border: 1px solid #014CFA;
        }
    }

    .err_ipt {
        border: 1px solid #E8503A;
    }

    .code_ipt {
        padding: 0;
        margin: 0;

        :deep(.van-password-input__item) {
            border: 1px solid #ECEFF3;
            background-color: #fff;
            width: 1rem;
            height: 1rem;
            box-sizing: border-box;
            border-radius: 0.16rem;

            &:has(.van-password-input__cursor) {
                border: 1px solid #014CFA;
            }
        }
    }

}

.typing_dialog {
    padding: 0.32rem 0.32rem 5.64rem 0.32rem;
}
</style>