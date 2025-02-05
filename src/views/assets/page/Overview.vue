<!-- 资产总览 -->
<template>
  <div class="page_assets_overview">
    <!-- 总览 -->
    <OverviewCard>
      <div class="flex flex-col items-center">
        <div class="top mt-[0.6rem]">
          <div class="title">{{ $t("home.totalAssets") }} <span>(USDT)</span></div>
          <div class="eyes" @click="click">
            <img v-lazy="getStaticImgUrl('/static/img/common/open_eye_white.svg')" v-show="!hidden" />
            <img v-lazy="getStaticImgUrl('/static/img/common/close_eye_white.svg')" v-show="hidden" />
          </div>
        </div>
        <div class="money">
          <span class="text-[0.48rem] font-semibold">{{
            hidden
              ? "********"
              : parseFloat(assets.total).toLocaleString() || "0"
          }}</span>
        </div>
        <div class="navs mb-[0.5rem]">
          <div class="nav bg-opacity-10">
            <div class="nav_label">{{ $t("assets.info_cash") }}</div>
            <div class="num">
              {{
                hidden
                  ? "********"
                  : parseFloat(assets.money).toLocaleString() || "0"
              }}
            </div>
          </div>
          <div class="nav bg-opacity-10">
            <div class="nav_label">{{ $t("assets.wallet_order_value") }}</div>
            <div class="num">
              {{ hidden ? "********" : assets.order_value || "0" }}
            </div>
          </div>
        </div>

        <!-- 按钮 -->
        <Btns :money="assets.money" />
      </div>
    </OverviewCard>


    <!-- 列表 -->
    <div class="tabs">
      <div ref="tab1" :key="1" class="tab" @click="jumpToWallet('0')">
        <div class="tab_icon">
          <div style="width: 0.32rem;height: 0.32rem;">
            <img v-lazy="getStaticImgUrl(`/static/img/assets/cash.svg`)" alt="">
          </div>
        </div>
        <div class="name">{{ $t("assets.over_view_cash") }}</div>
        <div class="amount" :class="hidden ? '!pt-[0.2rem]' : ''">
          {{ hidden ? '******' : (parseFloat(assets.money).toLocaleString() || "0") }}
        </div>
        <div class="more">
          <div style="width: 0.2rem;height: 0.32rem;">
            <img v-lazy="getStaticImgUrl(`/static/img/assets/right_arrow.svg`)" alt="">
          </div>
        </div>
      </div>
      <!-- <div ref="tab2" :key="2" class="tab" :class="{ open_tab: rightSwitch2 == true }" @click="jumpToWallet('1')">
        <div class="tab_icon">
          <div style="width: 0.36rem;height: 0.36rem;">
            <img v-lazy="getStaticImgUrl(`/static/img/assets/stock.svg`)" alt="">
          </div>
        </div>
        <div class="name">{{ $t("assets.over_view_stock") }}</div>
        <div class="amount" :class="hidden ? '!pt-[0.2rem]' : ''">
          {{
            hidden ? '******' : parseFloat(assets && assets.stock ? assets.stock : 0).toLocaleString()
          }}
        </div>
        <div class="more">
          <div style="width: 0.2rem;height: 0.32rem;">
            <img v-lazy="getStaticImgUrl(`/static/img/assets/right_arrow.svg`)" alt="">
          </div>
        </div>
      </div> -->
      <div ref="tab3" :key="3" class="tab" :class="{ open_tab: rightSwitch3 == true }" @click="jumpToWallet('2')">
        <div class="tab_icon">
          <div style="width: 0.28rem;height: 0.28rem;">
            <img v-lazy="getStaticImgUrl(`/static/img/assets/future.svg`)" alt="">
          </div>
        </div>
        <div class="name">{{ $t("assets.wallet_header_contract") }}</div>
        <div class="amount" :class="hidden ? '!pt-[0.2rem]' : ''">
          {{
            hidden ? '******' : parseFloat(assets && assets.futures ? assets.futures : 0).toLocaleString()
          }}
        </div>
        <div class="more">
          <div style="width: 0.2rem;height: 0.32rem;">
            <img v-lazy="getStaticImgUrl(`/static/img/assets/right_arrow.svg`)" alt="">
          </div>
        </div>
      </div>
    </div>

    <!-- 类型选择弹窗 -->
    <!-- <ActionSheet v-model:show="showAS" teleport="body" :actions="actions" :title="$t('记录列表')" @select="onSelect" /> -->
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { Icon, ActionSheet } from "vant";
import { ref, computed, onMounted } from "vue";
import { useClickAway } from "@vant/use";
import Decimal from "decimal.js";
import { useI18n } from "vue-i18n";
import { _assets } from "@/api/api";
import store from "@/store";
import router from "@/router";
import Btns from "./components/Btns";
import OverviewCard from "./components/OverviewCard.vue";

const { t } = useI18n();
const hintNum = computed(() => store.state.hintNum || 0);

const showAS = ref(false);
const actions = computed(() => {
  return [
    { name: t("充值记录"), value: "0" },
    { name: t("提现记录"), value: "1" },
    { name: t("划转记录"), value: "2" },
  ];
});
const onSelect = (item) => {
  showAS.value = false;
  router.push({
    name: "recordList",
    query: {
      tab: item.value,
    },
  });
};

const emits = defineEmits(["setLoading", "jumpToWallet"]);

const jumpToWallet = (val) => {
  emits('jumpToWallet', val)
}

const token = computed(() => store.state.token || "");
const hidden = ref(true); // 隐藏数字

const click = () => {
  hidden.value = !hidden.value
}

// 功能区域控制
const tab1 = ref();
const tab2 = ref();
const tab3 = ref();
const tab5 = ref();
const rightSwitch1 = ref(false);
const rightSwitch2 = ref(false);
const rightSwitch3 = ref(false);
const rightSwitch5 = ref(false);
useClickAway(tab1, () => {
  rightSwitch1.value = false;
});
useClickAway(tab2, () => {
  rightSwitch2.value = false;
});
useClickAway(tab3, () => {
  rightSwitch3.value = false;
});
useClickAway(tab5, () => {
  rightSwitch5.value = false;
});

// 刷新总资产
const assets = computed(() => store.state.assets || {});

const getAssets = () => {
  if (!token.value) return;
  store.dispatch("updateAssets").finally(() => {
    emits("setLoading", false);
  });
  store.dispatch("updateWallet");
};

const refresh = () => {
  getAssets();
};

defineExpose({
  refresh,
});

const jump = (name, check = false, query) => {
  router.push({
    name,
    query,
  });
};
</script>

<style lang="less" scoped>
.page_assets_overview {
  width: 7.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  .top {
    width: 100%;
    font-size: 0.32rem;
    font-weight: 500;
    display: flex;
    height: 0.32rem;
    align-items: start;
    line-height: 0.32rem;
    padding-left: 0.32rem;

    .title {
      color: var(--ex-text-color2);
      margin-right: 0.12rem;
      font-size: 0.3rem;
      line-height: 0.32rem;
      font-weight: 500;

      span {
        font-size: 0.24rem;
      }
    }

    .eyes {
      width: 0.32rem;
      height: 0.32rem;
      color: var(--ex-white);
    }
  }

  .money {
    width: 100%;
    color: var(--ex-white);
    font-family: "PingFang SC";
    font-size: 0.52rem;
    font-style: normal;
    font-weight: 600;
    line-height: 0.48rem;
    margin-top: 0.28rem;
    margin-bottom: 0.28rem;
    padding-left: 0.32rem;
  }

  .navs {
    display: flex;
    width: 100%;
    padding: 0 0.32rem;
    justify-content: space-between;

    .nav {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 3.27rem;
      height: 1.12rem;
      border-radius: 0.32rem;
      background-color: var(--ex-bg-white);
      // padding-top: 0.1rem;
    }

    .nav_label {
      color: var(--ex-text-color2);
      font-size: 0.28rem;
      line-height: 100%;
      margin-top: 0.1rem;
    }

    .num {
      color: var(--ex-white);
      font-size: 0.3rem;
      font-weight: 600;
      line-height: 0.3rem;
      margin-top: 0.2rem;
    }
  }

  .tabs {
    position: relative;
    width: 100%;
    padding: 0 0.32rem;

    .tab {
      padding: 0 0.32rem;
      overflow: hidden;
      height: 1.04rem;
      margin-bottom: 0.24rem;
      border-radius: 0.32rem;
      background: var(--ex-bg-white);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .name {
        font-size: 0.3rem;
        padding-top: 0.025rem;
      }

      &:active {
        background-color: rgba(237, 237, 237, 0.87);
      }

      .tab_icon {
        width: 0.52rem;
        height: 0.52rem;
        margin-right: 0.16rem;
        background-color: var(--ex-white);
        border-radius: 50%;
        box-sizing: border-box;
        padding: 0.1rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .more {
        width: 0.3rem;
        height: 0.3rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .amount {
        flex: 1;
        text-align: right;
        padding: 0.04rem 0.2rem 0 0.2rem;
        font-size: 0.32rem;
        font-weight: 600;
        // transition: 0.3s;
      }

      .rights {
        display: flex;
        height: 100%;
        position: absolute;
        right: -100%;
        top: 0;
        transition: 0.3s;

        .right {
          height: 100%;
          width: 1.04rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 0.3rem;
          font-weight: 400;
          text-align: center;
          color: var(--ex-text-color--bg-primary);
          background-color: var(--ex-primary-color);
        }

        .right--yellow {
          background-color: #ffaf2a;
        }

        .right--green {
          background-color: var(--ex-success-color);
        }

        .right--red {
          background-color: var(--ex-error-color);
        }

        .right:first-child {
          border-radius: 0.32rem 0rem 0rem 0.32rem;
        }

        .right:last-child {
          border-radius: 0rem 0.32rem 0.32rem 0rem;
        }
      }
    }

    .tab:first-child {
      margin-top: 0px;
    }

    .open_tab {
      .name {
        display: none;
      }

      .amount {
        text-align: left;
        padding: 0px;
      }

      .rights {
        right: 0;
      }
    }
  }
}
</style>
