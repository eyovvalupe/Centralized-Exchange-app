<!-- 首页模板2 -->
<template>
    <div class="page-home2">
        <!-- 背景 -->

        <!-- 内容 -->
        <div class="home2-content">
            <!-- 头部 -->
            <div class="home2-header">
                <div class="icon ripple-btn" @click="jump('user', true)">
                    <img v-if="token" v-lazy="getStaticImgUrl('/static/img/user/avatar2.svg')" alt="">
                    <img v-else v-lazy="getStaticImgUrl('/static/home2/avatar.svg')" alt="">
                </div>
                <div style="flex: 1;"></div>
                <div @click="jump('search')" class="icon icon2 ripple-btn" style="margin-right: 0.12rem;">
                    <img v-lazy="getStaticImgUrl('/static/home2/search.svg')" alt="">
                </div>
                <div @click="jump('notification')" class="icon icon2 ripple-btn">
                    <img v-lazy="getStaticImgUrl('/static/home2/notice.svg')" alt="">
                </div>
            </div>


            <!-- banner -->
            <view @click="install" class="banners wow fadeInUp" data-wow-duration="1s">
                <Swipe class="swipers" :autoplay="3000" indicator-color="white">
                    <SwipeItem class="swiper-item">
                        <img v-lazy="getStaticImgUrl('/static/home2/banner1.png')" alt="">
                    </SwipeItem>
                    <SwipeItem class="swiper-item">
                        <img v-lazy="getStaticImgUrl('/static/home2/banner2.png')" alt="">
                    </SwipeItem>
                </Swipe>
            </view>

            <!-- 质押挖矿 -->
            <div class="recommend-title">
                <div class="wow slideInLeft" data-wow-duration="0.6s" style="flex: 1;">{{ t('finance.portfolio_title')
                    }}</div>
                <div class="recommend-icon wow slideInRight ripple-primary" data-wow-duration="0.6s"
                    @click="jump('finance', true, 1)">
                    <img v-lazy="getStaticImgUrl('/static/home2/right-line.svg')" alt="">
                </div>
            </div>

            <div class="scroll-box">
                <div class="scroll-con wow fadeInRight" data-wow-duration="0.4s">
                    <MiningItem class="mining-home-item" v-for="i in 10" :key="i" />
                </div>
            </div>

            <div class="sub-banner wow fadeInUp" data-wow-duration="0.6s">
                <img v-lazy="getStaticImgUrl('/static/home2/subBanner.png')" alt="">

                <div class="sub-box">
                    <div class="title">领取模拟金</div>
                    <div class="amount">$100000</div>
                    <div class="btn ripple-primary">模拟交易</div>
                </div>
            </div>
            <!-- 跟单 -->
            <div class="recommend-title" @click="jump('follow', false)">
                <div class="wow slideInLeft" data-wow-duration="0.6s" style="flex: 1;">{{ t('copy.title') }}</div>
                <div class="recommend-icon wow slideInRight ripple-primary" data-wow-duration="0.6s">
                    <img v-lazy="getStaticImgUrl('/static/home2/right-line.svg')" alt="">
                </div>
            </div>
            <!-- <div>
                <div class="follow-btn wow slideInLeft">{{ t('copy.copy_option') }}</div>
            </div> -->
            <div class="scroll-box">
                <div class="scroll-con wow fadeInRight" data-wow-duration="0.4s">
                    <div class="scroll-item-follow" v-for="(item, i) in followList" :key="i">
                        <FollowItem class="follow-home-item" :item="item" />
                    </div>
                </div>
            </div>

            <!-- 市场推荐 -->
            <div class="recommend-title" style="margin-top: 0.16rem;">
                <div class="wow slideInLeft" style="flex: 1;" data-wow-duration="0.6s">{{ t('home.market_trend') }}
                </div>
                <div class="recommend-icon wow slideInRight ripple-primary" data-wow-duration="0.6s">
                    <img v-lazy="getStaticImgUrl('/static/home2/right-line.svg')" alt="">
                </div>
            </div>

            <!-- Tabs -->
            <Recommend :from="'home'" :activated="activated" />


            <!-- ad -->
            <div class="ad wow fadeInUp" data-wow-duration="0.6s">

                <div class="ad-bg"
                    :style="{ 'background-image': `url(${getStaticImgUrl('/static/home2/ad-bg.svg')})` }"></div>
                <div class="ad-content">
                    <div class="title">{{ t('home.ad_title') }}</div>
                    <div>{{ t('home.ad_con') }}</div>
                    <div class="btn ripple-btn" @click="jump('trade')">{{ t('home.ad_btn') }}</div>
                </div>
                <div class="ad-tip">
                    <img v-lazy="getStaticImgUrl('/static/home2/ad-tip.png')" alt="">
                </div>
            </div>

            <!-- links -->
            <div class="links">
                <div class="link-item wow slideInLeft" data-wow-duration="0.6s">
                    <div class="item-img">
                        <img v-lazy="getStaticImgUrl('/static/home2/link1.png')" alt="">
                    </div>
                    <div>TheSantumNe...</div>
                </div>
                <div class="link-item wow slideInRight" data-wow-duration="0.6s">
                    <div class="item-img">
                        <img v-lazy="getStaticImgUrl('/static/home2/link2.png')" alt="">
                    </div>
                    <div>KEEPOFFTHE...</div>
                </div>
                <div class="link-item wow slideInLeft" data-wow-duration="0.6s">
                    <div class="item-img">
                        <img v-lazy="getStaticImgUrl('/static/home2/link3.png')" alt="">
                    </div>
                    <div>AIORBIT</div>
                </div>
                <div class="link-item wow slideInRight" data-wow-duration="0.6s">
                    <div class="item-img">
                        <img v-lazy="getStaticImgUrl('/static/home2/link4.png')" alt="">
                    </div>
                    <div>GodsUnchained...</div>
                </div>
                <div class="link-item wow slideInLeft" data-wow-duration="0.6s">
                    <div class="item-img">
                        <img v-lazy="getStaticImgUrl('/static/home2/link5.png')" alt="">
                    </div>
                    <div>PudgyRods</div>
                </div>
                <div class="link-item wow slideInRight" data-wow-duration="0.6s">
                    <div class="item-img">
                        <img v-lazy="getStaticImgUrl('/static/home2/link6.png')" alt="">
                    </div>
                    <div>Azuki</div>
                </div>
            </div>



        </div>
    </div>

    <!-- 类型选择弹窗 -->
    <ActionSheet v-model:show="showAS" :actions="actions" @select="onSelect" :title="$t('home.fastTrading')">
    </ActionSheet>
    <NotifiModal v-if="notifiOpen" />
</template>

<script setup>
import { ActionSheet, Swipe, SwipeItem } from "vant";
import { computed, onActivated, onDeactivated, ref, onMounted, watch } from "vue";
import { getStaticImgUrl } from "@/utils/index.js"
import router from "@/router";
import store from "@/store";
import { useI18n } from "vue-i18n";
import { _watchlistDefault, _notifiPopup } from "@/api/api";
import { useSocket } from "@/utils/ws";
import NotifiModal from "@/views/Notification/NotifiModal.vue";
import MiningItem from "../Mining/MiningItem.vue"
import FollowItem from "../components/FollowItem.vue"
import Wow from "wow.js"
import { isEmpty } from "@/utils/isEmpty";
import { useRoute } from "vue-router";
import Recommend from "./Recommend"

const route = useRoute();

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

const token = computed(() => store.state.token || "");
// 总资产
const notifiOpen = computed(() => store.state.notifiOpen);

// 预加载页面
const pageLoading = computed(() => store.state.pageLoading);
// store.commit("setPageLoading", true);

Promise.all([
    import("@/views/Market/MarketInfo.vue"),
    import("@/views/Market/Search.vue"),
    import("@/views/Public/Login.vue"),
    import("@/views/assets/TopUpCrypto.vue"),
]).finally(() => {
    // store.commit("setPageLoading", false);
});

// 订阅
const subs = () => {
    store.commit("setMarketWatchKeysByPage");
    store.dispatch("subList", {});
};



const activated = ref(false);
let wowObj = {}
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

const getNotifiData = () => {
    _notifiPopup().then(res => {
        store.commit('setNotifiData', res.data);
        sessionStorage.setItem('notifiData', JSON.stringify(res.data));
        setTimeout(() => {
            if (isEmpty(res.data)) { store.commit('setNotifiOpen', false) }
            else {
                store.commit('setNotifiOpen', true)
            }
        }, 50);
    }).catch(err => console.error(err)).finally(() => { });
}

const getToday6AMTime = () => {
    const now = new Date();
    now.setHours(6, 0, 0, 0);
    return now.getTime()
}

const getLastExecutionTime = () => {
    return localStorage.getItem('lastExecutionTime');
};

const getTimeSince6AM = () => {
    const today6AMTime = getToday6AMTime();
    return (Date.now() - today6AMTime) / 1000;
};

const canExecuteToday = () => {
    const timeSince6AM = getTimeSince6AM();
    const lastExecutionTime = getLastExecutionTime();
    if (lastExecutionTime && ((timeSince6AM > 0) && (getToday6AMTime() < getLastExecutionTime())) || ((timeSince6AM < 0) && (getToday6AMTime() - 24 * 60 * 60 * 1000 < getLastExecutionTime()))) return false;
    return true
}

watch(() => (route.path), (val) => {
    if (val == '/') {
        const canExecute = canExecuteToday();
        if (token.value && canExecute) getNotifiData();
    };
})

watch(() => (token.value), (val) => {
    if (val && canExecuteToday()) {
        getNotifiData();
    }
})

onMounted(() => {
    if (token.value && canExecuteToday()) getNotifiData();
    store.commit("setMarketWatchKeys", []);
    activated.value = true;
    subs();
    setTimeout(() => { // wow.js
        wowObj = new Wow({
            boxClass: 'wow',
            animateClass: 'animated',
            mobile: true,
            live: true,
            scrollContainer: '.wow_scroll'
        })
        wowObj.init()
    }, 0)
});


// 跟单列表
store.dispatch('updateFollowList')
const followList = computed(() => store.state.followList || [])
// const time = getPoints('asd-as2', 0)

</script>


<style lang="less" scoped>
@keyframes rotateShadow {
    0% {
        box-shadow: 0.02rem 0 0.06rem rgba(0,166,9,0.5) inset;
    }

    25% {
        box-shadow: 0 0.02rem 0.06rem rgba(0,166,9,0.5) inset;
    }

    50% {
        box-shadow: -0.02rem 0 0.06rem rgba(0,166,9,0.5) inset;
    }

    75% {
        box-shadow: 0 -0.02rem 0.06rem rgba(0,166,9,0.5) inset;
    }

    100% {
        box-shadow: 0.02rem 0 0.06rem rgba(0,166,9,0.5) inset;
    }
}

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
            margin: 0.32rem 0 0.4rem 0;

            .swipers {
                width: 100%;
                height: 100%;
                position: relative;

                .swiper-item {
                    overflow: hidden;
                    border-radius: 0.32rem;
                    height: 3.48rem;
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
            position: relative;
            background-color: var(--ex-bg-color3);
            border-radius: 0.32rem;
            overflow: hidden;

            .sub-box {
                position: absolute;
                top: 0.28rem;
                left: 0.64rem;
                color: var(--ex-white);
                line-height: 1.4;

                .title {
                    font-size: 0.32rem;
                }

                .amount {
                    font-size: 0.6rem;
                    font-weight: 700;
                    color: var(--ex-warning-color);
                }

                .btn {
                    height: 0.6rem;
                    padding: 0 0.3rem;
                    border-radius: 0.3rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--ex-bg-color);
                    font-size: 0.24rem;
                    margin-top: 0.15rem;
                    background-color: var(--ex-white);
                }
            }
        }

        .scroll-box {
            width: calc(100% + 0.32rem);
            overflow-x: auto;
            margin-bottom: 0.32rem;
            padding-right: 0.32rem;

            .mining-home-item {
                margin-right: 0.32rem;
                display: inline-block;
                position: relative;
                animation: rotateShadow 3s linear infinite;
            }
            .follow-home-item {
                position: relative;
                animation: rotateShadow 3s linear infinite;
            }

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
                color: var(--ex-white);
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