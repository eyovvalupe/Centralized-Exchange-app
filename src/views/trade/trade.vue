<template>
  <div class="trade">
    <div class="header">
      <!-- <div class="title">交易</div> -->
      <div style="display: flex;">
        <img src="/static/img/trade/open.png" alt="" class="open-img" @click="openleft"/>
          <!--  tabs-->
        <div class="trade-recommend_tabs">
            <div class="trade-recommend_tab" :class="{ 'active_tab': active == 0 }" @click="onChange(0)">股票</div>
            <div class="trade-recommend_tab" :class="{ 'active_tab': active == 1 }" @click="onChange(1)">IPO</div>
        </div>
      </div>
      

    <div style="display: flex;">
      <div class="value" @click="showPopup" style="margin-right: 0.2rem;">
        <img src="/static/img/trade/value.png" alt="" class="value-img" />
        <!-- <span style="vertical-align: middle">持仓价值</span> -->
      </div>
      <div class="value">
        <img src="/static/img/trade/risk.png" alt="" class="value-img" />
      </div>
    </div>
      
    </div>

     

    <transition :name="transitionName">
        <MarketStock
          v-if="active === 0"
        />
        <div class="trade-tabs" v-else="active === 1" >
          <Tabs class="tabs" @change="ipoOnChange" v-model:active="ipoActive" :swipeable="false" animated
            :color="'#014CFA'" shrink>
            <Tab :title="'IPO'" class="optional">
            </Tab>
            <Tab :title="'中签'">
            </Tab>
        </Tabs>
        </div>
    </transition>

    <transition :name="ipoTransitionName">
      <div v-if="ipoActive === 0 && active === 1">
        <IPO :type="'trade'"/>
      </div>
      <div v-else-if="ipoActive === 1 && active === 1">
        <IPOStock />
      </div>
    
    </transition>



    <Popup v-model:show="show" position="top" class="trade-popup">
      <div class="popup-title">交易</div>
      <div class="total-value">总持仓价值</div>
      <div class="num">98148.56</div>
      <div class="popup-flex">
        <div class="flex-box">
          <div class="t-flex">持仓收益</div>
          <div class="b-num">+4578.25</div>
        </div>
        <div class="flex-box">
          <div class="t-flex">持仓收益率</div>
          <div class="b-num">+48.23%</div>
        </div>
      </div>
    </Popup>


    <teleport to="body">
      <Popup v-model:show="showOpenPositionBottom" position="bottom" closeable :style="{ height: popupHeight }"
        :class="['detail-popup', { keypadding: keyborader }]" @close="closePopup" v-if="showOpenPositionBottom">
        <component :is="popupComponent" />
      </Popup>
    </teleport>



     <!-- 侧边栏 -->
     <teleport to="body">
      <Popup
        v-model:show="showLeft"
        position="left"
        class="left-popup"
        :style="{ width: '85%', height: '100%' }"
        @close = 'leftclose'
      >
        <div class="optional-box">
          <!-- 搜索框 -->
          <div class="search_box">
              <div class="icon">
                  <img src="/static/img/common/search.png" alt="🔍">
              </div>
              <input ref="iptRef" @keydown="keydown" @keydown.enter="resetData" placeholder="搜索" type="text"
                  enterkeyhint="search" v-model.trim="search" class="search">
              <div class="close" v-show="search" @click="clearData">
                  <Icon name="cross" />
              </div>
          </div>
          <Loading v-show="loading" type="spinner" class="position-loading"></Loading>
          <Optional v-if="showLeft && !loading" ref="OptionalRef" />
        </div>
      </Popup>
    </teleport>

  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { Tab, Tabs, Popup, Sticky,Loading } from "vant";
import MarketStock from "./MarketStock.vue";
import IPOStock from "./IPOStock.vue";
import { useRouter, useRoute } from "vue-router";
import IPO from "../Market/components/IPO.vue"
import store from "@/store";
import Optional from "../trade/components/Optional.vue"
import { useSocket } from "@/utils/ws";
import { _search, _watchlist } from "@/api/api"

const token = computed(() => store.state.token);
const loading = ref(false);

const { startSocket } = useSocket();

const active = ref(0);
const previousActive = ref(0)
const ipoActive = ref(0);
const route = useRoute();
const router = useRouter();
if (route.query.type === "ipodetail") {
  active.value = 1;
}
if (route.query.type === 'winning') {
  active.value = 1;
  ipoActive.value = 1
}


const transitionName = ref('slide-left');
const ipoTransitionName = ref('slide-left');


watch([active], ([newActive]) => {
  if (previousActive.value === 0 && newActive === 1) {
    transitionName.value = 'slide-right';
  } else if (previousActive.value === 1 && newActive === 0) {
    transitionName.value = 'slide-left';
  }
});


watch([ipoActive], ([newActive]) => {
  if (newActive === 0) {
    ipoTransitionName.value = 'slide-left';
  } else if (newActive === 1) {
    ipoTransitionName.value = 'slide-right';
  }
});

const show = ref(false);
const showBottom = ref(false);
const showUpdateBottom = ref(false);
const showClosePositionBottom = ref(false);

const search = ref('')
const OptionalRef = ref()


const showPopup = () => {
  show.value = true;
};

const onChange = (val) => {
  if (Object.keys(route.query).length > 0) {
    router.push({ path: route.path, query: {} });
  }
  previousActive.value = active.value;
  active.value = val;
};

const ipoOnChange = (val)=>{
  if (Object.keys(route.query).length > 0) {
    router.push({ path: route.path, query: {} });
  }
  ipoActive.value = val
}


//弹窗组件
const showOpenPositionBottom = computed(() => store.state.showOpenPositionBottom)
const showLeft = computed(() => store.state.showLeft)
const popupHeight = computed(() => store.state.popupHeight)
const popupComponent = computed(() => store.state.popupComponent)
const keyborader = computed(() => store.state.keyborader)
const closePopup = () => {
  store.dispatch('closePopup')
}


const openleft = ()=>{
  store.commit('setShowLeft',true)
  // store.commit('setMarketWatchList', [])
  getWatchList()
  setTimeout(() => {
    OptionalRef.value && OptionalRef.value.init()
  }, 500)
}


const leftclose = ()=>{
  store.commit('setShowLeft',false)
  search.value = ''
  // 取消订阅
  const socket = startSocket(() => {
        socket && socket.emit('realtime', '') // 价格变化
        socket && socket.emit('snapshot', '') // 快照数据
        socket && socket.off('realtime')
        socket && socket.off('snapshot')
        console.error('取消订阅')
    })
}

const watchList = computed(() => store.state.marketWatchList || [])
const getWatchList = () => { // 获取订阅列表
    if (loading.value) return
    loading.value = true
    // if (watchList.value.length) {
    //     subs()
    // }
    _watchlist().then(res => {
        if (res.code == 200) {
            if (watchList.value.length) { // 有历史数据就更新
                const rs = res.data.map(item => {
                    const target = watchList.value.find(a => a.symbol == item.symbol)
                    if (target) {
                        Object.assign(target, item)
                        item = target
                    }
                    return item
                })
                store.commit('setMarketWatchList', rs || [])
            } else { // 没有就直接提交
                store.commit('setMarketWatchList', res.data || [])
            }

            setTimeout(() => {
                subs()
            }, 1000)
        }
    }).finally(() => {
        loading.value = false
    })
}


const subs = () => { // 订阅 ws
    store.dispatch('subList', {
        commitKey: 'setMarketWatchList',
        proxyListValue: watchList.value
    })
}


// 搜索相关
const getData = () => { // 获取数据
    loading.value = true
    _search({
        symbol: search.value
    }).then(res => {
        store.commit('setMarketWatchList', res.data)
        store.dispatch('subList', {
            commitKey: 'setMarketWatchKeys',
            proxyListValue: res.data
        })
        loading.value = false
    }).finally(() => {
        loading.value = false
    })
}

const resetData = () => { // 搜索
    // store.commit('setMarketSearch', {
    //     search: '',
    //     list: []
    // })
    getData()
}

const clearData = () => { // 重置搜索
    search.value = ''
}

let timeout = null
const keydown = () => { // 输入事件监听
    setTimeout(() => {
        console.error(search.value)
        if (timeout) clearTimeout(timeout)
        if (!search.value) return
        timeout = setTimeout(() => {
          getData()
        }, 500)
    }, 0)
}
</script>

<style lang="less">
.trade {
  position: relative;
  padding-bottom: 1.4rem;
  min-height: 100%;
  overflow-y: auto;
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.2rem;
    padding: 0 0.3rem;
  }
  .trade-recommend_tabs {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      // margin-bottom: .32rem;
      // padding: 0 0.3rem;

      .trade-recommend_tab {
          font-size: 0.28rem;
          color: #061023;
          padding: 0 0.4rem;
          height: 0.6rem;
          border-radius: 0.48rem;
          display: flex;
          align-items: center;
          cursor: pointer;
      }

      .active_tab {
          color: #014CFA;
          background-color: #F6F8FF;
      }
  }
  .title {
    height: 1.12rem;
    color: #0d0d12;
    font-size: 0.56rem;
    font-weight: 600;
    line-height: 1.12rem;
  }
  .value {
    color: #0953fa;
    font-size: 0.24rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    flex: 1;
    height: 1.12rem;
    line-height: 1.12rem;
    text-align: right;
  }
  .value-img {
    width: 0.52rem !important;
    height: 0.52rem !important;
    vertical-align: middle;
  }
  .open-img {
    width: 0.34rem !important;
    height: 0.34rem !important;
    width: 0.4rem !important;
    height: 0.4rem !important;
    margin-top: 0.3rem;
    margin-right: 0.3rem;
  }
  .stock-tab {
    .van-tabs__nav--line {
      padding-bottom: 0.32rem;
    }
    .van-tabs__wrap {
      height: 0.88rem;
      padding: 0 0.3rem;
    }
    > .van-tabs__wrap > .van-tabs__nav {
      > .van-tab {
        width: 1.9rem;
        height: 0.72rem;
        flex-shrink: 0;
        border-radius: 0.48rem;
        flex: none;
        color: #061023;
        font-size: 0.32rem;
        font-style: normal;
        font-weight: 500;
        line-height: 0.5rem;
        padding: 0;
      }
      > .van-tab--active {
        background: #f6f8ff;
        color: #014cfa;
        text-align: center;
        font-size: 0.32rem;
        font-style: normal;
        font-weight: 600;
        line-height: 0.48rem;
      }
      > .van-tabs__line {
        height: 0;
      }
    }
  }
  .trade-tabs {
    background: white;
    .tabs {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        .van-tabs__wrap {
            padding: 0 0.32rem;
        }

        .van-tabs__nav {
            position: relative;

            &::after {
                content: '';
                width: 100%;
                height: 1px;
                background-color: #3B82F6;
                position: absolute;
                bottom: 16px;
                left: 0;
                opacity: 0.3;
            }
        }

        .van-tab {
            margin-left: 0.36rem;
        }
        .van-tab:first-of-type {
          margin-left: 0.1rem;
        }

        .van-tabs__content {
            flex: 1;

            .van-swipe-item {
                overflow-y: auto;
                padding-bottom: 0.2rem;
            }
        }
    }
  }
}

@media (min-width: 751px) {
  .trade-popup {
    max-width: 375px;
    position: absolute!important;
  }
}

.trade-popup {
  min-height: 4.4rem;
  padding: 0 0.32rem;
  .popup-title {
    color: #0d0d12;
    font-size: 0.56rem;
    font-style: normal;
    font-weight: 600;
    line-height: 0.5rem;
    padding-top: 0.3rem;
    margin-bottom: 0.32rem;
  }
  .total-value {
    color: #061023;
    text-align: center;
    font-size: 0.36rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.3rem;
  }
  .num {
    color: #061023;
    text-align: center;
    font-size: 0.6rem;
    font-style: normal;
    font-weight: 600;
    line-height: 0.3rem;
    margin-top: 0.48rem;
    margin-bottom: 0.6rem;
  }
  .popup-flex {
    display: flex;
    .flex-box {
      flex: 1;
      text-align: center;
    }
    .t-flex {
      color: #333;
      text-align: center;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 400;
      line-height: 0.3rem;
      margin-bottom: 0.2rem;
    }
    .b-num {
      color: #333;
      text-align: center;
      font-size: 0.32rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.3rem;
    }
  }
}

.detail-popup {
  border-top-left-radius: 0.36rem;
  border-top-right-radius: 0.36rem;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding-bottom: 1.2rem;
}

.keypadding {
  padding-bottom: 5rem !important;
}

@media (min-width: 751px) {
  .detail-popup {
    max-width: 375px;
    position: fixed !important;
    padding-bottom: 3rem !important;
    left: 50% !important;
    transform: translateX(-50%);
  }
}

.optional-box {
  .position-loading {
    margin-top: 2rem !important;
    .van-loading__spinner {
      left: 45%;
    }
  }
  .search_box {
        display: flex;
        align-items: center;
        padding: 0 0.4rem;
        margin: 0.2rem 0.15rem 0.4rem 0.15rem;
        height: 0.8rem;
        background-color: #F4F5F7;
        border-radius: 0.2rem;

        &:has(.search:focus) {
            border: 1px solid #014CFA;
        }

        .icon {
            width: 0.48rem;
            height: 0.48rem;
            img {
              width: 0.48rem !important;
              height: 0.48rem !important;
            }
        }

        .close {
            width: 0.24rem;
            height: 0.24rem;
            color: #121826;
        }

        .search {
            flex: 1;
            margin: 0 0.16rem;
            font-size: 0.32rem;
            font-weight: 400;
        }
    }
}
</style>
