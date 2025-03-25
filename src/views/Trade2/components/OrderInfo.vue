<template>
  <div style="padding-bottom: 0.32rem;">
    <Top :title="title" :backFunc="backFunc" />

    <div class="scroller">
      <div style="
          padding-bottom: 0.32rem;
          border-radius: 0.32rem;
          background-color: var(--ex-bg-color3);
        ">
        <div class="stock-info" style="display: flex; align-items: center">
          <div style="width: 0.88rem; height: 0.88rem; margin-right: 0.2rem"
            v-if="currStock.name && currStock.name.replace('/USDT', '')">
            <CryptoIcon :name="currStock.name.replace('/USDT', '').toUpperCase()" />
          </div>
          <div style="flex: 1">
            <div class="stock-info__head">
              <div class="stock-info__hl flex items-center">
                <span class="stock-info__symbol" v-if="type == 'stock'">{{
                  currStock.symbol || '--'
                }}</span>
                <span class="stock-info__symbol" v-else>{{
                  currStock.name || '--'
                }}</span>
                <span class="stock-info__status">
                  <!-- {{ statusMap[currStock.status] || "--" }} -->
                  {{
                    currStock.status == 'none'
                      ? t('trade.stock_position_status_none')
                      : currStock.status == 'lock'
                        ? t('trade.stock_position_status_lock')
                        : currStock.status == 'open'
                          ? t('trade.stock_position_status_open')
                          : currStock.status == 'done'
                            ? t('trade.stock_position_status_done')
                            : currStock.status == 'fail'
                              ? t('trade.stock_position_status_fail')
                              : currStock.status == 'cancel'
                                ? t('trade.stock_position_status_cancel')
                                : '--'
                  }}
                </span>
              </div>
              <div class="stock-info__trend" @click="openStockModel(currStock)">
                <img v-lazy="getStaticImgUrl('/static/img/trade/blue-stock.svg')" />
              </div>
            </div>
            <div class="stock-info__order_no">
              <!-- <span>{{ currStock.order_no || "--" }}</span>
              <div class="stock-info__copy_icon" @click="copy(currStock.order_no)">
                <img v-lazy="getStaticImgUrl('/static/img/common/copy.svg')" alt="copy" />
              </div> -->
              <div class="text-[0.22rem] h-[0.3rem] w-max px-[0.1rem] rounded-[0.08rem] tag-crypto flex items-center">
                {{
                  type == 'contract'
                    ? t('market.market_optional_contract')
                    : '--'
                }}
              </div>
            </div>
          </div>
        </div>
        <div class="info_boxs" v-if="props.type == 'spot'">
          <div class="info_box">
            <div class="amount" :class="[currStock.offset == 'buy' ? 'up' : 'down']">
              <div>
                {{ currStock.volume || '--'
                }}{{
                  currStock.symbol
                    ? currStock.symbol.replace('usdt', '').toUpperCase()
                    : ''
                }}
              </div>
            </div>
            <div>{{ currStock.offset == 'buy' ? '买入' : '卖出' }}</div>
          </div>
        </div>
        <div class="info_boxs" v-else>
          <div class="info_box" v-if="!finalStatus">
            <div class="amount">{{ currStock.unsold_volume || '--' }}</div>
            <div class="text-center">
              {{
                type == 'stock'
                  ? t('trade.order_info_available_stock')
                  : type == 'contract'
                    ? t('trade.order_info_available_contract')
                    : ''
              }}
            </div>
          </div>
          <!-- <div class="info_box">
            <div
              class="amount"
              :class="
                !currStock.profit ? '' : currStock.profit > 0 ? 'up' : 'down'
              "
            >
              <div>{{ currStock.profit || '--' }}</div>
            </div>
            <div>{{ t('trade.order_info_profit') }}</div>
          </div> -->
          <div class="info_box">
            <div class="amount" :class="!currStock.profit ? '' : currStock.profit > 0 ? 'up' : 'down'
              ">
              <div style="font-size: 0.32rem">
                {{ currStock.profit + ' | ' + getRatio(currStock.ratio) }}
              </div>
            </div>
            <div>{{ t('trade.order_info_profit') }}</div>
          </div>
        </div>

        <div class="order_info_box">
          <div class="info_item" v-if="props.type == 'spot'">
            <div class="name">{{ t('trade.stock_open') }}</div>
            <div class="val_box">
              <div class="tag" :class="'tag_' + currStock.offset">
                <!-- {{ offsetMap[currStock.offset] || "--" }} -->
                {{
                  currStock.offset == 'buy'
                    ? '买入'
                    : currStock.offset == 'sell'
                      ? '卖出'
                      : '--'
                }}
              </div>
            </div>
          </div>
          <div class="info_item" v-else>
            <div class="name">{{ t('trade.stock_open') }}</div>
            <div class="val_box">
              <div class="tag" :class="'tag_' + currStock.offset">
                <!-- {{ offsetMap[currStock.offset] || "--" }} -->
                {{
                  currStock.offset == 'long'
                    ? t('trade.stock_position_offset_long')
                    : currStock.offset == 'short'
                      ? t('trade.stock_position_offset_short')
                      : '--'
                }}
              </div>
              <div class="tag">
                <!-- {{ leverTypeap[currStock.lever_type] || "--" }} -->
                {{
                  currStock.lever_type == 'cross'
                    ? t('trade.stock_opening_position_mode_cross')
                    : currStock.lever_type == 'isolated'
                      ? t('trade.stock_opening_position_mode_isolated')
                      : '--'
                }}
              </div>
              <div class="text">{{ currStock.lever || '1' }}X</div>
            </div>
          </div>
          <div class="info_item">
            <div class="name">{{ t('trade.stock_opening_price') }}</div>
            <div class="val_box">
              <div class="tag">
                <!-- {{ priceTypeMap[currStock.price_type] || "--" }} -->
                {{
                  currStock.price_type == 'market'
                    ? t('trade.stock_market_price')
                    : currStock.price_type == 'limit'
                      ? t('trade.stock_limit_price')
                      : '--'
                }}
              </div>
              <div class="text">{{ currStock.price || '--' }}</div>
            </div>
          </div>
          <div class="info_item">
            <!-- <div class="name">开仓{{ type == "contract" ? "张数" : "数量" }}</div> -->
            <div class="name">
              {{
                type == 'contract'
                  ? t('trade.order_info_open_qty_contract')
                  : t('trade.order_info_open_qty_other')
              }}
            </div>
            <div class="val_box">
              <div class="text">
                {{ currStock.open_volume || currStock.volume || '--' }}
              </div>
            </div>
          </div>
          <div class="info_item" v-if="props.type != 'spot'">
            <div class="name">{{ t('trade.stock_take_stop') }}</div>
            <div>
              <div class="val_box" style="margin-bottom: 0.1rem" v-if="currStock.stop_profit">
                <div class="tag green_tag">
                  <!-- 止盈({{ stopMap[currStock.stop_profit_type] }}) -->
                  {{
                    currStock.stop_profit_type == 'price'
                      ? t('trade.order_info_stop_profit_price')
                      : currStock.stop_profit_type == 'amount'
                        ? t('trade.order_info_stop_profit_amount')
                        : currStock.stop_profit_type == 'ratio'
                          ? t('trade.order_info_stop_profit_ratio')
                          : ''
                  }}
                </div>
                <div class="text">
                  {{ currStock.stop_profit_price
                  }}{{ currStock.stop_profit_type == 'ratio' ? '%' : '' }}
                </div>
              </div>
              <div class="val_box" v-if="currStock.stop_loss">
                <div class="tag red_tag">
                  <!-- 止损({{ stopMap[currStock.stop_loss_type] }}) -->
                  {{
                    currStock.stop_loss_type == 'price'
                      ? t('trade.order_info_stop_loss_price')
                      : currStock.stop_loss_type == 'amount'
                        ? t('trade.order_info_stop_loss_amount')
                        : currStock.stop_loss_type == 'ratio'
                          ? t('trade.order_info_stop_loss_ratio')
                          : ''
                  }}
                </div>
                <div class="text">
                  {{ currStock.stop_loss_price
                  }}{{ currStock.stop_loss_type == 'ratio' ? '%' : '' }}
                </div>
              </div>
              <div class="val_box" v-if="!currStock.stop_profit && !currStock.stop_loss">
                <div class="tag">{{ t('trade.stock_opening_no') }}</div>
              </div>
            </div>
          </div>
          <div class="info_item" v-if="!finalStatus">
            <div class="name">{{ t('trade.order_info_value') }}</div>
            <div class="val_box">
              <div class="text">
                {{ currStock.order_value || currStock.amount || '--' }}
              </div>
            </div>
          </div>
          <div class="info_item">
            <div class="name">{{ t('trade.stock_opening_fee') }}</div>
            <div class="val_box">
              <div class="text">{{ currStock.fee || '0' }}</div>
            </div>
          </div>

          <div class="info_item" v-if="!finalStatus && props.type != 'spot'">
            <div class="name">{{ t('trade.stock_opening_upfront') }}</div>
            <div class="val_box">
              <div class="text">{{ currStock.margin || '0' }}</div>
            </div>
          </div>
          <div class="info_item" v-if="!finalStatus && props.type != 'spot'">
            <div class="name">{{ t('trade.contract_position_profit') }}</div>
            <div class="val_box">
              <div class="text">{{ currStock.profit || '0' }}</div>
            </div>
          </div>
          <div class="info_item">
            <div class="name">{{ t('trade.ai_position_order_id') }}</div>
            <div class="val_box">
              <div class="text">{{ currStock.order_no || '0' }}</div>
            </div>
          </div>
          <div class="info_item">
            <div class="name">{{ t('trade.ipo_detail_order_date') }}</div>
            <div class="val_box">
              <div class="text">{{ currStock.date || '0' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="props.type == 'spot'" class="btns">
      <div class="btn btn4 ripple-primary" @click="emit('cancel', currStock)"
        v-if="['open', 'none'].includes(currStock.status)">
        <div class="btn_icon">
          <img v-lazy="getStaticImgUrl('/static/img/trade/cancel.svg')" alt="img" />
        </div>
        <div>{{ t('trade.order_info_cancel') }}</div>
      </div>
    </div>
    <div class="btns" v-else>
      <div class="btn btn2 ripple-btn" @click="emit('update', currStock)"
        v-if="['none', 'lock', 'open'].includes(currStock.status)">
        <div class="btn_icon">
          <img v-lazy="getStaticImgUrl('/static/img/trade/update.svg')" alt="img" />
        </div>
        <div>{{ t('trade.order_info_update') }}</div>
      </div>
      <div class="btn btn2 disabled_btn" v-else>
        <div class="btn_icon" style="opacity: 0.5">
          <img v-lazy="getStaticImgUrl('/static/img/trade/update.svg')" alt="img" />
        </div>
        <div>{{ t('trade.order_info_update') }}</div>
      </div>
      <div class="btn btn3 ripple-btn" @click="emit('sell', currStock)" v-if="['open'].includes(currStock.status)">
        <div class="btn_icon">
          <img v-lazy="getStaticImgUrl('/static/img/trade/close.svg')" alt="img" />
        </div>
        <div>{{ t('trade.stock_position_close') }}</div>
      </div>
      <div class="btn btn3 disabled_btn" v-else>
        <div class="btn_icon" style="opacity: 0.5">
          <img v-lazy="getStaticImgUrl('/static/img/trade/close.svg')" alt="img" />
        </div>
        <div>{{ t('trade.stock_position_close') }}</div>
      </div>
      <div class="btn btn4 ripple-primary" @click="emit('cancel', currStock)" v-if="currStock.status == 'none'">
        <div class="btn_icon">
          <img v-lazy="getStaticImgUrl('/static/img/trade/cancel.svg')" alt="img" />
        </div>
        <div>{{ t('trade.order_info_cancel') }}</div>
      </div>
      <div class="btn btn4 disabled_btn" v-else>
        <div class="btn_icon" style="opacity: 0.5">
          <img v-lazy="getStaticImgUrl('/static/img/trade/cancel.svg')" alt="img" />
        </div>
        <div>{{ t('trade.order_info_cancel') }}</div>
      </div>
    </div>

    <!-- 行情弹窗 -->
    <BottomPopup round v-model:show="showStockModel" position="bottom" closeable teleport="body">
      <div class="page_trade_info" style="max-height: calc(var(--vh) * 90);overflow-y: auto;"
        v-if="showStockModel && openInfoStatus">
        <div style="height: 0.32rem;"></div>
        <MarketInfo2 :innerPage="true" />
      </div>
    </BottomPopup>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from '@/utils/index.js';
import { ref, computed, watch } from 'vue';
import { _copyTxt } from '@/utils/index';
import { showToast, Popup } from 'vant';
import store from '@/store';
import Top from '@/components/Top.vue';
import Decimal from 'decimal.js';
import StockPopup from '../../trade/StockPopup.vue';
import { useI18n } from 'vue-i18n';
import BottomPopup from '@/components/BottomPopup.vue';
import MarketInfo2 from '../../Market/MarketInfo2.vue';

const { t } = useI18n();
const emit = defineEmits(['update', 'sell', 'cancel', 'back']);
const props = defineProps({
  type: {
    type: String,
    default: 'stock', //stock 股票  contract 合约  foreign 外汇   commodities 大宗交易
  },
  currStock: {
    type: Object,
    default() {
      return {};
    },
  },
});
const openInfoStatus = computed(() => store.state.openInfoStatus)
const title = computed(() => {
  if (props.type == 'spot') return '现货订单';
  if (props.type == 'stock') return t('trade.order_info_title_stock');
  if (props.type == 'contract') return t('trade.order_info_title_contract');
  if (props.type == 'foreign') return '外汇订单';
  if (props.type == 'commodities') return '大宗交易订单';
  return '订单';
});
const backFunc = () => {
  emit('back');
};
const getRatio = (num) => {
  if (!num) return '--';
  return new Decimal(num) + '%';
};

const showStockModel = ref(false);
const openStockModel = (currStock) => {
  store.commit('setCurrConstract', currStock);
  showStockModel.value = true;
};
const statusMap = ref({
  // 仓位状态
  none: '开仓',
  lock: '锁定',
  open: '持仓',
  done: '平仓',
  fail: '失败',
  cancel: '已取消',
});
const finalStatus = computed(() => {
  return ['done', 'fail', 'cancel'].includes(props.currStock.status);
});

const stopMap = ref({
  // 止损类型
  price: '价格',
  amount: '金额',
  ratio: '百分比',
});

const offsetMap = ref({
  // 涨跌状态
  long: '买涨',
  short: '买跌',
});

const leverTypeap = ref({
  // 仓位
  cross: '全仓',
  isolated: '逐仓',
});
const priceTypeMap = ref({
  // 价格类型
  market: '市价',
  limit: '限价',
});

//  复制
const copy = (text) => {
  _copyTxt(text);
  showToast(t('trade.order_info_copy'));
};

watch(showStockModel, (val) => {
  if (!val) {
    store.commit('setOpenInfoStatus', false);
  }
})
</script>

<style lang="less" scoped>
.scroller {
  // height: calc(var(--vh) * 100 - 3.2rem);
  overflow-y: auto;
  margin-top: 1.12rem;
  padding: 0 0.32rem;
}

.stock-info {
  padding: 0.28rem;

  &__head {
    display: flex;
    height: 0.4rem;
    justify-content: space-between;
    margin-bottom: 0.1rem;
  }

  &__hl {
    display: flex;
    align-items: center;
  }

  &__symbol {
    font-size: 0.3rem;
    font-weight: 600;
  }

  &__status {
    border: 1px solid var(--ex-info-color);
    color: var(--ex-info-color);
    padding: 0.04rem 0.08rem;
    height: 0.3rem;
    line-height: 100%;
    font-size: 0.22rem;
    margin-left: 0.08rem;
    border-radius: 0.6rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }

  &__trend {
    width: 0.4rem;
    height: 0.4rem;

    img {
      width: 100%;
      height: 100%;
    }
  }

  &__order_no {
    display: flex;
    align-items: center;
    color: var(--ex-text-color3);

    span {
      font-size: 0.28rem;
    }
  }

  &__copy_icon {
    width: 0.24rem;
    height: 0.24rem;
    margin-left: 0.12rem;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.info_boxs {
  display: flex;
  align-items: stretch;
  padding: 0.3rem 0;
  position: relative;
  // border: 1px solid var(--ex-border-color);
  border-radius: 0.32rem;
  background-color: var(--ex-bg-white2);
  // margin: -0.5rem 0 0 0;
  margin: 0 0.28rem;
  z-index: 1;

  .info_box {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--ex-text-color3);
    font-size: 0.28rem;
    line-height: 0.44rem;
    position: relative;

    .amount {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      line-height: 0.44rem;
      margin-bottom: 0.12rem;
      font-weight: 600;
      color: var(--ex-primary-color);
      font-size: 0.36rem;
    }
  }

  // .info_box + .info_box::after {
  //   content: '';
  //   width: 1px;
  //   height: 0.9rem;
  //   background-color: var(--ex-bg-color3);
  //   position: absolute;
  //   left: 0;
  //   top: 50%;
  //   margin-top: -0.45rem;
  // }
}

.order_info_box {
  margin: 0.32rem 0.28rem 0 0.28rem;

  border-radius: 0.32rem;
  height: 7.3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .title {
    text-align: center;
    font-size: 0.28rem;
    color: var(--ex-text-color);
    font-weight: bold;
  }

  .info_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // border-bottom: 1px solid var(--ex-border-color);

    .name {
      color: var(--ex-text-color3);
      font-size: 0.28rem;
      font-weight: 400;
    }

    .val_box {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 0.28rem;
      color: var(--ex-text-color);

      .tag {
        color: var(--ex-white);
        font-size: 0.24rem;
        background-color: var(--ex-bg-white2);
        height: 0.44rem;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 0.24rem;
        border-radius: 0.28rem;
        margin-right: 0.1rem;
      }

      .red_tag,
      .tag_long,
      .tag_buy {
        color: var(--ex-up-color);
        background-color: rgb(var(--ex-up-color-rgb) / 0.08);
      }

      .green_tag,
      .tag_short,
      .tag_sell {
        color: var(--ex-down-color);
        background-color: rgb(var(--ex-down-color-rgb) / 0.08);
      }

      .text {
        min-width: 0.5rem;
        text-align: right;
        font-weight: bold;
      }
    }
  }
}

.btns {
  display: flex;
  align-content: center;
  justify-content: center;
  padding-top: 0.32rem;

  .btn {
    width: 2.1532rem;
    height: 0.92rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--ex-primary-color);
    color: var(--ex-white);
    font-size: 0.32rem;
    font-weight: 400;
    line-height: 100%;
    border-radius: 1rem;
    margin: 0 0.1rem;

    .btn_icon {
      width: 0.4rem;
      height: 0.4rem;
      margin-right: 0.08rem;
    }
  }

  .btn3 {
    background-color: var(--ex-info-color);
  }

  .btn4 {
    background-color: var(--ex-white);
    color: var(--ex-bg-color);
  }

  .disabled_btn {
    // background-color: var(--ex-bg-color3);
    display: none;
  }
}
</style>
