<template>
  <div class="assets">
    <div class="header">
      <div class="title">资产</div>
    </div>

    <div class="assets-tab">
      <div :class="['assets-tab-item',{highlight: selectedTab === i.val}]" v-for="i in tab" :key="i.val" @click="selectTab(i.val)">
        {{ i.text }}
      </div>
    </div>

    <div class="assets-box">
      <div :style="backgroundImageStyle" class="t-box">
        <div class="assets-t-title">
          <div style="display: flex;">
            <div class="assets-all">资产合计</div>
            <Icon name="eye-o" class="eye-o"/>
          </div>
          <div class="assets-account-button">
            账户间划转
          </div>
        </div>

        <div class="assets-price">
          32,761.65
        </div>

        <div style="display: flex;">
          <div class="assets-b">
            <div class="assets-t">
              现金
            </div>
            <div class="assets-p">
              156,567.00
            </div>
            <div class="r-line"></div>
          </div>

          <div class="assets-b">
            <div class="assets-t">
              保证金
            </div>
            <div class="assets-p">
              880,88.00
            </div>
            <div class="r-line"></div>
          </div>

          <div class="assets-b">
            <div class="assets-t">
              借贷
            </div>
            <div class="assets-p">
              48,888.00
            </div>
          </div>
        </div>


        <div class="assets-dj">
          2325,255.00 冻结
        </div>
      </div>
    </div>

    <div class="assets-m-box">
      <div :style="twoImage" class="assets-s-box">
        <img src="/static/img/assets/money.png" alt="" class="assets-s-box-img">
        <div class="assets-s-box-text">充值</div>
      </div>
      <div :style="threeImage" class="assets-s-box">
        <img src="/static/img/assets/pay.png" alt="" class="assets-s-box-img" style="margin-bottom: 7px;">
        <div class="assets-s-box-p">
          100,000
        </div>
        <div class="assets-s-box-text">
          提现
        </div>
      </div>

      <div :style="fourImage" class="assets-s-box">
        <img src="/static/img/assets/trans.png" alt="" class="assets-s-box-img">
        <div class="assets-s-box-text">
          现金账户兑换
        </div>
      </div>

    </div>

    <div class="assets-b-box">
      <SwipeCell>
        <div class="assets-b-box-b" style="border-top: 1px solid #eaeaea;">
          <div class="assets-b-box-b-t">
            现金账户
          </div>
          <div class="assets-b-box-b-p">
            1000
          </div>
        </div>
        <template #right>
          <div class="assets-right-div">
            <div class="assets-right-div-left-box" style="border-top: 1px solid #eaeaea;">
            </div>
            <div class="assets-right-i-div" style="background-color: #3f845f;">
              <img src="/static/img/assets/money.png" alt="" class="assets-right-i-div-img">
              充值
            </div>
            <div class="assets-right-i-div" style="background-color: #fe9c43;">
              <img src="/static/img/assets/pay.png" alt="" class="assets-right-i-div-img">
              提现
            </div>
            <div class="assets-right-i-div" style="background-color: #2685ca;">
              <img src="/static/img/assets/down.png" alt="" class="assets-right-i-div-img">
              转入
            </div>
            <div class="assets-right-i-div" style="background-color: #e25c5c;">
              <img src="/static/img/assets/up.png" alt="" class="assets-right-i-div-img">
              转出
            </div>
          </div>
        </template>
      </SwipeCell>
     
      <SwipeCell>
        <div class="assets-b-box-b">
          <div class="assets-b-box-b-t">
            股票
          </div>
          <div class="assets-b-box-b-p">
            1000
          </div>
        </div>
        <template #right>
          <div class="assets-right-div">
            <div class="assets-right-div-left-box">
            </div>
            <div class="assets-right-i-div" style="background-color: #3f845f;">
              <img src="/static/img/assets/money.png" alt="" class="assets-right-i-div-img">
              充值
            </div>
            <div class="assets-right-i-div" style="background-color: #fe9c43;">
              <img src="/static/img/assets/pay.png" alt="" class="assets-right-i-div-img">
              提现
            </div>
          </div>
        </template>
      </SwipeCell>
      
      <SwipeCell>
        <div class="assets-b-box-b">
          <div class="assets-b-box-b-t">
            合约
          </div>
          <div class="assets-b-box-b-p">
            1000
          </div>
        </div>
        <template #right>
          <div class="assets-right-div">
            <div class="assets-right-div-left-box">
            </div>
            <div class="assets-right-i-div" style="background-color: #3f845f;">
              <img src="/static/img/assets/money.png" alt="" class="assets-right-i-div-img">
              充值
            </div>
            <div class="assets-right-i-div" style="background-color: #fe9c43;">
              <img src="/static/img/assets/pay.png" alt="" class="assets-right-i-div-img">
              提现
            </div>
          </div>
        </template>
      </SwipeCell>
      
      <SwipeCell>
        <div class="assets-b-box-b">
          <div class="assets-b-box-b-t">
            IPO
          </div>
          <div class="assets-b-box-b-p">
            1000
          </div>
        </div>
        <template #right>
          <div class="assets-right-div">
            <div class="assets-right-div-left-box">
            </div>
            <div class="assets-right-i-div" style="background-color: #3f845f;">
              <img src="/static/img/assets/money.png" alt="" class="assets-right-i-div-img">
              充值
            </div>
            <div class="assets-right-i-div" style="background-color: #fe9c43;">
              <img src="/static/img/assets/pay.png" alt="" class="assets-right-i-div-img">
              提现
            </div>
          </div>
        </template>
      </SwipeCell>
      
    </div>



  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Icon, SwipeCell } from 'vant';
import store from "@/store";


// 当前选中的标签
const selectedTab = ref(0);

const tab = [
  {
    text:'总资产',
    val:0
  },
  {
    text:'现金账户',
    val:1
  },
  {
    text:'股票',
    val:2
  },
  {
    text:'合约',
    val:3
  },
  {
    text:'IPO',
    val:4
  },
]

const backgroundImageStyle = computed(() => ({
  backgroundImage: `url(/static/img/assets/one.png)`,
}));

const twoImage = computed(() => ({
  backgroundImage: `url(/static/img/assets/two.png)`,
}));

const threeImage = computed(() => ({
  backgroundImage: `url(/static/img/assets/three.png)`,
}));

const fourImage = computed(() => ({
  backgroundImage: `url(/static/img/assets/four.png)`,
}));

const selectTab = (val) => {
  selectedTab.value = val;
};

</script>

<style lang="less">
.assets {
  position: relative;
  padding-bottom: 1.4rem;
  background-color: white;
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.28rem;
    padding: 0 0.3rem;
  }
  .title {
    height: 1.12rem;
    color: #0d0d12;
    font-size: 0.56rem;
    font-weight: 600;
    line-height: 1.12rem;
  }
  .assets-tab {
    height: 36px;
    display: flex;
    padding: 0 0.3rem;
    margin-bottom: 15px;
    .assets-tab-item {
      height: 36px;
      line-height: 36px;
      text-align: center;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      position: relative;
      margin: 0 10px;
    }
    .highlight {
      height: 36px;
      border-radius: 24px;
      background: #F6F8FF;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 36px;
      color: #014cfa;
      padding: 0 23px;
      margin: 0 !important;
      margin-right: 10px !important;
    }
  }
  .assets-box {
    padding: 0 16px;
    margin-bottom: 15px;
    .t-box {
      width: 100%;
      height: 4.34rem;
      background-size: cover;
      background-position: center;
      padding: 20px;
    }
    .assets-t-title {
      display: flex;
      justify-content: space-between;
      .assets-all {
        color: #FFF;
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 30px;
        margin-right: 17px;
      }
      .eye-o {
        font-size: 14px;
        line-height: 30px;
        color: white;
        font-weight: 600;
      }
      .assets-account-button {
        width: 98px;
        height: 30px;
        border-radius: 15px;
        background: #FFF;
        color: #000;
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 30px;
      }
    }
    .assets-price {
      color: #FFF;
      font-size: 34px;
      font-style: normal;
      font-weight: 400;
      line-height: 48px;
      margin-bottom: 10px;
      margin-top: 20px;
    }
    .assets-b {
      flex: 1;
      position: relative;
      .r-line {
        width: 1px;
        height: 22px;
        background-color: #ffffff;
        position: absolute;
        right: 0px;
        top: 5px;
      }
      .assets-t {
        color: #FFF;
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
      }
      .assets-p {
        color: #FFF;
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
      }
    }
    .assets-dj {
      text-align: right;
      color: #FFF;
      text-align: right;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      margin-top: 3px;
    }
  }
  .assets-m-box {
    display: flex;
    justify-content: space-between;
    padding: 0 16px;
    margin-bottom: 23px;
    .assets-s-box {
      width: 104px;
      height: 100px;
      background-size: cover;
      background-position: center;
      padding: 10px;
      .assets-s-box-text {
        color: #FFF;
        text-align: right;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
      }
      .assets-s-box-p {
        color: #FFF;
        text-align: right;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
      }
      .assets-s-box-img {
        width: 35px!important;
        height: 35px!important;
        margin-bottom: 21px;
      }
    }
  }
  .assets-b-box {
    padding: 0 16px;
    .assets-b-box-b {
      height: 59px;
      border-bottom: 1px solid #eaeaea;
      display: flex;
      line-height: 59px;
      justify-content:space-between;
    }
    .assets-b-box-b-t {
      color: #061023;
      text-align: center;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
    }
    .assets-b-box-b-p {
      color: #061023;
      text-align: center;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
    }
  }
  .assets-right-div {
    display: flex;
    .assets-right-i-div {
      width: 62px;
      height: 59px;
      color: #FFF;
      text-align: center;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      .assets-right-i-div-img {
        width: 22px!important;
        height: 22px!important;
        display: block;
        margin: auto;
        margin-top: 10px;
        margin-bottom: 2px;
      }
    }
    .assets-right-div-left-box {
      background-color: white; 
      width: 26px;
      height: 59px;
      border-bottom: 1px solid #eaeaea;
    }
  }
}
</style>
