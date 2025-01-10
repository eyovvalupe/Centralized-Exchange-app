<template>
    <div class="ipo_stock_detail">
        <Top :title="`IPO ${t('trade.ipo_detail_title')}`"></Top>
        <div class="scroller loading_box" v-if="loading">
            <Loading color="var(--ex-primary-color)" />
            <div class="loading_text">{{ t('trade.ipo_detail_loading') }}...</div>
        </div>
        <div class="scroller" v-else>

            <div class="status_box" v-if="currDetail.status == 'success'">
                <div style="width: 1.2rem;height: 1.2rem;">
                    <img :src="getStaticImgUrl(`/static/img/trade/ipo_detail_success.svg`)" alt="">
                </div>
                <div class="status_text" style="color:var(--ex-success-color);">
                    {{ t('trade.ipo_detail_status_success') }}
                </div>
            </div>
            <div class="status_box" v-else-if="currDetail.status == 'failure'">
                <div class="status_fail">
                    <div style="width: 1.2rem;height: 1.2rem;">
                        <img :src="getStaticImgUrl(`/static/img/trade/ipo_detail_failure.svg`)" alt="">
                    </div>
                </div>
                <div class="status_text" style="color:var(--ex-text-color2);">
                    {{ t('trade.ipo_detail_status_failure') }}
                </div>
            </div>
            <div class="status_box" v-else>
                <div style="width: 1.2rem;height: 1.2rem;">
                    <img :src="getStaticImgUrl(`/static/img/trade/ipo_detail_wait.svg`)" alt="">
                </div>
                <div class="status_text status_wait">
                    {{ t('trade.ipo_detail_status_wait') }}
                </div>
            </div>

            <div class="main_item">

                <div class="item_box">
                    <div class="name_box">
                        <div class="name">{{ currDetail.company_name }} <span class="lever_icon"
                                v-if="currDetail.lever > 1">{{ t('trade.ipo_leveraged_trading') }}</span> </div>
                    </div>
                    <div class="item_order_no">
                        <span>{{ t('trade.ipo_detail_order_no') }} {{ currDetail.order_no || '--' }}</span>
                        <div class="item_copy_icon" @click="copy(currDetail.order_no)">
                            <img :src="getStaticImgUrl('/static/img/common/copy.svg')" alt="copy">
                        </div>
                    </div>


                    <div class="info_boxs">

                        <div class="info_box">
                            <div class="amount blue">
                                {{ currDetail.winning || '--' }}
                            </div>
                            <div>{{ t('trade.ipo_detail_win_num') }}</div>
                        </div>
                        <div class="info_box info_box--line">
                            <div class="amount">
                                {{ currDetail.volume || '--' }}
                            </div>
                            <div>{{ t('trade.ipo_detail_buy_num') }}</div>
                        </div>
                        <div class="info_box ">
                            <div class="amount blue">
                                {{ '--' }}
                            </div>
                            <div>{{ t('trade.ipo_detail_block_num') }}({{ currDetail.currency }})</div>
                        </div>
                        <div class="info_box info_box--line">
                            <div class="amount">
                                {{ currDetail.issue_price || '--' }}
                            </div>
                            <div>{{ t('trade.ipo_detail_buy_value') }}({{ currDetail.currency }})</div>
                        </div>
                    </div>


                    <div class="detail_item_list">
                        <!-- <div class="detail_item">
                    <div>订单数量</div>
                    <div class="val">{{ currDetail.volume || '--' }}</div>
                </div> -->
                        <div class="detail_item">
                            <div>{{ t('trade.ipo_detail_fee') }}</div>
                            <div class="val">{{ currDetail.fee }} <span>{{ currDetail.currency }}</span></div>
                        </div>
                        <div class="detail_item">
                            <div>{{ t('trade.ipo_detail_leverage') }}</div>
                            <div class="val">{{ currDetail.lever ? currDetail.lever + 'X' : '--' }}</div>
                        </div>
                        <div class="detail_item">
                            <div>{{ t('trade.ipo_detail_market_date') }}</div>
                            <div class="val">{{ currDetail.listing_date || '--' }}</div>
                        </div>
                        <div class="detail_item">
                            <div>{{ t('trade.ipo_detail_market_price') }}</div>
                            <div class="val">{{ currDetail.listing_price || '--' }} <span>{{ currDetail.currency
                                    }}</span>
                            </div>
                        </div>

                        <div class="detail_item">
                            <div>{{ t('trade.ipo_detail_buy_price') }}</div>
                            <div class="val">{{ currDetail.issue_price || '--' }} <span>{{ currDetail.currency }}</span>
                            </div>
                        </div>

                        <div class="detail_item">
                            <div>{{ t('trade.ipo_detail_buy_date') }}</div>
                            <div class="val">{{ '--' }}</div>
                        </div>

                        <div class="detail_item">
                            <div>{{ t('trade.ipo_detail_order_date') }}</div>
                            <div class="val">{{ currDetail.created }}</div>
                        </div>



                    </div>
                </div>

            </div>


        </div>
    </div>
</template>


<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { ref } from 'vue'
import { _ipoGet } from "@/api/api";
import Top from "@/components/Top.vue"
import { useRoute } from "vue-router"
import { _orderGet } from "@/api/api";
import { _copyTxt } from "@/utils/index"
import { Loading, showToast } from "vant"
import { useI18n } from "vue-i18n";
import IPO from "./IPO.vue";

const { t } = useI18n()
const route = useRoute()
const currDetail = ref({})

const loading = ref(true)
const openDetail = () => {
    _orderGet({
        order_no: route.query.order_no
    }).then(res => {
        if (res.data) {
            currDetail.value = {
                ...currDetail.value,
                ...res.data
            }
        }
    }).finally(() => {
        loading.value = false
    })
}
openDetail()

//  复制
const copy = text => {
    _copyTxt(text)
    showToast('已复制')
}

</script>

<style lang="less" scoped>
.ipo_stock_detail {
    padding-top: 1.12rem;


    .scroller {
        height: calc(var(--vh) * 100 - 1.12rem);
        overflow-y: auto;
        box-sizing: border-box;
        padding: 0.28rem 0.32rem 0.32rem 0.32rem;
    }

    .main_item {
        border-radius: 0.32rem;
        background: var(--ex-bg-color2);
        margin-top: 0.4rem;

        .name {
            color: var(--ex-text-color);
            font-size: 0.32rem;
            font-weight: 600;
            line-height: 0.36rem;
            color: var(--ex-text-color);
            margin-bottom: 0.14rem;
        }

        .name_box {
            padding-left: 0.16rem;

            .lever_icon {
                display: inline-block;
                height: 0.32rem;
                padding: 0rem 0.08rem;
                font-size: 0.22rem;
                color: var(--ex-primary-color);
                border-radius: 0.08rem;
                line-height: 0.32rem;
                font-weight: 400;
                margin-left: 0.1rem;
                background: rgba(1, 76, 250, 0.10);
            }
        }

        .item_box {
            padding: 0.26rem 0.12rem 0.12rem 0.16rem;
            position: relative;
        }

        .item_order_no {
            display: flex;
            align-items: center;
            color: var(--ex-text-color3);
            margin: 0.32rem 0 0.32rem 0.16rem;

            span {
                font-size: 0.28rem;
            }
        }

        .item_copy_icon {
            width: 0.24rem;
            height: 0.24rem;
            margin-left: 0.12rem;

            img {
                width: 100%;
                height: 100%;
            }
        }
    }

    .status_box {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .status_text {
        color: var(--ex-primary-color);
        text-align: center;
        font-size: 0.3rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.44rem;
        margin-top: 0.24rem;
    }

    .status_wait {
        color: var(--ex-status-color1);
    }

    .status_fail {
        width: 60px;
        height: 60px;
        background-color: var(--ex-bg-color3);
        border-radius: 0.32rem;
        display: flex;
        align-items: center;
        justify-content: center
    }

    .split-line {
        clear: both;
        height: 0.62rem;
        position: relative;
        margin: 0 0.42rem;

        &::after {
            content: '';
            width: 100%;
            position: absolute;
            left: 0;
            top: 50%;
            height: 1px;
            background-color: var(--ex-bg-color3);
        }
    }

    .info_boxs {
        padding: 0.3rem 0;
        border-radius: 0.32rem;
        background-color: var(--ex-bg-color);
        display: flex;
        flex-wrap: wrap;

        .info_box {
            width: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--ex-text-color3);
            font-size: 0.28rem;
            line-height: 0.44rem;
            position: relative;
            padding: 0.24rem 0;

            .amount {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                line-height: 0.44rem;
                margin-bottom: 0.12rem;
                font-weight: 600;
                color: var(--ex-text-color);
                font-size: 0.36rem;
            }

            .blue {
                color: var(--ex-primary-color);
            }
        }
    }

    .detail_item_list {
        padding: 0.08rem 0.32rem 0 0.32rem;
        border-radius: 0.32rem;
        background-color: var(--ex-bg-color);
        margin-top: 0.2rem;
    }

    .detail_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 0.44rem;
        padding: 0.32rem 0 0.2rem 0;
        color: var(--ex-text-color3);
        font-size: 0.28rem;
        font-weight: 400;
        position: relative;

        &::after {
            width: 0.16rem;
            height: 0.34rem;
            content: "";
            background-color: var(--ex-bg-color);
            position: absolute;
            top: -0.28rem;
            right: 1.1rem;
        }

        &::before {
            width: 0.16rem;
            height: 0.34rem;
            content: "";
            background-color: var(--ex-bg-color);
            position: absolute;
            top: -0.28rem;
            left: 1.1rem;
        }

        .name {
            color: var(--ex-text-color3);
            font-weight: 600;
            font-size: 0.28rem;
        }

        .val {
            color: var(--ex-text-color);
            font-size: 0.3rem;
        }
    }

    .detail_item:last-child {
        border-bottom: 0px;
    }

}

.loading_box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.loading_text {
    color: var(--ex-text-color3);
    margin-top: 0.4rem;
    font-size: 0.28rem;
}
</style>