<!-- 自选买卖 二级页面 -->
<template>
  <div class="page-deal">
    <Top class="!z-20">
      <template #title>
        <span class="flex items-center justify-center">
          <span class="mr-[0.16rem]" v-if="info.currCrypto">
            <img class="size-[0.52rem] rounded-50"
              :src="getStaticImgUrl(`/static/img/crypto/${info.currCrypto.toUpperCase()}.svg`)" alt="currency" />
          </span>
          {{ title }}{{ info.currCrypto }}

        </span>
      </template>
    </Top>

    <!-- 买入 -->
    <div class="form">
      <!-- 信息 -->
      <div class="info">
        <div class="flex items-center pt-[0.12rem] pb-[0.36rem] px-[0.16rem]">
          <div class="avatar">
            {{ info.merchant?.slice(0, 1) }}
          </div>
          {{ info.merchant }}
        </div>
        <div class="flex justify-between px-[0.3rem] py-[0.4rem] items-center bg-color rounded-[0.32rem]">
          <div class="info_item">
            {{ info.price }}
            <span class="text-12 font-normal">{{ info.currWallet }}</span>
          </div>
          <div class="text-14 text-color3">
            <div>{{ t('market.market_buy_optional_order_limit') }}</div>
            <div class="mt-[0.16rem] text-color">{{ info.limitmin }}-{{ info.limitmax }}</div>
          </div>
        </div>
      </div>

      <template v-if="info.offset == 'buy'">

        <div class="item bg-color3 rounded-[0.32rem] mt-[0.32rem] px-[0.28rem] py-[0.18rem]">
          <div class="flex justify-between items-center">
            <div class="text-[0.3rem]">{{ t('market.market_buy_list_amount') }}</div>
            <div class="flex items-center justify-center h-[0.88rem] px-[0.16rem] bg-color rounded-[0.32rem]">
              <span class="mr-[0.16rem]" v-if="info.currCrypto">
                <img class="size-[0.52rem] rounded-50"
                  :src="getStaticImgUrl(`/static/img/crypto/${info.currCrypto.toUpperCase()}.svg`)" alt="currency" />
              </span>
              {{ title }}{{ info.currCrypto }}

            </div>
          </div>
          <div class="form_item">
            <div class="flex-1">
              <input v-model="amount" placeholder="0" type="number" @blur="amountBlur" class="ipt" />
            </div>
            <span class="text-[0.3rem]">{{ info.currCrypto }}</span>
          </div>
        </div>

        <div
          class="flex justify-between items-center bg-color3 rounded-[0.32rem] h-[1.3rem] mt-[0.32rem] px-[0.36rem] text-[0.3rem]">
          <span>{{ t('market.market_buy_list_pre_pay') }} </span>
          <span>
            <strong class="text-[0.4rem] mr-[0.14rem]">{{ showAmount }}</strong>
            {{ info.currWallet }}</span>
        </div>
        <Button size="large" class="btn btn--buy bg-buy bg-buy-text-color" round :loading="loading" type="primary"
          @click="goSubmit">
          <span style="color: var(--ex-black);">{{
            t('market.market_buy_fast_buy')
          }}</span></Button>
      </template>

      <template v-else-if="info.offset == 'sell'">
        <!-- 卖出 -->
        <!-- 二层容器 -->

        <div class="item bg-color3 rounded-[0.32rem] mt-[0.32rem] px-[0.28rem] py-[0.18rem]">
          <div class="flex justify-between items-center">
            <div class="text-[0.3rem]">{{ t('market.market_buy_list_amount') }}</div>
            <div class="flex items-center justify-center h-[0.88rem] px-[0.16rem] bg-color rounded-[0.32rem]">
              <span class="mr-[0.16rem]" v-if="info.currCrypto">
                <img class="size-[0.52rem] rounded-50"
                  :src="getStaticImgUrl(`/static/img/crypto/${info.currCrypto.toUpperCase()}.svg`)" alt="currency" />
              </span>
              {{ title }}{{ info.currCrypto }}

            </div>
          </div>
          <div class="form_item">
            <div class="flex-1">
              <input v-model="amount" placeholder="0" type="number" @blur="amountBlur" class="ipt" />
            </div>
            <!-- <div class="all" @click="amount = currWallet.amount > info.limitmax ? info.limitmax : currWallet.amount">{{ t('trade.stock_position_all') }}</div> -->
            <span class="text-[0.3rem]">{{ info.currCrypto }}</span>
          </div>
        </div>

        <!-- 三层容器 -->
        <div
          class="flex justify-between items-center bg-color3 rounded-[0.32rem] h-[1.3rem] mt-[0.32rem] px-[0.36rem] text-[0.3rem]">
          <span>{{ t('market.market_buy_optional_estreceive') }} </span>
          <span>
            <strong class="text-[0.4rem] mr-[0.14rem]">{{ showAmount }}</strong>
            {{ info.currWallet }}</span>
        </div>

        <Button size="large" class="btn btn--sell bg-sell bg-sell-text-color" round :loading="loading"
          @click="goSubmit"><span style="color: var(--ex-black);">{{ t('market.market_buy_fast_sell') }}</span></Button>

      </template>

    </div>

    <BuyCoinConfirm ref="safeRef" :offset="info.offset" :loading="loading" :volume="amount" :currency="info.currCrypto"
      :pay-currency="info.currWallet" :money="showAmount" @submit="submitSell" />


  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Button, showToast } from 'vant'
import Decimal from 'decimal.js'
import Top from '@/components/Top.vue'
import store, { useMapState } from '@/store'
import BuyCoinConfirm from './components/BuyCoinConfirm.vue'
import router from '@/router'
import { _buysell } from '@/api/api'
import { _hiddenAccount } from '@/utils/index'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
// 收款方式列表 所有钱包
const { accountList, wallet, sessionToken } = useMapState(['accountList', 'wallet', 'sessionToken'])

const safeRef = ref()

const route = useRoute()
const title = ref(route.query.offset == 'buy' ? t('market.market_buy_fast_buy') : t('market.market_buy_fast_sell'))

// 表单
const loading = ref(false)
const info = ref(route.query || {})
const amount = ref('')
const showAmount = computed(() => {
  if (!amount.value || amount.value <= 0) return '--'
  return new Decimal(amount.value).mul(info.value.price).toFixed(3).slice(0, -1)
})
const currWallet = computed(() => {
  return wallet.value.find(item => item.name == info.value.currCrypto) || {}
})


const currencyInfo = computed(() => {
  const data = store.state.currencyList.find((item) => item.currency == info.value.currCrypto) || {};
  return data
});

const amountBlur = () => {
  if (isNaN(amount.value) || amount.value <= 0) {
    amount.value = ''
    return
  }
  if (currencyInfo.value.tpp) {
    amount.value = new Decimal(amount.value).toFixed(currencyInfo.value.tpp + 1).slice(0, -1)
  }
}


const goSubmit = () => {
  if (!amount.value || amount.value <= 0) return showToast(t('market.market_buy_fast_no_amount'))
  amount.value = new Decimal(amount.value).toNumber()
  if (amount.value < info.value.limitmin || amount.value > info.value.limitmax) return showToast(`限额：${info.value.limitmin}-${info.value.limitmax}`)
  if (info.value.offset == 'sell') {
    const cueeWallet = wallet.value.find(item => item.name == info.value.currCrypto)
    if (amount.value > cueeWallet.amount) return showToast(t('transfer.no_enough_balance'))
  }
  getSessionToken()
  // 打开密码
  safeRef.value.open()
}

const submitSell = obj => {
  const params = {
    ad_id: info.value.id,
    volume: amount.value,
    account_id: info.value.offset == 'buy' ? null : obj.account_id,
    token: sessionToken.value,
    safeword: obj.safeword,
  }
  if (loading.value) return
  loading.value = true
  _buysell(params)
    .then(({ code, data: { order_no } }) => {
      if (code == 200) {
        showToast(t('market.market_buy_fast_success'))
        setTimeout(() => {
          router.replace({
            name: 'orderDetails',
            query: { order_no }
          })
        }, 300)
      }
    })
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 1000)
    })
}
const getSessionToken = () => {
  store.dispatch('updateSessionToken')
}

</script>

<style lang="less" scoped>
.page-deal {
  padding-top: 1.12rem;

  .form {
    padding: 0.32rem;

    .card_box {
      border-radius: 0.3rem;
      height: 1.44rem;
      display: flex;
      align-items: center;
      position: relative;
      border: 1px solid var(--ex-border-color2);
      padding: 0 0.4rem 0 0.36rem;
      overflow: hidden;

      .card_icon {
        background-color: var(--ex-bg-color2);
        width: 0.96rem;
        height: 0.96rem;
        border-radius: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;

        >#img {
          width: 0.96rem !important;
          height: 0.96rem !important;
        }
      }

      .card {
        flex: 1;
        margin: 0 0.2rem 0 0.36rem;
        text-align: left;
        font-size: 0.24rem;
        color: var(--ex-text-color);
        font-weight: 500;
        line-height: 1;

        .code {
          font-size: 0.28rem;
          margin-bottom: 0.1rem;
          font-weight: 400;
        }
      }
    }

    .no_card {
      padding: 0.32rem;
      border-radius: 0.12rem;
      border: 1px dashed var(--ex-border-color2);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tip {
      color: var(--ex-text-color4);
      font-size: 0.24rem;
      margin-top: 0.24rem;
      margin-bottom: 0.8rem;
    }

    .form_item {
      height: 1.36rem;
      display: flex;
      align-items: center;
      justify-content: center;

      .ipt {
        width: 100%;
        height: 0.8rem;
        font-size: 0.6rem;
        font-weight: 600;
      }

      .all {
        color: var(--ex-primary-color);
      }

    }

    .info {
      border-radius: 0.32rem;
      background-color: var(--ex-bg-color3);
      font-size: 0.32rem;
      padding: 0.12rem;

      .avatar {
        width: 0.54rem;
        height: 0.54rem;
        border-radius: 50%;
        background-color: var(--ex-white);
        margin-right: 0.16rem;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.36rem;
        color: var(--ex-text-color--bg-light);
        line-height: 0;
        font-weight: 600;
      }

      .info_item {
        font-weight: bold;
        font-size: 0.48rem;
      }
    }

    .btn {
      margin-top: 0.6rem;
      border-radius: 0.4rem;
    }
  }
}
</style>
