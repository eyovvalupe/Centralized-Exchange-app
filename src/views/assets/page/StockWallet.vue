<!-- 现金账户 -->
<template>
  <div class="page_assets_stock">
    <div class="tabs">
      <div class="tab_title">
        <Switch v-model="show0" size="0.2rem" />
        <span class="tab_title_desc">{{ show0 ? $t("assets.coin_list_hide") : $t("assets.coin_list_show") }}</span>
      </div>

      <!-- <CurrencyItem v-for="(item, i) in wallet" :item="item" :switchs="switchs" :i="i" :key="i" @switchOpen="switchOpen" /> -->
      <CurrencyList @click="(val) => click(val)" :list="wallet" :type="'stock'" />

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon, Switch } from 'vant'
import store from '@/store'
import { _cryptoCoin } from '@/api/api'
import CurrencyList from './components/CurrencyList.vue';

const { t } = useI18n();
const emits = defineEmits(['setLoading', 'click'])
const token = computed(() => store.state.token || '')
const hidden = ref(false)

// 刷新现金钱包
const assets = computed(() => store.state.assets || {})
const wallet1 = computed(() => store.state.wallet || []) // 钱包
const elseWalletMap = computed(() => store.state.elseWalletMap || [])
const elseWallet = computed(() => store.state.elseWallet || [])
const wallet = computed(() => {
  if (show0.value) return elseWalletMap.value['stock'].filter(item => item.amount)
  return elseWalletMap.value['stock']
})

const mainWallet = computed(() => (store.state.wallet || []).find(a => a.currency == 'main') || {}) // 主钱包
const getAssets = () => {
  if (!token.value) return
  // emits('setLoading', true)
  store.dispatch('updateWallet', 'stock').finally(() => {
    emits('setLoading', false)
  })
  // store.dispatch('updateOrderHint')
}
const show0 = ref(true) // 是否隐藏余额为0的钱包
const coinMap = computed(() => store.state.coinMap || {})

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
    return false
  })
}

const click = (val) => {
  emits('click', val)
}

onMounted(() => {
  getAssets()
  document.querySelector('.page').addEventListener('click', removeSwitch)
})
onUnmounted(() => {
  try {
    document.querySelector('.page').removeEventListener('click', removeSwitch)
  } catch { }
})

const refresh = () => {
  getAssets()
}
defineExpose({
  refresh,
})

</script>

<style lang="less" scoped>
.page_assets_stock {
  padding: 0.9rem 0 0.32rem 0;

  :deep(.van-switch__node) {
    background-color: var(--ex-black);
    width: 0.1rem;
    height: 0.1rem;
    top: 0.075rem;
    left: 0.1rem;
  }

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

    .tab {
      padding: 0 0.32rem;
      overflow: hidden;
      height: 1.04rem;
      margin-top: 0.12rem;
      border-radius: 0.32rem;
      background: var(--ex-bg-color2);
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
        transition: .3s;
      }

      .rights {
        display: flex;
        height: 100%;
        position: absolute;
        right: -100%;
        top: 0;
        transition: .3s;

        .right {
          height: 100%;
          width: 1.04rem;
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
          background-color: #FFAF2A;
        }

        .right--green {
          background-color: var(--ex-success-color);
        }

        .right--red {
          background-color: var(--ex-error-color);
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
  }

}
</style>
