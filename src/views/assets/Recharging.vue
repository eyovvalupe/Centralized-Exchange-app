<!-- 充值中 -->
<template>
  <div class="page page_recharge">
    <Top :title="$t('recharging.recharge')">
      <!-- <template #right>
        <div class="top-record" @click="() => router.push({ name: 'chat' })">
          <span><img :src="getStaticImgUrl('/static/img/user/server.svg')" alt="img" /></span>
        </div>
      </template> -->
    </Top>
    <Loading :loading="loading" v-show="loading" />
    <template v-if="!loading">
      <div class="recharge_box">
        <div class="time_box w-full">
          <div class="time_label">{{ $t("recharging.countdown") }}</div>
          <CountDown v-model:time="s" class="time_show" />
          <div class="w-full h-[2.34rem] rounded-[0.4rem] pt-[0.4rem] mt-[0.68rem] relative" style="background-color: var(--ex-bg-color);">
            <div class="network-tag w-[6.46rem] h-[0.6rem] mx-auto absolute top-[-0.6rem]">
              <span>{{ form.network }} · {{ form.currency }}</span>
            </div>
            <div class="amount">
              {{ form.amount }}<span>{{ form.currency }}</span>
            </div>
            <div class="network-tag">
              <span style="color: var(--ex-text-color2); background-color: var(--ex-bg-color2);">${{ ratePrice
                }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="recharge_box">
        <div class="qrcode_box">
          <div class="qrcode" ref="qrcodeRef" v-show="!loading"></div>

          <!-- 已过期  -->
          <div v-if="s == 0 && !loading" style="
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
            ">
            <img :src="getStaticImgUrl('/static/img/assets/Expired.svg')" alt="Expired" />
          </div>
          <div class="timeout_box" v-if="s == 0 && !loading">
            <div class="warning_icon">
              <img :src="getStaticImgUrl('/static/img/common/warning.svg')" alt="img" />
            </div>
            <div>{{ $t("recharging.QRcodeExpired") }}</div>
          </div>
        </div>

        <div class="address">
          <div class="address_label">{{ $t("recharging.walletAddress") }}</div>
          <div class="address_val">{{ address || "--" }}</div>
          <div class="address_copy_btn" @click="copy">
            {{ $t("recharging.copy") }}
          </div>
        </div>

        <div class="tip">
          when your payment status will change, we all send to<br />
          you notification <span class="text-primary">leave your email</span>
        </div>
      </div>

      <div class="btns">
        <Button v-if="orderStatus == 'success'" @click="jumpWithQuery('rechargeInfo')" :loading="loading" round
          color="var(--ex-success-color)" style="width: 100%" class="submit" type="info"><span
            style="color: var(--ex-white)">{{
              $t("recharging.success")
            }}</span></Button>
        <Button v-else-if="orderStatus == 'failure'" @click="jumpWithQuery('rechargeInfo')" :loading="loading" round
          color="var(--ex-error-color)" style="width: 100%" class="submit" type="info"><span
            style="color: var(--ex-white)">{{
              $t("recharging.fail") }}</span></Button>
        <Button v-else @click="jumpWithQuery('rechargeInfo')" :loading="loading" round color="var(--ex-primary-color)"
          style="width: 100%" class="submit" type="info"><span style="color: var(--ex-text-color--bg-primary)">{{
            $t("recharging.finish")
          }}</span></Button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import Top from "@/components/Top.vue";
import { useRoute } from "vue-router";
import { ref, computed } from "vue";
import { Button, showToast, Circle } from "vant";
import { _copyTxt } from "@/utils/index.js";
import Loading from "@/components/Loaidng.vue";
import { _deposit1, _depositGet, _swapRate } from "@/api/api";
import store from "@/store";
import router from "@/router";
import Decimal from "decimal.js";
import CountDown from "@/components/CountDown.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();

// sessionToken
const sessionToken = computed(() => store.state.sessionToken || "");
const getSessionToken = () => {
  loading.value = true;
  return store.dispatch("updateSessionToken");
};

// 表单
const orderStatus = ref(""); // 状态
const loading = ref(false);
const order_no = ref(route.query.order_no); // 订单编号
const form = ref({
  name: route.query.name,
  amount: Number(route.query.amount),
  currency: route.query.currency,
  network: route.query.network,
  // swap: route.query.swap ? JSON.parse(route.query.swap) : false
});
const address = ref("");

// 获取充值地址
const getAddress = () => {
  loading.value = true;
  _deposit1({
    currency: form.value.currency,
    network: form.value.network,
    amount: form.value.amount,
    token: sessionToken.value,
    swap: form.value.swap,
  })
    .then((res) => {
      if (res.code == 200) {
        console.log("recharging >>> res data ========> ", res.data);
        address.value = res.data?.address || "";
        drawQrcode();
        startCountDown(res.data?.timeout || 60);
        order_no.value = res.data?.order_no;

        setTimeout(() => {
          getRate();
          router.replace({
            name: "recharging",
            query: {
              order_no: order_no.value,
            },
          });
        }, 200);
      }
    })
    .catch((err) => console.log(err))
    .finally(() => {
      loading.value = false;
    });
};

// 获取订单详情
const getOrderInfo = () => {
  loading.value = true;
  _depositGet({
    order_no: order_no.value,
  })
    .then((res) => {
      if (res.data) {
        orderStatus.value = res.data.status;
        form.value = {
          amount: res.data.amount,
          currency: res.data.currency,
          network: res.data.network,
          swap: false,
        };
        address.value = res.data.address;
        drawQrcode();
        startCountDown(res.data?.timeout || 60);

        setTimeout(() => {
          getRate();
        }, 200);
      }
    })
    .catch((err) => console.log(err))
    .finally(() => {
      loading.value = false;
    });
};

if (order_no.value) {
  // 查看订单详情
  getOrderInfo();
} else {
  // 获取充值地址
  getSessionToken().then((res) => {
    getAddress();
  });
}

const jumpWithQuery = (url) => {
  router.replace({
    name: url,
    query: {
      order_no: order_no.value,
    },
  });
};

const s = ref(1);
const timeoutMax = ref(1);
const startCountDown = (max) => {
  if (!max || max <= 0) max = 0;
  timeoutMax.value = max;
  s.value = max;
};

// 生成二维码
const qrcodeRef = ref();
const drawQrcode = () => {
  setTimeout(() => {
    if (!qrcodeRef.value || !address.value) return;
    new QRCode(qrcodeRef.value, {
      text: address.value,
      width: 128,
      height: 128,
    });
  }, 100);
};

const rate = ref(0);
const rateLoading = ref(false);
const ratePrice = computed(() => {
  if (!rate.value || rateLoading.value) return "--";
  return new Decimal(form.value.amount).mul(rate.value);
});
const getRate = () => {
  // 获取汇率
  rateLoading.value = true;
  _swapRate({
    from: form.value.currency,
    to: "USDT",
    amount: 0,
  })
    .then((res) => {
      if (res.code == 200) {
        rate.value = res.data.exchange_rate;
      }
    })
    .finally(() => {
      rateLoading.value = false;
    });
};

// 复制
const copy = () => {
  _copyTxt(address.value);
  showToast(t('recharging.copied'));
};
const copyPrice = () => {
  _copyTxt(form.value.amount);
  showToast(t('recharging.copied'));
};
</script>

<style lang="less" scoped>
.page_recharge {
  padding: 1.12rem 0.32rem 0.32rem 0.32rem;

  position: relative;

  // :deep(.top) {
  //   background: none;
  //   background-image: linear-gradient(to top,
  //       rgba(255, 255, 255, 0),
  //       rgba(255, 255, 255, 1));
  //   backdrop-filter: blur(3px);
  // }

  .top-record {
    width: 0.72rem;
    height: 0.72rem;
    box-sizing: border-box;
    border: 0.02rem solid var(--ex-border-color);
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

  .recharge_box {
    border-radius: 0.32rem;
    margin-top: 0.2rem;
    background: var(--ex-bg-color2);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    // box-shadow: 0px 0.08rem 0.8rem 0 rgba(1, 76, 250, 0.2);
    padding: 0.12rem;

    .amount {
      color: var(--ex-primary-color);
      text-align: center;
      font-size: 0.48rem;
      font-weight: 600;
      line-height: 0.36rem;
      margin-top: 0.3rem;

      span {
        font-size: 0.32rem;
        font-weight: 400;
        margin-left: 0.06rem;
      }
    }

    .time_box {
      padding-top: 0.06rem;

      .time_label {
        color: var(--ex-text-color5);
        text-align: center;
        font-size: 0.28rem;
        line-height: 0.36rem;
      }

      .time_show {
        margin-top: 0.2rem;
        margin-bottom: 0.1rem;
      }

      .network-tag {
        display: flex;
        justify-content: center;
        align-content: center;
        padding-top: 0.26rem;
        color: var(--ex-text-color2);

        span {
          height: 0.6rem;
          padding: 0 0.28rem;
          border-radius: 0.5rem;
          background-color: var(--ex-primary-color);
          color: var(--ex-black);
          font-size: 0.28rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .subtitle {
      font-weight: 400;
      font-size: 0.28rem;
      color: var(--ex-text-color);
      line-height: 0.44rem;
      margin-bottom: 0.4rem;
    }

    .qrcode_box {
      // border: 1px solid var(--ex-white);
      background-color: var(--ex-white);
      width: 3.18rem;
      height: 3.18rem;
      margin: 0.2rem auto;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.16rem;
      box-sizing: border-box;
      position: relative;
      border-radius: 0.3rem;
      overflow: hidden;

      .timeout_box {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        position: absolute;
        z-index: 9;
        top: 0;
        left: 0;
        background-color: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(3px);

        .warning_icon {
          width: 1rem;
          height: 1rem;
          margin-bottom: 0.4rem;
        }
      }

      .qrcode {
        width: 100%;
        height: 100%;
      }
    }

    .address_label {
      color: var(--ex-text-color5);
      text-align: center;
      font-size: 0.28rem;
      line-height: 0.36rem;
      margin-top: 0.32rem;
    }

    .address_val {
      height: 0.92rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 1rem;
      color: var(--ex-text-color);
      font-size: 0.3rem;
      font-weight: 600;
      line-height: 0.36rem;
      margin-top: 0.22rem;
      text-align: center;
      width: max-content;
      padding: 0 0.5rem;
      background-color: var(--ex-bg-color);
    }

    .address_copy_btn {
      width: 1.28rem;
      margin: 0 auto;
      height: 0.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ex-primary-color);
      font-size: 0.3rem;
      border: 1px solid var(--ex-primary-color);
      border-radius: 0.3rem;
      margin-top: 0.16rem;
    }
  }

  .tip {
    color: var(--ex-text-color3);
    text-align: center;
    font-family: Inter;
    font-size: 0.24rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.32rem;
    margin-top: 0.28rem;
  }

  .btns {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.6rem;
    padding-bottom: 0.28rem;

    .submit {
      width: 100%;
      height: 1.12rem;
      font-size: 0.36rem;
    }
  }
}
</style>
