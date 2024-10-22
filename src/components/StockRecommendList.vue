<!-- 自选推荐 -->
<template>
  <div class="recommend_list">
    <Loading v-show="!props.list.length && props.loading" />
    <div class="list_box">
      <div
        class="list_item"
        @click="() => {}"
        v-for="(item, i) in props.list"
        :key="i"
      >
        <div class="symbol">{{ item.symbol }}</div>
        <div class="name">{{ item.name || "--" }}</div>
        <div class="price">{{ item.price ? item.price.toFixed(2) : "--" }}</div>
        <div
          class="percent"
          :class="[updown(item) === 0 ? '' : updown(item) > 0 ? 'up' : 'down']"
        >
          {{
            ((item.ratio || 0) * 100).toFixed(2) > 0
              ? "+" + ((item.ratio || 0) * 100).toFixed(2)
              : ((item.ratio || 0) * 100).toFixed(2)
          }}%
        </div>

        <div class="sparkLine">
          <SparkLine
            v-if="item.points"
            style="width: 100%; height: 0.45rem"
            :points="item.points"
            :ratio="item.ratio"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import SparkLine from "@/components/SparkLine.vue";
import Loading from "@/components/Loaidng.vue";
import { ref, computed } from "vue";
import { Button, showToast } from "vant";
import store from "@/store";
import router from "@/router";

const emits = defineEmits(["init", "change"]);
// const token = computed(() => store.state.token || "");

const props = defineProps({
  keyStr: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: true,
  },
  list: {
    type: Array,
    default: () => [],
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

const loading = ref(false);
const disabled = computed(
  () => !checkedList.value.some((item) => item == true)
);
</script>

<style lang="less" scoped>
.recommend_list {
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .list_box {
    flex: 1;
    overflow-y: auto;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    flex-wrap: wrap;

    .list_item {
      background-color: #f5f7fc;
      height: 1.998rem;
      width: 3.36rem;
      border-radius: 0.32rem;
      margin-bottom: 0.15rem;
      position: relative;
      padding: 0.15rem;
      overflow: hidden;

      .symbol {
        font-size: 0.32rem;
        line-height: 0.432rem;
        color: #061023;
      }

      .name {
        font-size: 0.24rem;
        color: #8f92a1;
        line-height: 0.312rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0.1rem 0;
      }

      .price {
        color: #061023;
        font-weight: 600;
        font-size: 0.32rem;
        line-height: 0.432rem;
        margin-bottom: 0.08rem;
      }

      .percent {
        font-size: 0.28rem;
        line-height: 0.32rem;
        font-weight: 600;
      }

      .sparkLine {
        position: absolute;
        width: 1.6rem;
        height: 0.5rem;
        right: -0.15rem;
        bottom: 0.25rem;
      }
    }
  }
}
</style>
