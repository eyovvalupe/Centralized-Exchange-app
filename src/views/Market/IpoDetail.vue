<template>
  <div class="ipo_detail">
    <Top :title="t('trade.ipo_detail')"></Top>

    <div class="scroller">
      <div class="main_item">
        <div class="item_box">
          <div class="name_box">
            <div class="name">
              {{ currDetail.company_name }}
              <span class="lever_icon" v-if="currDetail.lever > 1"
                :src="getStaticImgUrl('/static/img/trade/level.svg')">{{ t('trade.ipo_leveraged_trading') }}</span>
            </div>
          </div>
          <div class="pre_times" v-if="currDetail.status == 'none' && currDetail._timedown">
            <div class="pre_time">{{ currDetail._timedown[0] }}</div>
            <span>:</span>
            <div class="pre_time">{{ currDetail._timedown[1] }}</div>
            <span>:</span>
            <div class="pre_time">{{ currDetail._timedown[2] }}</div>
          </div>

          <!-- 认购中 -->
          <div class="status_ing" v-if="currDetail.status == 'issuing'">
            {{ t("trade.ipo_title_going") }}
          </div>
          <!-- 预售中 -->
          <div class="status_ing status_pre" v-if="currDetail.status == 'none'">
            {{ t("trade.ipo_title_pre") }}
          </div>
          <!-- 已结束 -->
          <div class="status_ing status_ed" v-if="currDetail.status == 'listed'">
            {{ t("trade.ipo_title_market") }}
          </div>
          <!-- 已结束 -->
          <div class="status_ing status_done" v-if="currDetail.status == 'done'">
            {{ t("trade.ipo_title_finish") }}
          </div>
        </div>

        <div class="info_boxs">
          <div class="info_box">
            <div>{{ t("trade.ipo_detail_price") }}</div>
            <div class="amount">
              {{
                currDetail.issue_price_max
                  ? currDetail.issue_price_max
                  : "--"
              }}
              <span>{{ currDetail.currency }}</span>
            </div>
          </div>
          <div class="info_box info_box--line" v-if="currDetail.lever > 1">
            <div>{{ t("trade.ipo_detail_lever") }}</div>
            <div class="amount">
              {{ currDetail.lever > 0 ? currDetail.lever + "X" : "无" }}
            </div>
          </div>
          <div class="info_box info_box--line" v-else>
            <div>{{ t("trade.ipo_detail_item5") }}</div>
            <div class="amount">
              {{ currDetail.listing_date || "--" }}
            </div>
          </div>
        </div>
      </div>

      <div class="detail_item_list">
        <div class="detail_item">
          <div>{{ t("trade.ipo_detail_date") }}</div>
          <div class="val">{{ currDetail.issue_start_date || "--" }} - {{ currDetail.issue_end_date || "--" }}</div>
        </div>
        <div class="detail_item">
          <div>{{ t("trade.ipo_detail_item5") }}</div>
          <div class="val">{{ currDetail.listing_date || "--" }}</div>
        </div>

        <div class="detail_item">
          <div>{{ t("trade.ipo_detail_item6") }}</div>
          <div class="val">{{ currDetail.listing_price || "--" }}</div>
        </div>
        <div class="detail_item">
          <div>{{ t("trade.ipo_detail_item11") }}</div>
          <div class="val">{{ marketMap[currDetail.market] || '--' }}</div>
        </div>
      </div>
      <div v-if="currDetail.status == 'issuing'" style="height: 1.68rem"></div>
      <Button v-if="currDetail.status == 'issuing'" @click="goBuy(currDetail)" round size="large"
        color="var(--ex-primary-color)" class="submit" type="primary">
        <span style="color: var(--ex-white);">{{ t("trade.ipo_detail_btn") }}</span></Button>
    </div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { _ipoGet } from "@/api/api";
import Top from "@/components/Top.vue";
import { Button } from "vant";
import { useRoute } from "vue-router";
import { onBeforeUnmount } from "vue";
import router from "@/router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
const currDetail = ref({});

function countdown(endTime) {
  if (!endTime) return ["--", "--", "--"];
  const endDate = new Date(endTime);
  const now = new Date();
  const diff = endDate - now;
  if (diff <= 0) {
    return ["--", "--", "--"];
  }
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  return [formattedHours, formattedMinutes, formattedSeconds];
}

const marketMap = ref({
  us: t('market.market_stock_country_us_long'),
  japan: t('market.market_stock_country_japan_long'),
  india: t('market.market_stock_country_india_long'),
  korea: t('market.market_stock_country_korea_long'),
  germany: t('market.market_stock_country_germany_long'),
  uk: t('market.market_stock_country_uk_long'),
  singapore: t('market.market_stock_country_singapore_long'),
  hongkong: t('market.market_stock_country_hongkong_long'),
  malaysia: t('market.market_stock_country_malaysia_long'),
});

// 去购买
const goBuy = (_query) => {
  const query = {};
  Object.keys(_query).map((k) => {
    if (k != "_timedown") {
      query[k] = _query[k];
    }
  });
  router.push({
    name: "subscription",
    query,
  });
};
let interval = null;
const openDetail = () => {
  _ipoGet({
    id: route.query.id,
  }).then((res) => {
    if (res.data) {
      res.data.listing_date = res.data.listing_date ? res.data.listing_date.replace(/\-/g, '/') : ''
      res.data.issue_start_date = res.data.issue_start_date ? res.data.issue_start_date.replace(/\-/g, '/') : ''
      res.data.issue_end_date = res.data.issue_end_date ? res.data.issue_end_date.replace(/\-/g, '/') : ''
      currDetail.value = {
        _timedown: countdown(res.data.listing_date),
        ...currDetail.value,
        ...res.data,
      };
      interval = setInterval(() => {
        currDetail.value._timedown = countdown(currDetail.value.listing_date);
      }, 1000);
    }
  });
};
openDetail();

onBeforeUnmount(() => {
  if (interval) clearInterval(interval);
});
</script>

<style lang="less" scoped>
.ipo_detail {
  padding-top: 1.12rem;

  .scroller {
    height: calc(100vh - 1.12rem);
    overflow-y: auto;
    box-sizing: border-box;
    padding: 0.28rem 0.32rem 0 0.32rem;
  }

  .main_item {
    border-radius: 0.32rem;
    border: 1px solid var(--ex-border-color);
    background: var(--ex-bg-color2);

    .name {
      color: var(--ex-text-color);
      font-size: 0.32rem;
      font-weight: 600;
      line-height: 0.36rem;
      color: var(--ex-text-color);
      max-width: 80%;
    }

    .name_box {
      display: flex;
      margin-bottom: 0.14rem;

      .lever_icon {
        display: inline-block;
        height: 0.32rem;
        padding: 0rem 0.08rem;
        font-size: 0.22rem;
        color: var(--ex-primary-color);
        border-radius: 0.08rem;
        line-height: 0.32rem;
        font-weight: 400;
        margin-left: 0.1rem;
        background: rgba(1, 76, 250, 0.10);
      }
    }

    .item_box {
      padding: 0.26rem 0.32rem 0.16rem 0.32rem;
      position: relative;
    }

    .pre_times {
      display: flex;
      align-items: center;

      .pre_time {
        height: 0.48rem;
        min-width: 0.48rem;
        padding: 0 0.06rem;
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: center;
        color: var(--ex-warning-color);
        border: 1px solid var(--ex-warning-color);
        border-radius: 0.12rem;
        font-size: 0.28rem;
        font-weight: 600;
        box-sizing: border-box;
      }

      span {
        color: var(--ex-warning-color);
        margin: 0 0.1rem;
        font-size: 0.28rem;
      }
    }

    .status_ing {
      height: 0.6rem;
      border-radius: 0rem 0.32rem;
      padding: 0 0.2rem;
      background-color: var(--ex-primary-color);
      min-width: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.24rem;
      color: var(--ex-black);
      position: absolute;
      right: 0;
      top: 0;
    }

    .status_pre {
      background-color: var(--ex-warning-color);
      color: var(--ex-black);
    }

    .status_done {
      background-color: var(--ex-info-color);
      color: var(--ex-black);
    }

    .status_ed {
      background-color: var(--ex-success-color);
      color: var(--ex-black);
    }
  }

  .submit {
    position: fixed;
    width: calc(100% - 0.64rem);
    left: 0.32rem;
    bottom: 0.32rem;
  }

  .info_boxs {
    padding: 0.3rem 0;
    position: relative;
    border: 1px solid var(--ex-border-color);
    border-bottom: 0px;
    border-radius: 0.32rem;
    background-color: var(--ex-bg-color);
    width: calc(100% + 2px);
    left: -1px;
    z-index: 1;

    &::after {
      content: "";
      display: block;
      clear: both;
    }

    .info_box {
      width: 50%;
      float: left;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--ex-text-color3);
      font-size: 0.28rem;
      line-height: 0.3rem;
      position: relative;

      .amount {
        flex: 1;
        display: flex;
        line-height: 0.3rem;
        margin-top: 0.2rem;
        font-weight: 600;
        color: var(--ex-text-color);
        font-size: 0.3rem;

        span {
          font-size: 0.24rem;
          font-weight: 400;
          position: relative;
          top: 0.03rem;
          margin-left: 0.06rem;
        }
      }
    }

    .info_box--line::after {
      content: "";
      width: 1px;
      height: 0.9rem;
      background-color: var(--ex-bg-color3);
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -0.45rem;
    }
  }

  .detail_item_list {
    padding: 0.08rem 0.32rem 0 0.32rem;
  }

  .detail_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 0.44rem;
    padding: 0.32rem 0 0.2rem 0;
    border-bottom: 1px solid var(--ex-border-color);
    color: var(--ex-text-color3);
    font-size: 0.28rem;
    font-weight: 400;

    .name {
      color: var(--ex-text-color3);
      font-weight: 600;
      font-size: 0.28rem;
    }

    .val {
      color: var(--ex-text-color);
      font-size: 0.3rem;
    }
  }

  .detail_item:last-child {
    border-bottom: 0px;
  }
}
</style>
