<!-- AI量化 -->
<template>
  <div class="page_ai">
    <div class="list" v-if="props.page != 'home'">
      <Loaidng :type="'circular'"  :loading="page == 'trade' && (propsLoading || !list.length) || page != 'trade' && loading" v-if="(page == 'trade' && propsLoading && !list.length) || (page != 'trade' && !marketAiList.length || loading)" />
      <AiItem v-if="(page == 'trade' && !propsLoading && list.length) || (page != 'trade' && marketAiList.length && !loading)"  v-for="(item, i) in page == 'trade' ? list : marketAiList" :key="i" :item="item" />
      <NoData v-if="!loading && marketAiList.length == 0" />
    </div>

    <div class="list" v-if="props.page == 'home'">
      <Loaidng :loading="loading" v-if="!marketAiList.length && loading" />
      <AiItem class="wow fadeInUp" :data-wow-delay="(0.05 * i) + 's'"  v-for="(item, i) in marketAiList" :key="i" :item="item" :page="props.page" />
      <NoData v-if="!loading && marketAiList.length == 0" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Tabs, Tab } from "vant";
import AiItem from "./AiItem.vue";
import { _aiquant } from "@/api/api";
import Loaidng from "@/components/Loaidng.vue";
import NoData from "@/components/NoData.vue";
import store from "@/store/index";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emits = defineEmits("clickItem");
const clickItem = (item) => {
  emits("clickItems", item);
};
const props = defineProps({
  showTabs: {
    type: Boolean,
    default: true,
  },
  page: {
    type: String,
    default: "market",
  },
  list: {
    type: Array,
    default: []
  },
  propsLoading: {
    type: Boolean,
    default: false
  }
});

const marketAiList = computed(() => store.state.marketAiList || []); // ai量化默认列表
const marketAiHisList = computed(() => store.state.marketAiHisList || []); // ai量化历史收益率列表
const marketAi24List = computed(() => store.state.marketAi24List || []); // ai量化24小时收益率列表
const marketAiGridList = computed(() => store.state.marketAiGridList || []); // ai量化最大网格(杠杆)列表

const active = ref(0);
const orderby = ref("");
const changeTab = (val) => {
  switch (val) {
    case 0:
      orderby.value = "";
      break;
    case 1:
      orderby.value = "ratereturn";
      break;
    case 2:
      orderby.value = "ratereturn24h";
      break;
    case 3:
      orderby.value = "maxgrid";
      break;
  }
  getList();
};

const loading = ref(false);
const getList = () => {
  loading.value = true;
  const by = orderby.value;
  _aiquant({
    orderby: by,
  })
    .then((res) => {
      const list = res.data || [];
      switch (by) {
        case "ratereturn":
          store.commit("setMarketAiHisList", list);
          setTimeout(() => {
            store.dispatch("subList", {
              commitKey: "setMarketAiHisList",
              listKey: "marketAiHisList",
            });
          }, 500);
          break;
        case "ratereturn24h":
          store.commit("setMarketAi24List", list);
          setTimeout(() => {
            store.dispatch("subList", {
              commitKey: "setMarketAi24List",
              listKey: "marketAi24List",
            });
          }, 500);
          break;
        case "maxgrid":
          store.commit("setMarketAiGridList", list);
          setTimeout(() => {
            store.dispatch("subList", {
              commitKey: "setMarketAiGridList",
              listKey: "marketAiGridList",
            });
          }, 500);
          break;
        default:
          store.commit("setMarketAiList", list);
          setTimeout(() => {
            store.dispatch("subList", {
              commitKey: "setMarketAiList",
              listKey: "marketAiList",
            });
          }, 500);
          break;
      }
    })
    .finally(() => {
      loading.value = false;
    });
};
getList();


</script>

<style lang="less" scoped>
.page_ai {
  .list {
    padding: 0 0 0.2rem 0;
  }
}
</style>
