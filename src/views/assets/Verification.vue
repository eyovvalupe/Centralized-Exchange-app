<!-- 充值 -->
<template>
    <div class="page page_amount-verification">
        <Top :title="'充值确认'" :backFunc="backFunc">
        </Top>

        <div class="send-money">
            <span>充值金额</span>
            <div></div>
        </div>
        <div class="amount-money">
            {{ rechargeAmount }}
        </div>
        <div class="code-img-box">
            <img src="/static/img/assets/code.png" alt="→" class="code-img">
        </div>
        <div class="code-text">
            gutytytyrtrrtdtd
        </div>


        <div class="circle-box">
            <Circle
                v-model:current-rate="currentRate"
                :rate="46"
                :speed="100"
                layer-color="#ebedf0"
                color="#5939f5"
                :stroke-width="60"
                size="50px"
                :clockwise="false"
            />
            <div class="circle-box-text">
                <div class="circle-box-text-p">
                    {{ text }}
                </div>
                <div style="color: #8d8d8d;">进度</div>
            </div>
        </div>

        <div class="verification-weight-text">
            Touch ID sensor to verify transaction
        </div>
        <div class="verification-text">
            Please verify your identity
        </div>
       
        <div class="amount-line">
            <div class="amount-line-box">
                <div>
                    确定
                </div>
                <div>
                    继续
                </div>
            </div>
        </div>
        

       
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import router from "@/router"
import { ref, computed } from "vue"
import store from "@/store";
import { Popup, Button, Tabs, Tab, Circle, PasswordInput } from "vant"
import { useRoute } from "vue-router"

const route = useRoute()

const currentRate = ref(0);
const text = computed(() => currentRate.value.toFixed(0) + '%');
const rechargeAmount = computed(() => {
    return store.state.rechargeAmount
})
const emit = defineEmits();

const backFunc = ()=>{
    emit('backFunc')
}


</script>

<style lang="less" scoped>
.page_amount-verification {
    height: 100%;
    position: relative;

    .top-record {
        width: 0.4rem;
        height: 0.4rem;
    }
    .send-money {
        text-align: center;
        span {
            font-size: 16px;
            color: #8e8e93;
        }
    }
    .amount-money {
        text-align: center;
        margin-top: 20px;
        font-size: 50px;
        font-weight: 800;
    }
    .code-img-box {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 10px;
        .code-img {
            width: 200px !important;
            height: 200px !important;
        }
    }  
    .code-text {
        text-align: center;
        font-size: 14px;
        font-weight: 700;
        margin-top: 10px;
        margin-bottom: 20px;
    } 
    .circle-box {
        display: flex;
        justify-content: center;
        .circle-box-text {
            margin-left: 20px;
            margin-top: 5px;
            .circle-box-text-p {
                font-size: 18px;
                margin-bottom: 5px;
            }
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
    .verification-weight-text {
        margin-top: 15px;
        text-align: center;
        font-size: 22px;
        font-weight: 600;
    }
    .verification-text {
        margin-top: 15px;
        text-align: center;
        font-size: 16px;
        margin-bottom: 50px;
        color: #8e8e93;
    }
    
}
</style>