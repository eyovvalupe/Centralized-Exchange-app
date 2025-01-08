<template>
    <div class="pledge_form">
        <!-- 验资数量 -->
        <div class="item_box mt-[0.4rem]">
            <div class="item_box_right">
                <FormItem
                :hasLT="true"
                :hasRT="true"
                :hasScroll="true"
                :placeholder="t('验资数量')"
                :max="maxStockNum"
                v-model="form1.volume" 
                @change="changePercent" 
                class="!h-[2.98rem]"
                input-height="1.3rem"
                input-type="number">
            
                <template #lt>
                    <div
                        class="pt-[0.12rem] text-color2 text-[0.24rem]">
                        <span>可验资金额</span>
                        <span class="text-primary mx-[0.08rem]">{{ stockWalletAmount || '--' }} </span>
                        <span>{{ paramCurrency }}</span>
                    </div>
                    
                </template>
                <template #rt>
                    <div class="flex items-center bg-color3 h-[0.88rem] rounded-[0.32rem] justify-between px-[0.2rem]">
                        <div class="flex items-center">
                            <div v-if="currIn.name" class="size-[0.52rem] mr-[0.16rem]">
                                <img class="rounded-50" :src="getStaticImgUrl(`/static/img/crypto/${currIn.name}.svg`)"
                                alt="currency" />
                            </div>
                            <span class="text-[0.3rem] w-[1rem]">{{ currIn.name || "--" }}</span>
                        </div>
                        <div class="more_icon">
                            <img :src="getStaticImgUrl('/static/img/common/more.svg')" alt="↓" />
                        </div>
                    </div>
                </template>
                <template #scroll>
                    <!-- 拖动 -->
                    <SlideContainer v-model="sliderValue" @change="onSliderChange" />
                </template>
                </FormItem>
            </div>
        </div>
        <!-- 可借数量 -->
        <div class="item_box mt-[0.32rem]">
            <div class="item_box_right">
                <FormItem
                input-height="1.3rem"
                :hasScroll="true"
                :placeholder="t('可借数量')"
                :max="maxStockNum"
                v-model="form1.volume" 
                @change="changePercent" 
                input-type="number">
            
                <template #scroll>
                    <!-- 拖动 -->
                    <SlideContainer v-model="sliderValue" @change="onSliderChange" />
                </template>
                </FormItem>
            </div>
        </div>
        <div class="px-[0.28rem]  py-[0.24rem] rounded-[0.32rem] bg-color2 border-color border-[1px] mt-[0.32rem]">
            <div class="text-[0.28rem] leading-[0.28rem] text-color2">借币期限</div>
            <div class="flex flex-wrap gap-[0.12rem] gap-y-[0.2rem] pt-[0.2rem]">
                <div class="px-[0.4rem] h-[0.6rem] text-color2 rounded-full text-[0.28rem] bg-color3 leading-[0.6rem]" :class="{'active-day':currentDay == day}" v-for="day in days" :key="day" @click="currentDay=day">
                    {{day}}天
                </div>
            </div>
        </div>
        <div class="bg-color3 mt-[0.32rem] p-[0.12rem] text-[0.28rem] rounded-[0.32rem]">
            <div class="p-[0.16rem]">
                <div class="flex justify-between items-center leading-[0.44rem]">
                    <span class="text-color2">利息/天</span>
                    <span class="text-color">0.00%</span>
                </div>
                <div class="flex justify-between  items-center mt-[0.2rem] leading-[0.44rem]">
                    <span class="text-color2">总利息</span>
                    <span class="text-color">0 <span class="text-[0.24rem]">USDT</span></span>
                </div>
                <div class="flex justify-between  items-center mt-[0.2rem] leading-[0.44rem]">
                    <span class="text-color2">手续费</span>
                    <span class="text-color">0 <span class="text-[0.24rem]">USDT</span></span>
                </div>
            </div>
            <div class="flex items-center justify-between h-[1.2rem] mt-[0.12rem] bg-color2 rounded-[0.32rem] px-[0.28rem]">
                <span class="text-color2">到期应还</span>
                <span class="text-color text-[0.32rem]">0 <span class="text-[0.24rem]">USDT</span></span>
            </div>
        </div>
        <div>
            <!-- 协议 -->
            <label class="pledge_doc">
                <div :class="checked ? 'checked_icon_blue' : 'unchecked_icon'" class="mr-[0.2rem]" @click="checked = !checked">
                    <img v-if="checked" :src="getStaticImgUrl('/static/img/user/checked_white.svg')" alt="">
                    <img v-else :src="getStaticImgUrl('/static/img/user/uncheck_primary.svg')" alt="">
                </div>
                我已阅读并同意<span>“借币服务协议”</span>
            </label>
        </div>
        <Button type="primary" class="submit" @click="visible=true;">
            <span class="text-[0.32rem] font-bold">{{ t('立即借币') }}</span>
        </Button>
        <div class="h-[2.2rem]"></div>

        <!-- 售出币种 -->
        <BottomPopup v-model:show="showDialog" closeable :safe-area-inset-top="true" :safe-area-inset-bottom="true"
            :title="t('market.market_buy_fast_search_title')">
            <div class="withdraw_accounr_dialog">

            <div class="search_box">
                <div class="icon">
                <img :src="getStaticImgUrl('/static/img/common/search.svg')" alt="🔍" />
                </div>
                <input ref="iptRef" v-model.trim="searchValue" :placeholder="t('market.market_buy_fast_search_input')"
                type="text" enterkeyhint="search" class="search" />
            </div>
            <div class="swap_dialog_list">
                <div v-for="(item, i) in wallet" :key="i" class="swap_dialog_item" :class="{
                swap_dialog_item_active: currIn.name == item.name,
                }" @click="clickItem(item)">
                <div class="icon">
                    <img class="rounded-50" :src="getStaticImgUrl(`/static/img/crypto/${item.name}.svg`)" alt="currency" />
                </div>
                <span>{{ item.name }}</span>
                <Icon v-if="currIn.name == item.name" class="check_icon" name="success" />
                </div>
            </div>
            </div>
        </BottomPopup>
        <BottomPopup closeable v-model:show="visible" title="订单确认">
            <PledgeConfirm :paramCurrency="paramCurrency" />
        </BottomPopup>
    </div>
</template>

<script setup>
import { ref,reactive } from 'vue'
import { Button } from 'vant'
import SlideContainer from "@/components/SlideContainer.vue";
import FormItem from "@/components/Form/FormItem.vue";
import { useI18n } from "vue-i18n";
import store from "@/store";
import Decimal from "decimal.js";
import { getStaticImgUrl } from "@/utils/index.js"
import {_pledgePara} from '@/api/api'
import BottomPopup from '@/components/BottomPopup.vue'
import PledgeConfirm from './PledgeConfirm.vue'

const searchValue = ref("");
const filterSearchValue = (data) => {
  return data.filter((item) =>
    item.name.toLowerCase().includes(searchValue.value.toLowerCase())
  );
};

const wallet = computed(() => {
  // 售出钱包
  const data = store.state.deWeightCurrencyList.filter((item) => item.type == "crypto");
  return filterSearchValue(data);
});


const { t } = useI18n();

const visible = ref(false)
const checked = ref(true)
const stockWalletAmount = computed(() => {
  // 钱包余额
  const target = wallet.value.find(
    (item) => item.currency == paramCurrency.value
  );
  if (target) return target.amount;
  return 0;
});

const currIn = ref({
    name:"USDT"
}); // 当前收到钱包

const clickItem = (item) => {
    currIn.value = item;
    showDialog.value = false;

};


const currentDay = ref(7)
const days = ref([7,15,45,60,90])

const param = ref({
    days:'',
    interest:'',
    fee:'',
    lever:''
})
const paramCurrency = ref("USDT"); // 交易使用的货币

const form1 = ref({
  leverType: "cross",
  lever: 1,
  volume: "",
  price: "",
  stop_profit_type: null, // 价格-[ price ]  金额-[ amount ]  百分比-[ ratio ]
  stop_profit_price: null,
  stop_loss_type: null,
  stop_loss_price: null,
});

const getPara = ()=>{
    _pledgePara().then(res=>{
        console.log(res)
    })
}

//getPara()

const maxStockNum = computed(()=>{
    return 1000
})

// 申请
const apply = () => {
};
const sliderValue = ref(0);

const onSliderChange = (newValue) => {
  sliderValue.value = newValue;
  if (maxStockNum.value == "--") return (sliderValue.value = 0);
  let v = new Decimal(maxStockNum.value).mul(newValue).div(100);
  v = v.sub(v.mod(step.value));
  form1.value.volume = v.toNumber();
  setTimeout(() => {
    changePercent();
  }, 0);
};

const changePercent = () => {
  if (maxStockNum.value == "--" || !form1.value.volume)
    return (sliderValue.value = 0);
  let v = new Decimal(form1.value.volume);
  form1.value.volume = v.sub(v.mod(step.value));
  let p = new Decimal(form1.value.volume)
    .div(maxStockNum.value)
    .mul(100)
    .toNumber();
  if (p < 0) p = 0;
  if (p > 100) p = 100;
  sliderValue.value = Number(p);
};


</script>
<style lang="less" scoped>
.pledge_form{
    .pledge_doc {
        overflow: hidden;
        display: flex;
        margin-top:0.28rem;
        align-items: center;
        justify-content: flex-start;
        color: var(--ex-text-color5);
        font-weight: 400;
        font-size: 0.28rem;
        line-height: 0.32rem;
        margin-bottom: 0.64rem;

        .checked_icon_blue {
        width: 0.32rem;
        height: 0.32rem;
        border: 0.02rem solid var(--ex-border-color2);
        background-size: contain;
        border-radius: 0.08rem;
        background-repeat: no-repeat;
        }

        .unchecked_icon {
        width: 0.32rem;
        height: 0.32rem;
        background-color: transparent;
        border: 0.02rem solid var(--ex-border-color2);
        border-radius: 0.08rem;
        }

        .pledge_doc_check {
        margin-right: 0.24rem;
        }

        >span {
        color: var(--ex-primary-color);
        }
    }
    .active-day {
        background-color:var(--ex-primary-color);
        color:var(--ex-text-color);
    }
    .submit {
        border-radius: 0.32rem;
        height: 1.12rem;
        width:100%;
    }
}

</style>