<!-- 资产总览 -->
<template>
  <div class="assets_cash">
    <div class="assets-box">
      <div :style="backgroundImageStyle" class="t-box">
        <div class="assets-t-title">
          <div style="display: flex">
            <div class="assets-all">总资产</div>
            <Icon name="eye-o" class="eye-o" />
          </div>
        </div>

        <div class="assets-price">32,761.65</div>

        <div style="display: flex">
          <div class="assets-b">
            <div class="assets-t">冻结</div>
            <div class="assets-p">880,88.00</div>
          </div>

          <div class="assets-b">
            <div class="assets-t">借贷</div>
            <div class="assets-p">48,888.00</div>
          </div>
        </div>

        <div class="assets-dj">
          <div class="assets-dj-b" @click="topUp">
            <img src="/static/img/assets/cash-one.png" alt="" />
            <div style="line-height: 0.8rem">充值</div>
            <div class="r-line"></div>
          </div>
          <div class="assets-dj-b">
            <img src="/static/img/assets/cash-two.png" alt="" />
            <div>
              <div style="line-height: 0.4rem">提现</div>
              <div style="line-height: 0.4rem">192230.00</div>
              <div class="r-line"></div>
            </div>
          </div>
          <div class="assets-dj-b" @click="exchange">
            <img src="/static/img/assets/cash-three.png" alt="" />
            <div style="line-height: 0.8rem">兑换</div>
          </div>
        </div>
      </div>
    </div>

    <div class="assets-box-tab">
      <Tabs
        class="tabs"
        @change="changeTab"
        v-model:active="active"
        :swipeable="false"
        animated
        :color="'#014CFA'"
        shrink
      >
        <Tab :title="'余额'">
          <Balance />
        </Tab>
        <Tab :title="'充值记录'">
          <Record />
        </Tab>
        <Tab :title="'提现记录'">
          <Record />
        </Tab>
      </Tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Icon, SwipeCell, Tabs, Tab } from "vant";
import Balance from "./Balance.vue";
import Record from "./Record.vue";
import QuickExchange from "./QuickExchange.vue";
import { useRouter, useRoute } from 'vue-router';

const backgroundImageStyle = computed(() => ({
  backgroundImage: `url(/static/img/assets/cash.png)`,
}));

const active = ref(0);
const router = useRouter();

const changeTab = (val) => {
  active.value = val;
};

const exchange = ()=>{
  router.push({ name: 'exchange'});
}
const topUp = ()=>{
  router.push({ name: 'loan'});
}
</script>

<style lang="less">
.assets_cash {
  .assets-box {
    padding: 0 0.32rem;
    margin-bottom: 0.4rem;

    .t-box {
      width: 100%;
      height: 4.28rem;
      background-size: cover;
      background-position: center;
      padding: 0.24rem 0.26rem;
    }

    .assets-t-title {
      display: flex;
      justify-content: space-between;

      .assets-all {
        color: #fff;
        text-align: center;
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.6rem;
        margin-right: 0.34rem;
      }

      .eye-o {
        font-size: 0.28rem;
        line-height: 0.6rem;
        color: white;
        font-weight: 600;
      }

      .assets-account-button {
        width: 1.96rem;
        height: 0.6rem;
        border-radius: 0.3rem;
        background: #fff;
        color: #000;
        text-align: center;
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.6rem;
      }
    }

    .assets-price {
      color: #fff;
      font-size: 0.68rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.96rem;
    }

    .assets-b {
      flex: 1;
      position: relative;

      .assets-t {
        color: #fff;
        text-align: center;
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.48rem;
      }

      .assets-p {
        color: #fff;
        text-align: center;
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.48rem;
      }
    }

    .assets-dj {
      display: flex;
      justify-content: space-between;
      margin-top: 0.2rem;
      border-top: 0.02rem solid rgba(255, 255, 255, 0.6);
      .assets-dj-b {
        display: flex;
        padding-top: 0.2rem;
        position: relative;
        img {
          width: 0.8rem !important;
          height: 0.8rem !important;
        }
        > div {
          color: #fff;
          text-align: center;
          font-size: 0.28rem;
          font-style: normal;
          font-weight: 400;
          margin-left: 0.2rem;
        }
        .r-line {
          position: absolute;
          right: -0.2rem;
          top: 0.36rem;
          width: 0.02rem;
          height: 0.48rem;
          background-color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }
  .assets-box-tab {
    .tabs {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      .van-tabs__wrap {
        padding: 0 0.32rem;
      }

      .van-tabs__nav {
        position: relative;

        &::after {
          content: "";
          width: 100%;
          height: 0.02rem;
          background-color: #3b82f6;
          position: absolute;
          bottom: 0.32rem;
          left: 0;
          opacity: 0.3;
        }
      }

      .van-tab {
        margin-left: 0.36rem;
      }

      .van-tabs__content {
        flex: 1;

        .van-swipe-item {
          overflow-y: auto;
          padding-bottom: 0.2rem;
        }
      }
    }
  }
}
</style>
