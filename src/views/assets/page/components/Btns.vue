<template>
  <div class="btns">
    <div class="btn-item" @click="jump('topUpCrypto', true)">
      <div class="btn-item__icon">
        <div class="size-[0.54rem]">
          <img :src="getStaticImgUrl(`/static/img/assets/deposit.svg`)" alt="">
        </div>
      </div>
      <div class="btn-item__name">{{ $t("assets.recharge") }}</div>
    </div>
    <div class="btn-item" @click="jump('withdraw', true)">
      <div class="btn-item__icon">
        <div class="size-[0.54rem]">
          <img :src="getStaticImgUrl(`/static/img/assets/withdraw.svg`)" alt="">
        </div>
      </div>
      <div class="btn-item__name">{{ $t("assets.withdraw") }}</div>
    </div>
    <div class="btn-item" @click="jump('transfer')">
      <div class="btn-item__icon">
        <div class="size-[0.54rem]">
          <img :src="getStaticImgUrl(`/static/img/assets/transfer.svg`)" alt="">
        </div>
      </div>
      <div class="btn-item__name">{{ $t("assets.transfer") }}</div>
    </div>
    <div class="btn-item" @click="jump('recordList', true)">
      <div class="btn-item__icon">
        <div class="size-[0.54rem]">
          <img :src="getStaticImgUrl(`/static/img/assets/record.svg`)" alt="">
        </div>
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
  justify-content: space-between;
  padding: 0 0.6rem 0.32rem 0.6rem;
}

.btn-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;

  &__icon {
    border-radius: 0.6rem;
    background: var(--ex-bg-color3);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 0.96rem;
    height: 0.96rem;

  }

  &__name {
    color: var(--ex-text-color);
    text-align: center;
    font-size: 0.3rem;
    font-weight: 400;
    line-height: 0.44rem;
    position: absolute;
    top: 1rem;
    width: max-content;
  }
}
</style>
