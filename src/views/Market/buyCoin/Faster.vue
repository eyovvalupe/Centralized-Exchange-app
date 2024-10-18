<!-- 快捷区 -->
<template>
  <div class="page_fasters">
    <div class="form">
      <div class="tabs">
        <div class="tab" :class="{ active_tab: form1.offset == 'buy' }" @click="changeTab('buy')">买入</div>
        <div class="tab" :class="{ active_tab: form1.offset == 'sell' }" @click="changeTab('sell')">卖出</div>
      </div>

      <!-- 售出 -->
      <div class="item_box">
        <div class="item_box_left">
          <div class="subtitle">
            <span>买入</span>
            <!-- <span v-if="form1.offset == 'sell' && token">最大可用 {{ currOut.amount }}</span> -->
          </div>
          <div class="item" :class="{ item_focus: priceFocus }">
            <span v-if="form1.offset == 'sell' && token" v-show="form1.volume === '' || priceFocus" class="ipt_tip">≤ {{ currOut.amount }}</span>
            <input v-model="form1.volume" type="number" class="ipt" @focus="priceFocus = false" @blur="priceFocus = false" />
          </div>
        </div>

        <div class="item_box_right">
          <div v-if="token" class="subtitle">
            <!--  @click="jump('transfer')" -->
            <span>&nbsp;</span>
            <!-- <span class="link">划转</span> -->
          </div>
          <div v-if="!token" class="subtitle">&nbsp;</div>
          <div class="item justify-between" :class="{ item_focus: priceFocus }" style="border: 1px solid #d0d8e2 !important" @click="openDialog(1)">
            <div class="flex items-center">
              <div v-if="currOut.name" class="icon">
                <img class="rounded-50" :src="`/static/img/crypto/${currOut.name.toUpperCase()}.png`" alt="currency" />
              </div>
              <span>{{ currOut.name || '--' }}</span>
            </div>
            <div class="more_icon">
              <img src="/static/img/trade/down.png" alt="↓" />
            </div>
          </div>
        </div>
      </div>

      <!-- 收到 -->
      <div class="item_box">
        <div class="item_box_left">
          <div class="subtitle"><span>收到</span></div>
          <div class="item">
            {{ getMoney }}
          </div>
        </div>
        <div class="item_box_right">
          <div class="subtitle"><span>&nbsp;</span></div>
          <div class="item justify-between" :class="{ item_focus: priceFocus }" style="border: 1px solid #d0d8e2 !important" @click="openDialog(2)">
            <div class="flex items-center">
              <div v-if="currIn.name" class="icon">
                <img class="rounded-50" :src="`/static/img/crypto/${currIn.name.toUpperCase()}.png`" alt="currency" />
              </div>
              <span>{{ currIn.name || '--' }}</span>
            </div>
            <div class="more_icon">
              <img src="/static/img/trade/down.png" alt="↓" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="rate" class="tip">预计价格&nbsp;&nbsp;1&nbsp;{{ currOut.name }} ≈ {{ rate || '--' }}&nbsp;{{ currIn.name }}</div>

      <Button size="large" class="submit" round :loading="loading" :color="form1.offset == 'sell' ? '#014CFA' : '#014CFA'" @click="sell">{{ form1.offset == 'sell' ? '卖出' : '买入' }}</Button>

      <!-- <Button v-if="!token" size="large" color="#014cfa" round style="margin-bottom: 0.34rem; margin-top: 1.6rem" @click="store.commit('setIsLoginOpen', true)">登录</Button>
      <Button v-if="!token" size="large" color="#f2f2f2" round style="color: #999999" @click="jump('register')">注册</Button> -->
    </div>
  </div>

  <!-- 售出币种 -->
  <Popup v-model:show="showDialog" :safe-area-inset-top="true" :safe-area-inset-bottom="true" class="self_van_popup" position="bottom" teleport="body">
    <div class="withdraw_accounr_dialog">
      <div class="close_icon" @click="showDialog = false">
        <img src="/static/img/common/close.png" alt="x" />
      </div>
      <div class="search_box">
        <div class="icon">
          <img src="/static/img/common/search.png" alt="🔍" />
        </div>
        <input ref="iptRef" v-model.trim="searchValue" placeholder="输入币种" type="text" enterkeyhint="search" class="search" />
      </div>
      <div class="title">币种选择</div>
      <div
        v-for="(item, i) in showDialogType == 1 ? outWallet : inWallet"
        :key="i"
        class="swap_dialog_item"
        :class="{ swap_dialog_item_active: showDialogType == 1 ? currOut.name == item.name : currIn.name == item.name }"
        @click="clickItem(item)"
      >
        <div class="icon">
          <img class="rounded-50" :src="`/static/img/crypto/${item.name.toUpperCase()}.png`" alt="currency" />
        </div>
        <span>{{ item.name.toUpperCase() }}</span>
        <Icon v-if="showDialogType == 1 ? currOut.name == item.name : currIn.name == item.name" class="check_icon" name="success" />
      </div>
    </div>
  </Popup>

  <AccountSelectionPopUp v-model:show="showAccountDialog" :bank="form1" @on-add-collection="clickAccountItem" />

  <!-- 安全密码弹窗 -->
  <SafePassword ref="safeRef" @submit="submitSell" />
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { Button, Popup, Icon, showToast, showConfirmDialog } from 'vant'
import Decimal from 'decimal.js'
import store from '@/store'
import router from '@/router'
import { _swapRate, _orderFast } from '@/api/api'
// import { _hiddenAccount } from '@/utils/index'
import SafePassword from '@/components/SafePassword.vue'
import eventBus from '@/utils/eventBus'
import AccountSelectionPopUp from './components/AccountSelectionPopUp.vue'

const safeRef = ref()
const token = computed(() => store.state.token)
const wallet = computed(() => (token.value ? store.state.wallet : currencyList.value)) // 所有钱包
// const accountList = computed(() => store.state.accountList || []) // 收款方式列表
// const bankList = computed(() => accountList.value.filter(item => item.channel == 'bank')) // 银行账号列表
const userInfo = computed(() => store.state.userInfo || {})
const currencyList = computed(() => store.state.deWeightCurrencyList || [])
const searchValue = ref('')
// 售出
const loading = ref(false)
const priceFocus = ref(false)
const form1 = ref({
  offset: 'buy',
  volume: '',
  crypto: '',
  currency: '',
  account_id: '',
})

const currOut = ref({}) // 当前售出钱包
const currIn = ref({}) // 当前收到钱包

// 币种弹窗
const showDialog = ref(false)
const showDialogType = ref(1) // 1-售出 2-收到

//  获取汇率
const rateLoading = ref(false)
const rate = ref('')
// 账户选择
const showAccountDialog = ref(false)

const filterSearchValue = data => {
  return data.filter(item => item.name.toLowerCase().includes(searchValue.value.toLowerCase()))
}
const inWallet = computed(() => {
  // 收到钱包
  let data
  // if (form1.value.offset == 'buy') {
  //   data = wallet.value.filter(item => item.type == 'crypto')
  //   // 模糊查询
  // } else {
  data = currencyList.value.filter(item => item.type == 'fiat')
  // }
  // 模糊查询
  return filterSearchValue(data)
})
// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')

const sell = () => {
  if (!token.value) return store.commit('setIsLoginOpen', true)
  if (!form1.value.volume || form1.value.volume <= 0) return showToast('请输入金额')
  if (form1.value.offset == 'sell') {
    if (form1.value.volume > currOut.value.amount) return showToast('余额不足')
    showAccountDialog.value = true
  } else {
    safeRef.value.open()
  }
}
const submitSell = s => {
  loading.value = true
  const params = {
    offset: form1.value.offset,
    account_id: form1.value.offset == 'sell' ? form1.value.account_id : null,
    volume: form1.value.volume,
    crypto: form1.value.offset == 'buy' ? currOut.value.currency : currIn.value.currency,
    currency: form1.value.offset == 'buy' ? currIn.value.currency : currOut.value.currency,
    token: sessionToken.value,
    safeword: s,
  }
  _orderFast(params)
    .then(res => {
      console.error('???', res)
    })
    .finally(() => {
      loading.value = false
      getSessionToken()
    })
}

const getMoney = computed(() => {
  if (!form1.value.volume || !rate.value) return '--'
  return new Decimal(form1.value.volume).mul(rate.value) || '--'
})
const outWallet = computed(() => {
  // 售出钱包
  let data
  // if (form1.value.offset == 'buy') {
  // data = wallet.value.filter(item => item.type == 'fiat')
  // console.log('currencyList.value', currencyList.value)
  // data = currencyList.value.filter(item => item.type == 'fiat')
  // } else {
  data = wallet.value.filter(item => item.type == 'crypto')
  // }
  return filterSearchValue(data)
})
const openDialog = type => {
  showDialogType.value = type
  showDialog.value = true
}
const clickItem = item => {
  if (showDialogType.value == 1) {
    currOut.value = item
  } else {
    currIn.value = item
  }
  showDialog.value = false

  setTimeout(() => {
    getRate()
  }, 100)
}

// 切换方向
const changeTab = val => {
  form1.value.offset = val
  // 切换币种
  // const obj = currOut.value
  // currOut.value = currIn.value
  // currIn.value = obj
  setTimeout(() => {
    getRate()
  }, 100)
}

const getRate = () => {
  rateLoading.value = true
  rate.value = ''
  _swapRate({
    from: currOut.value.currency,
    to: currIn.value.currency,
    amount: 0,
  })
    .then(res => {
      if (res.data.exchange_rate) {
        rate.value = res.data.exchange_rate
      }
    })
    .finally(() => {
      rateLoading.value = false
    })
}

setTimeout(() => {
  if (token.value) getRate()
}, 100)

const clickAccountItem = item => {
  form1.value.account_id = item.id
  form1.value.id = item.id
  showAccountDialog.value = false
  safeRef.value.open()
}
// 跳转添加
const goAddAccount = () => {
  // google检测
  if (!userInfo.value.googlebind) {
    return showConfirmDialog({
      title: '谷歌验证器',
      message: '你还未绑定谷歌验证器，是否去绑定?',
    }).then(() => {
      jump('google')
    })
  }
  router.push({
    name: 'account',
  })
}

const getSessionToken = () => {
  store.dispatch('updateSessionToken')
}
if (token.value) {
  getSessionToken()
}
eventBus.on('loginSuccess', () => {
  getSessionToken()
})
onBeforeUnmount(() => {
  eventBus.off('loginSuccess')
})

// 跳转
const jump = name => {
  router.push({
    name,
  })
}
if (outWallet.value[0]) currOut.value = outWallet.value[0]
if (inWallet.value[0]) currIn.value = inWallet.value[0]
// const getData2 = async params => {
//   const res = await _cryptoCoin()
//   console.log('🚀 ~ getData2 ~ res:', res)
// }
// getData2()
</script>

<style lang="less" scoped>
.page_fasters {
  margin-top: -0.32rem;
  .form {
    padding: 0 0.32rem;

    .tabs {
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: 34px;
      margin: 20px 0;
      border: 0.5px solid #d0d8e2;
      width: 47%;
      border-radius: 34px;

      .tab {
        color: #666d80;
        margin: 0;
        width: 80px;
        text-align: center;
        border-radius: 34px;
      }

      .active_tab {
        font-weight: bold;
        color: white;
        background: #014cfa;
        text-align: center;
      }
    }

    .tip {
      color: #666d80;
      font-size: 0.24rem;
      margin-top: 15px;
    }

    .subtitle {
      color: #333;
      font-size: 0.28rem;
      margin-bottom: 0.15rem;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .link {
        color: #034cfa;
      }
    }

    .item_box {
      display: flex;
      align-items: stretch;
      margin-top: 0.5rem;

      .item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        height: 1rem;
        border-radius: 16px;
        border: 1px solid #d0d8e2;
        padding: 0 0.2rem;
        font-size: 0.32rem;
        .icon {
          margin-right: 0.12rem;
          width: 0.64rem;
          height: 0.64rem;
          position: relative;
          top: -0.02rem;
        }

        .info {
          flex: 1;
          text-align: right;
          margin-left: 0.2rem;
          font-size: 0.28rem;
          font-weight: 400;
          color: #333;
          position: absolute;
          right: 0.24rem;
          pointer-events: none;
        }

        .ipt_tip {
          color: #b7b7b7;
          font-size: 0.24rem;
          position: absolute;
          left: 0.24rem;
          transition: all ease 0.3s;
        }

        .ipt_tip2 {
          left: auto;
          right: 0.24rem;
        }

        .ipt {
          flex: 1;
          height: 100%;
          width: 2rem;
          font-size: 0.28rem;
          padding: 0;
          color: #034cfa;
          position: relative;
          z-index: 1;
        }

        .base_ipt {
          font-size: 0.28rem;
          color: #b7b7b7;
          position: absolute;
          left: 0.24rem;
          z-index: 0;
        }

        .more_icon {
          width: 0.32rem;
          height: 0.32rem;
          margin-left: 0.08rem;
        }
      }

      .disabled_item {
        background-color: #f5f5f5;
      }

      .item_focus {
        // height: 1.12rem;
        // padding-top: 0.2rem;
        border: 1px solid #034cfa;

        .ipt_tip {
          font-size: 0.2rem;
          transform: translateY(-0.36rem);
        }
      }

      .item_box_left {
        width: 204px;
        margin-right: 0.2rem;
        display: flex;
        flex-direction: column;
      }

      .item_box_right {
        flex: 1;
      }

      .mode_btn {
        padding: 0 0.6rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 1.26rem;
        background: #f2f2f2;
        height: 0.72rem;
        color: #999;
        text-align: center;
        font-size: 0.28rem;
        font-weight: 600;
        margin-left: 0.16rem;
        margin-top: 0.08rem;
      }

      .active_btn {
        background: #014cfa;
        color: #fff;
      }
    }
  }

  .submit {
    margin-top: 0.8rem;
  }
}
</style>

<style lang="less" scoped>
.withdraw_accounr_dialog {
  background-color: #fff;
  border-top-left-radius: 0.4rem;
  border-top-right-radius: 0.4rem;
  overflow: hidden;
  padding: 1.2rem 0.32rem 0.8rem 0.32rem;
  position: relative;

  .search_box {
    display: flex;
    align-items: center;
    padding: 0 0.4rem;
    margin-bottom: 0.15rem;
    height: 40px;
    background-color: #f4f5f7;
    border-radius: 40px;

    input {
      padding-top: 3px;
    }
    input::placeholder {
      // color: #014cfa; /* 占位符颜色 */
      color: #9ea3ae;
      font-size: 15px;
    }

    .type_select {
      right: 0;
      display: flex;
      align-items: center;
      color: #253146;
      font-size: 0.24rem;

      .type_icon {
        width: 0.28rem;
        height: 0.28rem;
        opacity: 0.8;
        margin-left: 0.06rem;
      }
    }

    &:has(.search:focus) {
      border: 1px solid #014cfa;
    }

    .icon {
      width: 0.4rem;
      height: 0.4rem;
    }

    .close {
      width: 0.24rem;
      height: 0.24rem;
      color: #121826;
    }

    .search {
      flex: 1;
      margin: 0 0.16rem;
      font-size: 0.32rem;
      font-weight: 400;
    }
  }

  .title {
    height: 1rem;
    position: absolute;
    top: 0.3rem;
    left: 0;
    text-align: center;
    line-height: 1rem;
    font-size: 16px;
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
    border-bottom: 1px solid #f5f5f5;
    overflow: hidden;
    position: relative;
    color: #333333;
    .icon {
      width: 0.6rem;
      height: 0.6rem;
      margin-right: 0.24rem;
    }
  }

  .swap_dialog_item_active {
    color: #014cfa;

    .check_icon {
      position: absolute;
      right: 0.24rem;
      color: #014cfa;
      font-size: 0.4rem;
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
    border-radius: 0.12rem;
    height: 1.44rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    background-color: #f6f7fa;
    padding: 0 0.4rem 0 0.36rem;
    overflow: hidden;
    margin-bottom: 0.36rem;

    .card_icon {
      background-color: #d9e4ff;
      width: 0.96rem;
      height: 0.96rem;
      border-radius: 0.16rem;
      display: flex;
      align-items: center;
      justify-content: center;

      > img {
        width: 0.64rem !important;
        height: 0.64rem !important;
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
      top: -0.04rem;
      right: -0.04rem;
      background-size: 100% 100%;
      width: 0.46rem;
      height: 0.42rem;

      > img {
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
