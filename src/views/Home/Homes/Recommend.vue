<template>
    <div class="home-tabs-box" :class="['home-tabs-box-' + props.from]">
        <Tabs  :type="from == 'trade' ? 'line-card-trade' : 'sub'"
             :color="'var(--ex-primary-color)'" @change="tabChange" v-if="props.activated"
            v-model:active="activeTab" :animated="from != 'home'" shrink>
            <Tab :name="0" v-if="from != 'home'" :title="t('trade.left_mine')">
                <div :class="['home-tab-box-' + props.from, 'mt-[0.24rem]']" :style="{borderTop: '1px solid var(--ex-border-color)'}">
                    <div v-if="token">
                        <Loaidng v-if="watchListLoading" :loading="watchListLoading" />
                        {{ console.log(watchList) }}
                        <div style="padding-bottom: 0.2rem;overflow: visible;" v-if="activeTab == 0 && !watchListLoading">
                            <StockItem :handleClick="props.innerPage ? handleClick : null" :page="from == 'home' ? 'home' : ''" :padding="true" :class="[props.from == 'home' ? 'wow fadeInUp' : '']"
                                :data-wow-delay="(0.03 * i) + 's'" :showIcon="true" :item=item
                                v-for="(item, i) in watchList" :key="'c_' + i" menuType="option" marketType="crypto" />
                        </div>
                        <NoData v-if="!watchListLoading && !watchList.length" />
                    </div>
                    <div v-if="!token" class="flex flex-col pt-[0.32rem] pb-[0.32rem]">

                        <div class="w-full flex justify-between border-b-[0.02rem] pb-[0.2rem] mb-[0.6rem] px-[0.32rem] border-b-color2">
                            <div class="text-color2">{{ $t('copy.copy_order_name') }}</div>
                            <div class="text-color2">{{ $t('market.market_optional_crypto_price') + ' / ' +
                                $t('copy.copy_belong_pl_rate') }}</div>
                        </div>

                        <div style="width: 100%;text-align: center;margin: 0.6rem 0 0.4rem 0;color: var(--ex-placeholder-color);">
                            <div style="width:1.12rem;height:1.12rem;margin: 0 auto 0.2rem auto;">
                                <img v-lazy="getStaticImgUrl('/static/img/user/unlogin-user.png')" alt="">
                            </div>
                            <div>请先登录再查看自选哦</div>
                        </div>
                        <div class="flex justify-center gap-[0.4rem]">
                            <div style="min-width: 2rem;" class="px-[0.28rem] h-[0.8rem] rounded-[0.4rem] bg-[var(--ex-bg-white1)] flex items-center justify-center text-[0.32rem] text-white ripple-primary"
                                @click="jump('login')">{{ $t('trade.stock_opening_token_login') }}</div>
                            <!-- <div class="w-[3rem] h-[0.8rem] rounded-[0.4rem] bg-primary flex items-center justify-center text-[0.32rem] text-white ripple-btn"
                                @click="jump('register')">{{ $t('trade.stock_opening_token_register') }}</div> -->
                        </div>
                    </div>
                </div>
            </Tab>
            <Tab :name="1" :title="t('common.spot')">
                <div :class="['home-tab-box-' + props.from, 'mt-[0.24rem]']" :style="{borderTop: '1px solid var(--ex-border-color)'}">
                    <Loaidng v-if="commendLoading" :loading="commendLoading" />
                    <div class="" style="padding-bottom: 0.2rem;overflow: visible;" v-if="activeTab == 1">
                        <StockItem :handleClick="props.innerPage ? handleClick : null" :page="from == 'home' ? 'home' : ''" :padding="true" :class="[props.from == 'home' ? 'wow fadeInUp' : '']"
                            :data-wow-delay="(0.03 * i) + 's'" :showIcon="true" :item="{ ...item, type: 'spot' }"
                            v-for="(item, i) in contractList" :key="'c_' + i" menuType="spot" marketType="crypto" page="home" />
                    </div>
                    <NoData v-if="!commendLoading && !contractList.length" />
                </div>
            </Tab>
            <Tab :name="2" :title="$t('common.crypto')">
                <div :class="['home-tab-box-' + props.from, 'mt-[0.24rem]']" :style="{borderTop: '1px solid var(--ex-border-color)'}">
                    <Loaidng v-if="commendLoading" :loading="commendLoading" />
                    <div style="padding-bottom: 0.2rem;" v-if="activeTab == 2">
                        <StockItem :handleClick="props.innerPage ? handleClick : null" :page="from == 'home' ? 'home' : ''" :padding="true" :class="[props.from == 'home' ? 'wow fadeInUp' : '']"
                            :data-wow-delay="(0.03 * i) + 's'" :showIcon="true" :item="item"
                            v-for="(item, i) in contractList" :key="'c_' + i" menuType="constract" marketType="crypto" page="home" />
                    </div>
                    <NoData v-if="!commendLoading && !contractList.length" />
                </div>
            </Tab>
            <Tab :name="3" :title="$t('common.option')">
                <div class="pl-[0.32rem] pr-[0.24rem]" :class="['home-tab-box-' + props.from, 'mt-[0.32rem]']">
                    <Ai :handleClick="props.innerPage ? handleClick : null" :from="props.from" page="home" v-if="activeTab == 3" />
                </div>
            </Tab>
            <Tab :name="4" :title="'ETF'">
                <div class="pl-[0.32rem] pr-[0.24rem]" :class="['home-tab-box-' + props.from, 'mt-[0.32rem]']">
                    <Ai :handleClick="props.innerPage ? handleClick : null" :from="props.from" page="home" v-if="activeTab == 4" />
                </div>
            </Tab>
        </Tabs>
    </div>
</template>

<script setup>
import { Tab, Tabs } from "vant";
import { ref, computed, nextTick } from "vue"
import NoData from "@/components/NoData.vue";
import Loaidng from "@/components/Loaidng.vue";
import Ai from "@/views/Market/components/Ai.vue";
import StockItem from "@/components/StockItem.vue";
import { _futures, _stock, _watchlist } from "@/api/api";
import store from "@/store";
import { useI18n } from "vue-i18n";
import router from "@/router";
import { getStaticImgUrl } from "@/utils/index.js"

const emits = defineEmits(['handleClick'])
const handleClick = (item, type) => {
    console.error(item, type)
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
    activeTab.value = 1
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
};



// 获取推荐数据
const commendLoading = ref(false);
const contractList = computed(() => store.state.contractList || []);
const watchList = computed(() => store.state.marketWatchList || []);

const getRecommendData = () => {
    commendLoading.value = true;
    _futures()
        .then((res) => {
            if (res.code == 200) {
                const rs = res.data.map((item) => {
                    const target = contractList.value.find(
                        (a) => a.symbol == item.symbol
                    );
                    item.type = "crypto";
                    if (target) {
                        Object.assign(target, item);
                        item = target;
                    }
                    return item;
                });
                store.commit("setContractList", rs || []);

                subs();

                setTimeout(() => {
                    // console.error(contractList.value)
                })
            }
        })
        .finally(() => {
            commendLoading.value = false;
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

</script>

<style lang="less" scoped>
.home-tab-box-trade {
    // border-radius: 0.32rem;
    min-height: calc(var(--vh) * 100 - 4rem);
}
.home-tabs-box-trade {
    :deep(.van-tabs--line-card-trade) {
        &>.van-tabs__wrap {
            &>.van-tabs__nav {
                padding-left: 0.2rem;
                padding-right: 1.2rem;
            }
        }
    }
}

.home-tabs-box-home {

    
    :deep(.van-tabs--sub) {
        &>.van-tabs__wrap .van-tabs__nav {

            padding: 0 0.32rem;
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