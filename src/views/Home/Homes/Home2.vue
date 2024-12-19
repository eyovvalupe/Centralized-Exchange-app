<!-- 首页模板2 -->
<template>
    <div class="page-home2">
        <!-- 背景 -->
        <div class="home2-bg1">
            <img :src="getStaticImgUrl('/static/home2/bg.png')" alt="">
            <div class="bg_bottom"></div>
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

            <!-- 资产 -->
            <div class="assets">
                <div class="top"
                    :style="{ 'background-image': token ? `url('${getStaticImgUrl('/static/home2/assets_bg.svg')}')` : '' }">
                    <div class="total">
                        <span>总资产 (USDT)</span>
                    </div>
                    <div class="amount" v-if="token">{{ assets.total }}</div>
                    <div class="login" v-if="!token" @click="store.commit('setIsLoginOpen', true)">登录</div>
                    <div class="login_tip" v-if="!token">先登录方可查看资产</div>
                </div>
                <div class="bottom">
                    <div class="btn" @click="showAS = true">快速交易</div>
                    <div class="btn" @click="jump('topUp', true)">充值</div>
                </div>
            </div>

        </div>
    </div>

    <!-- 类型选择弹窗 -->
    <ActionSheet v-model:show="showAS" :actions="actions" @select="onSelect" :title="$t('home.fastTrading')">
    </ActionSheet>
</template>

<script setup>
import { ActionSheet } from "vant";
import { computed } from "vue";
import { getStaticImgUrl } from "@/utils/index.js"
import router from "@/router";
import store from "@/store";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const token = computed(() => store.state.token || "");
// 总资产
const assets = computed(() => store.state.assets || {});


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
</script>


<style lang="less" scoped>
.page-home2 {
    background-color: #000;
    min-height: 100%;
    position: relative;
    overflow: hidden;


    .home2-bg1 {
        position: absolute;
        width: 100%;
        height: auto;
        z-index: 0;
        top: -0.6rem;
        left: 0;

        .bg_bottom {
            background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.7) 40%, rgba(0, 0, 0, 0.9) 70%, #000 100%);
            height: 2rem;
            position: relative;
            top: -2rem;
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
        padding-bottom: 2rem;

        .home2-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.08rem 0.32rem;

            .icon {
                width: 0.72rem;
                height: 0.72rem;
                border-radius: 50%;
                border: 1px solid rgba(255, 255, 255, 0.5)
            }
        }

        .first {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin: 0.16rem 0 0 0;
            color: #fff;
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
                    color: #00F0FF;
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
            margin: 0 0.32rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 0.4rem;

            .btn {
                flex: 1;
                height: 0.98rem;
                border-radius: 1.2rem;
                background-color: #00F0FF;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #01060F;
                font-weight: 400;
                font-size: 0.32rem;
            }

            .btn2 {
                margin-right: 0.32rem;
                border: 1px solid #00F0FF;
                background-color: rgba(0, 0, 0, 0);
                color: #00F0FF;
            }
        }

        .assets {
            border-radius: 0.3rem;
            border: 1px solid #222626;
            margin: 0.4rem 0.32rem;

            .top {
                background-size: 100% 100%;
                background-color: rgba(255, 255, 255, 0.05);
                height: 2.4rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border-radius: 0.3rem;
                border: 1px solid #222626;
                position: relative;
                top: -1px;
                font-weight: 400;
                text-align: center;

                .total {
                    color: #fff;
                    font-size: 0.24rem;
                }

                .login {
                    height: 0.6rem;
                    border-radius: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #00F0FF;
                    font-size: 0.3rem;
                    color: #000;
                    margin: 0.28rem 0 0.2rem 0;
                    padding: 0 0.4rem;
                }

                .login_tip {
                    color: rgba(255, 255, 255, 0.50);
                    font-size: 0.24rem;
                }

                .amount {
                    color: #00F0FF;
                    font-weight: 700;
                    font-size: 0.48rem;
                    line-height: 0.48rem;
                    margin-top: 0.24rem;
                }
            }

            .bottom {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0.14rem 0;

                .btn {
                    flex: 1;
                    height: 0.52rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;

                    &:nth-child(1) {
                        border-right: 1px solid #222626;
                    }
                }
            }
        }
    }
}
</style>