<template>
    <div class="loan-confirmation-box">
      <div class="detail-update-title">借款确认</div>
      
      <div class="loan-confirmation-box-m">
        <div class="loan-confirmation-text">8888  USDT</div>
        <div class="loan-confirmation-flex">
          <div class="loan-confirmation-item" style="margin-top: 0.4rem;">
            <div class="loan-confirmation-item-left">杠杆</div>
            <div class="loan-confirmation-item-right">18747757USDT</div>
          </div>
          <div class="loan-confirmation-item">
            <div class="loan-confirmation-item-left">锁定本金</div>
            <div class="loan-confirmation-item-right">18747757USDT</div>
          </div>
          <div class="loan-confirmation-item">
            <div class="loan-confirmation-item-left">借款期限</div>
            <div class="loan-confirmation-item-right">5 天</div>
          </div>
          <div class="loan-confirmation-item">
            <div class="loan-confirmation-item-left">利息</div>
            <div class="loan-confirmation-item-right">1388558USDT </div>
          </div>
        </div>
      </div>

      <div class="confirmation-box-line"></div>
      <div class="confirmation-true">2024-06-20 前归还 <span>18747757USDT</span></div>


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

        <Button :disabled="value === ''" size="large" color="#014cfa" round style="margin-bottom: 0.32rem;margin-top: 0.6rem;">确定</Button>

        <!-- 数字键盘 -->
        <NumberKeyboard
          v-model="value"
          :show="showKeyboard"
          @blur="showKeyboard = false"
        />
      </div>

    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import { Button, Field, Slider, PasswordInput, NumberKeyboard, showToast } from "vant";
  import { _stocksBuy } from "@/api/api";
  import store from "@/store";
  
  const value = ref('');
  const showKeyboard = ref(false);
  
  </script>
  
  <style lang="less">
  .loan-confirmation-box {
    padding: 0 0.3rem;
    padding-bottom: 5rem;
    .detail-update-title {
      text-align: center;
      margin-top: 0.4rem;
      color: #121826;
      font-size: 0.32rem;
      font-style: normal;
      font-weight: 500;
      line-height: 0.44rem;
      margin-bottom: 0.36rem;
    }
    .confirmation-box-line {
      margin-top: 0.28rem;
      border: 0.02rem dashed #cbcbcb; /* 设置虚线边框 */
      margin-bottom: 0.12rem;
    }
    .confirmation-true {
      color: #333;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 500;
      line-height: 0.4rem;
      text-align: right;
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
    .loan-confirmation-box-m {
      .loan-confirmation-text {
        color: #000;
        text-align: center;
        font-size: 0.64rem;
        font-style: normal;
        font-weight: 700;
        line-height: 0.44rem;
        margin-bottom: 0.3rem;
      }
      .loan-confirmation-flex {
        .loan-confirmation-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.44rem;
        }
        .loan-confirmation-item-left {
          color: #8F92A1;
          font-size: 0.28rem;
          font-style: normal;
          font-weight: 400;
          line-height: 0.44rem;
        }
        .loan-confirmation-item-right {
          color: #000;
          font-size: 0.28rem;
          font-style: normal;
          font-weight: 400;
          line-height: 0.44rem;
        }
      }
    }
  }
</style>