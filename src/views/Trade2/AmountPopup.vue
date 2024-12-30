<template>
  <Popup teleport="body" v-model:show="showModel" position="center" round closeable>
    <div class="amount_popup">
      <div class="amount_popup_title">{{ t('trade.ai_opening_pop_title') }}</div>
      <div class="amount_popup_content">
        <div class="left">{{ props.name }}</div>
        <div class="right">
          <div class="currency">
            <div class="currency_icon">
              <img :src="getStaticImgUrl(`/static/img/crypto/${props.currency}.svg`)" alt="" />
            </div>
            <div>{{ props.currency }}</div>
          </div>
          <div class="amount">{{ props.amount }}</div>
        </div>
      </div>
      <div class="amount_popup_btns">
        <div class="btn" @click="jump('topUpCrypto')">{{ t('trade.ai_opening_pop_recharge') }}</div>
        <div class="btn btn2" @click="jump('transfer')">{{ t('trade.ai_opening_pop_transfer') }}</div>
      </div>
    </div>
  </Popup>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { Popup } from "vant";
import { ref } from "vue";
import router from "@/router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  amount: {
    type: [String, Number],
    default: "",
  },
  currency: {
    type: String,
    default: "",
  },
});

const showModel = ref(false);
const open = () => {
  showModel.value = true;
};
const jump = (name) => {
  showModel.value = false;
  router.push({
    name: name,
  });
};

defineExpose({
  open,
});
</script>

<style lang="less" scoped>
.amount_popup {
  width: 6.22rem;
  padding: 0.36rem 0.32rem;

  .amount_popup_title {
    color: var(--ex-text-color);
    text-align: center;
    font-size: 0.32rem;
    font-weight: 500;
    line-height: 0.44rem;
    margin-bottom: 0.26rem;
    width: 100%;
  }

  .amount_popup_content {
    width: 100%;
    border-radius: 0.32rem;
    border: 1px solid var(--ex-border-color);
    height: 1.52rem;
    margin-bottom: 0.52rem;
    display: flex;
    align-items: center;

    .left {
      padding: 0 0.3rem;
      color: var(--ex-text-color);
      font-size: 0.32rem;
      font-weight: 400;
    }

    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: var(--ex-bg-color2);
      height: 100%;

      .currency {
        display: flex;
        align-items: center;
        color: var(--ex-text-color);
        font-size: 15px;
        font-weight: 400;

        .currency_icon {
          width: 0.4rem;
          height: 0.4rem;
          margin-right: 0.12rem;
        }
      }

      .amount {
        color: var(--ex-primary-color);
        font-size: 0.52rem;
        font-weight: 600;
        line-height: 0.32rem;
        margin-top: 0.3rem;
      }
    }
  }

  .amount_popup_btns {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .btn {
      width: 2.66rem;
      height: 0.8rem;
      border-radius: 1rem;
      border: 1px solid var(--ex-primary-color);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ex-primary-color);
      font-size: 0.32rem;
      font-weight: 400;
    }

    .btn2 {
      background-color: var(--ex-primary-color);
      color: var(--ex-text-color--bg-primary);
    }
  }
}
</style>
