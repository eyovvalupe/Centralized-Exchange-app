<!-- 自选买卖 二级页面 -->
<template>
  <div class="page-deal">
    <Top class="!z-20">
      <template #title>
        <span class="flex items-center justify-center">
          <span class="size-[0.52rem] mr-[0.16rem]" v-if="info.currCrypto">
            <CryptoIcon :name="info.currCrypto.toUpperCase()" />
          </span>
          {{ title }}{{ info.currCrypto }}

        </span>
      </template>
    </Top>

    <!-- 买入 -->
    <div class="form">
      <!-- 信息 -->
      <div class="info mx-[0.32rem]">
        <div class="flex items-center px-[0.28rem] pt-[0.24rem] pb-[0.36rem]">
          <div class="avatar">
            {{ info.merchant?.slice(0, 1) }}
          </div>
          {{ info.merchant }}
        </div>
        <div class="flex justify-between px-[0.4rem] h-[1.5rem] items-center bg-white2 rounded-[0.4rem]">
          <div class="info_item">
            {{ info.price }}
            <span class="text-[0.24rem] font-normal">{{ info.currWallet }}</span>
          </div>
          <div class="text-14 text-color3">
            <div>{{ t('market.market_buy_optional_order_limit') }}</div>
            <div class="mt-[0.16rem] text-color">{{ info.limitmin }}-{{ info.limitmax }}</div>
          </div>
        </div>
      </div>

      <div class="px-[0.32rem]" v-if="info.offset == 'buy'">

        <div class="item bg-white2 rounded-[0.32rem] mt-[0.32rem] px-[0.28rem] pt-[0.36rem]" :class="{'item--error':isErrAmount && amount != ''}">
          <div class="flex justify-between items-center">
            <div class="text-[0.3rem]">{{ t('market.market_buy_list_amount') }}</div>
            <div class="flex items-center justify-center rounded-[0.32rem]">
              <span class="size-[0.52rem] mr-[0.12rem]" v-if="info.currCrypto">
                <CryptoIcon :name="info.currCrypto.toUpperCase()" />
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
        <div class="text-error mt-[0.2rem]" v-if="isErrAmount && amount != ''">{{ t('market.market_buy_optional_order_limit') }} {{ info.limitmin }}-{{ info.limitmax }}</div>
        
        <div
          class="flex justify-between items-center bg-white1 rounded-[0.4rem] h-[1.3rem] mt-[0.32rem] px-[0.3rem] text-[0.3rem]">
          <span>{{ t('market.market_buy_list_pre_pay') }} </span>
          <span class=" flex items-center overflow-hidden"><strong class="text-[0.4rem] mr-[0.16rem]  max-w-[3.6rem] truncate">{{ showAmount }}</strong>
            {{ info.currWallet }}</span>
        </div>
        
        <Button size="large" class="btn btn--buy bg-buy bg-buy-text-color ripple-btn" round :loading="loading" type="primary"
        v-if="!isErrAmount"
        @click="goSubmit">{{ t('market.market_buy_fast_buy')}}</Button>
        <Button size="large" class="btn btn--buy opacity-30 bg-buy bg-buy-text-color" round type="primary"
        v-else>{{ t('market.market_buy_fast_buy') }}</Button>
      </div>

      <template v-else-if="info.offset == 'sell'">
        <!-- 卖出 -->
        <!-- 二层容器 -->
        <div class=" mx-[0.32rem]">
          <div class="item bg-white2 rounded-[0.32rem] mt-[0.32rem]  pt-[0.36rem]" :class="{'item--error':isErrAmount && amount != ''}">
            <div class="px-[0.28rem]">
              <div class="flex justify-between items-center">
                <div class="text-[0.3rem]">{{ t('market.market_buy_list_amount') }}</div>
                <div class="flex items-center justify-center">
                  <span class="size-[0.52rem] mr-[0.16rem]" v-if="info.currCrypto">
                    <CryptoIcon :name="info.currCrypto.toUpperCase()" />
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
            <div class="h-[1px] bg-white2"></div>
            <div class="flex items-center justify-between px-[0.28rem]">
              <div class="flex items-center justify-center">
                <span class="size-[0.4rem] mr-[0.1rem]" v-if="info.currCrypto">
                  <CryptoIcon :name="info.currCrypto.toUpperCase()" />
                </span>
                <span class="text-[0.28rem]">{{ info.currCrypto }}</span>
              </div>
              
              <div class="flex items-center h-[0.88rem]">
                  <span class="text-primary flex items-center gap-[0.1rem] text-[0.24rem]" @click="openConfirmBox">
                    <span class="text-color3">{{ t('assets.wallet_available_sim') }}</span>
                    <span>{{ currWallet.amount }}</span>
                    <span>{{ currWallet.name }}</span>
                  </span>
                  <Icon name="arrow" class="ml-[0.1rem]" color="var(--ex-text-color2)" size="0.22rem" />
                </div>
            </div>
          </div>

          <div class="text-error mt-[0.2rem]" v-if="isErrAmount && amount != ''">{{ t('market.market_buy_optional_order_limit') }} {{ info.limitmin }}-{{ info.limitmax }}</div>

          <!-- 三层容器 -->
          <div
            class="flex justify-between items-center bg-color3 rounded-[0.32rem] h-[1.3rem] mt-[0.32rem] px-[0.36rem] text-[0.3rem]">
            <span>{{ t('market.market_buy_optional_estreceive') }} </span>
            <span class=" flex items-center overflow-hidden">
              <strong class="text-[0.4rem] mr-[0.14rem] max-w-[3.6rem] truncate">{{ showAmount }}</strong>
              {{ info.currWallet }}</span>
          </div>
        </div>
        <div class="h-[1px] bg-white2 mt-[0.4rem]"></div>
        <div class="mt-[0.4rem] bg-white1 rounded-[0.32rem] mx-[0.32rem] flex flex-col">
          <div class="text-[0.32rem] text-color3 pt-[0.24rem] px-[0.28rem] flex justify-between items-center">
            收款账号
            <span class="text-primary text-[0.28rem]" @click="showAccountDialog = true;" v-if="currentAccount.id">{{
              t('重新选择')
            }}</span>
          </div>
         
          <div
            class="flex items-center justify-between relative  mt-[0.28rem] mx-[0.28rem] mb-[0.2rem] pl-[0.36rem] pr-[0.4rem] bg-white2 rounded-[0.4rem] h-[2.16rem]"
            :style="{ backgroundImage: `url(${getStaticImgUrl('/static/img/bank/card_bg.svg')})` }"
            v-if="currentAccount.id">
            <div>
              <div class="right-[0.24rem] top-[0.24rem] absolute text-[0.28rem] text-color2"
                v-if="currentAccount.accountName">
                户主姓名：{{ currentAccount.accountName }}</div>
              <div class="flex items-center">
                <div class="bg-white size-[0.68rem] rounded-full flex items-center justify-center mr-[0.16rem]">
                  <CryptoIcon v-if="currentAccount.channel === 'crypto'" class="rounded-50" :name="currentAccount.symbol?.toUpperCase()" />
                  <img v-else class="!size-[0.44rem]" v-lazy="getStaticImgUrl('/static/img/bank/card_icon.svg')"
                    alt="img" />
                </div>
                <div class="text-color text-[0.32rem]">{{ currentAccount.symbol ?
                  `${currentAccount.symbol}-${currentAccount.network}` : `${currentAccount.bankName}` }}</div>

              </div>
              <div class="mt-[0.32rem]">
                <div class="texr-[0.4rem] font-[600] text-color">{{ _hiddenAccount(currentAccount.bankCardNumber || currentAccount.address) }}</div>

              </div>
            </div>
          </div>
          <div class="h-[1.8rem] mx-[0.32rem] flex flex-col items-center justify-center" @click="showAccountDialog = true;" v-else>
              <div class="size-[0.48rem]">
                <img v-lazy="getStaticImgUrl('/static/img/common/add_gray.svg')" />
              </div>
              <span class="text-[0.28rem] text-color3 mt-[0.08rem]">{{ t('market.market_buy_fast_account_add') }}</span>
          </div>
        </div>
        <div class="mx-[0.32rem]">
          <Button size="large" class="btn btn--sell bg-sell bg-sell-text-color ripple-btn" round :loading="loading" v-if="!isErrAmount"
          @click="goSubmit">{{ t('market.market_buy_fast_sell') }}</Button>
          <Button size="large" class="btn btn--sell bg-sell bg-sell-text-color opacity-30" round  v-else>{{ t('market.market_buy_fast_sell') }}</Button>
        </div>

      </template>

    </div>

    <BuyCoinConfirm ref="safeRef" :offset="info.offset" :loading="loading" :volume="amount" :price="info.price"
      :currency="info.currCrypto" :currentAccount="currentAccount"  :pay-currency="info.currWallet" :money="showAmount" @submit="submitSell" />

    <AccountSelectionPopUp v-model:show="showAccountDialog" :bank="currentAccount" currency-type="bank"
      @on-add-collection="clickAccountItem" />
    
    <!-- 余额提示 -->
    <AmountDialog v-model:show="showAmountDialog" :currency="currWallet.name" :account="t('assets.wallet_cash_value')"
      :amount="currWallet.amount" />

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Button,Icon, showToast } from 'vant'
import Decimal from 'decimal.js'
import Top from '@/components/Top.vue'
import store from '@/store'
import BuyCoinConfirm from './components/BuyCoinConfirm.vue'
import AccountSelectionPopUp from "./components/AccountSelectionPopUp.vue";
import router from '@/router'
import { _buysell } from '@/api/api'
import { getStaticImgUrl, _hiddenAccount } from '@/utils/index'
import { useI18n } from 'vue-i18n'
import AmountDialog from "@/components/AmountDialog.vue";

const { t } = useI18n()
// 收款方式列表 所有钱包
// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const safeRef = ref()
const currentAccount = ref({})
const route = useRoute()
const title = ref(route.query.offset == 'buy' ? t('market.market_buy_fast_buy') : t('market.market_buy_fast_sell'))

// 表单
const loading = ref(false)
const info = ref(route.query || {})
const amount = ref('')
const isErrAmount = computed(() => {
  const val = Number(amount.value)
  if (val < info.value.limitmin || val > info.value.limitmax) {
    return true
  }
  return false
})

const showAmount = computed(() => {
  if (!amount.value || amount.value <= 0) return '--'
  return new Decimal(amount.value).mul(info.value.price).toFixed(3).slice(0, -1)
})
const currWallet = computed(() => {
  return store.state.wallet.find(item => item.name == info.value.currCrypto) || {}
})

const currencyInfo = computed(() => {
  const data = store.state.currencyList.find((item) => item.currency == info.value.currCrypto) || {};
  return data
});

const showAccountDialog = ref(false)
const clickAccountItem = (item) => {
  currentAccount.value = item
  showAccountDialog.value = false

};

const showAmountDialog = ref(false)
const openConfirmBox = () => {
  showAmountDialog.value = true
};

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
    if (!currentAccount.value.id) {
      return showToast("请选择收款账户");
    }
    if (amount.value > currWallet.value.amount) return showToast(t('transfer.no_enough_balance'))
  }
  getSessionToken()
  // 打开密码
  safeRef.value.open()
}

const submitSell = obj => {
  const params = {
    ad_id: info.value.id,
    volume: amount.value,
    account_id: info.value.offset == 'buy' ? null : currentAccount.value.id,
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
    padding: 0.24rem 0 0.4rem 0;
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
      height: 1.7rem;
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
    .item{
      border:1px solid transparent;
    }
    .item--error{
      border-color:var(--ex-error-color);
    }

    .info {
      border-radius: 0.32rem;
      background-color: var(--ex-bg-color3);
      font-size: 0.32rem;
      .avatar {
        width: 0.54rem;
        height: 0.54rem;
        border-radius: 50%;
        background-color: var(--ex-white);
        margin-right: 0.2rem;
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
      font-weight: 600;
    }
  }
}
</style>
