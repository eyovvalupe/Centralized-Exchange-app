<template>
    <main class="trade">
        <div class="header">
          <div class="title">
            交易
          </div>
          <div class="value" @click="showPopup">
            <img src="/static/img/trade/value.png" alt="" class="value-img">
            <span style="vertical-align: middle;">持仓价值</span>
          </div>
        </div>

        <Tabs v-model:active="active" type="line" animated @change="onChange" >
        <Tab title="股票">
          <img src="/static/img/trade/open.png" alt="" class="open-img">
          <MarketStock @update="handleUpdate"/>
        </Tab>
        <Tab title="IPO">
          IPO
          <!-- <MarketIPO /> -->
        </Tab>
      </Tabs>

      <Popup v-model:show="show" position="top" class="trade-popup">
        <div class="popup-title">
          交易
        </div>
        <div class="total-value">
          总持仓价值
        </div>
        <div class="num">
          98148.56
        </div>
        <div class="popup-flex">
          <div class="flex-box">
            <div class="t-flex">
              持仓收益
            </div>
            <div class="b-num">
              +4578.25
            </div>
          </div>
          <div class="flex-box">
            <div class="t-flex">
              持仓收益率
            </div>
            <div class="b-num">
              +48.23%
            </div>
          </div>
        </div>
      </Popup>


      <Popup
        v-model:show="showBottom"
        position="bottom"
        closeable
        class="detail-box"
        :style="{ height: '80%' }"
      >
      <OrderDetail/>
    </Popup>

    </main>
  </template>
  
  <script setup>
    import { ref } from "vue";
    import { Tab, Tabs, Popup } from 'vant';
    import MarketStock from './MarketStock.vue'
    import OrderDetail from './OrderDetail.vue'

    const active =ref(0)
    const show = ref(false)
    const showBottom = ref(false)

    const handleUpdate = (data) => {
      showDetailPopup()
    };

    const showDetailPopup = () => {
      showBottom.value = true;
    }

    const showPopup = () => {
      show.value = true;
    }

    const onChange = (val) => {
      active.value = val
    }
  
  </script>
  
  <style lang="less">
    .trade {
      padding: 0 16px;
        .header{
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
        }
        .title {
          color: #0D0D12;
          font-size: 28px;
          font-style: normal;
          font-weight: 600;
          line-height: 25px;
          padding: 15px 0px;
          flex: 1;
        }
        .value {
          color: #0953FA;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          flex: 1;
          padding: 18px 0px;
          text-align: right;
        }
        .value-img {
          width: 26px !important;
          height: 26px !important;
          vertical-align: middle;
        }
        .van-tab {
          width: 96.282px;
          height: 36px;
          flex-shrink: 0;
          border-radius: 24px;
          flex:none;
          color: #061023;
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          line-height: 25px;
        }
        .van-tab--active {
          background: #F6F8FF;
          color: #014CFA;
          text-align: center;
          font-size: 16px;
          font-style: normal;
          font-weight: 600;
          line-height: 24px;
        }
        .van-tabs__line {
          height: 0;
        }
        .open-img {
          width: 17px !important;
          height: 17px !important;
          position: absolute;
          top: 13px;
          z-index: 99;
        }
    }

    .trade-popup {
      min-height: 220px;
      padding: 0 16px;
      .popup-title {
        color: #0D0D12;
        font-size: 28px;
        font-style: normal;
        font-weight: 600;
        line-height: 25px;
        padding-top: 15px;
        margin-bottom: 16px;
      }
      .total-value {
        color: #061023;
        text-align: center;
        font-size: 18px;
        font-style: normal;
        font-weight: 400;
        line-height: 15px;
      }
      .num {
        color: #061023;
        text-align: center;
        font-size: 30px;
        font-style: normal;
        font-weight: 600;
        line-height: 15px;
        margin-top: 24px;
        margin-bottom: 30px;
      }
      .popup-flex {
        display: flex;
        .flex-box {
          flex: 1;
          text-align: center;
        }
        .t-flex {
          color: #333;
          text-align: center;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 15px;
          margin-bottom: 10px;
        }
        .b-num {
          color: #333;
          text-align: center;
          font-size: 16px;
          font-style: normal;
          font-weight: 600;
          line-height: 15px;
        }
      }
    }

    .detail-box {
      border-radius: 18px;
    }
  
  </style>