<!-- 交易页 -->
<!-- 市场行情 -->
<template>
    <div class="page-marketinfo2">
        <!-- 头部 -->
        <div class="max-width info_header">
            <div class="top">
                <div v-if="!props.innerPage" class="back" @click="router.back">
                    <Icon name="arrow-left" />
                </div>

                <!-- 标题 -->
                <div class="title" v-if="route.query.type == 'stock'">
                    <div class="title_name">{{ item.symbol || "--" }} </div>
                    <div v-if="showDate" class=" leading-[0.4rem]">
                        {{ showDate }}
                    </div>
                </div>
                <div class="title" v-else @click="showSearchDialog = true">
                    <div class="title_name">{{ item.name || "--" }}
                        <Icon name="arrow-down" />
                    </div>
                </div>
                <!-- 详情 -->
                <div class="title_shadow"></div>
                <div v-if="!props.innerPage" class="search star" @click="addCollect"
                    :style="{ opacity: loading ? '0.5' : '1' }">
                    <div class="size-[0.48rem]">
                        <img v-if="item.watchlist == 1" v-lazy="getStaticImgUrl('/static/img/market/star.svg')" alt="">
                        <img v-else v-lazy="getStaticImgUrl('/static/img/market/unstar.svg')" alt="">
                    </div>
                </div>
            </div>
        </div>

        <div class="market-trade-body">
            <Tabs :key="'main'" class="van-tabs--sub_line van-tabs--sub_bg" :sticky="true"
                :color="'var(--ex-primary-color)'" v-model:active="activeTab" animated shrink>
                <Tab :name="1" :title="'现货'">
                    <div class="dialog-market-box" v-if="activeTab == 1 && !chartLoading">
                        <div class="charts-box">
                            <Chart :mini="true" />
                        </div>
                        <!-- 内容 -->
                        <div style="padding: 0 0.1rem;background-color:var(--ex-bg-color);margin-top: 0.1rem;">
                            <Tabs :key="'sub'" class="van-tabs--sub_line van-tabs--sub_bg"
                                :color="'var(--ex-primary-color)'" v-model:active="activeTab2" animated shrink>
                                <Tab :name="11" :title="'开仓'">
                                    <div style="height: 0.2rem;"></div>
                                    <OpeningSpot :item="item" ref="openingRef2" :from="'trade'" />
                                </Tab>
                                <Tab :name="22" :title="'订单薄'" v-if="item.type == 'crypto'">
                                    <div style="height: 0.08rem;"></div>
                                    <div class="market-box">
                                        <OrderingSpot v-if="activeTab2 == 22" :key="'o'" type="nomal" />
                                    </div>
                                </Tab>
                                <Tab :name="33" :title="'最新成交'" v-if="item.type == 'crypto'">
                                    <div class="market-box">
                                        <OrderingSpot v-if="activeTab2 == 33" :key="'n'" type="news" />
                                    </div>
                                </Tab>
                                <Tab :title="t('trade.trade_orders_current')" :name="44">
                                    <div style="height: 0.2rem;"></div>
                                    <div class="dialog-market-bg" v-if="activeTab2 == 44">
                                        <Positions :type="'constract'" />
                                    </div>
                                </Tab>
                                <Tab :title="t('trade.trade_order_history')" :name="55">
                                    <div style="height: 0.2rem;"></div>
                                    <div class="dialog-market-bg" v-if="activeTab2 == 55">
                                        <Inquire :scrollBox="'.dialog-market-box'" :type="'constract'" ref="InquireRef" />
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>
                        <!-- <div class="order-box">
                            <SpotBlock />
                        </div> -->
                    </div>
                </Tab>
                <Tab :name="2" :title="'合约'">
                    <div class="dialog-market-box">
                        合约
                    </div>
                </Tab>
                <Tab :name="3" :title="'交易机器人'">
                    <div class="dialog-market-box">
                        交易机器人
                    </div>
                </Tab>
            </Tabs>
        </div>


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
                    <input v-model.trim="searchDialogStr" @keyup="goDialogSearch" type="text" class="ipt"
                        style="width: 100%" :placeholder="t('trade.stock_opening_search')" />
                </div>

                <div class="lists">
                    <StockTable :showIcon="true" theme="classic" :handleClick="handleClick" :loading="searchLoading"
                        :key="'search'" :list="marketSearchList" />
                </div>
            </div>
        </BottomPopup>

    </div>

</template>

<script setup>
import { ref, computed } from "vue"
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import router from "@/router/index"
import store from "@/store";
import { getStaticImgUrl, _formatNumber } from "@/utils/index.js"
import { Tab, Tabs, Icon, showToast } from "vant";
import { _futures, _basic, _add, _del } from "@/api/api";
import BottomPopup from "@/components/BottomPopup.vue";
import StockTable from "@/components/StockTable.vue";
import OrderingSpot from "@/views/Market/OrderingSpot.vue"
import Chart from "@/views/Market/Chart.vue"
import OpeningSpot from "@/views/Trade2/spot/Opening.vue"
import Positions from "@/views/Trade2/spot/Positions.vue";
import Inquire from "@/views/Trade2/spot/Inquire.vue";


const props = defineProps({
    type: {
        type: String,
        default: "",
    },
});

const { t } = useI18n();
const route = useRoute();
const token = computed(() => store.state.token);


const activeTab = ref(1)
const activeTab2 = ref(11)
const periodType = computed(() => route.query.type || props.type);
const tradeType = ref(route.query.tradeType)

// 股票信息
const item = computed(() => {
    let it = {};
    const type = route.query.type || props.type;
    switch (type) {
        case "constract": // 合约
            it = store.state.currConstact || {};
            break;
        case "ai": // 合约
            it = store.state.currAi || {};
            break;
        default:
            it = store.state.currStock || {};
    }
    return it;
});



const updown = computed(() => {
    // 1-涨 -1-跌 0-平
    if (item.value.ratio === undefined) return 0;
    return item.value.ratio > 0 ? 1 : -1;
});


// 获取股票最新信息
const getBasic = (obj) => {
    _basic({ symbol: obj.symbol }).then((res) => {
        if (res.code == 200) {
            if (res.data.symbol == item.value.symbol) {
                const type = route.query.type || props.type;
                switch (type) {
                    case "constract": // 合约
                        store.commit("setCurrConstract", {
                            ...obj,
                            ...res.data,
                        });
                        break;
                }
            }
        }
    });
}
if (item.value.symbol) {
    getBasic(item.value)
}
const chartLoading = ref(false)
const handleClick = (obj) => {
    obj = JSON.parse(JSON.stringify(obj))
    if (obj.type != 'crypto' && ['3', '4'].includes(activeTab.value)) { // 非加密货币的没有订单薄
        activeTab2.value = 11
    }
    showSearchDialog.value = false
    chartLoading.value = true
    store.commit("setCurrConstract", obj);
    setTimeout(() => {
        getBasic(obj)
        chartLoading.value = false
    }, 0)
};


// 添加自选
const loading = ref(false);
const addCollect = () => {
    if (!token.value) return store.commit("setIsLoginOpen", true);
    if (loading.value) return;
    loading.value = true;
    if (!item.value.watchlist) {
        _add({
            symbol: item.value.symbol,
        })
            .then((res) => {
                if (res.code == 200) {
                    store.dispatch('updateMarketWatchList');
                    switch (route.query.type) {
                        case "constract": // 合约
                            store.commit("setCurrConstract", { watchlist: 1 });
                            break;
                        default:
                            store.commit("setCurrStock", { watchlist: 1 });
                    }
                    // showToast(t('market.market_optional_add_success'));
                }
            })
            .finally(() => {
                loading.value = false;
            });
    } else {
        _del({
            symbol: item.value.symbol,
        })
            .then((res) => {
                if (res.code == 200) {
                    store.dispatch('updateMarketWatchList');
                    switch (route.query.type) {
                        case "constract": // 合约
                            store.commit("setCurrConstract", { watchlist: 0 });
                            break;
                        default:
                            store.commit("setCurrStock", { watchlist: 0 });
                    }
                    // showToast(t('market.market_optioanl_del_success'));
                }
            })
            .finally(() => {
                loading.value = false;
            });
    }
};


// 搜索
const marketSearchList = computed(() => store.state.futuresSearchList)
const showSearchDialog = ref(false);
const searchDialogStr = ref("");
let searchTimeout = null;
const searchLoading = ref(false);
const goDialogSearch = () => {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchLoading.value = true;
    let s = searchDialogStr.value;
    searchTimeout = setTimeout(() => {
        _futures({
            name: s,
            type: "",
        })
            .then((res) => {
                if (searchDialogStr.value == s) {
                    let arr = (res.data || []).map((item) => {
                        const target = marketSearchList.value.find(
                            (a) => a.symbol == item.symbol
                        );
                        if (target)
                            return {
                                ...target,
                                ...item,
                            };
                        return item;
                    });
                    store.commit("setFuturesSearchList", arr);
                    store.dispatch("subList", {
                        commitKey: "setFuturesSearchList",
                        listKey: "futuresSearchList",
                    });
                }
            })
            .finally(() => {
                searchLoading.value = false;
            });
    }, 100);
};
setTimeout(() => {
    goDialogSearch()
}, 2000)
</script>

<style lang="less" scoped>
.search_dialog_trade {
    .lists {
        height: calc(var(--vh) * 60);
        overflow-y: auto;
        margin-top: 0.32rem;
        padding: 0 0.32rem;
    }

    .search_box {
        height: 0.8rem;
        padding: 0 0.32rem;
        margin: 0.4rem 0.3rem 0 0.3rem;
        display: flex;
        align-items: center;
        background-color: var(--ex-bg-white1);
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


.page-marketinfo2 {
    // padding: 1.8rem 0 0 0;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    background-color: var(--ex-bg-color);


    .market-trade-body {

        :deep(.van-tabs--sub_bg) {
            &>div {
                &>.van-sticky {
                    &>div {
                        &>.van-tabs__wrap {
                            width: calc(100% - 0.2rem);
                            position: relative;
                            left: 0.1rem;
                            border-bottom: none;
                        }
                    }
                }
            }
        }

        .dialog-market-box {
            margin-top: 0.1rem;
            height: calc(var(--vh) * 100 - 2rem);
            overflow-y: auto;

            .charts-box {
                padding: 0 0.1rem;
            }

            .dialog-market-bg {
                background-color: var(--ex-bg-color3);
                border-radius: 0.32rem;
                padding: 0 0.24rem 0.24rem 0.24rem;
            }
        }
    }











    .bottom-box {
        margin-top: 0.32rem;
        height: 1.4rem;
        background-color: var(--ex-bg-color3);
        border-radius: 0.32rem 0.32rem 0 0;
        padding: 0.18rem 0.32rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid var(--ex-bg-white1);

        .info {
            .name {
                font-size: 0.32rem;
            }

            .type {
                margin-top: 0.16rem;
                color: var(--ex-text-color5);
                height: 0.36rem;
                align-items: center;
                justify-content: center;
                border-radius: 0.4rem;
                padding: 0 0.16rem;
                display: inline-flex;
                border: 1px solid var(--ex-text-color5);
            }
        }

        .btn {
            background-color: var(--ex-status-color3);
            width: 2.88rem;
            height: 0.92rem;
            border-radius: 1rem;
            color: var(--ex-white);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.32rem;
        }
    }

    .market-box {
        margin-top: 0.1rem;
        height: calc(var(--vh) * 100 - 6rem) // border-radius: 0.32rem;
            // background-color: var(--ex-bg-color3);
    }


    .has_padding_x {
        padding: 0 0.3rem;
    }

    .info_header {
        width: 100%;
        background-color: var(--ex-bg-color);
        padding: 0 0.1rem;
        z-index: 100;

        .top {
            display: flex;
            min-height: 1rem;
            align-items: center;
            justify-content: space-between;
            position: relative;
            height: 0.88rem;
            margin-bottom: 0.1rem;
            padding: 0 0.2rem;

            .back {
                width: 0.6rem;
                height: 0.6rem;
                font-size: 0.32rem;
                background-color: var(--ex-bg-color3);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .title_shadow {
                flex: 1;
            }

            .star {
                width: 0.7rem;
                height: 0.7rem;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .title {
                // pointer-events: none;
                position: absolute;
                width: calc(100% - 1.6rem);
                top: 50%;
                transform: translateY(-50%) translateX(-50%);
                left: 50%;
                text-align: center;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                font-size: 0.24rem;
                line-height: 0.332rem;
                font-weight: 400;
                color: var(--ex-text-color3);

                .title_name {
                    color: var(--ex-text-color);
                    font-size: 0.32rem;
                    line-height: 0.432rem;
                    font-weight: 500;
                }
            }

        }

        .count {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;

            .count_item {
                color: var(--ex-text-color2);
                font-size: 0.24rem;
                font-weight: 400;
                line-height: 0.36rem;
                width: 50%;
                margin-top: 0.18rem;

                .num {
                    margin-left: 0.1rem;
                }
            }
        }
    }



    @media (min-width: 751px) {


        .info_header {
            max-width: 375px;
        }
    }

}
</style>