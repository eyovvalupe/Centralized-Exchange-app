<template>
  <div class="btns">
    <div class="btn-item" @click="jump('topUpCrypto', true)">
      <div class="btn-item__icon">
        <img :src="getStaticImgUrl(`/static/img/assets/deposit.svg`)" alt="">
      </div>
      <div class="btn-item__name">{{ $t("assets.recharge") }}</div>
    </div>
    <div class="btn-item" @click="jump('withdraw', true)">
      <div class="btn-item__icon">
        <img :src="getStaticImgUrl(`/static/img/assets/withdraw.svg`)" alt="">
      </div>
      <div class="btn-item__name">{{ $t("assets.withdraw") }}</div>
    </div>
    <div class="btn-item" @click="jump('transfer')">
      <div class="btn-item__icon">
        <img :src="getStaticImgUrl(`/static/img/assets/transfer.svg`)" alt="">
      </div>
      <div class="btn-item__name">{{ $t("assets.transfer") }}</div>
    </div>
    <div class="btn-item" @click="jump('recordList', true)">
      <div class="btn-item__icon">
        <img :src="getStaticImgUrl(`/static/img/assets/record.svg`)" alt="">
      </div>
      <div class="btn-item__name">{{ $t("assets.financialRecords") }}</div>
    </div>
  </div>
  <!-- <ActionSheet
    v-model:show="showAS"
    teleport="body"
    :actions="actions"
    :title="$t('记录列表')"
    @select="onSelect"
  /> -->
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { useI18n } from "vue-i18n";
import { ActionSheet } from "vant";
import router from "@/router";
const { t } = useI18n();
const jump = (name, check = false, query) => {
  router.push({
    name,
    query,
  });
};

const hintNum = computed(() => store.state.hintNum || 0);

const showAS = ref(false);

const onSelect = (item) => {
  showAS.value = false;
  router.push({
    name: "recordList",
    query: {
      tab: item.value,
    },
  });
};
</script>
<style lang="less" scoped>
.btns {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.32rem 0.32rem 0.32rem;
}

.btn-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  &__icon {
    border-radius: 0.32rem;
    background: rgba(1, 76, 250, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 0.8rem;
    height: 0.8rem;

    span {
      display: block;
      width: 0.56rem;
      height: 0.56rem;
    }
  }

  &__name {
    color: #061023;
    text-align: center;
    font-size: 0.3rem;
    font-weight: 400;
    line-height: 0.44rem;
    margin-top: 0.08rem;
  }
}
</style>
