<template>
    <div class="px-[0.32rem] py-[0.48rem] flex flex-col">
        <div class="w-full h-[1.36rem] rounded-[0.32rem] bg-error-opacity flex p-[0.24rem] items-center mb-[0.4rem]" v-if="alert">
            <div class="h-full py-[0.08rem]">
                <div class="size-[0.28rem] mr-[0.2rem]">
                    <img v-lazy="getStaticImgUrl('static/img/trade/alert.svg')" alt="" />
                </div>
            </div>
            <div class="text-[0.32rem] text-color leading-[0.48rem]">{{ t('common.insufficient_con1') }}<span
                    class="text-error">{{ t('common.insufficient_con2') }}</span>{{ t('common.insufficient_con3') }}</div>
        </div>
        <div class="text-[0.32rem] text-color mb-[0.4rem]">{{ type == 'stock' ? t('assets.wallet_header_stock') : '' }}</div>
        <div class="flex justify-between mb-[0.52rem]">
            <div class="text-[0.28rem] text-color2">{{ t('market.market_faster_available') }}</div>
            <div class="text-[0.28rem] text-color2"><span class="text-primary">{{ balance }}</span>&nbsp;{{ currency }}
            </div>
        </div>
        <div class="flex justify-center gap-[0.4rem]">
            <div @click="jump('transfer', type)"
                class="flex-1 h-[0.8rem] rounded-[0.4rem] border-primary border-[0.02rem] flex items-center justify-center text-[0.28rem] font-[600] text-primary ripple-primary">
                {{ t('assets.recharge') }}</div>
            <div @click="jump('topUpCrypto')"
                class="flex-1 h-[0.8rem] rounded-[0.4rem] border-primary border-[0.02rem] flex items-center justify-center text-[0.28rem] font-[600] text-primary ripple-primary">
                {{ t('assets.transfer') }}</div>
        </div>
    </div>
</template>
<script setup>
import router from '@/router';
import store from '@/store';
import { getStaticImgUrl } from '@/utils';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const stockWalletList = computed(() => store.state.stockWallet)

const { t } = useI18n();
const props = defineProps({
    alert: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        default: ''
    },
    balance: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: ''
    },
})

const jump = (name, type = null) => {
    if (type && type == 'stock' && name == 'transfer') {
        store.commit('setToType', 'stock')
        store.commit('setToCurrency', stockWalletList.value.find(item => item.name == props.currency))
    }
    router.push({ name })
}

</script>
