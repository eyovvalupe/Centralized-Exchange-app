<!-- 忘记密码 -->
<template>
    <div class="page page-fogot">

        <!-- 返回和语言 -->
        <div class="max-width top">
            <div class=" top_back" @click="router.back()">
                <Icon name="cross" />
            </div>

            <div class=" top_lang" @click="router.push({ name: 'language' })">
                <img src="/static/img/common/language.png" alt="language">
            </div>
        </div>

        <!-- 标题 -->
        <div class="title_box">
            <div class="title">忘记密码？</div>
        </div>

        <!-- 表单 -->
        <div class="form">
            <div class="form_title">用户名</div>
            <div class="form_item margin_item">
                <div class="form_item_user" v-show="form.username">
                    <img src="/static/img/user/user.png" alt="user">
                </div>
                <input maxlength="20" v-model.trim="form.username" placeholder="您的用户名" type="text" class="item_input">
            </div>
            <div class="form_title">新密码</div>
            <div class="form_item">
                <input maxlength="20" v-show="!showPass" v-model.trim="form.password" placeholder="请输入您的新密码"
                    type="password" class="item_input">
                <input maxlength="20" v-show="showPass" v-model.trim="form.password" placeholder="请输入您的新密码" type="text"
                    class="item_input">
                <div class=" form_item_icon" @click="showPass = !showPass">
                    <img v-show="!showPass" src="/static/img/user/eye-off.png" alt="off">
                    <img v-show="showPass" src="/static/img/user/eye-open.png" alt="open">
                </div>
            </div>
        </div>

        <!-- 按钮 -->
        <div class="submit_box" @click="submit">
            <Button :loading="loading" :disabled="disabled" round color="#014CFA" class="submit"
                type="primary">找回</Button>
        </div>


        <!-- 谷歌 -->
        <GoogleVerfCode @submit="submitForm" ref="ggRef" />
    </div>

</template>

<script setup>
import { Icon, Button, showToast } from "vant"
import { ref, computed } from "vue"
import router from "@/router"
import { _forgetpw } from "@/api/api"
import GoogleVerfCode from "@/components/GoogleVerfCode.vue"
import store from "@/store"

const ggRef = ref()

const showPass = ref(false) // 密码显示
const form = ref({ // 表单
    username: '',
    password: '',
})

const loading = ref(false) // 加载
const disabled = computed(() => { // 提交按钮禁用
    return !(form.value.username && form.value.password)
})

const submit = () => {
    ggRef.value.open()
}
// 提交
const submitForm = (code) => {
    if (loading.value) return
    loading.value = true
    _forgetpw({
        ...form.value,
        googlecode: code,
    }).then(res => {
        showToast('密码找回成功')
        setTimeout(() => {
            router.replace({
                name: 'user'
            })
            setTimeout(() => {
                store.commit('setIsLoginOpen', true)
            }, 300)
        }, 300)
    }).finally(() => {
        setTimeout(() => {
            loading.value = false
        }, 1000)
    })
}


</script>

<style lang="less" scoped>
.page-fogot {
    padding-top: 1.12rem;

    .top {
        position: fixed;
        width: 100%;
        height: 1.12rem;
        display: flex;
        padding: 0 0.4rem 0 0.12rem;
        align-items: center;
        justify-content: space-between;
        left: 50%;
        transform: translateX(-50%);
        top: 0;
        background-color: #fff;

        .top_back {
            color: #161616;
            font-size: 0.40rem;
            width: 0.8rem;
            height: 0.8rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .top_lang {
            width: 0.8rem;
            height: 0.8rem;
        }
    }

    .title_box {
        padding: 0.3rem 0.32rem 1.4rem 0.32rem;

        .title {
            height: 0.78rem;
            display: flex;
            align-items: center;
            font-weight: 600;
            font-size: 0.56rem;
            color: #0D0D12;
        }
    }

    .form {
        padding: 0 0.32rem;

        .form_title {
            color: #000;
            line-height: 0.42rem;
            font-weight: 400;
            margin-bottom: 0.12rem;
        }

        .form_item {
            display: flex;
            align-items: center;
            border: 1px solid #D0D8E2;
            height: 1.12rem;
            border-radius: 0.32rem;
            padding: 0 0.32rem;

            .item_input {
                flex: 1;
                color: #333333;
                font-weight: 400;
                font-size: 0.28rem;
            }

            &:has(.item_input:focus) {
                border: 1px solid #014CFA;
            }

            .form_item_user {
                width: 0.64rem;
                height: 0.64rem;
                margin-right: 0.32rem;
            }

            .form_item_icon {
                width: 0.4rem;
                height: 0.4rem;
                margin-left: 0.2rem;
            }
        }

        .margin_item {
            margin-bottom: 0.4rem;
        }
    }

    .submit_box {
        padding: 0 0.32rem;
        margin-top: 0.86rem;

        .submit {
            width: 100%;
            height: 1.12rem;
        }
    }

    .go_register {
        margin: 2.8rem 0 1.4rem 0;
        text-align: center;
        font-weight: 400;

        >span {
            color: #1A59F6;
            font-weight: 600;
        }
    }
}
</style>