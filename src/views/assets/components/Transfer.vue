<!-- 划转 -->
<template>
    <div class="transfer-box">
      <div class="ipo-detail-header">
        <Icon name="arrow-left" class="arrow-left" @click="goTotrade" />
        <span>划转</span>
      </div>
  
      <div class="transfer-m">
        <div class="transfer-m-t" @click="handleDivClick(1)" :class="{'border-changed': isInputFocused === 1}">
            <div>
                <span style="display: inline-block;margin-right: 0.32rem;">从</span>
                <span style="color: #000000;">{{ topText }}</span>
            </div>
            <img src="/static/img/trade/down.png" class="transfer-down-img"/>
        </div>

        <div class="transfer-m-m">
            <div class="tans-line"></div>
            <img src="/static/img/assets/transfer.png" alt="" class="transfer-img" @click="transfer">
            <div class="tans-line"></div>
        </div>

        <div class="transfer-m-t" @click="handleDivClick(2)" :class="{'border-changed': isInputFocused === 2}">
            <div>
                <span style="display: inline-block;margin-right: 0.32rem;">到</span>
                <span style="color: #000000;">{{ bottomText }}</span>
            </div>
            <img src="/static/img/trade/down.png" class="transfer-down-img"/>
        </div>

        <div class="transfer-num-input">
            <span class="transfer-num-input-text">数量</span>
            <Field
                v-model="number"
                @focus="handleFocus(1)" 
                @blur="handleBlur(1)"
                :class="[{'focusinput': isFocused === 1}]" 
            >
                <template #button>
                    <span class="most-button">最大 </span>
                </template>
            </Field>
            <div class="transfer-most-text">
                <span>最多可转</span>
                <span style="color: #333333;">13747757USDT</span>
            </div>
        </div>

        <Button
            size="large"
            color="#014cfa"
            class="sure-button"
            round
            >确定</Button
        >

      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { Icon, Field, Button } from 'vant';
  import { useRouter, useRoute } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  const isFocused = ref();
  const isInputFocused = ref();
  const topText = ref('现金账户');
  const bottomText = ref('股票账户');

  const number = ref('')
  
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

  
  </script>
  
  <style lang="less">
  .transfer-box {
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
        .transfer-down-img {
            width: 0.32rem !important;
            height: 0.32rem !important;
            margin-top: 0.4rem !important;
        }
        .transfer-m-m {
            display: flex;
            margin-top: 0.26rem;
            margin-bottom: 0.46rem;
            justify-content: space-between;
            .tans-line {
                width: 10.4rem;
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
            margin-top: 0.9rem;
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
  }
  </style>
  