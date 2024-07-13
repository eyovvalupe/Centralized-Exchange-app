<!-- 收款账户 -->
<template>
    <div class="page page_account">
        <Top :title="'收款账户'"></Top>

        <div class="list">
            <div class="subtitle">
                <span>银行卡</span>
                <div class="add_box" @click="goAdd('bank')">
                    <div class="add_icon">
                        <img src="/static/img/user/add_icon.png" alt="＋">
                    </div>
                    <span>添加</span>
                </div>
            </div>
            <div class="item" v-for="(item, i) in bankList" :key="i">
                <div class="address">{{ _hiddenAccount(item.bankCardNumber) }}</div>
                <div class="title">{{ item.bankName }}</div>

                <div class="icon_box">
                    <img src="/static/img/user/card_type_b.png" alt="img">
                </div>
            </div>
            <NoData v-if="!bankList.length" :tip="''" />
            <div class="subtitle">
                <span>加密货币</span>
                <div class="add_box" @click="goAdd('crypto')">
                    <div class="add_icon">
                        <img src="/static/img/user/add_icon.png" alt="＋">
                    </div>
                    <span>添加</span>
                </div>
            </div>
            <div class="item" v-for="(item, i) in cryptoList" :key="i">
                <div class="address">{{ _hiddenAccount(item.address) }}</div>
                <span class="title">{{ item.symbol }}-{{ item.network }}</span>

                <div class="icon_box">
                    <img src="/static/img/user/card_type_c.png" alt="img">
                </div>
            </div>
            <NoData v-if="!cryptoList.length" :tip="''" />
        </div>

        <!-- 权限验证 -->
        <AccountCheck ref="AccountCheckRef" />
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import store from "@/store"
import { computed, ref } from "vue"
import router from "@/router";
import NoData from "@/components/NoData.vue"
import AccountCheck from "@/components/AccountCheck.vue"
import { _hiddenAccount } from "@/utils/index"

store.dispatch('updateAccountList')
const AccountCheckRef = ref()

const userInfo = computed(() => store.state.userInfo || {})
const accountList = computed(() => store.state.accountList || []) // 收款方式列表
const bankList = computed(() => accountList.value.filter(item => item.channel == 'bank')) // 银行卡
const cryptoList = computed(() => accountList.value.filter(item => item.channel == 'crypto')) // 加密货币




// 添加
const goAdd = (name) => {
    if (AccountCheckRef.value.check()) {
        router.push({
            name
        })
    }
}
</script>

<style lang="less" scoped>
.page_account {
    padding: 1.12rem 0.32rem 1.4rem 0.32rem;
    overflow-y: auto;
    height: 100%;

    .list {
        .subtitle {
            margin-bottom: 0.2rem;
            margin-top: 0.4rem;
            font-size: 0.28rem;
            line-height: 0.44rem;
            color: #111111;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .add_box {
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 400;
                font-size: 0.28rem;
                color: #000000;

                .add_icon {
                    width: 0.44rem;
                    height: 0.44rem;
                    margin-right: 0.08rem;
                }
            }
        }

        .item {
            background-color: #F6F7FA;
            padding: 0.24rem 0.24rem 0.24rem 1.44rem;
            border-radius: 0.24rem;
            margin-bottom: 0.2rem;
            height: 1.44rem;
            color: #061023;
            font-size: 0.28rem;
            line-height: 0.48rem;
            position: relative;

            .icon_box {
                width: 0.96rem;
                height: 0.96rem;
                background-color: #D9E4FF;
                border-radius: 0.24rem;
                padding: 0.16rem;
                position: absolute;
                left: 0.24rem;
                top: 0.24rem;
            }
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