<!-- 输入安全密码 -->
<template>
    <Popup v-model:show="show" position="bottom" teleport="body" :safe-area-inset-bottom="true"
        :close-on-popstate="true" :close-on-click-overlay="false">
        <div class="safepassword_dialog" :class="{ 'typing_dialog': showKeyboard }">
            <div class="title">输入安全密码</div>
            <!-- <div class="subtitle">正在进行谷歌验证码</div> -->
            <PasswordInput :focused="showKeyboard" @focus="showKeyboard = true" class="code_ipt" :value="val"
                :length="6" :gutter="'0.16rem'" :mask="true" />
            <div class="btns">
                <Button @click="close" round color="#EFF6FF" class="btn" type="primary"><span
                        style="color: #014CFA;">取消</span></Button>
                <Button :loading="loading" :disabled="disabled" round color="#014CFA" class="btn" type="primary"
                    @click="submit">确定</Button>
            </div>
            <NumberKeyboard @blur="showKeyboard = false" :show="showKeyboard" v-model="val" />
        </div>
    </Popup>
</template>

<script setup>
import { Popup, PasswordInput, NumberKeyboard, Button } from "vant"
import { ref, computed, watch } from "vue"
const emits = defineEmits(['submit'])

const loading = ref(false)
const disabled = computed(() => {
    return !(val.value && val.value.length == 6)
})

const show = ref(false)
const showKeyboard = ref(true)
const val = ref('')
watch(val, v => {
    if (v && v.length == 6) {
        showKeyboard.value = false
    }
})

const close = () => {
    show.value = false
}
const open = () => {
    val.value = ''
    show.value = true
    showKeyboard.value = true
}
const submit = () => {
    if (disabled.value) return
    close()
    emits('submit', val.value)
}

defineExpose({
    open
})
</script>

<style lang="less" scoped>
.safepassword_dialog {
    background-color: #fff;
    padding: 0.64rem 0.32rem;

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
        font-size: 0.32rem;
        line-height: 0.44rem;
        color: #121826;
        margin-bottom: 0.4rem;
        text-align: center;
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

}

.typing_dialog {
    padding: 0.64rem 0.32rem 5.64rem 0.32rem;
}
</style>