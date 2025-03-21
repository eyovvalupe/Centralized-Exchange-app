<template>
    <div v-if="loaded" class="home-tabs-box"
        :class="['home-tabs-box-' + props.from, 'home-tabs-box-' + (props.innerPage ? 'inner' : '')]">
        <Tabs :class="[from == 'trade' ? 'van-tabs--top' : '']" :sticky="from == 'trade'"
            :type="from == 'trade' ? '' : ' sub'" :color="'var(--ex-primary-color)'" @change="tabChange"
            v-model:active="activeTab" :animated="from != 'home'" shrink>
            <!-- 股票 -->
            <Tab :name="6" :title="'股票'">
                <StockList :handleClick="props.innerPage ? handleClick : null" v-if="loaded && activeTab == 6" />
            </Tab>

            <!-- 现货 -->
            <Tab :name="1" :title="t('common.spot')">
                <div v-if="loaded && activeTab == 1" :class="['home-tab-box-' + props.from, 'mt-[0.24rem]']">
                    <div class="" style="padding-bottom: 0.2rem;overflow: visible;" v-if="activeTab == 1">
                        <StockItem :handleClick="props.innerPage ? handleClick : null"
                            :page="from == 'home' ? 'home' : ''" :padding="true"
                            :class="[props.from == 'home' ? 'wow fadeInUp' : '']" :data-wow-delay="(0.03 * i) + 's'"
                            :showIcon="true" :item="{ ...item, type: 'spot' }" v-for="(item, i) in filterList(showList)"
                            :key="'c_' + i" menuType="spot" hideMarketTag marketType="spot" page="home" />
                    </div>
                </div>
            </Tab>
            <!-- 合约 -->
            <Tab :name="2" :title="$t('加密货币合约')">
                <div v-if="loaded && activeTab == 2" :class="['home-tab-box-' + props.from, 'mt-[0.24rem]']">
                    <div style="padding-bottom: 0.2rem;" v-if="activeTab == 2">
                        <StockItem :handleClick="props.innerPage ? handleClick : null"
                            :page="from == 'home' ? 'home' : ''" :padding="true"
                            :class="[props.from == 'home' ? 'wow fadeInUp' : '']" :data-wow-delay="(0.03 * i) + 's'"
                            :showIcon="true" :item="item" v-for="(item, i) in filterList(showList)" :key="'c_' + i"
                            menuType="constract" hideMarketTag marketType="crypto" page="home" />
                    </div>
                </div>
            </Tab>
            <!-- 交易机器人 -->
            <Tab :name="3" :title="$t('common.option')">
                <div v-if="loaded && activeTab == 3" :class="['home-tab-box-' + props.from, 'mt-[0.24rem]']">
                    <div style="padding-bottom: 0.2rem;" v-if="activeTab == 3">
                        <StockItem :handleClick="props.innerPage ? handleClick : null"
                            :page="from == 'home' ? 'home' : ''" :padding="true"
                            :class="[props.from == 'home' ? 'wow fadeInUp' : '']" :data-wow-delay="(0.03 * i) + 's'"
                            :showIcon="false" :item="item" v-for="(item, i) in filterList(showList)" :key="'c_' + i"
                            menuType="ai" marketType="ai" page="home" />
                    </div>
                </div>
            </Tab>
            <!-- 外汇 -->
            <Tab :name="7" :title="'外汇'">
                <div v-if="loaded && activeTab == 7" :class="['home-tab-box-' + props.from, 'mt-[0.24rem]']">
                    <div style="padding-bottom: 0.2rem;" v-if="activeTab == 7">
                        <StockItem :handleClick="props.innerPage ? handleClick : null"
                            :page="from == 'home' ? 'home' : ''" :padding="true"
                            :class="[props.from == 'home' ? 'wow fadeInUp' : '']" :data-wow-delay="(0.03 * i) + 's'"
                            :showIcon="true" :item="item" v-for="(item, i) in filterList(showList)" :key="'c_' + i"
                            menuType="foreign" hideMarketTag marketType="crypto" page="home" />
                    </div>
                </div>
            </Tab>
            <!-- 大宗交易 -->
            <Tab :name="8" :title="'大宗交易'">
                <div v-if="loaded && activeTab == 8" :class="['home-tab-box-' + props.from, 'mt-[0.24rem]']">
                    <div style="padding-bottom: 0.2rem;" v-if="activeTab == 8">
                        <StockItem :handleClick="props.innerPage ? handleClick : null"
                            :page="from == 'home' ? 'home' : ''" :padding="true"
                            :class="[props.from == 'home' ? 'wow fadeInUp' : '']" :data-wow-delay="(0.03 * i) + 's'"
                            :showIcon="false" :item="item" v-for="(item, i) in filterList(showList)" :key="'c_' + i"
                            menuType="commodities" hideMarketTag marketType="crypto" page="home" />
                    </div>
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
        <LoadingMore :classN="'trade-more'" :style="{ 'margin-bottom': finish ? '0.4rem' : '1.6rem' }"
            :loading="searchLoading2" :finish="finish" v-if="(finish && showList.length) || !finish" />

    </div>
</template>

<script setup>
import { Tab, Tabs } from "vant";
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue"
import StockItem from "@/components/StockItem.vue";
import { _futures, _stock, _trade, _aiquant2 } from "@/api/api";
import store from "@/store";
import { useI18n } from "vue-i18n";
import router from "@/router";
import StockList from "../components/StockList.vue"
import LoadingMore from "@/components/LoadingMore.vue";
import { useRoute } from "vue-router"


const route = useRoute()
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

const activeTab = ref(6);
const setTab = () => {
    if (!token.value) {
        activeTab.value = 6
    }
    if (route.query.marketType == 'stock') {
        activeTab.value = 6
    }
    else if (route.query.marketType == 'spot') {
        activeTab.value = 1
    }
    else if (route.query.marketType == 'futures') {
        activeTab.value = 2
    }
    else if (route.query.marketType == 'ai') {
        activeTab.value = 3
    }
    else if (route.query.marketType == 'forex') {
        activeTab.value = 7
    }
    else if (route.query.marketType == 'commodities') {
        activeTab.value = 8
    }
}
setTab()
if (sessionStorage.getItem(`rec_tab_${props.from}`)) {
    activeTab.value = Number(sessionStorage.getItem(`rec_tab_${props.from}`))
}

// 股票信息
const item = computed(() => {
    let it = {};
    switch (activeTab.value) {
        case 6: //股票
            it = store.state.currStockItem || {};
            break
        case 1: // 现货
            it = store.state.currSpot || {};
            break;
        case 2: // 合约
            it = store.state.currConstact || {};
            break;
        case 3: // ai
            it = store.state.currAi || {};
            break;
        case 7: // 外汇
            it = store.state.currForeign || {};
            break
        case 8: // 大宗商品
            it = store.state.currCommodities || {};
            break
    }
    return it;
});


const jump = (val) => {
    router.push({
        name: val
    })
}


const tabChange = (val) => {
    activeTab.value = val
    // 缓存
    // store.commit('setMarketTabType', val)
    sessionStorage.setItem(`rec_tab_${props.from}`, val)
    setTimeout(() => {
        initTabList()
    }, 100)
};


// 搜索
const showList = computed(() => {
    switch (activeTab.value) {
        case 1:
            return spotList.value
        case 2:
            return contractList.value
        case 3: // ai
            return marketAiList.value
        case 7:
            return marketForeignList.value
        case 8:
            return marketCommoditiesList.value
        default:
            return []
    }
});
// 订阅
const subs = () => {
    setTimeout(() => {
        console.error('-------', 27)
        store.dispatch("subList", {
            allKeys: showList.value.map(item => item.symbol)
        });
    }, 500)
}
subs()
// 获取推荐数据
const spotList = computed(() => store.state.spotList || []); // 现货列表
const marketAiList = computed(() => store.state.marketAiList || []); // ai量化默认列表
const contractList = computed(() => store.state.contractList || []); // 现货/合约
const marketForeignList = computed(() => store.state.marketForeignList || []); // 外汇
const marketCommoditiesList = computed(() => store.state.marketCommoditiesList || []); // 大宗商品

// 列表数据
const searchLoading2 = ref(false);
const page = ref(1)
const finish = ref(false)
const handleData = (res, more, tab) => {
    let arr = []
    if (more === true) {
        arr = [
            ...showList.value,
            ...res.data
        ]
        if (!res.data || !res.data.length) {
            finish.value = true
        }
    } else {
        arr = (res.data || []).map((item) => {
            const target = showList.value.find(
                (a) => a.symbol == item.symbol,
            );
            if (target)
                return {
                    ...target,
                    ...item,
                };
            return item;
        });
    }
    switch (tab) {
        case 1:
            store.commit("setSpotList", arr);
            break;
        case 2:
            store.commit("setContractList", arr);
            break;
        case 3:
            arr = arr.map(item => {
                item.tradeType = 'ai'
                return item
            })
            store.commit("setMarketAiList", arr);
            break;
        case 7:
            store.commit("setMarketForeignList", arr);
            break;
        case 8:
            store.commit("setMarketCommoditiesList", arr);
            break;
    }

    subs()
}
const initTabList = (more) => {
    searchLoading2.value = true
    if (more === true) {
        page.value++
    } else {
        page.value = 1
        finish.value = false
    }
    const tab = activeTab.value
    if (activeTab.value == 3) { // ai
        _aiquant2({
            type: '',
            name: "",
            page: page.value,
        }).then(res => {
            handleData(res, more, tab)
        }).finally(() => {
            searchLoading2.value = false;
        });
    } else if (activeTab.value == 1) { // 现货
        _trade({
            name: "",
            page: page.value,
        }).then(res => {
            handleData(res, more, tab)
        }).finally(() => {
            searchLoading2.value = false;
        });
    } else if ([2, 7, 8].includes(activeTab.value)) { // 合约下分类
        let type = ''
        switch (tab) {
            case 2:
                type = 'crypto'
                break;
            case 7:
                type = 'forex'
                break;
            case 8:
                type = 'blocktrade'
                break;
        }
        _futures({
            name: "",
            type: type,
            page: page.value,
        })
            .then((res) => {
                handleData(res, more, tab)
            })
            .finally(() => {
                searchLoading2.value = false;
            });
    } else {
        searchLoading2.value = false
    }
};

// 搜索更多数据
const loadMore = () => {
    if (searchLoading2.value || finish.value) return
    initTabList(true)
}






defineExpose({
    activeTab,
    tabChange,
})


watch(route, (val) => {
    if (val.name == "trade" && val.query.marketType) {
        setTab()
        setTimeout(() => {
            tabChange(activeTab.value)
        }, 0)
    } else {
        tabChange(activeTab.value)
    }
}, { immediate: true })


let moreDom = null;
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
const scrolHandle = () => {
    const rect = moreDom.getBoundingClientRect();
    if (rect && rect.top <= totalHeight) {
        // 加载更多
        loadMore()
    }
};
const openedList = (scrollBox) => {
    setTimeout(() => {
        try {
            moreDom = document.querySelector(".trade-more");
            document
                .querySelector(scrollBox)
                .addEventListener("scroll", scrolHandle);
        } catch { }
    }, 1000);
}
const closeList = (scrollBox) => {
    try {
        document
            .querySelector(scrollBox)
            .removeEventListener("scroll", scrolHandle);
    } catch { }
}

const loaded = ref(false)
onMounted(() => {
    if (props.from == 'trade') {
        openedList('.page-trade3')
    }
    setTimeout(() => {
        loaded.value = true
    }, 500)
})
onBeforeUnmount(() => {
    if (props.from == 'trade') {
        closeList('.page-trade3')
    }
    loaded.value = false
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
            padding: 0.12rem 0.16rem;
            border-radius: 1rem;
            height: 0.76rem;
            margin-right: 0.12rem;
            background-color: var(--ex-bg-white1);
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