<template>
  <!-- 账户选择弹窗 AccountSelectionPopUp -->
  <Popup v-model:show="showAccountDialog" :safe-area-inset-top="true" :safe-area-inset-bottom="true"
    class="AccountSelectionPopUp" position="bottom" teleport="body">
    <div class="withdraw_accounr_dialog">
      <div class="close_icon" @click="showAccountDialog = false">
        <img :src="getStaticImgUrl('/static/img/common/close.svg')" alt="x" />
      </div>
      <div class="title">{{ t('market.market_buy_fast_account_title') }}</div>
      <div class="list">
        <!-- 二层容器 -->
        <div class="mb-5 flex text-16 text-color2"  v-if="currencyType.includes('crypto') && currencyType.includes('bank')">
          <div v-if="currencyType.includes('crypto')"
            class="mr-[0.12rem] w-[1.86rem] cursor-pointer rounded-3xl border border-color-2 text-center leading-36"
            :class="{ 'border-none border-transparent bg-my text-white': tabsValue === 'crypto' }"
            @click="tabsValue = 'crypto'">
            {{ t('market.market_buy_fast_account_crypto') }}
          </div>
          <div v-if="currencyType.includes('bank')"
            class="w-[1.86rem] cursor-pointer rounded-3xl border border-color-2 text-center leading-36"
            :class="{ 'border-transparent bg-my text-white': tabsValue === 'bank' }" @click="tabsValue = 'bank'">
            {{ t('market.market_buy_fast_account_bank') }}
          </div>
        </div>
        <!-- 三层容器 -->
        <div class="mb-[0.2rem] flex h-18 w-full flex-col items-center justify-center rounded-[0.3rem] bg-color2 text-my"
          @click="goAddAccount">
          <div class="mb-1 size-6 rounded-50 border-[0.03rem] border-my text-center text-20 leading-none">+</div>
          <span class="text-12 leading-22">{{ t('market.market_buy_fast_account_add') }}</span>
        </div>
        
        <div class="flex flex-col items-center h-[1.36rem] my-[0.8rem]" v-if="bankList.length == 0">
          <img :src="getStaticImgUrl('/static/img/user/noData.svg')" />
          <span class="mt-[0.12rem] text-color4 text-[0.28rem]">{{ $t("account.no_data") }}</span>
        </div>
        <div v-for="(item, i) in bankList" :key="i" :class="{ dialog_account_item_active: bank.id == item.id }"
          class="dialog_account_item mb-[0.2rem]" @click="clickAccountItem(item)">
          <div class="card_icon">
            <img v-if="tabsValue === 'crypto'" class="rounded-50"
              :src="getStaticImgUrl(`/static/img/crypto/${item.symbol?.toUpperCase()}.svg`)" alt="currency" />
            <img v-else class="!size-[0.68rem]" :src="getStaticImgUrl('/static/img/user/card_type_b.svg')" alt="img" />
          </div>
          <div class="card">
            <div class="code">{{ _hiddenAccount(item.bankCardNumber || item.address) }}</div>
            <div class="text-color2">{{ item.symbol ? `${item.symbol}-${item.network}` : `${item.bankName}` }} <span v-if="item.accountName">| {{ item.accountName }}</span></div>
          </div>
          <div v-if="bank.id == item.id" class="checked"
            :style="{ backgroundImage: `url(${getStaticImgUrl('/static/img/user/check_bg.svg')})` }">
            <img :src="getStaticImgUrl('/static/img/common/ok.svg')" alt="img" />
          </div>
        </div>
      </div>
    </div>
  </Popup>

</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { closeToast, Popup, showConfirmDialog, showLoadingToast } from 'vant'
import router from '@/router'
import store, { useMapState } from '@/store'
import { _hiddenAccount } from '@/utils/index'
import { onMounted, computed } from "vue"
import { useI18n } from 'vue-i18n'


const { t } = useI18n()
const props = defineProps({
  show: Boolean,
  bank: {
    type: Object,
    default: () => ({}),
    required: !0,
  },
  currencyType: {
    type: String,
    default: 'crypto,bank',
  },
})
const emit = defineEmits(['update:show', 'onAddCollection'])

const token = computed(() => store.state.token)
const tabsValue = ref('crypto')
const { userInfo, accountList } = useMapState(['accountList', 'userInfo'])
const showAccountDialog = computed({
  get: () => props.show,
  set: val => emit('update:show', val),
})
// 收款方式列表
const bankList = computed(() => accountList.value.filter(item => item.channel === tabsValue.value)) // 银行账号列表

watch(
  () => props.show,
  val => {
    if (val && !accountList.value.length) {
      showLoadingToast({ duration: 0, loadingType: 'spinner' })
      store.dispatch('updateAccountList').then(closeToast)
    }
    if (props.currencyType === 'crypto' || props.currencyType === 'bank') {
      tabsValue.value = props.currencyType
    }
  }
)
onMounted(() => {
  setTimeout(() => {
    if (token.value && !accountList.value.length) {
      store.dispatch('updateAccountList')
    }
  }, 500)
})
// 跳转添加
const goAddAccount = () => {
  // google检测
  if (!userInfo.value.googlebind) {
    return showConfirmDialog({
      title: t('safety.no_google_dialog_title'),
      message: t('safety.no_google_dialog_con'),
    }).then(() => {
      router.push({
        name: 'google',
      })
    })
  }

  showConfirmDialog({
    title:"提示",
    message:"即将跳转到添加收款账号，将中断当前业务，是否继续？"
  }).then(()=>{
    store.commit("setSelectedPayment", '1');
    router.push({
      name: 'account',
    })
  })
  
}
const clickAccountItem = val => {
  emit('onAddCollection', val)
}
</script>

<style lang="less" scoped>
.AccountSelectionPopUp {
  border-top-left-radius: 0.4rem;
  border-top-right-radius: 0.4rem;
}

.withdraw_accounr_dialog {
  background-color: #fff;
  overflow: hidden;
  padding: 1.42rem 0.32rem 0.8rem 0.32rem;
  position: relative;

  .title {
    height: 1rem;
    position: absolute;
    top: 0.2rem;
    left: 0;
    text-align: center;
    line-height: 1rem;
    font-size: 0.32rem;
    width: 100%;
    color: #121826;
    pointer-events: none;
    font-weight: bold;
  }

  .close_icon {
    position: absolute;
    width: 0.4rem;
    height: 0.4rem;
    top: 0.24rem;
    right: 0.32rem;
  }

  .swap_dialog_item {
    height: 1.12rem;
    line-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #f5f5f5;
    overflow: hidden;
    position: relative;

    .icon {
      width: 0.4rem;
      height: 0.4rem;
      margin-right: 0.24rem;
    }
  }

  .swap_dialog_item_active {
    color: #014cfa;
    font-weight: 600;

    .check_icon {
      position: absolute;
      right: 0.24rem;
      color: #014cfa;
      font-size: 0.28rem;
    }
  }

  .search_box {
    height: 0.8rem;
    background-color: #f5f5f5;
    border-radius: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.32rem;
    padding: 0 0.4rem;

    input {
      flex: 1;
      color: #121826;
    }
  }

  .tabs {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 0.4rem;

    .tab {
      height: 0.72rem;
      border-radius: 0.72rem;
      display: flex;
      align-items: center;
      padding: 0 0.4rem;
      color: #061023;
      font-size: 0.32rem;
      font-weight: 400;
    }

    .active_tab {
      background-color: #f6f8ff;
      color: #014cfa;
      font-weight: 500;
    }
  }

  .list {
    max-height: 70vh;
    overflow-y: auto;

    .add_account {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.4rem 0;
    }
  }

  .add_item {
    margin-bottom: 0.36rem;
    border: 1px dashed #ccd7fd;
    border-radius: 0.12rem;
    height: 1.44rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dialog_account_item {
    border-radius: 0.3rem;
    height: 1.44rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    // background-color: #f6f7fa;
    border: 1px solid #d0d8e2;
    padding: 0 0.4rem 0 0.36rem;

    .card_icon {
      background-color: #f5f7fc;
      width: 0.96rem;
      height: 0.96rem;
      border-radius: 1rem;
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
      color: #061023;
      font-weight: 500;
      line-height: 1;

      .code {
        font-size: 0.28rem;
        margin-bottom: 0.1rem;
        font-weight: 400;
      }
    }
  }

  .dialog_account_item_active {
    border: 1px solid #1a59f6;

    .checked {
      position: absolute;
      top: -0.02rem;
      right: -0.02rem;
      background-size: 100% 100%;
      width: 0.46rem;
      height: 0.42rem;

      >img {
        width: 0.18rem !important;
        height: 0.12rem !important;
        position: absolute;
        right: 0.06rem;
        top: 0.08rem;
      }
    }
  }
}
</style>
