<!-- 加载更多 -->
<template>
  <div>
    <Loaidng :loading="props.loading" :size="32" />
    <div class="loading_more" :class="classN">
      <span v-if="props.finish">{{ t('common.no_more') }}</span>
    </div>
  </div>
</template>

<script setup>
import Loaidng from "./Loaidng.vue"
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
  line-height: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  font-size: 0.24rem;
  color: var(--ex-text-color3);
}
</style>
