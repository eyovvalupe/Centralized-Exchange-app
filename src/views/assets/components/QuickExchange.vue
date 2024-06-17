<!-- 划转 -->
<template>
    <div class="exchange-box">
      <div class="ipo-detail-header">
        <Icon name="arrow-left" class="arrow-left" @click="goTotrade" />
        <span>快速兑换</span>
      </div>
  
      <div class="transfer-m">
        <div class="transfer-num-input">
            <span class="transfer-num-input-text">支付</span>
            <Field
                v-model="number"
                @focus="handleFocus(1)" 
                @blur="handleBlur(1)"
                :class="[{'focusinput': isFocused === 1}]" 
            >
                <template #button>
                  <div style="display: flex;">
                    <span class="most-button">全部 </span>
                    <div class="right-img">
                      <img src="/static/img/assets/usdt.png" alt="" class="city-img">
                      <div class="transfer-coin">USDT</div>
                      <img src="/static/img/trade/down.png" class="transfer-down-img"/>
                    </div>
                  </div>
                </template>
            </Field>
            <div class="transfer-most-text">
                <span>可用余额</span>
                <span style="color: #333333;">13747757USDT</span>
            </div>
        </div>

        <div class="transfer-m-m">
            <div class="tans-line"></div>
            <img src="/static/img/assets/transfer.png" alt="" class="transfer-img" @click="transfer">
            <div class="tans-line"></div>
        </div>


        <div class="transfer-num-input">
            <span class="transfer-num-input-text">预计收到</span>
            <Field
                v-model="number"
                @focus="handleFocus(2)" 
                @blur="handleBlur(2)"
                :class="[{'focusinput': isFocused === 2}]" 
            >
                <template #button>
                    <div class="right-img">
                      <img src="/static/img/assets/cn.png" alt="" class="city-img">
                      <div class="transfer-coin">CNY</div>
                      <img src="/static/img/trade/down.png" class="transfer-down-img"/>
                    </div>
                </template>
            </Field>

            <div class="transfer-most-text-b">
              <div class="transfer-most-text">
                  <span>1USDT≈</span>
                  <span style="color: #333333;">7CNY</span>
              </div>
              <div class="transfer-most-text-r">
                <div class="transfer-most-text-r-l">实时汇率</div>
                <div class="transfer-most-text-r-r">7s 后更新</div>
              </div>
            </div>

            <div class="transfer-text-true">实际到账以实时汇率为准</div>
            
        </div>

        <Button
            size="large"
            color="#014cfa"
            class="sure-button"
            round
            @click="sure"
            >确定</Button
        >

      </div>

      <teleport to="body">
        <Popup v-model:show="showPopup" position="bottom" closeable  v-if="showPopup" class="exchange-popup" style="height: 80%;">
        <Confirmation />
      </Popup>
    </teleport>

    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { Icon, Field, Button, Popup } from 'vant';
  import { useRouter, useRoute } from 'vue-router';
  import Confirmation from "./Confirmation.vue";
  
  const route = useRoute();
  const router = useRouter();
  const isFocused = ref();
  const isInputFocused = ref();
  const topText = ref('现金账户');
  const bottomText = ref('股票账户');

  const number = ref('')
  const showPopup = ref(false)
  
  const goTotrade = () => {
    router.push({ name: 'assets'});
  };

  const handleFocus = (val) => {
    isFocused.value = val
    isInputFocused.value = 3
  };

  const handleBlur = (val) => {
    isFocused.value = null
  };


  const handleDivClick = (val) => {
    isInputFocused.value = val;
  };

  const transfer = ()=>{
    const temp = topText.value;
    topText.value = bottomText.value;
    bottomText.value = temp;
  }

  const sure = ()=>{
    showPopup.value = true
  }

  
  </script>
  
  <style lang="less">
  .exchange-box {
    position: relative;
    padding: 0 0.3rem;
    background-color: white;
    .arrow-left {
      position: absolute;
      left: 0.3rem;
      top: 0.36rem;
    }
    .ipo-detail-header {
      padding-top: 0.3rem;
      padding-bottom: 0.52rem;
      background-color: white;
      color: #010101;
      font-size: 0.36rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.52rem;
      text-align: center;
    }
    .transfer-m {
        .transfer-m-t {
            width: 6.86rem;
            height: 1.12rem;
            border: 0.02rem solid #d2d8e1;
            border-radius: 0.24rem;
            line-height: 1.12rem;
            padding-left: 0.76rem;
            padding-right: 0.4rem;
            color: #707070;
            font-size: 0.32rem;
            font-style: normal;
            font-weight: 400;
            display: flex;
            justify-content: space-between;
        }
        .transfer-m-m {
            display: flex;
            margin-top: 0.26rem;
            margin-bottom: 0.46rem;
            justify-content: space-between;
            .tans-line {
                width: 2.4rem;
                height: 0.02rem;
                background-color: #3B82F6;
                opacity: 0.1;
                margin-top: 0.56rem;
            }
            .transfer-img {
                width: 1.12rem !important;
                height: 1.12rem !important;
            }
        }
        .transfer-num-input {
            .transfer-num-input-text {
                color: #333;
                font-size: 0.28rem;
                font-style: normal;
                font-weight: 400;
                line-height: 0.36rem;
                margin-bottom: 0.1rem;
                display: inline-block;
            }
            .van-cell {
                width: 6.86rem;
                height: 1.12rem;
                border: 0.02rem solid #d2d8e1;
                border-radius: 0.24rem;
                padding-left: 0.76rem;
                padding-right: 0.4rem;
                line-height: 0.68rem;
            }
            .most-button {
                color: #1A59F6;
                font-size: 0.28rem;
                font-style: normal;
                font-weight: 500;
                display: inline-block;
                margin-right: 0.6rem;
            }
            .right-img {
              display: flex;
            }
            .transfer-coin {
              color: #061023;
              font-size: 0.28rem;
              font-style: normal;
              font-weight: 400;
              margin-left: 0.12rem;
              margin-right: 0.08rem;
              width: 0.8rem;
              text-align: left;
              line-height: 0.68rem;
            }
            .transfer-down-img {
                width: 0.32rem !important;
                height: 0.32rem !important;
                margin-top: 0.18rem !important;
              }
            .city-img {
              width: 0.56rem !important;
              height: 0.56rem !important;
              margin-top: 0.06rem !important;
            }
            .transfer-most-text {
                color: #8b8b8b;
                font-size: 0.24rem;
                font-style: normal;
                font-weight: 400;
                line-height: 0.4rem;
                margin-top: 0.1rem;
            }
        }
        .sure-button {
          margin-top: 1.2rem;
        }
        input:focus {
        color: #014cfa;
        caret-color: #014cfa; /* 光标颜色 */
      }

      input:focus::placeholder {
        // color: #014cfa; /* 占位符颜色 */
      }

      .focusinput {
        border-color: #014cfa !important;
      }
    }
    .border-changed {
      border-color: #014cfa !important;
    }
    .transfer-most-text-b {
      display: flex;
      justify-content: space-between;
      .transfer-most-text-r {
        display: flex;
        .transfer-most-text-r-l {
          color: #333;
          font-size: 0.24rem;
          font-style: normal;
          font-weight: 500;
          line-height: 0.4rem;
          margin-top: 0.1rem;
        }
        .transfer-most-text-r-r {
          width: 0.98rem;
          height: 0.36rem;
          border-radius: 0.04rem;
          border: 0.02rem solid #014CFA;
          color: #014CFA;
          text-align: center;
          font-size: 0.2rem;
          font-style: normal;
          font-weight: 500;
          line-height: 0.36rem;
          margin-top: 0.1rem;
          margin-left: 0.16rem;
        }
      }
    }
    .transfer-text-true {
      color: #333;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 500;
      line-height: 0.4rem;
      margin-top: 0.2rem;
      text-align: right;
    }
  }
  .exchange-popup {
    border-top-left-radius: 0.36rem;
    border-top-right-radius: 0.36rem;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  @media (min-width: 751px) {
    .exchange-popup {
      max-width: 375px;
      position: absolute !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
    }
  }
  </style>
  