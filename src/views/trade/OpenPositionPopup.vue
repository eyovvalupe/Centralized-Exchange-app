<template>
  <div class="close-position-order-update">
    <div class="detail-update-title">开仓确认</div>

    <div class="order-update-box">

      <div class="detail-box">
        <div class="left-text">
          股票
        </div>
        <div class="right-text" style="line-height: 0.45rem;">
          <div>
            ADORWELD
          </div>
          <div style="color: #9ea3ae;">
            Ador Welding Limited
          </div>
        </div>
      </div>

      <div class="detail-box">
        <div class="left-text">
          开仓
        </div>
        <div class="right-text" style="display: flex;">
          <div class="detail-flex-1 detail-red-box">
            买涨
          </div>
          <div class="detail-flex-1 detail-blue-box">
            全仓
          </div>
          <div class="detail-flex-1">
            10X
          </div>
        </div>
      </div>


      <div class="detail-box">
        <div class="left-text">
          价格
        </div>
        <div class="right-text" style="display: flex;">
          <div class="detail-flex-1">
          </div>
          <div class="detail-flex-1 detail-blue-box">
            限价
          </div>
          <div class="detail-flex-1">
            99.88
          </div>
        </div>
      </div>


      <div class="detail-box">
        <div class="left-text">
          开仓数量
        </div>
        <div class="right-text">
          20000
        </div>
      </div>

      <div class="detail-box">
        <div class="left-text">
          止赢/止损
        </div>
        <div class="right-text">
          <div class="win-lose-box">
            无
          </div>
        </div>
      </div>
      

      <div class="position-bottom">
        <div>
          <span class="position-pay">支付 </span
          ><span class="pay-num">872000.12</span>
        </div>
        <div class="position-line-dashed"></div>
        <div class="position-fee">保证金 30000 + 手续费 20</div>
      </div>

      <div class="ipo-code">
        <div class="ipo-code-title">请输入交易密码</div>

        <PasswordInput
          :value="value"
          :focused="showKeyboard"
          @focus="showKeyboard = true"
          :gutter="16"
        />
        <!-- 数字键盘 -->
        <NumberKeyboard
          v-model="value"
          :show="showKeyboard"
          @blur="showKeyboard = false"
        />
      </div>


      <Button
        size="large"
        color="#014cfa"
        round
        style="margin-top: 30px;"
        >开仓</Button
      >

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Button, Field, Slider, PasswordInput, NumberKeyboard } from "vant";

const loseValue = ref("");
const addValue = ref("");
const percentages = [25, 50, 75, 100];
const value = ref("");
const showKeyboard = ref(true);

</script>

<style lang="less">
.close-position-order-update {
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
  .order-update-box {
    padding: 0 0.32rem;
    padding-top: 0.2rem;
  }
  .order-lose-title {
    color: #333;
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.36rem;
    text-align: left;
    margin-bottom: 0.2rem;
    margin-top: 0.2rem;
  }
  .lose-field {
    height: 0.88rem;
    border-radius: 0.12rem;
    border: 0.02rem solid #d0d8e2;
    .van-field__control {
      text-align: right;
    }
  }
  .account-monkey {
    text-align: right;
    color: #8f92a1;
    font-size: 0.28rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.48rem;
    margin: 0.12rem 0;
    .account-num-monkey {
      color: #333333;
    }
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

  .risk-line {
    display: flex;
    justify-content: right;
    color: #014cfa;
    font-size: 0.24rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.36rem;
  }
  .prcent-num {
    font-weight: 600;
    margin-left: 0.26rem;
    font-size: 0.36rem;
    width: 1rem;
    text-align: right;
  }
  .risk-line-dashed {
    width: 3.44rem;
    border-bottom: 0.02rem dashed #cbcbcb;
    position: absolute;
    right: 0.32rem;
    top: 0.42rem;
  }
  .all-risk-line {
    display: flex;
    justify-content: right;
    margin-top: 0.1rem;
    .risk-text {
      color: #333;
      text-align: center;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.36rem;
    }
  }
  .ipo-code {
    margin-top: 0.26rem;
    .ipo-code-title {
      text-align: center;
      color: #121826;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 500;
      line-height: 0.44rem;
      margin-bottom: 0.3rem;
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
      position: absolute;
      padding-bottom: 3.2rem !important;
    }
  }
  .close-price-num {
    text-align: right;
    color: #e8503a;
    font-size: 0.36rem;
    font-style: normal;
    font-weight: 600;
    line-height: 0.56rem;
    margin-top: 0.56rem;
  }
  .detail-box {
        display: flex;
        border-bottom: 0.02rem solid #f5f5f5;
        height: 1rem;
        width: 100%;
        .left-text {
          flex: 1;
          color: #8F92A1;
          text-align: left;
          font-size: 0.28rem;
          font-style: normal;
          font-weight: 400;
          line-height: 1rem;
        }
        .right-text {
          flex: 1;
          color: #121826;
          text-align: right;
          font-size: 0.28rem;
          font-style: normal;
          font-weight: 500;
          line-height: 1rem;
          position: relative;
          .win-lose-box {
            width: 1.16rem;
            height: 0.44rem;
            color: #014CFA;
            background-color: #ecf1fe;
            position: absolute;
            right: 0;
            line-height: 0.44rem;
            text-align: center;
            top: 0.28rem;
          }
          .copy-img {
            display: inline-block;
            width: 0.3rem !important;
            height: 0.3rem !important;
            vertical-align: middle;
            margin-left: 0.1rem;
          }
        }
        .detail-flex-1 {
          flex: 1;
        }
        .detail-red-box {
          width: 1.16rem;
          height: 0.44rem;
          background-color: #fbf1ef;
          color: #e8503a;
          margin: auto;
          text-align: center;
          line-height: 0.44rem;
        }
        .detail-blue-box {
          width: 1.16rem;
          height: 0.44rem;
          background-color: #ecf1fe;
          color: #014cfa;
          margin: auto;
          text-align: center;
          line-height: 0.44rem;
          margin-left: 0.18rem;
        }
      }
}
</style>
