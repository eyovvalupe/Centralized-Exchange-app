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
        margin-bottom: 20px;
        padding: 0 0.32rem;
        div {
            width: 80px;
            line-height: 30px;
            height: 30px;
            text-align: center;
            background: #979797;
            color: white;
            border-radius: 6px;
            font-weight: 600;
            margin-right: 10px;
        }
    }
    .amount-line {
        padding: 0 0.32rem;
        .amount-line-text {
            font-size: 16px;
            font-style: normal;
            margin-bottom: 10px;
        }
        .amount-line-box {
            display: flex;
            justify-content: center;
            div {
                width: 90px;
                line-height: 40px;
                height: 40px;
                text-align: center;
                background: #dfe0fb;
                color: #8e90f3;
                border-radius: 6px;
                font-weight: 600;
                margin-right: 10px;
            }
        }
    }
    .amount-money {
        text-align: center;
        margin-top: 50px;
        font-size: 50px;
        font-weight: 800;
    }
    .amount-commission {
        text-align: center;
        margin-top: 30px;
        font-size: 16px;
    }
    .amount-send {
        width: 100%;
        height: 60px;
        background: #d8d8d8;
        position: relative;
        padding-right: 0.32rem;
        margin-top: 57px;
        text-align: center;
        span{
            line-height: 60px;
            color: white;
            font-size: 20px;
        }
        .amount-right {
            display: inline-block;
            width: 20px;
            height: 20px;
            // background-color: white;
            border-radius: 50%;
            position: absolute;
            right: 0.32rem;
            top: 19px;
            line-height: 20px;
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