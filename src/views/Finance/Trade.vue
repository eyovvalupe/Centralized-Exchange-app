<template>
    <div class="staking_mining w-full">
        <Top :title="t('finance.portfolio_mining_title')" />
        <div class="flex items-center justify-center h-[80vh]" v-if="loading">
            <Loading color="var(--ex-primary-color)" />
        </div>
        <div class="mt-[1.32rem] px-[0.32rem]" v-else>
            <div class="px-[0.28rem] py-[0.4rem] mb-[0.2rem] bg-color6 flex flex-col rounded-[0.32rem]">
                <div class="flex items-center mb-[0.32rem]">
                    <div class="text-[0.4rem] font-[500]">{{
                        t('finance.portfolio_mining_subTitle1') }}</div>
                </div>
                <div class="flex mb-[0.6rem] gap-[0.4rem]">
                    <div class="flex items-center flex-1 relative" v-for="(item, i) in itemList" :key="i"
                        v-if="itemList.length">
                        <div
                            class="w-full flex flex-col bg-white2 px-[0.2rem] py-[0.32rem] rounded-[0.32rem] items-center">
                            <div class="w-[0.96rem] h-[0.96rem] mb-[0.32rem]">
                                <CryptoIcon :name="item.name.split('/')[0]" />
                            </div>
                            <div class="mb-[0.24rem]">{{ item.name.split('/')[0] }}</div>
                            <div class="text-[0.32rem] font-standard text-color8"
                                :class="itemsMap[item.symbol] ? itemsMap[item.symbol] > 0 ? 'up' : 'down' : ''">
                                {{
                                    itemsMap[item.symbol] ? (itemsMap[item.symbol] > 0 ? '+' +
                                        itemsMap[item.symbol] : itemsMap[item.symbol]) + '%' : '--' }}
                            </div>
                            <div class="absolute w-[0.6rem] h-[0.6rem] z-[1] right-[-0.5rem] top-[1rem]"
                                v-if="i < itemList.length - 1"><img
                                    v-lazy="getStaticImgUrl(`/static/img/finance/plus.svg`)" alt="img" /></div>
                        </div>
                    </div>
                </div>
                <!-- 挖矿详情 -->
                <div class="w-full flex flex-col">
                    <div class="w-full flex justify-between mb-[0.2rem]">
                        <div class="text-color3">{{ t('finance.portfolio_mining_operation') }}</div>
                        <div class="w-[4.8rem] text-right">{{ stakeInfo.days + t('Days') }}</div>
                    </div>
                    <div class="w-full flex justify-between mb-[0.2rem]">
                        <div class="text-color3">{{ t('finance.portfolio_yield') }}</div>
                        <div class="w-[4.8rem] text-right">{{ stakeInfo.returnrate ? stakeInfo.returnrate.split(',')[0] + '-' +
                            stakeInfo.returnrate.split(',')[1] + '%' : '--' }}</div>
                    </div>
                    <div class="w-full flex justify-between mb-[0.2rem]">
                        <div class="text-color3">{{ t('finance.portfolio_mining_noti_est') }}</div>
                        <div class="w-[4.8rem] text-right">{{ stakeInfo.returnrate ? (Number(stakeInfo.returnrate.split(',')[0]) *
                            form.amount).toFixed(2) + '-' + (Number(stakeInfo.returnrate.split(',')[1]) *
                                form.amount).toFixed(2) : '--' }}<span class="text-[0.24rem] ml-[0.12rem]">USDT</span></div>
                    </div>
                    <div class="w-full flex justify-between mb-[0.2rem]">
                        <div class="text-color3">{{ t('finance.portfolio_mining_investment') }}</div>
                        <div class="w-[4.8rem] text-right">{{ stakeInfo.limits ? stakeInfo.limits.split(',')[0] + '-' + stakeInfo.limits.split(',')[1]
                            : '--' }}<span class="text-[0.24rem] ml-[0.12rem]">USDT</span></div>
                    </div>
                    <div class="w-full flex justify-between">
                        <div class="text-color3">{{ t('finance.portfolio_mining_fee') }}</div>
                        <div class="w-[4rem] text-right">{{ stakeInfo.fee ? stakeInfo.fee : '--' }}<span class="text-[0.24rem] ml-[0.12rem]">USDT</span></div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col mb-[0.2rem] bg-color6 rounded-[0.32rem] px-[0.28rem] py-[0.4rem]">
                <div class="flex items-center mb-[0.32rem]">
                    
                    <div class="text-[0.4rem] font-[500]">{{
                        t('finance.portfolio_mining_header') }}</div>
                </div>
                <div class="w-full relative mb-[0.32rem]">
                    <FormItem :errStatus="sliderStatus == 'error'" inputHeight="1.12rem" hasScroll :from="'toTop'"
                        :placeholder="t('投资额')" :max="maxStockNum" v-model="form.amount"
                        @change="changePercent" input-type="number" @input="changePercent">

                        <template #scroll>
                            <SlideContainer :status="sliderStatus" v-model="sliderValue" @change="onSliderChange" />
                        </template>
                       
                    </FormItem>

                </div>
                <Button class="submit ripple-btn" v-if="sliderStatus == 'success'" round @click="openConfirm"><span class="text-[0.36rem]">{{
                    t('finance.portfolio_mining_btn')
                        }}</span></Button>
                <Button class="submit opacity-30" round v-else><span class="text-[0.36rem]">{{
                    t('finance.portfolio_mining_btn')
                        }}</span></Button>
            </div>

            <div class="w-full p-[0.28rem] rounded-[0.32rem] flex flex-col bg-white2">
                <div class="text-[0.32rem] mb-[0.4rem]">{{ $t('assets.wallet_header_contract') }}</div>
                <div class="flex justify-between mb-[0.52rem] text-[0.28rem]">
                    <div class="text-color2">{{ $t('market.market_faster_available') }}</div>
                    <div class="flex text-primary">{{ maxStockNum }}<span class="text-color">&nbsp;USDT</span></div>
                </div>
                <div class="flex gap-[0.28rem] justify-center">
                    <div class="w-[3rem] h-[0.6rem] flex items-center justify-center rounded-[1rem] bg-white1 text-white ripple-primary" @click="goDeposit">{{ $t('home.recharge') }}</div>
                    <div class="w-[3rem] h-[0.6rem] flex items-center justify-center rounded-[1rem] bg-white1 text-white ripple-primary" @click="goTransfer">{{ $t('assets.transfer') }}</div>
                </div>
            </div>

            <div class="px-[0.28rem] py-[0.4rem] bg-color6 flex flex-col rounded-[0.32rem] mt-[0.2rem]">
                <div class="flex items-center mb-[0.4rem]">
                    <div class="text-[0.4rem] font-[500]">{{
                        t('finance.portfolio_mining_title3') }}</div>
                </div>
                <div class="text-color5 leading-[0.5rem] text-[0.26rem]">
                    {{ t('finance.portfolio_mining_guide') }}
                </div>
            </div>
            <div class="w-full h-[0.32rem]"></div>
        </div>
        <BottomPopup round closeable v-model:show="showConfirm" position="bottom" teleport="body">
            <div class="w-full pb-[0.6rem]">
                <div class=" px-[0.32rem]">
                    <div class="text-[0.32rem] w-full text-center mb-[0.6rem]">{{ t('market.market_buy_confirm_coin') }}
                    </div>
                    <div class="w-full bg-white2 rounded-[0.32rem] mb-[0.4rem] p-[1px] pt-[0.3rem]">
                        <div class="flex items-center mx-[0.28rem] mb-[0.3rem]">
                            <div class="flex gap-[0.16rem] justify-between">
                                <div class="flex">
                                    <div class="w-[0.4rem] h-[0.4rem] relative"
                                        :class="i ? '-ml-[0.1rem]' : ''" v-if="!isEmpty(stakeInfo)" :key="i"
                                        v-for="(item, i) in stakeInfo.items">
                                        <CryptoIcon :name="item.name.split('/')[0]" />
                                    </div>
                                </div>
                                <div class="text-[0.32rem]">{{ stakeInfo.name ? stakeInfo.name : '--' }}</div>
                            </div>
                        </div>
                        <div
                            class="flex flex-col bg-color9 justify-between p-[0.28rem] rounded-[0.32rem]">
                            <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                                <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_mining_noti_duration') }}
                                </div>
                                <div class="text-[0.28rem]">{{ stakeInfo.days + $t('finance.portfolio_day_multi') }}</div>
                            </div>
                            <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                                <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_yield') }}</div>
                                <div class="text-[0.28rem]">{{ stakeInfo.returnrate ? stakeInfo.returnrate.split(',')[0] +
                                    '-' +
                                    stakeInfo.returnrate.split(',')[1] + '%' : '--' }}</div>
                            </div>
                            <div class="w-full h-[0.44rem] flex items-center justify-between">
                                <div class="text-[0.28rem] text-color2">{{ $t('finance.portfolio_mining_noti_est') }}
                                </div>
                                <div class="text-[0.28rem]">{{ stakeInfo.returnrate ?
                                    (Number(stakeInfo.returnrate.split(',')[0]) *
                                        form.amount).toFixed(2) + '-' + (Number(stakeInfo.returnrate.split(',')[1]) *
                                            form.amount).toFixed(2) : '--' }}<span class="text-[0.24rem]">&nbsp;USDT</span>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div class="rounded-[0.32rem] bg-white2 mt-[0.2rem] flex flex-col justify-center py-[0.3rem]">
                        <div class="w-full flex justify-center items-center h-[0.36rem] mb-[0.2rem] text-color2">{{
                            t('trade.stock_opening_pay') }}<span
                                class="text-[0.36rem] text-white font-semibold">&nbsp;{{
                                    form.amount }}</span></div>
                        <div class="w-full flex justify-center items-center text-color2 text-[0.24rem]">{{
                            t('finance.portfolio_mining_header')
                            }}<span class="text-white">&nbsp;{{ form.amount }}</span><span>&nbsp;+&nbsp;</span><span>{{
                                t('finance.portfolio_mining_noti_fee')
                                }}</span><span class="text-white">&nbsp;{{ stakeInfo.fee }}</span></div>
                    </div>
                </div>
                <div class="mt-[0.38rem]" v-if="userInfo.role != 'guest'" style="border-top:1px dashed var(--ex-bg-white2)"></div>
                <div
                    class="mt-[0.4rem]  mx-[0.32rem]"
                    v-if="userInfo.role != 'guest'">
                    <div class="text-[0.28rem] leading-[0.44rem] mb-[0.2rem]">{{ t('trade.stock_opening_trade_pw') }}</div>
                    <div class="rounded-[0.32rem] bg-white2 border-transparent border-[1px] overflow-hidden mb-[0.6rem] relative item">
                        <input class="w-full h-[1.2rem] ipt px-[0.32rem] text-[0.32rem]" v-model="form.safeword"
                            :type="showPw ? 'text' : 'password'" :placeholder="t('trade.stock_opening_trade_pw_placeholder')" />
                        <div class="w-[0.4rem] h-[0.4rem] absolute top-[0.36rem] right-[0.24rem]" v-if="!showPw"
                            @click="showPw = true">
                            <img v-lazy="getStaticImgUrl('/static/img/common/close_eye.svg')" alt="" />
                        </div>
                        <div class="w-[0.4rem] h-[0.4rem] absolute top-[0.36rem] right-[0.24rem]" v-if="showPw"
                            @click="showPw = false">
                            <img v-lazy="getStaticImgUrl('/static/img/common/open_eye.svg')" alt="" />
                        </div>
                    </div>
                </div>
                <div class="px-[0.32rem]">
                    
                    <Button :loading="submitLoading"
                    style="width: 100%; height: 1.12rem; background-color: var(--ex-primary-color); border-radius: 1.3rem;"
                    class="ripple-btn" @click="submit"><span class="text-[0.36rem]">{{ t('trade.stock_opening_confirm')
                        }}</span></Button>
                   
                </div>
            </div>
        </BottomPopup>
      
    </div>
</template>
<script setup>
import Top from '@/components/Top.vue';
import { useI18n } from 'vue-i18n';
import { getStaticImgUrl } from "@/utils/index.js";
import { Button, showToast, showConfirmDialog, Loading } from 'vant';
import Decimal from "decimal.js";
import BottomPopup from '@/components/BottomPopup.vue';
import { computed, nextTick, onMounted, watch } from 'vue';
import SlideContainer from '@/components/SlideContainer.vue';
import FormItem from '@/components/Form/FormItem.vue';
import { _realtime, _stake, _stakeGet } from '@/api/api';
import store from '@/store';
import router from '@/router';
import { isEmpty } from '@/utils/isEmpty';

const { t } = useI18n();

const showPw = ref(false)
const showConfirm = ref(false)
const loaded = ref(false)
const form = ref({
    id: "",
    amount: "",
    token: "",
    safeword: ""
});

const goDeposit = () => {
    if(!token.value){
        store.commit('setIsLoginOpen', true)
        return;
    }
    showConfirmDialog({
        title: "提示",
        message: "即将跳转到充值，将中断当前业务，是否继续？",
    }).then(() => {
        router.push({
            name: 'topUpCrypto',
            query: {
                currency: 'USDT'
            }
        })
    })
    
}
const goTransfer = () => {
    if(!token.value){
        store.commit('setIsLoginOpen', true)
        return;
    }
    showConfirmDialog({
        title: "提示",
        message: "即将跳转到划转，将中断当前业务，是否继续？",
    }).then(() => {
        router.push({
            name: 'transfer',
            query: {
                to: 'USDT'
            }
        })
    })
    
}
const token = computed(() => store.state.token)
const sessionToken = computed(() => store.state.sessionToken)
const userInfo = computed(() => store.state.userInfo)
const maxStockNum = computed(() => {
    if(!token.value){
        return '--'
    }
    if (store.state.wallet.length) {
        const usdtWallet = store.state.wallet.find(item => item.name == 'USDT')
        return usdtWallet.amount
    }
    return '--'
})
const itemList = computed(() => {
    if (!isEmpty(stakeInfo.value)) return stakeInfo.value.items
    else return [];
})

const sliderStatus = computed(()=>{
    if (!form.value.amount) {
        return 'normal'
      
    }
    if (form.value.amount < minAmount.value || form.value.amount > maxAmount.value) { 
        return 'error'    
    }
    if(token.value && form.value.amount > maxStockNum.value){
        return 'error' 
    }
    return 'success'
})

const loadingRealtime = ref(false)
const itemsMap = ref({})
const getItemsMapData = async () => {
    if (isEmpty(stakeInfo.value) || loadingRealtime.value) return {};
    loadingRealtime.value = true;
    const datas = {};
    for (const symbol of stakeInfo.value.items) {
        try {
            const data = await _realtime({ symbol: symbol.symbol });
            datas[symbol.symbol] = data.data[0].ratio;
        } catch (error) {
            console.error('Error fetching data for symbol:', symbol, error);
        }
    }
    loadingRealtime.value = false;
    itemsMap.value = datas;
};

const stakeId = computed(() => store.state.stakeId);

const sliderValue = ref(0);

const maxAmount = computed(() => {
    if (stakeInfo.value.limits) {
        return Number(stakeInfo.value.limits.split(',')[1])
    } else 0
})

const minAmount = computed(() => {
    if (stakeInfo.value.limits) {
        return Number(stakeInfo.value.limits.split(',')[0])
    } else 0
})

const openConfirm = () => {
    if (!token.value) {
        showToast('请先登录再质押')
        store.commit('setIsLoginOpen', true)
        return;
    }
    if (sliderStatus.value != 'success') {
        showToast('请输入限额范围');
        return;
    }
    showConfirm.value = true
}

const onSliderChange = (newValue) => {
    if (!token.value || maxStockNum.value == '--') {
        nextTick(()=>{
            sliderValue.value = 0;
        })
        return;
    }
    
    sliderValue.value = newValue;
    
    form.value.amount = (Number(maxStockNum.value) * Number(newValue) / 100).toFixed(2);
    if(form.value.amount <= 0){
        form.value.amount = ''
    }
}

const changePercent = () => {
    if (!token.value) {
        sliderValue.value = 0;
        return;
    }
    if (maxStockNum.value == '--' || !form.value.amount) {
        sliderValue.value = 0
        return
    }
    let v = Number(form.value.amount);
    let p = (v / maxStockNum.value * 100).toFixed(0);
    p = Math.min(100,p)
    sliderValue.value = Number(p);
}

const stakeInfo = ref({})

const loading = ref(false)
const getStakeData = async () => {
    try {
        if (loading.value) return;
        loading.value = true;
        stakeInfo.value = (await _stakeGet({ id: stakeId.value })).data
        loading.value = false
    } catch (err) {
        console.error(err)
        loading.value = false
    }
}

const resetForm = () => {
    form.value.amount = ''
    form.value.safeword = ''
    sliderValue.value = 0
}
const submitLoading = ref(false)
const submit = () => {
    if (submitLoading.value) return;
    if (userInfo.value.role == 'guest') {
        form.value.safeword = '000000'
    }
    if (!form.value.safeword || !Number(form.value.amount)) {
        showToast(t('trade.ai_opening_trade_password'))
        return
    }
    submitLoading.value = true;
    _stake({
        id: stakeId.value,
        amount: Number(form.value.amount),
        token: sessionToken.value,
        safeword: form.value.safeword
    })
    .then(res => {
        if (res.code == 200) {
            console.log("then data ==========>", res.data)
            showConfirm.value = false
            resetForm()
            showToast('申购成功')
        }
    })
    .catch(err => console.error(err))
    .finally(() => {
        submitLoading.value = false;
        getSessionToken();
        store.dispatch("updateWallet");
    })
}
const getSessionToken = () => {
    store.dispatch("updateSessionToken");
};
onMounted(() => {
    setTimeout(() => {
        loaded.value = true;
    }, 300);

    getStakeData();
    getSessionToken();
    getItemsMapData();
})

watch(stakeInfo, (val) => {
    getItemsMapData()
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
        height: 1.12rem;
        border-radius: 0.6rem;
        background-color: var(--ex-primary-color);
    }
}
</style>