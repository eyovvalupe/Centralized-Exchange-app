<template>
    <div>
        <Top :title="$t('trade.ipo_detail_title')" />
        <div
            class=" mt-[1.42rem] mx-[0.32rem] mb-[0.32rem] h-[2.1rem] bg-color6 rounded-[0.32rem] flex justify-center items-center">
            <div class="h-[1rem] flex flex-col justify-between items-center">
                <div class="text-color2 text-[0.32rem]">{{ $t('finance.portfolio_mining_revenue') }}<span>({{ 'USDT' }})</span></div>
                <div class="text-[0.6rem] text-primary">+40000</div>
            </div>
        </div>
        <div class="mx-[0.32rem] bg-color6 rounded-[0.32rem] mb-[0.28rem] pb-[0.12rem] pt-[0.24rem] relative">
            <div class="w-[1.12rem] h-[0.6rem] absolute top-[0] right-[0]" v-if="false">
                <div class="w-full h-full relative">
                    <div class="w-full h-full absolute">
                        <img :src="getStaticImgUrl('/static/img/finance/onGoing.svg')" alt="ongoing" />
                    </div>
                    <div class="w-full h-full relative flex items-center justify-center">
                        {{ $t('finance.portfolio_order_tab1') }}
                    </div>
                </div>
            </div>
            <div class="w-[1.12rem] h-[0.6rem] absolute top-[0] right-[0]" v-if="true">
                <div class="w-full h-full relative">
                    <div class="w-full h-full absolute">
                        <img :src="getStaticImgUrl('/static/img/finance/redeemed.svg')" alt="ongoing" />
                    </div>
                    <div class="w-full h-full relative flex items-center justify-center">
                        {{ $t('finance.portfolio_order_tab2') }}
                    </div>
                </div>
            </div>
            <div class="flex justify-between mx-[0.28rem] mb-[0.3rem]">
                <div class="flex h-[0.4rem] items-center">
                    <div class="flex mr-[0.1rem] items-center">
                        <div class="w-[0.4rem] h-[0.4rem] relative" v-for="(item, i) in iconList"
                            :class="i == 1 ? 'left-[-0.08rem]' : i == 2 ? 'left-[-0.16rem]' : ''"><img
                                :src="getStaticImgUrl(`/static/img/crypto/${item}.svg`)" alt="img" /></div>
                    </div>
                    <div class="text-[0.32rem] relative top-[0.04rem]">BTC+USDT</div>
                </div>
            </div>
            <div class="flex flex-col bg-color2 justify-between p-[0.28rem] rounded-[0.32rem] mx-[0.12rem]">
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_mining_noti_duration') }}</div>
                    <div class="text-[0.28rem]">{{ 7 + $t('finance.portfolio_day_multi') }}</div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_order_finish_time') }}</div>
                    <div class="text-[0.28rem]">{{ '2025/01/12 11:50' }}</div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_yield') }}</div>
                    <div class="text-[0.28rem]">{{ '0.2-0.5' + '%' }}</div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_mining_header') }}</div>
                    <div class="text-[0.28rem]">{{ '80000' + ' ' + 'USDT' }}</div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_mining_fee') }}</div>
                    <div class="text-[0.28rem]">{{ 0 + ' ' + 'USDT' }}</div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                    <div class="text-[0.28rem] text-color2">{{ $t('trade.ai_position_order_id') }}</div>
                    <div class="text-[0.28rem]">{{ '23d23w3w3rwr' }}</div>
                </div>
                <div class="w-full h-[0.44rem] flex items-center justify-between">
                    <div class="text-[0.28rem] text-color2">{{ $t('trade.ipo_detail_order_date') }}</div>
                    <div class="text-[0.28rem]">{{ '2025/01/5 11:50' }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import Top from '@/components/Top.vue';
import { getStaticImgUrl } from "@/utils/index.js";

const iconList = ['BTC', 'USDT']

</script>