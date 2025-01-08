<template>
    <div class="w-full bg-color6 rounded-[0.32rem] mb-[0.28rem] pb-[0.12rem] pt-[0.24rem]" :class="i == list.length -1 ? 'mb-[3rem]' : ''" v-for="(item, i) in list">
        <div class="flex justify-between items-center mx-[0.28rem] mb-[0.32rem]">
            <div class="flex flex-col justify-between">
                <div class="mb-[0.16rem] size-[0.4rem] flex items-center gap-[0.16rem]">
                    <img :src="getStaticImgUrl(`/static/img/crypto/USDT.svg`)" alt="img" />
                    <div class="text-[0.32rem]">USDT</div>
                </div>
                <div>
                    <span class="text-[0.28rem] text-color2">应还总额</span>
                    <span class="text-[0.32rem] text-primary"> 4000 <span class="text-color text-[0.24rem]">USDT</span></span>
                </div>
                
            </div>
            <div class="px-[0.24rem] h-[0.6rem] min-w-[1.36rem] flex justify-center items-center bg-primary rounded-full" @click="open()">
                归还
            </div>
        </div>
        <div class="flex flex-col bg-color2 justify-between p-[0.28rem] rounded-[0.32rem] mx-[0.12rem]">
            <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                <div class="text-[0.28rem] text-color2">质押金额</div>
                <div class="text-[0.28rem]">2000 <span class="text-[0.24rem]">USDT</span></div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                <div class="text-[0.28rem] text-color2">借款金额</div>
                <div class="text-[0.28rem]">2000 <span class="text-[0.24rem]">USDT</span></div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                <div class="text-[0.28rem] text-color2">借款期限</div>
                <div class="text-[0.28rem]">7天</div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between mb-[0.2rem]">
                <div class="text-[0.28rem] text-color2">总利息</div>
                <div class="text-[0.28rem]">200 <span class="text-[0.24rem]">USDT</span></div>
            </div>
            <div class="w-full h-[0.44rem] flex items-center justify-between">
                <div class="text-[0.28rem] text-color2">手续费</div>
                <div class="text-[0.28rem]">200 <span class="text-[0.24rem]">USDT</span></div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js";
import router from "@/router";
const open = ()=>{
    router.push('/pledge/orderDetail')
}
const props = defineProps({
    list: {
        type: Array,
        default: ()=>[]
    }
})
</script>