<!-- 跟单详情 -->
<template>
    <div class="page-follow-detail" v-if="!isEmpty(info)">

        <Top :title="$t('copy.copy_belong_title')"></Top>

        <div class="title-box">
            <div class="avatar overflow-hidden">
                <img v-lazy="getStaticImgUrl(`static/avatar/${info.avatar}.png`)" alt="" />
            </div>
            <div class="left">
                <div class="top">
                    <div class="name">{{ info.name || '萨达萨达' }}</div>
                    <div class="level">{{ $t('copy.level', { level: info.lv || '--' }) }}</div>
                </div>
                <div class="bottom">
                    <div class="bottom-info">
                        <div class="icon"><img v-lazy="getStaticImgUrl('/static/home2/group.svg')" alt=""></div>
                        <div>{{ info.followers || '11' }}</div>
                    </div>
                </div>
            </div>
            <!-- <div class="btn ripple-btn" @click="plus">{{ $t('copy.copy_tab_tab1') }}</div> -->
        </div>

        <Tabs type="custom-line" v-model:active="active" animated :swipeable="false" :color="'var(--ex-primary-color)'"
            shrink>
            <Tab :title="$t('copy.copy_belong_tab1')" name="0">
                <div class="follow-box">
                    <div class="follow-info-box mb-[0.24rem] mx-[0.32rem]">
                        <div class="info-box pb-[0.12rem]">
                            <div class="flex justify-between mb-[0.48rem]">
                                <div class="flex ml-[0.28rem] mt-[0.28rem] items-center">
                                    <div class="w-[0.28rem] h-[0.28rem] mr-[0.2rem]">
                                        <img v-lazy="getStaticImgUrl('static/home2/point.svg')" alt="" />
                                    </div>
                                    <div class="right_left_effect text-[0.4rem]">带单情况</div>
                                </div>
                                <div class="w-[2.4rem] h-[0.6rem] rounded-[0.32rem] flex items-center justify-between px-[0.28rem] mr-[0.28rem] mt-[0.28rem] mask-btn"
                                    style="background-color: var(--ex-bg-white2);">
                                    <div class="text-[0.24rem] text-color">近一年</div>
                                    <div class="w-[0.32rem] h-[0.32rem]">
                                        <img v-lazy="getStaticImgUrl('static/img/common/down.svg')" alt="" />
                                    </div>
                                </div>
                            </div>


                            <div class="bar-box">
                                <div class="up-box" style="width: calc(100% * 10 /11);"></div>
                            </div>

                            <div class="navs">
                                <div class="nav" style="text-align: left;">
                                    <div class="name">{{ $t('copy.copy_belong_profit_days') }}</div>
                                    <div class="val up font-semibold">{{ info.windays }}{{
                                        $t('finance.portfolio_day_multi') }}</div>
                                </div>

                                <div class="nav" style="text-align: right;">
                                    <div class="name">{{ $t('copy.copy_belong_loss_days') }}</div>
                                    <div class="val down font-semibold">{{ info.lossdays }}{{
                                        $t('finance.portfolio_day_multi') }}
                                    </div>
                                </div>
                            </div>

                            <div class="mx-[0.12rem] h-[1.8rem] rounded-[0.32rem] px-[0.28rem] py-[0.42rem] flex flex-col justify-between"
                                style="background-color: var(--ex-bg-white2);">
                                <div class="w-full flex justify-between">
                                    <div class="text-[0.28rem] text-color2">胜率</div>
                                    <div class="text-[0.28rem] text-color">50%</div>
                                </div>
                                <div class="w-full flex justify-between">
                                    <div class="text-[0.28rem] text-color2">盈亏比</div>
                                    <div class="text-[0.28rem] text-color">1.36:1</div>
                                </div>
                            </div>

                            <!-- <div class="line">
                                <SparkLine v-if="points" :points="points" :ratio="1" />
                            </div> -->
                        </div>

                        <!-- <div class="per-box">
                            <div class="name">{{ $t('copy.copy_belong_sharing_ratio') }}</div>
                            <div class="val">{{ info.profitratio }}%</div>
                        </div> -->
                    </div>
                    <div class="h-[6rem] rounded-[0.32rem] p-[0.28rem] mb-[0.24rem] mx-[0.32rem]"
                        style="background-color: var(--ex-bg-white);">
                        <div class="flex items-center">
                            <div class="w-[0.28rem] h-[0.28rem] mr-[0.2rem]">
                                <img v-lazy="getStaticImgUrl('static/home2/point.svg')" alt="" />
                            </div>
                            <div class="right_left_effect text-[0.4rem]">带单员总览</div>
                        </div>
                        <div class="w-full h-full py-[0.6rem] flex flex-col justify-between">
                            <div class="w-full flex">
                                <div class="flex-1 flex flex-col">
                                    <div class="text-[0.28rem] text-color2 text-center mb-[0.24rem]">带单天数</div>
                                    <div class="text-[0.4rem] font-semibold text-center">360</div>
                                </div>
                                <div class="flex-1 flex flex-col">
                                    <div class="text-[0.28rem] text-color2 text-center mb-[0.24rem]">交易员带单资产</div>
                                    <div class="text-[0.4rem] font-semibold text-center">1111111</div>
                                </div>
                            </div>
                            <div class="w-full flex">
                                <div class="flex-1 flex flex-col">
                                    <div class="text-[0.28rem] text-color2 text-center mb-[0.24rem]">带单规模</div>
                                    <div class="text-[0.4rem] font-semibold text-center">8989</div>
                                </div>
                                <div class="flex-1 flex flex-col">
                                    <div class="text-[0.28rem] text-color2 text-center mb-[0.24rem]">当前跟单用户收益</div>
                                    <div class="text-[0.4rem] font-semibold text-center">1111111</div>
                                </div>
                            </div>
                            <div class="w-full flex">
                                <div class="flex-1 flex flex-col">
                                    <div class="text-[0.28rem] text-color2 text-center mb-[0.24rem]">跟单人数</div>
                                    <div class="text-[0.4rem] font-semibold text-center">28/50</div>
                                </div>
                                <div class="flex-1 flex flex-col">
                                    <div class="text-[0.28rem] text-color2 text-center mb-[0.24rem]">分润比例</div>
                                    <div class="text-[0.4rem] font-semibold text-center">10%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="h-[7.9rem] rounded-[0.32rem] mb-[0.24rem] p-[0.28rem] mx-[0.32rem]"
                        style="background-color: var(--ex-bg-white);">
                        <div class="flex justify-between items-center mb-[0.4rem]">
                            <div class="flex items-center">
                                <div class="w-[0.28rem] h-[0.28rem] mr-[0.2rem]">
                                    <img v-lazy="getStaticImgUrl('static/home2/point.svg')" alt="" />
                                </div>
                                <div class="right_left_effect text-[0.4rem]">收益率</div>
                            </div>
                            <div class="flex">
                                <div class="w-[1.6rem] h-[0.6rem] rounded-[1rem] flex items-center justify-center text-[0.32rem]  mr-[0.12rem]"
                                    :class="activeRatio == 0 ? 'font-semibold text-black ripple-primary bg-white' : 'text-color2 ripple-btn'"
                                    :style="activeRatio == 1 ? 'background-color: var(--ex-bg-white2);' : ''"
                                    @click="activeRatio = 0">
                                    收益率
                                </div>
                                <div class="w-[1.6rem] h-[0.6rem] rounded-[1rem] flex items-center justify-center text-[0.32rem]"
                                    :class="activeRatio == 1 ? 'font-semibold text-black ripple-primary bg-white' : 'text-color2 ripple-btn'"
                                    :style="activeRatio == 0 ? 'background-color: var(--ex-bg-white2);' : ''"
                                    @click="activeRatio = 1">
                                    收益率
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center justify-between mb-[0.36rem]">
                            <div class="text-[0.6rem] font-semibold" :class="true ? 'text-up' : 'text-down'">
                                +67.5%
                            </div>
                            <div class="flex items-center">
                                <div class="text-[0.24rem] text-color mr-[0.1rem]">近一年</div>
                                <div class="w-[0.32rem] h-[0.32rem]">
                                    <img v-lazy="getStaticImgUrl('static/img/common/down.svg')" alt="" />
                                </div>
                            </div>
                        </div>
                        <div class="line">
                            <SparkLine v-if="points" :points="points" :ratio="1" />
                        </div>
                    </div>
                    <div class="rounded-[0.32rem] mb-[0.4rem] p-[0.28rem] mx-[0.32rem]"
                        style="background-color: var(--ex-bg-white);">
                        <div class="flex justify-between items-center mb-[0.4rem] mb-[0.4rem]">
                            <div class="flex items-center">
                                <div class="w-[0.28rem] h-[0.28rem] mr-[0.2rem]">
                                    <img v-lazy="getStaticImgUrl('static/home2/point.svg')" alt="" />
                                </div>
                                <div class="right_left_effect text-[0.4rem]">收益率</div>
                            </div>
                            <div class="w-[0.48rem] h-[0.48rem] rounded-[0.1rem] mask-btn">
                                <img v-lazy="getStaticImgUrl('static/img/common/next.svg')" alt="" />
                            </div>
                        </div>
                        <div class="rounded-[0.32rem] h-[1.72rem] flex items-center justify-center mb-[0.24rem]"
                            style="background-color: var(--ex-bg-white2);">
                            <div class="flex flex-col items-center">
                                <div class="text-[0.28rem] text-color2 mb-[0.24rem]">累计跟单用户</div>
                                <div class="text-[0.4rem] font-semibold">360</div>
                            </div>
                        </div>
                        <div class="w-full rounded-[0.32rem] h-[0.96rem] flex items-center px-[0.28rem] justify-between mb-[0.12rem]"
                            v-for="(item, i) in [1, 2, 3, 4, 5]" style="background-color: var(--ex-bg-white2);">
                            <div class="flex items-center">
                                <div class="w-[0.4rem] h-[0.4rem] rounded-[0.2rem] overflow-hidden mr-[0.16rem]">
                                    <img v-lazy="getStaticImgUrl('static/avatar/1.png')" alt="" />
                                </div>
                                <div class="text-[0.28rem]">{{ 'asfasdf@gmail.com' }}</div>
                            </div>
                            <div class="text-[0.28rem] font-semibold" :class="true ? 'text-up' : 'text-down'">+234234
                            </div>
                        </div>
                    </div>
                    <div class="w-full h-[1.6rem] rounded-tl-[0.32rem] rounded-tr-[0.32rem] px-[0.28rem] pt-[0.2rem]"
                        style="background-color: var(--ex-bg-white);">
                        <div class="w-full h-[0.92rem] rounded-[1.3rem] ripple-btn text-[0.36rem] font-semibold flex items-center justify-center"
                            @click="plus" style="background-color: var(--ex-primary-color);">{{ $t('copy.copy_tab_tab1')
                            }}</div>
                    </div>
                </div>
            </Tab>
            <Tab :title="$t('copy.copy_belong_tab2')" name="1">
                <div class="follow-box">
                    <div class="table">
                        <div class="tr mask-btn" v-if="orders.length" v-for="(item, i) in orders" :key="i">
                            <div class="td td-s">
                                <div class="name">{{ item.symbol }}</div>
                                <div class="fever">{{ item.lever }}X</div>
                            </div>
                            <div class="td">
                                <div class="fever tag bg-up up" v-if="item.offset == 'long'">{{
                                    $t('copy.copy_belong_open1') }}</div>
                                <div class="fever tag bg-down down" v-if="item.offset == 'short'">{{
                                    $t('copy.copy_belong_open2') }}</div>
                                <div>{{ item.time }}{{ item.unit }}</div>
                            </div>
                            <div class="td">{{ item.amount }}</div>
                            <div class="td td2 td-l">{{ item.amountreturn }}</div>
                        </div>
                        <NoData v-if="!orders.length" />
                    </div>

                </div>
            </Tab>
            <Tab :title="$t('copy.copy_belong_tab3')" name="2">
                <div class="follow-box">
                    <div class="table">
                        <div class="th">
                            <div class="td td2">{{ $t('copy.copy_belong_subtitle5') }}</div>
                            <div class="td">{{ $t('copy.copy_belong_subtitle6') }}</div>
                            <div class="td td-l">{{ $t('copy.copy_belong_subtitle7') }}</div>
                        </div>
                        <div class="tr mask-btn" v-if="follows.length" v-for="(item, i) in follows" :key="i">
                            <div class="td td2">
                                <div class="user">
                                    <div class="avatar overflow-hidden">
                                        <img v-lazy="getStaticImgUrl(`static/avatar/${item.avatar || 1}.png`)" alt="" />
                                    </div>
                                    <div>{{ item.name }}</div>
                                </div>
                            </div>
                            <div class="td">
                                <div>{{ item.amount }}</div>
                            </div>
                            <div class="td td-l up" :class="[item.returnamount < 0 ? 'down' : 'up']">
                                <div class="mb-[0.16rem]">{{ item.returnamount }}</div>
                                <div class="w-[1.08rem] h-[0.48rem] rounded-[0.12rem] flex items-center justify-center text-white" :class="item.returnrate > 0 ? 'bg-up' : 'bg-down'">{{ item.returnrate > 0 ? '+' : '' }}{{
                                    item.returnrate }}%</div>
                            </div>
                        </div>
                        <NoData v-if="!follows.length" />
                    </div>
                </div>
            </Tab>
        </Tabs>
        <!-- 跟单弹窗 -->
        <BottomPopup v-model:show="showPlus" :title="t('copy.title')" position="bottom" round closeable teleport="body">
            <FollowSubmit v-if="showPlus" @success="showPlus = false" :item="info" :mode="'follow'" />
        </BottomPopup>
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue";
import { getStaticImgUrl } from "@/utils/index.js"
import { computed, ref, watch } from "vue"
import NoData from "@/components/NoData"
import { Tab, Tabs, Button } from "vant";
import { _copyGet, _copyOrders, _copyUsers } from "@/api/api"
import SparkLine from "@/components/SparkLine.vue";
import { useRoute } from "vue-router"
import BottomPopup from "@/components/BottomPopup.vue";
import FollowSubmit from "../components/FollowSubmit.vue"
import { useI18n } from "vue-i18n";
import { isEmpty } from "@/utils/isEmpty";
import store from "@/store";
import { getPoints } from "@/utils/index.js"
const points = getPoints('id-123456', 100)

const { t } = useI18n()
const route = useRoute()
const active = ref(1)
const activeRatio = ref(0)
// 跟单
const showPlus = ref(false)
const plus = () => {
    showPlus.value = true
}


// 跟单详情
const copyItem = computed(() => store.state.copyItem || {})
const info = ref({})
const orders = ref([])
const follows = ref([])

const getInfo = () => {
    if (isEmpty(copyItem.value)) return;
    console.log(copyItem.value.id)
    // 详情
    _copyGet({
        id: copyItem.value.id
    }).then(res => {
        console.log('info ====> ', res.data)
        info.value = res.data || {}
    }).catch(err => console.error(err))
        .finally(() => {

        });
    // 带单
    _copyOrders({
        id: copyItem.value.id,
        status: 'open',
        page: 1
    }).then(res => {
        console.log('orders =======> ', res.data)
        orders.value = res.data
    }).catch(err => console.error(err)).finally(() => {

    });
    // 跟单
    _copyUsers({
        id: copyItem.value.id,
    }).then(res => {
        follows.value = res.data || []
        console.log("followers =======>", res.data)
    }).catch((err) => console.error(err)).finally(() => {

    });
}
getInfo()

watch(copyItem, (val) => {
    getInfo();
})

</script>

<style lang="less" scoped>
.page-follow-detail {
    padding-top: 1.28rem;

    :deep(.van-tabs__nav) {
        padding-left: 0.24rem;
    }

    .title-box {
        padding: 0.16rem 0.32rem;
        margin-bottom: 0.32rem;
        width: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;

        .avatar {
            width: 0.8rem;
            height: 0.8rem;
            border-radius: 50%;
            // background-color: var(--ex-bg-color3);
            margin-right: 0.12rem;
            display: flex;
            // align-items: center;
            // justify-content: center;
            // font-size: 0.24rem;
            overflow: hidden;
        }

        .left {
            flex: 1;
            padding-left: 0.12rem;

            .top {
                display: flex;
                align-items: center;
                justify-content: flex-start;



                .name {
                    font-size: 0.32rem;
                    font-weight: 600;
                    line-height: 1.4;
                }

                .level {
                    margin-left: 0.08rem;
                    height: 0.34rem;
                    padding: 0 0.08rem;
                    border-radius: 0.12rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--ex-black);
                    background-color: var(--ex-status-color1);
                }
            }

            .bottom {
                margin-top: 0.04rem;
                display: flex;
                align-items: center;
                justify-content: flex-start;

                .bottom-info {
                    background-color: var(--ex-bg-color3);
                    height: 0.36rem;
                    padding: 0 0.1rem;
                    border-radius: 0.12rem;
                    align-items: center;
                    display: inline-flex;
                    font-size: 0.2rem;

                    .icon {
                        width: 0.2rem;
                        height: 0.2rem;
                        margin-right: 0.04rem;
                        position: relative;
                        top: -0.01rem;
                    }
                }

                .info-a {
                    font-size: 0.24rem;
                    margin-left: 0.16rem;
                }
            }
        }

        .btn {
            background-color: var(--ex-primary-color);
            color: var(--ex-white);
            height: 0.68rem;
            border-radius: 0.5rem;
            padding: 0 0.36rem;
            min-width: 1.4rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.28rem;
        }
    }

    .follow-box {
        padding-top: 0.4rem;
    }

    .follow-info-box {
        // padding: 0.28rem;
        border-radius: 0.32rem;
        background-color: var(--ex-bg-color3);

        .info-box {
            border-radius: 0.32rem;
            background-color: var(--ex-bg-color3);
            // padding-top: 0.12rem;

            .bar-box {
                height: 0.48rem;
                border-radius: 0.48rem;
                background-color: var(--ex-down-color);
                overflow: hidden;
                margin: 0.04rem 0.28rem 0.24rem 0.28rem;

                .up-box {
                    height: 100%;
                    background-color: var(--ex-up-color);
                    position: relative;
                    transition: all ease-in .3s;

                    &::after {
                        content: '';
                        width: 0.3rem;
                        background-color: var(--ex-up-color);
                        border-right: 0.1rem solid var(--ex-bg-color);
                        height: 100%;
                        right: 0;
                        top: 0;
                        position: absolute;
                        transform: skewX(-30deg) translateX(50%);
                    }
                }
            }

            .tr {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin: 0.28rem 0;

                .tr-item {
                    text-align: left;
                    padding: 0 0.28rem;

                    &:nth-child(2) {
                        text-align: right;
                    }

                    .name {
                        color: var(--ex-placeholder-color);
                        font-size: 0.28rem;
                        margin-bottom: 0.2rem;
                    }

                    .val {
                        font-size: 0.32rem;
                        color: var(--ex-white);
                    }

                    .num {
                        font-size: 0.36rem;
                    }
                }
            }

            .navs {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 0.28rem 0.24rem 0.28rem;

                .nav {
                    .name {
                        color: var(--ex-placeholder-color);
                        font-size: 0.24rem;
                        margin-bottom: 0.16rem;
                    }

                    .val {
                        font-size: 0.28rem;
                        color: var(--ex-white);
                    }
                }
            }

            .line {
                height: 1.6rem;
            }
        }

        .per-box {
            height: 1.12rem;
            border-radius: 0.32rem;
            margin-top: 0.2rem;
            background-color: var(--ex-bg-color);
            padding: 0 0.28rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.28rem;

            .name {
                color: var(--ex-placeholder-color);
            }

            .val {
                color: var(--ex-white);
            }
        }
    }

    .table {
        width: calc(100% - 0.64rem);
        margin: 0 auto;

        .th {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;
            height: 0.6rem;
            padding-bottom: 0.2rem;
            border-bottom: 1px solid var(--ex-border-color4);
            color: var(--ex-placeholder-color);
            font-size: 0.22rem;
        }

        .tr {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;
            color: var(--ex-white);
            font-size: 0.24rem;
            margin-top: 0.2rem;
            border-radius: 0.32rem;
            height: 1.28rem;
            padding: 0 0.24rem;
            background-color: var(--ex-bg-color3);
        }



        .td {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: center;

            .name {
                font-size: 0.28rem;
            }

            .fever {
                margin-top: 0.2rem;
                height: 0.3rem;
                padding: 0 0.12rem;
                border-radius: 0.24rem;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: rgba(255, 255, 255, 0.1);
            }

            .tag {
                margin-bottom: 0.2rem;
                margin-top: 0;
                height: 0.36rem;

            }

            .user {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                font-size: 0.28rem;

                .avatar {
                    width: 0.4rem;
                    height: 0.4rem;
                    margin-right: 0.12rem;
                    border-radius: 50%;
                    background-color: var(--ex-bg-color);
                }
            }
        }

        .td-s {
            align-items: flex-start;
        }

        .td2 {
            flex: 1.5;
        }

        .td-l {
            align-items: flex-end;
        }
    }

    .right_left_effect {
        animation-name: animation1;
        animation-duration: 0.5s;
        animation-timing-function: ease-in;
        animation-fill-mode: forwards;
    }

    @keyframes animation1 {
        0% {
            transform: translateX(100%);
        }

        100% {
            transform: translateX(0);
        }
    }

    .submit {
        width: 100%;
        height: 0.92rem;
        background-color: var(--ex-bg-primary);
    }
}
</style>