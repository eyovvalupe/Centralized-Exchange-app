<template>
    <div class="opentrade">
        <Tabs v-model:active="active" type="line" animated @change="onChange" border >
        <Tab title="开仓">
          开仓
        </Tab>
        <Tab title="持仓">
          <Grid :border="false" class="header-grid">
            <GridItem text="股票/状态"></GridItem>
            <GridItem text="开仓/可售"></GridItem>
            <GridItem text="现价/成本"></GridItem>
            <GridItem text="盈亏/盈亏比"></GridItem>
          </Grid>

          <div v-for="i in 4" :key="i">
            <SwipeCell>
              <Grid :border="false" class="content-grid">
              <GridItem>
                <div class="f-text f-weight">
                  HADCRXO
                </div>
                <div>
                  10X
                </div>
              </GridItem>
              <GridItem>
                <div class="f-text button">
                  买涨
                </div>
                <div class="special-color">
                  1000
                </div>
              </GridItem>
              <GridItem>
                <div class="f-text">
                  21.970
                </div>
                <div>
                  29.999
                </div>
              </GridItem>
              <GridItem>
                <div class="f-text f-weight red">
                  39.520
                </div>
                <div class="f-weight red">
                  -0.7%
                </div>
              </GridItem>
              </Grid>
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

          
        </Tab>
        <Tab title="查询">
            查询
        </Tab>
      </Tabs>
      <div class="risk-box">
        <img src="/static/img/trade/risk.png" alt="" class="risk-img">
        <span>风险线</span>
      </div>

    </div>
</template>

<script setup>
  import { ref } from "vue";
  import { Tab, Tabs, Grid, GridItem, SwipeCell } from 'vant';
  import { defineEmits } from 'vue';

  const active =ref(1)
  const emit = defineEmits(['update']);

  const showDetailPopup = () =>{
    emit('update');
  }

  const onChange = (val) => {
    active.value = val
  }

</script>

<style lang="less">
  .opentrade {
    .van-tab {
      width: 48px !important;
      height: 26px !important;
      flex-shrink: 0;
      color: #9EA3AE !important;
      text-align: center;
      font-size: 14px !important;
      font-style: normal;
      font-weight: 400 !important;
      line-height: 26px !important;
      border-radius: 0 !important;
      background-color: white !important;
    }
    .van-tab--active {
      color: #121826 !important;
      font-weight: 500 !important;
    }
    .van-tabs__line {
      height: 2px !important;
      background-color: #014cfa;
      bottom: 0;
    }
    .van-hairline--top-bottom:after {
      border-top: 0px;
      border-color: #3b82f6;
    }
    .van-tabs--line .van-tabs__wrap {
      margin-top: 5px;
      height: 26px;
      margin-left: 16px;
    }
    .van-tab__panel {
      margin-top: 15px;
    }
    .header-grid {
      .van-grid-item__text {
        color: #9EA3AE;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
      }
      .van-grid-item__content {
        padding: 0;
        padding-bottom: 6px;
        background: white;
        border-bottom: 1px solid #e8e8e8;
      }
    }
    .content-grid {
      .van-grid-item__content {
        border-bottom: 1px solid #e8e8e8;
        padding: 10px 0;
      }
      div {
        color: #000;
        text-align: center;
        font-family: "PingFang SC";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 15px;
      }
      .f-text {
        margin-bottom: 5px;
      }
      .button {
        height: 20px;
        color: #18B762;
        padding: 2px 15px;
        background-color: rgba(239, 249, 242);
      }
      .f-weight {
        font-weight: 600;
        font-size: 15px;
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
      top: 2px;
      right: 0;
      .risk-img {
        width: 26px !important;
        height: 26px !important;
        vertical-align: middle;
      } 
      span {
        vertical-align: middle;
        color: #0953FA;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
    }
    .button-style {
      div{
        width: 61px;
        height: 64px;
        flex-shrink: 0;
        color: white;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        text-align: center;
        display: inline-block;
        img {
          width: 20px !important;
          height: 20px !important;
          display: block;
          margin: auto;
          margin-top: 11px;
          margin-bottom: 7px;
        }
      }
    }
  }
</style>