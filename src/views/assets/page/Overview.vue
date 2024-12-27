<!-- 资产总览 -->
<template>
  <div class="page_assets_overview">
    <!-- 总览 -->
    <OverviewCard>
      <div class="p-[0.7rem]">
        <div class="top">
          <div class="title">{{ $t("home.totalAssets") }} <span>(USDT)</span></div>
          <div class="eyes" @click="hidden = !hidden">
            <img :src="getStaticImgUrl('/static/img/assets/eye_o.svg')" v-show="!hidden" />
            <img :src="getStaticImgUrl('/static/img/assets/closed_eye.svg')" v-show="hidden" />
          </div>
        </div>
        <div class="money">
          <span>{{
            hidden
              ? "********"
              : parseFloat(assets.total).toLocaleString() || "0"
          }}</span>
        </div>
        <div class="navs">
          <div class="nav bg-color bg-opacity-10">
            <div class="nav_label">{{ $t("assets.info_cash") }}</div>
            <div class="num">
              {{
                hidden
                  ? "********"
                  : parseFloat(assets.money).toLocaleString() || "0"
              }}
            </div>
          </div>
          <div class="nav">
            <div class="nav_label">{{ $t("assets.wallet_order_value") }}</div>
            <div class="num">
              {{ hidden ? "********" : assets.order_value || "0" }}
            </div>
          </div>
        </div>
      </div>
    </OverviewCard>

    <!-- 按钮 -->
    <Btns :money="assets.money" />

    <!-- 列表 -->
    <div class="tabs">
      <div ref="tab1" :key="1" class="tab" @click="jumpToWallet(0)">
        <div class="tab_icon">
          <div style="width: 0.34rem;height: 0.34rem;">
            <img :src="getStaticImgUrl(`/static/icons/cash.svg`)" alt="">
          </div>
        </div>
        <div class="name">{{ $t("assets.over_view_cash") }}</div>
        <div class="amount">
          {{ parseFloat(assets.money).toLocaleString() || "0" }}
        </div>
        <div class="more">
          <div style="width: 0.2rem;height: 0.32rem;">
            <img :src="getStaticImgUrl(`/static/icons/right_gray.svg`)" alt="">
          </div>
        </div>
      </div>
      <div ref="tab2" :key="2" class="tab" :class="{ open_tab: rightSwitch2 == true }" @click="jumpToWallet(1)">
        <div class="tab_icon">
          <div style="width: 0.36rem;height: 0.36rem;">
            <img :src="getStaticImgUrl(`/static/icons/overview.svg`)" alt="">
          </div>
        </div>
        <div class="name">{{ $t("assets.over_view_stock") }}</div>
        <div class="amount">
          {{
            parseFloat(assets && assets.stock ? assets.stock : 0).toLocaleString()
          }}
        </div>
        <div class="more">
          <div style="width: 0.2rem;height: 0.32rem;">
            <img :src="getStaticImgUrl(`/static/icons/right_gray.svg`)" alt="">
          </div>
        </div>
      </div>
      <div ref="tab3" :key="3" class="tab" :class="{ open_tab: rightSwitch3 == true }" @click="jumpToWallet(2)">
        <div class="tab_icon">
          <div style="width: 0.32rem;height: 0.32rem;">
            <img :src="getStaticImgUrl(`/static/icons/constract.svg`)" alt="">
          </div>
        </div>
        <div class="name">{{ $t("assets.over_view_contract") }}</div>
        <div class="amount">
          {{
            parseFloat(assets && assets.futures ? assets.futures : 0).toLocaleString()
          }}
        </div>
        <div class="more">
          <div style="width: 0.2rem;height: 0.32rem;">
            <img :src="getStaticImgUrl(`/static/icons/right_gray.svg`)" alt="">
          </div>
        </div>
      </div>
    </div>

    <!-- 类型选择弹窗 -->
    <ActionSheet v-model:show="showAS" teleport="body" :actions="actions" :title="$t('记录列表')" @select="onSelect" />
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
const hidden = ref(false); // 隐藏数字

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
console.log('assets =======> ', assets.value)

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
    font-size: 0.28rem;
    font-weight: 400;
    display: flex;
    height: 0.32rem;
    align-items: center;
    line-height: 0.32rem;

    .title {
      color: #fff;
      margin-right: 0.12rem;
      font-size: 0.3rem;

      span {
        font-size: 0.24rem;
      }
    }

    .eyes {
      width: 0.32rem;
      height: 0.32rem;
      color: #fff;
    }
  }

  .money {
    color: #fff;
    font-family: "PingFang SC";
    font-size: 0.52rem;
    font-style: normal;
    font-weight: 600;
    line-height: 0.6rem;
    margin-top: 0.26rem;
    margin-bottom: 0.28rem;
  }

  .navs {
    display: flex;
    justify-content: space-between;

    .nav {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 2.8rem;
      height: 1.12rem;
      border-radius: 0.32rem;
    }

    .nav_label {
      color: #fff;
      font-size: 0.28rem;
      line-height: 100%;
      margin-top: 0.1rem;
    }

    .num {
      color: #fff;
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
      margin-top: 0.12rem;
      border-radius: 0.32rem;
      background: var(--ex-bg-color2);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .name {
        font-size: 0.3rem;
      }

      &:active {
        background-color: rgba(237, 237, 237, 0.87);
      }

      .tab_icon {
        width: 0.52rem;
        height: 0.52rem;
        margin-right: 0.16rem;
        background-color: var(--ex-bg-color);
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
        padding: 0 0.2rem;
        font-size: 0.32rem;
        font-weight: 600;
        transition: 0.3s;
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
          color: var(--ex-bg-primary-text-color);
          background-color: var(--ex-primary-color);
        }

        .right--yellow {
          background-color: #ffaf2a;
        }

        .right--green {
          background-color: #00af70;
        }

        .right--red {
          background-color: #e8503a;
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
