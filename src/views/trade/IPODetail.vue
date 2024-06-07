<template>
  <div class="ipo-detail-box">
    <div class="ipo-detail-header">
      <Icon name="arrow-left" class="arrow-left" @click="goTotrade" />
      <span>IPO 详情</span>
    </div>

    <div class="ipo-box">
      <div class="ipo-co-f">
        <div class="h-co-title">
          Bharti Hexacom LIMITED IPO
        </div>
        <div class="ipo-up-button">
          已上市
        </div>
      </div>

      <div class="ipo-box-flex">
        <div class="ipo-title">
          认购开始日期
        </div>
        <div class="ipo-text">
          2024-04-12
        </div>
      </div>

      <div class="ipo-box-flex">
        <div class="ipo-title">
          认购结束日期
        </div>
        <div class="ipo-text">
          2024-04-14
        </div>
      </div>

      <div class="ipo-box-flex">
        <div class="ipo-title">
          上市日期
        </div>
        <div class="ipo-text">
          2024-04-14
        </div>
      </div>


      <div class="ipo-box-flex">
        <div class="ipo-title">
          价格
        </div>
        <div class="ipo-text">
          87.3-90.2 INR
        </div>
      </div>

      <div class="ipo-box-flex">
        <div class="ipo-title">
          最低认购数量
        </div>
        <div class="ipo-text">
          20000
        </div>
      </div>

      <div class="ipo-box-flex">
        <div class="ipo-title">
          认购杠杆
        </div>
        <div class="ipo-text">
          10 倍
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Icon } from 'vant';
import { useRouter } from 'vue-router';

const router = useRouter();
const goTotrade = () => {
  router.push({ name: 'trade', query: { type: 'ipodetail' } });
};

</script>

<style lang="less">
.ipo-detail-box {
  position: relative;
  padding: 0 0.3rem;
  background-color: white;
  .arrow-left {
    position: absolute;
    left: 0.3rem;
    top: 0.36rem;
  }
  .ipo-detail-header {
    padding: 0.3rem 0;
    background-color: white;
    color: #010101;
    font-size: 0.36rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.52rem;
    text-align: center;
  }
  .ipo-box {
    .ipo-box-flex {
      display: flex;
      justify-content: space-between;
      height: 1rem;
      line-height: 1rem;
      border-bottom: 0.02rem solid #f5f5f5;
      .ipo-title {
        color: #8F92A1;
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 400;
      }
      .ipo-text {
        color: #061023;
        text-align: right;
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 400;
      }
    }
  }
  .ipo-co-f {
    display: flex;
    justify-content: space-between;
    margin-top: 0.3rem;
    margin-bottom: 0.3rem;
    .h-co-title {
      color: var(--Greyscale-900, #0D0D12);
      font-size: 0.32rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.46rem;
    }
    .ipo-up-button {
      width: 1.14rem;
      height: 0.46rem;
      background-color: #e4ecfb;
      color: #014CFA;
      text-align: center;
      font-size: 0.2rem;
      font-style: normal;
      font-weight: 500;
      line-height: 0.46rem;
      border-bottom-left-radius: 0.28rem;
      border-top-right-radius: 0.12rem;
    }
  }
}
</style>
