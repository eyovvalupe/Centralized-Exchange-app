<!-- 首页 -->
<template>
    <div style="background-color: #0E0F18;position: relative;">
        <div class="video-bg" :style="{ backgroundImage: `url(${getStaticImgUrl('/static/home2/topbg.jpg')})` }">
            <video ref="vidRef" style="width: 100%;height: 100%;" muted autoplay playsinline loop>
                <source src="/static/home2/bg.mp4" type="video/mp4">
            </video>
        </div>

        <div class="page-index">
            <!-- 头部 -->
            <div class="box home2-header">
                <div style="flex: 1;"></div>
                <div @click="jump('search')" class="icon icon2 ripple-btn" style="margin-right: 0.12rem;">
                    <img v-lazy="getStaticImgUrl('/static/home2/search.svg')" alt="">
                </div>
                <div @click="jump('notification')" class="icon icon2 ripple-btn" style="margin-right: 0.12rem;">
                    <img v-lazy="getStaticImgUrl('/static/home2/notice.svg')" alt="">
                </div>
                <div @click="jump('language')" class="icon icon2 ripple-btn" style="margin-right: 0.12rem;">
                    <img v-lazy="getStaticImgUrl('/static/home2/lang.svg')" alt="">
                </div>
                <div @click="LeftRef.open()" class="icon icon2 ripple-btn">
                    <img v-lazy="getStaticImgUrl('/static/home2/menu.svg')" alt="">
                </div>
            </div>
            <div class="box top">
                <div>安全 | 便捷 | 严格</div>
                <div class="title"><span style="color: #F19009;">千万用户都在用的</span><br />交易所</div>
                <div>体验无限可能</div>
            </div>
            <div v-if="!token" class="ripple-btn login-btn" @click="jump('user', true)">登录/注册</div>
            <div v-else style="height: 0.4rem;"></div>

            <!-- 导航 -->
            <div class="box dirs">
                <div class="dir-b " @click="jump('tradeInfo', false, { tradeType: 'ai' })"
                    :style="{ backgroundImage: `url(${getStaticImgUrl('/static/home2/dir-b-bg2.png')})` }">
                    <div class="dir-b-box">
                        <div class="dir-b-icon">
                            <img v-lazy="getStaticImgUrl('/static/home2/dir-ai.svg')" alt="">
                        </div>
                        <div>{{ t('trade.left_bot') }}</div>
                    </div>
                </div>
                <div class="dir-b " @click="jump('finance', false)"
                    :style="{ backgroundImage: `url(${getStaticImgUrl('/static/home2/dir-b-bg1.png')})` }">
                    <div class="dir-b-box">
                        <div class="dir-b-icon">
                            <img v-lazy="getStaticImgUrl('/static/home2/dir-follow.svg')" alt="">
                        </div>
                        <div>{{ t('copy.title') }}</div>
                    </div>
                </div>
                <div class="dir-s " @click="jump('tradeInfo', false, { tradeType: 'spot' })">
                    <div class="dir-s-icon">
                        <img v-lazy="getStaticImgUrl('/static/home2/dir-s-1.svg')" alt="">
                    </div>
                    <div>{{ t('common.spot') }}</div>
                </div>
                <div class="dir-s " @click="jump('tradeInfo', false, { tradeType: 'constract' })">
                    <div class="dir-s-icon">
                        <img v-lazy="getStaticImgUrl('/static/home2/dir-s-2.svg')" alt="">
                    </div>
                    <div>{{ t('common.crypto') }}</div>
                </div>
                <div class="dir-s " @click="jump('finance', false, { activeTab: 1 })">
                    <div class="dir-s-icon">
                        <img v-lazy="getStaticImgUrl('/static/home2/dir-s-3.svg')" alt="">
                    </div>
                    <div>{{ t('finance.defi_borrow') }}</div>
                </div>
                <div class="dir-s " @click="jump('finance', false, { activeTab: 2 })">
                    <div class="dir-s-icon">
                        <img v-lazy="getStaticImgUrl('/static/home2/dir-s-4.svg')" alt="">
                    </div>
                    <div class="mx-[0.1rem]">{{ t('finance.portfolio_title') }}</div>
                </div>
            </div>


            <!-- 轮播 -->
            <div class="box banners-box" v-if="pageLoaded">
                <div class="left-banner">
                    <Swipe :autoplay="3000">
                        <SwipeItem>
                            <div class="left-banner-item"><img :src="getStaticImgUrl('/static/home2/banner1.png')"
                                    alt=""></div>
                        </SwipeItem>
                        <SwipeItem>
                            <div class="left-banner-item"><img :src="getStaticImgUrl('/static/home2/banner1.png')"
                                    alt=""></div>
                        </SwipeItem>
                        <SwipeItem>
                            <div class="left-banner-item"><img :src="getStaticImgUrl('/static/home2/banner1.png')"
                                    alt=""></div>
                        </SwipeItem>
                        <template #indicator="{ active, total }">
                            <div class="custom-indicator"><span>{{ active + 1 }}</span>/{{ total }}</div>
                        </template>
                    </Swipe>
                </div>
                <div>
                    <div class="right-banner">
                        <Swipe :autoplay="3000">
                            <SwipeItem>
                                <div class="right-banner-item"><img :src="getStaticImgUrl('/static/home2/banner2.png')"
                                        alt=""></div>
                            </SwipeItem>
                            <SwipeItem>
                                <div class="right-banner-item"><img :src="getStaticImgUrl('/static/home2/banner2.png')"
                                        alt=""></div>
                            </SwipeItem>
                            <SwipeItem>
                                <div class="right-banner-item"><img :src="getStaticImgUrl('/static/home2/banner2.png')"
                                        alt=""></div>
                            </SwipeItem>
                            <template #indicator="{ active, total }">
                                <div class="custom-indicator"><span>{{ active + 1 }}</span>/{{ total }}</div>
                            </template>
                        </Swipe>
                    </div>
                    <div class="right-banner" style="margin-top: 0.24rem;height: 2.36rem;">
                        <Swipe :autoplay="3000">
                            <SwipeItem>
                                <div class="right-banner-item2"><img :src="getStaticImgUrl('/static/home2/banner3.png')"
                                        alt=""></div>
                            </SwipeItem>
                            <SwipeItem>
                                <div class="right-banner-item2"><img :src="getStaticImgUrl('/static/home2/banner3.png')"
                                        alt=""></div>
                            </SwipeItem>
                            <SwipeItem>
                                <div class="right-banner-item2"><img :src="getStaticImgUrl('/static/home2/banner3.png')"
                                        alt=""></div>
                            </SwipeItem>
                            <template #indicator="{ active, total }">
                                <div class="custom-indicator"><span>{{ active + 1 }}</span>/{{ total }}</div>
                            </template>
                        </Swipe>
                    </div>
                </div>
            </div>


            <!-- 公告 -->
            <div v-if="pageLoaded" class="notice-bar">
                <div class="notice-icon">
                    <img v-lazy="getStaticImgUrl('/static/home2/notice-primary.svg')" alt="">
                </div>
                <div class="notice-con">公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容</div>
                <div class="date">10/16 16:10</div>
            </div>

            <!-- 交易机器人 -->
            <div class="box" id="ai-box" v-show="marketAiList.length">
                <div class="recommend-title" v-if="pageLoaded">
                    <div class="wow slideInRight" style="flex: 1;" data-wow-duration="0.6s">交易机器人</div>
                </div>

                <div class="swiper-row" v-if="pageLoaded">
                    <Swipe :loop="false" :width="sWidth">
                        <SwipeItem v-for="(item, i) in marketAiList" :key="i">
                            <div class="swiper-row-item">
                                <AiItem :from="'home'" :item="item" style="width: 100%;" />
                            </div>
                        </SwipeItem>
                        <template #indicator="{ active, total }">
                            <Teleport to="#ai-box">
                                <div class="custom-indicator2"><span>{{ active + 1 }}</span>/{{ total }}</div>
                            </Teleport>
                        </template>
                    </Swipe>
                </div>
            </div>

            <!-- 跟单 -->
            <div class="box" id="follow-box" v-show="followList.length">
                <div class="recommend-title" v-if="pageLoaded">
                    <div class="wow slideInRight" style="flex: 1;" data-wow-duration="0.6s">跟单</div>
                </div>

                <div class="swiper-row" v-if="pageLoaded">
                    <Swipe :loop="false" :width="sWidth">
                        <SwipeItem v-for="(item, i) in followList" :key="i">
                            <div class="swiper-row-item swiper-follow-item">
                                <FollowItem style="width: 100%;" :item="item" />
                            </div>
                        </SwipeItem>
                        <template #indicator="{ active, total }">
                            <Teleport to="#follow-box">
                                <div class="custom-indicator2"><span>{{ active + 1 }}</span>/{{ total }}</div>
                            </Teleport>
                        </template>
                    </Swipe>
                </div>
            </div>

            <!-- 质押挖矿 -->
            <div class="box" id="bor-box">
                <div class="recommend-title" v-if="pageLoaded">
                    <div class="wow slideInRight" style="flex: 1;" data-wow-duration="0.6s">质押挖矿</div>
                </div>

                <div class="swiper-row" v-if="pageLoaded">
                    <Swipe :loop="false" :width="sWidth">
                        <SwipeItem v-for="i in 10" :key="5">
                            <div class="swiper-row-item">
                                <MiningItem style="width: 100%;" />
                            </div>
                        </SwipeItem>
                        <template #indicator="{ active, total }">
                            <Teleport to="#bor-box">
                                <div class="custom-indicator2"><span>{{ active + 1 }}</span>/{{ total }}</div>
                            </Teleport>
                        </template>
                    </Swipe>
                </div>
            </div>


            <!-- 市场推荐 -->
            <div class="box" v-if="pageLoaded">
                <div class="recommend-title">
                    <div class="wow slideInRight" style="flex: 1;" data-wow-duration="0.6s">{{ t('home.market_trend') }}
                    </div>
                </div>

                <!-- Tabs -->
                <Recommend :from="'home'" :activated="activated" />
            </div>

            <!-- ad -->
            <div v-if="pageLoaded" class="box ad " data-wow-duration="0.6s">

                <div class="ad-bg"
                    :style="{ 'background-image': `url(${getStaticImgUrl('/static/home2/ad-tip.png')})` }">
                </div>
                <div class="ad-content">
                    <div class="title">{{ t('home.ad_title') }}</div>
                    <div>{{ t('home.ad_con') }}</div>
                    <div class="btn ripple-btn" @click="jump('trade')">{{ t('home.ad_btn') }}</div>
                </div>
            </div>

            <!-- links -->
            <div v-if="pageLoaded" class="box" style="margin-top: 0.4rem;">
                <div class="links">
                    <div class="link-item " data-wow-duration="0.6s">
                        <div class="item-img">
                            <img v-lazy="getStaticImgUrl('/static/home2/link1.png')" alt="">
                        </div>
                        <div>TheSantumNe...</div>
                    </div>
                    <div class="link-item " data-wow-duration="0.6s">
                        <div class="item-img">
                            <img v-lazy="getStaticImgUrl('/static/home2/link2.png')" alt="">
                        </div>
                        <div>KEEPOFFTHE...</div>
                    </div>
                    <div class="link-item " data-wow-duration="0.6s">
                        <div class="item-img">
                            <img v-lazy="getStaticImgUrl('/static/home2/link3.png')" alt="">
                        </div>
                        <div>AIORBIT</div>
                    </div>
                    <div class="link-item " data-wow-duration="0.6s">
                        <div class="item-img">
                            <img v-lazy="getStaticImgUrl('/static/home2/link4.png')" alt="">
                        </div>
                        <div>GodsUnchained...</div>
                    </div>
                    <div class="link-item " data-wow-duration="0.6s">
                        <div class="item-img">
                            <img v-lazy="getStaticImgUrl('/static/home2/link5.png')" alt="">
                        </div>
                        <div>PudgyRods</div>
                    </div>
                    <div class="link-item " data-wow-duration="0.6s">
                        <div class="item-img">
                            <img v-lazy="getStaticImgUrl('/static/home2/link6.png')" alt="">
                        </div>
                        <div>Azuki</div>
                    </div>
                </div>
            </div>

            <!-- 通知 -->
            <NotifiModal v-if="notifiOpen" />
            <!-- 左侧弹窗 -->
            <LeftMenu :jump="jump" ref="LeftRef" />
        </div>
    </div>

    <Ai style="display: none;" />
</template>

<script setup>
import { Swipe, SwipeItem } from "vant";
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
import Recommend from "./Recommend.vue"
import LeftMenu from "../components/LeftMenu.vue"
import AiItem from "@/views/Market/components/AiItem.vue";
import Ai from "@/views/Market/components/Ai.vue";

const token = computed(() => store.state.token || "");
const route = useRoute();
const LeftRef = ref()
const { startSocket } = useSocket();
const { t } = useI18n();
const notifiOpen = computed(() => store.state.notifiOpen);
const marketAiList = computed(() => store.state.marketAiList || []); // ai量化默认列表

// 跳转
const jump = (name, needToken, query) => {
    if (needToken && !token.value) {
        LeftRef.value.close()
        setTimeout(() => {
            store.commit("setIsLoginOpen", true);
        }, 0)
        return
    }
    router.push({
        name,
        query
    });
};

Promise.all([
    import("@/views/Market/MarketInfo.vue"),
    import("@/views/Market/Search.vue"),
    import("@/views/Public/Login.vue"),
    import("@/views/assets/TopUpCrypto.vue"),
])

// 订阅
const subs = () => {
    store.commit("setMarketWatchKeysByPage");
    store.dispatch("subList", {});
};


const activated = ref(false);
const sWidth = ref((document.body.clientWidth > 750 ? 375 : document.body.clientWidth) / 7.5 * 6.28)
let wowObj = {}
onActivated(() => {
    store.commit("setMarketWatchKeys", []);
    activated.value = true;
    subs();
    setTimeout(() => {
        vidRef.value && vidRef.value.play()
    }, 100)
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

const vidRef = ref()
const pageLoaded = ref(false)
onMounted(() => {
    if (token.value && canExecuteToday()) getNotifiData();
    store.commit("setMarketWatchKeys", []);
    activated.value = true;
    setTimeout(() => {
        pageLoaded.value = true
    }, 1000)
    subs();
    wowObj = new Wow({
        boxClass: 'wow',
        animateClass: 'animated',
        mobile: true,
        live: true,
        scrollContainer: '.wow_scroll'
    })
    wowObj.init()
});



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


// 跟单列表
store.dispatch('updateFollowList')
const followList = computed(() => store.state.followList || [])
</script>

<style lang="less" scoped>
.video-bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 9.28rem;
    background-size: 100% 100%;

    &::after {
        content: "";
        width: 100%;
        height: 1.12rem;
        background: linear-gradient(180deg, rgba(14, 15, 24, 0.00) 0%, #0E0F18 100%);
        position: absolute;
        bottom: 0rem;
        left: 0;
        z-index: 9;
    }
}

.page-index {
    padding-bottom: 1.4rem;
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-position: 0 -0.6rem;

    position: relative;
    z-index: 9;

    .box {
        padding: 0 0.32rem;
        position: relative;
    }

    .home2-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.08rem 0.32rem;

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

    .top {
        font-size: 0.4rem;
        font-weight: 400;
        margin: 1.36rem 0 0.8rem 0;

        .title {
            font-size: 0.8rem;
            font-style: normal;
            font-weight: 900;
            line-height: 1rem;
            margin: 0.34rem 0;
        }
    }

    .swiper-row {
        .swiper-row-item {
            width: 6.08rem;
            margin-right: 0.2rem;
        }
    }

    .custom-indicator2 {
        position: absolute;
        right: 0.32rem;
        top: 0;
        font-size: 0.24rem;
        color: var(--ex-text-color5);

        span {
            font-size: 0.28rem;
            color: var(--ex-white);
        }
    }

    .banners-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 0.4rem;

        .custom-indicator {
            position: absolute;
            right: 0.16rem;
            bottom: 0.16rem;
            font-size: 0.24rem;
            color: var(--ex-text-color5);

            span {
                font-size: 0.28rem;
                color: var(--ex-white);
            }
        }

        .left-banner {
            width: 3.28rem;
            height: 5.34rem;
            border-radius: 0.4rem;
            background-color: var(--ex-bg-color3);

            .left-banner-item {
                width: 3.28rem;
                height: 5.34rem;
            }
        }

        .right-banner {
            width: 3.28rem;
            height: 2.76rem;
            border-radius: 0.3rem;
            background-color: var(--ex-bg-color3);

            .right-banner-item {
                width: 3.28rem;
                height: 2.76rem;
            }

            .right-banner-item2 {
                width: 3.28rem;
                height: 2.36rem;
            }
        }
    }

    .notice-bar {
        height: 0.74rem;
        margin: 0 0.32rem;
        border-radius: 0.2rem;
        background-color: var(--ex-bg-color3);
        display: flex;
        align-items: center;
        padding: 0 0.2rem;
        margin-top: 0.4rem;

        .notice-icon {
            width: 0.32rem;
            height: 0.32rem;
        }

        .notice-con {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin: 0 0.4rem 0 0.16rem;
            font-size: 0.28rem;
            color: var(--ex-white);
        }

        .date {
            font-size: 0.24rem;
            color: var(--ex-text-color5);
        }
    }

    .recommend-title {
        font-size: 0.4rem;
        margin: 0.6rem 0 0.4rem 0;
    }

    .login-btn {
        width: 6.7rem;
        height: 1rem;
        border-radius: 1.2rem;
        background-color: var(--ex-primary-color);
        color: var(--ex-white);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.36rem;
        font-style: normal;
        font-weight: 600;
        margin: 0.8rem auto 0 auto;
    }

    .dirs {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        margin-top: 1.2rem;

        .dir-b {
            width: 3.38rem;
            height: 2.16rem;
            border-radius: 0.32rem;
            margin-bottom: 0.12rem;
            background-color: var(--ex-bg-white2);
            background-size: 100% 100%;
            padding: 0.24rem;

            .dir-b-box {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                font-size: 0.32rem;
                color: var(--ex-white);

                .dir-b-icon {
                    width: 0.48rem;
                    height: 0.48rem;
                    margin-right: 0.16rem;
                }
            }
        }

        .dir-s {
            width: 1.64rem;
            height: 1.54rem;
            border-radius: 0.32rem;
            background-color: var(--ex-bg-color3);
            background-size: 100% 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 0.24rem;
            color: var(--ex-white);
            text-align: center;

            .dir-s-icon {
                width: 0.6rem;
                height: 0.6rem;
                margin-bottom: 0.12rem;
            }
        }
    }

    .ad {
        margin: 0 0.32rem;
        height: 3.5rem;
        font-size: 0.32rem;
        font-style: normal;
        font-weight: 400;
        color: #fff;
        line-height: normal;
        border-radius: 0.32rem;
        margin-top: 0.6rem;
        position: relative;
        overflow: hidden;
        box-shadow: 0px 4px 10px 0px rgba(151, 225, 128, 0.15);
        // background: linear-gradient(0deg, #1C1C1C 0%, #2E2E2E 95.61%);
        background-color: var(--ex-bg-color3);

        .ad-bg {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 0;
            width: 100%;
            height: 100%;
            background-size: 100% 100%;
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
            font-size: 0.28rem;

        }

        .ad-tip {
            position: absolute;
            width: 3rem;
            height: auto;
            right: 0;
            bottom: 0;

        }

        .title {
            font-size: 0.4rem;
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
            font-size: 0.28rem;
            color: var(--ex-white);
            margin-top: 0.4rem;
        }
    }

    .links {
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        justify-content: space-between;

        .link-item {
            background-color: var(--ex-bg-white2);
            width: 3.3rem;
            border-radius: 0.32rem;
            padding: 0.15rem 0.1rem 0.16rem 0.1rem;
            text-align: center;
            margin-bottom: 0.24rem;
            color: var(--ex-white);
            font-size: 0.28rem;
            font-weight: 400;
            line-height: 1.8;

            .item-img {
                width: 100%;
                height: 3.1rem;
                border-radius: 0.32rem;
                overflow: hidden;
                margin-bottom: 0.1rem;
            }
        }
    }
}
</style>