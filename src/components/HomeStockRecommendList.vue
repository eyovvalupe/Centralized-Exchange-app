<!-- 自选推荐 -->
<template>
  <div class="recommend_list">
    <Loading v-show="props.loading" />
    <div
      class="w-[3.33rem] h-[1.92rem] p-[0.16rem] rounded-[0.32rem] bg-[#F5F7FC] relative"
      v-if="!props.loading"
    >
      <div
        class="font-medium text-[0.28rem] text-[#061023] mb-[0.1rem] flex justify-between items-center"
      >
        NAHARCAP...
        <div
          class="custom-star-icon-small absolute right-0 top-0 mr-[0.1rem] mt-[0.1rem]"
        ></div>
      </div>
      <div class="flex justify-between text-[#18B762] mb-[0.1rem]">
        <div class="text-[0.28rem] font-bold">465.4</div>
        <div class="text-[0.28rem]">+1.7%</div>
      </div>
      <div class="flex">
        <div class="w-1/2"></div>
        <div class="w-1/2 flex items-center justify-center h-[0.82rem]">
          <div
            class="border-[0.02rem] rounded-[0.32rem] border-[#014CFA] text-[#014CFA] text-[0.22rem] w-[0.96rem] h-[0.42rem] items-center justify-center flex"
          >
            去看看
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SparkLine from "@/components/SparkLine.vue";
import Loading from "@/components/Loaidng.vue";
import { ref, computed, onMounted } from "vue";
import { Button, showToast, showLoadingToast, closeToast } from "vant";
import store from "@/store";
import router from "@/router";
import { _add, _del } from "@/api/api";
import eventBus from "@/utils/eventBus";

const emits = defineEmits(["init", "change"]);
const token = computed(() => store.state.token || "");

const props = defineProps({
  keyStr: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: true,
  },
  newState: {
    type: Boolean,
    default: true,
  },
  flag: {
    type: Boolean,
    default: true,
  },
});

const updown = (item) => {
  if (item.ratio === undefined) return 0;
  return item.ratio > 0 ? 1 : -1;
};

const totalList = ref([])
const marketSrockRecommendList = computed(() => store.state.marketSrockRecommendList);
const marketContractRecommendList = computed(() => store.state.marketContractRecommendList);
totalList.value = [...marketSrockRecommendList.value, ...marketContractRecommendList.value]
console.log(totalList.value)

const loading = ref(false);
const disabled = computed(
  () => !checkedList.value.some((item) => item == true)
);

const goInfo = (item) => {
  if (item.type == "stock") {
    store.commit("setCurrStock", item);
    setTimeout(() => {
      router.push({
        name: "market_info",
        query: {
          symbol: item.symbol,
          type: "stock",
        },
      });
    }, 100);
  } else {
    store.commit("setCurrConstract", item);
    setTimeout(() => {
      router.push({
        name: "market_info",
        query: {
          symbol: item.name,
          type: "crypto",
        },
      });
    }, 100);
  }
};

// const collectLoading = ref(false);
// const reqMap = {
//   0: _add,
//   1: _del,
// };

// const collect = (item) => {
//   if (!token.value) {
//     store.commit("setIsLoginOpen", true);
//     eventBus.on("loginSuccess", () => {
//       eventBus.off("loginSuccess");
//     });
//   } else {
//     if (collectLoading.value) return;
//     collectLoading.value = true;
//     if (!reqMap[item.watchlist || 0]) return (collectLoading.value = false);
//     showLoadingToast({
//       duration: 0,
//       loadingType: "spinner",
//     });
//     reqMap[item.watchlist || 0]({
//       symbol: item.symbol,
//     })
//       .then((res) => {
//         if (res.code == 200) {
//           setTimeout(() => {
//             showToast(item.watchlist ? "移除成功" : "添加成功");
//           }, 300);
//           const i = props.list.find((a) => a.symbol == item.symbol);
//           if (i) {
//             i.watchlist = i.watchlist == 1 ? 0 : 1;
//             emits("change", props.list);
//           }
//         }
//       })
//       .finally(() => {
//         closeToast();
//         collectLoading.value = false;
//       });
//   }
// };
</script>

<style lang="less" scoped></style>
