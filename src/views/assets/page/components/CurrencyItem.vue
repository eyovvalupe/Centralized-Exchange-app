<template>
  <div class="tab" :class="{ open_tab: switchs[i] == true }" @click="switchOpen(i, $event)">
    <div class="tab_icon">
      <img :src="getStaticImgUrl(`/static/img/crypto/${item.name}.svg`)" class="rounded-full" alt="img" />
    </div>
    <div class="name">{{ item.name }}</div>
    <div class="amount">{{ item.amount }}</div>
    <div class="more">
      <img :src="getStaticImgUrl('/static/img/common/menu.svg')" alt="img" />
    </div>
    <div class="rights">
      <div class="right px-[0.1rem]" @click="goTopUp(item.currency.toUpperCase())" v-if="item.type == 'crypto'">
        {{ t('assets.recharge') }}
      </div>
      <div class="right right--disabled px-[0.1rem]" v-else>
        {{ t('assets.recharge') }}
      </div>
      <div class="right right--yellow px-[0.1rem]" @click="goWithdraw(item.currency.toUpperCase())"
        v-if="item.type == 'crypto'">
        {{ t('assets.withdraw') }}
      </div>
      <div class="right right--yellow right--disabled px-[0.1rem]" v-else>
        {{ t('assets.withdraw') }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import router from "@/router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  i: Number,
  item: {
    type: Object,
    default: () => { },
  },
  switchs: {
    type: Array,
    default: () => [],
  },
});
const emits = defineEmits(["switchOpen"]);
// 展开状态
const switchOpen = (i, e) => {
  emits("switchOpen", i);
  e.stopPropagation();
};

// 跳转充值
const goTopUp = (name) => {
  router.push({
    name: "topUpCrypto",
    query: {
      currency: name,
    },
  });
};

// 跳转提现
const goWithdraw = (name) => {
  router.push({
    name: "withdraw",
    query: {
      currency: name,
    },
  });
};
</script>

<style lang="less" scoped>
.tab {
  padding: 0 0.32rem;
  overflow: hidden;
  height: 1.04rem;
  margin-top: 0.12rem;
  border-radius: 0.32rem;
  background: var(--ex-bg-white2);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .name {
    font-size: 0.3rem;
  }

  &:active {
    background-color: rgba(237, 237, 237, 0.87);
  }

  .tab_icon {
    width: 0.52rem;
    height: 0.52rem;
    margin-right: 0.16rem;
    background-color: var(--ex-bg-color);
    border-radius: 50%;
    box-sizing: border-box;
    padding: 0.1rem;
  }

  .more {
    width: 0.3rem;
    height: 0.3rem;
  }

  .amount {
    flex: 1;
    text-align: right;
    padding: 0 0.2rem;
    font-size: 0.32rem;
    font-weight: 600;
    transition: 0.3s;
  }

  .rights {
    display: flex;
    height: 100%;
    position: absolute;
    right: -100%;
    top: 0;
    transition: 0.3s;

    .right {
      height: 100%;
      min-width: 1.04rem;
      // width: max-content;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 0.3rem;
      font-weight: 400;
      text-align: center;
      color: var(--ex-text-color--bg-primary);
      background-color: var(--ex-primary-color);
    }

    .right--yellow {
      background-color: #ffaf2a;
    }

    .right--green {
      background-color: var(--ex-success-color);
    }

    .right--red {
      background-color: var(--ex-error-color);
    }

    .right--disabled {
      background-color: #9cb9ff;
    }

    .right--disabled.right--yellow {
      background-color: #ebcc9a;
    }

    .right:first-child {
      border-radius: 0.32rem 0rem 0rem 0.32rem;
    }

    .right:last-child {
      border-radius: 0rem 0.32rem 0.32rem 0rem;
    }
  }
}

.open_tab {
  .name {
    display: none;
  }

  .amount {
    text-align: left;
    padding: 0px;
  }

  .rights {
    right: 0;
  }
}
</style>
