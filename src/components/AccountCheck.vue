<!-- 认证状态检测 -->
<template>
    <Popup :before-close="boforeClose" teleport="body" v-model:show="showBottom" position="bottom"
        style="background-color: rgba(0,0,0,0)">
        <div class="account_check_popup">
            <div class="close_icon" @click="close">
                <img src="/static/img/common/close.png" alt="img">
            </div>

            <div class="ac_body">
                <div class="ac_title">请完成以下验证，继续下一步</div>
                <div class="ac_item" :class="{ 'ac_item_active': userInfo.googlebind }" @click="jump('google')">
                    <div class="ac_icon">
                        <img src="/static/img/account/gg_icon.png" alt="img">
                    </div>
                    <div class="content">{{ userInfo.googlebind ? '谷歌验证器已绑定' : '谷歌验证器未绑定' }}</div>
                    <div class="ac_status_icon">
                        <img v-if="!userInfo.googlebind" src="/static/img/account/warning_icon.png" alt="img">
                        <img v-if="userInfo.googlebind" src="/static/img/account/success_icon.png" alt="img">
                    </div>
                </div>
                <div class="ac_item" :class="{ 'ac_item_active': userInfo.kyc == 2 }" @click="jump('kyc')">
                    <div class="ac_icon">
                        <img src="/static/img/account/iden_icon.png" alt="img">
                    </div>
                    <div class="content">{{ userInfo.kyc == 2 ? '实名认证已通过' : '实名认证未通过' }}</div>
                    <div class="ac_status_icon">
                        <img v-if="userInfo.kyc != 2" src="/static/img/account/warning_icon.png" alt="img">
                        <img v-if="userInfo.kyc == 2" src="/static/img/account/success_icon.png" alt="img">
                    </div>
                </div>
            </div>
        </div>
    </Popup>
</template>

<script setup>
import { Popup } from 'vant';
import { ref, computed } from "vue"
import store from '@/store';
import router from '@/router';

const userInfo = computed(() => store.state.userInfo || {})

const showBottom = ref(false)
const open = () => {
    showBottom.value = true
}
const close = () => {
    showBottom.value = false
}

const check = () => {
    const val = userInfo.value.googlebind && userInfo.value.kyc == 2
    if (!val) {
        open()
    }
    return val
}
const jump = name => {
    close()
    router.push({
        name
    })
}

defineExpose({
    open,
    close,
    check,
})
</script>

<style lang="less">
.account_check_popup {
    background-color: #fff;
    border-top-left-radius: 0.24rem;
    border-top-right-radius: 0.24rem;
    overflow: hidden;
    padding: 0.64rem 0.32rem;
    position: relative;

    .close_icon {
        position: absolute;
        top: 0.32rem;
        right: 0.32rem;
        width: 0.32rem;
        height: 0.32rem;
    }

    .ac_body {
        .ac_title {
            font-size: 0.28rem;
            color: #000000;
            line-height: 0.64rem;
            margin-bottom: 0.32rem;
        }

        .ac_item {
            height: 1.44rem;
            border: 1px solid #1A59F6;
            border-radius: 0.08rem;
            margin-bottom: 0.4rem;
            padding: 0 0.7rem 0 0.32rem;
            display: flex;
            align-items: center;

            .ac_icon {
                width: 0.96rem;
                height: 0.96rem;
                border-radius: 0.16rem;
                background-color: #D9E4FF;
                margin-right: 0.6rem;
                padding: 0.16rem;
            }

            .content {
                flex: 1;
                font-size: 0.28rem;
                color: #343434;
            }

            .ac_status_icon {
                width: 0.32rem;
                height: 0.32rem;
                margin-left: 0.4rem;
            }
        }

        .ac_item_active {
            background-color: #1A59F6;

            .ac_icon {
                background-color: #fff;
            }

            .content {
                color: #fff;
            }
        }
    }
}
</style>