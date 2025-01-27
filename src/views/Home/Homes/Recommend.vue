<template>
    <div class="home-tabs-box" :class="['home-tabs-box-' + props.from]">
        <Tabs :offset-top="'1.32rem'" class="van-tabs--sub" :class="[props.from == 'trade' ? 'van-tabs--sub_line' : '']" :sticky="props.sticky" :color="'var(--ex-primary-color)'" @change="tabChange"
            v-if="$props.activated" v-model:active="activeTab" animated shrink>
            <Tab :name="0" :title="t('common.spot')">
               <div class="pl-[0.32rem] pr-[0.32rem] mt-[0.32rem]">
                <Loaidng v-if="commendLoading" :loading="commendLoading" />
                <div style="padding-bottom: 0.2rem;overflow: visible;" v-if="activeTab == 0">
                    <StockItem :class="[props.from == 'home' ? 'wow fadeInUp': '']" :data-wow-delay="(0.03 * i) + 's'" :showIcon="true" :item="{...item, type: 'spot'}"
                        v-for="(item, i) in contractList" :key="'c_' + i" marketType="crypto" page="home" />
                </div>
                <NoData v-if="!commendLoading && !contractList.length" />
               </div>
            </Tab>
            <Tab :name="1" :title="$t('common.crypto')">
                <div class="pl-[0.32rem] pr-[0.32rem] mt-[0.32rem]">
                    <Loaidng v-if="commendLoading" :loading="commendLoading" />
                <div style="padding-bottom: 0.2rem;" v-if="activeTab == 1">
                    <StockItem :class="[props.from == 'home' ? 'wow fadeInUp': '']" :data-wow-delay="(0.03 * i) + 's'" :showIcon="true" :item="item"
                        v-for="(item, i) in contractList" :key="'c_' + i" marketType="crypto" page="home" />
                </div>
                <NoData v-if="!commendLoading && !contractList.length" />
                </div>
            </Tab>
            <Tab :name="3" :title="$t('common.option')">
                <div class="pl-[0.32rem] pr-[0.32rem] mt-[0.32rem]">
                    <Ai :from="props.from" page="home" v-if="activeTab == 3" />
                </div>
            </Tab>
            <Tab :name="4" :title="'ETF'">
                <div class="pl-[0.32rem] pr-[0.32rem] mt-[0.32rem]">
                    <Ai :from="props.from" page="home" v-if="activeTab == 4" />
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
import { _futures } from "@/api/api";
import store from "@/store";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps({
    activated: false,
    sticky: false,
    from: ''
})

const activeTab = ref(0);

// 订阅
const subs = () => {
    store.commit("setMarketWatchKeysByPage");
    store.dispatch("subList", {});
};


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
getRecommendData();


defineExpose({
    activeTab
})

</script>

<style lang="less" scoped>
.home-tabs-box-trade {
    :deep(.van-tabs--line) {
        .van-sticky > div > .van-tabs__wrap .van-tabs__nav {
            padding: 0 0.32rem;
        }
    }
}
.home-tabs-box-home {
    :deep(.van-tabs--sub) {
        & > .van-tabs__wrap .van-tabs__nav {
            padding: 0 0.32rem;
        }
    }
}
.home-tabs-box {
    :deep(.van-tabs--sub) {
        margin-top: 0;
    }

    :deep(.van-tabs__nav) {
        background-color: var(--ex-none);

        .van-tab {
            background-color: #171717;
            color: var(--ex-text-color2);
            min-width: 1.2rem;
            border-color: #414345;
        }

        .van-tab--active {
            color: var(--ex-white);
            background-color: var(--ex-primary-color);
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