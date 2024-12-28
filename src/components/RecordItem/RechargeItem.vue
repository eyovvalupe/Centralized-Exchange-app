<!-- 充值记录-元素 -->
<template>
  <div class="recgarge_item" @click="goInfo">
    <div class="icon_box" v-if="item.currency">
      <img :src="getStaticImgUrl(`/static/img/crypto/${item.currency.toUpperCase()}.svg`)" alt="currency" />
    </div>
    <div class="content">
      <div class="item_title">{{ item.currency }}</div>
      <!-- <div class="address">{{ item.address }}</div> -->
      <div class="time">{{ item.date ? formatDate(item.date) : "--" }}</div>
    </div>
    <div class="right">
      <div class="amount">{{ item.amount }}</div>
      <div class="status" :class="['status_' + item.status]">
        {{
          item.status == "review"
            ? $t("topUpStatusMap.review")
            : item.status == "success"
              ? $t("topUpStatusMap.success")
              : item.status == "failure"
                ? $t("topUpStatusMap.failure")
                : $t("topUpStatusMap.unknown")
        }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import router from "@/router";
import { _topUpStatusMap } from "@/utils/dataMap";
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
  if (props.item.status == "success" || props.item.status == "failure") {
    router.push({
      name: "rechargeInfo",
      query: {
        order_no: props.item.order_no,
      },
    });
  } else {
    router.push({
      name: "recharging",
      query: {
        order_no: props.item.order_no,
      },
    });
  }
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
.recgarge_item {
  width: 6.86rem;
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0.32rem;
  border: 0.02rem solid #d0d8e2;
  border-radius: 0.32rem;
  margin-top: 0.2rem;

  .icon_box {
    width: 0.84rem;
    height: 0.84rem;
  }

  .content {
    margin-top: 0.08rem;
    padding: 0 0.16rem;
    flex: 1;
    display: flex;
    flex-direction: column;

    .item_title {
      color: #061023;
      font-size: 0.3rem;
      font-weight: 400;
      line-height: 0.3rem;
    }

    .address {
      color: #121212;
      font-weight: 400;
      font-size: 0.28rem;
    }

    .time {
      color: #8f92a1;
      font-size: 0.24rem;
      font-weight: 400;
      line-height: 0.24rem;
      margin-top: 0.2rem;
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
