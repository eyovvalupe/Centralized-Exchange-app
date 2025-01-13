<template>
    <div class="staking_item relative" v-if="list.length" v-for="(item, i) in list">
        <div class="w-[0.66rem] h-[0.48rem] absolute top-[0] right-[0]" v-if="item.hot"><img
                :src="getStaticImgUrl('/static/img/finance/hot.svg')" alt="img" /></div>
        <div class="w-full bg-color6 mb-[0.24rem] rounded-[0.2rem]">
            <div class="w-full h-full px-[0.12rem] pt-[0.4rem] flex flex-col">
                <div class="flex flex-col px-[0.16rem] mb-[0.3rem] relative">
                    <div class="text-[0.36rem] mb-[0.15rem]">{{ item.name }}</div>
                    <div class="text-color2 text-[0.28rem]">{{ t('finance.portfolio_investment_amt') + ': ' +
                        dataModify1(item.limits)[0] +
                        '-' + dataModify1(item.limits)[1]
                        }}</div>
                </div>
                <!-- 加密代币价格 -->
                <div class="flex w-full bg-color py-[0.2rem] rounded-[0.32rem] mb-[0.12rem]">
                    <div class="flex flex-col px-[0.28rem] flex-1" v-for="(symbol, i) in parseSymbol(item.symbol)">
                        <div class="flex items-center mb-[0.1rem]">
                            <div class="w-[0.35rem] h-[0.35rem] mr-[0.1rem]"><img
                                    :src="getStaticImgUrl(`/static/img/crypto/${dataModify2(item.name)[i]}.svg`)" alt="img" /></div>
                            <div class="text-color3 text-[0.28rem]">{{ dataModify2(item.name)[i] }}</div>
                        </div>
                        <div class="text-[0.28rem] ml-[0.45rem]">{{ priceList[symbol] ? priceList[symbol] : '--' }}</div>
                    </div>
                </div>
                <div class="w-full h-[3.1rem] bg-color flex rounded-[0.32rem] relative overflow-hidden mb-[0.2rem]">
                    <BackgroundImg :times="item.time"/>
                    <BackgroundImg1 />
                    <div class="w-1/2 h-full flex flex-col px-[0.28rem] py-[0.2rem]">
                        <div class="flex mb-[0.2rem] relative">
                            <div class="text-[0.28rem] text-color2 mr-[0.2rem]">{{ t('finance.portfolio_yield') }}
                            </div>
                        </div>
                        <div class="text-[0.24rem] mb-[0.2rem] relative">{{ dataModify3(item.returnrate)[0] + '-' + dataModify3(item.returnrate)[1] + '/' }}{{
                            t('finance.portfolio_day') }}</div>
                    </div>
                    <div class="w-1/2 h-full flex flex-col px-[0.28rem] py-[0.2rem]">
                        <div class="flex mb-[0.2rem] relative">
                            <div class="text-[0.28rem] text-color2 mr-[0.2rem]">{{ t('finance.portfolio_duration') }}
                            </div>
                        </div>
                        <div class="text-[0.24rem] mb-[0.2rem] relative">{{ item.days ? item.days : '--' }}{{
                            t('finance.portfolio_day_multi') }}</div>
                    </div>
                </div>
                <Button class="submit ripple-btn" @click="jump(item.id)"><span class="text-[0.32rem] font-bold">{{ '+'
                    + t('finance.portfolio_participate')
                        }}</span></Button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js";
import SparkLine from '@/components/SparkLine.vue';
import { useI18n } from 'vue-i18n';
import { Button } from 'vant';
import BackgroundImg from './BackgroundImg.vue';
import router from "@/router";
import BackgroundImg1 from './BackgroundImg1.vue';
import { _realtime } from "@/api/api";
import { computed, onMounted } from "vue";
import store from "@/store";

const jump = (id) => {
    store.commit('setStakeId', id)
    router.push({ name: 'stake' })
}
const { t } = useI18n();
const props = defineProps({
    list: {
        type: Array,
        default: []
    }
})

const dataModify1 = (str) => {
    const [low, top] = str.split(',')
    return [low, top]
}

const dataModify2 = (str) => {
    return str.split('+')
}

const dataModify3 = (str) => {
    return str.split(',')
}

//实时行情
const loading = ref(false);
const priceList = ref({});

const getRealData = async () => {
    try {
        if (loading.value) return;
        loading.value = true;
        const prices = {};
        for (const item of props.list) {
            const symbols = parseSymbol(item.symbol)
            for (const symbol of symbols) {
                const data = await _realtime({ symbol })
                prices[symbol] = data.data[0].price;
            }
        }
        priceList.value = {
            ...priceList.value,
            ...prices
        };

        loading.value = false;
    } catch (err) {
        console.log("error ========> ", err);
    }
}
const symbolList = ref([])
const parseSymbol = (str) => {
    return str.split(",")
}

onMounted(() => {
    getRealData();
})
</script>
<style lang="less">
.staking_item {
    width: 100%;

    .submit {
        background-color: var(--ex-primary-color);
        border-radius: 0.2rem;
        height: 0.96rem;
        margin: 0 0.16rem 0.2rem 0.16rem;
    }
}
</style>