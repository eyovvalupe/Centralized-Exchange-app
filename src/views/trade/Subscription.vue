<template>
    <div class="subscription">

        <div class="ipo-detail-header">
            <Icon name="arrow-left" class="arrow-left" @click="goTotrade" />
            <span>认购</span>
        </div>

        <span class="grop-title" style="margin-top: 0.6rem;display: block;">认购名称</span>
        <Field v-model="nameVal" input-align="right"  @focus="handleFocus(1)" 
        @blur="handleBlur(1)" :class="['num-input',{'focusinput': isFocused === 1}]"  style="margin-bottom: 0.4rem;"/>

        <div class="subscription-m-box">
            <div class="vip-subscription">
                <span>VIP 认购码</span>
                <img src="/static/img/trade/down.png" class="subscription-down-img">
            </div>
            <Field class="vip-input" v-model="vipVal" type="number" input-align="right" placeholder="请输入VIP认购码"/>
        </div>
        
        <span class="grop-title">认购数量</span>
        <Field v-model="numValue" type="number" input-align="right" @change="inputChange"  @focus="handleFocus(5)" 
        @blur="handleBlur(5)" :class="['num-input',{'focusinput': isFocused === 5}]" />
  
        <div class="position-account">
          可买数量 <span style="color: #333">0</span>
        </div>
  
        <Slider
          v-model="sliderValue"
          bar-height="0.08rem"
          active-color="#f2f2f2"
          inactive-color="#f2f2f2"
          @change="onSliderChange"
        />
        <div class="percentages">
          <div v-for="percent in percentages" :key="percent" class="percentage">
            <div class="line"></div>
            {{ percent }}%
          </div>
        </div>
  
        <div class="subscription-total">
            <div class="subscription-text">
                <span>锁定金额</span><span>₹ 2000000</span>
                <div class="subscription-position-line-dashed"></div>
            </div>
            <div class="subscription-text">
                <span>手续费</span><span>₹ 2000000</span>
                <div class="subscription-position-line-dashed"></div>
            </div>
            <div class="subscription-total-text">
                <span>合计</span><span>₹ 2000000</span>
            </div>
            
        </div>
  
        <Button
          size="large"
          color="#014cfa"
          round
          @click="openPositPopup()"
          >认购</Button
        >
        
  
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import { Tab,Tabs,Field,Slider,Button,Loading, showToast ,Icon} from "vant";
  import { useRouter, useRoute } from "vue-router";
  import store from "@/store";
  import Decimal from 'decimal.js';
  
  const router = useRouter();
  const route = useRoute();

  const sliderValue = ref(0);
  const loading = ref(false);
  const percentages = [25, 50, 75, 100];
  
  //输入框的值
  const numValue = ref('')
  const nameVal = ref('')
  const vipVal = ref('')

  
  const isFocused = ref();


  const goTotrade = () => {
    if (route.query.type === "market") {
      router.push({ name: 'market'});
    } else if (route.query.type === "trade"){
      router.push({ name: 'trade'});
    }
  };


  
  const onSliderChange = (newValue) => {
    //滚动滑动条
    sliderValue.value = newValue;
  };
  
  const handleFocus = (val) => {
    isFocused.value = val
  };
  
  const handleBlur = (val) => {
    isFocused.value = null
  };
  
  
  const openPositPopup = () => {
    router.push({
      name:'subscriptionSuccess'
    });
  };
  

  const inputChange = ()=>{
    
  }
  
  </script>
  
  <style lang="less">
  .subscription {
    padding: 0 0.3rem;
    padding-bottom: 0.76rem;
    background-color: white;
    // .van-loading {
    //   left: 47%;
    //   margin-top: 2rem !important;
    // }
    .arrow-left {
        position: absolute;
        left: 0.3rem;
        top: 0.36rem;
    }
    .ipo-detail-header {
        padding: 0.3rem 0;
        background-color: white;
        color: #010101;
        font-size: 0.36rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.52rem;
        text-align: center;
    }
    .position-header {
      display: flex;
      .up-botton {
        width: 1.2rem;
        height: 0.5rem;
        color: #014cfa;
        line-height: 0.5rem;
        text-align: center;
        position: relative;
        background-size: cover;
        background-position: center;
      }
      .down-button {
        width: 1.32rem;
        height: 0.56rem;
        color: white;
        line-height: 0.56rem;
        text-align: center;
        background-size: cover;
        background-position: center;
      }
      .position-tabs {
        width: 4.4rem;
        margin-left: 0.12rem;
        .tabs .van-tab {
          margin-left: 0.2rem !important;
        }
      }
    }
  
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.5s;
    }
    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
    }
    .grop-title {
      color: #333;
      text-align: left;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.36rem;
    }
    // .position-box {
      .stock-input {
        width: 100%;
        height: 1.14rem;
        border-radius: 0.12rem;
        border: 0.02rem solid #d0d8e2;
        margin: 0.2rem 0;
      }
      .stock-input-text {
        .van-field__control {
          text-align: center;
          caret-color: #014cfa;
        }
      }
  
      .num-input {
        width: 100%;
        height: 0.88rem;
        border-radius: 0.12rem;
        border: 0.02rem solid #d0d8e2;
        margin-top: 0.2rem;
        transition: all 0.3s ease;
      }
      .price-num-input {
        width: 4.9rem;
        height: 0.88rem;
        border-radius: 0.12rem;
        border: 0.02rem solid #d0d8e2;
        margin-top: 0.2rem;
        background: white;
      }
      .pricenlarged {
        background: #f9fafb;
      }
      .market-button {
        width: 1.9rem;
        height: 0.72rem;
        border-radius: 1.26rem;
        background: #f2f2f2;
        text-align: center;
        line-height: 0.72rem;
        color: #999;
        text-align: center;
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 600;
        margin-left: 0.16rem;
        margin-top: 0.28rem;
        cursor: pointer;
      }
      .marketenlarged {
        background: #014cfa;
        color: white;
      }
      // .num-right-text {
      //   .van-field__control {
      //     text-align: right;
      //   }
      // }
  
      .small-select {
        width: 1.48rem;
        height: 0.88rem;
        flex-shrink: 0;
        border-radius: 0.12rem;
        border: 0.02rem solid #d0d8e2;
        margin-right: 0.24rem;
        line-height: 0.88rem;
        position: relative;
        color: #333333;
      }
      .select-box {
        .select-box-item {
          width: 1.48rem;
          height: 0.88rem;
          line-height: 0.88rem;
          margin-left: 0.2rem;
        }
        .bigslect {
          width: 100%;
          text-align: center;
          padding-right: 0.4rem;
        }
        .selected-class {
          color: #1e5eff;
        }
      }
  
      .van-dropdown-menu__title:after {
        border-color: transparent transparent #333333 #333333;
      }
      .van-dropdown-menu__title {
        padding-left: 0;
      }
      .van-overlay {
        background-color: transparent;
      }
      .van-dropdown-item {
        z-index: 9999!important;
      }
      .big-selcet {
        width: 100%;
        height: 0.88rem;
        border-radius: 0.12rem;
        border: 0.02rem solid #d0d8e2;
        line-height: 0.88rem;
        text-align: center;
        position: relative;
        color: #333333;
      }
      .down-img {
        display: inline-block;
        width: 0.32rem !important;
        height: 0.32rem !important;
        vertical-align: middle;
        position: absolute;
        right: 0.2rem;
        top: 0.28rem;
      }
    // }
    .position-account {
      margin: 0.1rem 0;
      text-align: right;
      color: #8f92a1;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.48rem;
    }
    .position-bottom {
      text-align: right;
      margin-top: 0.8rem;
      position: relative;
      .position-pay {
        color: #014cfa;
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.48rem;
        vertical-align: middle;
      }
      .pay-num {
        color: #014cfa;
        text-align: right;
        font-size: 0.36rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.56rem;
        vertical-align: middle;
      }
      .position-line-dashed {
        width: 3.44rem;
        border-bottom: 0.02rem dashed #cbcbcb;
        position: absolute;
        right: 0;
        top: 0.5rem;
      }
      .position-fee {
        margin-top: 0.1rem;
        color: #333;
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.36rem;
        margin-bottom: 0.76rem;
      }
    }
    .custom-button {
      width: 0.06rem;
      height: 0.48rem;
      background: #014cfa;
    }
    .co-text {
      color: #333;
      text-align: center;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.36rem;
    }
    .percentages {
      display: flex;
      justify-content: space-between;
      margin-top: 0.2rem;
      width: 100%;
      z-index: 7;
      .line {
        width: 0.06rem;
        height: 0.2rem;
        position: absolute;
        right: 0;
        top: -0.36rem;
        background: white;
        z-index: 88;
      }
    }
  
    .percentage {
      color: #8f92a1;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      text-align: center;
      width: 25%;
      position: relative;
    }
    .purchase-amount {
      margin-top: 0.2rem;
      color: #333;
      font-size: 0.32rem;
    }
  
    .van-slider {
      margin-top: 0.1rem;
      height: 0.16rem !important;
      border-radius: 0.02rem;
    }
  
    .van-slider__bar {
      position: relative;
    }
  
    .van-slider__button {
      width: 0.06rem;
      height: 0.48rem;
      background-color: #014cfa;
      border-radius: inherit;
      top: -0.36rem;
    }
  
    .van-slider__button-wrapper {
      z-index: 999 !important;
    }
  
    input:focus {
      color: #014cfa;
      caret-color: #014cfa; /* 光标颜色 */
    }
  
    input:focus::placeholder {
    //   color: #014cfa; /* 占位符颜色 */
    }
  
    .focusinput {
      border-color: #014cfa !important;
    }
    .subscription-total {
        margin-bottom: 0.8rem;
        margin-top: 0.26rem;
        .subscription-text {
            position: relative;
            text-align: right;
            color: #343434;
            font-size: 0.28rem;
            font-style: normal;
            font-weight: 400;
            line-height: 0.72rem;
            height: 0.72rem;
        }
        .subscription-total-text {
            text-align: right;
            color: #343434;
            font-size: 0.36rem;
            font-style: normal;
            font-weight: 600;
            line-height: 0.8rem;
        }
        .subscription-position-line-dashed {
            width: 3.44rem;
            border-bottom: 0.02rem dashed #cbcbcb;
            position: absolute;
            right: 0;
            top: 0.7rem;
        }
    }
    .subscription-m-box {
        display: flex;
        width: 6.86rem;
        height: 0.88rem;
        border-radius: 0.12rem;
        border: 0.02rem solid #D0D8E2;
        margin-bottom: 0.4rem;
        padding-left: 0.4rem;
        .vip-subscription {
            display: flex;
            width: 3rem;
            justify-content:space-between;
            span{
                text-align: center;
                line-height: 0.88rem;
                font-size: 0.28rem;
                font-style: normal;
                font-weight: 400;
            }
            .subscription-down-img {
                display: inline-block;
                width: 0.32rem !important;
                height: 0.32rem !important;
                vertical-align: middle;
                margin-top: 0.28rem;
            }
        }
        .vip-input {
            margin-right: 0.04rem;
        }
    }
  }
  </style>
  