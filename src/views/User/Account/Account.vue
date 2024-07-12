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

        <div class="list">
            <div class="subtitle" v-if="bankList.length">银行卡</div>
            <div class="item" v-for="(item, i) in bankList" :key="i">
                <div class="title" style="font-size: 0.32rem;">{{ item.bankName }}</div>
                <div class="address">{{ item.bankCardNumber }}</div>
            </div>
            <div class="subtitle" v-if="cryptoList.length">加密货币</div>
            <div class="item" :class="['item_' + item.symbol]" v-for="(item, i) in cryptoList" :key="i">
                <div class="title">
                    <div class="item_icon">
                        <img :src="`/static/img/crypto/${item.symbol}_fff.png`" alt="img">
                    </div>
                    <span>{{ item.symbol }}-{{ item.network }}</span>
                </div>
                <div class="address">{{ item.address }}</div>
            </div>
        </div>

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

store.dispatch('updateAccountList')

const userInfo = computed(() => store.state.userInfo || {})
const accountList = computed(() => store.state.accountList || []) // 收款方式列表
const bankList = computed(() => accountList.value.filter(item => item.channel == 'bank')) // 银行卡
const cryptoList = computed(() => accountList.value.filter(item => item.channel == 'crypto')) // 加密货币


const showBottom = ref(false)

// 添加
const goAdd = () => {
    if (!userInfo.value.googlebind || userInfo.value.kyc != 2) { // 跳转认证
        return router.push({
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

    .list {
        .subtitle {
            margin-bottom: 0.08rem;
            font-size: 0.28rem;
            line-height: 0.44rem;
            color: #111111;
        }

        .item {
            margin-bottom: 0.28rem;
            height: 2.4rem;
            border-radius: 0.2rem;
            background: linear-gradient(90deg, #3e50d8 0%, #325EED 100%);
            color: #fff;
            display: flex;
            flex-direction: column;
            overflow: hidden;

            .title {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                padding: 0.2rem 0 0 0.32rem;
                flex: 1;
                font-size: 0.36rem;

                .item_icon {
                    width: 0.8rem;
                    height: 0.8rem;
                    margin-right: 0.2rem;
                }
            }

            .address {
                height: 0.8rem;
                background-color: rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                padding-left: 0.32rem;
            }
        }

        .item_ETH {
            background: linear-gradient(90deg, #5174EC 0%, #819DFF 100%);
        }

        .item_BTC {
            background: linear-gradient(90deg, #FEA735 0.28%, #FE7235 100%);
        }

        .item_USDT {
            background: linear-gradient(90deg, #397D54 0%, #73C088 100%);
        }
    }

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