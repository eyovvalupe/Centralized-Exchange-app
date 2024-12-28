<template>
  <div class="flex mt-[0.32rem] justify-between mb-[0.32rem]" v-if="recomendedCryptoList.length">
    <div class=" w-full h-[3.48rem] relative">
      <div class="flex items-center justify-between py-[0.24rem]">
        <div class="flex items-center gap-1">
          <div class="font-bold text-[0.32rem]">热卖</div>
          <div class="custom-heart-icon">
            <img :src="getStaticImgUrl('/static/img/home/fire.svg')" alt="">
          </div>
        </div>
        <div class=""></div>
      </div>
      <div class="bg-color w-full h-[2.64rem] rounded-[0.32rem] text-center p-[0.24rem]">
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
                    ? 'text-up'
                    : 'text-down',
              ]">
                <div class="text-[0.3rem] font-bold">{{ list.price }}</div>
                <div class="text-[0.3rem]">
                  {{
                    (list.ratio || 0) > 0
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
            currentSlide == index ? 'bg-primary' : 'bg-color opacity-50',
          ]"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
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
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
