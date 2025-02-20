<template>
    <div>
        <div class="staking_item relative" v-if="list.length" v-for="(item, i) in list">
            <div class="w-[0.66rem] h-[0.48rem] absolute top-[0] right-[0]" v-if="item.hot"><img
                    v-lazy="getStaticImgUrl('/static/img/finance/hot.svg')" alt="img" /></div>
            <div class="w-full bg-color6 mb-[0.1rem] rounded-[0.2rem]">
                <div class="w-full h-full px-[0.12rem] pt-[0.4rem] flex flex-col">
                    <div class="flex flex-col px-[0.16rem] mb-[0.3rem] relative">
                        <div class="text-[0.36rem] mb-[0.15rem]">{{ item.name }}</div>
                        <div class="flex items-center">
                            <div class="text-color2 text-[0.28rem] mr-[0.1rem]">{{ t('finance.portfolio_investment_amt')
                                + ': ' +
                                dataModify1(item.limits)[0] +
                                '-' + dataModify1(item.limits)[1]
                            }}</div>
                            <div class="w-[0.24rem] h-[0.24rem]">
                                <CryptoIcon :name="'USDT'" />
                            </div>
                        </div>
                    </div>
                    <!-- 加密代币价格 -->
                    <div class="flex w-full bg-color py-[0.2rem] rounded-[0.32rem] mb-[0.12rem]">
                        <div class="flex flex-col px-[0.28rem] flex-1" v-for="(symbol, i) in item.items">
                            <div class="flex items-center mb-[0.1rem]">
                                <div class="w-[0.4rem] h-[0.4rem] mr-[0.1rem]">
                                    <CryptoIcon :name="symbol.name.split('/')[0]" />
                                </div>
                                <div class="text-color3 text-[0.28rem]">{{ symbol.name.split('/')[0] }}</div>
                            </div>
                            <div class="text-[0.28rem] font-semibold ml-[0.45rem]">{{ priceList[symbol.symbol] ?
                                priceList[symbol.symbol] : '--' }}
                            </div>
                        </div>
                    </div>
                    <div class="w-full h-[3.1rem] bg-color flex rounded-[0.32rem] relative overflow-hidden mb-[0.2rem]">
                        <BackgroundImg :times="item.time" />
                        <BackgroundImg1 />
                        <div class="w-1/2 h-full flex flex-col px-[0.28rem] py-[0.2rem]">
                            <div class="flex mb-[0.2rem] relative">
                                <div class="text-[0.28rem] text-color2 mr-[0.2rem]">{{ t('finance.portfolio_yield') }}
                                </div>
                            </div>
                            <div class="text-[0.32rem] font-semibold mb-[0.2rem] relative">{{
                                dataModify3(item.returnrate)[0] + '-' +
                                dataModify3(item.returnrate)[1] }}<span class="text-[0.24rem] font-normal">{{ '%/' +
                                    t('finance.portfolio_day') }}</span></div>
                        </div>
                        <div class="w-1/2 h-full flex flex-col px-[0.28rem] py-[0.2rem]">
                            <div class="flex mb-[0.2rem] relative">
                                <div class="text-[0.28rem] text-color2 mr-[0.2rem]">{{ t('finance.portfolio_duration')
                                    }}
                                </div>
                            </div>
                            <div class="text-[0.32rem] font-semibold mb-[0.2rem] relative">{{ item.days ? item.days :
                                '--' }}<span class="text-[0.24rem] font-normal">{{
                                    t('finance.portfolio_day_multi') }}</span></div>
                        </div>
                    </div>
                    <Button class="submit ripple-btn" @click="jump(item.id)"><span class="text-[0.32rem] font-bold">{{
                        '+'
                        + t('finance.portfolio_participate')
                            }}</span></Button>
                </div>
            </div>
        </div>
        <!-- <div v-if="loading" class="w-full flex justify-center">
            <Loading />
        </div> -->
    </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js";
import { useI18n } from 'vue-i18n';
import { Button, Loading, showToast } from 'vant';
import BackgroundImg from './BackgroundImg.vue';
import router from "@/router";
import BackgroundImg1 from './BackgroundImg1.vue';
import { _realtime } from "@/api/api";
import { onMounted } from "vue";
import store from "@/store";

const token = computed(() => store.state.token);

const jump = (id) => {
    store.commit('setStakeId', id)
    sessionStorage.setItem('stakeId', JSON.stringify(id))
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
            for (const symbol of item.items) {
                const data = await _realtime({ symbol: symbol.symbol })
                prices[symbol.symbol] = data.data[0].price;
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
    padding: 0 0.32rem;
    margin-top: 0.32rem;

    .submit {
        background-color: var(--ex-primary-color);
        border-radius: 0.2rem;
        height: 0.96rem;
        margin: 0 0.16rem 0.2rem 0.16rem;
    }
}
</style>