<!-- 未登录 -->
<template>
  <div class="unlogin_box">
    <NoData :tip="''" />
    <div class="unlogin" @click="goLogin">
      <span>{{ t('trade.stock_position_unlogin_title') }}</span>
      <span class="link">{{ t('trade.stock_position_unlogin_con') }}</span>
    </div>
  </div>
</template>

<script setup>
import NoData from "./NoData.vue";
import router from "@/router";
import { useRoute } from "vue-router";
import eventBus from "@/utils/eventBus";
import store from "@/store";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const route = useRoute();
const emits = defineEmits(["loginfinish"]);

const goLogin = () => {
  // router.push({
  //     name: 'login',
  //     query: {
  //         reurl: route.name
  //     }
  // })
  store.commit("setIsLoginOpen", true);
  eventBus.on("loginSuccess", () => {
    emits("loginfinish");
    eventBus.off("loginSuccess");
  });
};
</script>

<style lang="less" scoped>
.unlogin_box {
  .unlogin {
    text-align: center;
    color: #a5afba;
    position: relative;
    top: -1rem;

    .link {
      color: #014cfa;
    }
  }
}
</style>
