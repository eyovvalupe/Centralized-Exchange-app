<!-- 记录 -->
<template>
  <div class="assets_record">
    <div class="assets_record-ul">
      <div class="assets_record-li" v-for="i in 4" :key="i">
        <div class="assets_record-name">
          <div class="assets_record-name-n">美元/银行卡</div>
          <div class="assets_record-time">04-08 10:00:00</div>
        </div>
        <div class="assets_record-p">+34444130</div>
        <div>
          <div class="assets_record-button" v-if="i == 1 || i == 4">成功</div>
          <div class="assets_record-button fail" v-if="i == 2">失败</div>
          <div class="assets_record-button unkonw" v-if="i == 3">未知</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
</script>

<style lang="less">
.assets_record {
  padding: 0 0.32rem;
  .assets_record-ul {
    .assets_record-li {
      display: flex;
      justify-content: space-between;
      border-bottom: 0.02rem solid #eaeaea;
      height: 1.44rem;
      .assets_record-p {
        color: #000;
        font-size: 0.32rem;
        font-style: normal;
        font-weight: 700;
        line-height: 1.44rem;
      }
      .assets_record-button {
        width: 1.16rem;
        height: 0.44rem;
        background: #ecf1fe;
        color: #014cfa;
        text-align: center;
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 500;
        line-height: 0.44rem;
        margin-top: 0.5rem;
      }
      .fail {
        background: #fbf1ef;
        color: #e8503a;
      }
      .unkonw {
        background: #efefef;
        color: #3f3f3f;
      }
      .assets_record-name-n {
        color: #36394c;
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.42rem;
        margin-bottom: 0.1rem;
        margin-top: 0.28rem;
      }
      .assets_record-time {
        color: #919193;
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.36rem;
      }
    }
  }
}
</style>
