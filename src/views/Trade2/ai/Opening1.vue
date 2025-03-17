<!-- ai量化交易 -->
<template>
  <div class="trade_ai" :class="['trade_ai--' + mode]">
    <Top
      :title="t('trade.ai_opening_trade')"
      :backFunc="backFunc"
      v-if="mode == 'popup'"
    />

    <div style="height: 1.12rem" v-if="mode == 'popup'"></div>
    <div class="tabs-container">
      <!-- 涨跌 -->
      <Tabs
        type="line-card-ai"
        v-model:active="tab"
        :swipeable="false"
        animated
        :color="'var(--ex-primary-color)'"
      >
        <Tab :title="t('trade.ai_opening_long')" :name="1"> </Tab>
        <Tab :title="t('trade.ai_opening_short')" :name="2"> </Tab>
      </Tabs>
      <div class="scroller">
        <!-- 品种 -->
        <!-- <div class="item_content">
          <div class="subtitle">
            {{ t("trade.ai_opening_product_type") }}
            <div class="stock_icon" v-if="form1.name" @click="openStockModel">
              <img :src="getStaticImgUrl('/static/img/trade/blue-stock.svg')" alt="icon" />
            </div>
          </div>

          <div class="item item_box" @click="showNavDialog">
            {{ form1.name }}
          </div>
        </div> -->

        <!-- 时间 -->
        <div class="item_content" v-if="times.length">
          <div class="subtitle">{{ t('trade.ai_opening_time_zone') }}</div>
          <!-- <div class="item item_box disabled_item item_time" @click="showTime=true;">
                        <span>{{ currTime.time }}{{ _dateUnitMap[currTime.unit] }}</span>
                        
                    </div> -->
          <div class="time_list">
            <div
              class="time"
              @click="currTime = obj"
              :class="{
                curr_time:
                  currTime.time == obj.time && currTime.unit == obj.unit,
              }"
              v-for="(obj, i) in times"
              :key="i"
            >
              <span>{{ obj.time }}{{ _dateUnitMap[obj.unit] }}</span>
            </div>
          </div>
        </div>
        <!-- 数量 -->
        <FormItem
          :rightContent="true"
          input-type="number"
          v-model="form1.grid"
          :title="t('trade.ai_opening_network_amount')"
          btn-show-mode="focus"
          :max="maxgrid"
          @change="changeGrid"
        >
          <template #title-right>
            <span>{{ maxgrid > 0 ? '≤' + maxgrid : '' }}</span>
          </template>

          <template #right-content-title>
            <div class="subtitle">
              {{ t('trade.ai_opening_profit_ratio') }}
            </div>
          </template>

          <template #right-content-item>
            <div class="item item_box disabled_item">
              {{ getPercent() ? getPercent() : '请输入网络数量自动换算' }}
            </div>
          </template>
        </FormItem>
        <div style="height: 0.47rem"></div>
        <!-- 拖动 -->
        <SlideContainer v-model="sliderValue2" @change="onSliderChange2" />

        <!-- 投资额 -->

        <FormItem
          input-type="number"
          v-model="form1.volume"
          :title="t('trade.ai_opening_invest_amount')"
          btn-show-mode="focus"
          :tip="usdt.amount > 0 ? '≤ ' + usdt.amount : ''"
          :show-btn="usdt.amount > 0"
          @change="changePercent"
          @btnClick="onSliderChange(100)"
        >
          <!-- <template #title-right>
            <span v-if="token" style="color: var(--ex-primary-color); font-size: 12px" @click="openConfirmBox"><span
                style="color: var(--ex-text-color2)">{{
                  t("trade.ai_opening_balance")
                }}</span>
              {{ usdt.amount }} USDT</span>
          </template> -->
        </FormItem>

        <div style="height: 0.47rem"></div>
        <!-- 拖动 -->
        <SlideContainer v-model="sliderValue" @change="onSliderChange" />
        <div style="height: 0.28rem"></div>
      </div>

      <!-- 按钮 -->
      <!-- <div class="btns" v-if="!token">
        <Button size="large" color="var(--ex-primary-color)" class="btn" round @click="goLogin"
          >{{ t('trade.ai_opening_login') }}</Button
        >
        <Button
          size="large"
          color="var(--ex-bg-color2)"
          class="btn"
          round
          style="color: var(--ex-text-color3)"
          @click="jump('register')"
          >{{ t('trade.ai_opening_register') }}</Button
        >
      </div> -->
      <div
        v-if="!token"
        style="margin-top: 0.4rem; padding: 0 0.32rem 0.32rem 0.32rem"
      >
        <Button
          :color="'var(--ex-bg-white2)'"
          @click="store.commit('setIsLoginOpen', true)"
          size="large"
          round
        >
          <span style="color: var(--ex-text-color2)">登录/注册</span></Button
        >
      </div>
      <div class="btns" style="border-bottom: 0.02rem solid var(--ex-bg-white2);" v-else>
        <Button
          :loading="loading || submitLoading"
          @click="checkForm"
          v-if="token"
          size="large"
          class="btn"
          :color="tab == 1 ? 'var(--ex-up-color)' : 'var(--ex-down-color)'"
          round
          >{{
            tab == 1 ? t('trade.stock_open_long') : t('trade.stock_open_short')
          }}</Button
        >
      </div>

      <div class="account-box" v-if="token">
        <div class="title">{{ $t('trade.ai_opening_cash_wallet') }}</div>
        <div class="info">
          <div>{{ $t('market.market_faster_available') }}</div>
          <div>
            <span style="font-size: 0.32rem; color: var(--ex-primary-color)">{{
              usdt.amount || '0'
            }}</span>
            <span>&nbsp;USDT</span>
          </div>
        </div>

        <div class="btns">
          <div class="btn ripple-primary" @click="jump('topUpCrypto')">
            {{ $t('assets.recharge') }}
          </div>
          <div class="btn ripple-primary" @click="jump('transfer')">
            {{ $t('assets.transfer') }}
          </div>
        </div>
      </div>
    </div>

    <!-- 开仓确认弹窗 -->
    <Popup
      teleport="body"
      v-model:show="showModel"
      position="bottom"
      round
      closeable
    >
      <div class="van-popup-custom-title">
        {{ t('trade.ai_opening_confirm_order') }}
      </div>
      <div class="stock_submit_box">
        <div class="item">
          <div class="item_name">{{ t('trade.ai_opening_product_type') }}</div>
          <div class="item_val">
            <div class="item_val_text">{{ form1.name }}</div>
          </div>
        </div>
        <div class="item">
          <div class="item_name">{{ t('trade.ai_opening_time_zone') }}</div>
          <div class="item_val">
            <div class="item_val_text">
              {{ currTime.time }}{{ _dateUnitMap[currTime.unit] }}
            </div>
          </div>
        </div>
        <div class="item">
          <div class="item_name">
            {{ t('trade.ai_opening_network_amount') }}
          </div>
          <div class="item_val">
            <div class="item_val_text">{{ form1.grid }}</div>
          </div>
        </div>
        <div class="item">
          <div class="item_name">{{ t('trade.ai_opening_invest_amount') }}</div>
          <div class="item_val">
            <div class="item_val_text">{{ form1.volume }}</div>
            <div class="item_val_unit">USDT</div>
          </div>
        </div>
        <div class="item">
          <div class="item_name">
            {{ t('trade.ai_opening_predict_profit') }}
          </div>
          <div class="item_val">
            <div class="item_val_text">{{ getRange() }}</div>
            <div class="item_val_unit">USDT</div>
          </div>
        </div>

        <FormItem
          v-model="form1.safeword"
          size="large"
          v-if="userInfo.role != 'guest'"
          input-type="password"
          :title="t('trade.stock_opening_trade_pw')"
        >
        </FormItem>

        <Button
          :loading="submitLoading"
          @click="submitForm(form1.safeword)"
          size="large"
          class="submit"
          color="var(--ex-primary-color)"
          round
          >{{ t('trade.ai_opening_confirm_btn') }}</Button
        >
      </div>
    </Popup>

    <!-- ai订单详情 -->
    <AiInfo ref="infoRef" />
    <!-- 开仓-安全密码弹窗 -->
    <SafePassword
      @submit="submitForm"
      ref="safeRef"
      :key="'open'"
    ></SafePassword>

    <!-- 股票行情弹窗 -->
    <Popup
      teleport="body"
      v-model:show="showStockModel"
      position="bottom"
      round
      closeable
    >
      <StockPopup type="ai" style="height: 90vh" v-if="showStockModel" />
    </Popup>

    <!-- ai列表 -->
    <Popup
      teleport="body"
      v-model:show="showBottom"
      round
      closeable
      position="bottom"
    >
      <div class="trade_ai_list">
        <div class="trade_ai_list_title">
          {{ t('trade.ai_opening_ai_quantifi_list') }}
        </div>
        <div class="list">
          <AiItem
            @click.stop="chooseItem(item)"
            v-for="(item, i) in marketAiList"
            :key="i"
            :item="item"
          />
        </div>
      </div>
    </Popup>
  </div>

  <!-- 账户余额弹窗 -->
  <AmountPopup
    ref="AmountPopupRef"
    :name="t('trade.ai_opening_cash_wallet')"
    :amount="usdt.amount"
    :currency="'USDT'"
  />
</template>

<script setup>
  import { getStaticImgUrl } from '@/utils/index.js';
  import { ref, computed, onBeforeUnmount } from 'vue';
  import {
    Slider,
    Button,
    Popup,
    showToast,
    Tabs,
    Tab,
    showConfirmDialog,
  } from 'vant';
  import Decimal from 'decimal.js';
  import store from '@/store';
  import router from '@/router';
  import AiInfo from '../components/AiInfo.vue';
  import AiItem from '../../Market/components/AiItem.vue';
  import { useRoute } from 'vue-router';
  import { _aipara, _aibuy, _aiquant2 } from '@/api/api';
  import SafePassword from '@/components/SafePassword.vue';
  import { _dateUnitMap } from '@/utils/dataMap';
  import StockPopup from '../../trade/StockPopup.vue';
  import FormItem from '@/components/Form/FormItem1.vue';
  import eventBus from '@/utils/eventBus';
  import SlideContainer from '@/components/SlideContainer1.vue';
  import Top from '@/components/Top.vue';
  import AmountPopup from '../AmountPopup.vue';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();
  const props = defineProps({
    mode: {
      type: String,
      default: 'page',
    },
    type: {
      type: String,
      default: 'page',
    },
    tradeType: {
      type: [String, Number],
      default: '',
    },
  });

  const goLogin = () => {
    store.commit('setIsLoginOpen', true);
    // eventBus.on('loginSuccess', () => {
    //     eventBus.off('loginSuccess')
    // })
  };
  // onBeforeUnmount(() => {
  //     eventBus.off('loginSuccess')
  // })

  // 详情
  const infoRef = ref();
  const openInfo = (item) => {
    infoRef.value && infoRef.value.open(item);
  };

  const route = useRoute();
  const wallet = computed(() => store.state.wallet || []);
  const usdt = computed(
    () => wallet.value.find((item) => item.currency == 'USDT') || {},
  );

  const emits = defineEmits(['showNavDialog', 'back']);
  const showNavDialog = () => {
    // emits('showNavDialog', 'ai')
    showBottom.value = true;
  };

  const backFunc = () => {
    emits('back');
  };

  const safeRef = ref();

  const token = computed(() => store.state.token);
  const userInfo = computed(() => store.state.userInfo);
  const tab = ref(1); // 1-看涨 2-看跌
  const showModel = ref(false);

  // 表单

  const form1 = ref({
    name: '',
    symbol: '',
    grid: '1',
    volume: '',
    safeword: '',
  });

  if (props.tradeType == 3) {
    // 机器人
    form1.value.name = route.query.name || '';
    form1.value.symbol = route.query.symbol || '';
  }

  // 缓存
  let obj = {};
  try {
    obj = JSON.parse(sessionStorage.getItem('currAi') || '{}');
  } catch {
    obj = {};
  }
  if (obj.symbol) {
    form1.value.name = obj.name;
    form1.value.symbol = obj.symbol;
    store.commit('setCurrAi', obj);
  }

  const changeGrid = () => {
    setTimeout(() => {
      form1.value.grid = parseInt(form1.value.grid);
      if (form1.value.grid > maxgrid.value) {
        form1.value.grid = maxgrid.value;
      }
      if (form1.value.grid <= 1) {
        form1.value.grid = 1;
      }

      changePercent2();
    }, 0);
  };

  // 拖动
  const sliderValue = ref(0);
  const maxStockNum = computed(() => usdt.value.amount);
  const step = computed(() => 1);
  const onSliderChange = (newValue) => {
    sliderValue.value = newValue;
    if (maxStockNum.value == '--') return (sliderValue.value = 0);
    let v = new Decimal(maxStockNum.value).mul(newValue).div(100);
    v = v.sub(v.mod(step.value));
    form1.value.volume = v.toNumber();
    setTimeout(() => {
      changePercent();
    }, 0);
  };
  const changePercent = () => {
    if (maxStockNum.value == '--' || !form1.value.volume)
      return (sliderValue.value = 0);
    let v = new Decimal(form1.value.volume);
    form1.value.volume = v.sub(v.mod(step.value));
    let p = new Decimal(form1.value.volume)
      .div(maxStockNum.value)
      .mul(100)
      .toNumber();
    if (p < 0) p = 0;
    if (p > 100) p = 100;
    sliderValue.value = Number(p);
  };

  // 开仓
  const error1 = ref(false);
  const error2 = ref(false);
  const checkForm = () => {
    if (!form1.value.symbol) return showToast(t('trade.ai_opening_no_product'));
    if (!form1.value.grid) {
      error1.value = true;
      showToast(t('trade.ai_opening_no_net'));
      return;
    }
    if (!form1.value.volume || form1.value.volume < 0) {
      error2.value = true;
      showToast(t('trade.ai_opening_no_invest_amount'));
      return;
    }
    if (form1.value.volume < minamount.value) {
      error2.value = true;
      showToast(
        `${t('trade.ai_opening_min_invest_amount')}: ` + minamount.value,
      );
      return;
    }
    getSessionToken();
    showModel.value = true;
  };

  const submitLoading = ref(false);
  const submitForm = (s) => {
    if (userInfo.value.role == 'guest') {
      s = '000000';
    }
    if (submitLoading.value) return;
    if (!s) {
      return showToast(t('trade.ai_opening_trade_password'));
    }
    submitLoading.value = true;
    _aibuy({
      symbol: form1.value.symbol,
      offset: tab.value == 1 ? 'long' : 'short',
      time: currTime.value.time,
      unit: currTime.value.unit,
      lever: form1.value.grid,
      amount: form1.value.volume,
      token: sessionToken.value,
      safeword: s,
    })
      .then((res) => {
        if (res && res.code == 200) {
          showModel.value = false;
          store.dispatch('updateWallet');
          showToast(t('trade.ai_opening_success'));
          setTimeout(() => {
            openInfo(res.data);
          }, 500);
          form1.value.safeword = '';
          form1.value.volume = '';
          form1.value.grid = '';
          sliderValue.value = 0;
        }
      })
      .catch((err) => {
        if (err.code == 1010) {
          // 余额不足
          eventBus.emit('insufficient', {
            type: 'spot',
            currency: 'USDT',
            amount: usdt.value.amount,
          });
        }
      })
      .finally(() => {
        getSessionToken();
        setTimeout(() => {
          submitLoading.value = false;
        }, 500);
      });
  };

  // 交易参数
  const loading = ref(false);
  const minamount = ref(0); // 最小投资额
  const maxgrid = ref(0); // 最大网格
  const currTime = ref({}); // 当前时间选项
  const getPercent = () => {
    // 获取利润展示文案
    if (!currTime.value.rangereturn || !form1.value.grid) return '';
    const rangereturn = currTime.value.rangereturn;
    let rs = '';
    try {
      const arr = rangereturn.split(' - ');
      rs = `${new Decimal(arr[0]).mul(form1.value.grid)}% - ${new Decimal(
        arr[1],
      ).mul(form1.value.grid)}%`;
    } catch {}

    return rs;
  };
  // 拖动
  const sliderValue2 = ref(0);
  const onSliderChange2 = (newValue) => {
    sliderValue2.value = newValue;
    if (maxgrid.value == '--') return (sliderValue2.value = 0);
    let v = new Decimal(maxgrid.value).mul(newValue).div(100);
    v = v.sub(v.mod(1));
    form1.value.grid = v.toNumber();
    setTimeout(() => {
      changePercent2();
    }, 0);
  };
  const changePercent2 = () => {
    if (maxgrid.value == '--' || !form1.value.grid)
      return (sliderValue2.value = 0);
    let v = new Decimal(form1.value.grid);
    form1.value.grid = v.sub(v.mod(1));
    let p = new Decimal(form1.value.grid)
      .div(maxgrid.value)
      .mul(100)
      .toNumber();
    if (p < 0) p = 0;
    if (p > 100) p = 100;
    sliderValue2.value = Number(p);
  };
  const getRange = () => {
    // 获取预计盈亏
    if (!currTime.value.rangereturn) return '--';
    if (!form1.value.volume) return '--';
    const rangereturn = currTime.value.rangereturn;
    let rs = '--';
    try {
      const arr = rangereturn.split(' - ');
      const start = new Decimal(form1.value.volume)
        .mul(Number(arr[0]))
        .div(100);
      const end = new Decimal(form1.value.volume).mul(Number(arr[1])).div(100);
      rs = `${start} - ${end}`;
    } catch {}

    return rs;
  };
  const times = ref([]); // 时间选项
  const getParams = () => {
    if (!form1.value.symbol) return;
    loading.value = true;
    _aipara({
      symbol: form1.value.symbol,
    })
      .then((res) => {
        if (!res.data) return;
        minamount.value = res.data.minamount;
        maxgrid.value = res.data.maxgrid;
        times.value = res.data.list || [];
        if (times.value[0]) {
          currTime.value = times.value[0];
        }
      })
      .finally(() => {
        loading.value = false;
      });
  };
  getParams();

  // sessionToken
  const sessionToken = computed(() => store.state.sessionToken || '');
  const getSessionToken = () => {
    store.dispatch('updateSessionToken');
  };

  // 打开行情
  const showStockModel = ref(false);
  const openStockModel = () => {
    store.commit('setCurrAi', form1.value);
    showStockModel.value = true;
  };

  const AmountPopupRef = ref();
  const openConfirmBox = () => {
    AmountPopupRef.value && AmountPopupRef.value.open();
  };

  // 跳转
  const jump = (name) => {
    router.push({
      name,
    });
  };

  // ai列表
  const showBottom = ref(false);
  const marketAiList = computed(() => store.state.marketAiList || []); // ai量化默认列表
  const chooseItem = (item) => {
    form1.value.name = item.name;
    form1.value.symbol = item.symbol;
    store.commit('setCurrAi', item);
    showBottom.value = false;
    getParams();
    sessionStorage.setItem('currAi', JSON.stringify(item));
  };
  if (!marketAiList.value.length) {
    _aiquant2({
      name: '',
      page: 1,
    }).then((res) => {
      store.commit('setMarketAiList', res.data || []);
      setTimeout(() => {
        store.dispatch('subList', {
          commitKey: 'setMarketAiList',
          listKey: 'marketAiList',
        });
      }, 500);
    });
  }
  const init = () => {
    error1.value = false;
    error2.value = false;
    form1.value = {
      name: route.query.name || '',
      symbol: route.query.symbol || '',
      grid: '1',
      volume: '',
    };
    getParams();
  };

  defineExpose({
    init,
    choose: chooseItem,
  });
</script>

<style lang="less" scoped>
  .scroller {
    box-sizing: border-box;
    padding: 0 0.32rem;
  }

  .time_popup {
    :deep(.van-popup__close-icon) {
      right: inherit;
      left: 0.32rem;
      top: 0.28rem;
    }
  }

  .time_popup_btn {
    width: 1.2rem;
    height: 0.6rem;
    flex-shrink: 0;
    border-radius: 1rem;
    background: var(--ex-primary-color);
    line-height: 0.6rem;
    position: absolute;
    right: 0.3rem;
    top: 0.22rem;
    color: var(--ex-text-color--bg-primary);
    text-align: center;
    font-size: 0.3rem;
    font-weight: 500;
  }

  .item_time {
    display: flex;
    justify-content: space-between;
  }

  .time_list {
    margin-left: -0.2rem;

    .time {
      width: 25%;
      float: left;
      box-sizing: border-box;
      padding: 0.1rem 0 0.1rem 0.2rem;

      span {
        border-radius: 0.7rem;
        display: block;
        border: 1px solid var(--ex-bg-white2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.28rem;
        color: var(--ex-text-color2);
        height: 0.6rem;
        box-sizing: border-box;
      }
    }

    .curr_time span {
      background-color: var(--ex-primary-color);
      border-color: var(--ex-primary-color);
      color: var(--ex-text-color--bg-primary);
    }

    &::after {
      content: '';
      display: block;
      clear: both;
    }
  }

  .trade_ai--popup {
    padding: 0.28rem 0.32rem 0 0.32rem;

    .scroller {
      height: calc(100vh - 2.42rem);
      overflow-y: auto;
      padding-bottom: 2rem;
    }

    .btns {
      position: absolute;
      bottom: 0;
      width: 100%;
      left: 0;

      background-color: rgba(255, 255, 255, 0.7);
      z-index: 1000;
    }
  }

  .trade_ai {
    .btns {
      padding: 0.32rem 0.16rem 0.4rem 0.16rem;
      display: flex;

      .btn {
        flex: 1;
        margin: 0 0.16rem;
      }
    }

    .subtitle {
      color: var(--ex-text-color);
      font-size: 0.28rem;
      margin-bottom: 0.12rem;
      line-height: 0.36rem;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .stock_icon {
        width: 0.36rem;
        height: 0.36rem;
      }
    }

    .item_content {
      margin-top: 0.4rem;
    }

    .put_all {
      color: var(--ex-primary-color);
      position: absolute;
      right: 0.32rem;
      font-size: 0.3rem;
      z-index: 9;
      transition: all ease 0.3s;
    }

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;

      .ipt {
        flex: 1;
        height: 100%;
        width: 2rem;
        font-size: 0.28rem;
        padding: 0;
        position: relative;
        z-index: 1;
      }

      .select {
        height: 0.88rem;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-left: 0.32rem;
        padding: 0 0.32rem;
        border: 1px solid var(--ex-border-color2);
        border-radius: 0.12rem;

        .select_more {
          width: 0.32rem;
          height: 0.32rem;
          margin-left: 1rem;
        }
      }
    }

    .item_box {
      position: relative;
      height: 0.92rem;
      border-radius: 0.32rem;
      border: 1px solid var(--ex-border-color2);
      padding: 0 0.24rem;
    }

    .disabled_item {
      background-color: var(--ex-bg-white2);
      color: var(--ex-text-color2);
    }

    .error_border {
      border: 1px solid var(--ex-border-error) !important;
    }
  }

  .stock_submit_box {
    padding: 0.2rem 0.5rem 0.6rem;

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.36rem 0 0.2rem 0;
      border-bottom: 1px solid var(--ex-border-color);

      .item_name {
        color: var(--ex-text-color3);
        font-size: 0.28rem;
        font-weight: 400;
      }

      .item_val {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        color: var(--ex-text-color);
        font-size: 0.28rem;
        font-weight: 600;

        &_unit {
          margin-left: 0.06rem;
          font-size: 0.24rem;
          line-height: 100%;
          margin-top: 0.04rem;
        }
      }
    }

    .subtitle {
      font-size: 0.24rem;
      margin-bottom: 0.2rem;
      color: var(--ex-text-color);
      font-weight: 400;
    }

    .pass_ipt {
      margin-bottom: 0.4rem;
      border-radius: 0.12rem;
      border: 1px solid var(--ex-border-color2);
      padding: 0 0.24rem;

      .ipt {
        height: 0.8rem;
      }
    }

    .submit {
      margin-top: 0.5rem;
    }
  }

  .trade_ai_list {
    .trade_ai_list_title {
      font-size: 0.32rem;
      line-height: 0.6rem;
      text-align: center;
      margin-bottom: 0.2rem;
      margin-top: 0.2rem;
      font-weight: bold;
    }

    .list {
      max-height: 80vh;
      padding: 0.4rem 0.32rem;
      overflow-y: auto;
    }
  }

  .tabs-container {
    border: 1px solid var(--ex-bg-white1);
    border-radius: 0.32rem;
    margin: 0.08rem;

    :deep(.van-tabs__wrap) {
      .van-tabs__nav {
        .van-tab--active {
          &::after {
            background-image: url('/static/img/common/active_tab2.svg');
          }
        }
      }
    }

    .account-box {
      padding: 0.36rem 0.32rem;
      margin-top: 0.1rem;
      border-top: 1px solid var(--ex-border-color);

      .title {
        font-size: 0.32rem;
        color: var(--black);
        margin-bottom: 0.4rem;
      }

      .info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--ex-text-color3);
      }

      .btns {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 0.52rem;

        .btn {
          width: 3rem;
          height: 0.68rem;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ex-text-color);
          font-size: 0.28rem;
          background-color: var(--ex-bg-white2);
        }
      }
    }
  }
</style>
