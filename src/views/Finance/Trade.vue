<template>
    <div class="staking_mining w-full">
        <Top :title="t('finance.portfolio_mining_title')" />
        <div class="mt-[1.5rem] px-[0.32rem]">

            <div class="px-[0.28rem] py-[0.4rem] mb-[0.32rem] bg-color6 flex flex-col rounded-[0.32rem]">
                <div class="flex items-center mb-[0.32rem]">
                    <div class="mr-[0.2rem]">
                        <img :src="getStaticImgUrl(`/static/home2/point.svg`)" alt="img" />
                    </div>
                    <div class="text-[0.4rem]" :class="loaded ? 'right_left_effect' : ''">{{
                        t('finance.portfolio_mining_subTitle1') }}</div>
                </div>
                <div class="flex mb-[0.6rem] justify-between">
                    <div class="flex items-center relative" v-for="(item, i) in itemsMap" v-if="itemsMap.length">
                        <div class="flex flex-col bg-color2 px-[0.2rem] py-[0.32rem] rounded-[0.32rem] items-center"
                            :class="itemsMap.length == 3 ? 'w-[2rem]' : itemsMap.length == 2 ? 'w-[3rem]' : 'w-[3rem]'">
                            <div class="w-[0.96rem] h-[0.96rem] mb-[0.32rem]">
                                <img :src="getStaticImgUrl(`/static/img/crypto/${item.currency}.svg`)" alt="img" />
                            </div>
                            <div class="mb-[0.24rem]">{{ item.currency }}</div>
                            <div :class="item.ratio > 0 ? 'up' : 'down'">{{ item.ratio ? (item.ratio > 0 ? '+' +
                                item.ratio : item.ratio) + '%' : '--' }}</div>
                        </div>
                        <div class="absolute w-[0.6rem] h-[0.6rem] z-[1]"
                            :class="itemsMap.length == 3 ? 'right-[-0.36rem]' : itemsMap.length == 2 ? 'right-[-0.45rem]' : ''"
                            v-if="i < itemsMap.length - 1"><img :src="getStaticImgUrl(`/static/img/finance/plus.svg`)"
                                alt="img" /></div>
                    </div>
                </div>
                <!-- 挖矿详情 -->
                <div class="w-full flex flex-col">
                    <div class="w-full flex justify-between mb-[0.2rem]">
                        <div class="text-color3">{{ t('finance.portfolio_mining_operation') }}</div>
                        <div>{{ 15 + t('Days') }}</div>
                    </div>
                    <div class="w-full flex justify-between mb-[0.2rem]">
                        <div class="text-color3">{{ t('finance.portfolio_yield') }}</div>
                        <div>0.3-0.4%</div>
                    </div>
                    <div class="w-full flex justify-between mb-[0.2rem]">
                        <div class="text-color3">{{ t('finance.portfolio_mining_noti_est') }}</div>
                        <div>{{ 0.00 - 0.00 }}</div>
                    </div>
                    <div class="w-full flex justify-between mb-[0.2rem]">
                        <div class="text-color3">{{ t('finance.portfolio_mining_investment') }}</div>
                        <div>{{ 3500 - 999999 }}</div>
                    </div>
                    <div class="w-full flex justify-between">
                        <div class="text-color3">{{ t('finance.portfolio_mining_fee') }}</div>
                        <div>{{ 0 }}</div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col mb-[0.4rem] bg-color6 rounded-[0.32rem] px-[0.28rem] py-[0.4rem]">
                <div class="flex items-center mb-[0.32rem]">
                    <div class="mr-[0.2rem]">
                        <img :src="getStaticImgUrl(`/static/home2/point.svg`)" alt="img" />
                    </div>
                    <div class="text-[0.4rem]" :class="loaded ? 'right_left_effect' : ''">{{
                        t('finance.portfolio_mining_header') }}</div>
                </div>
                <div class="w-full relative mb-[0.32rem]">
                    <FormItem input-height="1.3rem" :hasScroll="true"
                        :placeholder="t('finance.portfolio_mining_header')" :max="maxStockNum" v-model="form1.amount"
                        @change="changePercent" input-type="number">

                        <template #scroll>
                            <!-- 拖动 -->
                            <SlideContainer v-model="sliderValue" @change="onSliderChange" />
                        </template>
                    </FormItem>
                    <div class="w-full flex justify-end absolute top-[0] right-[0]">
                        <div
                            class="text-[0.24rem] p-[0.12rem] gap-[0.12rem] bg-color4 rounded-[0.4rem] flex text-color3 mt-[0.16rem] mr-[0.2rem]">
                            {{ t('assets.wallet_available_sim')
                            }}<span class="text-primary">25</span>USDT</div>
                    </div>
                </div>
                <Button class="submit" @click="showConfirm = true"><span class="text-[0.36rem]">{{
                    t('finance.portfolio_mining_btn')
                        }}</span></Button>
            </div>

            <div class="px-[0.28rem] py-[0.4rem] bg-color6 flex flex-col rounded-[0.32rem]">
                <div class="flex items-center mb-[0.4rem]">
                    <div class="mr-[0.2rem]">
                        <img :src="getStaticImgUrl(`/static/home2/point.svg`)" alt="img" />
                    </div>
                    <div class="text-[0.4rem]" :class="loaded ? 'right_left_effect' : ''">{{
                        t('finance.portfolio_mining_title3') }}</div>
                </div>
                <div class="text-color5 leading-[0.5rem] text-[0.26rem]">
                    {{ t('finance.portfolio_mining_guide') }}
                </div>
            </div>
            <div class="w-full h-[0.32rem]"></div>
        </div>
        <BottomPopup round closeable v-model:show="showConfirm" position="bottom" teleport="body">
            <div class="w-full px-[0.4rem] pb-[0.6rem]">
                <div class="text-[0.32rem] w-full text-center mb-[0.6rem]">{{ t('market.market_buy_confirm_coin') }}
                </div>
                <div class="w-full bg-color6 rounded-[0.32rem] mb-[0.4rem] pb-[0.12rem] pt-[0.24rem]">
                    <div class="flex justify-between mx-[0.28rem] mb-[0.3rem]">
                        <div class="flex flex-col justify-between">
                            <div class="flex">
                                <div class="mb-[0.16rem] w-[0.4rem] h-[0.4rem] relative" v-for="(item, i) in iconList"
                                    :class="i == 1 ? 'left-[-0.08rem]' : i == 2 ? 'left-[-0.16rem]' : ''"><img
                                        :src="getStaticImgUrl(`/static/img/crypto/${item}.svg`)" alt="img" /></div>
                            </div>
                            <div class="text-[0.32rem]">BTC+USDT</div>
                        </div>
                    </div>
                    <div
                        class="flex flex-col bg-color2 justify-between p-[0.28rem] rounded-[0.32rem] mx-[0.12rem] mb-[0.2rem]">
                        <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                            <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_mining_noti_duration') }}
                            </div>
                            <div class="text-[0.28rem]">{{ 7 + $t('finance.portfolio_day_multi') }}</div>
                        </div>
                        <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                            <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_yield') }}</div>
                            <div class="text-[0.28rem]">{{ '0.2-0.5' + '%' }}</div>
                        </div>
                        <div class="w-full h-[0.44rem] flex items-center justify-between">
                            <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_mining_noti_est') }}
                            </div>
                            <div class="text-[0.28rem]">{{ '220-1000' }}<span class="text-[0.24rem]">&nbsp;USDT</span>
                            </div>
                        </div>
                    </div>
                    <div class="rounded-[0.32rem] bg-color2 mx-[0.12rem] flex flex-col justify-center py-[0.3rem]">
                        <div class="w-full flex justify-center items-center h-[0.36rem] mb-[0.2rem] text-color2">{{
                            t('trade.stock_opening_pay') }}<span
                                class="text-[0.36rem] text-white font-semibold">&nbsp;872000.12</span></div>
                        <div class="w-full flex justify-center items-center text-color2 text-[0.24rem]">{{
                            t('finance.portfolio_mining_header')
                        }}<span class="text-white">&nbsp;30000</span><span>&nbsp;+&nbsp;</span><span>{{
                                t('finance.portfolio_mining_noti_fee')
                            }}</span><span class="text-white">&nbsp;20</span></div>
                    </div>
                </div>
                <div class="border-[0.02rem] rounded-[0.32rem] border-color2 overflow-hidden mb-[0.6rem] relative">
                    <input class="w-full h-[1.2rem] bg-color2 px-[0.32rem] text-[0.32rem]"
                        :type="showPw ? 'text' : 'password'" :placeholder="t('trade.stock_opening_trade_pw')" />
                    <div class="w-[0.4rem] h-[0.4rem] absolute top-[0.36rem] right-[0.24rem]" v-if="!showPw"
                        @click="showPw = true">
                        <img :src="getStaticImgUrl('/static/img/common/close_eye.svg')" alt="" />
                    </div>
                    <div class="w-[0.4rem] h-[0.4rem] absolute top-[0.36rem] right-[0.24rem]" v-if="showPw"
                        @click="showPw = false">
                        <img :src="getStaticImgUrl('/static/img/common/open_eye.svg')" alt="" />
                    </div>
                </div>
                <Button
                    style="width: 100%; height: 1.12rem; background-color: var(--ex-primary-color); border-radius: 1.3rem;"><span
                        class="text-[0.36rem]">{{ t('trade.stock_opening_confirm') }}</span></Button>
            </div>
        </BottomPopup>
    </div>
</template>
<script setup>
import Top from '@/components/Top.vue';
import { useI18n } from 'vue-i18n';
import { getStaticImgUrl } from "@/utils/index.js";
import { Stepper, Button } from 'vant';
import Decimal from "decimal.js";
import BottomPopup from '@/components/BottomPopup.vue';
import { onMounted } from 'vue';
import SlideContainer from '@/components/SlideContainer.vue';
import FormItem from '@/components/Form/FormItem.vue';

const { t } = useI18n();

const value = ref(0)
const showPw = ref(false)
const showConfirm = ref(false)
const loaded = ref(false)
const form1 = ref({
    id: "",
    amount: "",
    token: "",
    safeword: ""
});
const maxStockNum = computed(() => {
    return 1000
})
const itemsMap = [{
    currency: 'BTC',
    ratio: '0.7825'
},
{
    currency: 'USDT',
    ratio: '-0.0256'
},
]

const iconList = ['BTC', 'USDT']

const sliderValue = ref(0);
const step = ref(1)

const onSliderChange = (newValue) => {
    sliderValue.value = newValue;
    if (maxStockNum.value == "--") return (sliderValue.value = 0);
    let v = new Decimal(maxStockNum.value).mul(newValue).div(100);
    v = v.sub(v.mod(step.value));
    form1.value.amount = v.toNumber();
    setTimeout(() => {
        changePercent();
    }, 0);
};

const changePercent = () => {
    if (maxStockNum.value == "--" || !form1.value.amount)
        return (sliderValue.value = 0);
    let v = new Decimal(form1.value.amount);
    form1.value.amount = v.sub(v.mod(step.value));
    let p = new Decimal(form1.value.amount)
        .div(maxStockNum.value)
        .mul(100)
        .toNumber();
    if (p < 0) p = 0;
    if (p > 100) p = 100;
    sliderValue.value = Number(p);
};

onMounted(() => {
    setTimeout(() => {
        loaded.value = true;
    }, 300);
})
</script>
<style lang="less">
.staking_mining {

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

    .van-stepper {
        width: 100%;
        display: flex;
        justify-content: space-between;

        button {
            width: 0.8rem;
            height: 0.8rem;
            background-color: var(--ex-bg-color6);
            border-radius: 0.1rem;
            font-size: 0.2rem;
        }

        input {
            background-color: var(--ex-bg-color);
            flex: 1;
            text-align: start;
            padding-left: 0.2rem;
            font-size: 0.32rem;
            height: 0.8rem;
        }
    }

    .submit {
        width: 100%;
        height: 0.96rem;
        border-radius: 0.32rem;
        background-color: var(--ex-primary-color);
    }
}
</style>