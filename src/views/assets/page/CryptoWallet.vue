<!-- 现金账户 -->
<template>
  <div class="page_assets_future">
    <div class="tabs">
      <div class="tab_title">
        <Switch v-model="show0" size="0.2rem" />
        <span class="tab_title_desc text-[0.24rem]">{{
          show0 ? $t("assets.coin_list_hide") : $t("assets.coin_list_show")
        }}</span>
      </div>

      <!-- <CurrencyItem v-for="(item, i) in wallet" :item="item" :switchs="switchs" :i="i" :key="i" @switchOpen="switchOpen" /> -->
      <CurrencyList @click="(val) => click(val)" :list="wallet" :type="'contract'"/>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon, Switch } from 'vant'
import store from '@/store'
import router from '@/router'
import { _cryptoCoin } from '@/api/api'
import CurrencyItem from './components/CurrencyItem.vue'
import CurrencyList from './components/CurrencyList.vue'

const emits = defineEmits(["setLoading", 'click']);
const token = computed(() => store.state.token || "");

// 刷新现金钱包

const elseWalletMap = computed(() => store.state.elseWalletMap || []);
const wallet = computed(() => {
  if (show0.value)
    return elseWalletMap.value["futures"].filter((item) => item.amount);
  return elseWalletMap.value["futures"];
});

const getAssets = () => {
  if (!token.value) return;
  // emits('setLoading', true)
  store.dispatch("updateWallet", "futures").finally(() => {
    emits("setLoading", false);
  });
  // store.dispatch('updateOrderHint')
}
const show0 = ref(true) // 是否隐藏余额为0的钱包

_cryptoCoin({ dedup: false }).then(res => {
  store.commit('setCoinMap', res.data || [])
})

// 展开状态
const switchs = ref([])
const switchOpen = (i) => {
  switchs.value[i] = !switchs.value[i]
  switchs.value = switchs.value.map((item, index) => {
    return i == index ? item : false
  })
}

const removeSwitch = () => {
  switchs.value = switchs.value.map(() => {
    return false;
  });
};

const click = (val) => {
  emits('click', val)
}

onMounted(() => {
  getAssets();
  document.querySelector(".page").addEventListener("click", removeSwitch);
});
onUnmounted(() => {
  try {
    document.querySelector(".page").removeEventListener("click", removeSwitch);
  } catch {}
});

const refresh = () => {
  getAssets();
};
defineExpose({
  refresh,
});
</script>

<style lang="less" scoped>
.page_assets_future {
  padding: 0.9rem 0 0.32rem 0;

  position: relative;
  .top {
    font-size: 0.28rem;
    font-weight: 400;
    display: flex;
    align-items: center;
    height: 0.32rem;
    line-height: 0.32rem;
    .title {
      color: var(--ex-white);
      margin-right: 0.12rem;
      font-size: 0.3rem;
      span {
        font-size: 0.24rem;
      }
    }

    .eyes {
      width: 0.32rem;
      height: 0.32rem;
      color: var(--ex-white);
    }
  }

  .money {
    color: var(--ex-white);
    font-family: "PingFang SC";
    font-size: 0.52rem;
    font-style: normal;
    font-weight: 600;
    line-height: 0.6rem;
    margin-top: 0.26rem;
    padding-bottom: 0.4rem;
  }

  .navs {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.32rem;
    background-color: var(--ex-bg-color);
    border-radius: 0.32rem;
    margin-top: 0.34rem;
    .line {
      width: 1px;
      height: 0.76rem;
      background-color: var(--ex-bg-color3);
    }
    .nav {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .nav_label {
      color: var(--ex-text-color3);
      font-size: 0.28rem;
      line-height: 100%;
    }

    .num {
      color: var(--ex-text-color);
      font-size: 0.3rem;
      font-weight: 600;
      line-height: 0.3rem;
      margin-top: 0.2rem;
    }
  }

  .tab_title {
    height: 0.52rem;
    display: flex;
    align-items: center;
    margin-bottom: 0.28rem;

    &_desc {
      color: var(--ex-text-color3);
      font-size: 0.24rem;
      margin-left: 0.12rem;
    }
  }

  .tabs {
    position: relative;
    padding: 0 0.32rem;
   
  }
}
</style>
