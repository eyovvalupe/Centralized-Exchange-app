<template>
    <div class="category-button-group">
        <button v-for="category in categories" :key="category.key"
            :class="{ active: selectedCategory === category.key }" @click="selectCategory(category)">
            {{ category.label }}
        </button>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import store from "@/store";

const categories = ref([
    { key: 'all', label: '全部' },
    { key: 'stock', label: '股票' },
    { key: 'crypto', label: '合约' },
    { key: 'forex', label: '外汇' },
])
const marketType = computed(
  () => store.getters.getMarketType
)
const selectedCategory = ref(marketType.value)
const selectCategory = category => {
    selectedCategory.value = category.key
    store.commit("setMarketType", selectedCategory.value || "all");
}
</script>

<style scoped>
.category-button-group {
    display: flex;
    gap: 0.109rem;
    padding: 0 0.289rem;
    margin-bottom: 0.2rem;
}

button {
    border: 1px solid #D0D8E2;
    padding: 0.145rem 0.261rem;
    border-radius: 1.178rem;
    background-color: transparent;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #d0d0d0;
}

button.active {
    background-color: #014CFA;
    color: white;
}
</style>