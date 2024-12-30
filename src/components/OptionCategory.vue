<template>
  <div class="category-button-group">
    <button
      v-for="category in categories"
      :key="category.key"
      :class="{ active: selectedCategory === category.key }"
      @click="selectCategory(category)"
    >
      {{ category.label }}
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import store from "@/store";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const categories = ref([
  { key: "all", label: t('trade.left_all') },
  { key: "stock", label: t('trade.left_stock') },
  { key: "crypto", label: t('trade.left_contract') },
  { key: "forex", label: t('trade.left_forex') },
]);
const marketType = computed(() => store.getters.getMarketType);
const selectedCategory = ref(marketType.value);
const selectCategory = (category) => {
  selectedCategory.value = category.key;
  store.commit("setMarketType", selectedCategory.value || "all");
};
</script>

<style scoped>
.category-button-group {
  display: flex;
  gap: 0.12rem;
  padding: 0 0.289rem;
  margin-bottom: 0.2rem;
}

button {
  border: 1px solid var(--ex-border-color2);
  height: 0.7rem;
  padding: 0.2rem 0.26rem;
  border-radius: 1.178rem;
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.3s;
  color: var(--ex-text-color2);
  box-sizing: border-box;
}

button:hover {
  background-color: var(--ex-border-color2);
}

button.active {
  background-color: var(--ex-primary-color);
  border-color: var(--ex-primary-color);
  color: var(--ex-text-color--bg-primary);
}
</style>
