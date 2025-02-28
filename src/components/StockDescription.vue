<template>
  <div class="stock_description" v-show="!loading && list.length > 0">
    <div class="flex flex-col mb-[0.4rem]">
      <div class="flex flex-row justify-between items-center mb-[0.16rem]">
        <span class="text-[0.32rem] text-color font-semibold">{{
          $t("common.closed")
        }}</span>
        <span class="text-[0.24rem] text-color3">{{ props.data.closets }}
          {{
            props.data.region == "us"
              ? t("market.market_stock_country_us")
              : props.data.region == "japan"
                ? t("market.market_stock_country_japan")
                : props.data.region == "india"
                  ? t("market.market_stock_country_india")
                  : props.data.region == "korea"
                    ? t("market.market_stock_country_korea")
                    : props.data.region == "germany"
                      ? t("market.market_stock_country_germany")
                      : props.data.region == "uk"
                        ? t("market.market_stock_country_uk")
                        : props.data.region == "singapore"
                          ? t("market.market_stock_country_singapore")
                          : props.data.region == "hongkong"
                            ? t("market.market_stock_country_hongkong")
                            : props.data.region == "malaysia"
                              ? t("market.market_stock_country_malaysia")
                              : ""
          }}</span>
      </div>
      <div class="flex flex-row items-center">
        <div>
          <span class="text-[0.24rem] text-color3">{{ t('market.market_stock_updatetime') }}：{{
            props.data.currentts
          }}</span>
        </div>
        <div class="re_render" @click="update">
          <img v-lazy="getStaticImgUrl('/static/img/market/refresh_big.svg')" alt="">
        </div>
      </div>
    </div>
    <div class="flex flex-row justify-between">
      <div v-for="(item, i) in list" :key="i" :class="item.ratio > 0 ? 'up_price' : 'down_price'"
        class="flex flex-col w-[2.1532rem] justify-between h-[1.52rem] items-center rounded-[0.32rem] pt-[0.2rem] pb-[0.2rem] pl-[0.15rem] pr-[0.15rem]"
        @click="goInfo(item)">
        <span class="text-[0.28rem] text-color">{{
          item["symbol"].length > 8
            ? item["symbol"].substring(0, 8) + "..."
            : item["symbol"]
        }}</span>
        <span class="stock_price">{{ item.price }}</span>
        <div class="flex flex-row justify-between stock_detail">
          <span>{{
            (item.ratio || 0) > 0
              ? "+" + ((item.ratio || 0) * item.price).toFixed(2)
              : ((item.ratio || 0) * item.price).toFixed(2)
          }}</span>
          <span>{{ item.ratio > 0 ? "+" : "" }}{{ item.ratio || 0 }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import store from "@/store";
import router from "@/router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emits = defineEmits(["update"]);
const update = () => {
  emits("update");
};

const props = defineProps({
  region: {
    type: String,
    default: "",
  },
  data: {
    type: Object,
    default: {},
  },
  loading: {
    type: Boolean,
    default: true,
  },
  active: {
    type: String,
    default: 0,
  },
  list: {
    type: Array,
    default: () => [],
  },
});

const goInfo = (item) => {
  store.commit("setCurrStockItem", item);
  setTimeout(() => {
    router.push({
      name: "tradeInfo",
      query: {
        symbol: item.symbol,
        type: "stock",
      },
    });
  }, 100);
};
</script>

<style lang="less" scoped>
.stock_description {
  padding: 0.4rem 0.32rem;
  display: flex;
  flex-direction: column;

  .re_render {
    width: 0.24rem;
    height: 0.24rem;
    margin-left: 0.12rem;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .up_price {
    background: var(--ex-bg-color3);

    .stock_price {
      font-size: 0.3rem;
      font-weight: 600;
      color: var(--ex-up-color);
    }

    .stock_detail {
      width: 100%;
      font-size: 0.24rem;
      font-weight: 400;
      color: var(--ex-up-color);
    }
  }

  .down_price {
    background: var(--ex-bg-color3);

    .stock_price {
      font-size: 0.3rem;
      font-weight: 600;
      color: var(--ex-down-color);
    }

    .stock_detail {
      width: 100%;
      font-size: 0.24rem;
      font-weight: 400;
      color: var(--ex-down-color);
    }
  }
}
</style>
