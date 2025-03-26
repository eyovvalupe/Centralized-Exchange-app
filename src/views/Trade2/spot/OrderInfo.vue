<template>
  <div>
    <Top :title="t('订单详情')" :backFunc="backFunc" />

    <div class="scroller">
      <div class="bg-color3 rounded-[0.32rem] mx-[0.32rem]">
        <div class="stock-info">
          <div class="stock-info__head">
            <div class="stock-info__hl">
              <span class="size-[0.8rem] mr-[0.2rem]">
                <CryptoIcon :name="currSpot.name ? currSpot.name.split('/')[0] : ''" />
              </span>
              <span class="stock-info__symbol">{{
                currSpot.name || "--"
              }}</span>
              
              <span class="stock-info__status status-color border-[1px]" :class="['status-'+currSpot.status]">
                {{
                  currSpot.status == 'none' ? t('委托中') :
                    currSpot.status == 'lock' ? t('trade.stock_position_status_lock') :
                      currSpot.status == 'open' ? t('trade.stock_position_status_open') :
                        currSpot.status == 'done' ? t('已完成') :
                          currSpot.status == 'fail' ? t('trade.stock_position_status_fail') :
                            currSpot.status == 'cancel' ? t('已撤单') :
                              '--'
                }}
              </span>
            </div>
          </div>
        </div>
        <div class="order_info_box">
          <div class="info_item">
            <div class="name">{{ t("方向") }}</div>
            <div class="val_box">
              <div class="tag" :class="'tag_' + currSpot.offset">
                {{
                  currSpot.offset == 'buy' ? t('market.market_buy_optional_buy') :
                  currSpot.offset == 'sell' ? t('market.market_buy_optional_sell') :
                      '--'
                }}
              </div>
              
            </div>
          </div>
          
          <div class="info_item">
            <div class="name">{{ t("trade.stock_opening_price") }}</div>
            <div class="val_box">
              <div class="tag">
                {{
                  currSpot.price_type == 'market' ? t('trade.stock_market_price') :
                    currSpot.price_type == 'limit' ? t('trade.stock_limit_price') :
                      '--'
                }}
              </div>
              <div class="text ml-[0.2rem]">{{ currSpot.settled_price || currSpot.price || "--" }} USDT</div>
            </div>
          </div>
          
          <div class="info_item">
            <div class="name">
              {{
                t("trade.stock_position_amount")
              }}
            </div>
            <div class="val_box">
              <div class="text">{{ currSpot.volume || "--" }} {{ currSpot.name ? currSpot.name.split('/')[0] : '' }}</div>
            </div>
          </div>
          
          <div class="info_item">
            <div class="name">{{ t("交易额") }}</div>
            <div class="val_box">
              <div class="text">{{ orderAmount || "--" }} USDT</div>
            </div>
          </div>
          
          <div class="info_item">
            <div class="name">{{ t("trade.stock_opening_fee") }}</div>
            <div class="val_box">
              <div class="text">{{ currSpot.fee || "0" }} USDT</div>
            </div>
          </div>
          
          <div class="info_item">
            <div class="name">{{ t("trade.ipo_detail_order_no") }}</div>
            <div class="val_box">
              <div class="text">
                {{ currSpot.order_no || "--" }}
              </div>
              <div class="stock-info__copy_icon flex-shrink-0" @click="copy(currSpot.order_no)">
                <img :src="getStaticImgUrl('/static/img/common/copy.svg')" alt="copy" />
              </div>
            </div>
          </div>
          <div class="info_item">
            <div class="name">{{ t("委托时间") }}</div>
            <div class="val_box">
              <div class="text">{{ currSpot.date || "--" }}</div>
            </div>
          </div>
        
        </div>
      </div>
    </div>
    
    <div class="btns" v-if="currSpot.status == 'none'">
      
      <div class="btn  ripple-btn" @click="emit('cancel', currSpot)" >
        <div class="btn_icon">
          <img :src="getStaticImgUrl('/static/img/trade/cancel2.svg')" alt="img" />
        </div>
        <div>{{ t("trade.order_info_cancel") }}</div>
      </div>
     
    </div>

  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { computed } from "vue";
import { _copyTxt } from "@/utils/index";
import { showToast } from "vant";
import CryptoIcon from "@/components/CryptoIcon.vue";
import Top from "@/components/Top.vue";
import {
  _basic,
} from "@/api/api";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emit = defineEmits(["cancel", "back"]);
const props = defineProps({
  currSpot: {
    type: Object,
    default() {
      return {};
    },
  },
  tradeType: {
    type: String,
    default: ''
  }
});
const backFunc = () => {
  emit("back");
};


const orderAmount = computed(()=>{
  return props.currSpot ? (Number(props.currSpot.settled_price || props.currSpot.price) * props.currSpot.volume).toFixed(3).slice(0,-1) : '--'
});

//  复制
const copy = (text) => {
  _copyTxt(text);
  showToast(t('trade.order_info_copy'));
};

</script>

<style lang="less" scoped>
.scroller {
  height: calc(100vh - 2.6rem);
  overflow-y: auto;
  margin-top: 1.28rem;
  box-sizing: border-box;
  padding-bottom: 0.32rem;
}

.stock-info {
  padding: 0.32rem 0.28rem 0.08rem 0.28rem;
  &__head {
    display: flex;
    height: 0.8rem;
    justify-content: space-between;
    align-items: center;
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
  .status-none{
    border-color: var(--ex-warning-color);
    color: var(--ex-warning-color);
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

.order_info_box {
  padding: 0 0.4rem 0.4rem 0.4rem;

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
    margin: 0.32rem 0 0 0;
    min-height: 0.44rem;

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
      max-width: 4.4rem;
      text-align: right;
      word-wrap: break-word;

      .tag {
        color: var(--ex-text-color);
        font-size: 0.24rem;
        background-color: var(--ex-bg-white1);
        height: 0.44rem;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 0.24rem;
        border-radius: 0.28rem;
      }

      .red_tag,
      .tag_buy {
        color: var(--ex-up-color);
        background-color: rgb(var(--ex-up-color-rgb) / 0.08);
      }

      .green_tag,
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
  padding: 0 0.32rem;
  .btn {
    height: 0.92rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--ex-bg-white1);
    color: var(--ex-text-color);
    font-size: 0.32rem;
    font-weight: 400;
    border-radius: 0.6rem;

    .btn_icon {
      width: 0.4rem;
      height: 0.4rem;
      margin-right: 0.12rem;
    }
  }

  
}
</style>
