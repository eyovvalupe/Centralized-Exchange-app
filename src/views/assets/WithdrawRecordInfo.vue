<!-- 提现详情 -->
<template>
  <div class="withdraw_record_info">
    <Top :title="$t('withdrawInfo.title')">
      <template #right>
        <div class="top-record" @click="goChat">
          <span><img :src="getStaticImgUrl('/static/img/user/server.svg')" alt="img" /></span>
        </div>
      </template>
    </Top>

    <div class="top_info">
      <div class="status" v-if="orderData.status == 'success'">
        <div class="status_icon">
          <img :src="getStaticImgUrl('/static/img/assets/status_success.svg')" alt="img" />
        </div>
        <div class="status_name">{{ $t("withdrawInfo.successful") }}</div>
        <div class="status_desc">
          {{ $t("withdrawInfo.info_recharge_success_con1") }}
          {{ parseFloat(orderData.amount).toFixed(2) }}{{ orderData.currency
          }}{{ $t("withdrawInfo.info_recharge_success_con2") }}
        </div>
      </div>
      <div class="status" v-else-if="orderData.status == 'failure'">
        <div class="status_icon">
          <img :src="getStaticImgUrl('/static/img/assets/status_error.svg')" alt="img" />
        </div>
        <div class="status_name">{{ $t("withdrawInfo.Failed") }}</div>
        <div class="status_desc">{{ $t("withdrawInfo.failurePrompt") }}</div>
      </div>
      <div class="status" v-else>
        <div class="status_icon">
          <LoadEffect class="status_loading" color="var(--ex-white)" />
          <img :src="getStaticImgUrl('/static/img/assets/status_wait.svg')" alt="img" />
        </div>
        <div class="status_name">{{ $t("withdrawInfo.processing") }}</div>
        <div class="status_desc">{{ $t("withdrawInfo.processingTip") }}</div>
      </div>
    </div>
    <div class="bottom_info">
      <div class="bottom_item">
        <div class="name">{{ $t("withdrawInfo.withdrawalAmount") }}</div>
        <div class="value">
          {{ parseFloat(orderData.amount).toFixed(2) }}
          <span class="value_currency">{{ orderData.currency }}</span>
        </div>
      </div>
      <div class="bottom_item">
        <div class="name">{{ $t("withdrawInfo.receivingAccount") }}</div>
        <div class="value">
          {{
            orderData.account
              ? orderData.account.symbol.toUpperCase() || ""
              : ""
          }}
          {{
            orderData.account
              ? getAddress(orderData.account.address) || "--"
              : "--"
          }}
        </div>
      </div>
      <div class="bottom_item">
        <div class="name">{{ $t("withdrawInfo.withdrawalCurrency") }}</div>
        <div class="value">USDT</div>
      </div>
      <div class="bottom_item">
        <div class="name">{{ $t("withdrawInfo.withdrawalNetwork") }}</div>
        <div class="value">TR200</div>
      </div>

      <div class="bottom_item">
        <div class="name">{{ $t("withdrawInfo.orderNumber") }}</div>
        <div class="value">
          <div class="value_text van-omit1">{{ orderData.order_no }}</div>
          <div class="copy_icon" @click="copy(orderData.order_no)">
            <img :src="getStaticImgUrl('/static/img/common/copy.svg')" alt="copy" />
          </div>
        </div>
      </div>
      <div class="bottom_item">
        <div class="name">{{ $t("withdrawInfo.withdrawalTime") }}</div>
        <div class="value">{{ orderData.date }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import Top from "@/components/Top.vue";
import { ref } from "vue";
import { _withdrawGet } from "@/api/api";
import { showToast } from "vant";
import { useRoute } from "vue-router";
import { _copyTxt } from "@/utils/index";
import LoadEffect from "@/components/LoadEffect.vue";
import router from "@/router";
import store from "@/store";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const route = useRoute();

//  复制
const copy = (text) => {
  _copyTxt(text);
  showToast(t('recharging.copied'));
};

const getAddress = (address) => {
  if (!address) {
    return "--";
  }
  return "(**** **** **** " + address.substr(address.length - 4) + ")";
};

const loading = ref(false);
const order_no = ref(route.query.order_no); // 订单编号

// 获取订单详情
const orderData = ref({});
const getOrderInfo = () => {
  loading.value = true;

  _withdrawGet({
    order_no: order_no.value,
  })
    .then((res) => {
      if (res.data) {
        orderData.value = res.data;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

getOrderInfo();

const goChat = () => {
  router.push({
    name: "chat",
  });
};
</script>

<style lang="less" scoped>
.withdraw_record_info {
  padding: 1.12rem 0.32rem 0.32rem 0.32rem;

  .top-record {
    width: 0.72rem;
    height: 0.72rem;
    box-sizing: border-box;
    border: 1px solid var(--ex-border-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      display: block;
      width: 0.432rem;
      height: 0.432rem;
    }
  }

  .top_info {
    padding-top: 0.52rem;

    .status {
      display: flex;
      align-items: center;
      flex-direction: column;

      .status_icon {
        width: 1.2rem;
        height: 1.2rem;
        position: relative;
      }

      .status_loading {
        position: absolute;
        left: 0;
        top: 0;
        transform: scale(0.35);
        left: -0.4rem;
        top: -0.4rem;
      }

      .status_name {
        font-size: 0.3rem;
        line-height: 140%;
        color: var(--ex-text-color);
        margin-top: 0.32rem;
      }

      .status_desc {
        color: var(--ex-text-color2);
        text-align: center;
        font-size: 0.28rem;
        line-height: 140%;
        margin-top: 0.16rem;
      }
    }
  }

  .bottom_info {
    padding: 0.22rem 0.32rem;

    .bottom_item {
      padding: 0.32rem 0 0.2rem 0;
      border-bottom: 1px solid var(--ex-border-color);
      display: flex;
      justify-content: space-between;
      font-size: 0.28rem;
      color: var(--ex-text-color3);
      line-height: 0.44rem;
      font-weight: 400;

      .value {
        font-size: 0.3rem;
        color: var(--ex-text-color);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex: 1;
        overflow: hidden;
        margin-left: 0.32rem;
      }

      .value_text {
        display: block;
        flex: 1;
        text-align: right;
      }

      .value_currency {
        font-size: 0.24rem;
        margin-left: 0.12rem;
        vertical-align: bottom;
        position: relative;
        top: 0.02rem;
      }

      .copy_icon {
        width: 0.24rem;
        height: 0.24rem;
        margin-left: 0.16rem;
      }
    }
  }
}
</style>
