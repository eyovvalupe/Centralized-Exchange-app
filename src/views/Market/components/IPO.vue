<!-- IPO -->
<template>
  <div class="market_ipo">
    <div class="market_ipo-all" @click="ipoPopup">
      <span>
        {{ textSelect }}
      </span>
      <img src="/static/img/trade/down.png" class="market_ipo-down-img" />
    </div>

    <Loading
      v-show="loading"
      type="spinner"
      class="market-ipo-loading"
    ></Loading>

    <PullRefresh
      v-model="reloading"
      @refresh="onRefresh"
      v-if="dataList.length > 0 && !loading > 0"
    >
      <div class="market_ipo-box" v-for="(i, key) in dataList" :key="key">
        <div class="market_ipo-box-header">
          <div class="market_ipo-box-header-title">{{ i.company_name }}</div>
          <div
            class="market_ipo-box-header-button"
            v-if="i == 2"
            style="background: #333333; color: white"
          >
            预售中
          </div>
          <div
            class="market_ipo-box-header-button"
            v-if="i == 3"
            style="background: #ebebeb; color: #838383"
          >
            已结束
          </div>
          <div class="market_ipo-box-header-button" v-if="i == 1 || i == 4">
            认购中
          </div>
        </div>

        <!-- <div class="market_ipo-box-time" v-if="i == 2">
          <CountDown :time="time" >
            <template #default="timeData">
              <span class="block">{{ timeData.hours }}</span>
              <span class="colon">:</span>
              <span class="block">{{ timeData.minutes }}</span>
              <span class="colon">:</span>
              <span class="block">{{ timeData.seconds }}</span>
          </template>
          </CountDown>
        </div> -->

        <div class="market_ipo-m-box">
          <div>
            <div class="market_ipo-m-box-p">{{ i.issue_price_max }}</div>
            <div class="market_ipo-m-box-t">认购价格</div>
          </div>

          <div>
            <div class="market_ipo-m-box-p">{{ i.issue_start_date }}</div>
            <div class="market_ipo-m-box-t">认购日期</div>
          </div>

          <div>
            <div class="market_ipo-m-box-p">---</div>
            <div class="market_ipo-m-box-t">上市价格</div>
          </div>
        </div>

        <div class="market_ipo-m-box-line"></div>

        <div class="market_ipo-b">
          <div class="market_ipo-b-detail" @click="opendetail(i)">
            <span>详情</span>
            <Icon name="arrow" class="market_ipo-b-arrow" />
          </div>
          <div
            class="market_ipo-b-detail-button"
            v-if="i.status == 'none' || i.status == 'listed'"
            style="background: #999999; color: white"
          >
            认购
          </div>
          <div
            class="market_ipo-b-detail-button"
            v-else
            @click="openSubscription(i)"
          >
            认购
          </div>
          <!-- <div class="market_ipo-b-detail-button" v-if="i.status == 'lssuing'" @click="openSubscription">认购</div> -->
        </div>
      </div>
    </PullRefresh>

    <!-- 数据列表为空 -->
    <NoData v-if="dataList.length === 0 && !loading" />

    <!-- 下拉框 -->
    <teleport to="body">
      <Popup
        v-model:show="showPopup"
        position="bottom"
        :style="{ height: '40%' }"
        class="market_ipo-popup"
        closeable
      >
        <div class="market_ipo-box">
          <div
            v-for="(i, key) in option"
            :key="key"
            class="market_ipo-box-item"
            :class="{ 'selected-class': selectedOption === i.value }"
            @click="select(i.value)"
          >
            {{ i.text }}
          </div>
        </div>
      </Popup>
    </teleport>
  </div>
</template>
<script setup>
import { Icon, Loading, Popup, PullRefresh } from "vant";
import { useRouter, useRoute } from "vue-router";
import { CountDown } from "vant";
import { onMounted, ref, computed } from "vue";
import { defineProps } from "vue";
import { _ipoList } from "@/api/api";
import NoData from "@/components/NoData.vue";
import store from "@/store";

const router = useRouter();
const time = ref(30 * 60 * 60 * 1000);
const dataList = ref([]);
const loading = ref(false);
const showPopup = ref(false);
const option = [
  { text: "所有", value: "" },
  { text: "发行中", value: "lssuing" },
  { text: "已上市", value: "listed" },
];
const selectedOption = ref("");
const page = ref(1);
const reloading = ref(false);
const token = computed(() => store.state.token)

const props = defineProps({
  type: String,
});

const opendetail = (val) => {
  store.commit("setIpoId", val.id);
  store.commit('setIpoDetail',val)
  router.push({ name: "ipodetail", query: { type: props.type } });
};

const openSubscription = (val) => {
  if (token.value) {
    store.commit("setIpoId", val.id);
    store.commit('setIpoDetail',val)
    // store.dispatch("updateSessionToken");
    router.push({ name: "subscription", query: { type: props.type } });
  } else {
    router.push({
      name: 'login',query:{reurl:'trade',redata:'winning'}
    });
  }
};

const getList = () => {
  const data = {
    status: selectedOption.value,
    vip: "",
    page: page.value,
  };
  _ipoList({ ...data })
    .then((res) => {
      if (res.code == 200) {
        if (reloading.value) {
          dataList.value = dataList.value.concat(res.data);
          loading.value = false;
          reloading.value = false;
        } else {
          dataList.value = res.data;
          loading.value = false;
        }
      } else {
        loading.value = falses;
        reloading.value = false;
      }
    })
    .finally(() => {
      loading.value = false;
      reloading.value = false;
    });
};

onMounted(() => {
  page.value = 1;
  loading.value = true;
  getList();
});

const ipoPopup = () => {
  showPopup.value = true;
};

const select = (i) => {
  selectedOption.value = i;
  showPopup.value = false;
  page.value = 1;
  getList();
};

const textSelect = computed(() => {
  const selected = option.find((i) => i.value === selectedOption.value);
  return selected ? selected.text : "";
});

const onRefresh = () => {
  reloading.value = true;
  page.value++;
  getList();
};

const init = () => {
  page.value = 1;
  loading.value = true;
  getList();
};

defineExpose({
  init,
});
</script>

<style lang="less">
.market_ipo {
  padding: 0 0.3rem;
  width: 100%;
  overflow: hidden;
  height: 100%;
  .market-ipo-loading {
    margin-top: 2rem !important;
    .van-loading__spinner {
      left: 45%;
    }
  }
  .market_ipo-all {
    width: 3.06rem;
    height: 0.72rem;
    border-radius: 0.48rem;
    background: #f6f8ff;
    padding: 0.16rem 0.3rem;
    display: flex;
    span {
      color: #014cfa;
      text-align: center;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 500;
      line-height: 0.4rem;
      flex: 1;
    }
    .market_ipo-down-img {
      width: 0.32rem !important;
      height: 0.32rem !important;
      margin-top: 0.04rem !important;
    }
  }
  .market_ipo-box {
    border-bottom: 0.02rem solid #eaeaea;
    .market_ipo-box-header {
      display: flex;
      justify-content: space-between;
      padding-top: 0.28rem;
      .market_ipo-box-header-title {
        color: var(--Greyscale-900, #0d0d12);
        font-size: 0.32rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.48rem;
      }
      .market_ipo-box-header-button {
        width: 1.24rem;
        height: 0.48rem;
        background-color: #e5ecfa;
        color: #014cfa;
        text-align: center;
        font-size: 0.24rem;
        font-style: normal;
        font-weight: 500;
        line-height: 0.48rem;
        border-bottom-left-radius: 0.12rem;
        border-top-right-radius: 0.12rem;
      }
    }
    .market_ipo-m-box {
      display: flex;
      justify-content: space-between;
      margin-top: 0.28rem;
      .market_ipo-m-box-p {
        color: #014cfa;
        font-size: 0.32rem;
        font-style: normal;
        font-weight: 500;
        margin-bottom: 0.2rem;
      }
      .market_ipo-m-box-t {
        color: var(--Greyscale-400, #818898);
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 400;
      }
    }
    .market_ipo-m-box-line {
      border-bottom: 0.02rem dashed #cbcbcb;
      margin-top: 0.2rem;
    }
    .market_ipo-b {
      display: flex;
      justify-content: right;
      padding: 0.2rem 0;
      .market_ipo-b-detail {
        margin-right: 0.5rem;
        cursor: pointer;
        span {
          color: #014cfa;
          font-size: 0.28rem;
          font-style: normal;
          font-weight: 400;
          line-height: 0.5rem;
          margin-right: 0.16rem;
        }
        .market_ipo-b-arrow {
          color: #014cfa;
          font-size: 0.28rem;
          line-height: 0.4rem;
        }
      }
      .market_ipo-b-detail-button {
        width: 1.26rem;
        height: 0.5rem;
        border-radius: 1.26rem;
        background: #014cfa;
        color: white;
        text-align: center;
        font-size: 0.28rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.5rem;
        cursor: pointer;
      }
    }
  }
  .market_ipo-box:last-of-type {
    border-bottom: 0px;
  }
  .market_ipo-box-time {
    display: flex;
    justify-content: right;
    margin-top: 0.14rem;
    .block {
      display: inline-block;
      width: 0.44rem;
      color: #fff;
      font-size: 0.24rem;
      text-align: center;
      background-color: #333333;
      border-radius: 0.06rem;
    }
    .colon {
      display: inline-block;
      margin: 0 0.08rem;
      color: #9798a7;
    }
  }
}
.market_ipo-popup {
  border-top-left-radius: 0.36rem;
  border-top-right-radius: 0.36rem;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding-bottom: 1.2rem;
  .market_ipo-box {
    margin-top: 1rem;
    .market_ipo-box-item {
      width: 100%;
      height: 0.96rem;
      text-align: center;
      line-height: 0.96rem;
      color: #333333;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      border-bottom: 0.02rem solid #f4f5f7;
    }
    .market_ipo-box-item:first-of-type {
      margin-right: 0.3rem;
    }
    .selected-class {
      color: #014cfa;
      background-color: #f4f5f7;
      position: relative;
    }
  }
}
</style>
