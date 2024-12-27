<!-- 主页模板1 -->
<!-- 首页 -->
<template>
    <div class="page_home" v-if="openPage">
        <!-- 顶部 -->
        <div class="funcs relative">
            <div class="user_box">
                <div class="user_default_avatar">
                    <img :src="getStaticImgUrl('/static/img/user/avatar2.png')" />
                </div>
            </div>
            <div style="flex: 1"></div>
            <div class="func_box" @click="jump('search')">
                <div class="custom-search-icon">
                    <img :src="getStaticImgUrl('/static/icons/search.svg')" alt="">
                </div>
            </div>
            <div class="func_box" @click="jump('notification')">
                <div class="custom-lock-icon">
                    <img :src="getStaticImgUrl('/static/icons/notice.svg')" alt="">
                </div>
            </div>
        </div>
        <div class="top_box relative overflow-hidden">
            <Carousel :autoplay="5000" style="height: 2.4rem; border-radius: 0.32rem; overflow: hidden"
                :wrap-around="true" :mouseDrag="true" v-model="currentSlide">
                <Slide v-for="(slide, index) in slides" :key="index" style="height: 2.4rem">
                    <img :src="slide" class="w-full h-full !object-cover" alt="img" />
                </Slide>
            </Carousel>

            <div class="absolute flex gap-[0.05rem] transition-all bottom-[0.08rem] left-0 ml-[3.6rem]">
                <div @click="() => (currentSlide = 0)" class="w-[0.06rem] rounded-t-[0.32rem] transition-all" :class="[
                    currentSlide == 0
                        ? 'h-[0.16rem] bg-primary'
                        : 'h-[0.08rem] mt-[0.08rem] bg-color opacity-50',
                ]"></div>
                <div @click="() => (currentSlide = 1)" class="w-[0.06rem] rounded-t-[0.32rem] transition-all" :class="[
                    currentSlide == 1
                        ? 'h-[0.16rem] bg-primary'
                        : 'h-[0.08rem] mt-[0.08rem] bg-color opacity-50',
                ]"></div>
                <div @click="() => (currentSlide = 2)" class="w-[0.06rem] rounded-t-[0.32rem] transition-all" :class="[
                    currentSlide == 2
                        ? 'h-[0.16rem] bg-primary'
                        : 'h-[0.08rem] mt-[0.08rem] bg-color opacity-50',
                ]"></div>
            </div>

            <div class="pl-[0.285rem] mt-[1.25rem]"></div>
        </div>
        <div
            class="h-[1.24rem] bg-color2 rounded-b-[0.32rem] pt-[0.32rem] -mt-[0.32rem] px-[0.32rem] mx-[0.32rem] flex items-center justify-between relative">
            <div class="flex items-center gap-2">
                <div class="custom-lock-small-icon">
                    <img :src="getStaticImgUrl('/static/icons/notice-active.svg')" alt="">
                </div>
                <div class="text-[0.28rem] text-color">
                    {{ $t("home.notification") }}
                </div>
            </div>
            <div class="text-[0.24rem] text-color3">
                {{ formatDate(new Date()) }}
            </div>
        </div>
        <div class="relative mt-[0.24rem] mx-[0.32rem]">
            <div class="backdrop-blur-sm bg-['rgba(255, 255, 255, 0.1)'] rounded-[0.32rem] w-full h-[1.6rem] px-[0.4rem] py-[0.28rem] absolute z-20 flex flex-col justify-center items-center"
                v-show="!token">
                <div class="w-[1.2rem] h-[0.6rem] bg-primary border-primary bg-primary-text-color rounded-[0.32rem] flex items-center justify-center border-[0.02rem] mb-[0.2rem]"
                    @click="store.commit('setIsLoginOpen', true)">
                    {{ $t("home.login") }}
                </div>
                <div class="text-[0.24rem] text-color3">
                    {{ $t("home.loginDesc") }}
                </div>
            </div>
            <div
                class="bg-color2 mb-[0.32rem] rounded-[0.32rem] h-[1.6rem] px-[0.4rem] border-[1px] border-color py-[0.28rem] z-10">
                <div class="flex justify-between mb-[0.14rem] items-center">
                    <div class="flex items-center gap-1">
                        <div class="text-[0.26rem] text-color">
                            {{ $t("home.totalAssets") }}(USDT)
                        </div>
                        <div class="assets" v-if="!token" @click="store.commit('setIsLoginOpen', true)">
                            <!-- <div class="assets_login">登录</div>
                                 <div>查看资产</div> -->
                            <div class="assets_icon">
                                <img :src="getStaticImgUrl('/static/img/home/close_eye.svg')" alt=" ">
                            </div>
                        </div>
                        <div class="assets" v-if="token">
                            <div class="assets_icon" @click="openEye = !openEye">
                                <img v-show="!openEye" :src="getStaticImgUrl('/static/img/home/close_eye.svg')" alt=" ">
                                <img v-show="openEye" :src="getStaticImgUrl('/static/img/home/open_eye.svg')" alt=" ">
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="px-[0.2rem] h-[0.52rem] border-primary text-primary text-[0.24rem] rounded-[0.32rem] flex items-center justify-center border-[0.02rem]"
                            @click="showAS = true">
                            {{ $t("home.fastTrading") }}
                        </div>
                        <div class="px-[0.2rem] h-[0.52rem] bg-primary border-primary text-[0.24rem] bg-primary-text-color rounded-[0.32rem] flex items-center justify-center border-[0.02rem]"
                            @click="jump('topUp', true)">
                            {{ $t("home.recharge") }}
                        </div>
                    </div>
                </div>
                <div class="font-bold text-[0.48rem]">
                    {{ openEye ? assets.total : "*******" }}
                </div>
            </div>

            <HomeToday />
            <HomePriority />
        </div>
        <HomeWatchList />

        <div class="font-bold text-[0.32rem] m-[0.32rem]">
            {{ $t("home.marketRecommend") }}
        </div>
        <!-- <Banner v-if="activated" class="home_banner" /> -->

        <!-- Tabs -->
        <Tabs @change="tabChange" v-if="!pageLoading && activated" type="card" class="tabs" v-model:active="activeTab"
            animated shrink>
            <Tab :title="$t('common.stock')">
                <Loaidng v-if="commendLoading" :loading="commendLoading" />
                <div class="pt-[0.12rem]">
                    <StockItem :item="item" v-for="(item, i) in marketStockCurrentList" :key="'s_' + i" page="home" />
                </div>
                <NoData v-if="!commendLoading && !marketStockCurrentList.length" />
            </Tab>
            <Tab :title="$t('common.crypto')">
                <Loaidng v-if="commendLoading" :loading="commendLoading" />
                <div class="pt-[0.32rem]">
                    <StockItem :item="item" v-for="(item, i) in contractList" :key="'c_' + i" marketType="crypto" />
                </div>
                <NoData v-if="!commendLoading && !contractList.length" />
            </Tab>
            <Tab :title="$t('common.IPO')">
                <div>
                    <IPO ref="ipoRef" :page="'home'" />
                </div>
            </Tab>
            <Tab :title="$t('common.AI')">
                <div class="mx-[0.32rem]">
                    <Ai page="home" />
                </div>
            </Tab>
        </Tabs>

        <!-- 类型选择弹窗 -->
        <ActionSheet v-model:show="showAS" :actions="actions" @select="onSelect" :title="$t('home.fastTrading')">
        </ActionSheet>
        <NotifiModal />
    </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import StockItem from "@/components/StockItem.vue";
import {
    onDeactivated,
    ref,
    computed,
    onActivated,
    onMounted,
    nextTick,
    watch,
    onBeforeMount,
} from "vue";
import Banner from "../components/Banner.vue";
import { useSocket } from "@/utils/ws";
import store from "@/store";
import { Tab, Tabs, ActionSheet } from "vant";
import { _sort, _watchlistDefault, _futures } from "@/api/api";
import router from "@/router";
import IPO from "@/views/Market/components/IPO.vue";
import NoData from "@/components/NoData.vue";
import Loaidng from "@/components/Loaidng.vue";
import HomePriority from "@/components/HomePriority.vue";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide } from "vue3-carousel";
import Ai from "@/views/Market/components/Ai.vue";
import HomeWatchList from "@/components/HomeWatchList.vue";
import HomeToday from "@/components/HomeToday.vue";
import { formatDate } from "@/utils/formatDate";
import { useI18n } from "vue-i18n";
import NotifiModal from "@/views/Notification/NotifiModal.vue";
import { useRoute } from "vue-router";
import { DESKTOP_INVITE_URL, MOBILE_INVITE_URL } from "@/config";

const route = useRoute();
const { t } = useI18n();
const openEye = ref(false);

const { startSocket } = useSocket();
const currentSlide = ref(0);

const activeTab = ref(0);
const token = computed(() => store.state.token || "");

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
const slides = [
    "static/img/home/banner1.png",
    "static/img/home/banner2.png",
    "static/img/home/banner3.png",
];

const onSelect = (item) => {
    showAS.value = false;
    if (item.value == -1) return;
    router.push({
        name: "trade",
        query: {
            page: "home",
            pageType: item.value,
        },
    });
};

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

// 总资产
const assets = computed(() => store.state.assets || {});

const ipoRef = ref();
const ipoDataList = computed(() => store.state.ipoDataList || []);
const tabChange = (val) => {
    if (val == 2 && !ipoDataList.value.length) {
        nextTick(() => {
            ipoRef.value && ipoRef.value.init();
        });
    }
};

const subs = (arr) => {
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
            return {...item, type: 'stock'}
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
            }
        })
        .finally(() => {
            commendLoading.value = false;
        });
};
getRecommendData();

// 跳转
const jump = (name, needToken) => {
    if (needToken && !token.value) return store.commit("setIsLoginOpen", true);

    router.push({
        name,
    });
};

function isBrowser() {
    return typeof window !== "undefined" && typeof window.document != "undefined";
}

const userAgent = navigator.userAgent;
function detectEnvironment(code) {
    const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            userAgent
        );
    const redirectUrl = !isBrowser()
        ? "download-url"
        : isMobile
            ? MOBILE_INVITE_URL + `register?invitCode=${code}`
            : DESKTOP_INVITE_URL + `register?invitCode=${code}`;

    window.location.href = redirectUrl;
}

// onBeforeMount(() => {
//   console.log("before mount ====> ", route.query);
//   if (Object.keys(route.query).length) detectEnvironment(route.query.invitCode);
// });

const openPage = ref(false);

onMounted(() => {
    store.commit("setMarketWatchKeys", []);
    activated.value = true;
    subs();
    if (Object.keys(route.query).length) detectEnvironment(route.query.invitCode);
    setTimeout(() => {
        openPage.value = true;
    }, 500);
});
</script>

<style lang="less" scoped>
.page_home {
    padding: 0 0 1.9rem 0;
    height: 100%;
    overflow-y: auto;

    :deep(.van-popup.van-popup--center.van-dialog) {
        background: none;
        box-shadow: none;
        width: 6.22rem;
    }

    :deep(.van-button) {
        border-radius: 0.32rem;
    }

    :deep(.van-hairline--top:after) {
        border-top-width: 0;
    }

    :deep(.van-button::after) {
        content: none;
    }

    :deep(button.van-button.van-button--default.van-button--large.van-dialog__cancel) {
        background-color: white;
        margin-right: 0.16rem;
    }

    :deep(button.van-button.van-button--default.van-button--large.van-dialog__confirm) {
        background-color: #014cfa;
        color: white;
        margin-left: 0.16rem;
    }

    :deep(.van-button__content::after) {
        content: none !important;
    }

    :deep(.van-action-sheet__content) {
        padding: 0.2rem 0 1.38rem 0;

        .van-action-sheet__item {
            padding: 0.32rem;
            border-bottom: 1px solid #f5f5f5;
        }
    }

    :deep(.page_ai .list) {
        padding-top: 0.12rem;
    }

    .top_box {
        padding: 0 0.32rem;
        height: 2.4rem;
        z-index: 1;

        .subtitle {
            color: #333333;
            font-size: 0.26rem;
            margin-bottom: 0.16rem;
        }

        .assets {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            font-size: 0.4rem;
            color: #8d93a6;
            font-weight: 600;

            .assets_login {
                color: #014cfa;
                margin-right: 0.12rem;
            }

            .assets_icon {
                width: 0.32rem;
                height: 0.32rem;
                margin-left: 0.2rem;
                line-height: 0;
            }

            .num {
                color: #000;
                font-size: 0.48rem;
            }
        }

        .btns {
            margin-top: 0.28rem;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .btn {
                width: 48%;
                height: 0.76rem;
                background-color: #f2f3f7;
                border-radius: 0.76rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #000000;
                font-size: 0.28rem;
            }

            .active_btn {
                background-color: #014cfa;
                color: #fff;
            }
        }
    }

    .funcs {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.2rem 0.32rem 0.32rem;

        .user_box {
            width: 0.8rem;
            height: 0.8rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;

            .user_default_avatar {
                width: 0.8rem;
                height: 0.8rem;

                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        .func_box {
            // background-color: #ededed;
            width: 0.72rem;
            height: 0.72rem;
            border-radius: 50%;
            margin-left: 0.28rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-color: #d0d8e2;
            border-width: 0.02rem;
        }
    }

    .home_ad {
        height: 2.8rem;
        width: 100%;
        margin: 0.4rem 0;
    }

    .home_banner {
        padding-bottom: 0.2rem;
    }

    .tabs {
        overflow: hidden;
        margin-bottom: 0.32rem;
        // :deep(.van-tab__panel) {
        //   // height: calc(var(--app-height) - 3.4rem);
        //   // overflow-y: auto;
        // }

        :deep(.van-tabs__nav--card) {
            border: none;
        }

        :deep(.van-tab--card) {
            border-right: none;
            color: #061023;
            border-radius: 0.32rem;
            margin-right: 0.1rem;
            transition: all ease 0.2s;
        }

        :deep(.van-tab--card.van-tab--active) {
            background-color: #014cfa;
            border-color: #014cfa;
            border-radius: 0.32rem;
            color: white;
            font-weight: 500;
            font-size: 0.3rem;
        }

        :deep(.van-tab--shrink) {
            padding: 0 0.3rem;
        }

        :deep(.van-tabs__wrap) {
            height: 0.68rem;
        }

        :deep(.van-tabs__nav--card) {
            height: 0.68rem;
        }

        :deep(.van-tab) {
            line-height: 0.68rem;
            font-size: 0.3rem;
            border: 0.02rem solid #d0d8e2;
            border-radius: 0.32rem;
            color: #666d80;
        }
    }
}



.custom-search-icon {
    width: 0.46rem;
    height: 0.46rem;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

.custom-lock-icon {
    width: 0.44rem;
    height: 0.44rem;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

.custom-lock-small-icon {
    width: 0.32rem;
    height: 0.32rem;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}
</style>