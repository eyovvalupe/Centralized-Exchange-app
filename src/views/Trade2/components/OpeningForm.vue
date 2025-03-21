<!-- 开仓表单 -->
<template>
  <div class="form">

    <!-- 搜索 -->
    <!-- <div class="item_box" :class="{ 'item_box_big': currStock.symbol }" @click="openSearchDialog">
      <div class="item">
        <div class="tip-title" v-if="currStock.symbol">
          <span @click="showNavDialog">{{ t("trade.stock_opening_stock") }}</span>
          <Loading v-show="searchLoading" type="circular" style="width: 0.28rem; height: 0.28rem"
            color="var(--ex-primary-color)" />
          <div class="stock_icon" v-show="!searchLoading && currStock.symbol" @click.stop="openStockModel">
            <img v-lazy="getStaticImgUrl('/static/img/trade/blue-stock.svg')" />
          </div>
        </div>
        <div class="info">
          <div style="flex: 1;height: 100%;">
            <div v-if="!currStock.symbol" style="color: var(--ex-text-color3);">{{
              t("trade.stock_opening_stock")
            }}</div>
            <div class="info-symbol">{{ currStock.symbol }}</div>
            <div v-if="currStock.symbol" class="info-name" style="margin-top: 0.15rem;">{{ currStock.name }}</div>
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
      <FormItem :placeholder="activeType == 1
        ? t('trade.stock_opening_take')
        : t('trade.stock_opening_stop')
        " class="mb-[0.2rem]" v-model="form1.stop_loss_price" input-type="number" :percent-tags="props.activeType == 1
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
          " @percentTagClick="setPriceStop" v-if="mode == 1" />

      <!-- 价格 -->
      <div class="item_box">
        <div class="item_box_right">
          <FormItem custom disabled v-if="priceMode == 1">
            <span style="color: var(--ex-text-color4)">
              {{ t("trade.stock_opening_price_latest") }}</span>

            <template #right-con>
              <!-- 市价/限价 -->
              <div class="pricetype-modes">
                <div class="pricetype-mode tab_ani" @click="priceMode = 1"
                  :class="{ 'pricetype-mode-active': priceMode == 1 }">
                  {{
                    t("trade.stock_opening_price_market") }}</div>
                <div class="pricetype-mode tab_ani" @click="priceMode = 2"
                  :class="{ 'pricetype-mode-active': priceMode == 2 }">
                  {{
                    t("trade.stock_opening_price_limit") }}</div>
              </div>
            </template>
          </FormItem>

          <FormItem :placeholder="t('trade.stock_opening_price')" v-model="form1.price" input-type="number"
            :percent-tags="props.activeType == 1
              ? [
                { label: '-3%', value: 3 },
                { label: '-1%', value: 1 },
              ]
              : [
                { label: '+3%', value: 3 },
                { label: '+1%', value: 1 },
              ]
              " v-else @percentTagClick="percentTagClick">
            <template #right-con>
              <!-- 市价/限价 -->
              <div class="pricetype-modes">
                <div class="pricetype-mode" @click="priceMode = 1" :class="{ 'pricetype-mode-active': priceMode == 1 }">
                  {{
                    t("trade.stock_opening_price_market") }}</div>
                <div class="pricetype-mode" @click="priceMode = 2" :class="{ 'pricetype-mode-active': priceMode == 2 }">
                  {{
                    t("trade.stock_opening_price_limit") }}</div>
              </div>
            </template>
          </FormItem>
        </div>


      </div>
    </template>

    <!-- 价格 -->
    <FormItem class="mb-[0.2rem]" input-type="number" :placeholder="t('trade.stock_opening_price_title')"
      :tip="t('trade.stock_opening_price_tip')" v-model="form1.price" :percent-tags="props.activeType == 1
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
        " @percentTagClick="percentTagClick" v-if="props.activeTab == 1" />

    <!-- 股票 -->
    <!-- <div class="subtitle">
      <span @click="showNavDialog">{{ t("trade.stock_opening_stock") }}</span>
      <Loading v-show="searchLoading" type="circular" style="width: 0.28rem; height: 0.28rem"
        color="var(--ex-primary-color)" />
      <div class="stock_icon" v-show="!searchLoading && currStock.symbol" @click="openStockModel">
        <img v-lazy="getStaticImgUrl('/static/img/trade/blue-stock.svg')" />
      </div>
    </div> -->


    <!-- 保证金模式 -->
    <div class="item_box">
      <div class="item_box_right" @click="showModeTypeDialog = true">
        <div class="item justify-between">
          <div class="tip-title">{{ t('trade.stock_opening_amount_mode') }}</div>
          <span class="flex text-center" style="margin-bottom: 0.06rem;">
            {{
              form1.leverType == "cross"
                ? t("trade.stock_opening_position_mode_cross")
                : t("trade.stock_opening_position_mode_isolated") || "--"
            }}</span>
          <div class="more_icon more_icon2">
            <img v-lazy="getStaticImgUrl('/static/img/common/more.svg')" alt="↓" />
          </div>
        </div>
      </div>
      <div class="item_box_right" style="margin-left: 0.2rem;" @click="showLeverTypeDialog = true">
        <div class="item justify-between">
          <div class="tip-title">{{ t('trade.stock_opening_lever') }}</div>
          <span v-if="!levers.length">--</span>
          <span class="flex text-center" style="margin-bottom: 0.06rem;" v-else>
            {{ form1.lever }}X</span>
          <div class="more_icon more_icon2">
            <img v-lazy="getStaticImgUrl('/static/img/common/more.svg')" alt="↓" />
          </div>
        </div>
      </div>
    </div>

    <!-- 数量 -->
    <div class="item_box">
      <div class="item_box_right">
        <FormItem :hasScroll="true" :placeholder="t('trade.stock_opening_amount_title')" :max="maxStockNum"
          v-model="form1.volume" :show-btn="maxStockNum >= 1" btn-show-mode="focus" @btnClick="putAll"
          @change="changePercent" tip-align="right" :tip="'≤' + maxStockNum" input-type="number">
          <!-- <template #title-right v-if="token">
            <span style="color: var(--ex-primary-color); font-size: 12px" @click="openConfirmBox"><span
                style="color: var(--ex-text-color2)">{{
                  t("assets.wallet_available_sim")
                }}</span>
              {{ stockWalletAmount }} {{ paramCurrency }}</span>
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
    <Button v-if="token" :loading="configLoading || submitLoading" size="large" @click="submit1"
      class="submit ripple-btn" :color="activeType == 1 ? 'var(--ex-primary-color)' : 'var(--ex-down-color)'" round>
      <span style="color:var(--ex-white);">{{
        activeType == 1
          ? t("trade.stock_open_long")
          : t("trade.stock_open_short")
      }}</span></Button>

    <div v-if="!token" style="margin-top: 0.6rem;" class="unlogin-box">
      <div class="flex justify-between mb-[0.32rem]">
        <div
          class="w-[3.22rem] h-[0.8rem]   rounded-[0.4rem] flex items-center justify-center text-[0.3rem] btn ripple-primary"
          @click="store.commit('setIsLoginOpen', true)">
          {{ t("trade.stock_opening_token_login") }}
        </div>
        <div
          class="w-[3.22rem] h-[0.8rem]  rounded-[0.4rem] flex items-center justify-center  text-[0.3rem] btn btn2 ripple-primary"
          @click="jump('register')">
          {{ t("trade.stock_opening_token_register") }}
        </div>
      </div>
      <!-- <div
        class="w-full h-[0.8rem]   rounded-[0.4rem] flex items-center justify-center text-[0.3rem] btn ripple-primary"
        @click="() => router.push({ name: 'register', query: { guest: 'guest' } })
        ">
        {{ t("trade.contract_create_guest_btn") }}
      </div> -->
    </div>
  </div>

  <!-- 开仓确认弹窗 -->
  <BottomPopup teleport="body" v-model:show="showModel" position="bottom" round closeable>
    <div class="van-popup-custom-title">
      {{ t("trade.stock_opening_confirm_title") }}
    </div>
    <div class="stock_submit_box">

      <div style="border-radius: 0.32rem;
          background-color: var(--ex-bg-white2);
          margin-bottom: 0.32rem;
          padding: 0 1px 1px 1px;">


        <!-- 股票 -->
        <div style="line-height: 0.36rem; text-align: left; padding: 0.28rem">
          <div style="
              font-size: 0.32rem;
              margin-bottom: 0.1rem;
              display: flex;
              align-items: center;
              justify-content: flex-start;
            ">
            <span class="mr-[0.12rem]">{{ currStock.symbol }}</span>
            <div class="text-[0.22rem] h-[0.3rem] w-max px-[0.1rem] rounded-[0.08rem] tag-crypto flex items-center">
              股票
            </div>
          </div>
        </div>

        <div class="confirm-item-box">

          <!-- <div class="item">
            <div class="item_name">{{ t("trade.stock_opening_stock") }}</div>
            <div class="item_val">
              <div style="line-height: 0.36rem">
                <div style="text-align: right; font-size: 0.3rem">
                  {{ currStock.symbol }}
                </div>
                <div style="color: var(--ex-text-color3); font-size: 0.24rem">
                  {{ currStock.name }}
                </div>
              </div>
            </div>
          </div> -->
          <div class="item">
            <div class="item_name">{{ t("trade.stock_open") }}</div>
            <div class="item_val">
              <div class="tag" :class="activeType == 1 ? 'green_tag' : 'red_tag'">
                {{
                  activeType == 1
                    ? t("trade.stock_open_long")
                    : t("trade.stock_open_short")
                }}
              </div>
              <!-- <div class="tag">{{ modeMap[params.lever_type] }}</div> -->
              <div class="tag">
                {{
                  params.lever_type == "cross"
                    ? t("trade.stock_opening_position_mode_cross")
                    : params.lever_type == "isolated"
                      ? t("trade.stock_opening_position_mode_isolated")
                      : "--"
                }}
              </div>
              <div class="lever">{{ params.lever || 1 }}X</div>
            </div>
          </div>
          <div class="item">
            <div class="item_name">{{ t("trade.stock_opening_price") }}</div>
            <div class="item_val">
              <div class="tag">
                {{
                  params.price_type == "market"
                    ? t("trade.stock_opening_price_market")
                    : t("trade.stock_opening_price_limit")
                }}
              </div>
              <div class="lever" v-if="params.price">{{ params.price }}</div>
            </div>
          </div>
          <div class="item">
            <div class="item_name">{{ t("trade.stock_opening_amount") }}</div>
            <div class="item_val">{{ params.volume }}</div>
          </div>
          <div class="item">
            <div class="item_name">{{ t("trade.stock_take_stop") }}</div>
            <div class="item_val" v-if="props.activeTab != 2">
              <div class="tag">{{ t("trade.stock_opening_no") }}</div>
            </div>
            <div v-if="props.activeTab == 2">
              <div class="item_val" style="margin-bottom: 0.12rem" v-if="mode == 2">
                <div class="tag green_tag">{{ t("trade.stock_opening_take") }}</div>
                <div class="lever">{{ params.stop_profit_price }}</div>
              </div>
              <div class="item_val">
                <div class="tag red_tag">{{ t("trade.stock_opening_stop") }}</div>
                <div class="lever">{{ params.stop_loss_price }}</div>
              </div>
            </div>
          </div>
        </div>


      </div>

      <div class="money_box">
        <div class="amount">
          {{ t("trade.stock_opening_pay") }} <strong>{{ payAmount }}</strong>
        </div>
        <div class="fee">
          {{ t("trade.stock_opening_upfront") }} <span>{{ payOrigin }}</span> +
          {{ t("trade.stock_opening_fee") }} <span>{{ payFee }}</span>
        </div>
      </div>

      <div style="
          width: calc(100% + 1.2rem);
          height: 0.02rem;
          background-color: var(--ex-bg-white2);
          margin-bottom: 0.32rem;
          position: relative;
          left: -0.6rem;
        "></div>
      <!-- <div class="subtitle">{{ t("trade.stock_opening_trade_pw") }}</div> -->
      <div class="item pass_ipt">
        <input v-model="safePass" :placeholder="t('trade.stock_opening_trade_pw')"
          :type="showPassword ? 'text' : 'password'" class="ipt" />
        <img v-if="!showPassword" v-lazy="getStaticImgUrl('/static/img/common/close_eye.svg')"
          @click="showPassword = true" alt="off" />
        <img v-else v-lazy="getStaticImgUrl('/static/img/common/open_eye.svg')" alt="open"
          @click="showPassword = false" />
      </div>
      <Button class="ripple-btn" :loading="submitLoading" @click="submitFormDialog" size="large"
        color="var(--ex-primary-color)" round>
        <span style="color: var(--ex-white);">{{ t("trade.stock_open") }}</span>
      </Button>
    </div>
  </BottomPopup>

  <!-- 股票行情弹窗 -->
  <BottomPopup teleport="body" v-model:show="showStockModel" position="bottom" round closeable>
    <StockPopup style="height: calc(var(--vh) * 90)" v-if="showStockModel" />
  </BottomPopup>

  <!-- 止盈类型选择 -->
  <ActionSheet teleport="body" v-model:show="showUpModelDialog" @select="onSelectUpMode" :actions="upModeList"
    :title="t('trade.stock_opening_take')">
  </ActionSheet>

  <!-- 止损类型选择 -->
  <ActionSheet teleport="body" v-model:show="showDownModelDialog" @select="onSelectDownMode" :actions="downModeList"
    :title="t('trade.stock_opening_stop')">
  </ActionSheet>

  <!-- 仓位模式选择 -->
  <BottomPopup class="van-popup-custom--bottom" closeable v-model:show="showTypeDialog" round position="bottom"
    teleport="body">
    <div class="van-popup-custom-title">
      {{ t("trade.stock_opening_amount_mode") }}
    </div>
    <div class="van-popup-custom__top-rbtn" @click="showTypeDialog = false">
      {{ t("trade.stock_opening_confirm") }}
    </div>
    <Picker :show-toolbar="false" :swipe-duration="200" :columns="columns" @confirm="showTypeDialog = false"
      @cancel="showTypeDialog = false" @change="onSelectForm1Type" />
  </BottomPopup>

  <!-- 限价模式选择 -->
  <ActionSheet teleport="body" v-model:show="showPriceTypeDialog" :actions="priceModeList"
    @select="onSelectForm1PriceType" :title="t('trade.stock_opening_amount_limit_mode')">
  </ActionSheet>

  <!-- 保证金模式选择 -->
  <ActionSheet teleport="body" v-model:show="showModeTypeDialog" :actions="modeList" @select="onSelectForm1ModeType"
    :title="t('trade.stock_opening_amount_mode')">
  </ActionSheet>

  <!-- 杠杆选择 -->
  <ActionSheet teleport="body" v-model:show="showLeverTypeDialog" :actions="leversActions" @select="onSelectLeverType"
    :title="t('trade.stock_opening_lever')">
  </ActionSheet>

  <!-- 跳转选择 -->
  <ActionSheet teleport="body" v-model:show="showJumpTypeDialog" :actions="jumpModeList" @select="onSelectJumpModeType"
    :title="t('trade.stock_opening_show_jump_type')">
  </ActionSheet>

  <!-- 开仓-安全密码弹窗 -->
  <SafePassword @submit="submitForm" ref="safeRef" :key="'open'"></SafePassword>

  <!-- 搜索列表 -->
  <BottomPopup round v-model:show="showSearchDialog" position="bottom" closeable teleport="body">
    <div class="van-popup-custom-title">
      {{ t("trade.stock_opening_search") }}
    </div>
    <div class="search_dialog_trade">
      <!-- 搜索 -->
      <div class="item search_box">
        <div class="search_icon">
          <img v-lazy="getStaticImgUrl('/static/img/common/search.svg')" alt="🔍" />
        </div>
        <input v-model.trim="searchDialogStr" @keyup="goDialogSearch('stock')" type="text" class="ipt"
          style="width: 100%" :placeholder="t('trade.stock_opening_search')" />
      </div>

      <div class="lists">
        <!-- 搜索列表 -->
        <StockTable :showIcon="false" :handleClick="handleClick" :loading="searchLoading" :key="'search'"
          :list="marketSearchList" :page="'trade'" />
      </div>
    </div>
  </BottomPopup>

  <!-- 余额提示 -->
  <Popup round v-model:show="showAmountDialog" closeable teleport="body">
    <div style="width: 6.4rem">
      <!-- 标题 -->
      <div style="
          text-align: center;
          font-size: 0.32rem;
          height: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--ex-border-color);
        ">
        {{ t("assets.wallet_available") }}
      </div>

      <!-- 内容 -->
      <div style="
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
        ">
        <div style="
            color: var(--ex-text-color);
            font-size: 0.28rem;
            font-weight: 400;
            padding: 0 0.32rem;
            height: 1.4rem;
            background-color: var(--ex-bg-color);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
          {{ t("assets.wallet_header_stock") }}
        </div>
        <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            flex: 1;
          ">
          <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 0.08rem;
            ">
            <div v-if="paramCurrency" style="
                width: 0.32rem;
                height: 0.32rem;
                display: flex;
                position: relative;
                top: -0.02rem;
              ">
              <CryptoIcon :name="paramCurrency.toUpperCase()" />
            </div>

            <span style="
                font-size: 0.28rem;
                margin-left: 0.12rem;
                color: var(--ex-text-color);
                font-weight: 400;
              ">{{ paramCurrency }}</span>
          </div>
          <b style="font-size: 0.4rem; color: var(--ex-primary-color); font-weight: bold">{{
            stockWalletAmount
          }}</b>
        </div>
      </div>

      <!--  按钮 -->
      <div style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 0.4rem;
          font-size: 0.28rem;
          margin: 0.64rem 0 0.4rem 0;
        ">
        <div class="ripple-btn" @click="router.push({ name: 'transfer' })" style="
            height: 0.8rem;
            width: 48%;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.64rem;
            border: 1px solid var(--ex-primary-color);
            color: var(--ex-primary-color);
          ">
          {{ t("trade.stock_opening_btn_transfer") }}
        </div>
        <div @click="router.push({ name: 'topUpCrypto' })" class="bg-primary text-color--bg-primary ripple-btn" style="
            height: 0.8rem;
            width: 48%;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.64rem;
          ">
          {{ t("trade.stock_opening_btn_recharge") }}
        </div>
      </div>
    </div>
  </Popup>
</template>

<script setup>
import ciper from "@/utils/ciper.js"
import { getStaticImgUrl } from "@/utils/index.js";
import { Loading, Button, showToast, Popup, ActionSheet, Picker } from "vant";
import { ref, computed, watch, nextTick } from "vue";
import { _stock, _basic, _stocksPara, _stocksBuy } from "@/api/api";
import store from "@/store";
import Decimal from "decimal.js";
import { useRoute } from "vue-router";
import router from "@/router";
import StockPopup from "../../trade/StockPopup.vue";
import SafePassword from "@/components/SafePassword.vue";
import StockTable from "@/components/StockTable.vue";
import SlideContainer from "@/components/SlideContainer.vue";
import FormItem from "@/components/Form/FormItem.vue";
import { useI18n } from "vue-i18n";
import BottomPopup from "@/components/BottomPopup.vue";
import eventBus from "@/utils/eventBus.js"

const props = defineProps({
  activeTab: null, // 0-市价 1-限价 2-止盈止损
  activeType: null,
  tradeType: {
    type: [String, Number],
    default: "",
  },
});

const { t } = useI18n();
const goLogin = () => {
  store.commit("setIsLoginOpen", true);
  // eventBus.on('loginSuccess', () => {
  //     eventBus.off('loginSuccess')
  // })
};

const showPassword = ref(false);

const safeRef = ref();

//搜索
const marketSearchList = computed(() => store.state.marketSearchList || []);
const showSearchDialog = ref();
const searchDialogStr = ref("");
const openSearchDialog = () => {
  showSearchDialog.value = true;
  goDialogSearch("stock");
};

store.commit("setMarketSearch", {
  search: "",
  market: "stock",
  futuresSearchList: [],
});
const goDialogSearch = (market) => {
  if (searchTimeout) clearTimeout(searchTimeout);
  let s = searchDialogStr.value;
  searchLoading.value = true;
  searchTimeout = setTimeout(() => {
    _stock({
      market: "",
      name: s,
      page: 1,
    })
      .then((res) => {
        if (searchDialogStr.value == s) {
          store.commit("setMarketSearch", {
            search: s,
            market: market,
            list: res.data || [],
          });

          let arr = (res.data || []).map((item) => {
            const target = marketSearchList.value.find(
              (a) => a.symbol == item.symbol
            );
            item.type = "stock";
            if (target)
              return {
                ...target,
                ...item,
              };
            return item;
          });
          store.commit("setMarketSearchList", arr);

          setTimeout(() => {
            console.error('-------', 11)
            store.dispatch("subList", {
              commitKey: "setMarketSearchList",
              listKey: "marketSearchList",
            });
          }, 100);
        }
      })
      .finally(() => {
        searchLoading.value = false;
      });
  }, 500);
};

const emits = defineEmits(["showNavDialog", "success"]);
const showNavDialog = () => {
  emits("showNavDialog");
};
const showJumpTypeDialog = ref(false); // 跳转开关
const jumpModeList = ref([
  { name: t("trade.stock_opening_jump_mode1"), value: "transfer" },
  { name: t("trade.stock_opening_jump_mode2"), value: "swap" },
  { name: t("trade.stock_opening_jump_mode3"), value: "topUpCrypto" },
]);
const onSelectJumpModeType = (item) => {
  jump(item.value);
};

// 仓位类型
const showModeTypeDialog = ref(false);
const modeMap = ref({
  cross: t("trade.stock_opening_position_mode_cross"),
  isolated: t("trade.stock_opening_position_mode_isolated"),
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
  showTypeDialog.value = false;
  form1.value.leverType = item.selectedValues[0];
  form1.value.lever = item.selectedValues[1];
};

// 限价模式
const showPriceTypeDialog = ref(false);
const priceModeList = computed(() => {
  const list = [];
  list.push({
    name: t("trade.stock_opening_price_market"),
    value: 1,
    className: priceMode.value == 1 ? "action-sheet-active" : "",
  });
  list.push({
    name: t("trade.stock_opening_price_limit"),
    value: 2,
    className: priceMode.value == 2 ? "action-sheet-active" : "",
  });
  return list;
});
const columns = computed(() => {
  return [
    [
      {
        text: t("trade.stock_opening_position_mode_cross"),
        value: "cross",
        className:
          form1.value.leverType == "cross" ? "action-sheet-active" : "",
      },
      {
        text: t("trade.stock_opening_position_mode_isolated"),
        value: "isolated",
        className:
          form1.value.leverType == "isolated" ? "action-sheet-active" : "",
      },
    ],
    levers.value.map((item) => {
      return {
        text: item + "X",
        value: item,
        className: form1.value.lever == item ? "action-sheet-active" : "",
      };
    }),
  ];
});
const leversActions = computed(() => {
  return levers.value.map((item) => {
    return {
      name: item + "X",
      value: item,
      className: form1.value.lever == item ? "action-sheet-active" : "",
    };
  })
})
const onSelectForm1PriceType = (item) => {
  showPriceTypeDialog.value = false;
  priceMode.value = item.value;
  if (priceMode.value == 1) {
    form1.value.price = "";
    form1.value.price_type = "market";
  } else {
    form1.value.price_type = "limit";
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
      className: form1.value.leverType == key ? "action-sheet-active" : "",
    });
  }
  return list;
});

const wallet = computed(() => store.state.wallet || []);
const stockWalletAmount = computed(() => {
  // 钱包余额
  const target = wallet.value.find(
    (item) => item.currency == paramCurrency.value
  );
  if (target) return target.amount;
  return 0;
});

const maxStockNum = computed(() => {
  // 最大可买 可卖
  if (currStock.value.price) {
    const max = new Decimal(stockWalletAmount.value)
      .mul(1 - (openFee.value || 0))
      .div(form1.value.price || currStock.value.price)
      .mul(form1.value.lever)
      .floor();
    const rs = max - max.mod(step.value);
    return rs > min.value ? rs : 0;
  }
  return "--";
});

const showAmountDialog = ref(false);
const openConfirmBox = () => {
  showAmountDialog.value = true;
};

// 限价
const setNowPrice = () => {
  // 设置为当前价格
  form1.value.price = currStock.value.price || "";
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
  if (!currStock.value.symbol) {
    return;
  }
  if (percent.value == 0) {
    setNowPrice();
  } else {
    setPricePercent(percent.value);
  }
};

// 市价
const currStock = ref({}); // 当前股票
if (store.state.currStockItem && store.state.currStockItem.symbol) {
  currStock.value = JSON.parse(JSON.stringify(store.state.currStockItem))
}

const form1 = ref({
  leverType: "cross",
  lever: 1,
  volume: "",
  price: "",
  price_type: props.activeTab == 1 ? "limit" : "market",
  stop_profit_type: null, // 价格-[ price ]  金额-[ amount ]  百分比-[ ratio ]
  stop_profit_price: null,
  stop_loss_type: null,
  stop_loss_price: null,
});

// 止盈止损参数
const mode = ref(1); // 1-简单模式  2-复杂模式
const priceMode = ref(1); // 1-市价 2-限价
const setPriceStop = (i) => {
  // 设置止损价格
  if (!currStock.value.price) return;
  if (props.activeType == 1) {
    // 买涨
    form1.value.stop_loss_price = new Decimal(currStock.value.price)
      .mul(100 - i.value)
      .div(100)
      .toNumber();
  } else {
    // 买跌
    form1.value.stop_loss_price = new Decimal(currStock.value.price)
      .mul(100 + i.value)
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
    form1.value.stop_profit_type = "price";
    form1.value.stop_profit_price = "";
  }
  form1.value.stop_loss_type = "price";
  form1.value.stop_loss_price = "";
};
const stopMap = ref({
  price: t("trade.stock_opening_stop_price"),
  amount: t("trade.stock_opening_stop_amount"),
  ratio: t("trade.stock_opening_stop_ratio"),
});
if (props.activeTab == 2) {
  form1.value.stop_loss_type = "price";
  form1.value.stop_loss_price = "";
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
        form1.value.stop_profit_type == key ? "action-sheet-active" : "",
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
      className: form1.value.stop_loss_type == key ? "action-sheet-active" : "",
    });
  }
  return list;
});
const onSelectUpMode = (item) => {
  // 选择止盈类型
  showUpModelDialog.value = false;
  form1.value.stop_profit_type = item.value;
  form1.value.stop_profit_price = "";
};
const onSelectDownMode = (item) => {
  // 选择止损类型
  showDownModelDialog.value = false;
  form1.value.stop_loss_type = item.value;
  form1.value.stop_loss_price = "";
};
const inputStop = (key) => {
  // 输入止盈止损
  if (key == 1) {
    // 止盈
    form1.value.stop_profit_price =
      form1.value.stop_profit_price < 0 ? 0 : form1.value.stop_profit_price;
    if (form1.value.stop_profit_type == "ratio") {
      form1.value.stop_profit_price =
        form1.value.stop_profit_price > 100
          ? 100
          : form1.value.stop_profit_price;
    }
  } else {
    // 止损
    form1.value.stop_loss_price =
      form1.value.stop_loss_price < 0 ? 0 : form1.value.stop_loss_price;
    if (form1.value.stop_loss_type == "ratio") {
      form1.value.stop_loss_price =
        form1.value.stop_loss_price > 100 ? 100 : form1.value.stop_loss_price;
    }
  }
};

const submit1 = () => {
  if (!currStock.value.trade) return showToast(t('trade.stock_opening_closed'));
  if (!currStock.value.symbol)
    return showToast(t("trade.stock_opening_err_stock"));
  if (!form1.value.volume || form1.value.volume < min.value)
    return showToast(
      `${t("trade.stock_opening_err_min_balance")}：${min.value}`
    );
  // 限价校验
  if (props.activeTab == 1) {
    if (!form1.value.price)
      return showToast(t("trade.stock_opening_err_price"));
  }
  // 止盈止损校验
  if (props.activeTab == 2) {
    if (mode.value == 1) {
      // 简单模式
      if (!form1.value.stop_loss_price)
        return showToast(t("trade.stock_opening_err_stop_price"));
    } else {
      // 复杂模式
      if (!form1.value.stop_profit_price)
        return showToast(t("trade.stock_opening_err_take_price"));
      if (!form1.value.stop_loss_price)
        return showToast(t("trade.stock_opening_err_stop_price"));
    }
    if (priceMode.value == 2 && !form1.value.price) {
      // 限价
      return showToast(t("trade.stock_opening_err_limit"));
    }
  }
  // 打开确认弹窗
  params.value = {
    symbol: currStock.value.symbol,
    offset: props.activeType == 1 ? "long" : "short",
    volume: Number(form1.value.volume),
    lever_type: form1.value.leverType,
    lever: form1.value.lever,
    price_type: form1.value.price_type,
    price: form1.value.price_type == "market" ? "" : form1.value.price || "",
    stop_profit_type: form1.value.stop_profit_type,
    stop_profit_price: form1.value.stop_profit_price,
    stop_loss_type: form1.value.stop_loss_type,
    stop_loss_price: form1.value.stop_loss_price,
  };
  if (props.activeTab == 2) {
    // 止盈止损
    if (priceMode.value == 1) {
      // 市价
      params.value.price_type = "market";
      params.value.price = "";
    } else {
      // 限价
      form1.value.price_type = "limit";
    }
  }

  safePass.value = "";
  showModel.value = true;
  getSessionToken();
};

// 全部
const putAll = () => {
  onSliderChange(100);
};
const sliderValue = ref(0);

const onSliderChange = (newValue) => {
  sliderValue.value = newValue;
  if (maxStockNum.value == "--") return (sliderValue.value = 0);
  let v = new Decimal(maxStockNum.value).mul(newValue).div(100);
  v = v.sub(v.mod(step.value));
  form1.value.volume = v.toNumber();
  setTimeout(() => {
    changePercent();
  }, 0);
};

const changePercent = () => {
  if (maxStockNum.value == "--" || !form1.value.volume)
    return (sliderValue.value = 0);
  let v = new Decimal(form1.value.volume);
  form1.value.volume = v.sub(v.mod(step.value)).toNumber();
  let p = new Decimal(form1.value.volume)
    .div(maxStockNum.value)
    .mul(100)
    .toNumber();
  if (p < 0) p = 0;
  if (p > 100) p = 100;
  sliderValue.value = Number(p);
};

// 市价-搜索
const searchLoading = ref(false);

let searchTimeout = null;

// 下单限制的参数
const min = ref(0); // 最小购买
const step = ref(1); // 步长
const openFee = ref(0); // 开仓手续费
const closeFee = ref(0); // 平仓手续费
const flowerFee = ref(0); // 印花税
const configLoading = ref(false);
const levers = ref([]); // 杠杆
const paramCurrency = ref(""); // 交易使用的货币
const getParam = () => {
  configLoading.value = true;
  levers.value = [];
  paramHandle();
  _stocksPara({
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
  if (data) {
    sessionStorage.setItem("open_param", JSON.stringify(data));
  } else {
    try {
      data = JSON.parse(sessionStorage.getItem("open_param") || "{}");
    } catch {
      data = {};
    }
  }
  if (data.volume) {
    const arr = data.volume.split(",");
    min.value = arr[0] || 0;
    step.value = arr[1] || 1;
    configLoading.value = false;
  }
  if (data.fee) {
    const arr2 = data.fee.split(",");
    openFee.value = arr2[0] || 0;
    closeFee.value = arr2[1] || 0;
    flowerFee.value = arr2[2] || 0;
  }
  if (data.currency) {
    paramCurrency.value = data.currency || "";
  }
  form1.value.volume = "";
  sliderValue.value = 0;
  if (data.lever) {
    levers.value = data.lever.split(",");
    if (levers.value[0]) {
      form1.value.lever = levers.value[0];
    }
  }
};

const initParam = () => {
  if (currStock.value.symbol) {
    getParam();
  } else {
    min.value = 0;
    step.value = 1;
    openFee.value = 0;
    closeFee.value = 0;
    flowerFee.value = 0;
    configLoading.value = false;
    levers.value = [];
  }
};

const handleClick = (item, notHand) => {
  showSearchDialog.value = false;
  currStock.value = item;
  store.commit('setCurrStockItem', currStock.value)
  initParam();
  _basic({ symbol: currStock.value.symbol }).then((r) => {
    if (r && r.data && r.data.symbol) {
      currStock.value = {
        ...currStock.value,
        ...r.data,
      };
      sessionStorage.setItem("currStock", JSON.stringify(currStock.value));
      store.commit('setCurrStockItem', currStock.value)
    }
  });
  if (notHand) return
  eventBus.emit('clickStock', item)
};

// 初始化
setTimeout(() => {
  if (currStock.value.symbol) {
    handleClick(currStock.value, true)
  }
}, 0)
// url参数处理
if (props.tradeType == 1) {
  // 股票页
  if (route.query.symbol) {
    handleClick({
      symbol: ciper.decrypt(route.query.symbol),
    });
  } else {
    try {
      currStock.value = JSON.parse(sessionStorage.getItem("currStock") || "{}");
    } catch {
      currStock.value = {};
    }
    initParam();
  }
}

const openTypeDialog = () => {
  if (!levers.value.length) {
    if (!currStock.value.symbol) {
      showToast(t("trade.stock_opening_err_stock"));
    }
    return;
  }
  showTypeDialog.value = true;
};

// 开仓
const params = ref({});
const showModel = ref(false);
const safePass = ref("");
const payAmount = computed(() => {
  // 需要支付
  return new Decimal(payOrigin.value).add(payFee.value);
});
const payOrigin = computed(() => {
  // 保证金
  if (!params.value.volume || !currStock.value.price) return 0;
  return new Decimal(params.value.volume)
    .mul(currStock.value.price)
    .div(form1.value.lever);
});
const payFee = computed(() => {
  // 手续费
  return new Decimal(payOrigin.value).mul(openFee.value);
});
const submitLoading = ref(false);
const submitFormDialog = () => {
  if (!safePass.value) {
    return showToast(t("trade.stock_opening_trade_pw_placeholder"));
  }
  submitForm(safePass.value);
  //showModel.value = false
  //safeRef.value && safeRef.value.open()
};
const submitForm = (s) => {
  if (submitLoading.value) return;
  submitLoading.value = true;
  _stocksBuy({
    ...params.value,
    token: sessionToken.value,
    safeword: s,
  })
    .then((res) => {
      if (res && res.code == 200) {
        showModel.value = false;
        store.dispatch("updateWallet");
        showToast(t("trade.stock_opening_success"));
        emits("success");
        form1.value.volume = "";
        sliderValue.value = 0;
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
  store.commit("setCurrStockItem", currStock.value);
  showStockModel.value = true;
};

// sessionToken
const sessionToken = computed(() => store.state.sessionToken || "");
const getSessionToken = () => {
  store.dispatch("updateSessionToken");
};
getSessionToken();

// 跳转
const jump = (name) => {
  router.push({
    name,
  });
};

// 选择某个股票
const choose = (item) => {
  handleClick(item);
};

defineExpose({
  choose,
  openSearchDialog,
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
    background-color: var(--ex-bg-white1);
    border-radius: 0.6rem;
    // border: 1px solid var(--ex-border-color2);

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
  padding: 0.32rem 0 0 0;
  position: relative;

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
    font-size: 0.32rem;

    .item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      flex-wrap: wrap;
      height: 1.12rem;
      border-radius: 0.32rem;
      // border: 1px solid var(--ex-border-color2);
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
      }

      .info-symbol {
        color: var(--ex-text-color);
        font-size: 0.3rem;
      }

      .info-name {
        color: var(--ex-text-color3);
        font-size: 0.24rem;
        margin-top: 0.08rem;
      }


      .ipt {
        flex: 1;
        height: 100%;
        width: 2rem;
        font-size: 0.32rem;
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
      background-color: var(--ex-bg-color2);
    }

    .item_box_left {
      width: 2.2rem;
      margin-right: 0.2rem;
      display: flex;
      flex-direction: column;
    }

    .item_box_right {
      flex: 1;
      position: relative;


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
      height: 1.48rem;
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
    padding: 0.28rem 0.4rem;
    height: 4.14rem;
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
