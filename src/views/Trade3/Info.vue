<!-- 交易页 -->
<template>
    <div class="page-marketinfo2">

        <div class="left-icon" @click="openMenu">
            <div class="size-[0.4rem]">
                <img v-lazy="getStaticImgUrl('/static/img/trade/open.svg')" alt="">
            </div>
        </div>

        <div class="market-trade-body" v-if="item.symbol">
            <Tabs @change="changeTab2" :key="'main'" class="van-tabs--top" :sticky="true"
                :color="'var(--ex-primary-color)'" v-model:active="activeTab" animated shrink>
                <!-- 现货 -->
                <Tab :name="1" :title="'现货'">


                    <div class="dialog-market-box" v-if="activeTab == 1 && !chartLoading">

                        <div class="top-box">
                            <!-- 标题 -->
                            <div class="title" @click="showSearchDialog = true">
                                <div class="title_name">{{ item.name || "--" }}
                                    <Icon name="arrow-down" />
                                </div>
                            </div>
                            <div style="flex: 1;"></div>
                            <div @click="goMaret">
                                <div class="size-[0.48rem] mr-[0.24rem]">
                                    <img v-lazy="getStaticImgUrl('/static/img/market/market.svg')" alt="">
                                </div>
                            </div>
                            <!-- 详情 -->
                            <div class="search star" @click="addCollect(activeTab)"
                                :style="{ opacity: loading ? '0.5' : '1' }">
                                <div class="size-[0.48rem]">
                                    <img v-if="item.watchlist == 1"
                                        v-lazy="getStaticImgUrl('/static/img/market/star.svg')" alt="">
                                    <img v-else v-lazy="getStaticImgUrl('/static/img/market/unstar.svg')" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="charts-box" v-if="!showInfoDialog">
                            <Chart :type="'constract'" :mini="true" />
                        </div>
                        <!-- 内容1 -->
                        <div style="margin: 0.1rem;background-color:var(--ex-bg-color3);border-radius: 0.32rem;">
                            <Tabs :key="'sub'" class="van-tabs--sub_line van-tabs--sub_bg van-tabs--market2"
                                :color="'var(--ex-primary-color)'" v-model:active="activeTab2" animated shrink>
                                <Tab :name="11" :title="'开仓'">
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
                                        <PositionsSpot :type="'constract'" />
                                    </div>
                                </Tab>
                                <Tab :title="t('trade.trade_order_history')" :name="55">
                                    <div style="height: 0.2rem;"></div>
                                    <div class="dialog-market-bg" v-if="activeTab2 == 55">
                                        <InquireSpot :scrollBox="'.dialog-market-box'" :type="'constract'"
                                            ref="InquireRef" />
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>

                        <!-- 内容2 -->
                        <!-- <div style="padding: 0 0.1rem;background-color:var(--ex-bg-color);margin-top: 0.1rem;">
                            <Tabs :key="'sub'" class="van-tabs--sub_line van-tabs--sub_bg"
                                :color="'var(--ex-primary-color)'" v-model:active="activeTab3" animated shrink>
                                <Tab :title="t('trade.trade_orders_current')" :name="44">
                                    <div style="height: 0.2rem;"></div>
                                    <div class="dialog-market-bg" v-if="activeTab3 == 44">
                                        <PositionsSpot :type="'constract'" />
                                    </div>
                                </Tab>
                                <Tab :title="t('trade.trade_order_history')" :name="55">
                                    <div style="height: 0.2rem;"></div>
                                    <div class="dialog-market-bg" v-if="activeTab3 == 55">
                                        <InquireSpot :scrollBox="'.dialog-market-box'" :type="'constract'" ref="InquireRef" />
                                    </div>
                                </Tab>
                            </Tabs>
                        </div> -->
                        <div style="height: 0.4rem;"></div>
                    </div>
                </Tab>
                <Tab :name="2" :title="'合约'">
                    <div class="dialog-market-box" v-if="activeTab == 2 && !chartLoading">
                        <div class="top-box">
                            <!-- 标题 -->
                            <div class="title" @click="showSearchDialog = true">
                                <div class="title_name">{{ item.name || "--" }}
                                    <Icon name="arrow-down" />
                                </div>
                            </div>
                            <div style="flex: 1;"></div>
                            <div @click="goMaret">
                                <div class="size-[0.48rem] mr-[0.24rem]">
                                    <img v-lazy="getStaticImgUrl('/static/img/market/market.svg')" alt="">
                                </div>
                            </div>
                            <!-- 详情 -->
                            <div class="search star" @click="addCollect(activeTab)"
                                :style="{ opacity: loading ? '0.5' : '1' }">
                                <div class="size-[0.48rem]">
                                    <img v-if="item.watchlist == 1"
                                        v-lazy="getStaticImgUrl('/static/img/market/star.svg')" alt="">
                                    <img v-else v-lazy="getStaticImgUrl('/static/img/market/unstar.svg')" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="charts-box" v-if="!showInfoDialog">
                            <Chart :type="'constract'" :mini="true" />
                        </div>
                        <!-- 内容1 -->
                        <div style="margin: 0.1rem;background-color:var(--ex-bg-color3);border-radius: 0.32rem;">
                            <Tabs :key="'sub'" class="van-tabs--sub_line van-tabs--sub_bg van-tabs--market2"
                                :color="'var(--ex-primary-color)'" v-model:active="activeTab2" animated shrink>
                                <Tab :name="11" :title="'开仓'">
                                    <OpeningContract :item="item" ref="openingRef2" :from="'trade'" />
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
                                        <PositionsContract :type="'constract'" />
                                    </div>
                                </Tab>
                                <Tab :title="t('trade.trade_order_history')" :name="55">
                                    <div style="height: 0.2rem;"></div>
                                    <div class="dialog-market-bg" v-if="activeTab2 == 55">
                                        <InquireContract :scrollBox="'.dialog-market-box'" :type="'constract'"
                                            ref="InquireRef" />
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>

                        <!-- 内容2 -->
                        <!-- <div style="padding: 0 0.1rem;background-color:var(--ex-bg-color);margin-top: 0.1rem;">
                            <Tabs :key="'sub'" class="van-tabs--sub_line van-tabs--sub_bg"
                                :color="'var(--ex-primary-color)'" v-model:active="activeTab3" animated shrink>
                                <Tab :title="t('trade.trade_orders_current')" :name="44">
                                    <div style="height: 0.2rem;"></div>
                                    <div class="dialog-market-bg" v-if="activeTab3 == 44">
                                        <PositionsContract :type="'constract'" />
                                    </div>
                                </Tab>
                                <Tab :title="t('trade.trade_order_history')" :name="55">
                                    <div style="height: 0.2rem;"></div>
                                    <div class="dialog-market-bg" v-if="activeTab3 == 55">
                                        <InquireContract :scrollBox="'.dialog-market-box'" :type="'constract'" ref="InquireRef" />
                                    </div>
                                </Tab>
                            </Tabs>
                        </div> -->
                        <div style="height: 0.4rem;"></div>
                    </div>
                </Tab>
                <Tab :name="3" :title="'交易机器人'">
                    <div class="dialog-market-box" v-if="activeTab == 3 && !chartLoading">
                        <div class="top-box">
                            <!-- 标题 -->
                            <div class="title" @click="showSearchDialog = true">
                                <div class="title_name">{{ item.name || "--" }}
                                    <Icon name="arrow-down" />
                                </div>
                            </div>
                            <div style="flex: 1;"></div>
                            <div @click="goMaret">
                                <div class="size-[0.48rem] mr-[0.24rem]">
                                    <img v-lazy="getStaticImgUrl('/static/img/market/market.svg')" alt="">
                                </div>
                            </div>
                            <!-- 详情 -->
                            <div class="search star" @click="addCollect(activeTab)"
                                :style="{ opacity: loading ? '0.5' : '1' }">
                                <div class="size-[0.48rem]">
                                    <img v-if="item.watchlist == 1"
                                        v-lazy="getStaticImgUrl('/static/img/market/star.svg')" alt="">
                                    <img v-else v-lazy="getStaticImgUrl('/static/img/market/unstar.svg')" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="charts-box" v-if="!showInfoDialog">
                            <Chart :type="'ai'" :mini="true" />
                        </div>
                        <!-- 内容1 -->
                        <div style="margin: 0.1rem;background-color:var(--ex-bg-color3);border-radius: 0.32rem;">
                            <Tabs :key="'sub'" class="van-tabs--sub_line van-tabs--sub_bg van-tabs--market2"
                                :color="'var(--ex-primary-color)'" v-model:active="activeTab2" animated shrink>
                                <Tab :name="11" :title="'开仓'">
                                    <div style="height: 0.32rem;"></div>
                                    <OpeningAi :tradeType="3" ref="openingRef2" />
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
                                        <PositionsAi />
                                    </div>
                                </Tab>
                                <Tab :title="t('trade.trade_order_history')" :name="55">
                                    <div style="height: 0.2rem;"></div>
                                    <div class="dialog-market-bg" v-if="activeTab2 == 55">
                                        <InquireAi :scrollDom="'.dialog-market-box'" ref="InquireRef" />
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>

                        <!-- 内容2 -->
                        <!-- <div style="padding: 0 0.1rem;background-color:var(--ex-bg-color);margin-top: 0.1rem;">
                            <Tabs :key="'sub'" class="van-tabs--sub_line van-tabs--sub_bg"
                                :color="'var(--ex-primary-color)'" v-model:active="activeTab3" animated shrink>
                                <Tab :title="t('trade.trade_orders_current')" :name="44">
                                    <div style="height: 0.2rem;"></div>
                                    <div class="dialog-market-bg" v-if="activeTab3 == 44">
                                        <PositionsAi />
                                    </div>
                                </Tab>
                                <Tab :title="t('trade.trade_order_history')" :name="55">
                                    <div style="height: 0.2rem;"></div>
                                    <div class="dialog-market-bg" v-if="activeTab3 == 55">
                                        <InquireAi :scrollDom="'.dialog-market-box'"  ref="InquireRef" />
                                    </div>
                                </Tab>
                            </Tabs>
                        </div> -->
                        <div style="height: 0.4rem;"></div>
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
                    <StockTable :showIcon="true" theme="classic" :handleClick="handleClick" :loading="searchLoading2"
                        :key="'search'" :list="marketSearchList2" />
                </div>
            </div>
        </BottomPopup>


        <!-- 详情 -->
        <BottomPopup round v-model:show="showInfoDialog" position="bottom" closeable teleport="body">
            <div style="max-height: calc(var(--vh) * 90);overflow-y: auto;">
                <div style="height: 0.32rem;"></div>
                <MarketInfo2 :innerPage="true" />
            </div>
        </BottomPopup>

        <!-- 菜单 -->
        <Popup round v-model:show="showNavDialog" position="left" :style="{ width: '85%', height: '100%' }">
            <Index @handleClick="handleClickIndex" ref="IndexRef" :innerPage="true" />
        </Popup>
    </div>

</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import store from "@/store";
import { getStaticImgUrl, _formatNumber } from "@/utils/index.js"
import { Tab, Tabs, Icon, Popup } from "vant";
import { _futures, _basic, _add, _del } from "@/api/api";
import BottomPopup from "@/components/BottomPopup.vue";
import router from "@/router";
// 公共
import StockTable from "@/components/StockTable.vue";
import OrderingSpot from "@/views/Market/OrderingSpot.vue"
import Chart from "@/views/Market/Chart.vue"
// 现货
import OpeningSpot from "@/views/Trade2/spot/Opening.vue"
import PositionsSpot from "@/views/Trade2/spot/Positions.vue";
import InquireSpot from "@/views/Trade2/spot/Inquire.vue";
// 合约
import OpeningContract from "@/views/Trade2/contract/Opening.vue"
import PositionsContract from "@/views/Trade2/contract/Positions.vue";
import InquireContract from "@/views/Trade2/contract/Inquire.vue";
// 交易机器人
import OpeningAi from "@/views/Trade2/ai/Opening.vue"
import PositionsAi from "@/views/Trade2/ai/Positions.vue";
import InquireAi from "@/views/Trade2/ai/Inquire.vue";
// 详情
import MarketInfo2 from "@/views/Market/MarketInfo2.vue"
// 导航
import Index from "./Index"

const props = defineProps({
    type: {
        type: String,
        default: "",
    },
});

const { t } = useI18n();
const route = useRoute();
const token = computed(() => store.state.token);

// 详情弹窗
const showInfoDialog = ref(false)
const goMaret = () => {
    showInfoDialog.value = true
}

// 分类
const activeTab = ref(1) // 一级
if (route.query.tradeType == 'constract') {
    activeTab.value = 2
}
if (route.query.tradeType == 'ai') {
    activeTab.value = 3
}
const activeTab2 = ref(11) // 二级
const activeTab3 = ref(44) // 三级

const lastTab = ref(activeTab.value) // 上一次的分类，切换时同步数据用的
const changeTab2 = e => {
    if (e == 3) { // 切换到交易机器人
        store.commit("setCurrAi", JSON.parse(JSON.stringify(store.state.currConstact)));
    }
    if (lastTab.value == 3) { // 从交易机器人切出来
        store.commit("setCurrConstract", JSON.parse(JSON.stringify(store.state.currAi)));
    }
    lastTab.value = e
}

// 股票信息
const item = computed(() => {
    let it = {};
    switch (activeTab.value) {
        case 1: // 现货
        case 2: // 合约
            it = store.state.currConstact || {};
            break;
        case 3: // ai
            it = store.state.currAi || {};
            break;
    }
    return it;
});



const updown = computed(() => {
    // 1-涨 -1-跌 0-平
    if (item.value.ratio === undefined) return 0;
    return item.value.ratio > 0 ? 1 : -1;
});


// 获取股票最新信息
const getBasic = (obj, tab) => {
    _basic({ symbol: obj.symbol }).then((res) => {
        if (res.code == 200) {
            if (res.data.symbol == item.value.symbol) {
                switch (tab) {
                    case 1: // 现货
                    case 2: // 合约
                        store.commit("setCurrConstract", {
                            ...obj,
                            ...res.data,
                        });
                        break;
                    case 3: // ai
                        store.commit("setCurrAi", {
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
    getBasic(item.value, activeTab.value)
}
const chartLoading = ref(true)
onMounted(() => {
    setTimeout(() => {
        chartLoading.value = false
    }, 500)
})
const handleClick = (obj) => {
    obj = JSON.parse(JSON.stringify(obj))
    if (obj.type != 'crypto' && ['3', '4'].includes(activeTab.value)) { // 非加密货币的没有订单薄
        activeTab2.value = 11
    }
    showSearchDialog.value = false
    chartLoading.value = true
    if (activeTab.value == 1 || activeTab.value == 2) {
        store.commit("setCurrConstract", obj);
    }
    if (activeTab.value == 3) {
        store.commit("setCurrAi", obj);
    }
    setTimeout(() => {
        getBasic(obj, activeTab.value)
        chartLoading.value = false
    }, 100)
};
const handleClickIndex = ({ item, type }) => {
    if (type) {
        switch (type) {
            case 'spot':
                activeTab.value = 1
                break;
            case 'constract':
                activeTab.value = 2
                break;
            case 'ai':
                activeTab.value = 3
                break;
        }
    }
    setTimeout(() => {
        handleClick(item)
        showNavDialog.value = false
    }, 300)
}


// 添加自选
const loading = ref(false);
const addCollect = (tab) => {
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
                    switch (tab) {
                        case 1: // 现货
                        case 2: // 合约
                            store.commit("setCurrConstract", { watchlist: 1 });
                            break;
                        case 3: // ai
                            store.commit("setCurrAi", { watchlist: 1 });
                            break
                    }
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
                    switch (tab) {
                        case 1: // 现货
                        case 2: // 合约
                            store.commit("setCurrConstract", { watchlist: 0 });
                            break;
                        case 3: // ai
                            store.commit("setCurrAi", { watchlist: 0 });
                            break
                    }
                }
            })
            .finally(() => {
                loading.value = false;
            });
    }
};


// 搜索
const marketSearchList2 = computed(() => store.state.futuresSearchList)
const showSearchDialog = ref(false);
const searchDialogStr = ref("");
let searchTimeout = null;
const searchLoading2 = ref(false);
const goDialogSearch = () => {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchLoading2.value = true;
    let s = searchDialogStr.value;
    searchTimeout = setTimeout(() => {
        _futures({
            name: s,
            type: "",
        })
            .then((res) => {
                if (searchDialogStr.value == s) {
                    let arr = (res.data || []).map((item) => {
                        const target = marketSearchList2.value.find(
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

                    // 这里如果当前没有item的值 就设置下
                    if (!item.symbol) {
                        const obj = arr[0]
                        switch (activeTab.value) {
                            case 1:
                                store.commit("setCurrConstract", obj || {});
                                if (route.name == 'tradeInfo') {
                                    router.replace({
                                        name: 'tradeInfo',
                                        query: {
                                            symbol: obj.symbol,
                                            type: 'constract',
                                            tradeType: 'spot'
                                        }
                                    })
                                }

                            case 3:
                                store.commit("setCurrAi", obj || {});
                                if (route.name == 'tradeInfo') {
                                    router.replace({
                                        name: 'tradeInfo',
                                        query: {
                                            symbol: obj.symbol,
                                            type: 'ai',
                                            tradeType: 'ai'
                                        }
                                    })
                                }

                                break
                            default:
                                store.commit("setCurrConstract", obj || {});
                                if (route.name == 'tradeInfo') {
                                    router.replace({
                                        name: 'tradeInfo',
                                        query: {
                                            symbol: obj.symbol,
                                            type: 'constract',
                                            tradeType: 'constract'
                                        }
                                    })
                                }

                                break
                        }
                    }
                }
            })
            .finally(() => {
                searchLoading2.value = false;
            });
    }, 100);
};
setTimeout(() => {
    goDialogSearch()
}, 2000)


// 侧边弹框
const showNavDialog = ref(false)
const IndexRef = ref()
const openMenu = () => {
    showNavDialog.value = true
    setTimeout(() => {
        IndexRef.value && IndexRef.value.act()
    }, 0)
}
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

    .right-icon {
        position: absolute;
        right: 0.32rem;
        top: 0.24rem;
        z-index: 99;
    }

    .left-icon {
        position: absolute;
        left: 0.24rem;
        top: 0.28rem;
        z-index: 99;
    }


    .market-trade-body {

        :deep(.van-tabs--top) {
            .van-sticky {
                .van-tabs__wrap {
                    padding-left: 0.68rem;
                }
            }
        }

        .dialog-market-box {
            margin-top: 0.1rem;
            height: calc(var(--vh) * 100 - 1rem);
            overflow-y: auto;
            padding-bottom: 1.26rem;

            :deep(.van-tabs--market2) {
                &>.van-tabs__wrap {
                    border-bottom: 1px solid var(--ex-border-color4);

                    .van-tabs__nav {
                        background: var(--ex-none);
                    }
                }
            }

            .top-box {
                border-radius: 0.32rem;
                background-color: var(--ex-bg-color3);
                margin: 0.1rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 0.28rem;
                height: 0.96rem;
            }

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

}
</style>