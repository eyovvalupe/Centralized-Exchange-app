<template>
    <div class="confirmation-box">
      <div class="detail-update-title">兑换确认</div>
      
      <div class="confirmation-box-t">
        <div>
          <div class="confirmation-text">支付</div>
          <div class="confirmation-p">347477 USDT</div>
        </div>
        <img src="/static/img/assets/transfer.png" alt="" class="confirmation-transfer-img">
        <div>
          <div class="confirmation-text">收到</div>
          <div class="confirmation-p">347477 USDT</div>
        </div>
      </div>

      <div class="confirmation-box-line"></div>
      <div class="confirmation-true">实际到账以实时汇率为准</div>


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
  .confirmation-box {
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
    .confirmation-box-t {
      display: flex;
      justify-content: space-between;
      .confirmation-transfer-img {
        width: 1.12rem!important;
        height: 1.12rem!important;
      }
      .confirmation-text {
        color: #8F92A1;
        text-align: center;
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.44rem;
      }
      .confirmation-p {
        color: #121826;
        text-align: center;
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 500;
        line-height: 0.44rem;
      }
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
  }
</style>