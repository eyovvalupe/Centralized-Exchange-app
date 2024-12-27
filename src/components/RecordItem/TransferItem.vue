<!-- 划转记录 -->
<template>
  <div class="transfer_item">
    <div class="item_box flex justify-between">
      <div class="flex items-center">
        <span class="item_icon" v-if="item.account_from"><img
            :src="getStaticImgUrl(`/static/img/crypto/${item.account_from.toUpperCase()}.png`)" alt="currency" /></span>
        <span>{{
          dataMap[item.account_from] + `(${item.from})` || "未知"
        }}</span>
      </div>
      <span class="amount">{{ item.amount_from }}</span>
    </div>
    <div class="item_box flex justify-between">
      <div class="icon_to">
        <img :src="getStaticImgUrl(`/static/icons/trans5.svg`)" alt="">
      </div>
      <div class="flex items-center">
        <span class="item_icon"><img :src="getStaticImgUrl(`/static/img/crypto/${item.account_to.toUpperCase()}.png`)"
            alt="currency" /></span>
        <span>{{
          dataMap[item.account_to] + `(${item.to})` || "未知"
        }}</span>
      </div>
      <span class="amount">{{ item.amountt_to }}</span>
    </div>
    <div class="time">{{ formatDate(item.created) }}</div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { _accountMap } from "@/utils/dataMap";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  item: {
    type: Object,
    default: () => { },
  },
});

const dataMap = {
  money: t('transfer.transfer_map_money'),
  stock: t('transfer.transfer_map_stock'),
  futures: t('transfer.transfer_map_futures'),
  forex: t('transfer.transfer_map_forex'),
  blacktrade: t('transfer.transfer_map_blacktrade'),

}

const formatDate = (date) => {
  const currentDate = new Date();
  const newDate = date.split(" ");
  const newDate1 = newDate[0].split("-");
  const isToday =
    newDate1[2] == currentDate.getDate().toString() &&
    newDate1[1] == currentDate.getMonth().toString() &&
    newDate1[0] == currentDate.getFullYear().toString();
  if (isToday) {
    return `今天 ${newDate[1]}`
  } else return `${newDate1[1]}/${newDate1[2]} ${newDate[1]}`;

};
</script>

<style lang="less" scoped>
.transfer_item {
  margin-top: 0.2rem;
  width: calc(100% - 0.02rem);
  background-color: var(--ex-bg-color2);
  border: 1px solid var(--ex-border-color);
  border-radius: 0.32rem;
  overflow: hidden;

  .item_box {
    background-color: #fff;
    border: 1px solid var(--ex-border-color);
    align-items: center;
    padding: 0.3rem 0.32rem;
    border-radius: 0.32rem;
    position: relative;
    width: calc(100% + 2px);
    left: -1px;
  }

  .item_box:first-child {
    top: -1px;
  }

  .item_box+.item_box {
    margin-top: 0.12rem;
  }

  .item_icon {
    width: 0.4rem;
    height: 0.4rem;
    margin-right: 0.12rem;
  }

  .icon_to {
    width: 0.48rem;
    position: absolute;
    left: 50%;
    margin-left: -0.24rem;
    top: -0.3rem;
    height: 0.48rem;
  }

  .time {
    color: var(--ex-text-color3);
    font-weight: 400;
    font-size: 0.24rem;
    line-height: 100%;
    padding: 0.16rem 0;
    text-align: center;
  }

  .amount {
    font-size: 0.3rem;
    font-weight: 600;
  }
}
</style>
