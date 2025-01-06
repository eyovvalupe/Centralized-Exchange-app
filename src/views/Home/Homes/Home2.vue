<!-- 首页模板2 -->
<template>
    <div class="page-home2">
        <!-- 背景 -->
        <div class="home2-bg1">
            <img :src="getStaticImgUrl('/static/home2/bg.png')" alt="">
        </div>
        <div class="home2-bg2">
            <img :src="getStaticImgUrl('/static/home2/bg-shadow.svg')" alt="">
        </div>

        <!-- 内容 -->
        <div class="home2-content">
            <!-- 头部 -->
            <div class="home2-header">
                <div class="icon" @click="jump('user', true)">
                    <img v-if="token" :src="getStaticImgUrl('/static/img/user/avatar2.svg')" alt="">
                    <img v-else :src="getStaticImgUrl('/static/home2/avatar.svg')" alt="">
                </div>
                <div style="flex: 1;"></div>
                <div @click="jump('search')" class="icon icon2" style="margin-right: 0.12rem;">
                    <img :src="getStaticImgUrl('/static/home2/search.svg')" alt="">
                </div>
                <div @click="jump('notification')" class="icon icon2">
                    <img :src="getStaticImgUrl('/static/home2/notice.svg')" alt="">
                </div>
            </div>


            <!-- banner -->
            <view @click="install" class="banners">
                <Swipe class="swipers" :autoplay="3000" indicator-color="white">
                    <SwipeItem class="swiper-item">
                        <img :src="getStaticImgUrl('/static/home2/banner.png')" alt="">
                    </SwipeItem>
                    <SwipeItem class="swiper-item">
                        <img :src="getStaticImgUrl('/static/home2/banner.png')" alt="">
                    </SwipeItem>
                    <SwipeItem class="swiper-item">
                        <img :src="getStaticImgUrl('/static/home2/banner.png')" alt="">
                    </SwipeItem>
                </Swipe>
            </view>

            <!-- 质押挖矿 -->
            <div class="recommend-title">
                <div class="point">
                    <img :src="getStaticImgUrl('/static/home2/point.svg')" alt="">
                </div>
                <div style="flex: 1;">质押挖矿</div>
                <div class="recommend-icon" @click="jump('portfolioIndex', true)">
                    <img :src="getStaticImgUrl('/static/home2/right-line.svg')" alt="">
                </div>
            </div>

            <div class="scroll-box">
                <div class="scroll-con">
                    <MiningItem style="margin-right: 0.32rem;display: inline-block;" v-for="i in 10" :key="i" />
                </div>
            </div>

            <div class="sub-banner">
                <img :src="getStaticImgUrl('/static/home2/subBanner.png')" alt="">
            </div>

            <!-- 跟单 -->
            <div class="recommend-title">
                <div class="point">
                    <img :src="getStaticImgUrl('/static/home2/point.svg')" alt="">
                </div>
                <div style="flex: 1;">跟单</div>
                <div class="recommend-icon">
                    <img :src="getStaticImgUrl('/static/home2/right-line.svg')" alt="">
                </div>
            </div>
            <div>
                <div class="follow-btn">期权</div>
            </div>
            <div class="scroll-box">
                <div class="scroll-con">
                    <FollowItem style="margin-right: 0.32rem;display: inline-block;" v-for="i in 10" :key="i" />
                </div>
            </div>

            <!-- 市场推荐 -->
            <div class="recommend-title" style="margin-top: 0.8rem;">
                <div class="point">
                    <img :src="getStaticImgUrl('/static/home2/point.svg')" alt="">
                </div>
                <div style="flex: 1;">市场推荐</div>
                <div class="recommend-icon">
                    <img :src="getStaticImgUrl('/static/home2/right-line.svg')" alt="">
                </div>
            </div>

            <!-- Tabs -->
            <div class="home-tabs-box">
                <Tabs class="van-tabs--sub" :color="'var(--ex-primary-color)'" @change="tabChange"
                    v-if="!pageLoading && activated" v-model:active="activeTab" animated shrink>
                    <Tab :title="$t('common.stock')">
                        <Loaidng v-if="commendLoading" :loading="commendLoading" />
                        <div style="padding-bottom: 0.2rem;">
                            <StockItem :item="item" v-for="(item, i) in marketStockCurrentList" :key="'s_' + i"
                                page="home" />
                        </div>
                        <NoData v-if="!commendLoading && !marketStockCurrentList.length" />
                    </Tab>
                    <Tab :title="$t('common.crypto')">
                        <Loaidng v-if="commendLoading" :loading="commendLoading" />
                        <div style="padding-bottom: 0.2rem;">
                            <StockItem :item="item" v-for="(item, i) in contractList" :key="'c_' + i"
                                marketType="crypto" page="home" />
                        </div>
                        <NoData v-if="!commendLoading && !contractList.length" />
                    </Tab>
                    <Tab :title="$t('common.IPO')">
                        <div>
                            <IPO ref="ipoRef" :page="'home'" />
                        </div>
                    </Tab>
                    <Tab :title="$t('common.AI')">
                        <div class="mx-[0.32rem] mt-[0.32rem]">
                            <Ai page="home" />
                        </div>
                    </Tab>
                </Tabs>
            </div>


            <!-- ad -->
            <div class="ad">

                <div class="ad-bg"
                    :style="{ 'background-image': `url(${getStaticImgUrl('/static/home2/ad-bg.svg')})` }"></div>
                <div class="ad-content">
                    <div class="title">开启你的交易之旅</div>
                    <div>创造财富之路</div>
                    <div class="btn">去交易</div>
                </div>

                <div class="ad-tip">
                    <img :src="getStaticImgUrl('/static/home2/ad-tip.png')" alt="">
                </div>
            </div>

        </div>
    </div>

    <!-- 类型选择弹窗 -->
    <ActionSheet v-model:show="showAS" :actions="actions" @select="onSelect" :title="$t('home.fastTrading')">
    </ActionSheet>
    <NotifiModal />
</template>

<script setup>
import { Tab, Tabs, ActionSheet, Swipe, SwipeItem } from "vant";
import { computed, onActivated, onDeactivated, ref, onMounted } from "vue";
import { getStaticImgUrl } from "@/utils/index.js"
import router from "@/router";
import store from "@/store";
import { useI18n } from "vue-i18n";
import NoData from "@/components/NoData.vue";
import Loaidng from "@/components/Loaidng.vue";
import Ai from "@/views/Market/components/Ai.vue";
import IPO from "@/views/Market/components/IPO.vue";
import StockItem from "@/components/StockItem.vue";
import { _sort, _watchlistDefault, _futures } from "@/api/api";
import { useSocket } from "@/utils/ws";
import SparkLine from "@/components/SparkLine.vue";
import NotifiModal from "@/views/Notification/NotifiModal.vue";
import MiningItem from "../Mining/MiningItem.vue"
import FollowItem from "../Follow/FollowItem.vue"


// 安装
const install = () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
    });
}

const { startSocket } = useSocket();
const { t } = useI18n();
const activeTab = ref(0);
const token = computed(() => store.state.token || "");
// 总资产
const assets = computed(() => store.state.assets || {});
const showPassword = ref(false)


// 预加载页面
const pageLoading = computed(() => store.state.pageLoading);
store.commit("setPageLoading", true);

Promise.all([
    import("@/views/Market/MarketInfo.vue"),
    import("@/views/Market/Search.vue"),
    import("@/views/Public/Login.vue"),
    import("@/views/assets/TopUpCrypto.vue"),
]).finally(() => {
    store.commit("setPageLoading", false);
});


const ipoRef = ref();
const ipoDataList = computed(() => store.state.ipoDataList || []);
const tabChange = (val) => {
    if (val == 2 && !ipoDataList.value.length) {
        nextTick(() => {
            ipoRef.value && ipoRef.value.init();
        });
    }
};

// 订阅
const subs = () => {
    store.commit("setMarketWatchKeysByPage");
    store.dispatch("subList", {});
};

const activated = ref(false);
onActivated(() => {
    store.commit("setMarketWatchKeys", []);
    activated.value = true;
    subs();
});
onDeactivated(() => {
    activated.value = false;
    // 取消订阅
    const socket = startSocket(() => {
        socket && socket.emit("realtime", ""); // 价格变化
        socket && socket.emit("snapshot", ""); // 快照数据
        socket && socket.off("realtime");
        socket && socket.off("snapshot");
    });
});

// 获取推荐数据
const commendLoading = ref(false);
const contractList = computed(() => store.state.contractList || []);
const marketStockCurrentList = computed(
    () => {
        return store.getters.getMarketStockCurrentList.map(item => {
            return { ...item, type: 'stock' }
        })
    }
);
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
                    console.error(contractList.value)
                })
            }
        })
        .finally(() => {
            commendLoading.value = false;
        });
};
getRecommendData();


// 热门数据
const marketSrockRecommendList = computed(() => store.state.marketSrockRecommendList || [])
const marketContractRecommendList = computed(() => store.state.marketContractRecommendList || [])
const recommendLoading = ref(false);
const openRecommendList = () => {
    if (!marketSrockRecommendList.value.length || !marketContractRecommendList.value.length) {
        recommendLoading.value = true;
    }
    _watchlistDefault()
        .then((res) => {
            if (res.code == 200) {
                // 股票
                if (res.data?.stock) {
                    const newarr = res.data.stock.map((item) => {
                        const target = store.state.marketSrockRecommendList.find(
                            (a) => a.symbol == item.symbol
                        );
                        return target || item;
                    });
                    const arr = newarr.map((item) => {
                        return { ...item, type: "stock" };
                    });
                    store.commit("setMarketSrockRecommendList", arr || []);
                }

                // 合约
                if (res.data?.crypto) {
                    const newarr2 = res.data.crypto.map((item) => {
                        const target = store.state.marketContractRecommendList.find(
                            (a) => a.symbol == item.symbol
                        );
                        return target || item;
                    });
                    const arr2 = newarr2.map((item) => {
                        return { ...item, type: "crypto" };
                    });
                    store.commit("setMarketContractRecommendList", arr2 || []);
                }
                subs();
            }
        })
        .finally(() => {
            recommendLoading.value = false;
        });
};
setTimeout(() => {
    openRecommendList()
}, 1000)

// 打开添加类型选择弹窗
const showAS = ref(false);
const actions = [
    { name: t("common.stock"), value: "0" },
    { name: t("common.crypto"), value: "-1" },
    { name: t("common.IPO"), value: "1" },
];
const onSelect = (item) => {
    showAS.value = false;
    if (item.value == -1) return;
    setTimeout(() => {
        router.push({
            name: "trade",
            query: {
                page: "home",
                pageType: item.value,
            },
        });
    }, 300)
};

// 跳转
const jump = (name, needToken) => {
    if (needToken && !token.value) return store.commit("setIsLoginOpen", true);

    router.push({
        name,
    });
};

onMounted(() => {
    store.commit("setMarketWatchKeys", []);
    activated.value = true;
    subs();
});
</script>


<style lang="less" scoped>
.page-home2 {
    background-color: #171717;
    min-height: 100%;
    position: relative;
    overflow: hidden;


    .home2-bg1 {
        position: absolute;
        width: 100%;
        height: auto;
        z-index: 0;
        top: -0.02rem;
        left: 0;
        filter: blur(0.8rem);
        opacity: 0.8;

        img {
            object-fit: cover;
        }
    }

    .home2-bg2 {
        position: absolute;
        width: 3.5rem;
        height: auto;
        z-index: 0;
        top: 0;
        left: 0;
    }

    .home2-content {
        position: relative;
        z-index: 1;
        padding: 0 0.32rem 2rem 0.32rem;
        display: flex;
        flex-direction: column;


        .home2-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.08rem 0;

            .icon {
                width: 0.72rem;
                height: 0.72rem;
                border-radius: 50%;
                background-color: var(--ex-bg-color3);
            }

            .icon2 {
                padding: 0.16rem;
            }
        }

        .banners {
            margin: 0.32rem 0;

            .swipers {
                width: 100%;
                height: 100%;
                position: relative;

                .swiper-item {
                    overflow: hidden;
                    border-radius: 0.32rem;
                }

                :deep(.van-swipe__indicators) {
                    .van-swipe__indicator {
                        width: 0.12rem;
                        height: 0.12rem;
                        border-radius: 0.04rem !important;
                        background-color: var(--ex-placeholder-color) !important;
                    }

                    .van-swipe__indicator--active {
                        background-color: var(--ex-white) !important;
                    }

                }

                :deep(.van-swipe__indicators) {
                    right: 0.2rem !important;
                    left: auto !important;
                    transform: translateX(0) !important;
                }
            }
        }

        .sub-banner {
            width: 100%;
            height: 2.54rem;
            margin: 0.04rem 0 0.4rem 0;
        }

        .scroll-box {
            width: calc(100% + 0.32rem);
            overflow-x: auto;
            margin-bottom: 0.32rem;
            padding-right: 0.32rem;

            .scroll-con {
                white-space: nowrap;
            }
        }

        .follow-btn {
            display: inline-flex;
            margin-bottom: 0.24rem;
            height: 0.76rem;
            border-radius: 1rem;
            background-color: var(--ex-primary-color);
            padding: 0 0.32rem;
            align-items: center;
            justify-content: center;
            color: var(--ex-white);
            font-size: 0.28rem;
        }

        .recommend-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: var(--ex-white);
            font-size: 0.4rem;
            font-weight: 500;
            margin-bottom: 0.32rem;

            .point {
                width: 0.28rem;
                height: 0.28rem;
                margin-right: 0.2rem;
            }

            .recommend-icon {
                width: 0.48rem;
                height: 0.48rem;
                position: relative;
                top: 0.02rem;
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
                    color: var(--ex-black);
                    background-color: var(--ex-white);
                }
            }

            :deep(.page_ipo) {
                padding-top: 0.32rem;

                .loading_more {
                    display: none;
                }
            }
        }

        .ad {
            width: 100%;
            height: 3.5rem;
            margin-top: 0.2rem;
            font-size: 0.32rem;
            font-style: normal;
            font-weight: 400;
            color: #fff;
            line-height: normal;
            border-radius: 0.32rem;
            position: relative;
            overflow: hidden;
            box-shadow: 0px 4px 10px 0px rgba(151, 225, 128, 0.15);
            background: linear-gradient(0deg, #1C1C1C 0%, #2E2E2E 95.61%);

            .ad-bg {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 0;
                width: 100%;
                height: 100%;
            }

            .ad-content {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 1;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;
                padding: 0.4rem 0.32rem;


            }

            .ad-tip {
                position: absolute;
                width: 3rem;
                height: auto;
                right: 0;
                bottom: 0;
            }

            .title {
                font-size: 0.48rem;
                font-weight: 600;
                margin-bottom: 0.12rem;
            }

            .btn {
                padding: 0 0.56rem;
                height: 0.8rem;
                border-radius: 1rem;
                background-color: var(--ex-primary-color);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.3rem;
                color: var(--ex-black);
                margin-top: 0.4rem;
            }
        }
    }
}
</style>