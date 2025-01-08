<template>
    <div class="px-[0.4rem] py-[0.6rem]">
        <div class="px-[0.12rem]  pb-[0.12rem] bg-color3 rounded-[0.32rem]">
            <div class="h-[0.92rem] flex items-center text-color text-[0.32rem] px-[0.16rem] gap-[0.16rem]">
                <div v-if="paramCurrency" class="size-[0.4rem]">
                    <img :src="getStaticImgUrl(`/static/img/crypto/${paramCurrency.toUpperCase()}.svg`)" />
                </div>
                {{ paramCurrency }}
            </div>
            <div class="p-[0.28rem] rounded-[0.32rem] bg-color2">
                <div class="flex justify-between items-center leading-[0.44rem]">
                    <span class="text-color2">质押金额</span>
                    <span class="text-color">2000 <span class="text-[0.24rem]">USDT</span></span>
                </div>
                <div class="flex justify-between  items-center mt-[0.2rem] leading-[0.44rem]">
                    <span class="text-color2">借款金额</span>
                    <span class="text-color">0 <span class="text-[0.24rem]">USDT</span></span>
                </div>
                <div class="flex justify-between  items-center mt-[0.2rem] leading-[0.44rem]">
                    <span class="text-color2">借币期限</span>
                    <span class="text-color">7天</span>
                </div>
                <div class="flex justify-between items-center mt-[0.2rem] leading-[0.44rem]">
                    <span class="text-color2">利息/天</span>
                    <span class="text-color">0.00%</span>
                </div>
                <div class="flex justify-between  items-center mt-[0.2rem] leading-[0.44rem]">
                    <span class="text-color2">总利息</span>
                    <span class="text-color">0 <span class="text-[0.24rem]">USDT</span></span>
                </div>
                <div class="flex justify-between  items-center mt-[0.2rem] leading-[0.44rem]">
                    <span class="text-color2">总利息</span>
                    <span class="text-color">0 <span class="text-[0.24rem]">USDT</span></span>
                </div>
            </div>
            <div class="flex items-center justify-center flex-col h-[1.4rem] mt-[0.12rem] bg-color2 rounded-[0.32rem] px-[0.28rem]">
                <span class="text-color2">到期应还(USDT)</span>
                <span class="text-color mt-[0.06rem] text-[0.32rem]">2400</span>
            </div>
        </div>

        <FormItem size="large" class="mt-[0.4rem]" :placeholder="'交易密码'" input-type="password" v-model="safeword" />

        <div class="pt-[0.6rem]">
            <Button size="large" round :loading="loading" @click="submit" type="primary">确认</Button>
        </div>
        
    </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import FormItem from "@/components/Form/FormItem.vue";
import { Button } from 'vant'
const props = defineProps({
    paramCurrency:String
})
const safeword = ref('')

</script>