<!-- 划转记录 -->
<template>
  <div class="transfer_item">
    <div class="item_box flex justify-between">
      <div class="flex items-center">
        <span class="item_icon"
        v-if="item.account_from"
          ><img
            :src="`/static/img/crypto/${item.account_from.toUpperCase()}.png`"
            alt="currency"
        /></span>
        <span>{{
          _accountMap[item.account_from] + `(${item.from})` || "未知"
        }}</span>
      </div>
      <span class="amount">{{ item.amount_from }}</span>
    </div>

    <div class="item_box flex justify-between">
      <div class="icon_to">
        <ChangeIcon/>
      </div>
      <div class="flex items-center">
        <span class="item_icon"
          ><img
            :src="`/static/img/crypto/${item.account_to.toUpperCase()}.png`"
            alt="currency"
        /></span>
        <span>{{
          _accountMap[item.account_to] + `(${item.to})` || "未知"
        }}</span>
      </div>
      <span class="amount">{{ item.amountt_to }}</span>
    </div>
    <div class="time">{{ formatDate(item.created) }}</div>
  </div>
</template>

<script setup>
import { _accountMap } from "@/utils/dataMap";
import ChangeIcon from "@/views/assets/page/icons/ChangeIcon.vue";
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
});

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
  background-color: #f5f7fc;
  border: 1px solid #eff3f8;
  border-radius: 0.32rem;
  overflow: hidden;
  .item_box {
    background-color: #fff;
    border: 1px solid #eff3f8;
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
  .item_box + .item_box {
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
    color: #8f92a1;
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
