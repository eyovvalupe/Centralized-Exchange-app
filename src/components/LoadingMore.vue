<!-- 加载更多 -->
<template>
  <div class="loading_more" :class="classN">
    <Loading v-if="props.loading" type="spinner" size="0.32rem" />
    <span v-if="props.finish">{{ t('common.no_more') }}</span>
  </div>
</template>

<script setup>
import { Loading } from "vant";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  classN: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  finish: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="less" scoped>
.loading_more {
  height: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  font-size: 0.24rem;
  color: var(--ex-text-color3);
}
</style>
