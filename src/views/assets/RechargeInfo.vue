<!-- 充值详情 -->
<template>
    <div class="recharge_record_info">
        <Top :title="'充值详情'">
            <template #right>
                <div class="top-record" @click="goChat">
                    <span><img src="/static/img/user/server.png" alt="img"></span>
                </div>
            </template>
        </Top>

        <div class="top_info">
            <div class="status" v-if="orderData.status == 'success'">
                <div class="status_icon">
                    <img src="/static/img/assets/status_success.png?241024" alt="img">
                </div>
                <div class="status_name">充值成功</div>
                <div class="status_desc">您充值的{{orderData.amount}}{{orderData.currency}}已到账</div>
            </div>
            <div class="status" v-else-if="orderData.status == 'failure'">
                <div class="status_icon">
                    <img src="/static/img/assets/status_error.png?241024" alt="img">
                </div>
                <div  class="status_name">充值失败</div>
                <div class="status_desc">请重新充值，或联系客服</div>
            </div>
            <div class="status" v-else>
                
                <div class="status_icon">
                    <LoadEffect class="status_loading" color="#fff" />
                    <img src="/static/img/assets/status_wait.png" alt="img">
                </div>
                <div class="status_name">充值处理中</div>
                <div class="status_desc">请等待充值结果</div>
            </div>
           
        </div>
        <div class="bottom_info">
            <div class="bottom_item">
                <div class="name">充值金额</div>
                <div class="value">{{orderData.amount}} <span class="value_currency">{{orderData.currency}}</span></div>
            </div>
            <div class="bottom_item">
                <div class="name">充值币种</div>
                <div class="value">{{ orderData.currency }}</div>
            </div>
            <div class="bottom_item">
                <div class="name">充值网络</div>
                <div class="value">{{ orderData.network }}</div>
            </div>

            <div class="bottom_item">
                <div class="name">充值地址</div>
                <div class="value">
                    <div class="value_text van-omit1">{{ orderData.address }}</div>
                    <div class="copy_icon" @click="copy(orderData.address)">
                        <img src="/static/img/trade/copy.png" alt="copy">
                    </div>
                </div>
            </div>
            <div class="bottom_item">
                <div class="name">订单编号</div>
                <div class="value">
                    <div class="value_text van-omit1">{{ orderData.order_no }}</div>
                    <div class="copy_icon" @click="copy(orderData.order_no)">
                        <img src="/static/img/trade/copy.png" alt="copy">
                    </div>
                </div>
            </div>
            
            <div class="bottom_item">
                <div class="name">充值时间</div>
                <div class="value">{{ orderData.date }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { ref } from "vue"
import { _depositGet } from "@/api/api"
import { showToast } from 'vant'
import { useRoute } from "vue-router"
import { _copyTxt } from "@/utils/index"
import LoadEffect from '@/components/LoadEffect.vue'
import router from '@/router'

const route = useRoute()

//  复制
const copy = text => {
    _copyTxt(text)
    showToast('已复制')
}


const loading = ref(false)
const order_no = ref(route.query.order_no) // 订单编号

// 获取订单详情
const orderData = ref({})
const getOrderInfo = () => {
    loading.value = true
    
    _depositGet({
        order_no: order_no.value
    }).then(res => {
        
        if (res.data) {
            console.log('recharge info >>> res data =======> ', res.data)
            orderData.value = res.data
        }
    }).finally(() => {
        loading.value = false
    })
}

getOrderInfo()

const goChat = () => {
  router.push({
    name: 'chat'
  })
}


</script>

<style lang="less" scoped>
.recharge_record_info {
    padding: 1.12rem 0.32rem 0.32rem 0.32rem;
    .top-record {
        width: 0.72rem;
        height: 0.72rem;
        box-sizing: border-box;
        border: 1px solid #EDF2F7;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        span{
            display: block;
            width: 0.432rem;
            height: 0.432rem;
        }
    }
    .top_info {
        padding-top: 0.52rem;

        .status {
            display: flex;
            align-items: center;
            flex-direction: column;

            .status_icon {
                width: 1.2rem;
                height: 1.2rem;
                position: relative;
            }
            .status_loading{
                position: absolute;
                left:0;
                top:0;
                transform: scale(0.35);
                left:-0.4rem;
                top:-0.4rem;
            }
            .status_name{
                font-size: 0.3rem;
                line-height: 140%;
                color:#061023; 
                margin-top: 0.32rem;
            }
            .status_desc{
                color: #666D80;
                text-align: center;
                font-size: 0.28rem;
                line-height: 140%;
                margin-top: 0.16rem;
            }
        }

     

    }

    .bottom_info {
        padding: 0.22rem 0.32rem;
        .bottom_item {
            padding: 0.32rem 0 0.2rem 0;
            border-bottom: 1px solid #F5F7FC;
            display: flex;
            justify-content: space-between;
            font-size: 0.28rem;
            color: #8F92A1;
            line-height: 0.44rem;
            font-weight: 400;
            .value {
                font-size: 0.3rem;
                color: #061023;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                flex: 1;
                overflow: hidden;
                margin-left: 0.32rem;
            }
            .value_text{
                display: block;
                flex: 1;
                text-align: right;
            }
            .value_currency{
                font-size: 0.24rem;
                margin-left: 0.12rem;
                vertical-align: bottom;
                position: relative;
                top:0.02rem;
            }
            .copy_icon{
                width: 0.24rem;
                height: 0.24rem;
                margin-left: 0.16rem;
            }
        }
    }
}
</style>