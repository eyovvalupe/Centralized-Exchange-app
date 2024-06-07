<template>
    <div class="ipostock">
        <div class="ipocontent" v-for="i in 4" :key="i" @click="ipodetail">
            <div class="bug-ing">认购中</div>
            <img src="/static/img/trade/no.png" alt="" class="already-img" v-if="i===2">
            <img src="/static/img/trade/already.png" alt="" class="already-img" v-else>
            <div class="ipo-co">
                <span class="co-span">Bharti Hexacom LIMITED IPO </span>
                <span class="ipo-up">
                  已上市
                </span>
            </div>
            <div class="ipo-price">
                <span>上市价格</span>
                <span class="m-l">12344INR</span>
            </div>
            <div class="ipo-price">
                <span>认购数量</span>
                <span class="m-l">1888888</span>
            </div>
            <div class="ipo-price">
                <span>中签数量</span>
                <span class="m-l" style="color: #0953fa;">2000 股</span>
            </div>
            <div class="ipo-price">
                <span>认购日期</span>
                <span class="m-l">2024-04-25</span>
            </div>
            <div class="ipo-price">
                <span>上市日期</span>
                <span class="m-l">2024-04-25 13:50:20</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const ipodetail = () =>{
  router.push({ name: 'ipodetail' });
}

</script>

<style lang="less">
.ipostock {
    padding: 0 0.32rem;
    background: white;
    padding-bottom: 0.5rem;
    .ipocontent {
      position: relative;
      margin-bottom: 0.2rem;
      width: 100%;
      height: 3.48rem;
      border: 0.02rem solid #C1C7D0;
      border-radius: 0.12rem;
      padding: 0.2rem 0;
      padding-left: 0.4rem;
    }
    .ipocontent:first-of-type {
      margin-top: 0.12rem;
    }
    .bug-ing {
      width: 1.14rem;
      height: 0.46rem;
      color: #014CFA;
      text-align: center;
      font-size: 0.24rem;
      font-style: normal;
      font-weight: 500;
      background-color: #e4ecfb;
      line-height: 0.46rem;
      position: absolute;
      right: 0;
      border-bottom-left-radius: 0.28rem;
      border-top-right-radius: 0.12rem;
      top: 0;
    }
    .ipo-co {
      display: flex;
      .co-span {
        color: var(--Greyscale-900, #0D0D12);
        font-size: 0.32rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.56rem;
        vertical-align: middle;
      }
      .ipo-up {
        color: #ED700D;
        text-align: right;
        font-size: 0.2rem;
        font-style: normal;
        font-weight: 600;
        vertical-align: middle;
        line-height: 0.56rem;
        margin-left: 0.16rem;
      }
    }
    .ipo-price {
      color: var(--Greyscale-400, #818898);
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.42rem;
      margin-bottom: 0.12rem;
      .m-l {
        margin-left: 0.16rem;
        display: inline-block;
      }
    }
    .already-img {
      width: 1.68rem!important;
      height: 1.68rem!important;
      position: absolute;
      right: 0.3rem;
      top: 1rem;
    }
}
</style>