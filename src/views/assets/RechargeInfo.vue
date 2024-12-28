<!-- 充值详情 -->
<template>
  <div class="recharge_record_info">
    <Top :title="$t('recharging.info_title')">
      <template #right>
        <div class="top-record" @click="goChat">
          <span><img :src="getStaticImgUrl('/static/img/user/server.png')" alt="img" /></span>
        </div>
      </template>
    </Top>

    <div class="top_info">
      <div class="status" v-if="orderData.status == 'success'">
        <div class="status_icon">
          <img :src="getStaticImgUrl('/static/img/assets/status_success.png')" alt="img" />
        </div>
        <div class="status_name">
          {{ $t("recharging.info_recharge_success") }}
        </div>
        <div class="status_desc">
          {{ $t("recharging.info_recharge_success_con1") }}{{ orderData.amount
          }}{{ orderData.currency
          }}{{ $t("recharging.info_recharge_success_con2") }}
        </div>
      </div>
      <div class="status" v-else-if="orderData.status == 'failure'">
        <div class="status_icon">
          <img :src="getStaticImgUrl('/static/img/assets/status_error.png')" alt="img" />
        </div>
        <div class="status_name">{{ $t("recharging.info_recharge_failure") }}</div>
        <div class="status_desc">{{ $t("recharging.info_recharge_failure_con") }}</div>
      </div>
      <div class="status" v-else>
        <div class="status_icon">
          <LoadEffect class="status_loading" color="var(--ex-white)" />
          <img :src="getStaticImgUrl('/static/img/assets/status_wait.png')" alt="img" />
        </div>
        <div class="status_name">{{ $t("recharging.info_recharge_pending") }}</div>
        <div class="status_desc">{{ $t("recharging.info_recharge_pending_con") }}</div>
      </div>
    </div>
    <div class="bottom_info">
      <div class="bottom_item">
        <div class="name">{{ $t("recharging.info_recharge_balance") }}</div>
        <div class="value">
          {{ orderData.amount }}
          <span class="value_currency">{{ orderData.currency }}</span>
        </div>
      </div>
      <div class="bottom_item">
        <div class="name">{{ $t("recharging.info_recharge_crpyto") }}</div>
        <div class="value">{{ orderData.currency }}</div>
      </div>
      <div class="bottom_item">
        <div class="name">{{ $t("recharging.info_recharge_network") }}</div>
        <div class="value">{{ orderData.network }}</div>
      </div>

      <div class="bottom_item">
        <div class="name">{{ $t("recharging.info_recharge_address") }}</div>
        <div class="value">
          <div class="value_text van-omit1">{{ orderData.address }}</div>
          <div class="copy_icon" @click="copy(orderData.address)">
            <img :src="getStaticImgUrl('/static/img/trade/copy.png')" alt="copy" />
          </div>
        </div>
      </div>
      <div class="bottom_item">
        <div class="name">{{ $t("recharging.info_recharge_order") }}</div>
        <div class="value">
          <div class="value_text van-omit1">{{ orderData.order_no }}</div>
          <div class="copy_icon" @click="copy(orderData.order_no)">
            <img :src="getStaticImgUrl('/static/img/trade/copy.png')" alt="copy" />
          </div>
        </div>
      </div>

      <div class="bottom_item">
        <div class="name">{{ $t("recharging.info_recharge_date") }}</div>
        <div class="value">{{ orderData.date }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import Top from "@/components/Top.vue";
import { ref } from "vue";
import { _depositGet } from "@/api/api";
import { showToast } from "vant";
import { useRoute } from "vue-router";
import { _copyTxt } from "@/utils/index";
import LoadEffect from "@/components/LoadEffect.vue";
import router from "@/router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();

//  复制
const copy = (text) => {
  _copyTxt(text);
  showToast(t('recharging.copied'));
};

const loading = ref(false);
const order_no = ref(route.query.order_no); // 订单编号

// 获取订单详情
const orderData = ref({});
const getOrderInfo = () => {
  loading.value = true;

  _depositGet({
    order_no: order_no.value,
  })
    .then((res) => {
      if (res.data) {
        console.log("recharge info >>> res data =======> ", res.data);
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
.recharge_record_info {
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
