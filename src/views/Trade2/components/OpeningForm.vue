<!-- 开仓表单 -->
<template>
  <div class="form">
    <!-- 止盈止损 -->
    <template v-if="props.activeTab == 2">
      <!-- <div class="subtitle" style="position: absolute;right: 0.32rem;">
                <span></span>
                <span style="color:#014CFA" @click="changeMode">{{ mode == 1 ? '复杂模式' : '简单模式' }}</span>
            </div> -->

      <!-- 复杂模式 -->
      <div class="item_box" v-show="mode == 2">
        <!-- 止盈 -->
        <div class="item_box_left" @click="showUpModelDialog = true">
          <div class="subtitle">
            <span>{{ t("trade.stock_opening_take") }}</span>
          </div>
          <div class="item" style="justify-content: center">
            <span>{{
              form1.stop_profit_type == "price"
                ? t("trade.stock_opening_stop_price")
                : form1.stop_profit_type == "amount"
                ? t("trade.stock_opening_stop_amount")
                : form1.stop_profit_type == "ratio"
                ? t("trade.stock_opening_stop_ratio")
                : "--"
            }}</span>
            <div class="more_icon">
              <img src="/static/img/trade/down.png" alt="↓" />
            </div>
          </div>
        </div>
        <div class="item_box_right">
          <div class="subtitle">
            <span>&nbsp;</span>
          </div>
          <div class="item">
            <input
              @input="inputStop(1)"
              v-model="form1.stop_profit_price"
              type="number"
              class="ipt"
            />
            <span v-if="form1.stop_profit_type == 'ratio'">%</span>
          </div>
        </div>
      </div>
      <div class="item_box" v-show="mode == 2">
        <!-- 止损 -->
        <div class="item_box_left" @click="showDownModelDialog = true">
          <div class="subtitle">
            <span>{{ t("trade.stock_opening_stop") }}</span>
          </div>
          <div class="item" style="justify-content: center">
            <span>{{
              form1.stop_profit_type == "price"
                ? t("trade.stock_opening_stop_price")
                : form1.stop_profit_type == "amount"
                ? t("trade.stock_opening_stop_amount")
                : form1.stop_profit_type == "ratio"
                ? t("trade.stock_opening_stop_ratio")
                : "--"
            }}</span>
            <div class="more_icon">
              <img src="/static/img/trade/down.png" alt="↓" />
            </div>
          </div>
        </div>
        <div class="item_box_right">
          <div class="subtitle">
            <span>&nbsp;</span>
          </div>
          <div class="item">
            <input
              @input="inputStop(2)"
              v-model="form1.stop_loss_price"
              type="number"
              class="ipt"
            />
            <span v-if="form1.stop_loss_type == 'ratio'">%</span>
          </div>
        </div>
      </div>

      <!-- 简单模式 -->
      <FormItem
        :title="
          activeType == 1
            ? t('trade.stock_opening_take')
            : t('trade.stock_opening_stop')
        "
        class="mb-[0.4rem]"
        v-model="form1.stop_loss_price"
        input-type="number"
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
        <div class="item_box_left" @click="showPriceTypeDialog = true">
          <div class="subtitle">
            <span>{{ t("trade.stock_opening_price") }}</span>
          </div>
          <div class="item" style="justify-content: center">
            <span>
              {{
                priceMode == 1
                  ? t("trade.stock_opening_price_market")
                  : t("trade.stock_opening_price_limit")
              }}
            </span>
            <div class="more_icon">
              <img src="/static/img/trade/down.png" alt="↓" />
            </div>
          </div>
        </div>
        <div class="item_box_right">
          <div class="subtitle">
            <span>&nbsp;</span>
          </div>
          <FormItem custom disabled v-if="priceMode == 1">
            <span style="color: #a4acb9">
              {{ t("trade.stock_opening_price_latest") }}</span
            >
          </FormItem>

          <FormItem
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
          </FormItem>
        </div>

        <!-- <div class="mode_btn" @click="changePriceMode" :class="{ 'active_btn': priceMode == 2 }">{{ priceMode ==
                    1 ? '市价' : '限价' }}</div> -->
      </div>
    </template>

    <!-- 价格 -->
    <FormItem
      class="mb-[0.4rem]"
      input-type="number"
      :title="t('trade.stock_opening_price_title')"
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

    <!-- 股票 -->
    <div class="subtitle">
      <span @click="showNavDialog">{{ t("trade.stock_opening_stock") }}</span>
      <Loading
        v-show="searchLoading"
        type="spinner"
        style="width: 0.28rem; height: 0.28rem"
        color="#034cfa"
      />
      <div
        class="stock_icon"
        v-show="!searchLoading && currStock.symbol"
        @click="openStockModel"
      >
        <img src="/static/img/trade/blue-stock.png" />
      </div>
    </div>
    <!-- 搜索 -->
    <div class="item_box" @click="openSearchDialog">
      <div class="item">
        <div class="info">
          <div style="flex: 1">
            <div class="info-symbol">{{ currStock.symbol }}</div>
            <div class="info-name">{{ currStock.name }}</div>
          </div>
          <div class="more_icon">
            <img src="/static/img/trade/down.png" alt="↓" />
          </div>
        </div>
      </div>
    </div>

    <!-- 数量 -->
    <div class="item_box">
      <div class="item_box_left" @click="openTypeDialog">
        <div class="subtitle">
          <span>{{ t("trade.stock_opening_amount_mode") }}</span>
        </div>
        <div class="item justify-between">
          <span v-if="!levers.length">--</span>
          <span class="flex text-center" v-else>
            {{
              form1.leverType == "cross"
                ? t("trade.stock_opening_position_mode_cross")
                : t("trade.stock_opening_position_mode_isolated") || "--"
            }}
            {{ form1.lever }}X</span
          >
          <div class="more_icon">
            <img src="/static/img/trade/down.png" alt="↓" />
          </div>
        </div>
      </div>

      <div class="item_box_right">
        <FormItem
          :title="t('trade.stock_opening_amount_title')"
          :max="maxStockNum"
          v-model="form1.volume"
          :show-btn="maxStockNum >= 1"
          btn-show-mode="focus"
          @btnClick="putAll"
          @change="changePercent"
          tip-align="right"
          :tip="maxStockNum > 0 ? '≤' + maxStockNum : ''"
          input-type="number"
        >
          <template #title-right>
            <span
              style="color: #014cfa; font-size: 12px"
              @click="openConfirmBox(1)"
              v-if="maxStockNum <= 0"
              >{{ t("trade.stock_opening_no_balance") }}</span
            >
            <span
              style="color: #014cfa; font-size: 12px"
              v-else
              @click="openConfirmBox(2)"
              ><span style="color: #666d80">{{
                t("trade.stock_opening_enough_balance")
              }}</span>
              {{ stockWalletAmount }} {{ paramCurrency }}</span
            >
          </template>
        </FormItem>
      </div>
    </div>

    <div style="height: 0.07rem"></div>
    <!-- 拖动 -->
    <SlideContainer v-model="sliderValue" @change="onSliderChange" />

    <!-- 按钮 -->
    <Button
      v-if="token"
      :loading="configLoading || submitLoading"
      size="large"
      @click="submit1"
      class="submit"
      :color="activeType == 1 ? '#18b762' : '#e8503a'"
      round
      >{{
        activeType == 1
          ? t("trade.stock_open_long")
          : t("trade.stock_open_short")
      }}</Button
    >

    <Button
      size="large"
      color="#014cfa"
      class="submit"
      round
      v-if="!token"
      style="margin-bottom: 0.34rem"
      @click="goLogin"
      >{{ t("trade.stock_opening_token_login") }}</Button
    >
    <Button
      size="large"
      color="#f2f2f2"
      round
      v-if="!token"
      style="color: #999999"
      @click="jump('register')"
      >{{ t("trade.stock_opening_token_register") }}</Button
    >
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
      {{ t("trade.stock_opening_confirm_title") }}
    </div>
    <div class="stock_submit_box">
      <div class="item">
        <div class="item_name">{{ t("trade.stock_opening_stock") }}</div>
        <div class="item_val">
          <div style="line-height: 0.36rem">
            <div style="text-align: right; font-size: 0.3rem">
              {{ currStock.symbol }}
            </div>
            <div style="color: #9ea3ae; font-size: 0.24rem">
              {{ currStock.name }}
            </div>
          </div>
        </div>
      </div>
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

      <div class="money_box">
        <div class="amount">
          {{ t("trade.stock_opening_pay") }} <strong>{{ payAmount }}</strong>
        </div>
        <div class="fee">
          {{ t("trade.stock_opening_upfront") }} <span>{{ payOrigin }}</span> +
          {{ t("trade.stock_opening_fee") }} <span>{{ payFee }}</span>
        </div>
      </div>

      <div class="subtitle">{{ t("trade.stock_opening_trade_pw") }}</div>
      <div class="item pass_ipt">
        <input
          v-model="safePass"
          :placeholder="t('trade.stock_opening_trade_pw_placeholder')"
          :type="showPassword ? 'text' : 'password'"
          class="ipt"
        />
        <img
          v-if="!showPassword"
          src="/static/img/user/eye-off.png"
          @click="showPassword = true"
          alt="off"
        />
        <img
          v-else
          src="/static/img/user/eye-open.png"
          alt="open"
          @click="showPassword = false"
        />
      </div>
      <Button
        :loading="submitLoading"
        @click="submitFormDialog"
        size="large"
        color="#014cfa"
        round
        >{{ t("trade.stock_open") }}</Button
      >
    </div>
  </Popup>

  <!-- 股票行情弹窗 -->
  <Popup
    teleport="body"
    v-model:show="showStockModel"
    position="bottom"
    round
    closeable
  >
    <StockPopup style="height: 90vh" v-if="showStockModel" />
  </Popup>

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
  <!-- <ActionSheet teleport="body" v-model:show="showTypeDialog" :actions="modeList" @select="onSelectForm1Type"
        title="保证金模式">
    </ActionSheet> -->
  <Popup
    class="van-popup-custom--bottom"
    closeable
    v-model:show="showTypeDialog"
    round
    position="bottom"
    teleport="body"
  >
    <div class="van-popup-custom-title">
      {{ t("trade.stock_opening_amount_mode") }}
    </div>
    <div class="van-popup-custom__top-rbtn" @click="showTypeDialog = false">
      {{ t("trade.stock_opening_confirm") }}
    </div>
    <Picker
      :show-toolbar="false"
      :swipe-duration="200"
      :columns="columns"
      @confirm="showTypeDialog = false"
      @cancel="showTypeDialog = false"
      @change="onSelectForm1Type"
    />
  </Popup>

  <!-- 限价模式选择 -->
  <ActionSheet
    teleport="body"
    v-model:show="showPriceTypeDialog"
    :actions="priceModeList"
    @select="onSelectForm1PriceType"
    :title="t('trade.stock_opening_amount_limit_mode')"
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
  <Popup
    round
    v-model:show="showSearchDialog"
    position="bottom"
    closeable
    teleport="body"
  >
    <div class="van-popup-custom-title">
      {{ t("trade.stock_opening_search") }}
    </div>
    <div class="search_dialog_trade">
      <!-- 搜索 -->
      <div class="item search_box">
        <div class="search_icon">
          <img src="/static/img/common/search.png" alt="🔍" />
        </div>
        <input
          v-model.trim="searchDialogStr"
          @keyup="goDialogSearch('stock')"
          type="text"
          class="ipt"
          :placeholder="t('trade.stock_opening_search')"
        />
      </div>

      <div class="lists">
        <!-- 搜索列表 -->
        <StockTable
          :handleClick="handleClick"
          :loading="searchLoading"
          :key="'search'"
          :list="marketSearchList"
        />
      </div>
    </div>
  </Popup>
</template>

<script setup>
import {
  Loading,
  Slider,
  Button,
  showToast,
  Popup,
  ActionSheet,
  Picker,
  showConfirmDialog,
} from "vant";
import { ref, computed, watch, nextTick } from "vue";
import { _search, _basic, _stocksPara, _stocksBuy } from "@/api/api";
import store from "@/store";
import Decimal from "decimal.js";
import { useRoute } from "vue-router";
import router from "@/router";
import StockPopup from "../../trade/StockPopup.vue";
import SafePassword from "@/components/SafePassword.vue";
import StockTable from "@/components/StockTable.vue";
import SlideContainer from "@/components/SlideContainer.vue";
import FormItem from "@/components/Form/FormItem.vue";
import eventBus from "@/utils/eventBus";
import { useI18n } from "vue-i18n";

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
    _search({
      market: market || "",
      symbol: s,
      page: 1,
    })
      .then((res) => {
        if (searchDialogStr.value == s) {
          store.commit("setMarketSearch", {
            search: s,
            market: market,
            list: res.data || [],
          });
          setTimeout(() => {
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

const props = defineProps({
  activeTab: null, // 0-市价 1-限价 2-止盈止损
  activeType: null,
});

// 仓位类型
const modeMap = ref({
  cross: t("trade.stock_opening_position_mode_cross"),
  isolated: t("trade.stock_opening_position_mode_isolated"),
});

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
      .div(form1.value.price || currStock.value.price)
      .mul(form1.value.lever)
      .floor();
    const rs = max - max.mod(step.value);
    return rs > min.value ? rs : 0;
  }
  return "--";
});

const openConfirmBox = (type) => {
  // type 1-余额不足 2-余额展示
  const title =
    type == 1
      ? t("trade.stock_opening_no_balance")
      : t("trade.stock_opening_enough_balance");
  const content =
    type == 1
      ? `<div style="color:#383C42;font-size:0.28rem;line-height:0.44rem;margin-top:0.32rem;">${t(
          "trade.stock_account_balance"
        )} <span style="font-weight:600;color:#014CFA;">` +
        stockWalletAmount.value +
        "</span> " +
        paramCurrency.value +
        `</div><div style="color:#383C42;font-size:0.28rem;line-height:0.44rem;margin-top:0.12rem;">${t(
          "trade.stock_account_notification"
        )}</div>`
      : `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:#F5F7FC;border:1px solid #EFF3F8;border-radius:0.32rem;padding:0.2rem 0;line-height:0.4rem;margin-top:0.32rem;">
        <div style="color:#061023;font-size:0.32rem;font-weight:400;margin-bottom:0.2rem">${t(
          "trade.stock_account_balance"
        )}</div>
        <div style="display:flex;align-items:center;justify-content:center;">
            <b style="font-size:0.4rem;color:#014CFA;font-weight:bold">${
              stockWalletAmount.value
            }</b><span style="font-size:0.28rem;margin-left:0.12rem;color:#061023;font-weight:400">${
          paramCurrency.value
        }</span>
        </div>
    </div>`;
  showConfirmDialog({
    closeOnClickOverlay: true,
    className: "van-custom-confirm-dialog",
    title: title,
    message: content,
    allowHtml: true,
    confirmButtonText: t("trade.stock_opening_btn_transfer"),
    cancelButtonText: t("trade.stock_opening_btn_recharge"),
    confirmButtonColor: "#014CFA",
    cancelButtonColor: "#014CFA",
  })
    .then(() => {
      router.push({
        name: "transfer",
      });
    })
    .catch(() => {
      router.push({
        name: "topUpCrypto",
      });
    });
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
  form1.value.volume = v.sub(v.mod(step.value));
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

const handleClick = (item) => {
  showSearchDialog.value = false;
  currStock.value = item;
  initParam();
  _basic({ symbol: currStock.value.symbol }).then((r) => {
    if (r && r.data && r.data.symbol) {
      currStock.value = {
        ...currStock.value,
        ...r.data,
      };
      sessionStorage.setItem("currStock", JSON.stringify(currStock.value));
    }
  });
};

// url参数处理
if (route.query.symbol) {
  handleClick({
    symbol: route.query.symbol,
  });
} else {
  try {
    currStock.value = JSON.parse(sessionStorage.getItem("currStock") || "{}");
  } catch {
    currStock.value = {};
  }
  initParam();
}

const openTypeDialog = () => {
  if (!levers.value.length) {
    if (!currStock.value.symbol) {
      showToast(t('trade.stock_opening_err_stock'));
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
  store.commit("setCurrStock", currStock.value);
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
});
</script>

<style lang="less" scoped>
.search_dialog_trade {
  .lists {
    height: 60vh;
    overflow-y: auto;
    margin-top: 0.32rem;
  }

  .search_box {
    height: 0.8rem;
    padding: 0 0.32rem;
    margin: 0.52rem 0.3rem 0 0.3rem;
    display: flex;
    align-items: center;
    background-color: #f5f7fc;
    border-radius: 0.6rem;
    border: 1px solid #d0d8e2;

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
      color: #a4acb9;
    }
  }
}

.form {
  padding: 0.48rem 0.32rem 0.32rem;
  position: relative;

  .subtitle {
    color: #061023;
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
    margin-bottom: 0.4rem;

    .item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      height: 0.92rem;
      border-radius: 0.32rem;
      border: 1px solid #d0d8e2;
      padding: 0 0.24rem;

      .info {
        font-size: 0.28rem;
        font-weight: 400;
        position: absolute;
        width: 100%;
        left: 0;
        box-sizing: border-box;
        padding-left: 0.32rem;
        pointer-events: none;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .more_icon {
          margin-right: 0.3rem;
        }
      }

      .info-symbol {
        color: #061023;
        font-size: 0.3rem;
      }

      .info-name {
        color: #9ea3ae;
        font-size: 0.24rem;
        margin-top: 0.08rem;
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

    .item_box_left {
      width: 2.2rem;
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

  .submit {
    margin-top: 0.8rem;
  }
}

.stock_submit_box {
  padding: 0.2rem 0.6rem 0.6rem;

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.36rem 0 0.2rem 0;
    border-bottom: 1px solid #f5f7fc;

    .item_name {
      color: #8f92a1;
      font-size: 0.28rem;
      font-weight: 400;
    }

    .item_val {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      color: #121826;
      font-size: 0.28rem;
      font-weight: 500;

      .tag {
        height: 0.44rem;
        color: #014cfa;
        background-color: #ecf1fe;
        line-height: 0.44rem;
        padding: 0 0.3rem;
        border-radius: 0.4rem;
        margin-left: 0.2rem;
        font-size: 0.24rem;
      }

      .red_tag {
        background-color: #fbf1ef;
        color: #e8503a;
      }

      .green_tag {
        background-color: #eff9f2;
        color: #18b762;
      }

      .lever {
        min-width: 0.7rem;
        text-align: right;
      }
    }
  }

  .subtitle {
    font-size: 0.28rem;
    margin-bottom: 0.12rem;
    color: #000;
    font-weight: 400;
    line-height: 150%;
  }

  .pass_ipt {
    margin-bottom: 0.58rem;
    border-radius: 0.32rem;
    border: 1px solid #d0d8e2;
    padding: 0 0.24rem;
    height: 1.12rem;
    padding: 0.16rem 0.32rem;
    box-sizing: border-box;
    position: relative;

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
    margin: 0.32rem 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    background-color: #f5f7fc;
    border-radius: 0.32rem;
    padding: 0.24rem 0.32rem;

    .amount {
      color: #666d80;
      line-height: 0.56rem;

      strong {
        color: #061023;
        font-size: 0.36rem;
        font-weight: 600;
        margin-left: 0.12rem;
      }
    }

    .fee {
      color: #666d80;
      font-size: 0.24rem;
      font-weight: 400;
      line-height: 0.36rem;
      padding: 0.1rem 0 0 0.2rem;

      span {
        color: #061023;
      }
    }
  }
}
</style>
