<template>
    <div>
        <!-- 搜索列表 -->
        <BottomPopup @opened="openedList" @close="closeList" round v-model:show="showSearchDialog" position="bottom"
            closeable teleport="body">
            <div class="van-popup-custom-title">
                {{ titleMap[props.activeTab] }}
            </div>
            <div class="search_dialog_trade">
                <!-- 搜索 -->
                <div class="item search_box">
                    <div class="search_icon">
                        <img v-lazy="getStaticImgUrl('/static/img/common/search.svg')" alt="🔍" />
                    </div>
                    <input v-model.trim="searchDialogStr" @keyup="initTabList" type="text" class="ipt"
                        style="width: 100%" :placeholder="t('trade.stock_opening_search')" />
                </div>
                <div class="lists search_dialog_list" v-if="showSearchCon">
                    <StockTable :hideMarketTag="true" :key="props.activeTab" :showIcon="[1, 2, 5].includes(props.activeTab)" theme="classic"
                        :handleClick="handleClick" :type="route.query.tradeType" :loading="false" :list="showList" :from="item.type"/>

                    <LoadingMore :style="{ 'margin-bottom': finish ? '0.4rem' : '1.6rem' }" :loading="searchLoading2"
                        :finish="finish" v-if="(finish && showList.length) || !finish" />
                </div>
            </div>
        </BottomPopup>
    </div>
</template>

<script setup>
import LoadingMore from '@/components/LoadingMore.vue';
import StockTable from '@/components/StockTable.vue';
import BottomPopup from '@/components/BottomPopup.vue';
import { _futures, _basic, _add, _del, _aiquant2, _trade, _stock } from '@/api/api';
import { getStaticImgUrl, _formatNumber } from '@/utils/index.js';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import store from '@/store';

const { t } = useI18n();
const route = useRoute();
const props = defineProps({
    activeTab: '',
    item: {}
})

const titleMap = ref({
    1: '币币',
    2: '加密货币',
    3: '交易机器人',
    4: '股票',
    5: '外汇',
    6: '大宗商品',
});

const emits = defineEmits(['click'])
const handleClick = (item) => {
    emits('click', item)
    showSearchDialog.value = false
}

// 搜索
const showList = computed(() => {
    switch (props.activeTab) {
        case 1:
            return spotList.value;
        case 2:
            return contractList.value;
        case 4: // 股票
            return marketStockList.value;
        case 3: // ai
            return marketAiList.value;
        case 5:
            return marketForeignList.value;
        case 6:
            return marketCommoditiesList.value;
    }
});
// 订阅
const subs = () => {
    setTimeout(() => {
        console.error('-------', 1)
        store.dispatch('subList', {
            allKeys: showList.value.map((item) => item.symbol),
        });
    }, 500);
};

// 列表数据
const spotList = computed(() => store.state.spotList || []);
const marketStockList = computed(() => store.state.marketStockList || []); // 股票列表
const marketAiList = computed(() => store.state.marketAiList || []); // ai量化默认列表
const contractList = computed(() => store.state.contractList || []); // 现货/合约
const marketForeignList = computed(() => store.state.marketForeignList || []); // 外汇
const marketCommoditiesList = computed(
    () => store.state.marketCommoditiesList || [],
); // 大宗商品
// 初始化列表数据
const searchLoading2 = ref(false);
const showSearchDialog = ref(false);
const showSearchCon = ref(false);
watch(
    () => showSearchDialog.value,
    (val) => {
        if (val) {
            showSearchCon.value = val;
        } else {
            setTimeout(() => {
                showSearchCon.value = val;
            }, 300);
        }
    },
);
const searchDialogStr = ref('');
let searhTimeout = null;
const page = ref(1);
const finish = ref(false);
const handleData = (res, more, tab) => {
    let arr = [];
    if (more === true) {
        arr = [...showList.value, ...res.data];
        if (!res.data || !res.data.length) {
            finish.value = true;
        }
    } else {
        arr = (res.data || []).map((item) => {
            const target = showList.value.find((a) => a.symbol == item.symbol);
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
            store.commit('setSpotList', arr);
            break;
        case 2:
            store.commit('setContractList', arr);
            break;
        case 3:
            store.commit('setMarketAiList', arr);
            break;
        case 4:
            store.commit('setMarketStockList', arr);
            break;
        case 5:
            store.commit('setMarketForeignList', arr);
            break;
        case 6:
            store.commit('setMarketCommoditiesList', arr);
            break;
    }

    // 这里如果当前没有item的值 就设置下
    if (!props.item.symbol) {
        const obj = arr[0];
        switch (tab) {
            case 1:
                store.commit('setCurrSpot', obj || {});
                break;
            case 2:
                store.commit('setCurrConstract', obj || {});
                break;
            case 3:
                store.commit('setCurrAi', obj || {});
                break;
            case 4:
                store.commit('setCurrStockItem', obj || {});
                break;
            case 5:
                store.commit('setCurrForeign', obj || {});
                break;
            case 6:
                store.commit('setCurrCommodities', obj || {});
                break;
        }
    }
    subs();
};
const initTabList = (more) => {
    if (searhTimeout) clearTimeout(searhTimeout);
    searhTimeout = setTimeout(() => {
        searchLoading2.value = true;
        if (more === true) {
            page.value++;
        } else {
            page.value = 1;
            finish.value = false;
        }
        const tab = props.activeTab;
        if (tab == 3) {
            // ai
            _aiquant2({
                type: '',
                name: searchDialogStr.value,
                page: page.value,
            })
                .then((res) => {
                    handleData(res, more, tab);
                })
                .finally(() => {
                    searchLoading2.value = false;
                });
        } else if (tab == 4) {
            // 股票
            _stock({
                market: '',
                name: searchDialogStr.value,
                page: page.value,
            })
                .then((res) => {
                    handleData(res, more, tab);
                })
                .finally(() => {
                    searchLoading2.value = false;
                });
        } else if (tab == 1) {
            // 现货
            _trade({
                name: searchDialogStr.value,
                page: page.value,
            })
                .then((res) => {
                    handleData(res, more, tab);
                })
                .finally(() => {
                    searchLoading2.value = false;
                });
        } else {
            // 合约下分类
            let type = '';
            switch (tab) {
                case 2:
                    type = 'crypto';
                    break;
                case 5:
                    type = 'forex';
                    break;
                case 6:
                    type = 'blocktrade';
                    break;
            }
            _futures({
                name: searchDialogStr.value,
                type: type,
                page: page.value,
            })
                .then((res) => {
                    handleData(res, more, tab);
                })
                .finally(() => {
                    searchLoading2.value = false;
                });
        }
    }, 600);
};

// 搜索更多数据
const loadMore = () => {
    if (searchLoading2.value || finish.value) return;
    initTabList(true);
};
let moreDom = null;
const totalHeight =
    window.innerHeight || document.documentElement.clientHeight;
const scrolHandle = () => {
    const rect = moreDom.getBoundingClientRect();
    if (rect && rect.top <= totalHeight) {
        // 加载更多
        loadMore();
    }
};
const openedList = () => {
    setTimeout(() => {
        try {
            moreDom = document.querySelector('.loading_more');
            document
                .querySelector('.search_dialog_list')
                .addEventListener('scroll', scrolHandle);
        } catch { }
    }, 500);
};
const closeList = () => {
    try {
        document
            .querySelector('.search_dialog_list')
            .removeEventListener('scroll', scrolHandle);
    } catch { }
};

const open = () => {
    subs();
    initTabList();
    showSearchDialog.value = true
}
setTimeout(() => {
    initTabList();
}, 500)
defineExpose({
    open,
    initTabList,
    searchDialogStr,
})
</script>

<style lang="less" scoped>
.search_dialog_trade {
    .lists {
        height: calc(var(--vh) * 60);
        overflow-y: auto;
        margin-top: 0.32rem;
    }

    .search_box {
        height: 1rem;
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
</style>