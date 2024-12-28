<!-- 提现记录-元素 -->
<template>
  <div class="withdraw_item" @click="goInfo" v-if="item.account">
    <div class="icon_box">
      <img v-if="item.currency" :src="getStaticImgUrl(`/static/img/crypto/${item.currency}.svg`)" alt="">
      <img v-if="item.account && item.account.bank_name" :src="getStaticImgUrl('/static/img/bank/card_type_b.svg')"
        alt="img" />
    </div>
    <div class="content">
      <div class="address">
        {{
          item.account && item.account.address
            ? getAddress(item.account.address)
            : getAddress(item.account.bank_card_number)
        }}
      </div>
      <div class="item_title">
        {{
          item.account && item.account.channel == "crypto"
            ? item.account.symbol.toUpperCase()
            : item.account.bank_name
        }}
      </div>
      <div class="time">{{ formatDate(item.date) }}</div>
    </div>
    <div class="right">
      <div class="amount">{{ parseFloat(item.amount).toFixed(2) }}</div>
      <div class="status" :class="['status_' + item.status]">
        {{
          item.status == "review"
            ? $t("withdrawStatusMap.review")
            : item.status == "success"
              ? $t("withdrawStatusMap.success")
              : item.status == "failure"
                ? $t("withdrawStatusMap.failure")
                : $t("withdrawStatusMap.unknown")
        }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import router from "@/router";
import { _withdrawStatusMap } from "@/utils/dataMap";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  item: {
    type: Object,
    default: () => { },
  },
});

const emits = defineEmits(["close"]);
const goInfo = () => {
  emits("close");
  router.push({
    name: "withdrawInfo",
    query: {
      order_no: props.item.order_no,
    },
  });
};
const getAddress = (address) => {
  if (!address) {
    return "--";
  }
  return "**** **** **** " + address.substr(address.length - 4);
};

const formatDate = (date) => {
  const currentDate = new Date();
  const newDate = date.split(" ");
  const newDate1 = newDate[0].split("-");
  const isToday =
    newDate1[2] == currentDate.getDate().toString() &&
    newDate1[1] == currentDate.getMonth().toString() &&
    newDate1[0] == currentDate.getFullYear().toString();

  const isYesterday =
    newDate1[2] + 1 == currentDate.getDate().toString() &&
    newDate1[1] == currentDate.getMonth().toString() &&
    newDate1[0] == currentDate.getFullYear().toString();
  if (isToday) {
    return `今天 ${newDate[1]}`;
  } else if (isYesterday) {
    return `昨天 ${newDate[1]}`;
  } else return `${newDate1[1]}/${newDate1[2]} ${newDate[1]}`;
};
</script>

<style lang="less" scoped>
.withdraw_item {
  width: calc(100% - 0.02rem);
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0.32rem;
  border: 1px solid #d0d8e2;
  border-radius: 0.32rem;
  margin-top: 0.2rem;

  .icon_box {
    width: 0.8rem;
    height: 0.8rem;
  }

  .content {
    padding: 0 0.2rem;
    flex: 1;
    display: flex;
    flex-direction: column;

    .address {
      color: #061023;
      font-size: 0.3rem;
      font-weight: 400;
      line-height: 0.3rem;
      margin-top: 0.1rem;
    }

    .item_title {
      color: #121212;
      font-weight: 400;
      margin-top: 0.08rem;
      font-size: 0.28rem;
    }

    .time {
      color: #8f92a1;
      font-size: 0.24rem;
      font-weight: 400;
      line-height: 0.24rem;
      margin-top: 0.28rem;
    }
  }

  .right {
    height: 100%;
    text-align: right;
    line-height: 0.3rem;

    .amount {
      font-size: 0.3rem;
      color: #000000;
      font-weight: 600;
    }

    .status {
      font-size: 0.28rem;
      color: #014cfa;
      margin-top: 0.14rem;
    }

    .status_success {
      color: #18b762;
    }

    .status_failure {
      color: #8f92a1;
    }
  }
}
</style>
