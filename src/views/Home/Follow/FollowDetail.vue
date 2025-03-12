<!-- 跟单详情 -->
<template>
    <div class="page-follow-detail">

        <Top :title="$t('copy.copy_belong_title')"></Top>
        <div v-if="loading" class="h-[70vh] flex items-center justify-center">
            <Loading color="var(--ex-primary-color)" />
        </div>
        <div v-else-if="!isEmpty(info)">
            <!-- 头部用户信息 -->
            <div class="title-box">
                <div class="avatar overflow-hidden">
                    <img v-lazy="getStaticImgUrl(`static/avatar/${info.avatar}.png`)" alt="" />
                </div>
                <div class="left">
                    <div class="top">
                        <div class="name">{{ info.name || '' }}</div>
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

            <Tabs type="custom-line" v-model:active="active"  :color="'var(--ex-primary-color)'"
                shrink>
                <Tab :title="$t('copy.copy_belong_tab1')" name="0">
                    <div class="follow-box">
                        <!-- 带单情况 -->
                        <div class="follow-info-box mb-[0.24rem] mx-[0.32rem]">

                            <div class="info-box pb-[0.12rem]">
                                <div class="flex justify-between mb-[0.48rem]">
                                    <div class="flex ml-[0.28rem] mt-[0.28rem] items-center">
                                    
                                        <div class="text-[0.4rem]">{{ $t('copy.copy_order_status') }}
                                        </div>
                                    </div>
                                    <!-- <div class="w-[2.4rem] h-[0.6rem] rounded-[0.32rem] flex items-center justify-between px-[0.28rem] mr-[0.28rem] mt-[0.28rem] mask-btn"
                                        style="background-color: var(--ex-bg-white2);">
                                        <div class="text-[0.24rem] text-color">{{ $t('copy.copy_order_time1') }}</div>
                                        <div class="w-[0.32rem] h-[0.32rem]">
                                            <img v-lazy="getStaticImgUrl('static/img/common/down.svg')" alt="" />
                                        </div>
                                    </div> -->
                                </div>


                                <div class="bar-box">
                                    <div class="up-box" :style="{ width: winratePercentage }"></div>
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
                                <div class="mx-[0.12rem] h-[2.4rem] rounded-[0.32rem] px-[0.28rem] py-[0.42rem] flex flex-col justify-between"
                                    style="background-color: var(--ex-bg-white2);">
                                    <div class="w-full flex justify-between">
                                        <div class="text-[0.28rem] text-color2">{{ $t('copy.copy_profit_rate') }}</div>
                                        <div class="text-[0.28rem] text-color">{{ info.winrate }} %</div>
                                    </div>
                                    <div class="w-full flex justify-between">
                                        <div class="text-[0.28rem] text-color2">{{ $t('copy.copy_belong_pl_rate') }}</div>
                                        <div class="text-[0.28rem] text-color">{{ info.profitlossratio }}:1</div>
                                    </div>
                                    <div class="w-full flex justify-between">
                                        <div class="text-[0.28rem] text-color2">{{ $t('copy.copy_belong_profit_rate') }}
                                        </div>
                                        <div class="text-[0.28rem] text-color">{{ info.returnrate > 0 ? '+' +
                                            info.returnrate :
                                            info.returnrate }}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 带单员总览 -->
                        <div class="rounded-[0.32rem] p-[0.28rem] mb-[0.24rem] mx-[0.32rem]"
                            style="background-color: var(--ex-bg-white);">
                            <div class="flex items-center">
                                <div class="text-[0.4rem]">{{ $t('copy.copy_leader_overview') }}</div>
                            </div>
                            <div class="w-full pt-[0.6rem] flex flex-col">
                                <div class="h-[2.4rem] flex flex-col justify-between mb-[0.6rem]">
                                    <div class="w-full flex">
                                        <div class="flex-1 flex flex-col">
                                            <div class="text-[0.28rem] text-color2 text-center mb-[0.1rem]">{{ $t('copy.copy_belong_days') }}</div>
                                            <div class="text-[0.4rem] mt-[0.14rem] font-semibold text-center">{{ info.days }}
                                            </div>
                                        </div>
                                        <div class="flex-1 flex flex-col">
                                            <div class="text-[0.28rem] text-color2 text-center mb-[0.1rem]">{{
                                                $t('copy.copy_leader_order_size') }}</div>
                                            <div class="text-[0.4rem] mt-[0.14rem] font-semibold text-center">{{ info.amount }}</div>
                                        </div>
                                    </div>
                                    <div class="w-full flex">

                                        <div class="flex-1 flex flex-col">
                                            <div class="text-[0.28rem] text-color2 text-center mb-[0.1rem]">{{
                                                $t('copy.copy_leader_followers_profit') }}</div>
                                            <div class="text-[0.4rem] mt-[0.14rem] font-semibold text-center">{{
                                                info.returnamount }}
                                            </div>
                                        </div>
                                        <div class="flex-1 flex flex-col">
                                            <div class="text-[0.28rem] text-color2 text-center mb-[0.1rem]">{{
                                                $t('copy.copy_leader_followers_num') }}</div>
                                            <div class="text-[0.4rem] mt-[0.14rem] font-semibold text-center">{{
                                                info.followers }}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="w-full flex h-[1.12rem] rounded-[0.32rem] items-center px-[0.28rem] justify-between"
                                    style="background-color: var(--ex-bg-white2);">
                                    <div class="text-[0.28rem] text-color2 text-center">{{
                                        $t('copy.copy_profit_divide_ratio') }}</div>
                                    <div class="text-[0.3rem] font-semibold text-center">{{ info.profitratio * 100 }}%</div>
                                </div>
                            </div>
                        </div>
                        <!-- 收益率 -->
                        <div class="h-[7.9rem] rounded-[0.32rem] mb-[0.24rem] p-[0.28rem] mx-[0.32rem]"
                            style="background-color: var(--ex-bg-white);">
                            <div class="flex justify-between items-center mb-[0.4rem] h-[0.6rem]">
                                <div class="flex items-center">
                                    <div class="text-[0.4rem]">{{ $t('copy.copy_belong_profit_rate') }}
                                    </div>
                                </div>
                                <div class="flex  bg-white1 rounded-full">
                                    <div class="w-[1.6rem] h-[0.6rem] rounded-[1rem] flex items-center justify-center text-[0.32rem]"
                                        :class="activeRatio == 0 ? 'font-semibold text-black ripple-primary bg-white' : 'text-color2 ripple-btn'"
                                    
                                        @click="activeRatio = 0">
                                        {{ $t('copy.copy_belong_profit_rate') }}
                                    </div>
                                    <div class="w-[1.6rem] h-[0.6rem] rounded-[1rem] flex items-center justify-center text-[0.32rem]"
                                        :class="activeRatio == 1 ? 'font-semibold text-black ripple-primary bg-white' : 'text-color2 ripple-btn'"
                                    
                                        @click="activeRatio = 1">
                                        {{ $t('copy.copy_leader_profit_amount') }}
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center justify-between mb-[0.36rem]">
                                <div class="text-[0.6rem] font-[600]" :class="true ? 'text-up' : 'text-down'">
                                    {{ info.returnrate > 0 ? '+' + info.returnrate : info.returnrate }}%
                                </div>
                                <!-- <div class="flex items-center">
                                    <div class="text-[0.24rem] text-color mr-[0.1rem]">{{ $t('copy.copy_order_time1') }}
                                    </div>
                                    <div class="w-[0.32rem] h-[0.32rem]">
                                        <img v-lazy="getStaticImgUrl('static/img/common/down.svg')" alt="" />
                                    </div>
                                </div> -->
                            </div>
                            <div class="flex flex-col">
                                <div class="flex w-full">
                                    <div class="flex flex-col mt-[0.2rem] mr-[0.2rem]">
                                        <div class="w-[1rem] text-[0.24rem] text-color2 mb-[0.38rem]"
                                            v-for="(item, i) in percentageAxios">
                                            {{ item + '%' }}
                                        </div>
                                    </div>
                                    <div class="flex-1">
                                        <img v-lazy="getStaticImgUrl('static/img/follow/chart.svg')" alt="" />
                                    </div>
                                </div>
                                <div class="flex pl-[1.2rem] justify-between">
                                    <div class="text-[0.24rem] text-color2" v-for="(item, i) in dateAxios">{{ item }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- 跟单用户 -->
                        <div class="rounded-[0.32rem] mb-[0.4rem] px-[0.28rem] py-[0.32rem] mx-[0.32rem]"
                            style="background-color: var(--ex-bg-white);">
                            <div class="flex justify-between items-center mb-[0.4rem]">
                                <div class="flex items-center">
                                    <div class="text-[0.4rem]">{{ $t('copy.copy_belong_tab3') }}
                                    </div>
                                </div>
                                
                            </div>
                            <div class="rounded-[0.32rem] h-[1.5rem] flex items-center justify-center"
                                style="background-color: var(--ex-bg-white2);">
                                <div class="flex flex-col items-center">
                                    <div class="text-[0.28rem] text-color2 mb-[0.2rem]">{{ $t('copy.copy_follower_amount')
                                        }}</div>
                                    <div class="text-[0.3rem] font-semibold">{{ follows.length }}</div>
                                </div>
                            </div>
                            <div class="h-[0.12rem]"></div>
                            <div class="w-full rounded-[0.32rem] h-[0.96rem] flex items-center px-[0.28rem] justify-between mt-[0.12rem]"
                                v-if="follows.length" v-for="(item, i) in follows"
                                style="background-color: var(--ex-bg-white2);">
                                <div class="flex items-center">
                                    <div class="w-[0.4rem] h-[0.4rem] rounded-[0.2rem] overflow-hidden mr-[0.16rem]">
                                        <img v-lazy="getStaticImgUrl('static/avatar/1.png')" alt="" />
                                    </div>
                                    <div class="text-[0.28rem]">{{ item.name }}</div>
                                </div>
                                <div class="text-[0.28rem] font-semibold"
                                    :class="item.returnamount >= 0 ? 'text-up' : 'text-down'">{{ item.returnamount > 0 ? '+'
                                        + item.returnamount : item.returnamount }}</div>
                            </div>
                            <div v-if="!follows.length">
                                <NoData />
                            </div>
                        </div>
                        <div class="h-[1.6rem]"></div>
                    </div>
                </Tab>
                <Tab :title="$t('copy.copy_belong_tab2')" name="1">
                    <div class="follow-box">
                        <div class="flex h-[0.6rem] leading-[0.4rem] mx-[0.32rem] border-b-[0.02rem]">
                            <div class="w-1/4 text-[0.24rem] text-color2">{{ $t('copy.copy_belong_subtitle1')
                                }}</div>
                            <div class="w-1/4 text-[0.24rem] text-color2">{{ $t('copy.copy_belong_subtitle2')
                                }}</div>
                            <div class="w-1/4 text-[0.24rem] text-color2">{{ $t('copy.copy_belong_subtitle3')
                                }}</div>
                            <div class="flex-1 text-end text-[0.24rem] text-color2">{{
                                $t('copy.copy_belong_subtitle4') }}</div>

                        </div>
                        <div class="table">
                            <div class="w-full flex p-[0.24rem] bg-color3 rounded-[0.32rem] mt-[0.2rem] mask-btn" v-if="orders.length" v-for="(item, i) in orders" :key="i">
                                <div class="w-1/4">
                                    <div class="name">{{ item.name }}</div>
                                    <div class="flex">
                                        <div class="fever">{{ item.lever }}X</div>
                                    </div>
                                </div>
                                <div class="w-1/4 flex flex-col">
                                    <div class="w-[0.7rem] h-[0.36rem] rounded-[0.12rem] status-up flex items-center justify-center text-[0.24rem] mb-[0.18rem]">{{ $t('copy.copy_belong_open1') }}</div>
                                    <div class="w-[0.7rem] h-[0.36rem] rounded-[0.12rem] status-down items-center justify-center text-[0.24rem]"
                                        v-if="false">{{ $t('copy.copy_belong_open2') }}</div>
                                    <div class="">{{ item.time }}{{ item.unit }}</div>
                                </div>
                                <div class="w-1/4 flex items-center">{{ item.amount }}</div>
                                <div class="w-1/4 flex items-center justify-end">{{ item.amountreturn }}</div>
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
                                        <div class="max-w-[3rem] truncate">{{ item.name }}</div>
                                    </div>
                                </div>
                                <div class="td">
                                    <div>{{ item.amount }}</div>
                                </div>
                                <div class="td td-l up" :class="[item.returnamount < 0 ? 'down' : 'up']">
                                    <div class="mb-[0.16rem]">{{ item.returnamount }}</div>
                                    <div class="w-[1.08rem] h-[0.48rem] rounded-[0.12rem] flex items-center justify-center text-white"
                                        :class="item.returnrate >= 0 ? 'bg-up' : 'bg-down'">{{ item.returnrate > 0 ? '+' : ''
                                        }}{{
                                            item.returnrate }}%</div>
                                </div>
                            </div>
                            <NoData v-if="!follows.length" />
                        </div>
                    </div>
                </Tab>
            </Tabs>

            <div class="w-full max-width fixed bg-[rgba(26_27_36_0.30)] left-0 right-0 mx-auto bottom-0 h-[1.6rem] rounded-tl-[0.32rem] rounded-tr-[0.32rem] px-[0.28rem] pt-[0.2rem]" v-if="active == 0" style="backdrop-filter: blur(25px);box-shadow: 0px -1px 1px 0px rgba(255, 255, 255, 0.10);">
                <div class="w-full h-[0.92rem] rounded-[1.3rem] ripple-btn text-[0.36rem] font-semibold flex items-center justify-center"
                    @click="plus" style="background-color: var(--ex-primary-color);">{{ $t('copy.copy_tab_tab1')
                    }}</div>
            </div>
            <!-- 跟单弹窗 -->
            <BottomPopup v-model:show="showPlus" :title="t('copy.title')" position="bottom" round closeable teleport="body">
                <FollowSubmit v-if="showPlus" @success="onSuccess" :item="info" :mode="'follow'" />
            </BottomPopup>

            <!-- 详情 -->
            <Popup teleport="body" v-model:show="showInfo" position="right" :style="{ height: '100%', width: '100%' }">
                <FollowInfo v-if="showInfo" @back="showInfo = false" style="width: 100%;height: 100%;" />
            </Popup>
        </div>
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue";
import { getStaticImgUrl } from "@/utils/index.js"
import { computed, ref, watch } from "vue"
import NoData from "@/components/NoData.vue"
import { Tab, Tabs, Popup, showToast, Loading } from "vant";
import { _copyGet, _copyOrders, _copyUsers } from "@/api/api"
import { useRoute } from "vue-router"
import BottomPopup from "@/components/BottomPopup.vue";
import FollowSubmit from "../components/FollowSubmit.vue"
import FollowInfo from "./FollowInfo.vue";
import { useI18n } from "vue-i18n";
import { isEmpty } from "@/utils/isEmpty";
import store from "@/store";
import { getPoints } from "@/utils/index.js"
import follow from "@/store/follow.js";
const points = getPoints('id-123456', 100)
const showInfo = ref(false)
const token = computed(() => store.state.token)
const { t } = useI18n()
const route = useRoute()
const active = ref(3)
const activeRatio = ref(0)
// 跟单
const showPlus = ref(false)
const plus = () => {
    if (!token.value) {
        showToast('请先登录')
        store.commit("setIsLoginOpen", true);
        return;
    }
    showPlus.value = true
}

const percentageAxios = ['100.00', '80.00', '60.00', '40.00', '20.00', '0.00', '-20.00', '-40.00']
const dateAxios = ['07/22', '09/06', '10/22', '12/07', '01/22']
const winratePercentage = computed(() => {
    const winDays = Number(info.value.windays) || 0;
    const lossDays = Number(info.value.lossdays) || 0;
    const total = winDays + lossDays;

    if (total == 0) return '0%'
    return `${(winDays / total * 100).toFixed(2)}%`
})
// 跟单详情
const copyItem = computed(() => store.state.copyItem || {})
const info = ref({})
const orders = ref([])
const follows = ref([])
const loading = ref(false)
const getInfo = () => {
    if (isEmpty(copyItem.value)) return;
    loading.value = true
    // 详情
    _copyGet({
        id: copyItem.value.id
    }).then(res => {
        console.log('info ====> ', res.data)
        info.value = res.data || {}
    }).catch(err => console.error(err))
    .finally(() => {
        loading.value = false 
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

const onSuccess = ()=>{
    showPlus.value = false
    store.commit('setCopyItemDetail', info.value)
    showInfo.value = true
}

</script>

<style lang="less" scoped>
.page-follow-detail {
    padding-top: 0.88rem;

    :deep(.van-tabs__nav) {
        height:0.64rem;
        padding-left: 0.24rem;
    }

    .title-box {
        padding: 0.2rem 0.32rem 0.48rem 0.32rem;
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
                    color:var(--ex-text-color);
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
        padding-top: 0.32rem;
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
                padding: 0 0.28rem 0.28rem 0.28rem;

                .nav {
                    .name {
                        color: var(--ex-text-color3);
                        font-size: 0.32rem;
                        margin-bottom: 0.2rem;
                    }

                    .val {
                        font-size: 0.4rem;
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
            gap: 0.1rem;
        }

        .name {
            font-size: 0.28rem;
            margin-bottom: 0.18rem;
            line-height: 0.36rem;
        }

        .fever {
          
            height: 0.3rem;
            padding: 0 0.12rem;
            border-radius: 0.24rem;
            background-color: var(--ex-bg-white1);
            
        }

        .td {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: center;

           
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
    
    .submit {
        width: 100%;
        height: 0.92rem;
        background-color: var(--ex-bg-primary);
    }
}
</style>