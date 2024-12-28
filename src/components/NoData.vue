<!-- 空数据 -->
<template>
  <div class="no_data">
    <div class="nodata_icon">
      <img :src="getStaticImgUrl('/static/img/common/no_data.svg')" alt="nothing" />
    </div>
    <div class="nodata_text">{{ props.tip ? props.tip : t('common.no_data') }}</div>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  tip: {
    type: String,
    default: '',
  },
});
</script>

<style scoped lang="less">
.no_data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  line-height: 0.4rem;
  font-size: 0.28rem;
  color: #a4acb9;
  padding: 1rem 0;

  .nodata_icon {
    width: 2.28rem;
    height: auto;

    img {
      width: 100%;
    }
  }

  .nodata_text {
    font-size: 0.28rem;
    margin-top: 0.46rem;
  }
}
</style>
