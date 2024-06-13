<!-- 收款账户 -->
<template>
    <div class="page page_account">
        <Top :title="'收款账户'">
            <template #right>
                <div class="add_box" @click="goAdd">
                    <div class="add_icon">
                        <img src="/static/img/user/add_icon.png" alt="＋">
                    </div>
                    <span>添加</span>
                </div>
            </template>
        </Top>

        <Popup round v-model:show="showBottom" position="bottom" teleport="body">
            <div class="page_account_bottoms">
                <div @click="jump('bank')" class="ripple_button bottom" style="border-bottom:1px solid #F5F5F5">银行卡
                </div>
                <div @click="jump('crypto')" class="ripple_button bottom">加密货币</div>


                <Icon @click="showBottom = false" class="close" name="cross" />
            </div>
        </Popup>
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import store from "@/store"
import { computed, ref } from "vue"
import router from "@/router";
import { Popup, Icon } from 'vant';

const userInfo = computed(() => store.state.userInfo || {})
const showBottom = ref(false)

// 添加
const goAdd = () => {
    if (!userInfo.value.googlebind || userInfo.value.kyc != 2) { // 跳转认证
        router.push({
            name: 'check'
        })
    }
    // 跳转添加
    showBottom.value = true
}

// 跳转
const jump = name => {
    showBottom.value = false
    router.push({
        name
    })
}
</script>

<style lang="less" scoped>
.page_account {
    padding: 1.12rem 0.32rem 1.4rem 0.32rem;

    .add_box {
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 400;
        font-size: 0.28rem;
        color: #000000;

        .add_icon {
            width: 0.52rem;
            height: 0.52rem;
            margin-right: 0.08rem;
        }
    }


}
</style>

<style lang="less">
.page_account_bottoms {
    position: relative;
    padding: 1.12rem 0;

    .close {
        position: absolute;
        font-size: 0.4rem;
        top: 0.3rem;
        right: 0.4rem;
        color: #161616;
    }

    .bottom {
        color: #111111;
        font-size: 0.28rem;
        height: 1.12rem;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }
}
</style>