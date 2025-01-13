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
            <view @click="install" class="banners wow fadeInUp">
                <Swipe class="swipers" :autoplay="3000" indicator-color="white">
                    <SwipeItem class="swiper-item">
                        <img :src="getStaticImgUrl('/static/home2/banner1.png')" alt="">
                    </SwipeItem>
                    <SwipeItem class="swiper-item">
                        <img :src="getStaticImgUrl('/static/home2/banner2.png')" alt="">
                    </SwipeItem>
                </Swipe>
            </view>

            <!-- 质押挖矿 -->
            <div class="recommend-title">
                <div class="point wow slideInLeft">
                    <img :src="getStaticImgUrl('/static/home2/point.svg')" alt="">
                </div>
                <div class="wow slideInLeft" style="flex: 1;">{{ t('finance.portfolio_title') }}</div>
                <div class="recommend-icon wow slideInRight" @click="jump('finance', true, 1)">
                    <img :src="getStaticImgUrl('/static/home2/right-line.svg')" alt="">
                </div>
            </div>

            <div class="scroll-box">
                <div class="scroll-con">
                    <MiningItem class="wow fadeInRight" :data-wow-delay="(0.3 + 0.5 * i) + 's'" style="margin-right: 0.32rem;display: inline-block;" v-for="i in 10" :key="i" />
                </div>
            </div>

            <div class="sub-banner wow fadeInUp">
                <img :src="getStaticImgUrl('/static/home2/subBanner.png')" alt="">
            </div>
            <!-- 跟单 -->
            <div  class="recommend-title" @click="jump('follow', false)">
                <div class="point wow slideInLeft">
                    <img :src="getStaticImgUrl('/static/home2/point.svg')" alt="">
                </div>
                <div class="wow slideInLeft" style="flex: 1;">{{ t('copy.title') }}</div>
                <div class="recommend-icon wow slideInRight">
                    <img :src="getStaticImgUrl('/static/home2/right-line.svg')" alt="">
                </div>
            </div>
            <div>
                <div class="follow-btn wow slideInLeft">{{ t('copy.copy_option') }}</div>
            </div>
            <div class="scroll-box">
                <div class="scroll-con">
                    <div class="scroll-item-follow" v-for="(item, i) in followList" :key="i">
                        <FollowItem class="wow fadeInRight" :data-wow-delay="(0.3 + 0.5 * i) + 's'" :item="item" />
                    </div>
                </div>
            </div>

            <!-- 市场推荐 -->
            <div class="recommend-title" style="margin-top: 0.8rem;">
                <div class="point wow slideInLeft">
                    <img :src="getStaticImgUrl('/static/home2/point.svg')" alt="">
                </div>
                <div class="wow slideInLeft" style="flex: 1;">{{ t('home.market_trend') }}</div>
                <div class="recommend-icon wow slideInRight">
                    <img :src="getStaticImgUrl('/static/home2/right-line.svg')" alt="">
                </div>
            </div>

            <!-- Tabs -->
            <div class="home-tabs-box">
                <Tabs class="van-tabs--sub" :color="'var(--ex-primary-color)'" @change="tabChange"
                    v-if="!pageLoading && activated" v-model:active="activeTab" animated shrink>
                    <Tab :title="$t('common.stock')">
                        <Loaidng v-if="commendLoading" :loading="commendLoading" />
                        <div style="padding-bottom: 0.2rem;" v-if="activeTab == 0">
                            <StockItem class="wow fadeInUp" :data-wow-delay="(0.05 * i) + 's'" :showIcon="true" :item="item" v-for="(item, i) in marketStockCurrentList"
                                :key="'s_' + i" page="home" />
                        </div>
                        <NoData v-if="!commendLoading && !marketStockCurrentList.length" />
                    </Tab>
                    <Tab :title="$t('common.crypto')">
                        <Loaidng v-if="commendLoading" :loading="commendLoading" />
                        <div style="padding-bottom: 0.2rem;" v-if="activeTab == 1">
                            <StockItem class="wow fadeInUp" :data-wow-delay="(0.05 * i) + 's'" :showIcon="true" :item="item" v-for="(item, i) in contractList" :key="'c_' + i"
                                marketType="crypto" page="home" />
                        </div>
                        <NoData v-if="!commendLoading && !contractList.length" />
                    </Tab>
                    <Tab :title="$t('common.IPO')">
                        <div class="mb-[0.2rem]" >
                            <IPO ref="ipoRef" v-if="activeTab == 2" :page="'home'" />
                        </div>
                    </Tab>
                    <Tab :title="$t('common.AI')">
                        <div class="mt-[0.32rem]">
                            <Ai page="home" v-if="activeTab == 3" />
                        </div>
                    </Tab>
                </Tabs>
            </div>


            <!-- ad -->
            <div class="ad wow fadeInUp">

                <div class="ad-bg"
                    :style="{ 'background-image': `url(${getStaticImgUrl('/static/home2/ad-bg.svg')})` }"></div>
                <div class="ad-content">
                    <div class="title">{{ t('home.ad_title') }}</div>
                    <div>{{ t('home.ad_con') }}</div>
                    <div class="btn">{{ t('home.ad_btn') }}</div>
                </div>
                <div class="ad-tip">
                    <img :src="getStaticImgUrl('/static/home2/ad-tip.png')" alt="">
                </div>
            </div>

            <!-- links -->
            <div class="links">
                <div class="link-item wow slideInLeft">
                    <div class="item-img">
                        <img :src="getStaticImgUrl('/static/home2/link1.png')" alt="">
                    </div>
                    <div>TheSantumNe...</div>
                </div>
                <div class="link-item wow slideInRight">
                    <div class="item-img">
                        <img :src="getStaticImgUrl('/static/home2/link2.png')" alt="">
                    </div>
                    <div>KEEPOFFTHE...</div>
                </div>
                <div class="link-item wow slideInLeft">
                    <div class="item-img">
                        <img :src="getStaticImgUrl('/static/home2/link3.png')" alt="">
                    </div>
                    <div>AIORBIT</div>
                </div>
                <div class="link-item wow slideInRight">
                    <div class="item-img">
                        <img :src="getStaticImgUrl('/static/home2/link4.png')" alt="">
                    </div>
                    <div>GodsUnchained...</div>
                </div>
                <div class="link-item wow slideInLeft">
                    <div class="item-img">
                        <img :src="getStaticImgUrl('/static/home2/link5.png')" alt="">
                    </div>
                    <div>PudgyRods</div>
                </div>
                <div class="link-item wow slideInRight">
                    <div class="item-img">
                        <img :src="getStaticImgUrl('/static/home2/link6.png')" alt="">
                    </div>
                    <div>Azuki</div>
                </div>
            </div>


            <!-- 市场推荐 -->
            <div class="recommend-title" style="margin-top: 0.36rem;">
                <div class="point wow slideInLeft">
                    <img :src="getStaticImgUrl('/static/home2/point.svg')" alt="">
                </div>
                <div class="wow slideInLeft" style="flex: 1;">{{ t('home.news') }}</div>
                <div class="recommend-icon wow slideInRight">
                    <img :src="getStaticImgUrl('/static/home2/right-line.svg')" alt="">
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
import NotifiModal from "@/views/Notification/NotifiModal.vue";
import MiningItem from "../Mining/MiningItem.vue"
import FollowItem from "../components/FollowItem.vue"
import Wow from "wow.js"
import 'wow.js/css/libs/animate.css';  // 引入动画库样式


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
const jump = (name, needToken, query) => {
    if (needToken && !token.value) return store.commit("setIsLoginOpen", true);

    router.push({
        name,
        query: {
            activeTab: query
        }
    });
};

onMounted(() => {
    store.commit("setMarketWatchKeys", []);
    activated.value = true;
    subs();

    const wow = new Wow({
        boxClass: 'wow',
        animateClass: 'animated',
        mobile: true,
        live: true,
        scrollContainer: '.app_scroll'
    })
    wow.init()
});


// 跟单列表
store.dispatch('updateFollowList')
// const followList = computed(() => store.state.followList || [])
const time = "0.00,6.00 0.07,6.06 0.13,5.92 0.20,6.21 0.27,5.90 0.33,6.71 0.40,6.53 0.47,7.01 0.54,6.95 0.60,6.92 0.67,7.36 0.74,7.18 0.80,7.13 0.87,6.76 0.94,7.03 1.00,7.04 1.07,7.18 1.14,7.98 1.21,8.02 1.27,8.03 1.34,7.36 1.41,7.97 1.47,8.01 1.54,8.08 1.61,8.08 1.67,8.11 1.74,8.04 1.81,8.04 1.88,7.58 1.94,8.19 2.01,8.18 2.08,7.86 2.14,7.45 2.21,7.92 2.28,7.98 2.34,7.90 2.41,8.39 2.48,8.28 2.55,6.92 2.61,6.64 2.68,7.10 2.75,6.93 2.81,7.39 2.88,7.12 2.95,6.68 3.01,6.91 3.08,6.68 3.15,7.15 3.22,6.91 3.28,6.90 3.35,6.82 3.42,6.38 3.48,6.63 3.55,6.87 3.62,6.71 3.68,6.46 3.75,6.06 3.82,6.16 3.89,6.28 3.95,6.08 4.02,6.34 4.09,6.61 4.15,6.55 4.22,5.89 4.29,6.32 4.35,6.29 4.42,6.30 4.49,5.54 4.56,6.19 4.62,7.54 4.69,7.20 4.76,7.88 4.82,8.28 4.89,8.24 4.96,7.92 5.02,6.76 5.09,6.84 5.16,6.59 5.23,6.47 5.29,6.02 5.36,7.00 5.43,7.26 5.49,6.41 5.56,3.08 5.63,5.78 5.69,5.67 5.76,6.26 5.83,5.42 5.90,5.87 5.96,5.38 6.03,5.08 6.10,5.68 6.16,6.03 6.23,6.05 6.30,5.68 6.36,5.52 6.43,6.29 6.50,5.89 6.57,4.71 6.63,5.22 6.70,5.03 6.77,5.21 6.83,5.13 6.90,5.24 6.97,5.75 7.03,6.08 7.10,6.08 7.17,5.94 7.23,5.71 7.30,6.26 7.37,5.95 7.44,6.81 7.50,7.22 7.57,6.99 7.64,7.06 7.70,6.87 7.77,6.88 7.84,7.30 7.90,7.77 7.97,6.93 8.04,6.24 8.11,5.15 8.17,4.78 8.24,4.57 8.31,5.04 8.37,4.45 8.44,4.54 8.51,4.69 8.57,4.77 8.64,4.85 8.71,4.84 8.78,5.02 8.84,5.24 8.91,4.79 8.98,4.61 9.04,4.68 9.11,4.82 9.18,4.67 9.24,5.34 9.31,5.62 9.38,5.92 9.45,5.96 9.51,6.37 9.58,6.63 9.65,7.18 9.71,7.18 9.78,7.08 9.85,7.13 9.91,7.13 9.98,7.14 10.05,7.14 10.12,7.32 10.18,7.32 10.25,7.59 10.32,7.69 10.38,7.80 10.45,7.63 10.52,8.64 10.58,8.11 10.65,7.87 10.72,7.86 10.79,7.82 10.85,7.80 10.92,7.29 10.99,7.47 11.05,7.12 11.12,6.99 11.19,6.00 11.25,4.41 11.32,3.55 11.39,3.27 11.46,2.22 11.52,2.87 11.59,3.13 11.66,3.16 11.72,1.51 11.79,1.71 11.86,1.32 11.92,1.62 11.99,1.23 12.06,0.00 12.13,1.15 12.19,2.98 12.26,3.11 12.33,3.22 12.39,3.52 12.46,3.80 12.53,4.60 12.59,4.66 12.66,5.04 12.73,5.91 12.80,5.65 12.86,6.04 12.93,6.80 13.00,6.81 13.06,6.79 13.13,6.71 13.20,7.03 13.26,7.04 13.33,6.64 13.40,7.16 13.47,6.61 13.53,7.05 13.60,7.00 13.67,6.52 13.73,7.07 13.80,6.98 13.87,7.34 13.93,7.26 14.00,7.60 14.07,7.52 14.13,7.60 14.20,7.58 14.27,7.20 14.34,7.32 14.40,7.40 14.47,7.00 14.54,8.12 14.60,8.32 14.67,8.46 14.74,8.11 14.80,8.03 14.87,8.04 14.94,8.06 15.01,8.03 15.07,7.49 15.14,7.87 15.21,7.96 15.27,8.07 15.34,8.72 15.41,8.47 15.47,8.44 15.54,8.08 15.61,8.92 15.68,8.04 15.74,7.96 15.81,8.35 15.88,8.48 15.94,9.04 16.01,9.52 16.08,8.71 16.14,9.29 16.21,9.29 16.28,9.29 16.35,9.02 16.41,10.00 16.48,9.37 16.55,10.10 16.61,9.31 16.68,10.04 16.75,9.45 16.81,8.61 16.88,9.48 16.95,8.58 17.02,8.80 17.08,8.50 17.15,8.44 17.22,7.52 17.28,6.84 17.35,7.70 17.42,6.98 17.48,7.59 17.55,7.57 17.62,6.96 17.69,7.58 17.75,7.50 17.82,7.65 17.89,7.90 17.95,7.91 18.02,8.29 18.09,8.26 18.15,8.28 18.22,8.35 18.29,7.89 18.36,8.64 18.42,8.65 18.49,8.77 18.56,8.75 18.62,8.75 18.69,8.75 18.76,8.73 18.82,8.70 18.89,8.62 18.96,8.90 19.03,9.08 19.09,8.70 19.16,8.64 19.23,8.51 19.29,8.55 19.36,8.65 19.43,8.57 19.49,8.48 19.56,7.85 19.63,8.63 19.70,8.20 19.76,8.92 19.83,8.92 19.90,8.91 19.96,8.97 20.03,9.00 20.10,8.22 20.16,8.66 20.23,8.51 20.30,8.91 20.37,9.16 20.43,8.95 20.50,8.95 20.57,9.21 20.63,8.67 20.70,8.50 20.77,8.38 20.83,8.36 20.90,8.33 20.97,7.85 21.03,7.98 21.10,8.91 21.17,8.62 21.24,8.88 21.30,9.75 21.37,9.66 21.44,9.63 21.50,9.11 21.57,10.00 21.64,9.92 21.70,8.90 21.77,9.68 21.84,9.71 21.91,9.68 21.97,9.71 22.04,9.87 22.11,9.82 22.17,9.64 22.24,9.42 22.31,9.17 22.37,8.67 22.44,7.91 22.51,8.57 22.58,8.63 22.64,7.82 22.71,7.54 22.78,7.81 22.84,8.59 22.91,8.61 22.98,8.30 23.04,8.37 23.11,8.70 23.18,8.94 23.25,9.35 23.31,9.25 23.38,9.92 23.45,9.96 23.51,9.97 23.58,9.91 23.65,10.44 23.71,10.18 23.78,10.68 23.85,10.01 23.92,7.87 23.98,8.32 24.05,8.30 24.12,7.93 24.18,6.75 24.25,7.69 24.32,7.21 24.38,7.93 24.45,7.75 24.52,8.18 24.59,8.21 24.65,8.39 24.72,8.58 24.79,8.13 24.85,8.89 24.92,9.07 24.99,9.07 25.05,8.90 25.12,9.34 25.19,9.47 25.26,9.40 25.32,9.68 25.39,9.31 25.46,8.89 25.52,8.67 25.59,8.48 25.66,8.55 25.72,8.49 25.79,7.51 25.86,7.41 25.93,7.28 25.99,7.99 26.06,8.01 26.13,7.93 26.19,7.65 26.26,8.35 26.33,8.97 26.39,8.98 26.46,9.18 26.53,9.45 26.60,8.89 26.66,9.05 26.73,8.89 26.80,9.50 26.86,10.11 26.93,10.10 27.00,10.28 27.06,9.56 27.13,9.58 27.20,9.47 27.27,10.52 27.33,10.21 27.40,10.52 27.47,10.03 27.53,10.98 27.60,10.45 27.67,10.69 27.73,10.85 27.80,11.39 27.87,11.10 27.93,11.47 28.00,11.59 28.07,11.81 28.14,11.35 28.20,12.18 28.27,12.34 28.34,12.35 28.40,11.47 28.47,12.39 28.54,12.32 28.60,12.40 28.67,11.59 28.74,12.81 28.81,13.01 28.87,13.01 28.94,13.00 29.01,13.00 29.07,12.96 29.14,12.68 29.21,12.74 29.27,11.88 29.34,11.88 29.41,12.05 29.48,13.09 29.54,12.97 29.61,13.10 29.68,13.00 29.74,11.66 29.81,12.50 29.88,12.40 29.94,12.55 30.01,11.95 30.08,12.81 30.15,12.36 30.21,13.14 30.28,14.65 30.35,15.21 30.41,14.87 30.48,14.92 30.55,14.88 30.61,15.14 30.68,15.01 30.75,14.78 30.82,15.09 30.88,14.84 30.95,15.06 31.02,14.91 31.08,14.84 31.15,14.82 31.22,15.42 31.28,15.43 31.35,15.36 31.42,15.06 31.49,15.49 31.55,14.88 31.62,15.53 31.69,15.42 31.75,15.31 31.82,15.17 31.89,14.97 31.95,15.40 32.02,14.20 32.09,14.70 32.16,14.33 32.22,14.29 32.29,14.50 32.36,14.17 32.42,14.22 32.49,14.48 32.56,13.08 32.62,13.32 32.69,13.58 32.76,13.54 32.83,13.37 32.89,13.62 32.96,14.26 33.03,13.77 33.09,14.34 33.16,13.93 33.23,13.91 33.29,14.32 33.36,14.13 33.43,13.98 33.50,14.19 33.56,13.91 33.63,13.87 33.70,14.24 33.76,14.08 33.83,13.98 33.90,13.67 33.96,14.81 34.03,13.89 34.10,13.64 34.17,14.39 34.23,13.40 34.30,13.97 34.37,14.05 34.43,14.34 34.50,14.55 34.57,14.72 34.63,14.74 34.70,14.18 34.77,14.46 34.83,14.46 34.90,14.53 34.97,14.39 35.04,14.33 35.10,14.21 35.17,14.07 35.24,14.48 35.30,13.24 35.37,13.25 35.44,13.41 35.50,13.60 35.57,14.22 35.64,14.36 35.71,14.31 35.77,14.02 35.84,14.05 35.91,14.16 35.97,13.54 36.04,13.60 36.11,14.66 36.17,14.36 36.24,14.68 36.31,14.37 36.38,14.15 36.44,14.65 36.51,14.44 36.58,14.77 36.64,14.78 36.71,14.81 36.78,15.09 36.84,15.05 36.91,14.72 36.98,14.66 37.05,14.30 37.11,14.33 37.18,13.53 37.25,13.96 37.31,14.22 37.38,13.40 37.45,12.79 37.51,13.43 37.58,13.71 37.65,13.23 37.72,12.64 37.78,12.93 37.85,12.56 37.92,12.49 37.98,11.97 38.05,12.58 38.12,12.40 38.18,12.36 38.25,12.65 38.32,12.71 38.39,12.58 38.45,11.68 38.52,11.44 38.59,13.25 38.65,13.25 38.72,16.71 38.79,16.29 38.85,16.33 38.92,16.37 38.99,16.62 39.06,16.56 39.12,16.49 39.19,16.51 39.26,17.32 39.32,17.58 39.39,17.75 39.46,17.67 39.52,17.68 39.59,16.94 39.66,17.19 39.73,17.89 39.79,17.92 39.86,17.90 39.93,17.27 39.99,17.92 40.06,17.91 40.13,17.45 40.19,17.61 40.26,17.63 40.33,17.70 40.40,17.80 40.46,17.86 40.53,17.36 40.60,17.94 40.66,18.14 40.73,17.93 40.80,17.96 40.86,18.14 40.93,18.01 41.00,18.11 41.07,17.99 41.13,18.16 41.20,18.15 41.27,18.03 41.33,17.18 41.40,17.42 41.47,17.99 41.53,17.97 41.60,18.31 41.67,18.35 41.73,18.47 41.80,18.48 41.87,17.65 41.94,17.88 42.00,18.58 42.07,18.55 42.14,17.86 42.20,17.81 42.27,18.55 42.34,18.54 42.40,18.52 42.47,17.57 42.54,18.53 42.61,18.59 42.67,18.55 42.74,18.50 42.81,18.40 42.87,17.70 42.94,18.54 43.01,18.54 43.07,18.42 43.14,18.71 43.21,18.69 43.28,17.84 43.34,18.51 43.41,18.52 43.48,18.47 43.54,17.65 43.61,18.38 43.68,17.60 43.74,18.39 43.81,18.74 43.88,18.76 43.95,18.72 44.01,18.93 44.08,18.92 44.15,18.92 44.21,17.90 44.28,18.85 44.35,18.77 44.41,18.58 44.48,18.71 44.55,17.90 44.62,18.17 44.68,18.15 44.75,18.16 44.82,18.98 44.88,19.00 44.95,19.00 45.02,19.00 45.08,18.93 45.15,17.99 45.22,19.16 45.29,18.85 45.35,18.97 45.42,18.05 45.49,18.64 45.55,18.08 45.62,18.57 45.69,18.79 45.75,18.11 45.82,18.68 45.89,18.68 45.96,17.75 46.02,18.54 46.09,18.43 46.16,18.42 46.22,18.39 46.29,18.30 46.36,18.11 46.42,18.07 46.49,17.80 46.56,17.80 46.63,17.74 46.69,17.01 46.76,17.58 46.83,16.77 46.89,17.55 46.96,17.55 47.03,17.56 47.09,17.51 47.16,17.71 47.23,17.71 47.30,17.73 47.36,16.90 47.43,16.74 47.50,17.43 47.56,17.36 47.63,17.38 47.70,17.38 47.76,16.52 47.83,17.32 47.90,17.52 47.97,17.75 48.03,17.75 48.10,17.38 48.17,17.39 48.23,17.62 48.30,17.61 48.37,16.85 48.43,17.51 48.50,17.50 48.57,17.50 48.63,17.49 48.70,17.48 48.77,17.51 48.84,16.75 48.90,17.34 48.97,18.04 49.04,18.06 49.10,18.05 49.17,18.06 49.24,18.24 49.30,18.26 49.37,18.28 49.44,18.22 49.51,17.43 49.57,18.22 49.64,18.22 49.71,18.35 49.77,18.37 49.84,18.25 49.91,18.28 49.97,18.27 50.04,18.25 50.11,18.26 50.18,18.38 50.24,18.40 50.31,18.40 50.38,18.40 50.44,17.64 50.51,17.56 50.58,18.39 50.64,18.40 50.71,18.38 50.78,17.57 50.85,18.25 50.91,18.26 50.98,18.26 51.05,17.48 51.11,18.25 51.18,18.14 51.25,18.05 51.31,18.04 51.38,18.01 51.45,18.04 51.52,17.96 51.58,17.99 51.65,17.97 51.72,18.04 51.78,18.14 51.85,17.45 51.92,17.45 51.98,18.03 52.05,17.84 52.12,17.83 52.19,17.91 52.25,17.91 52.32,17.52 52.39,17.75 52.45,17.05 52.52,16.91 52.59,17.47 52.65,17.43 52.72,17.45 52.79,17.55 52.86,17.83 52.92,18.05 52.99,18.45 53.06,18.74 53.12,18.90 53.19,18.91 53.26,19.05 53.32,19.40 53.39,19.44 53.46,20.00 53.53,20.00 53.59,20.32 53.66,20.32 53.73,20.55 53.79,19.78 53.86,19.76 53.93,20.23 53.99,18.34 54.06,19.87 54.13,20.80 54.20,20.76 54.26,20.35 54.33,19.92 54.40,19.87 54.46,20.78 54.53,20.00 54.60,20.66 54.66,20.80 54.73,20.82 54.80,20.78 54.87,20.76 54.93,20.43 55.00,21.29 55.07,21.28 55.13,21.44 55.20,21.51 55.27,21.61 55.33,21.27 55.40,21.04 55.47,20.65 55.53,20.40 55.60,19.63 55.67,20.26 55.74,20.36 55.80,20.41 55.87,20.42 55.94,20.85 56.00,21.11 56.07,21.31 56.14,20.37 56.20,20.03 56.27,20.02 56.34,20.76 56.41,20.76 56.47,21.32 56.54,20.87 56.61,20.63 56.67,20.67 56.74,20.85 56.81,20.65 56.87,21.39 56.94,21.41 57.01,21.17 57.08,20.57 57.14,21.34 57.21,21.26 57.28,20.70 57.34,20.77 57.41,21.58 57.48,21.57 57.54,21.53 57.61,21.90 57.68,21.18 57.75,21.18 57.81,21.24 57.88,21.06 57.95,21.26 58.01,21.46 58.08,21.32 58.15,20.40 58.21,21.18 58.28,21.06 58.35,21.06 58.42,21.29 58.48,21.77 58.55,21.87 58.62,22.07 58.68,22.25 58.75,22.34 58.82,22.50 58.88,22.73 58.95,22.47 59.02,22.36 59.09,22.83 59.15,23.49 59.22,22.19 59.29,22.83 59.35,23.29 59.42,23.04 59.49,23.05 59.55,23.00 59.62,22.78 59.69,22.89 59.76,23.27 59.82,23.37 59.89,23.55 59.96,23.64 60.02,22.92 60.09,23.88 60.16,22.80 60.22,23.84 60.29,23.94 60.36,23.99 60.43,23.87 60.49,23.89 60.56,23.22 60.63,23.32 60.69,23.85 60.76,24.11 60.83,23.24 60.89,23.33 60.96,22.69 61.03,22.64 61.10,22.90 61.16,22.89 61.23,22.47 61.30,22.36 61.36,22.24 61.43,22.39 61.50,21.83 61.56,22.85 61.63,23.09 61.70,23.28 61.77,22.41 61.83,22.37 61.90,22.15 61.97,21.45 62.03,22.30 62.10,22.27 62.17,23.11 62.23,23.24 62.30,23.63 62.37,24.14 62.43,23.76 62.50,24.70 62.57,24.06 62.64,25.00 62.70,24.89 62.77,24.10 62.84,23.00 62.90,22.60 62.97,22.69 63.04,22.63 63.10,22.00 63.17,22.87 63.24,22.93 63.31,22.34 63.37,21.32 63.44,22.59 63.51,22.44 63.57,22.42 63.64,21.94 63.71,21.27 63.77,22.18 63.84,21.18 63.91,21.93 63.98,20.96 64.04,21.17 64.11,21.19 64.18,21.16 64.24,21.17 64.31,21.24 64.38,21.28 64.44,21.13 64.51,21.11 64.58,20.43 64.65,21.45 64.71,20.31 64.78,20.00 64.85,20.73 64.91,20.89 64.98,21.11 65.05,20.28 65.11,19.96 65.18,19.16 65.25,19.79 65.32,19.79 65.38,19.90 65.45,19.63 65.52,19.24 65.58,18.21 65.65,18.64 65.72,19.34 65.78,18.94 65.85,18.59 65.92,19.56 65.99,19.42 66.05,19.45 66.12,18.46 66.19,18.77 66.25,19.57 66.32,18.63 66.39,18.78 66.45,19.63 66.52,19.22 66.59,19.02 66.66,18.25 66.72,19.45 66.79,19.30 66.86,19.01 66.92,18.54 66.99,18.19 67.06,18.19 67.12,18.48 67.19,19.40 67.26,19.15 67.33,19.33 67.39,18.89 67.46,19.01 67.53,19.89 67.59,20.47 67.66,20.39 67.73,20.20 67.79,20.72 67.86,20.95 67.93,20.47 68.00,20.50 68.06,21.01 68.13,20.52 68.20,19.66 68.26,18.19 68.33,18.59 68.40,19.41 68.46,19.42 68.53,18.76 68.60,18.64 68.67,18.54 68.73,19.59 68.80,19.76 68.87,19.77 68.93,19.95"
const followList = ref([
    { uid: 'uid', name: '用户名', lv: '9', followers: '11', amount: '999', returnrate: 50, returnamount: 700, winrate: 20, time: time },
    { uid: 'uid', name: '用户名', lv: '9', followers: '11', amount: '999', returnrate: 50, returnamount: 700, winrate: 20, time: time },
    { uid: 'uid', name: '用户名', lv: '9', followers: '11', amount: '999', returnrate: 50, returnamount: 700, winrate: 20, time: time },
    { uid: 'uid', name: '用户名', lv: '9', followers: '11', amount: '999', returnrate: 50, returnamount: 700, winrate: 20, time: time },
    { uid: 'uid', name: '用户名', lv: '9', followers: '11', amount: '999', returnrate: 50, returnamount: 700, winrate: 20, time: time },
    { uid: 'uid', name: '用户名', lv: '9', followers: '11', amount: '999', returnrate: 50, returnamount: 700, winrate: 20, time: time },
])
</script>


<style lang="less" scoped>
.page-home2 {
    background-color: var(--ex-bg-color);
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

                .scroll-item-follow {
                    width: 6.04rem;
                    height: 3.32rem;
                    margin-right: 0.32rem;
                    display: inline-block;
                }
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

        .ad {
            width: 100%;
            height: 3.5rem;
            font-size: 0.32rem;
            font-style: normal;
            font-weight: 400;
            color: #fff;
            line-height: normal;
            border-radius: 0.32rem;
            margin-top: 0.2rem;
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

        .links {
            display: flex;
            flex-wrap: wrap;
            align-items: stretch;
            justify-content: space-between;
            margin-top: 0.4rem;

            .link-item {
                background-color: var(--ex-bg-color3);
                width: 3.28rem;
                border-radius: 0.32rem;
                padding: 0.12rem 0.12rem 0.16rem 0.12rem;
                text-align: center;
                margin-bottom: 0.24rem;
                color: var(--ex-white);
                font-size: 0.28rem;
                font-weight: 400;

                .item-img {
                    width: 100%;
                    height: 3.16rem;
                    border-radius: 0.32rem;
                    overflow: hidden;
                    margin-bottom: 0.1rem;
                }
            }
        }
    }
}
</style>