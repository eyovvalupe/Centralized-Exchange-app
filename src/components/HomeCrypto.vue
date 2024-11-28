<template>
  <div class="flex mt-[0.32rem] justify-between mb-[0.32rem]" v-if="recomendedCryptoList.length">
    <!-- <div
      class="rounded-[0.32rem] w-[3.33rem] h-[3.48rem] bg-gradient-to-b from-[#98b0eb] border-[0.02rem] border-[#EFF3F8] via-[#F5F7FC] to-[#F5F7FC] p-[0.32rem] relative"
    >
      <div class="w-1/2 absolute bottom-0 right-0">
        <img src="/static/img/home/hand.svg" img="img" />
      </div>
      <div class="font-bold text-[0.32rem] mb-[0.32rem]">邀请朋友注册</div>
      <div class="text-[0.28rem] text-[#666D80] mb-[0.32rem]">各得最高</div>
      <div class="text-[0.28rem] text-[#666D80] mb-[0.64rem]">
        1000 USDT 奖励
      </div>
      <div
        class="w-[1.2rem] h-[0.6rem] bg-[#014CFA] border-[#014CFA] text-[#FFF] text-[0.28rem] rounded-[0.32rem] flex items-center justify-center border-[0.02rem]"
      >
        去邀请
      </div>
    </div> -->
    <div class=" w-full h-[3.48rem] relative">
      <div class="flex items-center justify-between py-[0.24rem]">
        <div class="flex items-center gap-1">
          <div class="font-bold text-[0.32rem]">热卖</div>
          <div class="custom-heart-icon"></div>
        </div>
        <div class=""></div>
      </div>
      <div class="bg-[#FFF] w-full h-[2.64rem] rounded-[0.32rem] text-center p-[0.24rem]">
        <Carousel :autoplay="5000" :wrap-around="true" :mouseDrag="true" v-model="currentSlide">
          <Slide v-for="(list, index) in recomendedCryptoList" :key="index">
            <div @click="goInfo(list)" class="carousel__item p-[0.08rem]">
              <div class="text-[font-bold] text-[15px] mb-[0.32rem] mt-[0.12rem]">
                {{ list.symbol }}
              </div>
              <div class="flex justify-between mb-[0.3rem]" :class="[
                list.ratio == undefined
                  ? ''
                  : list.ratio > 0
                    ? 'text-[#18B762]'
                    : 'text-[#E8503A]',
              ]">
                <div class="text-[0.3rem] font-bold">{{ list.price }}</div>
                <div class="text-[0.3rem]">
                  {{
                    (list.ratio || 0)  > 0
                      ? "+" + (list.ratio || 0)
                      : (list.ratio || 0)
                  }}%
                </div>
              </div>
              <div>
                <SparkLine v-if="list.points" :style="'width: 100%; height: 0.94rem; '" :points="list.points"
                  :ratio="list.ratio" :xtimes="2.2" :ytimes="1.6" />
              </div>
            </div>
          </Slide>
        </Carousel>
      </div>
      <div class="absolute flex gap-[0.05rem] transition-all top-0 right-0 mr-[0.32rem] mt-[0.4rem]">
        <div v-for="(val, index) in recomendedCryptoList" :key="index" @click="() => (currentSlide = index)"
          class="h-[0.06rem] w-[0.12rem] rounded-[0.2rem] transition-all" :class="[
            currentSlide == index ? 'bg-[#014CFA]' : 'bg-[#FFFFFF] opacity-50',
          ]"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import store from "@/store";
import { ref, computed } from "vue";
import "vue3-carousel/dist/carousel.css";
import SparkLine from "./SparkLine.vue";
import router from "@/router";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
const recomendedCryptoList = computed(() =>
  store.state.marketContractRecommendList.length > 5
    ? store.state.marketContractRecommendList.slice(0, 5)
    : store.state.marketContractRecommendList || []
);
const currentSlide = ref(0);

const goInfo = (item) => {
  store.commit("setCurrConstract", item);
  router.push({
    name: "market_info",
    query: {
      symbol: item.name,
      type: "constract",
    },
  });
};

</script>
<style scoped>
.custom-heart-icon {
  width: 0.24rem;
  height: 0.28rem;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 14"><path d="M4.49621 13.9937C4.49621 13.9937 -1.73347 12.5172 0.936838 5.875C1.24621 6.15938 1.43371 6.65625 1.57903 6.94531C1.91496 3.4625 4.5259 3.12344 4.1509 0C5.16028 0.359375 8.34309 1.41875 8.8384 5.31719C9.3134 4.42812 10.0447 3.95469 10.5993 3.86094C10.4603 4.56094 10.6868 5.76719 11.1931 7.00156C11.9743 8.9125 12.0243 12.7156 8.08684 13.7016C8.68059 12.3188 8.91809 10.0766 5.9509 8.17656C5.4259 10.5797 2.7759 11.2188 4.49621 13.9937Z" fill="%23E53E00"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
