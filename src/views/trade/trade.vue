<template>
  <div class="trade">
    <div class="header">
      <div class="title">交易</div>
      <div class="value" @click="showPopup">
        <img src="/static/img/trade/value.png" alt="" class="value-img" />
        <span style="vertical-align: middle">持仓价值</span>
      </div>
    </div>

     <!--  tabs-->
     <div class="trade-recommend_tabs">
        <div class="trade-recommend_tab" :class="{ 'active_tab': active == 0 }" @click="onChange(0)">股票</div>
        <div class="trade-recommend_tab" :class="{ 'active_tab': active == 1 }" @click="onChange(1)">IPO</div>
    </div>

    <transition :name="'slide-right'">
        <MarketStock
          v-if="active === 0"
        />
        <div class="trade-tabs" v-else-if="active === 1" >
          <Tabs class="tabs" @change="ipoOnChange" v-model:active="ipoActive" :swipeable="false" animated
            :color="'#014CFA'" shrink>
            <Tab :title="'IPO'" class="optional">
              <IPO :type="'trade'"/>
            </Tab>
            <Tab :title="'中签'">
                <IPOStock />
            </Tab>
        </Tabs>
        </div>
    </transition>


    <Popup v-model:show="show" position="top" class="trade-popup">
      <div class="popup-title">交易</div>
      <div class="total-value">总持仓价值</div>
      <div class="num">98148.56</div>
      <div class="popup-flex">
        <div class="flex-box">
          <div class="t-flex">持仓收益</div>
          <div class="b-num">+4578.25</div>
        </div>
        <div class="flex-box">
          <div class="t-flex">持仓收益率</div>
          <div class="b-num">+48.23%</div>
        </div>
      </div>
    </Popup>


    <teleport to="body">
      <Popup v-model:show="showOpenPositionBottom" position="bottom" closeable :style="{ height: popupHeight }"
        :class="['detail-popup', { keypadding: keyborader }]" @close="closePopup" v-if="showOpenPositionBottom">
        <component :is="popupComponent" />
      </Popup>
    </teleport>

  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Tab, Tabs, Popup, Sticky } from "vant";
import MarketStock from "./MarketStock.vue";
import IPOStock from "./IPOStock.vue";
import { useRouter, useRoute } from "vue-router";
import IPO from "../Market/components/IPO.vue"
import store from "@/store";

const token = computed(() => store.state.token);

const active = ref(0);
const ipoActive = ref(0);
const route = useRoute();
const router = useRouter();
if (route.query.type === "ipodetail") {
  active.value = 1;
}

const show = ref(false);
const showBottom = ref(false);
const showUpdateBottom = ref(false);
const showClosePositionBottom = ref(false);


const showPopup = () => {
  show.value = true;
};

const onChange = (val) => {
  if (Object.keys(route.query).length > 0) {
    router.push({ path: route.path, query: {} });
  }
  active.value = val;
};

const ipoOnChange = (val)=>{
  ipoActive.value = val
}


//弹窗组件
const showOpenPositionBottom = computed(() => store.state.showOpenPositionBottom)
const popupHeight = computed(() => store.state.popupHeight)
const popupComponent = computed(() => store.state.popupComponent)
const keyborader = computed(() => store.state.keyborader)
const closePopup = () => {
  store.dispatch('closePopup')
}

</script>

<style lang="less">
.trade {
  position: relative;
  padding-bottom: 1.4rem;
  min-height: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.28rem;
    padding: 0 0.3rem;
  }
  .trade-recommend_tabs {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: .32rem;
      padding: 0 0.3rem;

      .trade-recommend_tab {
          font-size: 0.28rem;
          color: #061023;
          padding: 0 0.4rem;
          height: 0.6rem;
          border-radius: 0.48rem;
          display: flex;
          align-items: center;
          cursor: pointer;
      }

      .active_tab {
          color: #014CFA;
          background-color: #F6F8FF;
      }
  }
  .title {
    height: 1.12rem;
    color: #0d0d12;
    font-size: 0.56rem;
    font-weight: 600;
    line-height: 1.12rem;
  }
  .value {
    color: #0953fa;
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
    top: 0.18rem;
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
        flex: none;
        color: #061023;
        font-size: 0.32rem;
        font-style: normal;
        font-weight: 500;
        line-height: 0.5rem;
        padding: 0;
      }
      > .van-tab--active {
        background: #f6f8ff;
        color: #014cfa;
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
  .trade-tabs {
    background: white;
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
                content: '';
                width: 100%;
                height: 1px;
                background-color: #3B82F6;
                position: absolute;
                bottom: 16px;
                left: 0;
                opacity: 0.3;
            }
        }

        .van-tab {
            margin-left: 0.36rem;
        }
        .van-tab:first-of-type {
          margin-left: 0.1rem;
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

@media (min-width: 751px) {
  .trade-popup {
    max-width: 375px;
    position: absolute!important;
  }
}

.trade-popup {
  min-height: 4.4rem;
  padding: 0 0.32rem;
  .popup-title {
    color: #0d0d12;
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

.detail-popup {
  border-top-left-radius: 0.36rem;
  border-top-right-radius: 0.36rem;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding-bottom: 1.2rem;
}

.keypadding {
  padding-bottom: 5rem !important;
}

@media (min-width: 751px) {
  .detail-popup {
    max-width: 375px;
    position: fixed !important;
    padding-bottom: 3rem !important;
    left: 50% !important;
    transform: translateX(-50%);
  }
}
</style>
