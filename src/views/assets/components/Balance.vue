<!-- 余额 -->
<template>
  <div class="assets_balance">
    <div class="assets_balance-ul">
      <div class="assets_balance-li" v-for="i in 4" :key="i">
        <div class="assets_balance-text">美元/银行卡</div>
        <div class="assets_balance-price">34444130</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Icon, SwipeCell, Tabs, Tab } from "vant";
</script>

<style lang="less">
.assets_balance {
  padding: 0 0.32rem;
  .assets_balance-ul {
    .assets_balance-li {
      display: flex;
      justify-content: space-between;
      height: 1.44rem;
      border-bottom: 0.02rem solid #eaeaea;
      .assets_balance-text {
        color: #36394c;
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 600;
        line-height: 1.44rem;
      }
      .assets_balance-price {
        color: #000;
        text-align: right;
        font-size: 0.32rem;
        font-style: normal;
        font-weight: 700;
        line-height: 1.44rem;
      }
    }
  }
}
</style>
