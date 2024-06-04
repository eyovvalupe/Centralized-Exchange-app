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

      <Tabs v-model:active="active" type="line" animated @change="onChange" class="stock-tab">
        <Tab title="股票">
        </Tab>
        <Tab title="IPO">
          IPO
        </Tab>
      </Tabs>


      <MarketStock @update="handleUpdate" v-if="active === 0"/>

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
  import { Tab, Tabs, Popup, Sticky } from 'vant';
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
    position: relative;
      .header{
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.28rem;
        padding: 0 0.3rem;
      }
      .title {
        height: 1.12rem;
        color: #0D0D12;
        font-size: 0.56rem;
        font-weight: 600;
        line-height: 1.12rem;
      }
      .value {
        color: #0953FA;
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        flex: 1;
        height: 1.12rem;
        line-height: 1.12rem;
        text-align: right;
      }
      .value-img {
        width: 0.52rem !important;
        height: 0.52rem !important;
        vertical-align: middle;
        margin-right: 0.08rem;
      }
      .open-img {
        width: 0.34rem !important;
        height: 0.34rem !important;
        position: absolute;
        top: 2.43rem;
        z-index: 99;
        left: 0.3rem;
      }
      .stock-tab {
        .van-tabs__nav--line {
          padding-bottom: 0.32rem;
        }
        .van-tabs__wrap {
          height: 0.88rem;
          padding: 0 0.3rem;
        }
        > .van-tabs__wrap > .van-tabs__nav {
            > .van-tab {
            width: 1.9rem;
            height: 0.72rem;
            flex-shrink: 0;
            border-radius: 0.48rem;
            flex:none;
            color: #061023;
            font-size: 0.32rem;
            font-style: normal;
            font-weight: 500;
            line-height: 0.5rem;
            padding: 0;
          }
          > .van-tab--active {
            background: #F6F8FF;
            color: #014CFA;
            text-align: center;
            font-size: 0.32rem;
            font-style: normal;
            font-weight: 600;
            line-height: 0.48rem;
          }
          > .van-tabs__line {
            height: 0;
          }
        }
       
      }
  }

  @media (min-width: 751px) {
    .trade-popup {
        max-width: 375px;
        position: absolute;
    }
}

  .trade-popup {
    min-height: 4.4rem;
    padding: 0 0.32rem;
    .popup-title {
      color: #0D0D12;
      font-size: 0.56rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.5rem;
      padding-top: 0.3rem;
      margin-bottom: 0.32rem;
    }
    .total-value {
      color: #061023;
      text-align: center;
      font-size: 0.36rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.3rem;
    }
    .num {
      color: #061023;
      text-align: center;
      font-size: 0.6rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.3rem;
      margin-top: 0.48rem;
      margin-bottom: 0.6rem;
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
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.3rem;
        margin-bottom: 0.2rem;
      }
      .b-num {
        color: #333;
        text-align: center;
        font-size: 0.32rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.3rem;
      }
    }
  }

  .detail-box {
    border-radius: 10.16rem;
  }

</style>