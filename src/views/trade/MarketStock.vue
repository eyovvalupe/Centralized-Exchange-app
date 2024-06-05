<template>
  <div class="opentrade">   

      <Sticky class="opentrade-sticky">
        <img src="/static/img/trade/open.png" alt="" class="open-img" :style="{ top: openHeaderTop }">
          <Tabs class="tabs" v-model:active="active" :swipeable="false" animated :color="'#014CFA'" shrink @change="onChange">
            <Tab title="开仓">
            </Tab>
            <Tab title="持仓">          
            </Tab>
            <Tab title="查询">
                查询
            </Tab>
          </Tabs>

        <div class="risk-box" :style="{ top: headerTop }">
          <img src="/static/img/trade/risk.png" alt="" class="risk-img">
          <span>风险线</span>
        </div> 
    </Sticky>

    <!-- 持仓 -->
    <div v-if="active === 1">
      <div class="header-grid">
          <div style="padding: 0 0.3rem; display: flex;" class="bottom-grid">
            <div class="header-f-left">股票/状态</div>
            <div>开仓/可售</div>
            <div>现价/成本</div>
            <div class="header-f-right">盈亏/盈亏比</div>
          </div>
        </div>

        <div v-for="i in 12" :key="i">
          <SwipeCell>
            <div class="content-grid grid-item-hover" @click="showButton(i)">
              <div style="padding: 0 0.3rem; display: flex;">
                <div class="grid-item">
                  <div class="f-text f-weight f-left" style="font-weight: 500;">
                    HADCRXO
                  </div>
                  <div class="f-left" style="display: flex;">
                    <div style="line-height: 0.4rem ">
                      10X
                    </div>
                    <div class="close-button" v-if="i === 1 || i === 3">
                      锁仓
                    </div>
                  </div>
                </div>
                <div class="grid-item">
                  <div class="f-text button">
                    买涨
                  </div>
                  <div class="special-color">
                    1000
                  </div>
                </div>
                <div class="grid-item">
                  <div class="f-text">
                    21.970
                  </div>
                  <div>
                    29.999
                  </div>
                </div>
                <div class="grid-item">
                  <div class="f-text f-weight red">
                    39.520
                  </div>
                  <div class="f-weight red">
                    -0.7%
                  </div>
                </div>
              </div>
            </div>
            <div v-if="currentNum === i && buttonShow" class="button-show">
              <div style="background: #F7931F;" @click="showDetailPopup(i)">
                  <img src="/static/img/trade/detail.png" alt="">
                  订单详情
                </div>
                <div style="background-color: #627eea;">
                  <img src="/static/img/trade/update.png" alt="">
                  更新
                </div>
                <div style="background-color: #014cfa;">
                  <img src="/static/img/trade/close.png" alt="">
                  平仓
                </div>
            </div>
            <template #right>
              <div class="button-style">
                <div style="background: #F7931F;" @click="showDetailPopup">
                  <img src="/static/img/trade/detail.png" alt="">
                  订单详情
                </div>
                <div style="background-color: #627eea;">
                  <img src="/static/img/trade/update.png" alt="">
                  更新
                </div>
                <div style="background-color: #014cfa;">
                  <img src="/static/img/trade/close.png" alt="">
                  平仓
                </div>
              </div>
            </template>
          </SwipeCell>
          
        </div>
    </div>

    <!-- 开仓 -->
    <OpenPosition v-if="active === 0"/>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { Tab, Tabs, Grid, GridItem, SwipeCell, Sticky } from 'vant';
import { defineEmits, onMounted } from 'vue';
import OpenPosition from './OpenPosition.vue'

const active =ref(1)
const emit = defineEmits(['update']);
const buttonShow = ref(false)
const currentNum = ref(null)

const headerTop = ref('2.25rem'); 
const openHeaderTop = ref('2.43rem'); 
let prevScrollPos = window.pageYOffset; 


window.onscroll = () => { 
  const currentScrollPos = window.pageYOffset; 
  if (currentScrollPos >= 115) {
    headerTop.value = '0px'; 
    openHeaderTop.value = '0.12rem'; 
  } else {
    headerTop.value = '2.25rem'; 
    openHeaderTop.value = '2.43rem'; 
  }
  prevScrollPos = currentScrollPos; 
}; 

const showDetailPopup = () =>{
  emit('update');
}

const onChange = (val) => {
  active.value = val
}

const showButton = (i) =>{
  if (currentNum.value === i) {
    buttonShow.value = !buttonShow.value
  } else {
    buttonShow.value = true
  }
  currentNum.value = i
}

</script>

<style lang="less">
.opentrade {
  .header-grid {
    padding-bottom: 0.12rem;
    background: white;
    border-bottom: 0.02rem solid #e8e8e8;
    .bottom-grid div {
      color: #9EA3AE;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.48rem;
      width: 25%;
      text-align: center;
    }
  }
  .header-f-left {
    text-align: left !important;
    width: 100%;
  }
  .header-f-right {
    text-align: right !important;
    width: 100%;
  }
  .grid-item-hover {
    background-color: white;
  }
  .grid-item-hover :hover {
    background: #E5E5E5 !important;
  }
  .content-grid {
    border-bottom: 0.02rem solid #e8e8e8;
    .grid-item {
      padding: 0.2rem 0;
      width: 25%;
    }
    div {
      color: #000;
      text-align: center;
      font-family: "PingFang SC";
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.3rem;
    }
    .f-text {
      margin-bottom: 0.1rem;
    }
    .f-left {
      text-align: left;
      width: 100%;
    }
    .button {
      height: 0.4rem;
      color: #18B762;
      padding: 0.04rem 0.3rem;
      background-color: rgba(239, 249, 242);
      width: 1.16rem;
      margin: auto;
      margin-bottom: 0.08rem;
    }
    .f-weight {
      font-weight: 600;
      font-size: 0.32rem;
    }
    .special-color {
      color: #014cfa;
    }
    .red {
      color: #e8503a;
    }
  }
  .risk-box {
    position: absolute;
    top: 2.25rem;
    right: 0.3rem;
    .risk-img {
      width: 0.52rem !important;
      height: 0.52rem !important;
      margin-right: 0.08rem;
      vertical-align: middle;
    } 
    span {
      vertical-align: middle;
      color: #0953FA;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 400;
    }
  }
  .button-style {
    div{
      width: 1.22rem;
      height: 1.28rem;
      flex-shrink: 0;
      color: white;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 500;
      text-align: center;
      display: inline-block;
      img {
        width: 0.4rem !important;
        height: 0.4rem !important;
        display: block;
        margin: auto;
        margin-top: 0.22rem;
        margin-bottom: 0.14rem;
      }
    }
  }
  .tabs {
      flex: 1;
      display: flex;
      flex-direction: column;

      .van-tabs__nav {
        position: absolute;
        width: 100%;
        left: 0px;

          &::after {
              content: '';
              width: 100%;
              height: 0.02rem;
              background-color: #3B82F6;
              position: absolute;
              bottom: 0.32rem;
              left: 0;
              opacity: 0.3;
          }
      }

      .van-tab {
          margin-left: 0.36rem;
          font-size: 0.28rem;
      }
      .van-tab:first-of-type {
        margin-left: 0.72rem;
      }

      .van-tabs__content {
          flex: 1;

          .van-swipe-item {
              padding-bottom: 0.2rem;
          }
      }

      .van-tabs__wrap {
        height: 0.88rem;
      }
      .van-tabs__line {
        bottom: 0.3rem;
      }
      .van-tabs__track {
        height: 0;
      } 
  }
  .close-button {
    margin-left: 0.26rem;
    background-color: #fdf8ef;
    color: #f89a29 !important;
    width: 0.76rem;
    height: 0.4rem;
    text-align: center;
    font-size: 0.24rem !important;
    font-style: normal;
    font-weight: 500 !important;
    line-height: 0.4rem !important;
    border-radius: 0 0.14rem 0 0.14rem;
  }
  .button-show {
    display: flex;
    div {
      flex: 1;
      height: 1.12rem !important;
      color: #FFF;
      text-align: left;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 500;
      line-height: 0.3rem;
      padding-left: 0.32rem;
      img {
        height: 0.4rem !important;
        margin-top: 0.22rem;
        width: 0.4rem !important;
        display: block;
        margin-bottom: 0.12rem;
      }
    }
  }
}
</style>