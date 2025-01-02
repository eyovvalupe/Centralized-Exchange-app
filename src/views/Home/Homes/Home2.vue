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
                <div class="icon"></div>
                <div style="flex: 1;"></div>
                <div @click="jump('search')" class="icon" style="margin-right: 0.12rem;"></div>
                <div @click="jump('notification')" class="icon"></div>
            </div>

            <!-- 首屏 -->
            <div class="first">
                <div class="title1">安全 | 便捷 | 严格</div>
                <div class="title2">
                    <span>千万用户</span>都在用的<br />交易所
                </div>
                <div class="title3">体验无限可能</div>
                <div class="gif">
                    <img :src="getStaticImgUrl('/static/home2/top.gif')" alt="">
                </div>
            </div>

            <!-- 按钮 -->
            <div class="btns">
                <div class="btn btn2" v-if="!token" @click="store.commit('setIsLoginOpen', true)">登录</div>
                <div class="btn" v-if="!token" @click="jump('register')">注册</div>
                <div class="btn" v-if="token">去交易</div>
            </div>


            <!-- 卡片 -->
            <div class="cards" style="margin-top: 0.56rem">
                <!-- banner -->
                <div class="card-1">
                    <Swipe class="swipers swipers1" :autoplay="3000" indicator-color="white">
                        <SwipeItem class="swiper-item">
                            <img :src="getStaticImgUrl('/static/home2/banner1.svg')" alt="">
                        </SwipeItem>
                        <SwipeItem class="swiper-item">
                            <img :src="getStaticImgUrl('/static/home2/banner1.svg')" alt="">
                        </SwipeItem>
                        <SwipeItem class="swiper-item">
                            <img :src="getStaticImgUrl('/static/home2/banner1.svg')" alt="">
                        </SwipeItem>
                    </Swipe>
                </div>
                <div class="card-right">
                    <div class="card-2">
                        <!-- 资产 -->
                        <div class="assets">
                            <div class="top"
                                :style="{ 'background-image': token ? `url('${getStaticImgUrl('/static/home2/assets_bg.svg')}')` : '' }">
                                <div class="total">
                                    <span>总资产 (USDT)</span>
                                </div>
                                <div class="amount" v-if="token">{{ assets.total }}</div>
                                <div class="recharge" v-if="token">充值</div>
                                <div class="login" v-if="!token" @click="store.commit('setIsLoginOpen', true)">登录</div>
                                <div class="login_tip" v-if="!token">先登录方可查看资产</div>
                            </div>
                        </div>
                    </div>
                    <div class="card-4">
                        <Swipe class="swipers swipers1" :autoplay="3000" indicator-color="white">
                            <SwipeItem class="swiper-item" v-for="i in 3" :key="i">
                                <div class="notice-item">
                                    <div class="notice-icon">
                                        <img :src="getStaticImgUrl('/static/home2/notice.svg')" alt="">
                                    </div>
                                    <div class="notice-con">
                                        <div class="notice-info">阿三大苏打啊阿斯顿阿三大苏打啊阿斯顿阿三大苏打啊阿斯顿阿三大苏打啊阿斯顿阿三大苏打啊阿斯顿</div>
                                        <div class="notice-more">详情&gt;&gt;</div>
                                    </div>
                                </div>
                            </SwipeItem>
                        </Swipe>
                    </div>
                </div>
            </div>

            <div class="cards" style="margin: 0.32rem 0 0.8rem 0;">
                <div class="card-3">
                    <Swipe class="swipers swipers2" :autoplay="3000" indicator-color="white">
                        <SwipeItem class="swiper-item" v-for="(item, i) in marketSrockRecommendList" :key="i">
                            <div class="stock-item">
                                <div class="stock-symbol">{{ item.symbol }}</div>
                                <div class="stock-name">{{ item.name || `&nbsp;` }}</div>
                                <div class="stock-price">
                                    <b> {{ item.price ? item.price : "--" }}</b>
                                    <span>{{ (item.ratio || 0) > 0
                                        ? "+" + (item.ratio || 0)
                                        : item.ratio || 0
                                        }}% </span>
                                </div>
                                <div class="stock-spark">
                                    <SparkLine style="transform: scaleX(2.3) scaleY(1.8);transform-origin: 0 0;"
                                        v-if="item.points" :points="item.points" :ratio="item.ratio" />
                                </div>
                            </div>
                        </SwipeItem>
                    </Swipe>
                </div>
                <div class="card-3">
                    <Swipe class="swipers swipers2" :autoplay="3000" indicator-color="white">
                        <SwipeItem class="swiper-item" v-for="(item, i) in marketContractRecommendList" :key="i">
                            <div class="stock-item">
                                <div class="stock-symbol">{{ item.symbol }}</div>
                                <div class="stock-name">{{ item.name || `&nbsp;` }}</div>
                                <div class="stock-price">
                                    <b> {{ item.price ? item.price : "--" }}</b>
                                    <span>{{ (item.ratio || 0) > 0
                                        ? "+" + (item.ratio || 0)
                                        : item.ratio || 0
                                        }}% </span>
                                </div>
                                <div class="stock-spark">
                                    <SparkLine style="transform: scaleX(2.3) scaleY(1.8);transform-origin: 0 0;"
                                        v-if="item.points" :points="item.points" :ratio="item.ratio" />
                                </div>
                            </div>
                        </SwipeItem>
                    </Swipe>
                </div>
            </div>



            <!-- 市场推荐 -->
            <div class="recommend-title">
                <div>市场推荐</div>
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
                        <div>
                            <StockItem :item="item" v-for="(item, i) in marketStockCurrentList" :key="'s_' + i"
                                page="home" />
                        </div>
                        <NoData v-if="!commendLoading && !marketStockCurrentList.length" />
                    </Tab>
                    <Tab :title="$t('common.crypto')">
                        <Loaidng v-if="commendLoading" :loading="commendLoading" />
                        <div>
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

const { startSocket } = useSocket();
const { t } = useI18n();
const activeTab = ref(0);
const token = computed(() => store.state.token || "");
// 总资产
const assets = computed(() => store.state.assets || {});


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


        .home2-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.08rem 0;

            .icon {
                width: 0.72rem;
                height: 0.72rem;
                border-radius: 50%;
                border: 1px solid var(--ex-text-color3);
            }
        }

        .first {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin: 0.16rem 0 0 0;
            color: var(--ex-white);
            text-align: center;

            .title1 {
                font-weight: 400;
                font-size: 0.28rem;
                line-height: 0.4rem;
                margin-bottom: 0.16rem;
            }

            .title2 {
                font-weight: 900;
                font-size: 0.6rem;
                line-height: 0.76rem;

                span {
                    color: var(--ex-primary-color);
                    ;
                }
            }

            .title3 {
                font-weight: 400;
                font-size: 0.28rem;
                line-height: 0.4rem;
                margin-top: 0.18rem;
                margin-bottom: 0.36rem;
            }

            .gif {
                width: 5.64rem;
                height: auto;
            }
        }

        .btns {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 0.4rem;

            .btn {
                flex: 1;
                height: 0.98rem;
                border-radius: 1.2rem;
                background-color: var(--ex-primary-color);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--ex-bg-color);
                font-weight: 400;
                font-size: 0.32rem;
            }

            .btn2 {
                margin-right: 0.32rem;
                background-color: var(--ex-white);
            }
        }

        .cards {
            display: flex;
            align-items: stretch;
            justify-content: space-between;

            .swipers {
                width: 100%;
                height: 100%;
                position: relative;

                .swiper-item {
                    color: #fff;
                    overflow: hidden;
                    border-radius: 0.32rem;
                    background: linear-gradient(0deg, #1C1C1C 0%, #2E2E2E 95.61%);

                    .notice-item {
                        display: flex;
                        align-items: flex-start;
                        padding: 0.2rem;

                        .notice-icon {
                            width: 0.32rem;
                            height: 0.32rem;
                            margin-right: 0.16rem;
                            position: relative;
                            top: 0.04rem;
                        }

                        .notice-con {
                            flex: 1;

                            .notice-info {
                                color: #fff;
                                font-size: 0.28rem;
                                font-weight: 400;
                                line-height: 0.4rem;
                                display: -webkit-box;
                                -webkit-box-orient: vertical;
                                -webkit-line-clamp: 3;
                                /* 显示的行数，超出部分会省略 */
                                overflow: hidden;
                            }

                            .notice-more {
                                font-size: 0.24rem;
                                color: var(--ex-primary-color);
                                font-weight: 400;
                                margin-top: 0.24rem;
                                line-height: 0.32rem;
                            }
                        }
                    }

                    .stock-item {
                        padding-top: 0.32rem;
                        overflow: hidden;
                        border-radius: 0.32rem;

                        .stock-symbol {
                            color: #FFF;
                            font-size: 0.32rem;
                            font-weight: 600;
                            line-height: 0.32rem;
                            margin-bottom: 0.16rem;
                            padding-left: 0.24rem;
                        }

                        .stock-name {
                            color: rgba(255, 255, 255, 0.70);
                            font-size: 0.24rem;
                            font-weight: 400;
                            line-height: 0.24rem;
                            padding-left: 0.24rem;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }

                        .stock-price {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            margin-top: 0.24rem;
                            padding: 0 0.24rem;
                        }

                        .stock-spark {
                            width: 100%;
                            height: 1.12rem;
                            position: relative;
                            top: 0.04rem;
                            margin-top: 0.24rem;
                        }
                    }
                }

                :deep(.van-swipe__indicators) {
                    .van-swipe__indicator {
                        width: 0.16rem;
                        height: 0.08rem;
                        border-radius: 0.04rem !important;
                        background-color: rgba(255, 255, 255, 0.3) !important;
                    }

                    .van-swipe__indicator--active {
                        background-color: var(--ex-primary-color) !important;
                    }

                }

                :deep(.van-swipe__indicators) {
                    right: 0.2rem !important;
                    left: auto !important;
                    transform: translateX(0) !important;
                }
            }

            .swipers2 {
                :deep(.van-swipe__indicators) {
                    top: 0.24rem !important;
                }
            }

            .card-1 {
                width: 3.35rem;
                height: 5.36rem;
                border-radius: 0.4rem;
                position: relative;
            }

            .card-2 {
                width: 3.35rem;
                height: 2.76rem;
                border-radius: 0.3rem;
                position: relative;
            }

            .card-3 {
                width: 3.35rem;
                height: 3rem;
                border-radius: 0.4rem;
                position: relative;
            }

            .card-4 {
                border-radius: 0.2rem;
                width: 3.35rem;
                height: 2.36rem;
                position: relative;
            }

            .card-right {
                display: flex;
                flex-direction: column;
                align-items: stretch;
                justify-content: space-between;
            }
        }

        .assets {
            border-radius: 0.3rem;
            width: 100%;
            height: 100%;
            overflow: auto;
            background: linear-gradient(0deg, #1C1C1C 0%, #2E2E2E 95.61%);

            .top {
                background-size: cover;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border-radius: 0.3rem;
                position: relative;
                top: -1px;
                font-weight: 400;
                text-align: center;

                .total {
                    color: var(--ex-white);
                    font-size: 0.24rem;
                }

                .login {
                    height: 0.6rem;
                    border-radius: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: var(--ex-primary-color);
                    font-size: 0.3rem;
                    color: var(--ex-bg-color);
                    margin: 0.28rem 0 0.2rem 0;
                    padding: 0 0.4rem;
                }

                .login_tip {
                    color: var(--ex-text-color3);
                    font-size: 0.24rem;
                }

                .amount {
                    color: var(--ex-primary-color);
                    font-weight: 700;
                    font-size: 0.48rem;
                    line-height: 0.48rem;
                    margin-top: 0.24rem;
                    padding: 0 0.1rem;
                    word-break: break-all;
                }

                .recharge {
                    height: 0.6rem;
                    padding: 0 0.6rem;
                    border-radius: 0.3rem;
                    background-color: var(--ex-primary-color);
                    color: var(--ex-bg-color);
                    font-size: 0.24rem;
                    font-weight: 400;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 0.36rem;
                }
            }
        }

        .recommend-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: var(--ex-white);
            font-size: 0.36rem;
            font-weight: 600;

            .recommend-icon {
                width: 0.84rem;
                height: 0.48rem;
                border-radius: 0.3rem;
                border: 1px solid var(--ex-white);
                padding: 0 0.22rem;
            }
        }

        .home-tabs-box {
            margin-top: 0.44rem;

            :deep(.van-tabs__nav) {
                background-color: var(--ex-none);

                .van-tab {
                    background-color: var(--ex-bg-color);
                    color: var(--ex-text-color2);
                    min-width: 1.2rem;
                }

                .van-tab--active {
                    color: var(--ex-black);
                    background-color: var(--ex-white);
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