<!-- 充值 -->
<template>
    <div class="page page_amount">

    <transition :name="transition">
        <div v-if="!showVerification">
            <Top :title="'充值'">
                <template #right>
                    <div class="top-record" @click="goRecord">
                        <img src="/static/img/user/record.png" alt="img">
                    </div>
                </template>
            </Top>


            <div class="amount-coin">
                <div>USDT</div>
                <div>BTC</div>
                <div>ETH</div>
            </div>

            <div class="amount-line">
                <!-- <div class="amount-line-text">充值链路：</div> -->
                <div class="amount-line-box">
                    <div>
                        ERC-20
                    </div>
                    <div>
                        TRC-20
                    </div>
                </div>
            </div>

            <div class="amount-money" v-if="amountVal == ''">
                <PasswordInput
                :value="value"
                />
            </div>

            <div class="amount-money" v-else>
                {{ amountVal }}
            </div>

            <div class="amount-commission">
                =<span>0.00045</span><span>btc</span>
            </div>

            <div class="amount-send">
                <span>发送金额</span>
                <div class="amount-right" @click="goVerification">
                    <img src="/static/img/user/right.png" alt="→">
                </div>
            </div>


            <div>
                <NumberKeyboard
                    :show="show"
                    @blur="show = true"
                    @input="onInput"
                    @delete="onDelete"
                    v-model="amountVal"
                />
            </div>
            
        </div>

        <Verification v-else @backFunc="backFunc"/>

    </transition>
        

       
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import router from "@/router"
import { ref, computed, watch } from "vue"
import store from "@/store";
import { Popup, Button, Tabs, Tab, NumberKeyboard, PasswordInput, showToast } from "vant"
import { useRoute } from "vue-router"
import Verification from './Verification.vue'

const route = useRoute()

const show = ref(true);
const showVerification = ref(false)
const amountVal = ref('')
const onInput = (value) => {

}
const onDelete = () => {

};

const transition = ref('slide-right');

watch([showVerification], ([newActive]) => {
  if (newActive) {
    transition.value = 'slide-right';
  } else {
    transition.value = 'slide-left';
  }
});


const goRecord = () => {
    router.push({
        name: 'topUpRecord'
    })
}

const goVerification = ()=>{
    if (amountVal.value == '') {
        showToast('请输入金额')
        return
    }
    store.commit('setRechargeAmount',amountVal.value)
    showVerification.value = true
}

const backFunc = ()=>{
    showVerification.value = false
}

</script>

<style lang="less" scoped>
.page_amount {
    padding-top: 1.4rem;
    height: 100%;
    position: relative;

    .top-record {
        width: 0.4rem;
        height: 0.4rem;
    }
    .amount-coin {
        display: flex;
        margin-bottom: 0.4rem;
        padding: 0 0.32rem;
        div {
            width: 1.6rem;
            line-height: 0.6rem;
            height: 0.6rem;
            text-align: center;
            background: #979797;
            color: white;
            border-radius: 0.12rem;
            font-weight: 600;
            margin-right: 0.2rem;
        }
    }
    .amount-line {
        padding: 0 0.32rem;
        .amount-line-text {
            font-size: 0.32rem;
            font-style: normal;
            margin-bottom: 0.2rem;
        }
        .amount-line-box {
            display: flex;
            justify-content: center;
            div {
                width: 1.8rem;
                line-height: 0.8rem;
                height: 0.8rem;
                text-align: center;
                background: #dfe0fb;
                color: #8e90f3;
                border-radius: 0.12rem;
                font-weight: 600;
                margin-right: 0.2rem;
            }
        }
    }
    .amount-money {
        text-align: center;
        margin-top: 1rem;
        font-size: 1rem;
        font-weight: 800;
    }
    .amount-commission {
        text-align: center;
        margin-top: 0.6rem;
        font-size: 0.32rem;
    }
    .amount-send {
        width: 100%;
        height: 1.2rem;
        background: #d8d8d8;
        position: relative;
        padding-right: 0.32rem;
        text-align: center;
        position: absolute;
        bottom: 244px;
        left: 0;
        span{
            line-height: 1.2rem;
            color: white;
            font-size: 0.4rem;
        }
        .amount-right {
            display: inline-block;
            width: 0.4rem;
            height: 0.4rem;
            // background-color: white;
            border-radius: 50%;
            position: absolute;
            right: 0.32rem;
            top: 0.38rem;
            line-height: 0.4rem;
            color: #d8d8d8;
        }
    }

    @media (min-width: 751px) {
        .van-number-keyboard {
            max-width: 375px;
            position: fixed !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
        }
        .amount-send {
            position: absolute;
            bottom: 244px;
            left: 0;
        }
    }

}
</style>