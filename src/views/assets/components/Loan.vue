<!-- 借贷 -->
<template>
    <div class="loan-box">
      <div class="ipo-detail-header">
        <Icon name="arrow-left" class="arrow-left" @click="goTotrade" />
        <span>借贷</span>
      </div>
  
      <div class="transfer-m">
        <div class="transfer-num-input">
            <span class="transfer-num-input-text">借款</span>
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
                <span>最大可借</span>
                <span style="color: #333333;">13747757USDT（现金金额 10USDT*杠杆 10）</span>
            </div>
        </div>

        <div class="slider-box">
        <Slider
            v-model="sliderValue"
            @change="onChange"
            :min="min"
            :max="max"
            bar-height="0.16rem"
            active-color="#0066ff"
            inactive-color="#eeeeee"
        />
        </div>
        <div class="slider-labels">
        <span v-for="(label, index) in labels" :key="index" :class="{ 'active-label': sliderValue === label.value }">
            {{ label.text }}
        </span>
        </div>


        <div class="loan-the-term">
          <div class="term-text">期限</div>
          <div class="loan-dispaly-box">
            <div>3 天</div>
            <div>5 天</div>
            <div>7 天</div>
            <div>15 天</div>
          </div>
          <div class="loan-interest">
            <span>利息</span>
            <span style="color: #333333;margin-left: 0.12rem;">13747757USDT</span>
          </div>
          <div class="loan-interest">
            <span>2024-06-20 前归还</span>
            <span style="color: #333333;margin-left: 0.12rem;">18747757USDT</span>
          </div>
        </div>


        <div class="ipo-code">
          <div class="confirmation-ipo-code-title">
            请输入交易密码
          </div>

          <PasswordInput
            :value="value"
            :focused="showKeyboard"
            @focus="showKeyboard = true"
            :gutter="16"
          />

          <Button :disabled="value === ''" size="large" color="#014cfa" round style="margin-bottom: 0.32rem;margin-top: 0.6rem;" @click="sure">确定</Button>

          <teleport to="body">
            <!-- 数字键盘 -->
            <NumberKeyboard
              v-model="value"
              :show="showKeyboard"
              @blur="showKeyboard = false"
            />
          </teleport>
        </div>


      </div>

    <teleport to="body">
      <Popup v-model:show="showPopup" position="bottom" closeable  v-if="showPopup" class="exchange-popup" style="height: 80%;">
        <LoanConfirmation />
      </Popup>
    </teleport>

    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { Icon, Field, Button, Popup, Slider, PasswordInput, NumberKeyboard } from 'vant';
  import { useRouter, useRoute } from 'vue-router';
  import LoanConfirmation from "./LoanConfirmation.vue";
  
  const route = useRoute();
  const router = useRouter();
  const isFocused = ref();
  const isInputFocused = ref();

  const number = ref('')
  const showPopup = ref(false)
  const sliderValue = ref(0);
  const min = ref(1);
  const max = ref(100);
  const step = ref(49);
  const labels = [
    { value: 1, text: '1X' },
    { value: 10, text: '10X' },
    { value: 50, text: '50X' },
    { value: 100, text: '100X' }
  ];
  const value = ref('');
  const showKeyboard = ref(false);

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

  const sure = ()=>{
    showPopup.value = true
  }

  const onChange = (value) => {
    sliderValue.value = value;
  };

  
  </script>
  
  <style lang="less">
  .loan-box {
    position: relative;
    padding: 0 0.3rem;
    background-color: white;
    padding-bottom: 5rem;
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
        .slider-box {
            margin-top: 0.4rem;
            margin-bottom: 0.28rem;
        }
        .slider-labels {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        .slider-labels span {
          color: #A2A2A7;
          font-size: 0.288rem;
          font-style: normal;
          font-weight: 400;
          line-height: 0.288rem;
        }
        .loan-the-term {
          .term-text {
            color: #333;
            font-size: 0.28rem;
            font-style: normal;
            font-weight: 400;
            line-height: 0.36rem;
            margin-top: 0.4rem;
            margin-bottom: 0.24rem;
          }
          .loan-dispaly-box {
            display: flex;
            margin-bottom: 0.2rem;
            div {
              width: 1.6rem;
              height: 0.8rem;
              border-radius: 0.1rem;
              background: #F7F7F7;
              text-align: center;
              line-height: 0.8rem;
              justify-content: space-between;
              margin-right: 0.16rem;
              color: #000;
              font-size: 0.28rem;
              font-style: normal;
              font-weight: 400;
            }
            div:last-of-type {
              margin-right: 0;
            }
          }
          .loan-interest {
            color: #8b8b8b;
            font-size: 0.24rem;
            font-style: normal;
            font-weight: 400;
            line-height: 0.4rem;
          }
        }

        .active-label {
          color: #1E1E2D;
          font-size: 0.288rem;
          font-style: normal;
          font-weight: 400;
          line-height: 0.288rem;
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
    .ipo-code {
      margin-top: 0.26rem;
      .confirmation-ipo-code-title {
        text-align: center;
        color: #121826;
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 500;
        line-height: 0.44rem;
        margin-bottom: 0.3rem;
        margin-top: 0.6rem;
      }
    }
    .van-password-input {
      margin: 0;
    }
    .van-password-input__security li {
      border-radius: 0.16rem;
      border: 0.02rem solid #eceff3;
    }
    @media (min-width: 751px) {
      .van-number-keyboard {
        max-width: 375px;
        position: absolute !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
      }
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
  