<template>
    <div class="ipostock">

        <Loading v-show="loading && token" type="spinner" class="market-ipo-loading"></Loading>


      <PullRefresh v-model="reloading" @refresh="onRefresh" v-if="dataList.length > 0 && !loading && token" >

        <div class="ipocontent" v-for="(i,key) in dataList" :key="key" @click="ipodetail(i.order_no)" v-if="!loading && token">
            <div class="bug-ing">认购中</div>
            <img src="/static/img/trade/no.png" alt="" class="already-img" v-if="i.status == 'failure'">
            <img src="/static/img/trade/already.png" alt="" class="already-img" v-if="i.status == 'success'">
            <div class="ipo-co">
                <span class="co-span">{{ i.company_name }}</span>
                <span class="ipo-up" v-if="i.status == 'listed'">
                  已上市
                </span>
                <span class="ipo-up" v-else>
                  发行中
                </span>
            </div>
            <div class="ipo-price" v-if="i.status == 'listed'">
                <span>上市价格</span>
                <span class="m-l">{{ i.listed_price }}</span>
            </div>
            <div class="ipo-price" v-else>
                <span>发行价格</span>
                <span class="m-l">{{ i.issue_price }}</span>
            </div>
            <div class="ipo-price">
                <span>认购数量</span>
                <span class="m-l">{{ i.volume }}</span>
            </div>
            <div class="ipo-price">
                <span>中签数量</span>
                <span class="m-l" style="color: #0953fa;">{{ i.winning || 0 }} 股</span>
            </div>
            <div class="ipo-price">
                <span>认购日期</span>
                <span class="m-l">{{ i.created }}</span>
            </div>
            <div class="ipo-price">
                <span>上市日期</span>
                <span class="m-l">--</span>
            </div>
        </div>

      </PullRefresh>


      <!-- 数据列表为空 -->
      <NoData v-if="dataList.length === 0 && !loading && token" />

        <!-- 未登录 -->
        <div class="no-data-box" style="height: 8rem;" v-show="!loading && !token">
          <img src="/static/img/trade/no-data.png" class="no-data-img">
          <p class="no-data-text">还未登录账号？<span style="color: #014cfa;cursor: pointer;" @click="jump('login')">马上登录</span>
          </p>
        </div>

    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import {_orderList} from '@/api/api'
import { computed, ref, onMounted } from 'vue';
import { Loading, PullRefresh } from 'vant';
import store from "@/store";
import NoData from "@/components/NoData.vue"

const router = useRouter();
const page = ref(1)
const dataList = ref([])
const loading = ref(false)
const token = computed(() => store.state.token);
const reloading = ref(false)

const ipodetail = (id) =>{
  store.commit('setIpoId',id)
  router.push({ name: 'winningIPODetail',query:{type: 'winning'}  });
}

const getlist = ()=>{
  _orderList({page:page.value}).then(res => {
    if (reloading.value) {
      dataList.value = dataList.value.concat(res.data);
      loading.value = false
      reloading.value = false
    } else {
      dataList.value = res.data
      loading.value = false
    }
  }).finally(() => {
      loading.value = false
      reloading.value = false
  })
}

onMounted(()=>{
  loading.value = true
  page.value = 1
  getlist()
})


const onRefresh = ()=>{
  reloading.value = true
  page.value++
  getlist()
}


const jump = (name) => {
  router.push({
    name,
    query:{reurl:'trade',redata:'winning'}
  });
};

</script>

<style lang="less">
.ipostock {
    padding: 0 0.32rem;
    background: white;
    padding-bottom: 0.5rem;
    .market-ipo-loading {
      margin-top: 2rem !important;
      .van-loading__spinner {
        left: 45%;
      }
    }
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