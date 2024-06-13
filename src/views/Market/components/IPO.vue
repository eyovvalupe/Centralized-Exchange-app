<!-- IPO -->
<template>
  <div class="market_ipo">
    <div class="market_ipo-all">
      <span>
        已上市
      </span>
      <img src="/static/img/trade/down.png" class="market_ipo-down-img"/>
    </div>

    <div class="market_ipo-box" v-for="i in 4" :key="i">

      <div class="market_ipo-box-header">
        <div class="market_ipo-box-header-title">Bharti Hexacom LIMITED IPO</div>
        <div class="market_ipo-box-header-button" v-if="i == 2" style="background: #333333;color: white;">预售中</div>
        <div class="market_ipo-box-header-button" v-if="i == 3" style="background: #ebebeb;color: #838383;">已结束</div>
        <div class="market_ipo-box-header-button" v-if="i == 1 || i ==4">认购中</div>
      </div>

      <div class="market_ipo-box-time" v-if="i == 2">
        <CountDown :time="time" >
          <template #default="timeData">
            <span class="block">{{ timeData.hours }}</span>
            <span class="colon">:</span>
            <span class="block">{{ timeData.minutes }}</span>
            <span class="colon">:</span>
            <span class="block">{{ timeData.seconds }}</span>
        </template>
        </CountDown>
      </div>

      <div class="market_ipo-m-box">
        <div>
          <div class="market_ipo-m-box-p">324.43 - 754.34</div>
          <div class="market_ipo-m-box-t">认购价格</div>
        </div>

        <div>
          <div class="market_ipo-m-box-p">04-25</div>
          <div class="market_ipo-m-box-t">
            认购日期
          </div>
        </div>

        <div>
          <div class="market_ipo-m-box-p">12344.00</div>
          <div class="market_ipo-m-box-t">上市价格</div>
        </div>
      </div>

      <div class="market_ipo-m-box-line"></div>

      <div class="market_ipo-b">
        <div class="market_ipo-b-detail" @click="opendetail">
          <span>详情</span>
          <Icon name="arrow" class="market_ipo-b-arrow"/>
        </div>
        <div class="market_ipo-b-detail-button" v-if="i == 3" style="background: #999999;color: white;">认购</div>
        <div class="market_ipo-b-detail-button" v-else>认购</div>
      </div>


    </div>

    

  </div>
</template>
<script setup>
import { Icon } from 'vant';
import { useRouter, useRoute } from 'vue-router';
import { CountDown } from 'vant';
import { ref } from "vue"

const router = useRouter();
const time = ref(30 * 60 * 60 * 1000);

const opendetail = ()=>{
  router.push({ name: 'ipodetail',query:{type:'market'} });
}

</script>

<style lang="less">
  .market_ipo {
    padding: 0 0.3rem;
    .market_ipo-all {
      width: 3.06rem;
      height: 0.72rem;
      border-radius: 0.48rem;
      background: #F6F8FF;
      padding: 0.16rem 0.3rem;
      display: flex;
      span{
        color: #014CFA;
        text-align: center;
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 500;
        line-height: 0.4rem;
        flex: 1;
      }
      .market_ipo-down-img {
        width: 0.32rem !important;
        height: 0.32rem !important;
        margin-top: 0.04rem !important;
      }
    }
    .market_ipo-box {
      border-bottom: 0.02rem solid #eaeaea;
      .market_ipo-box-header {
        display: flex;
        justify-content: space-between;
        padding-top: 0.28rem;
        .market_ipo-box-header-title {
          color: var(--Greyscale-900, #0D0D12);
          font-size: 0.32rem;
          font-style: normal;
          font-weight: 600;
          line-height: 0.48rem;
        }
        .market_ipo-box-header-button {
          width: 1.24rem;
          height: 0.48rem;
          background-color: #e5ecfa;
          color: #014CFA;
          text-align: center;
          font-size: 0.24rem;
          font-style: normal;
          font-weight: 500;
          line-height: 0.48rem;
          border-bottom-left-radius: 0.12rem;
          border-top-right-radius: 0.12rem;
        }
      }
      .market_ipo-m-box {
        display: flex;
        justify-content: space-between;
        margin-top: 0.28rem;
        .market_ipo-m-box-p {
          color: #014CFA;
          font-size: 0.32rem;
          font-style: normal;
          font-weight: 500;
          margin-bottom: 0.2rem;
        }
        .market_ipo-m-box-t {
          color: var(--Greyscale-400, #818898);
          font-size: 0.28rem;
          font-style: normal;
          font-weight: 400;
        }
      }
      .market_ipo-m-box-line {
        border-bottom: 0.02rem dashed #cbcbcb;
        margin-top: 0.2rem;
      }
      .market_ipo-b {
        display: flex;
        justify-content: right;
        padding: 0.2rem 0;
        .market_ipo-b-detail {
          margin-right: 0.5rem;
          cursor: pointer;
          span {
            color: #014CFA;
            font-size: 0.28rem;
            font-style: normal;
            font-weight: 400;
            line-height: 0.5rem;
            margin-right: 0.16rem;
          }
          .market_ipo-b-arrow {
            color: #014CFA;
            font-size: 0.28rem;
            line-height: 0.4rem;
          }
        }
        .market_ipo-b-detail-button {
          width: 1.26rem;
          height: 0.5rem;
          border-radius: 1.26rem;
          background: #014CFA;
          color: white;
          text-align: center;
          font-size: 0.28rem;
          font-style: normal;
          font-weight: 600;
          line-height: 0.5rem;
          cursor: pointer;
        }
      }
    }
    .market_ipo-box:last-of-type {
      border-bottom: 0px;
    }
    .market_ipo-box-time {
      display: flex;
      justify-content: right;
      margin-top: 0.14rem;
      .block {
        display: inline-block;
        width: 0.44rem;
        color: #fff;
        font-size: 0.24rem;
        text-align: center;
        background-color: #333333;
        border-radius: 0.06rem;
      }
      .colon {
        display: inline-block;
        margin: 0 0.08rem;
        color: #9798a7;
      }
    }
  }
</style>