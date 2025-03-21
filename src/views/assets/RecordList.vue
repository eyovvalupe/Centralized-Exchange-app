<!-- 记录列表 -->
<template>
  <div class="page page_record_list">
    <Top :title="t('recordList.financialRecords')">
      <template #right>
        <div class="w-[0.7rem] h-[0.7rem]" @click="router.push('/chat')">
          <img v-lazy="getStaticImgUrl('/static/img/user/server.svg')" alt="server" />
        </div>
      </template>
    </Top>
    <!-- 兑换记录 -->
    <div ref="list_3" class="list active_list" v-if="active == 3">
      <NoData v-if="!loading && !list.length" />
      <template v-if="active == 3">
        <div v-for="(item, i) in list" :key="i">
          <TransferItem :item="item" />
        </div>
      </template>
      <LoadingMore class="active_more" :loading="loading" :finish="finish"
        v-if="((finish && list.length) || !finish) && active == 3" />
    </div>

    <Tabs type="custom-tab" v-else v-model:active="active" :swipeable="false" animated shrink @change="init()">
      <Tab :title="t('recordList.rechargeRecord')" name="0">
        <div class="w-full justify-center" v-if="active == 0">
          <NoData v-if="!loading && !list.length" />
          <div v-for="(item, i) in list" :key="i" class="list_0_item">
            <div class="date" @click="dateClick(getDate(item.date), openDates)"
              v-if="i == 0 || getDate(item.date) != getDate(list[i - 1].date)">
              {{ getDate(item.date) }}
              <span class="date_more" :class="{
                date_more_up: !openDates.includes(getDate(item.date)),
              }"><img v-lazy="getStaticImgUrl('/static/img/common/more.svg')" alt="more" /></span>
            </div>
            <transition name="opacity">
              <RechargeItem :item="item" v-show="!openDates.includes(getDate(item.date))" />
            </transition>
          </div>
          <LoadingMore class="active_more" :loading="loading" :finish="finish"
            v-if="((finish && list.length) || !finish) && active == 0" />
        </div>
      </Tab>
      <Tab :title="t('recordList.withdrawalRecord')" name="1">
        <div v-if="active == 1">
          <NoData v-if="!loading && !list.length" />
          <div v-for="(item, i) in list" :key="i" class="list_0_item">
            <div class="date" @click="dateClick(getDate(item.date), withdrawOpenDates)"
              v-if="i == 0 || getDate(item.date) != getDate(list[i - 1].date)">
              {{ getDate(item.date) }}
              <span class="date_more" :class="{
                date_more_up: !withdrawOpenDates.includes(getDate(item.date)),
              }"><img v-lazy="getStaticImgUrl('/static/img/common/more.svg')" alt="more" /></span>
            </div>
            <transition name="opacity">
              <WithdrawItem :item="item" v-show="!withdrawOpenDates.includes(getDate(item.date))" />
            </transition>
          </div>
          <LoadingMore class="active_more" :loading="loading" :finish="finish"
            v-if="((finish && list.length) || !finish) && active == 1" />
        </div>
      </Tab>
      <Tab :title="t('recordList.transfer')" name="2">
        <div v-if="active == 2">
          <NoData v-if="!loading && !list.length" />
          <div v-for="(item, i) in list" :key="i" class="list_0_item">
            <div class="date" @click="dateClick(getDate(item.created), transferOpenDates)"
              v-if="i == 0 || getDate(item.date) != getDate(list[i - 1].date)">
              {{ getDate(item.created) }}
              <span class="date_more" :class="{
                date_more_up: !transferOpenDates.includes(
                  getDate(item.created)
                ),
              }"><img v-lazy="getStaticImgUrl('/static/img/common/more.svg')" alt="more" /></span>
            </div>
            <transition name="opacity">
              <TransferItem :item="item" v-show="!transferOpenDates.includes(getDate(item.created))" />
            </transition>
          </div>
          <LoadingMore class="active_more" :loading="loading" :finish="finish"
            v-if="((finish && list.length) || !finish) && active == 2" />
        </div>
      </Tab>
    </Tabs>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import Top from "@/components/Top.vue";
import { Tab, Tabs } from "vant";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { _depositList, _withdrawList, _transferLog } from "@/api/api";
import NoData from "@/components/NoData.vue";
import LoadingMore from "@/components/LoadingMore.vue";
import RechargeItem from "@/components/RecordItem/RechargeItem.vue";
import WithdrawItem from "@/components/RecordItem/WithdrawItem.vue";
import TransferItem from "@/components/RecordItem/TransferItem.vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import router from "@/router";

const { t } = useI18n();
const openDates = ref([]);
const withdrawOpenDates = ref([]);
const transferOpenDates = ref([]);

const route = useRoute();
const dateClick = (date, dates) => {
  const index = dates.indexOf(date);
  if (index > -1) {
    dates.splice(index, 1);
  } else {
    dates.push(date);
  }
};

const active = ref(route.query.tab || 0);
const reqs = {
  0: _depositList,
  1: _withdrawList,
  2: _transferLog,
  3: _transferLog,
};

// 初始化
const loading = ref(false);
const finish = ref(false);
const page = ref(0);
const list = ref([]);
const init = () => {
  loading.value = false;
  finish.value = false;
  page.value = 0;
  list.value = [];
  initWatch();
  getData();
  setTimeout(() => {
    lastTop.value = 0;
  }, 100);
};
const getData = () => {
  // 获取数据
  if (loading.value || finish.value) return;
  loading.value = true;
  page.value++;
  // 先从缓存拿值
  if (page.value == 1) {
    try {
      list.value = JSON.parse(
        sessionStorage.getItem("popup_record_" + active.value) || "[]"
      );
    } catch { }
  }
  const saveActive = active.value;
  reqs[active.value]({
    page: page.value,
  })
    .then((res) => {
      if (saveActive != active.value) return; // 不是当前列表的请求返回
      if (!res.data?.length) {
        finish.value = true;
      }
      if (page.value == 1) {
        // 缓存首页数据
        list.value = res.data || [];
        sessionStorage.setItem(
          "popup_record_" + active.value,
          JSON.stringify(res.data || [])
        );
      } else {
        list.value.push(...(res.data || []));
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const lastTop = ref(0);
const scrollHandle = (event) => {
  // 获取当前滚动位置
  let scrollTop = event.target.scrollTop;
  // 更新上一次滚动位置
  lastTop.value = scrollTop;
  const rect = moreDom.getBoundingClientRect();
  if (rect && rect.top <= totalHeight) {
    // 加载更多
    getData();
  }
};

let moreDom = "";
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
// 滚动监听
const initWatch = () => {
  setTimeout(() => {
    destoryWatch();
    moreDom = document.querySelector(".active_more");
    document
      .querySelector(".page_record_list")
      .addEventListener("scroll", scrollHandle);
  }, 300);
};
const destoryWatch = () => {
  document
    .querySelector(".page_record_list")
    .removeEventListener("scroll", scrollHandle);
};

onMounted(() => {
  setTimeout(() => {
    init();
  }, 0);
});
onBeforeUnmount(() => {
  boforeClose();
});
const boforeClose = () => {
  destoryWatch();
};

// 获取日期
const getDate = (str) => {
  if (str) {
    const newDate = str.split(" ");
    const newDate1 = newDate[0].split("-");
    return `${newDate1[0]}/${newDate1[1]}`;
  }
};
</script>

<style lang="less" scoped>
.page_record_list {
  padding: 1.12rem 0.32rem 0.32rem 0.32rem;

  :deep(.list_0_item) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.date {
  height: 0.32rem;
  padding: 0.1rem 0;
  margin-top: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.date_more {
  width: 0.32rem;
  height: 0.32rem;
  margin-left: 0.06rem;

  img {
    transition: 0.3s;
  }
}

.date_more_up img {
  transform: rotate(-180deg);
}
</style>
