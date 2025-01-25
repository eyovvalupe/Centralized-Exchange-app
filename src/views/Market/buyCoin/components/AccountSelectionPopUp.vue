<template>
  <!-- 账户选择弹窗  -->
  <BottomPopup closeable v-model:show="showAccountDialog" :safe-area-inset-top="true" :safe-area-inset-bottom="true"
    :title="t('market.market_buy_fast_account_title')">

    <div class="withdraw_accounr_dialog">

      <div class="list">
        <!-- 二层容器 -->
        <div class="mb-5 flex text-16 text-color2"
          v-if="currencyType.includes('crypto') && currencyType.includes('bank')">
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
        <div
          class="mb-[0.24rem] flex h-18 w-full flex-col items-center justify-center rounded-[0.3rem] bg-color text-primary"
          @click="goAddAccount">
          <div class="mb-1 size-[0.48rem]">
            <img v-lazy="getStaticImgUrl('/static/img/common/add.svg')" alt="img" />

          </div>
          <span class="text-12 leading-22">{{ t('market.market_buy_fast_account_add') }}</span>
        </div>

        <div class="flex flex-col items-center h-[1.36rem] my-[0.8rem]" v-if="bankList.length == 0">
          <!-- <img v-lazy="getStaticImgUrl('/static/img/user/noData.svg')" />
          <span class="mt-[0.12rem] text-color4 text-[0.28rem]">{{ $t("account.no_data") }}</span> -->
          <NoData />
        </div>
        <div v-for="(item, i) in bankList" :key="i" :class="{ dialog_account_item_active: bank.id == item.id }"
          class="dialog_account_item mb-[0.24rem]"
          :style="{ backgroundImage: `url(${getStaticImgUrl('/static/img/bank/card_bg.svg')})` }"
          @click="clickAccountItem(item)">
          <div>
            <div class="right-[0.24rem] top-[0.24rem] absolute text-[0.28rem] text-color2" v-if="item.accountName">
              户主姓名：{{ item.accountName }}</div>
            <div class="flex items-center">
              <div class="card_icon">
                <CryptoIcon v-if="tabsValue === 'crypto'" class="rounded-50" :name="item.symbol?.toUpperCase()" />
                <img v-else class="!size-[0.44rem]" v-lazy="getStaticImgUrl('/static/img/bank/card_icon.svg')"
                  alt="img" />
              </div>
              <div class="text-color text-[0.32rem]">{{ item.symbol ? `${item.symbol}-${item.network}` :
                `${item.bankName}` }}</div>

            </div>
            <div class="card">
              <div class="code">{{ _hiddenAccount(item.bankCardNumber || item.address) }}</div>

            </div>
            <div v-if="bank.id == item.id" class="checked">
              <img v-lazy="getStaticImgUrl('/static/img/common/ok.svg')" alt="img" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </BottomPopup>

</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { closeToast, Popup, showConfirmDialog, showLoadingToast } from 'vant'
import router from '@/router'
import store, { useMapState } from '@/store'
import { _hiddenAccount } from '@/utils/index'
import { onMounted, computed } from "vue"
import { useI18n } from 'vue-i18n'
import NoData from "@/components/NoData.vue"
import BottomPopup from "@/components/BottomPopup.vue"

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
      showLoadingToast({ duration: 0, loadingType: 'circular' })
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
      theme: 'round-button'
    }).then(() => {
      router.push({
        name: 'google',
      })
    })
  }

  showConfirmDialog({
    title: "提示",
    message: "即将跳转到添加收款账号，将中断当前业务，是否继续？",
    theme: 'round-button'
  }).then(() => {
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
.withdraw_accounr_dialog {
  padding: 0.6rem 0.32rem 0.8rem 0.32rem;

  .swap_dialog_item {
    height: 1.12rem;
    line-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid var(--ex-border-color);
    overflow: hidden;
    position: relative;

    .icon {
      width: 0.4rem;
      height: 0.4rem;
      margin-right: 0.24rem;
    }
  }

  .swap_dialog_item_active {
    color: var(--ex-primary-color);
    font-weight: 600;

    .check_icon {
      position: absolute;
      right: 0.24rem;
      color: var(--ex-primary-color);
      font-size: 0.28rem;
    }
  }

  .search_box {
    height: 0.8rem;
    background-color: var(--ex-bg-color2);
    border-radius: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.32rem;
    padding: 0 0.4rem;

    input {
      flex: 1;
      color: var(--ex-text-color);
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
      color: var(--ex-text-color);
      font-size: 0.32rem;
      font-weight: 400;
    }

    .active_tab {
      background-color: var(--ex-bg-color2);
      color: var(--ex-primary-color);
      font-weight: 500;
    }
  }

  .list {
    max-height: calc(var(--vh) * 70);
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
    border: 1px dashed var(--ex-border-color2);
    border-radius: 0.12rem;
    height: 1.44rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dialog_account_item {
    border-radius: 0.4rem;
    height: 2.16rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    padding: 0 0.4rem 0 0.36rem;
    background-size: cover;
    border: 1px solid rgba(0, 0, 0, 0);
    background-color: var(--ex-bg-color3);

    .card_icon {
      background-color: var(--ex-white);
      width: 0.68rem;
      height: 0.68rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 0.16rem;
    }

    .card {
      margin-top: 0.32rem;

      .code {
        font-size: 0.4rem;
        font-weight: 600;
        color: var(--ex-text-color);
      }
    }
  }

  .dialog_account_item_active {
    border: 1px solid var(--ex-primary-color);

    .checked {
      position: absolute;
      bottom: -1px;
      right: -1px;
      width: 0.8rem;
      height: 0.68rem;
      border-radius: 0.4rem 0rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--ex-primary-color);

      >img {
        width: 0.48rem !important;
        height: 0.48rem !important;

      }
    }
  }
}
</style>
