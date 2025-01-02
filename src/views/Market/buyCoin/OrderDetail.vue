<!-- 买币-订单详情 -->
<template>
  <div class="page-detail">
    <Top :title="currItem.status == 'waitpayment'
      ? t('market.market_buy_list_wait_pay1')
      : currItem.status == 'waitconfirm'
        ? t('market.market_buy_list_wait_confirm1')
        : currItem.status == 'done'
          ? t('market.market_buy_list_trade_sccess')
          : currItem.status == 'cancel'
            ? t('market.market_buy_list_trade_sccess')
            : ''
      " class="!z-20" :back-func="goBack" />

    <div v-if="infoLoading" class="loading_box">
      <Loading color="var(--van-primary-color)" size="0.8rem" :loading="true" />
    </div>

    <template v-else>

      <!-- Tabs -->
      <div class="tabs">
        <div @click="active = 1" class="tab" :class="{ tab_active: active == 1 }">
          <span>
            <!-- {{ offsetEnum[currItem.offset] || "--" }} -->
            {{
              currItem.offset == "buy"
                ? t("market.market_buy_fast_buy")
                : currItem.offset == "sell"
                  ? t("market.market_buy_fast_sell")
                  : "--"
            }}
          </span>
        </div>
        <div @click="active = 2; changeWindowHeight()" class="tab" :class="{ tab_active: active == 2 }">
          <span class="relative flex items-center">
            {{ t("market.market_buy_list_contact") }}
            <div class="hint" v-if="unreadMessage[currItem.order_no] > 0">
              {{ unreadMessage[currItem.order_no] }}
            </div>
            <!-- <div class="hint" v-if="c2cUnread[currItem.order_no] || currItem.unread">{{
                          c2cUnread[currItem.order_no] || currItem.unread }}</div> -->
          </span>
        </div>
      </div>
      <template v-if="active == 1">
        <!-- 详情 -->
        <div class="detail_box">
          <!-- 状态 -->
          <div class="status">
            <!-- 等待买家付款 -->
            <div v-if="currItem.status == 'waitpayment' && currItem.offset == 'buy'" class="status_wait">
              <div style="display: flex; align-items: center">
                <div class="amount">
                  {{ t("market.market_buy_list_wait_buyer_confirm") }}
                </div>
                <div class="time">{{ formatSec2(currItem.endtime) }}</div>
              </div>
              <div>{{ t("market.market_buy_list_wait_buyer_con") }}</div>
            </div>
            <!-- 等待商家付款 -->
            <div v-if="currItem.status == 'waitpayment' && currItem.offset == 'sell'" class="status_wait">
              <div style="display: flex; align-items: center">
                <div class="amount">
                  {{ t("market.market_buy_list_wait_buyer_confirm") }}
                </div>
                <div class="time">{{ formatSec2(currItem.endtime) }}</div>
              </div>
              <div>{{ t("market.market_buy_list_wait_buyer_confirm") }}</div>
            </div>
            <!-- 等待确认 -->
            <div v-if="currItem.status == 'waitconfirm' && currItem.offset == 'buy'" class="status_wait">
              <div style="display: flex; align-items: center">
                <div class="amount">{{ t('market.market_buy_list_wait_confirm') }}</div>
                <div class="time">{{ formatSec2(currItem.endtime) }}</div>
              </div>
              <div>{{ t('market.market_buy_list_wait_con') }}</div>
            </div>
            <div v-if="currItem.status == 'waitconfirm' && currItem.offset == 'sell'" class="status_wait">
              <div style="display: flex; align-items: center">
                <div class="amount">
                  {{ t("market.market_buy_list_wait_confirm") }}
                </div>
                <div class="time">{{ formatSec2(currItem.endtime) }}</div>
              </div>
              <div>{{ t("market.market_buy_list_wait_result") }}</div>
            </div>

            <!-- 已完成 -->
            <div v-if="currItem.status == 'done'" class="finish_status success_status">
              <div class="size-[0.8rem]"><img :src="getStaticImgUrl('/static/img/assets/status_success.svg')"
                  alt="img" /></div>
              <div class="ml-[0.2rem]">{{ t("market.market_buy_list_complete") }}</div>
            </div>
            <!-- 已取消 -->
            <div v-if="currItem.status == 'cancel'" class="finish_status">
              <div class="size-[0.8rem]"><img :src="getStaticImgUrl('/static/img/assets/status_error.svg')"
                  alt="img" /></div>
              <div class="ml-[0.2rem]">{{ t("market.market_buy_list_cancel") }}</div>
            </div>
          </div>
          <!-- 卖家 -->
          <div class="detail_content">
            <div class="seller">
              <div style="
                  display: flex;
                  align-items: center;
                  justify-content: flex-start;
                ">
                <div class="avatar">
                  {{
                    currItem.merchant_name
                      ? currItem.merchant_name.slice(0, 1)
                      : ""
                  }}
                </div>
                <div class="title">{{ currItem.merchant_name }}</div>
              </div>
              <div style="
                  display: flex;
                  align-items: center;
                  justify-content: flex-start;
                  margin-top: 0.06rem;
                ">
                <div class="avatar" style="opacity: 0"></div>
                <div class="info">
                  {{ t("market.market_buy_optional_deal") }}
                  {{ currItem.merchant_volume || "0" }}
                </div>
                <div class="line"></div>
                <div class="info">
                  {{ t("market.market_buy_optional_rate") }}
                  {{ currItem.merchant_volumerate || "0" }}%
                </div>
                <div class="line"></div>
                <div class="info">
                  <div class=" mr-1" style="width: 0.25rem;height: 0.25rem;">
                    <IconSvg name="clock" />
                  </div>
                  <span>{{ currItem.merchant_avetime
                    }}{{ t("market.market_buy_optional_duaration") }}</span>
                </div>
              </div>
            </div>

            <!-- 银行卡 -->
            <div class="bank_none" v-if="currItem.bank_status == 'undone' && currItem.offset == 'buy'">
              <div class="img">
                <img :src="getStaticImgUrl('/static/img/market/waitFor.svg')" alt="" />
              </div>
              <div class="name">
                <!-- {{ t("market.market_buy_list_wait_buyer_bank") }} -->
              </div>
            </div>
            <div class="bank" v-if="currItem.bank_status == 'done'">
              <div class="tr">
                <div class="td">
                  {{ t("market.market_buy_fast_account_bank") }}
                </div>
                <div class="td td2">{{ currItem.bank_name }}</div>
              </div>
              <div class="tr" @click="copy(currItem.bank_card_number)">
                <div class="td">
                  {{ t("market.market_buy_list_wait_bank_no") }}
                </div>
                <div class="td td2">
                  <span>{{ currItem.bank_card_number }}</span>
                  <div class="copy">
                    <img :src="getStaticImgUrl('/static/img/common/copy.svg')" alt="" />
                  </div>
                </div>
              </div>
              <div class="tr">
                <div class="td">
                  {{ t("market.market_buy_list_wait_account") }}
                </div>
                <div class="td td2">{{ currItem.account_name }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 订单 -->
        <div class="order pb-[0.24rem]" v-if="currItem.order_no">
          <div class="top" @click="copy(currItem.order_no)">
            <div class="order_no">{{ currItem.order_no }}</div>
            <div class="copy_icon">
              <img :src="getStaticImgUrl('/static/img/common/copy.svg')" alt="" />
            </div>
            <div style="flex: 1"></div>
            <div>{{ currItem.date }}</div>
          </div>
          <div class="flex items-center bg-color rounded-[0.32rem] mt-[0.2rem] mx-[0.32rem] relative pl-[0.7rem]">
         
            <div
              class="absolute left-0 top-0 w-[0.7rem] h-full rounded-[0.32rem] bg-buy bg-buy-text-color flex items-center justify-center text-[0.3rem] font-[600] "
              v-if="currItem.offset == 'buy'">
              <span style="writing-mode:vertical-lr; letter-spacing: 0.06rem;">
                {{ t('market.market_buy_fast_pay') }}
              </span>
            </div>
            <div
              class="absolute left-0 top-0 w-[0.7rem] h-full rounded-[0.32rem] bg-sell bg-sell-text-color flex items-center justify-center text-[0.3rem] font-[600]"
              v-else>
              <span style="writing-mode:vertical-lr; letter-spacing: 0.06rem;">
                {{ t('market.market_buy_fast_sell') }}
              </span>
            </div>

            <div class="info_block flex-1" v-if="currItem.offset == 'buy'">
              <div class="info">
                <div class="amount">{{ currItem.totalprice }}</div>
                <div class="text-color3">
                  {{ t("market.market_buy_list_wait_total") }}({{
                    currItem.currency
                  }})
                </div>
              </div>
              <div class="info">
                <div class="amount">{{ currItem.price }}</div>
                <div class="text-color3">
                  {{ t("market.market_buy_list_wait_price") }}({{
                    currItem.currency
                  }})
                </div>
              </div>
            </div>

            <div class="info_block flex-1" v-else>
              <div class="info">
                <div class="amount">{{ currItem.volume }}</div>
                <div class="text-color3">
                  {{ t("market.market_buy_list_wait_amount") }}({{
                    currItem.crypto
                  }})
                </div>
              </div>
              <div class="info">
                <div class="amount">{{ currItem.price }}</div>
                <div class="text-color3">
                  {{ t("market.market_buy_list_wait_price") }}({{
                    currItem.currency
                  }})
                </div>
              </div>
            </div>

          </div>
          <div class="flex items-center bg-color rounded-[0.32rem] mt-[0.2rem] mx-[0.32rem] relative pl-[0.7rem]">
            <div
              class="absolute left-0 top-0 w-[0.7rem] h-full rounded-[0.32rem] bg-white text-color--bg-light flex items-center justify-center text-[0.3rem] font-[600] leading-[0.4rem]">
              <span style="writing-mode:vertical-lr; letter-spacing: 0.06rem;">
                {{ t('market.market_buy_fast_receive_sim') }}
              </span>
            </div>
            <div class="info_block flex-1" v-if="currItem.offset == 'buy'">
              <div class="info">
                <div class="amount">{{ currItem.volume }}</div>
                <div class="text-color3">
                  {{ t("market.market_buy_list_wait_amount") }}({{
                    currItem.crypto
                  }})
                </div>
              </div>
            </div>
            <div class="info_block flex-1" v-else>
              <div class="info">
                <div class="amount">{{ currItem.totalprice }}</div>
                <div class="text-color3">
                  {{ t("market.market_buy_list_wait_total") }}({{
                    currItem.currency
                  }})
                </div>
              </div>

            </div>

          </div>
        </div>

        <div class="h-[1.36rem]"></div>
        <!-- 按钮 -->
        <div class="max-width btns" v-if="['waitpayment', 'waitconfirm'].includes(currItem.status)">
          <div v-if="currItem.offset == 'buy' && currItem.status == 'waitpayment'" class="btn"
            style="margin-right: 0.32rem" @click="cancelOrder">
            {{ t("market.market_buy_list_cancel_order") }}
          </div>
          <!-- <div v-if="currItem.status == 'waitpayment' && currItem.offset == 'sell'" class="btn">
            {{ t("market.market_buy_list_wait_confirm") }}
          </div> -->
          <div v-if="currItem.offset == 'buy' && currItem.status == 'waitpayment'" class="btn active_btn"
            @click="confirmOrder">
            {{ t("market.market_buy_list_paid") }}
          </div>
          <div v-if="currItem.offset == 'sell' && currItem.status == 'waitconfirm'" class="btn active_btn"
            @click="confirmOrder">
            {{ t("market.market_buy_list_received") }}
          </div>
        </div>

        <div class="h-[0.32rem]"></div>
      </template>

      <!-- 聊天 -->
      <div ref="chatRef" class=" relative" :style="{ height: chatHeight + 'px' }" v-else>
        <Chat :curr-item="currItem" />
      </div>

    </template>

    <!-- 安全密码弹窗 -->
    <SafePassword ref="safeRef" @submit="orderAction" />
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import Top from "@/components/Top.vue";
import router from "@/router";
import { _c2cOrderInfo, _c2cOrderStatus } from "@/api/api";
import { useRoute } from "vue-router";
import { ref, computed, onBeforeUnmount, onMounted, nextTick } from "vue";
import store from "@/store";
import { formatSec2 } from "@/utils/time";
import IconSvg from "@/components/IconSvg.vue";
import { _copyTxt } from "@/utils";
import { closeToast, showLoadingToast, showToast, Loading } from "vant";
import SafePassword from "@/components/SafePassword.vue";
import Chat from "./Chat.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
// 未读消息
const c2cUnread = computed(() => store.state.c2cUnread || {});
const unreadMessage = computed(() => store.state.unreadMessage);
const active = ref(1); // 1-详情 2-聊天
const safeRef = ref();
const offsetEnum = {
  buy: "买入",
  sell: "卖出",
};
const statusEnum = {
  waitpayment: { name: "待付款", title: "待付款", color: "var(--ex-primary-color)" },
  waitconfirm: { name: "待确认", title: "待确认", color: "var(--ex-primary-color)" },
  done: { name: "交易完成", title: "交易完成", color: "var(--ex-success-color)" },
  cancel: { name: "交易已取消", title: "交易完成", color: "var(--ex-text-color3)" },
};

// 订单数据
const currItem = ref({
  order_no: "", // 订单号
  offset: "", // 方向
  crypto: "", // 加密货币
  currency: "", // 计价货币
  price: 0, // 价格
  volume: 0, // 数量
  totalprice: 0, // 总价
  status: "", // 状态
  date: "", // 订单时间，格式：MM-dd hh:mm
  endtime: "", // 结束时间
  bank_status: "", // 银行状态
  bank_name: "", // 银行
  bank_card_number: "", // 银行卡号
  account_name: "", // 账户
  merchant_name: "", // 商户-名称
  merchant_volume: 0, // 商户-成交量
  merchant_volumerate: 0, // 商户-成交率
  merchant_avetime: "", // 商户-平均时效
  unread: 0, // 对话未读消息数
});
const chatRef = ref(null)
const chatHeight = ref(0)

const changeWindowHeight = () => {
  nextTick(() => {
    if (chatRef.value) {
      chatHeight.value = window.innerHeight - chatRef.value.offsetTop
    }
  })
}

// 获取详情
const infoLoading = ref(false);
let firstGet = true
const getInfo = () => {
  if (infoLoading.value) return;
  if (!route.query.order_no) return;
  if (firstGet) {
    infoLoading.value = true;
    firstGet = false
  }
  _c2cOrderInfo({
    order_no: route.query.order_no,
  })
    .then((res) => {
      console.error("--订单详情", res.data);
      Object.assign(currItem.value, res.data);

    })
    .finally(() => {
      setTimeout(() => {
        infoLoading.value = false;
      }, 1000);
    });
};
getInfo();

// 操作状态
const action = ref("");
const loading = ref(false);
// 撤销订单
const cancelOrder = () => {
  if (loading.value) return;
  action.value = "cancel";
  safeRef.value.open();
};
// 下一步
const confirmOrder = () => {
  if (loading.value) return;
  // 购买-待付款-商家未提供银行卡
  if (
    !currItem.value.bank_card_number &&
    currItem.value.offset == "buy" &&
    currItem.value.status == "waitpayment"
  ) {
    getInfo();
    return showToast(t('market.market_buy_list_wait_buyer_bank'));
  }
  action.value = currItem.value.offset == "buy" ? "payment" : "confirm";
  safeRef.value.open();
};
const orderAction = (s) => {
  loading.value = true;
  showLoadingToast({ duration: 0, loadingType: "spinner" });
  _c2cOrderStatus({
    order_no: currItem.value.order_no,
    status: action.value,
    token: sessionToken.value,
    safeword: s,
  })
    .then((res) => {
      if (res.code == 200) {
        setTimeout(() => {
          showToast(
            {
              payment: t('market.market_buy_list_paid_success'),
              confirm: t('market.market_buy_list_pass_success'),
              cancel: t('market.market_buy_list_cancel_success'),
            }[action.value]
          );
        }, 500);
      }
      getInfo();
    })
    .finally(() => {
      setTimeout(() => {
        loading.value = false;
      }, 500);
      closeToast();
      getSessionToken();
    });
};

let interval = null;
let countInterval = null;
onMounted(() => {
  interval = setInterval(() => {
    if (
      currItem.value.status == "waitpayment" ||
      currItem.value.status == "waitconfirm"
    ) {
      getInfo();
    }
  }, 6000);
  countInterval = setInterval(() => {
    if (currItem.value.endtime) {
      currItem.value.endtime--;
      if (currItem.value.endtime == 0) {
        clearInterval(countInterval);
        setTimeout(() => {
          getInfo();
        }, 1000);
      }
    }
  }, 1000);
  window.addEventListener('resize', changeWindowHeight)
});
onBeforeUnmount(() => {
  if (interval) clearInterval(interval);
  if (countInterval) clearInterval(countInterval);
  window.removeEventListener('resize', changeWindowHeight)
});

const goBack = () => {
  router.back();
};

//  复制
const copy = (text) => {
  _copyTxt(text);
  showToast(t('trade.order_info_copy'));
};

// sessionToken
const sessionToken = computed(() => store.state.sessionToken || "");
const getSessionToken = () => {
  store.dispatch("updateSessionToken");
};
getSessionToken();
</script>

<style lang="less" scoped>
.page-detail {
  padding: 1.44rem 0.32rem 0 0.32rem;

  .tabs {
    height: 1rem;
    display: flex;
    margin-bottom: 0.4rem;
    gap: 0.2rem;
    .tab {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ex-text-color2);
      font-weight: 500;
      transition: all ease 0.2s;
      position: relative;
      border: 1px solid var(--ex-border-color);
      height: 100%;
      font-size: 0.36rem;
      border-radius: 0.4rem;
      .hint {
        min-width: 0.26rem;
        height: 0.26rem;
        background-color: var(--ex-error-color);
        padding: 0 0.06rem;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        color: var(--ex-white);
        font-size: 0.18rem;
        font-weight: 400;
        border-radius: 0.13rem;
        margin-left: 0.04rem;
      }
    }

    .tab_active {
      background-color: var(--ex-white);
      color: var(--ex-text-color--bg-light);
    }
  }

  .detail_box {
    background-color: var(--ex-bg-color3);
    border-radius: 0.32rem;
    padding: 0 0.12rem 0.12rem 0.12rem;
    .status {
      min-height: 1rem;
      padding: 0.32rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;

      .status_wait {
        color: var(--ex-text-color3);
        font-size: 0.24rem;
        font-weight: 400;
        line-height: 0.5rem;

        .amount {
          color: var(--ex-text-color);
          font-size: 0.32rem;
          font-weight: 600;
        }

        .time {
          color: var(--ex-error-color);
          font-size: 0.32rem;
          font-weight: 600;
          margin-left: 0.16rem;
        }
      }

      .finish_status {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: var(--ex-text-color3);
        font-size: 0.32rem;
        font-weight: 600;
        line-height: 0.5rem;
      }

      .success_status {
        color: var(--ex-success-color);
      }
    }

    .detail_content {
      padding: 0.2rem 0 0.36rem 0;
      border-radius: 0.32rem;
      position: relative;
      bottom: -1px;
      background-color: var(--ex-bg-color);
      width: calc(100% + 2px);
      left:-1px;

      .bank {
        background-color: var(--ex-bg-color3);
        border-radius: 0.32rem;
        overflow: hidden;
        margin: 0.32rem 0.32rem 0 0.32rem;

        .tr {
          display: flex;
          align-items: stretch;
          border-bottom: 0.08rem solid var(--ex-bg-color);
          min-height: 0.7rem;

          &:nth-last-child {
            border-bottom: none;
          }

          .td {
            flex: 1;
            border-right: 0.08rem solid var(--ex-bg-color);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--ex-text-color2);
            font-size: 0.28rem;
            font-weight: 400;

            .copy {
              width: 0.32rem;
              height: 0.32rem;
              margin-left: 0.08rem;
            }
          }

          .td2 {
            flex: 2;
            border-right: none;
            color: var(--ex-text-color);
            font-size: 0.28rem;
            font-weight: 400;
          }
        }
      }

      .bank_none {
        padding-top: 0.4rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .img {
          width: 1.82rem;
          height: 1.46rem;
        }

        .name {
          color: var(--ex-text-color3);
          font-size: 0.24rem;
          font-weight: 400;
          margin-top: 0.2rem;
        }
      }

      .seller {
        padding: 0 0.32rem;

        .avatar {
          width: 0.48rem;
          height: 0.48rem;
          margin-right: 0.12rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background-color: var(--ex-white);
          color: var(--ex-text-color--bg-light);
          font-size: 0.24rem;
          font-weight: 600;
        }

        .title {
          color: var(--ex-text-color);
          font-size: 0.32rem;
          font-weight: 400;
        }

        .info {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          color: var(--ex-text-color3);
          font-size: 0.24rem;
          font-weight: 400;
        }

        .line {
          width: 1px;
          height: 0.24rem;
          background-color: var(--ex-text-color3);
          margin: 0 0.12rem;
        }
      }
    }
  }

  .order {
    background-color: var(--ex-bg-color3);
    border-radius: 0.32rem;
    margin-top: 0.2rem;

    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.2rem 0.32rem;
      border-bottom: 1px solid var(--ex-border-color);
      color: var(--ex-text-color3);
      font-size: 0.24rem;
      font-weight: 400;

      .order_no {
        color: var(--ex-text-color2);
        font-size: 0.28rem;
        font-weight: 400;
      }

      .copy_icon {
        width: 0.32rem;
        height: 0.32rem;
        cursor: pointer;
        margin-left: 0.1rem;
      }
    }

    .info_block {
      display: flex;
      align-items: stretch;
      padding: 0.28rem 0.32rem 0.32rem 0.32rem;

      .info {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--ex-text-color2);
        font-size: 0.24rem;
        font-weight: 400;
        line-height: 0.28rem;

        .amount {
          margin-bottom: 0.2rem;
          color: var(--ex-text-color);
          text-align: center;
          font-size: 0.32rem;
          font-weight: 600;
          line-height: 0.32rem;
        }
      }
    }
  }

  .btns {
    width: 100%;
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0.4rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 0 0.32rem;
    justify-content: space-between;

    .btn {
      flex: 2;
      height: 100%;
      height: 0.96rem;
      border-radius: 1.26rem;
      background-color: var(--ex-bg-color3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ex-text-color);
      text-align: center;
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
    }

    .active_btn {
      flex: 3;
      background-color: var(--ex-primary-color);
      border-color: var(--ex-primary-color);
      color: var(--ex-text-color--bg-primary);
      font-weight: 600;
    }
  }
}

.loading_box {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
