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
                        <div class="text-color3">{{ t('finance.portfolio_mining_revenue') }}</div>
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
                <div
                    class="w-full h-[2.24rem] mb-[0.4rem] bg-color2 rounded-[0.4rem] border-[0.02rem] border-color4 flex flex-col justify-between">
                    <div class="flex flex-col">
                        <div class="w-full flex justify-end">
                            <div
                                class="text-[0.24rem] p-[0.12rem] gap-[0.12rem] bg-color4 rounded-[0.4rem] flex text-color3 mt-[0.16rem] mr-[0.2rem]">
                                {{ t('assets.wallet_available_sim')
                                }}<span class="text-primary">25</span>USDT</div>

                        </div>
                        <div class="text-[0.32rem] text-color2 ml-[0.28rem]">{{ t('finance.portfolio_mining_header') }}
                        </div>
                    </div>
                    <div class="w-full h-[0.64rem] flex px-[0.4rem] border-t-[0.02rem] border-color2 items-center">
                        <SlideContainer @touchstart="" />
                    </div>
                </div>
                <Button class="submit" @click="showConfirm = true"><span>{{ t('finance.portfolio_mining_btn')
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
            <div class="w-full h-[6rem]">
                <div class="w-full flex justify-center text-[0.32rem] mb-[0.4rem]">{{ t('finance.portfolio_mining_noti')
                    }}</div>
                <div class="w-full px-[0.4rem] flex justify-between mb-[0.24rem]">
                    <div>{{ t('finance.portfolio_mining_noti_duration') }}</div>
                    <div>{{ 7 + t('finance.portfolio_day') }}</div>
                </div>
                <div class="w-full px-[0.4rem] flex justify-between mb-[0.24rem]">
                    <div>{{ t('finance.portfolio_mining_noti_daily') }}</div>
                    <div>{{ '0.2-0.25%' }}</div>
                </div>
                <div class="w-full px-[0.4rem] flex justify-between mb-[0.24rem]">
                    <div>{{ t('finance.portfolio_mining_noti_est') }}</div>
                    <div>{{ '0.00-0.00' }}</div>
                </div>
                <div class="w-full px-[0.4rem] flex justify-between mb-[0.24rem]">
                    <div>{{ t('finance.portfolio_mining_noti_investment') }}</div>
                    <div>{{ '2000-999999' }}</div>
                </div>
                <div class="w-full px-[0.4rem] flex justify-between mb-[0.4rem]">
                    <div>{{ t('finance.portfolio_mining_noti_fee') }}</div>
                    <div>{{ 0 }}</div>
                </div>
                <div class="px-[0.4rem]">
                    <Button class="submit"
                        style="width: 100%; height: 0.96rem; border-radius: 0.2rem; background-color: var(--ex-primary-color); margin-bottom: 0.2rem;"><span>{{
                            t('finance.portfolio_mining_btn') }}</span></Button>
                </div>
            </div>
        </BottomPopup>
    </div>
</template>
<script setup>
import Top from '@/components/Top.vue';
import { useI18n } from 'vue-i18n';
import { getStaticImgUrl } from "@/utils/index.js";
import { Stepper, Button } from 'vant';
import BottomPopup from '@/components/BottomPopup.vue';
import { onMounted } from 'vue';
import SlideContainer from '@/components/SlideContainer.vue';

const { t } = useI18n();

const value = ref(0)
const showConfirm = ref(false)
const loaded = ref(false)

const itemsMap = [{
    currency: 'BTC',
    ratio: '0.7825'
},
{
    currency: 'USDT',
    ratio: '-0.0256'
},
]

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
        animation-timing-function: ease;
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

        .van-button__content {
            .van-button__text {
                span {
                    font-size: 0.36rem;
                }
            }
        }
    }
}
</style>