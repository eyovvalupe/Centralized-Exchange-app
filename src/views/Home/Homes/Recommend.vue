<template>
    <div v-if="loaded" class="home-tabs-box"
        :class="['home-tabs-box-' + props.from, 'home-tabs-box-' + (props.innerPage ? 'inner' : '')]">
        <Tabs :type="from == 'trade' ? 'line-card-trade' : 'sub'" :color="'var(--ex-primary-color)'" @change="tabChange"
            v-model:active="activeTab" :animated="from != 'home'" shrink>
            <!-- 自选 -->
            <Tab :name="0" v-if="from != 'home'" :title="t('trade.left_mine')">

                <template #title>
                    <div style="width: 0.44rem;height: 0.44rem;">
                        <img v-if="activeTab == 0" v-lazy="getStaticImgUrl('/static/img/trade/star.svg')" alt="">
                        <img v-else v-lazy="getStaticImgUrl('/static/img/trade/unstar.svg')" alt="">
                    </div>
                </template>

                <div v-if="loaded && activeTab == 0" :class="['home-tab-box-' + props.from, 'mt-[0.24rem]']"
                    :style="{ borderTop: props.from == 'home' ? '' : '1px solid var(--ex-border-color)' }">
                    <div v-if="token">
                        <Loaidng v-if="watchListLoading" :loading="watchListLoading" />
                        <div style="padding-bottom: 0.2rem;overflow: visible;"
                            v-if="activeTab == 0 && !watchListLoading">
                            <StockItem :handleClick="props.innerPage ? handleClick : null"
                                :page="from == 'home' ? 'home' : ''" :padding="true"
                                :class="[props.from == 'home' ? 'wow fadeInUp' : '']" :data-wow-delay="(0.03 * i) + 's'"
                                :showIcon="['crypto'].includes(item.type)" :item=item v-for="(item, i) in (watchList)"
                                :key="'c_' + i" menuType="option" marketType="crypto" />
                        </div>
                        <NoData v-if="!watchListLoading && !watchList.length" />
                    </div>
                    <div v-if="!token" class="flex flex-col pt-[0.32rem] pb-[0.32rem]">
                        <div
                            class="w-full flex justify-between border-b-[0.02rem] pb-[0.2rem] mb-[0.6rem] px-[0.32rem] border-b-color2">
                            <div class="text-color2">{{ $t('copy.copy_order_name') }}</div>
                            <div class="text-color2">{{ $t('market.market_optional_crypto_price') + ' / ' +
                                $t('copy.copy_belong_pl_rate') }}</div>
                        </div>

                        <div
                            style="width: 100%;text-align: center;margin: 0.6rem 0 0.4rem 0;color: var(--ex-placeholder-color);">
                            <div style="width:1.12rem;height:1.12rem;margin: 0 auto 0.2rem auto;">
                                <img v-lazy="getStaticImgUrl('/static/img/user/unlogin-user.png')" alt="">
                            </div>
                            <div>{{ $t('market.market_login_first') }}</div>
                        </div>
                        <div class="flex justify-center gap-[0.4rem]">
                            <div style="min-width: 2rem;"
                                class="px-[0.28rem] h-[0.8rem] rounded-[0.4rem] bg-[var(--ex-bg-white1)] flex items-center justify-center text-[0.32rem] text-white ripple-primary"
                                @click="jump('login')">{{ $t('trade.stock_opening_token_login') }}</div>
                            <!-- <div class="w-[3rem] h-[0.8rem] rounded-[0.4rem] bg-primary flex items-center justify-center text-[0.32rem] text-white ripple-btn"
                @click="jump('register')">{{ $t('trade.stock_opening_token_register') }}</div> -->
                        </div>
                    </div>
                </div>
            </Tab>
            <!-- 买币 -->
            <Tab :name="5" v-if="from != 'home'" :title="t('market.market_header_buy')">
                <BuyCoin v-if="loaded && activeTab == 5" />
            </Tab>
            <!-- 股票 -->
            <Tab :name="6" :title="'股票'">
                <StockList :handleClick="props.innerPage ? handleClick : null" v-if="loaded && activeTab == 6" />
            </Tab>
            <!-- 现货 -->
            <Tab :name="1" :title="t('common.spot')">
                <div v-if="loaded && activeTab == 1" :class="['home-tab-box-' + props.from, 'mt-[0.24rem]']"
                    :style="{ borderTop: props.from == 'home' ? '' : '1px solid var(--ex-border-color)' }">
                    <Loaidng v-if="commendLoading" :loading="commendLoading" />
                    <div class="" style="padding-bottom: 0.2rem;overflow: visible;" v-if="activeTab == 1">
                        <StockItem :handleClick="props.innerPage ? handleClick : null"
                            :page="from == 'home' ? 'home' : ''" :padding="true"
                            :class="[props.from == 'home' ? 'wow fadeInUp' : '']" :data-wow-delay="(0.03 * i) + 's'"
                            :showIcon="true" :item="{ ...item, type: 'spot' }"
                            v-for="(item, i) in filterList(contractList)" :key="'c_' + i" menuType="spot"
                            marketType="crypto" page="home" />
                    </div>
                    <NoData v-if="!commendLoading && !contractList.length" />
                </div>
            </Tab>
            <!-- 合约 -->
            <Tab :name="2" :title="$t('common.crypto')">
                <div v-if="loaded && activeTab == 2" :class="['home-tab-box-' + props.from, 'mt-[0.24rem]']"
                    :style="{ borderTop: props.from == 'home' ? '' : '1px solid var(--ex-border-color)' }">
                    <Loaidng v-if="commendLoading" :loading="commendLoading" />
                    <div style="padding-bottom: 0.2rem;" v-if="activeTab == 2">
                        <StockItem :handleClick="props.innerPage ? handleClick : null"
                            :page="from == 'home' ? 'home' : ''" :padding="true"
                            :class="[props.from == 'home' ? 'wow fadeInUp' : '']" :data-wow-delay="(0.03 * i) + 's'"
                            :showIcon="true" :item="item" v-for="(item, i) in filterList(contractList)" :key="'c_' + i"
                            menuType="constract" marketType="crypto" page="home" />
                    </div>
                    <NoData v-if="!commendLoading && !contractList.length" />
                </div>
            </Tab>
            <!-- 外汇 -->
            <Tab :name="7" :title="'外汇'">
                <div v-if="loaded && activeTab == 7" :class="['home-tab-box-' + props.from, 'mt-[0.24rem]']"
                    :style="{ borderTop: props.from == 'home' ? '' : '1px solid var(--ex-border-color)' }">
                    <Loaidng v-if="commendLoading2" :loading="commendLoading2" />
                    <div style="padding-bottom: 0.2rem;" v-if="activeTab == 7">
                        <StockItem :handleClick="props.innerPage ? handleClick : null"
                            :page="from == 'home' ? 'home' : ''" :padding="true"
                            :class="[props.from == 'home' ? 'wow fadeInUp' : '']" :data-wow-delay="(0.03 * i) + 's'"
                            :showIcon="false" :item="item" v-for="(item, i) in filterList(marketForeignList)"
                            :key="'c_' + i" menuType="foreign" marketType="crypto" page="home" />
                    </div>
                    <NoData v-if="!commendLoading2 && !marketForeignList.length" />
                </div>
            </Tab>
            <!-- 大宗交易 -->
            <Tab :name="8" :title="'大宗交易'">
                <div v-if="loaded && activeTab == 8" :class="['home-tab-box-' + props.from, 'mt-[0.24rem]']"
                    :style="{ borderTop: props.from == 'home' ? '' : '1px solid var(--ex-border-color)' }">
                    <Loaidng v-if="commendLoading3" :loading="commendLoading3" />
                    <div style="padding-bottom: 0.2rem;" v-if="activeTab == 8">
                        <StockItem :handleClick="props.innerPage ? handleClick : null"
                            :page="from == 'home' ? 'home' : ''" :padding="true"
                            :class="[props.from == 'home' ? 'wow fadeInUp' : '']" :data-wow-delay="(0.03 * i) + 's'"
                            :showIcon="false" :item="item" v-for="(item, i) in filterList(marketCommoditiesList)"
                            :key="'c_' + i" menuType="commodities" marketType="crypto" page="home" />
                    </div>
                    <NoData v-if="!commendLoading3 && !marketCommoditiesList.length" />
                </div>
            </Tab>
            <!-- 交易机器人 -->
            <Tab :name="3" :title="$t('common.option')">
                <div v-if="loaded && activeTab == 3" class="pl-[0.32rem] pr-[0.24rem]"
                    :class="['home-tab-box-' + props.from, 'mt-[0.32rem]']">
                    <Ai :handleClick="props.innerPage ? handleClick : null" :from="props.from" page="home"
                        v-if="activeTab == 3" />
                </div>
            </Tab>
            <!-- ETF -->
            <!-- <Tab :name="4" :title="'ETF'">
                <div class="pl-[0.32rem] pr-[0.24rem]" :class="['home-tab-box-' + props.from, 'mt-[0.32rem]']">
                    <Ai :handleClick="props.innerPage ? handleClick : null" :from="props.from" page="home"
                        v-if="activeTab == 4" />
                </div>
            </Tab> -->
        </Tabs>
    </div>
</template>

<script setup>
import { Tab, Tabs } from "vant";
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from "vue"
import NoData from "@/components/NoData.vue";
import Loaidng from "@/components/Loaidng.vue";
import Ai from "@/views/Market/components/Ai.vue";
import StockItem from "@/components/StockItem.vue";
import { _futures, _stock, _watchlist } from "@/api/api";
import store from "@/store";
import { useI18n } from "vue-i18n";
import router from "@/router";
import { getStaticImgUrl } from "@/utils/index.js"
import BuyCoin from "@/views/Market/buyCoin/index.vue";
import StockList from "../components/StockList.vue"

const loaded = ref(false)
onMounted(() => {
    setTimeout(() => {
        loaded.value = true
    }, 500)
})
onBeforeUnmount(() => {
    loaded.value = false
})

const emits = defineEmits(['handleClick'])
const handleClick = (item, type) => {
    emits('handleClick', {
        item,
        type,
    })
}

const { t } = useI18n();
const token = computed(() => store.state.token);

const props = defineProps({
    activated: false,
    sticky: false,
    from: '',
    innerPage: {
        type: Boolean,
        default: false
    }
})

const activeTab = ref(0);
if (!token.value) {
    activeTab.value = 6
}
if (sessionStorage.getItem(`rec_tab_${props.from}`)) {
    activeTab.value = Number(sessionStorage.getItem(`rec_tab_${props.from}`))
}


// 订阅
const subs = () => {
    store.commit("setMarketWatchKeysByPage");
    store.dispatch("subList", {});
};


const jump = (val) => {
    router.push({
        name: val
    })
}

const ipoRef = ref();
const ipoDataList = computed(() => store.state.ipoDataList || []);
const tabChange = (val) => {
    if (val == 2 && !ipoDataList.value.length) {
        nextTick(() => {
            ipoRef.value && ipoRef.value.init();
        });
    }
    // 缓存
    sessionStorage.setItem(`rec_tab_${props.from}`, val)
    // 订阅最新的列表
    setTimeout(() => {
        let arr = []
        switch (val) {
            case 0: // 自选
                arr = watchList.value
                break
            case 1: // 现货
            case 2: // 合约
                arr = contractList.value
                break
            case 7: // 外汇
                arr = marketForeignList.value
                break
            case 8: // 大宗交易
                arr = marketCommoditiesList.value
                break
        }
        store.dispatch('subList', {
            allKeys: arr.map(item => item.symbol)
        })
    }, 500)
};



// 获取推荐数据
const commendLoading = ref(false);
const contractList = computed(() => store.state.contractList || []);
const commendLoading2 = ref(false);
const marketForeignList = computed(() => store.state.marketForeignList || []);
const commendLoading3 = ref(false);
const marketCommoditiesList = computed(() => store.state.marketCommoditiesList || []);
const watchList = computed(() => store.state.marketWatchList || []);

const getRecommendData = () => {
    commendLoading.value = true;
    commendLoading2.value = true;
    commendLoading3.value = true;
    // 合约
    _futures({
        type: 'crypto'
    })
        .then((res) => {
            if (res.code == 200) {
                const rs = res.data.map((item) => {
                    const target = contractList.value.find(
                        (a) => a.symbol == item.symbol
                    );
                    if (target) {
                        Object.assign(target, item);
                        item = target;
                    }
                    return item;
                });
                store.commit("setContractList", rs || []);
            }
        })
        .finally(() => {
            commendLoading.value = false;
        });

    // 外汇
    _futures({
        type: 'forex'
    }).then((res) => {
        if (res.code == 200) {
            const rs = res.data.map((item) => {
                const target = marketForeignList.value.find(
                    (a) => a.symbol == item.symbol
                );
                if (target) {
                    Object.assign(target, item);
                    item = target;
                }
                return item;
            });
            store.commit("setMarketForeignList", rs || []);

        }
    }).finally(() => {
        commendLoading2.value = false;
    });
    // 大宗商品
    _futures({
        type: 'blocktrade'
    }).then((res) => {
        if (res.code == 200) {
            const rs = res.data.map((item) => {
                const target = marketCommoditiesList.value.find(
                    (a) => a.symbol == item.symbol
                );
                if (target) {
                    Object.assign(target, item);
                    item = target;
                }
                return item;
            });
            store.commit("setMarketCommoditiesList", rs || []);

        }
    }).finally(() => {
        commendLoading3.value = false;
    });
};

const watchListLoading = ref(false);
const getWatchList = () => {
    if (watchListLoading.value) return;
    watchListLoading.value = true;
    _watchlist()
        .then(res => {
            if (res.code == 200) {
                const list = res.data.map(item => {
                    const target = watchList.value.find(a => a.symbol == item.symbol)
                    if (target) return target;
                    return item;
                })
                store.commit("setMarketWatchList", list || []);
                sessionStorage.setItem('market_watch_list', JSON.stringify(list || []))
                setTimeout(() => {
                    store.dispatch('subList', {
                        commitKey: 'setMarketWatchList',
                        listKey: 'marketWatchList'
                    })
                }, 50);
            }
        })
        .catch(err => console.error(err))
        .finally(() => watchListLoading.value = false);
}

const init = () => {
    getRecommendData();
    if (token.value) getWatchList();
}

init()

defineExpose({
    activeTab
})


const filterList = list => {
    if (props.from == 'home') return list.slice(0, 10)
    return list
}
</script>

<style lang="less" scoped>
.home-tab-box-trade {
    // border-radius: 0.32rem;
    min-height: calc(var(--vh) * 100 - 4rem);
}

.home-tabs-box-trade {
    :deep(.van-tabs--line-card-trade) {
        &>.van-tabs__wrap {
            position: relative;

            &::after {
                content: "";
                width: 1rem;
                height: 100%;
                position: absolute;
                right: 1rem;
                top: 0;
                background: linear-gradient(90deg, rgba(14, 15, 24, 0.00) 0%, #0E0F18 100%);
                pointer-events: none;
            }

            &>.van-tabs__nav {
                padding-left: 0.2rem;
                margin-right: 1.1rem;
                height: 0.4rem;

            }
        }
    }
}

.home-tabs-box-inner {
    :deep(.van-tabs--line-card-trade) {
        &>.van-tabs__wrap {
            position: relative;

            &::after {
                display: none;
            }

            &>.van-tabs__nav {
                margin-right: 0.4rem;
            }
        }
    }
}

.home-tabs-box-home {

    :deep(.van-tabs--sub) {
        &>.van-tabs__wrap .van-tabs__nav {

            // padding: 0 0.2rem;
        }
    }

    :deep(.van-tabs--sub) {
        margin-top: 0;
    }


    :deep(.van-tabs__nav) {
        background-color: var(--ex-none);

        .van-tab {
            background-color: #171717;
            color: var(--ex-text-color2);
            min-width: 1.2rem;
            font-size: 0.28rem;
        }

        .van-tab--active {
            color: var(--ex-white) !important;
            background-color: var(--ex-primary-color) !important;
        }
    }

    :deep(.page_ipo) {
        padding-top: 0.32rem;

        .list {
            padding: 0;
        }

        .loading_more {
            display: none;
        }
    }
}
</style>