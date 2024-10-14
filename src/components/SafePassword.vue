<!-- 输入安全密码 -->
<template>
    <Popup :safe-area-inset-top="true" close-on-click-overlay :safe-area-inset-bottom="true" class="self_van_popup"
        v-model:show="show" position="bottom" teleport="body" :close-on-popstate="true" :closeable="props.closeable">
        <!--  :class="{ 'typing_dialog': showKeyboard }" -->
        <div class="safepassword_dialog" :class="{ 'safepassword_dialog_uncloseabled': !props.closeable }">
            <slot name="top">
            </slot>
            <div class="main_title">交易密码</div>
            <div class="title">交易密码</div>
            <!-- <div class="subtitle">正在进行谷歌验证码</div> -->
            <!-- <PasswordInput :focused="showKeyboard" @focus="focus" class="code_ipt" :value="val" :length="6"
                :gutter="'0.16rem'" :mask="true" /> -->
                <div class="show_pass">
                    <input :type="passwordInputType" @blur="errStatus = false" :class="{ 'err_ipt': errStatus }" v-model="val"
                    ref="iptDom" placeholder="请输入交易密码" class="pass_ipt" enterkeyhint="done" @keydown.enter="submit">
                    <i @click="passwordVisibility"></i>
                </div>
            
            <div class="btns">
                <Button @click="close" round color="white" class="btn" type="primary"><span
                        style="color: #666D80;">取消</span></Button>
                <Button :loading="loading" round color="#014CFA" class="btn" type="primary" @click="submit">确定</Button>
            </div>

        </div>
    </Popup>
</template>

<script setup>
import { Popup, Button, showToast } from "vant"
import { ref, computed } from "vue"
const emits = defineEmits(['submit'])
const iptDom = ref()
const props = defineProps({
    closeable: {
        type: Boolean,
        default: true,
    }
})

const errStatus = ref(false)
const loading = ref(false)
// const disabled = computed(() => {
//     return !(val.value)
// })

const show = ref(false)
const showKeyboard = ref(true)
const val = ref('')
const showPassword = ref(false)
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

const passwordVisibility = () => {
    showPassword.value =  !showPassword.value
}

const passwordInputType = computed(() => (showPassword.value ? 'text' : 'password'));  
    // const icon = computed(() => (isPasswordVisible.value ? '🙈' : '👁️')); 
    
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
    padding: 0.96rem 0.32rem;
    border-top-left-radius: 0.4rem;
    border-top-right-radius: 0.4rem;
    position: relative;

    .main_title {
        font-size: 0.32rem;
        color: #121826;
        position: absolute;
        font-weight: 400;
        top: 0.5rem;
        left: 50%;
        transform: translateX(-50%);
    }

    .btns {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 0.5rem;

        .btn {
            border: 1px solid #D0D8E2 !important;
            height: 0.96rem;
            border-radius: 0.96rem;
            width: 48%;
        }
    }

    .title {
        font-size: 0.28rem;
        line-height: 0.44rem;
        color: #000;
        margin-bottom: 0.2rem;
        margin-top: 0.4rem;
        text-align: left;
    }

    .pass_ipt {
        height: 0.88rem;
        border: 1px solid #D0D8E2;
        width: 100%;
        display: block;
        box-sizing: border-box;
        border-radius: 16px;
        padding: 0 0.4rem;

        &:focus {
            border: 1px solid #014CFA;
        }
    }

    .show_pass {
        position: relative;
        i {
            content: '';
            display: block;
            background-image: url('../assets/password_hide.png');
            background-size: 100%;
            width: 20px;
            height: 20px;
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 9999;
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

.safepassword_dialog_uncloseabled {
    padding: 0.56rem 0.32rem;
}

.typing_dialog {
    padding: 0.32rem 0.32rem 5.64rem 0.32rem;
}
</style>