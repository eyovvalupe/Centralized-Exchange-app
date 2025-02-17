<!-- 开仓表单 -->
<template>
  <div class="form">
    <!-- 搜索 -->
    <!-- <div class="item_box" :class="{ 'item_box_big': currStock.symbol }" @click="openSearchDialog">
      <div class="item">
        <div class="tip-title" v-if="currStock.symbol">
          <span @click="showNavDialog">{{
            t("trade.contract_opening_contract")
          }}</span>
          <Loading v-show="searchLoading" type="circular" style="width: 0.28rem; height: 0.28rem"
            color="var(--ex-primary-color)" />
          <div class="stock_icon" v-show="!searchLoading && currStock.symbol" @click.stop="openStockModel">
            <img v-lazy="getStaticImgUrl('/static/img/trade/blue-stock.svg')" />
          </div>
        </div>
        <div class="info">
          <div style="flex: 1;display: flex;align-items: center;">
            <div v-if="!currStock.symbol" style="color: var(--ex-text-color3);">{{
              t("trade.contract_opening_contract")
            }}</div>
            <div class="info-symbol" v-show="currStock.name">
              {{ currStock.name }}
            </div>
          </div>
          <div class="more_icon">
            <img v-lazy="getStaticImgUrl('/static/img/common/more.svg')" alt="↓" />
          </div>
        </div>
      </div>
    </div> -->

    <!-- 止盈止损 -->
    <template v-if="props.activeTab == 2">
      <!-- 简单模式 -->
      <FormItem
        :placeholder="
          activeType == 1
            ? t('trade.stock_opening_take')
            : t('trade.stock_opening_stop')
        "
        class="mb-[0.2rem]"
        input-type="number"
        v-model="form1.stop_loss_price"
        :percent-tags="
          props.activeType == 1
            ? [
                { label: '-20%', value: 20 },
                { label: '-15%', value: 15 },
                { label: '-10%', value: 10 },
              ]
            : [
                { label: '+20%', value: 20 },
                { label: '+15%', value: 15 },
                { label: '+10%', value: 10 },
              ]
        "
        @percentTagClick="setPriceStop"
        v-if="mode == 1"
      />

      <!-- 价格 -->
      <div class="item_box">
        <div class="item_box_right">
          <FormItem custom disabled v-if="priceMode == 1">
            <span style="color: var(--ex-text-color4); font-size: 0.32rem">{{
              t('trade.stock_opening_price_latest')
            }}</span>
            <template #right-con>
              <!-- 市价/限价 -->
              <div class="pricetype-modes">
                <div
                  class="pricetype-mode tab_ani"
                  @click="priceMode = 1"
                  :class="{ 'pricetype-mode-active': priceMode == 1 }"
                >
                  {{ t('trade.stock_opening_price_market') }}
                </div>
                <div
                  class="pricetype-mode tab_ani"
                  @click="priceMode = 2"
                  :class="{ 'pricetype-mode-active': priceMode == 2 }"
                >
                  {{ t('trade.stock_opening_price_limit') }}
                </div>
              </div>
            </template>
          </FormItem>

          <FormItem
            :placeholder="t('trade.stock_opening_price')"
            v-model="form1.price"
            input-type="number"
            :percent-tags="
              props.activeType == 1
                ? [
                    { label: '-3%', value: 3 },
                    { label: '-1%', value: 1 },
                  ]
                : [
                    { label: '+3%', value: 3 },
                    { label: '+1%', value: 1 },
                  ]
            "
            v-else
            @percentTagClick="percentTagClick"
          >
            <template #right-con>
              <!-- 市价/限价 -->
              <div class="pricetype-modes">
                <div
                  class="pricetype-mode"
                  @click="priceMode = 1"
                  :class="{ 'pricetype-mode-active': priceMode == 1 }"
                >
                  {{ t('trade.stock_opening_price_market') }}
                </div>
                <div
                  class="pricetype-mode"
                  @click="priceMode = 2"
                  :class="{ 'pricetype-mode-active': priceMode == 2 }"
                >
                  {{ t('trade.stock_opening_price_limit') }}
                </div>
              </div>
            </template>
          </FormItem>
        </div>

        <!-- <div class="mode_btn" @click="changePriceMode" :class="{ 'active_btn': priceMode == 2 }">{{ priceMode ==
                    1 ? '市价' : '限价' }}</div> -->
      </div>
    </template>

    <!-- 价格 -->
    <FormItem
      class="mb-[0.2rem]"
      input-type="number"
      :placeholder="t('trade.stock_opening_price_title')"
      :tip="t('trade.stock_opening_price_tip')"
      v-model="form1.price"
      :percent-tags="
        props.activeType == 1
          ? [
              { label: '-3%', value: 3 },
              { label: '-2%', value: 2 },
              { label: '-1%', value: 1 },
              { label: `${t('trade.stock_opening_price_label')}`, value: 0 },
            ]
          : [
              { label: '+3%', value: 3 },
              { label: '+2%', value: 2 },
              { label: '+1%', value: 1 },
              { label: `${t('trade.stock_opening_price_label')}`, value: 0 },
            ]
      "
      @percentTagClick="percentTagClick"
      v-if="props.activeTab == 1"
    />

    <!-- 保证金模式 -->
    <div class="item_box">
      <div class="item_box_right" @click="showModeTypeDialog = true">
        <div class="item justify-between">
          <div class="tip-title">
            {{ t('trade.stock_opening_amount_mode') }}
          </div>
          <span class="flex text-center" style="margin-bottom: 0.06rem">
            {{
              form1.leverType == 'cross'
                ? t('trade.stock_opening_position_mode_cross')
                : t('trade.stock_opening_position_mode_isolated') || '--'
            }}</span
          >
          <div class="more_icon more_icon2">
            <img
              v-lazy="getStaticImgUrl('/static/img/common/more.svg')"
              alt="↓"
            />
          </div>
        </div>
      </div>
      <div
        class="item_box_right"
        style="margin-left: 0.2rem"
        @click="showLeverTypeDialog = true"
      >
        <div class="item justify-between">
          <div class="tip-title">{{ t('trade.stock_opening_lever') }}</div>
          <span v-if="!levers.length">--</span>
          <span class="flex text-center" style="margin-bottom: 0.06rem" v-else>
            {{ form1.lever }}X</span
          >
          <div class="more_icon more_icon2">
            <img
              v-lazy="getStaticImgUrl('/static/img/common/more.svg')"
              alt="↓"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 张数 -->
    <div
      class="item_box"
      style="overflow: hidden; border-radius: 0 0.32rem 0 0"
    >
      <div
        class="tip-box"
        @click="tipZ"
        :style="{ opacity: volumeF ? '0' : '1' }"
      >
        <img v-lazy="getStaticImgUrl(`/static/img/common/warning.svg`)" />
      </div>
      <div class="item_box_right">
        <FormItem
          :hasScroll="true"
          :placeholder="t('trade.contract_lots_amount')"
          @blur="volumeF = false"
          @focus="volumeFocus"
          v-model="form1.volume"
          :show-btn="maxStockNum >= 1"
          btn-show-mode="focus"
          @btnClick="putAll"
          @change="changePercent"
          :max="maxStockNum"
          tip-align="right"
          :tip="maxStockNum >= 1 ? '≤' + maxStockNum : ''"
          input-type="digit"
        >
          <!-- <template #lt>
            <div style="display: flex;align-items: center;height: 0.48rem;" v-if="amountper && paramCurrency">
              <div style="width: 0.24rem;height: 0.24rem;margin-right: 0.1rem;">
                <img v-lazy="getStaticImgUrl('/static/img/trade/warning_icon.svg')" alt="↓" />
              </div>
              <span>{{ `1${t(
                'trade.contract_one_lot'
              )} = ${amountper} ${paramCurrency}` }}</span>
            </div>
          </template> -->
          <!-- <template #rt>
            <div @click="openConfirmBox" class="mask-btn">
              <div
                style="color: var(--ex-text-color2); font-size: 0.24rem;padding: 0.12rem 0.16rem;border-radius: 0.4rem;background-color: var(--ex-bg-color);">
                <span>{{ t("assets.wallet_available_sim") }}</span>
                <span style="color: var(--ex-primary-color);margin:0 0.08rem">{{ stockWalletAmount || '--' }} </span>
                <span>{{ paramCurrency }}</span>
              </div>
            </div>
          </template> -->

          <template #scroll>
            <!-- 拖动 -->
            <SlideContainer v-model="sliderValue" @change="onSliderChange" />
          </template>
        </FormItem>
      </div>
    </div>

    <!-- 按钮 -->
    <Button
      v-if="token"
      :loading="configLoading || submitLoading"
      size="large"
      @click="submit1"
      class="submit ripple-btn"
      :color="
        activeType == 1 ? 'var(--ex-primary-color)' : 'var(--ex-down-color)'
      "
      round
    >
      <span style="color: var(--ex-white)">{{
        activeType == 1
          ? t('trade.stock_open_long')
          : t('trade.stock_open_short')
      }}</span>
    </Button>

    <div v-if="!token" style="margin-top: 0.6rem" class="unlogin-box">
      <div class="flex justify-between mb-[0.32rem]">
        <div
          class="w-[3.22rem] h-[0.8rem] rounded-[0.4rem] flex items-center justify-center text-[0.3rem] btn"
          @click="store.commit('setIsLoginOpen', true), emits('success')"
        >
          {{ t('trade.stock_opening_token_login') }}
        </div>
        <div
          class="w-[3.22rem] h-[0.8rem] rounded-[0.4rem] flex items-center justify-center text-[0.3rem] btn btn2"
          @click="jump('register')"
        >
          {{ t('trade.stock_opening_token_register') }}
        </div>
      </div>
      <!-- <div class="w-full h-[0.8rem]   rounded-[0.4rem] flex items-center justify-center text-[0.3rem] btn" @click="() => router.push({ name: 'register', query: { guest: 'guest' } })
        ">
        {{ t("trade.contract_create_guest_btn") }}
      </div> -->
    </div>
  </div>

  <!-- 开仓确认弹窗 -->
  <BottomPopup
    teleport="body"
    v-model:show="showModel"
    position="bottom"
    round
    closeable
  >
    <div class="van-popup-custom-title">
      {{ t('trade.stock_opening_confirm_title') }}
    </div>
    <div class="stock_submit_box">
      <div
        style="
          border-radius: 0.32rem;
          background-color: var(--ex-bg-white2);
          margin-bottom: 0.32rem;
          padding: 0 1px 1px 1px;
        "
      >
        <!-- 股票 -->
        <div style="line-height: 0.36rem; text-align: left; padding: 0.28rem">
          <div
            style="
              font-size: 0.32rem;
              margin-bottom: 0.1rem;
              display: flex;
              align-items: center;
              justify-content: flex-start;
            "
          >
            <div
              style="width: 0.4rem; height: 0.4rem; margin-right: 0.16rem"
              v-if="currStock.name && currStock.name.replace('/USDT', '')"
            >
              <CryptoIcon
                :name="currStock.name.replace('/USDT', '').toUpperCase()"
              />
            </div>
            <span class="mr-[6px]">{{ currStock.name }}</span>
            <div
              class="text-[11px] h-[0.3rem] w-max px-[5px] rounded-[4px] tag-crypto flex items-center"
            >
              {{ t('market.market_optional_contract') }}
            </div>
          </div>
        </div>

        <div class="confirm-item-box">
          <div class="item">
            <div class="item_name">
              {{ t('trade.contract_opening_order_value') }}
            </div>
            <div class="item_val">
              {{ orderAmount }}
            </div>
          </div>
          <div class="item">
            <div class="item_name">{{ t('trade.stock_open') }}</div>
            <div class="item_val">
              <div
                class="tag"
                :class="activeType == 1 ? 'green_tag' : 'red_tag'"
              >
                {{
                  activeType == 1
                    ? t('market.market_marketinfo_long')
                    : t('market.market_marketinfo_short')
                }}
              </div>
              <div class="tag">
                {{
                  params.lever_type == 'cross'
                    ? t('trade.stock_opening_position_mode_cross')
                    : params.lever_type == 'isolated'
                    ? t('trade.stock_opening_position_mode_isolated')
                    : '--'
                }}
              </div>
              <div class="lever">{{ params.lever || 1 }}X</div>
            </div>
          </div>
          <div class="item">
            <div class="item_name">{{ t('trade.stock_opening_price') }}</div>
            <div class="item_val">
              <div class="tag">
                {{
                  params.price_type == 'market'
                    ? t('trade.stock_opening_price_market')
                    : t('trade.stock_opening_price_limit')
                }}
              </div>
              <div class="lever" v-if="params.price">{{ params.price }}</div>
            </div>
          </div>
          <div class="item">
            <div class="item_name">
              {{ t('trade.contract_opening_amount') }}
            </div>
            <div class="item_val">{{ params.volume }}</div>
          </div>
          <div class="item">
            <div class="item_name">{{ t('trade.stock_take_stop') }}</div>
            <div class="item_val" v-if="props.activeTab != 2">
              <div class="tag">{{ t('trade.stock_opening_no') }}</div>
            </div>
            <div v-if="props.activeTab == 2">
              <div
                class="item_val"
                style="margin-bottom: 0.12rem"
                v-if="mode == 2"
              >
                <div class="tag green_tag">
                  {{ t('trade.stock_opening_take') }}
                </div>
                <div class="lever">{{ params.stop_profit_price }}</div>
              </div>
              <div class="item_val">
                <div class="tag red_tag">
                  {{ t('trade.stock_opening_stop') }}
                </div>
                <div class="lever">{{ params.stop_loss_price }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="money_box">
        <div class="amount">
          {{ t('trade.stock_opening_pay') }} <strong>{{ payAmount }}</strong>
        </div>
        <div class="fee">
          {{ t('trade.stock_opening_upfront') }} <span>{{ payOrigin }}</span> +
          {{ t('trade.stock_opening_fee') }} <span>{{ payFee }}</span>
        </div>
      </div>

      <div
        style="
          width: calc(100% + 1.2rem);
          height: 0.02rem;
          background-color: var(--ex-bg-white2);
          margin-bottom: 0.32rem;
          position: relative;
          left: -0.6rem;
        "
      ></div>

      <div class="item pass_ipt">
        <input
          style="width: 100%; height: 100%"
          v-model="safePass"
          :placeholder="t('trade.stock_opening_trade_pw')"
          :type="showPassword ? 'text' : 'password'"
          class="ipt"
        />
        <img
          v-if="!showPassword"
          v-lazy="getStaticImgUrl('/static/img/common/close_eye.svg')"
          @click="showPassword = true"
          alt="off"
        />
        <img
          v-else
          v-lazy="getStaticImgUrl('/static/img/common/open_eye.svg')"
          alt="open"
          @click="showPassword = false"
        />
      </div>
      <Button
        :loading="submitLoading"
        @click="submitFormDialog"
        size="large"
        class="submit ripple-btn"
        color="var(--ex-primary-color)"
        round
        ><span style="color: var(--ex-white)">{{
          t('trade.stock_open')
        }}</span></Button
      >
    </div>
  </BottomPopup>

  <!-- 股票行情弹窗 -->
  <BottomPopup
    teleport="body"
    v-model:show="showStockModel"
    position="bottom"
    round
    closeable
  >
    <StockPopup style="height: calc(var(--vh) * 90)" v-if="showStockModel" />
  </BottomPopup>

  <!-- 止盈类型选择 -->
  <ActionSheet
    teleport="body"
    v-model:show="showUpModelDialog"
    @select="onSelectUpMode"
    :actions="upModeList"
    :title="t('trade.stock_opening_take')"
  >
  </ActionSheet>

  <!-- 止损类型选择 -->
  <ActionSheet
    teleport="body"
    v-model:show="showDownModelDialog"
    @select="onSelectDownMode"
    :actions="downModeList"
    :title="t('trade.stock_opening_stop')"
  >
  </ActionSheet>

  <!-- 仓位模式选择 -->

  <BottomPopup
    class="van-popup-custom--bottom"
    closeable
    v-model:show="showTypeDialog"
    round
    position="bottom"
    teleport="body"
  >
    <div class="van-popup-custom-title">
      {{ t('trade.stock_opening_amount_mode') }}
    </div>
    <div class="van-popup-custom__top-rbtn" @click="showTypeDialog = false">
      {{ t('trade.stock_opening_confirm') }}
    </div>
    <Picker
      :show-toolbar="false"
      :swipe-duration="200"
      :columns="columns"
      @confirm="showTypeDialog = false"
      @cancel="showTypeDialog = false"
      @change="onSelectForm1Type"
    />
  </BottomPopup>

  <!-- 限价模式选择 -->
  <ActionSheet
    teleport="body"
    v-model:show="showPriceTypeDialog"
    :actions="priceModeList"
    @select="onSelectForm1PriceType"
    :title="t('trade.stock_opening_amount_limit_mode')"
  >
  </ActionSheet>

  <!-- 保证金模式选择 -->
  <ActionSheet
    teleport="body"
    v-model:show="showModeTypeDialog"
    :actions="modeList"
    @select="onSelectForm1ModeType"
    :title="t('trade.stock_opening_amount_mode')"
  >
  </ActionSheet>

  <!-- 杠杆选择 -->
  <ActionSheet
    teleport="body"
    v-model:show="showLeverTypeDialog"
    :actions="leversActions"
    @select="onSelectLeverType"
    :title="t('trade.stock_opening_lever')"
  >
  </ActionSheet>

  <!-- 跳转选择 -->
  <ActionSheet
    teleport="body"
    v-model:show="showJumpTypeDialog"
    :actions="jumpModeList"
    @select="onSelectJumpModeType"
    :title="t('trade.stock_opening_show_jump_type')"
  >
  </ActionSheet>

  <!-- 开仓-安全密码弹窗 -->
  <SafePassword @submit="submitForm" ref="safeRef" :key="'open'"></SafePassword>

  <!-- 搜索列表 -->
  <BottomPopup
    round
    v-model:show="showSearchDialog"
    position="bottom"
    closeable
    teleport="body"
  >
    <div class="van-popup-custom-title">
      {{ t('trade.stock_opening_search') }}
    </div>
    <div class="search_dialog_trade">
      <!-- 搜索 -->
      <div class="item search_box">
        <div class="search_icon">
          <img
            v-lazy="getStaticImgUrl('/static/img/common/search.svg')"
            alt="🔍"
          />
        </div>
        <input
          v-model.trim="searchDialogStr"
          @keyup="goDialogSearch"
          type="text"
          class="ipt"
          style="width: 100%"
          :placeholder="t('trade.stock_opening_search')"
        />
      </div>

      <div class="lists">
        <StockTable
          :showIcon="true"
          theme="classic"
          :handleClick="handleClick"
          :loading="searchLoading"
          :key="'search'"
          :list="marketSearchList"
        />
      </div>
    </div>
  </BottomPopup>

  <!-- 余额提示 -->
  <Popup round v-model:show="showAmountDialog" closeable teleport="body">
    <div style="width: 6.4rem">
      <!-- 标题 -->
      <div
        style="
          text-align: center;
          font-size: 0.32rem;
          height: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--ex-border-color);
        "
      >
        {{ t('market.market_faster_available') }}
      </div>

      <!-- 内容 -->
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: var(--ex-bg-color2);
          border: 1px solid var(--ex-border-color);
          border-radius: 0.32rem;
          line-height: 0.4rem;
          margin-top: 0.32rem;
          overflow: hidden;
          position: relative;
          margin: 0.32rem 0.4rem;
        "
      >
        <div
          style="
            color: var(--ex-text-color);
            font-size: 0.28rem;
            font-weight: 400;
            padding: 0 0.32rem;
            height: 1.4rem;
            background-color: var(--ex-bg-color);
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          {{ t('assets.wallet_header_contract') }}
        </div>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            flex: 1;
          "
        >
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 0.08rem;
            "
          >
            <div
              v-if="paramCurrency"
              style="
                width: 0.32rem;
                height: 0.32rem;
                display: flex;
                position: relative;
                top: -0.02rem;
              "
            >
              <CryptoIcon :name="paramCurrency.toUpperCase()" />
            </div>

            <span
              style="
                font-size: 0.28rem;
                margin-left: 0.12rem;
                color: var(--ex-text-color);
                font-weight: 400;
              "
              >{{ paramCurrency }}</span
            >
          </div>
          <b
            style="
              font-size: 0.4rem;
              color: var(--ex-primary-color);
              font-weight: bold;
            "
            >{{ stockWalletAmount }}</b
          >
        </div>
      </div>

      <!--  按钮 -->
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 0.4rem;
          font-size: 0.28rem;
          margin: 0.64rem 0 0.4rem 0;
        "
      >
        <div
          class="ripple-btn"
          @click="router.push({ name: 'transfer' })"
          style="
            height: 0.8rem;
            width: 48%;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.64rem;
            border: 1px solid var(--ex-primary-color);
            color: var(--ex-primary-color);
          "
        >
          {{ t('trade.ai_opening_pop_transfer') }}
        </div>
        <div
          @click="router.push({ name: 'topUpCrypto' })"
          class="bg-primary text-color--bg-primary ripple-btn"
          style="
            height: 0.8rem;
            width: 48%;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.64rem;
          "
        >
          {{ t('trade.ai_opening_pop_recharge') }}
        </div>
      </div>
    </div>
  </Popup>
</template>

<script setup>
  import { getStaticImgUrl } from '@/utils/index.js';
  import { Button, showToast, Popup, ActionSheet, Picker } from 'vant';
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  import { _futures, _basic, _futuresPara, _futuresBuy } from '@/api/api';
  import store from '@/store';
  import Decimal from 'decimal.js';
  import { useRoute } from 'vue-router';
  import router from '@/router';
  import StockPopup from '../../trade/StockPopup.vue';
  import SafePassword from '@/components/SafePassword.vue';
  import StockTable from '@/components/StockTable.vue';
  import SlideContainer from '@/components/SlideContainer.vue';
  import FormItem from '@/components/Form/FormItem.vue';
  import { useI18n } from 'vue-i18n';
  import BottomPopup from '@/components/BottomPopup.vue';
  import eventBus from '@/utils/eventBus';
  import CryptoIcon from '../../../components/CryptoIcon.vue';

  onMounted(() => {
    eventBus.on('choosePrice', (val) => {
      form1.value.price = val;
    });
  });
  onBeforeUnmount(() => {
    eventBus.off('choosePrice');
  });

  const props = defineProps({
    activeTab: null, // 0-市价 1-限价 2-止盈止损
    activeType: null,
    type: {
      type: String,
      default: '',
    },
    mode: {
      // constract-加密货币 foreign-外汇 commodities-大宗交易
      type: String,
      default: 'constract',
    },
    tradeType: {
      type: [String, Number],
      default: '',
    },
  });
  const searchMap = {
    constract: 'crypto',
    foreign: 'forex',
    commodities: 'blocktrade',
  };

  const { t } = useI18n();
  const showPassword = ref(false);
  const safeRef = ref();

  const tipZ = () => {
    showToast(
      `1${t('trade.contract_one_lot')} = ${amountper.value} ${
        paramCurrency.value
      }`,
    );
  };

  //搜索
  // const marketSearchList = computed(() => {
  //   let arr = [];
  //   switch (props.mode) {
  //     case "constract":
  //       arr = store.state.contractList || [];
  //       break;
  //     case "foreign":
  //       arr = store.state.marketForeignList || [];
  //       break;
  //     case "commodities":
  //       arr = store.state.marketCommoditiesList || [];
  //       break;
  //   }
  //   return arr;
  // });
  const marketSearchList = computed(() => store.state.futuresSearchList);
  const userInfo = computed(() => store.state.userInfo);
  const showSearchDialog = ref();
  const searchDialogStr = ref('');
  const openSearchDialog = () => {
    showSearchDialog.value = true;
    goDialogSearch();
  };

  let searchTimeout = null;
  const searchLoading = ref(false);

  const goDialogSearch = (market) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchLoading.value = true;
    let s = searchDialogStr.value;
    searchTimeout = setTimeout(() => {
      _futures({
        name: s,
        type: '',
        // type: searchMap[props.mode] || "",
      })
        .then((res) => {
          if (searchDialogStr.value == s) {
            let arr = (res.data || []).map((item) => {
              const target = marketSearchList.value.find(
                (a) => a.symbol == item.symbol,
              );
              if (target)
                return {
                  ...target,
                  ...item,
                };
              return item;
            });
            // switch (props.mode) {
            //   case 'constract':
            //     store.commit("setContractList", arr);
            //     break
            //   case 'foreign':
            //     store.commit("setMarketForeignList", arr);
            //     break
            //   case 'commodities':
            //     store.commit("setMarketCommoditiesList", arr);
            //     break
            // }

            // setTimeout(() => {
            //   switch (props.mode) {
            //     case 'constract':
            //       store.dispatch("subList", {
            //         commitKey: "setContractList",
            //         listKey: "contractList",
            //       });
            //       break
            //     case 'foreign':
            //       store.dispatch("subList", {
            //         commitKey: "setMarketForeignList",
            //         listKey: "marketForeignList",
            //       });
            //       break
            //     case 'commodities':
            //       store.dispatch("subList", {
            //         commitKey: "setMarketCommoditiesList",
            //         listKey: "marketCommoditiesList",
            //       });
            //       break
            //   }

            // }, 100);
            store.commit('setFuturesSearchList', arr);
            store.dispatch('subList', {
              commitKey: 'setFuturesSearchList',
              listKey: 'futuresSearchList',
            });
          }
        })
        .finally(() => {
          searchLoading.value = false;
        });
    }, 100);
  };

  const emits = defineEmits(['showNavDialog', 'success']);
  const showNavDialog = () => {
    emits('showNavDialog');
  };
  const showJumpTypeDialog = ref(false); // 跳转开关
  const jumpModeList = ref([
    { name: t('trade.stock_opening_jump_mode1'), value: 'transfer' },
    { name: t('trade.stock_opening_jump_mode2'), value: 'swap' },
    { name: t('trade.stock_opening_jump_mode3'), value: 'topUpCrypto' },
  ]);
  const onSelectJumpModeType = (item) => {
    jump(item.value);
  };

  // 仓位类型
  const showModeTypeDialog = ref(false);
  const modeMap = ref({
    cross: t('trade.stock_opening_position_mode_cross'),
    isolated: t('trade.stock_opening_position_mode_isolated'),
  });
  const onSelectForm1ModeType = (item) => {
    showModeTypeDialog.value = false;
    form1.value.leverType = item.value;
  };
  // 杠杆选择
  const showLeverTypeDialog = ref(false);
  const onSelectLeverType = (item) => {
    showLeverTypeDialog.value = false;
    form1.value.lever = item.value;
  };

  // 市价-类型
  const showTypeDialog = ref(false);
  const onSelectForm1Type = (item) => {
    // showTypeDialog.value = false
    form1.value.leverType = item.selectedValues[0];
    form1.value.lever = item.selectedValues[1];
    form1.value.volume = '';
    sliderValue.value = 0;
  };

  // 限价模式
  const showPriceTypeDialog = ref(false);
  const priceModeList = computed(() => {
    const list = [];
    list.push({
      name: t('trade.stock_opening_price_market'),
      value: 1,
      className: priceMode.value == 1 ? 'action-sheet-active' : '',
    });
    list.push({
      name: t('trade.stock_opening_price_limit'),
      value: 2,
      className: priceMode.value == 2 ? 'action-sheet-active' : '',
    });
    return list;
  });
  const columns = computed(() => {
    return [
      [
        {
          text: t('trade.stock_opening_position_mode_cross'),
          value: 'cross',
          className:
            form1.value.leverType == 'cross' ? 'action-sheet-active' : '',
        },
        {
          text: t('trade.stock_opening_position_mode_isolated'),
          value: 'isolated',
          className:
            form1.value.leverType == 'isolated' ? 'action-sheet-active' : '',
        },
      ],
      levers.value.map((item) => {
        return {
          text: item + 'X',
          value: item,
          className: form1.value.lever == item ? 'action-sheet-active' : '',
        };
      }),
    ];
  });
  const leversActions = computed(() => {
    return levers.value.map((item) => {
      return {
        name: item + 'X',
        value: item,
        className: form1.value.lever == item ? 'action-sheet-active' : '',
      };
    });
  });
  const onSelectForm1PriceType = (item) => {
    showPriceTypeDialog.value = false;
    priceMode.value = item.value;
    if (priceMode.value == 1) {
      form1.value.price = '';
      form1.value.price_type = 'market';
    } else {
      form1.value.price_type = 'limit';
    }
  };

  const route = useRoute();
  const token = computed(() => store.state.token);
  const modeList = computed(() => {
    const list = [];
    for (let key in modeMap.value) {
      list.push({
        name: modeMap.value[key],
        value: key,
        className: form1.value.leverType == key ? 'action-sheet-active' : '',
      });
    }
    return list;
  });

  const elseWallet = computed(() => store.state.elseWallet || []);
  const stockWalletAmount = computed(() => {
    // 股票账户余额
    const target = elseWallet.value.find(
      (item) => item.account == 'futures' && item.name == paramCurrency.value,
    );
    if (target) return target.amount;
    return 0;
  });

  const maxStockNum = computed(() => {
    // 最大可买 可卖
    if (!levers.value.length) {
      return '--';
    }
    if (currStock.value.price) {
      const max = new Decimal(stockWalletAmount.value)
        .mul(1 - (openFee.value || 0))
        .div(amountper.value)
        .mul(form1.value.lever)
        .floor();
      const rs = max - max.mod(step.value);
      return rs > min.value ? rs : 0;
    }
    return '--';
  });

  const showAmountDialog = ref(false);
  const openConfirmBox = () => {
    showAmountDialog.value = true;
  };

  // 限价
  const setNowPrice = () => {
    // 设置为当前价格
    form1.value.price = currStock.value.price || '';
  };

  const setPricePercent = (i) => {
    // 设置浮动价格
    if (props.activeType == 1) {
      // 买涨
      form1.value.price = new Decimal(currStock.value.price)
        .mul(100 - i)
        .div(100)
        .toNumber();
    } else {
      // 买跌
      form1.value.price = new Decimal(currStock.value.price)
        .mul(100 + i)
        .div(100)
        .toNumber();
    }
  };

  const percentTagClick = (percent) => {
    if (percent.value == 0) {
      setNowPrice();
    } else {
      setPricePercent(percent.value);
    }
  };

  // 市价
  const currStock = computed(() => {
    let obj = {};
    switch (props.mode) {
      case 'constract':
        obj = store.state.currConstact || [];
        break;
      case 'foreign':
        obj = store.state.currForeign || [];
        break;
      case 'commodities':
        obj = store.state.currCommodities || [];
        break;
    }
    return obj;
  }); // 当前

  const form1 = ref({
    leverType: 'cross',
    lever: 1,
    volume: '',
    price: '',
    price_type: props.activeTab == 1 ? 'limit' : 'market',
    stop_profit_type: null, // 价格-[ price ]  金额-[ amount ]  百分比-[ ratio ]
    stop_profit_price: null,
    stop_loss_type: null,
    stop_loss_price: null,
  });

  // 止盈止损参数
  const mode = ref(1); // 1-简单模式  2-复杂模式
  const priceMode = ref(1); // 1-市价 2-限价
  const setPriceStop = (p) => {
    // 设置止损价格
    if (!currStock.value.price) return;
    const i = p.value;
    if (props.activeType == 1) {
      // 买涨
      form1.value.stop_loss_price = new Decimal(currStock.value.price)
        .mul(100 - i)
        .div(100)
        .toNumber();
    } else {
      // 买跌
      form1.value.stop_loss_price = new Decimal(currStock.value.price)
        .mul(100 + i)
        .div(100)
        .toNumber();
    }
  };
  const changeMode = () => {
    mode.value = mode.value == 1 ? 2 : 1;
    if (mode.value == 1) {
      form1.value.stop_profit_type = null;
      form1.value.stop_profit_price = null;
    } else {
      form1.value.stop_profit_type = 'price';
      form1.value.stop_profit_price = '';
    }
    form1.value.stop_loss_type = 'price';
    form1.value.stop_loss_price = '';
  };
  const stopMap = ref({
    price: t('trade.stock_opening_stop_price'),
    amount: t('trade.stock_opening_stop_amount'),
    ratio: t('trade.stock_opening_stop_ratio'),
  });
  if (props.activeTab == 2) {
    form1.value.stop_loss_type = 'price';
    form1.value.stop_loss_price = '';
  }
  const showUpModelDialog = ref(false);
  const showDownModelDialog = ref(false);
  const upModeList = computed(() => {
    const list = [];
    for (let key in stopMap.value) {
      list.push({
        name: stopMap.value[key],
        value: key,
        className:
          form1.value.stop_profit_type == key ? 'action-sheet-active' : '',
      });
    }
    return list;
  });
  const downModeList = computed(() => {
    const list = [];
    for (let key in stopMap.value) {
      list.push({
        name: stopMap.value[key],
        value: key,
        className:
          form1.value.stop_loss_type == key ? 'action-sheet-active' : '',
      });
    }
    return list;
  });
  const onSelectUpMode = (item) => {
    // 选择止盈类型
    showUpModelDialog.value = false;
    form1.value.stop_profit_type = item.value;
    form1.value.stop_profit_price = '';
  };
  const onSelectDownMode = (item) => {
    // 选择止损类型
    showDownModelDialog.value = false;
    form1.value.stop_loss_type = item.value;
    form1.value.stop_loss_price = '';
  };
  const inputStop = (key) => {
    // 输入止盈止损
    if (key == 1) {
      // 止盈
      form1.value.stop_profit_price =
        form1.value.stop_profit_price < 0 ? 0 : form1.value.stop_profit_price;
      if (form1.value.stop_profit_type == 'ratio') {
        form1.value.stop_profit_price =
          form1.value.stop_profit_price > 100
            ? 100
            : form1.value.stop_profit_price;
      }
    } else {
      // 止损
      form1.value.stop_loss_price =
        form1.value.stop_loss_price < 0 ? 0 : form1.value.stop_loss_price;
      if (form1.value.stop_loss_type == 'ratio') {
        form1.value.stop_loss_price =
          form1.value.stop_loss_price > 100 ? 100 : form1.value.stop_loss_price;
      }
    }
  };

  const submit1 = () => {
    if (!currStock.value.trade)
      return showToast(t('trade.stock_opening_closed'));
    if (!currStock.value.symbol)
      return showToast(t('trade.contract_opening_err_contract'));
    if (!form1.value.volume || form1.value.volume < min.value)
      return showToast(t('trade.contract_opening_err_amount'));
    // 限价校验
    if (props.activeTab == 1) {
      if (!form1.value.price)
        return showToast(t('trade.stock_opening_err_price'));
    }
    // 止盈止损校验
    if (props.activeTab == 2) {
      if (mode.value == 1) {
        // 简单模式
        if (!form1.value.stop_loss_price)
          return showToast(t('trade.stock_opening_err_stop_price'));
      } else {
        // 复杂模式
        if (!form1.value.stop_profit_price)
          return showToast(t('trade.stock_opening_err_take_price'));
        if (!form1.value.stop_loss_price)
          return showToast(t('trade.stock_opening_err_stop_price'));
      }
      if (priceMode.value == 2 && !form1.value.price) {
        // 限价
        return showToast(t('trade.stock_opening_err_limit'));
      }
    }
    getSessionToken();
    // 打开确认弹窗
    params.value = {
      symbol: currStock.value.symbol,
      offset: props.activeType == 1 ? 'long' : 'short',
      volume: Number(form1.value.volume),
      lever_type: form1.value.leverType,
      lever: form1.value.lever,
      price_type: form1.value.price_type,

      price: form1.value.price_type == 'market' ? '' : form1.value.price || '',
      stop_profit_type: form1.value.stop_profit_type,
      stop_profit_price: form1.value.stop_profit_price,
      stop_loss_type: form1.value.stop_loss_type,
      stop_loss_price: form1.value.stop_loss_price,
    };
    if (props.activeTab == 2) {
      // 止盈止损
      if (priceMode.value == 1) {
        // 市价
        params.value.price_type = 'market';
        params.value.price = '';
      } else {
        // 限价
        form1.value.price_type = 'limit';
      }
    }

    safePass.value = '';
    if (userInfo.value.role == 'user') showModel.value = true;
    if (userInfo.value.role == 'guest') submitForm('000000');
  };

  // 全部
  const putAll = () => {
    onSliderChange(100);
  };
  // 市价-拖动
  const sliderValue = ref(0);
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
    if (
      maxStockNum.value == '--' ||
      !form1.value.volume ||
      form1.value.volume == 0
    ) {
      form1.value.volume = '';
      return (sliderValue.value = 0);
    }
    let p = new Decimal(form1.value.volume)
      .div(maxStockNum.value)
      .mul(100)
      .toNumber();
    if (p < 0) p = 0;
    if (p > 100) p = 100;
    sliderValue.value = Number(p);
  };

  const volumeF = ref(false);
  const volumeFocus = () => {
    volumeF.value = true;
    if (!currStock.value.symbol)
      return showToast(t('trade.contract_opening_err_contract'));
  };

  // 下单限制的参数
  const min = ref(1); // 最小购买
  const step = ref(1); // 步长
  const openFee = ref(0); // 开仓手续费
  const closeFee = ref(0); // 平仓手续费
  const interest = ref(0); // 持仓费
  const closingline = ref(100); // 强平线
  const amountper = ref(1); // 每张金额
  const configLoading = ref(false);
  const paramCurrency = ref(''); // 交易使用的货币
  const levers = ref([]); // 杠杆

  const getParam = () => {
    levers.value = [];
    configLoading.value = true;
    _futuresPara({
      symbol: currStock.value.symbol,
    })
      .then((res) => {
        if (res && res.data) {
          paramHandle(res.data);
        }
      })
      .finally(() => {
        configLoading.value = false;
      });
  };
  const paramHandle = (data) => {
    configLoading.value = false;
    interest.value = data.interest || 0;
    closingline.value = data.closingline || 100;
    amountper.value = data.amountper || 1;
    form1.value.volume = '';
    form1.value.stop_loss_price = '';
    form1.value.price = '';
    sliderValue.value = 0;
    if (data.fee) {
      openFee.value = data.fee || 0;
      closeFee.value = data.fee || 0;
    }
    if (data.currency) {
      paramCurrency.value = data.currency || '';
    }
    if (data.lever) {
      levers.value = data.lever.split(',');
      if (levers.value[0]) {
        form1.value.lever = levers.value[0];
      }
    }
  };

  const initParam = () => {
    if (currStock.value.symbol) {
      getParam();
    } else {
      form1.value.stop_loss_price = '';
      form1.value.price = '';
      min.value = 1;
      step.value = 1;
      openFee.value = 0;
      closeFee.value = 0;
      interest.value = 0;
      closingline.value = 100;
      amountper.value = 1;
      levers.value = [];
    }
  };

  const setCurrStockFunc = (item) => {
    switch (props.mode) {
      case 'constract':
        sessionStorage.setItem('currConstract', JSON.stringify(item));
        store.commit('setCurrConstract', item);
        break;
      case 'foreign':
        store.commit('setCurrForeign', item);
        sessionStorage.setItem('currForeign', JSON.stringify(item));
        break;
      case 'commodities':
        store.commit('setCurrCommodities', item);
        sessionStorage.setItem('currCommodities', JSON.stringify(item));
        break;
    }
    sessionStorage.setItem('currConstract', JSON.stringify(item));
    store.commit('setCurrConstractItem', item);
  };

  const handleClick = (item) => {
    showSearchDialog.value = false;
    setCurrStockFunc(item);
    initParam();
    _basic({ symbol: currStock.value.symbol }).then((r) => {
      if (
        r &&
        r.data &&
        r.data.symbol &&
        currStock.value.symbol == r.data.symbol
      ) {
        setCurrStockFunc({
          ...currStock.value,
          ...r.data,
        });
      }
    });
  };

  // 初始化
  setTimeout(() => {
    if (currStock.value.symbol) {
      handleClick(currStock.value);
    }
  }, 500);

  // url参数处理
  if (props.tradeType == 2) {
    // 合约
    if (route.query.symbol) {
      handleClick({
        symbol: route.query.symbol,
      });
    } else {
      let obj = {};
      try {
        switch (props.mode) {
          case 'constract':
            obj = JSON.parse(sessionStorage.getItem('currConstract') || '{}');
            break;
          case 'foreign':
            obj = JSON.parse(sessionStorage.getItem('currForeign') || '{}');
            break;
          case 'commodities':
            obj = JSON.parse(sessionStorage.getItem('currCommodities') || '{}');
            break;
        }
      } catch {
        obj = {};
      }
      if (obj.symbol) {
        handleClick(obj);
      } else {
        initParam();
      }
    }
  }

  const openTypeDialog = () => {
    if (!levers.value.length) {
      if (!currStock.value.symbol) {
        showToast(t('trade.contract_opening_err_contract'));
      }
      return;
    }
    showTypeDialog.value = true;
  };

  // 开仓
  const params = ref({});
  const showModel = ref(false);
  const safePass = ref('');
  const payAmount = computed(() => {
    // 需要支付
    return new Decimal(payOrigin.value).add(payFee.value);
  });

  const orderAmount = computed(() => {
    // 订单金额
    if (!params.value.volume || !amountper.value) return 0;
    return new Decimal(amountper.value).mul(params.value.volume);
  });
  const payOrigin = computed(() => {
    // 保证金
    if (!params.value.volume || !amountper.value || !params.value.lever)
      return 0;
    return new Decimal(params.value.volume)
      .mul(amountper.value)
      .div(form1.value.lever);
  });
  const payFee = computed(() => {
    // 手续费
    return new Decimal(payOrigin.value).mul(openFee.value);
  });
  const submitLoading = ref(false);
  const submitFormDialog = () => {
    if (!safePass.value) {
      return showToast(t('trade.stock_opening_trade_pw_placeholder'));
    }
    submitForm(safePass.value);
    //showModel.value = false
    //safeRef.value && safeRef.value.open()
  };
  const submitForm = (s) => {
    if (submitLoading.value) return;
    submitLoading.value = true;
    _futuresBuy({
      ...params.value,
      token: sessionToken.value,
      safeword: s,
    })
      .then((res) => {
        if (res && res.code == 200) {
          showModel.value = false;
          store.dispatch('updateWallet');
          showToast(t('trade.stock_opening_success'));
          form1.value.volume = '';
          sliderValue.value = 0;
          // setTimeout(() => {
          //   emits("success");
          // }, 1500);
          emits('success');
        }
      })
      .finally(() => {
        getSessionToken();
        setTimeout(() => {
          submitLoading.value = false;
        }, 500);
      });
  };

  // 打开行情
  const showStockModel = ref(false);
  const openStockModel = () => {
    // store.commit("setCurrStock", currStock.value);
    showStockModel.value = true;
  };

  // sessionToken
  const sessionToken = computed(() => store.state.sessionToken || '');
  const getSessionToken = () => {
    store.dispatch('updateSessionToken');
  };
  getSessionToken();

  // 跳转
  const jump = (name) => {
    router.push({
      name,
    });
  };

  defineExpose({
    // 选择某个股票
    choose: handleClick,
    stockWalletAmount,
  });
</script>

<style lang="less" scoped>
  .search_dialog_trade {
    .lists {
      height: calc(var(--vh) * 60);
      overflow-y: auto;
      margin-top: 0.32rem;
    }

    .search_box {
      height: 0.8rem;
      padding: 0 0.32rem;
      margin: 0.4rem 0.3rem 0 0.3rem;
      display: flex;
      align-items: center;
      background-color: var(--ex-bg-color2);
      border-radius: 0.6rem;
      border: 1px solid var(--ex-border-color2);

      .search_icon {
        width: 0.48rem;
        height: 0.48rem;
        margin-right: 0.24rem;
      }

      .ipt {
        height: 100%;
        font-weight: 400;
      }

      .ipt::placeholder {
        color: var(--ex-text-color4);
      }
    }
  }

  .form {
    // padding: 0.28rem;
    position: relative;
    border-radius: 0.32rem;
    background-color: var(--ex-bg-color3);
    margin-top: 0.32rem;

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

    :deep(.form-item-title) {
      margin-top: 0rem;
    }

    .item_box {
      display: flex;
      align-items: stretch;
      margin-bottom: 0.2rem;
      position: relative;

      .tip-box {
        width: 0.6rem;
        height: 0.4rem;
        border-radius: 0 0 0 0.32rem;
        background-color: var(--ex-bg-color);
        position: absolute;
        top: 0;
        right: 0;
        padding: 0.1rem 0.05rem;
        z-index: 999;
        transition: all ease-in 0.3s;
      }

      .item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        flex-wrap: wrap;
        height: 1.12rem;
        border-radius: 0.32rem;
        border: 1px solid var(--ex-border-color2);
        padding: 0.06rem 0.24rem;
        background-color: var(--ex-bg-white1);

        .tip-title {
          color: var(--ex-text-color3);
          width: 100%;
          font-size: 0.28rem;
          margin-bottom: 0rem;
          line-height: 0.36rem;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          justify-content: space-between;

          .stock_icon {
            width: 0.32rem;
            height: 0.32rem;
          }
        }

        .info {
          font-size: 0.28rem;
          font-weight: 400;
          width: 100%;
          left: 0;
          box-sizing: border-box;
          pointer-events: none;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .more_icon {
            // margin-right: 0.3rem;
          }
        }

        .info-symbol {
          color: var(--ex-text-color);
          font-size: 0.3rem;
        }

        .ipt {
          flex: 1;
          height: 100%;
          width: 2rem;
          font-size: 0.28rem;
          padding: 0;
          color: var(--ex-primary-color);
          position: relative;
          z-index: 1;
        }

        .more_icon {
          width: 0.32rem;
          height: 0.32rem;
          margin-left: 0.08rem;
          transform: rotate(-90deg);
        }

        .more_icon2 {
          position: absolute;
          right: 0.32rem;
          top: 50%;
          transform: translateY(-50%) rotate(-90deg);
        }
      }

      .disabled_item {
        background-color: var(--ex-border-color2);
      }

      .item_box_left {
        width: 2.2rem;
        margin-right: 0.2rem;
        display: flex;
        flex-direction: column;
      }

      .item_box_right {
        flex: 1;
      }

      .pricetype-modes {
        height: 0.6rem;
        border-radius: 0.2rem;
        margin-left: 0.32rem;
        overflow: hidden;
        display: flex;
        align-items: stretch;
        z-index: 99;
        background-color: var(--ex-bg-color3);

        .pricetype-mode {
          color: var(--ex-text-color2);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 0.16rem;
          font-size: 0.24rem;
          line-height: 400;
        }

        .pricetype-mode-active {
          background-color: var(--ex-white);
          color: var(--ex-bg-color);
          border-radius: 0.2rem;
        }
      }

      .mode_btn {
        padding: 0 0.6rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 1.26rem;
        background: var(--ex-bg-color2);
        height: 0.72rem;
        color: var(--ex-text-color3);
        text-align: center;
        font-size: 0.28rem;
        font-weight: 600;
        margin-left: 0.16rem;
        margin-top: 0.08rem;
      }

      .active_btn {
        background: var(--ex-primary-color);
        color: var(--ex-text-color--bg-primary);
      }
    }

    .item_box_big {
      .item {
        // height: 1.48rem;
      }
    }

    .unlogin-box {
      .btn {
        background-color: var(--ex-white);
        color: var(--ex-bg-color);
      }
      .btn2 {
        background-color: var(--ex-primary-color);
        color: var(--ex-white);
      }
    }

    .submit {
      margin-top: 0.2rem;
      border-radius: 1rem;
    }
  }

  .stock_submit_box {
    padding: 0.4rem 0.32rem 0.6rem 0.32rem;

    .confirm-item-box {
      border-radius: 0.32rem;
      background-color: var(--ex-bg-color9);
      padding: 14px 20px;
      height: 207px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      // padding: 0.36rem 0 0.2rem 0;
      // border-bottom: 1px solid var(--ex-border-color);

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
        font-weight: 500;

        .tag {
          height: 0.44rem;
          color: var(--ex-white);
          background-color: var(--ex-bg-white2);
          line-height: 0.44rem;
          padding: 0 0.2rem;
          border-radius: 0.4rem;
          margin-left: 0.08rem;
          font-size: 0.24rem;
        }

        .red_tag {
          background-color: rgb(var(--ex-down-color-rgb) / 0.08);
          color: var(--ex-down-color);
        }

        .green_tag {
          background-color: rgb(var(--ex-up-color-rgb) / 0.08);
          color: var(--ex-up-color);
        }

        .lever {
          text-align: right;
          width: max-content;
          padding-left: 0.08rem;
        }
      }
    }

    .subtitle {
      font-size: 0.28rem;
      margin-bottom: 0.12rem;
      color: var(--ex-text-color);
      font-weight: 400;
      line-height: 150%;
    }

    .pass_ipt {
      margin-bottom: 0.58rem;
      border-radius: 0.32rem;
      // border: 1px solid var(--ex-border-color2);
      padding: 0 0.24rem;
      height: 1.12rem;
      padding: 0.16rem 0.32rem;
      box-sizing: border-box;
      position: relative;
      background-color: var(--ex-bg-white1);

      img {
        width: 0.4rem;
        height: 0.4rem;
        position: absolute;
        right: 0.32rem;
        top: 50%;
        transform: translateY(-50%);
        z-index: 9999;
      }
    }

    .money_box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: var(--ex-bg-white2);
      border-radius: 0.32rem;
      height: 1.4rem;
      text-align: center;
      margin-top: 0.2rem;
      position: relative;
      margin-bottom: 0.4rem;

      .amount {
        color: var(--ex-text-color2);
        line-height: 0.56rem;

        strong {
          color: var(--ex-text-color);
          font-size: 0.36rem;
          font-weight: 600;
          margin-left: 0.12rem;
        }
      }

      .fee {
        color: var(--ex-text-color2);
        font-size: 0.24rem;
        font-weight: 400;
        line-height: 0.36rem;
        padding: 0.04rem 0 0 0.2rem;

        span {
          color: var(--ex-text-color);
        }
      }
    }
  }
</style>
