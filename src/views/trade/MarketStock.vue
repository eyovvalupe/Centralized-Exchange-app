<template>
  <div class="opentrade">
    <div ref="placeholder" class="placeholder"></div>

    <!-- <div> -->
    <div
      ref="stickyElement"
      :class="{ fixed: isFixed }"
      class="opentrade-sticky"
    >
      <div class="opentrade-sticky">
        <img src="/static/img/trade/open.png" alt="" class="open-img" />
        <div
          style="
            padding-left: 0.7rem;
            padding-right: 0.3rem;
            background-color: white;
          "
        >
          <Tabs
            class="tabs"
            v-model:active="active"
            :swipeable="false"
            :color="'#014CFA'"
            shrink
            @change="onChange"
          >
            <Tab title="开仓"> </Tab>
            <Tab title="持仓"> </Tab>
            <Tab title="查询"> </Tab>
          </Tabs>
        </div>

        <div class="risk-box" v-if="active !== 2">
          <img src="/static/img/trade/risk.png" alt="" class="risk-img" />
          <span>风险线</span>
        </div>

        <div class="date-risk-box" v-if="active === 2">
          <img src="/static/img/trade/risk.png" alt="" class="date-risk-img" />
          <span>风险线</span>
        </div>

        <div class="date-box" v-if="active === 2" @click="goToDate">
          <img src="/static/img/trade/time.png" alt="" class="date-img" />
          <span>日期</span>
        </div>
      </div>
    </div>
    <!-- </div> -->

    <Loading v-if="loading"></Loading>

    <!-- 持仓 -->
    <!-- 已登录 -->
    <div v-if="active === 1 && !loading && token">
      <div class="header-grid">
        <div style="padding: 0 0.3rem; display: flex" class="bottom-grid">
          <div class="header-f-left">股票/状态</div>
          <div>开仓/可售</div>
          <div>现价/成本</div>
          <div class="header-f-right">盈亏/盈亏比</div>
        </div>
      </div>

      <div v-for="i in 12" :key="i">
        <SwipeCell>
          <div class="content-grid grid-item-hover" @click="showButton(i)">
            <div style="padding: 0 0.3rem; display: flex">
              <div class="grid-item">
                <div class="f-text f-weight f-left" style="font-weight: 500">
                  HADCRXO
                </div>
                <div class="f-left" style="display: flex">
                  <div style="line-height: 0.4rem">10X</div>
                  <div class="close-button" v-if="i === 1 || i === 3">锁仓</div>
                </div>
              </div>
              <div class="grid-item">
                <div class="f-text button">买涨</div>
                <div class="special-color">1000</div>
              </div>
              <div class="grid-item">
                <div class="f-text">21.970</div>
                <div>29.999</div>
              </div>
              <div class="grid-item">
                <div class="f-text f-weight red">39.520</div>
                <div class="f-weight red">-0.7%</div>
              </div>
            </div>
          </div>
          <!-- <div v-if="currentNum === i && buttonShow" class="button-show">
              <div style="background: #F7931F;" @click="showDetailPopup(i)">
                  <img src="/static/img/trade/detail.png" alt="">
                  订单详情
                </div>
                <div style="background-color: #627eea;" @click="updateDetailPopup(i)">
                  <img src="/static/img/trade/update.png" alt="">
                  更新
                </div>
                <div style="background-color: #014cfa;" @click="updateClosePositionPopup">
                  <img src="/static/img/trade/close.png" alt="">
                  平仓
                </div>
            </div> -->
          <template #right>
            <div class="button-style">
              <div style="background: #f7931f" @click="showDetailPopup">
                <img src="/static/img/trade/detail.png" alt="" />
                订单详情
              </div>
              <div style="background-color: #627eea" @click="updateDetailPopup">
                <img src="/static/img/trade/update.png" alt="" />
                更新
              </div>
              <div
                style="background-color: #014cfa"
                @click="updateClosePositionPopup"
              >
                <img src="/static/img/trade/close.png" alt="" />
                平仓
              </div>
            </div>
          </template>
        </SwipeCell>
      </div>
    </div>

    <!-- 未登录 -->
    <div class="no-data-box" v-if="!token && active === 1">
      <img src="/static/img/trade/no-data.png" class="no-data-img">
      <p class="no-data-text">还未登录账号？<span style="color: #014cfa;cursor: pointer;" @click="jump('login')">马上登录</span></p>
    </div>




    <!-- 开仓 -->
    <OpenPosition v-if="active === 0 && !loading" />


    <!-- 查询 -->
    <div v-if="active === 2 && !loading">
      <div class="header-grid">
        <div style="padding: 0 0.3rem; display: flex" class="bottom-grid">
          <div class="header-f-left">股票/状态</div>
          <div>开仓/可售</div>
          <div>现价/成本</div>
          <div class="header-f-right">盈亏/盈亏比</div>
        </div>
      </div>

      <div v-for="i in 3" :key="i">
        <SwipeCell>
          <div
            class="content-grid grid-item-hover"
            @click="showInquiryButton(i)"
          >
            <div style="padding: 0 0.3rem; display: flex">
              <div class="grid-item">
                <div class="f-text f-weight f-left" style="font-weight: 500">
                  HADCRXO
                </div>
                <div class="f-left" style="display: flex">
                  <div style="line-height: 0.4rem">10X</div>
                  <div class="close-button" v-if="i === 1 || i === 3">锁仓</div>
                </div>
              </div>
              <div class="grid-item">
                <div class="f-text button">买涨</div>
                <div class="special-color">1000</div>
              </div>
              <div class="grid-item">
                <div class="f-text">21.970</div>
                <div>29.999</div>
              </div>
              <div class="grid-item">
                <div class="f-text f-weight red">39.520</div>
                <div class="f-weight red">-0.7%</div>
              </div>
            </div>
          </div>
          <!-- <div v-if="currentInquiryNum === i && buttonInquiryShow" class="button-show">
              <div style="background: #F7931F;" @click="showDetailPopup(i)">
                  <img src="/static/img/trade/detail.png" alt="">
                  订单详情
                </div>
                <div style="background-color: #627eea;" @click="updateDetailPopup">
                  <img src="/static/img/trade/update.png" alt="">
                  更新
                </div>
                <div style="background-color: #014cfa;" @click="updateClosePositionPopup">
                  <img src="/static/img/trade/close.png" alt="">
                  平仓
                </div>
            </div> -->
          <template #right>
            <div class="button-style">
              <div style="background: #f7931f" @click="showDetailPopup">
                <img src="/static/img/trade/detail.png" alt="" />
                订单详情
              </div>
              <div style="background-color: #627eea" @click="updateDetailPopup">
                <img src="/static/img/trade/update.png" alt="" />
                更新
              </div>
              <div
                style="background-color: #014cfa"
                @click="updateClosePositionPopup"
              >
                <img src="/static/img/trade/close.png" alt="" />
                平仓
              </div>
            </div>
          </template>
        </SwipeCell>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  Tab,
  Tabs,
  Grid,
  GridItem,
  SwipeCell,
  Sticky,
  Loading,
  Button,
} from "vant";
import { defineEmits, onMounted } from "vue";
import OpenPosition from "./OpenPosition.vue";
import { useRouter, useRoute } from "vue-router";
import { useSocket } from "@/utils/ws";
import store from "@/store";
import { _stocksList } from "@/api/api"

const token = computed(() => store.state.token);
const { startSocket } = useSocket();
let socket = null;
const active = ref(1);

const route = useRoute();
if (route.query.type === "date") {
  active.value = 2;
}

const emit = defineEmits(["update"]);
const buttonShow = ref(false);
const buttonInquiryShow = ref(false);
const currentNum = ref(null);
const currentInquiryNum = ref(null);
const loading = ref(false);

const isFixed = ref(false);
const stickyElement = ref(null);

window.onscroll = () => {
  if (stickyElement.value) {
    const scrollY = window.scrollY;
    const stickyRect = stickyElement.value.getBoundingClientRect();
    isFixed.value = true;
    stickyElement.value.style.top = `0px`;
  }
};

const router = useRouter();
const goToDate = () => {
  router.push({ name: "date" });
};

const showDetailPopup = () => {
  emit("update");
};

const updateDetailPopup = () => {
  emit("updateDetail");
};

const updateClosePositionPopup = () => {
  emit("updateClosePosition");
};

const subscribeOrders = () => {
  // socket = startSocket(() => {
    //这里是 stocksorder 的处理
    // console.log(token)
    // socket.emit('user', token.value)
    // socket.emit('user', token.value)
    // socket.emit('stocksorder','#all')
    // socket.emit('stocksorder', JSON.stringify({token: token.value, subscribe: '#all'}))
    // socket.on('stocksorder', res => {
    //   console.log(res)
    // })
    //这里是参考 realtime 的处理
    // ------------------
    // socket.emit('realtime','INFY,HDFCBANK,RELIANCE,HAL,BAJFINANCE,SBIN,LT,IDEA,ICICIBANK,M_M,TCS,WIPRO,BHARTIARTL,ARE_M,BEL,RECLTD,PFC,ADANIENT,TATAMOTORS,TATASTEEL,ITC,POWERGRID,IRB,HINDUNILVR,RVNL,AXISBANK,BHEL,MAZDOCK,INDIGO,NHPC,NTPC,COCHINSHIP,HCLTECH,AVANTIFEED,ADANIPORTS,KOTAKBANK,JIOFIN,TECHM,IRFC,IIFL,TITAN,GAIL,COFORGE,TATAPOWER,ADANIENSOL,BPCL,SAIL,ADANIPOWER,GESHIP,ZOMATO,HERITGFOOD,DIXON,APLAPOLLO,INDUSINDBK,ONGC,EXIDEIND,IOC,BANKBARODA,VEDL,NCC,SUNPHARMA,BSOFT,HUDCO,LTIM,BIOCON,HINDALCO,MOTHERSON,CANBK,ASIANPAINT,BDL,DRREDDY,MASTEK,BAJAJFINSV,HINDPETRO,UNOMINDA,MANKIND,COALINDIA,KNRCON,ABFRL,PRAJIND,PERSISTENT,INDUSTOWER,TEJASNET,GRSE,DLF,IREDA,HEROMOTOCO,LTTS,PNB,YESBANK,ABCAPITAL,DABUR,JSWSTEEL,MPHASIS,JBMA,VBL,ADANIGREEN,ASHOKLEY,PAYTM,RAMCOCEM,NIFTY50,SENSEX,LRGCAP,MIDCAP,SMLCAP,NIFTY500,NIFTYMIDCAP100,INDIAVIX,NIFTYBANK')
    // socket.on('realtime', res => {
    //   console.log(res)
    // })
  // });
};


// 获取列表数据
const getData = () => {
  // _stocksList({
  //   page: 1
  // }).then(res => {
  //   console.log(res,'res')
  // })
}

const onChange = (val) => {
  if (Object.keys(route.query).length > 0) {
    router.push({ path: route.path, query: {} });
  }
  active.value = val;
  
  if (token.value === '') {
    loading.value = false;
    return
  }

  loading.value = true;

  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const showButton = (i) => {
  if (currentNum.value === i) {
    buttonShow.value = !buttonShow.value;
  } else {
    buttonShow.value = true;
  }
  currentNum.value = i;
};

const showInquiryButton = (i) => {
  if (currentInquiryNum.value === i) {
    buttonInquiryShow.value = !buttonInquiryShow.value;
  } else {
    buttonInquiryShow.value = true;
  }
  currentInquiryNum.value = i;
};

onMounted(() => {
  if (token.value === '') {
    loading.value = false;
    return
  }
  loading.value = true;
  getData()
  setTimeout(() => {
    loading.value = false;
  }, 1000);

  subscribeOrders();
});

const jump = (name) => {
  router.push({
    name,
  });
};

</script>

<style lang="less">
.opentrade {
  .opentrade-sticky {
    width: 100%;
    background-color: white;
    z-index: 1000;
    transition: all 0.1s ease;
  }
  .fixed {
    position: fixed;
    width: 100%;
  }
  .van-loading {
    left: 47%;
    margin-top: 2rem !important;
  }
  .header-grid {
    padding-bottom: 0.12rem;
    background: white;
    border-bottom: 0.02rem solid #e8e8e8;
    .bottom-grid div {
      color: #9ea3ae;
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
    background: #e5e5e5 !important;
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
      color: #18b762;
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
    top: 0rem;
    right: 0.3rem;
    .risk-img {
      width: 0.52rem !important;
      height: 0.52rem !important;
      margin-right: 0.08rem;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      color: #0953fa;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 400;
    }
  }
  .date-risk-box {
    position: absolute;
    top: 0rem;
    right: 1.6rem;
    .date-risk-img {
      width: 0.52rem !important;
      height: 0.52rem !important;
      margin-right: 0.08rem;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      color: #0953fa;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 400;
    }
  }
  .date-box {
    position: absolute;
    top: 0rem;
    right: 0.3rem;
    .date-img {
      width: 0.52rem !important;
      height: 0.52rem !important;
      margin-right: 0.08rem;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      color: #0953fa;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 400;
    }
  }
  .button-style {
    div {
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
      height: 0.88rem;

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
      font-size: 0.28rem;
    }
    .van-tab:first-of-type {
      margin-left: 0.15rem;
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
      color: #fff;
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
  .opentrade-sticky-wrapper {
    position: relative;
    width: 100%;
  }
  .opentrade-sticky {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    width: 100%;
    background-color: white;
    z-index: 1000;
  }
}

.no-data-box {
  position: relative;
  .no-data-img {
    width: 211px!important;
    height: 108px!important;
    position: absolute;
    top: 140px;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
  .no-data-text {
    color: #a5afba;
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    position: absolute;
    top: 250px;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
}
</style>
