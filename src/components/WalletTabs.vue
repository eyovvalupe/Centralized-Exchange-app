<template>
    <div class="tabs-container">
      <div class="tabs-wrapper">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab"
          :class="{'active': selectedTab.value === index}"
          @click.stop="selectTab(index)"
        >
          {{ tab }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    name: 'Tabs',
    setup() {
      // Define the tabs as a reactive reference
      const tabs = ref(['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5', 'Tab 6']);
      const selectedTab = ref(0); // Initialize the selected tab as the first tab
  
      // Method to handle tab selection
      const selectTab = (index) => {
        selectedTab.value = index;
      };
  
      // Return the state and methods to the template
      return {
        tabs,
        selectedTab,
        selectTab,
      };
    },
  };
  </script>
  
  <style scoped>
  .tabs-container {
    width: 100%;
    overflow-x: auto; /* Horizontal scroll */
  }
  
  .tabs-wrapper {
    display: flex;
    gap: 15px;
  }
  
  .tab {
    padding: 10px 20px;
    border-radius: 20px; /* Rounded rectangular */
    cursor: pointer;
    transition: background-color 0.3s ease;
    white-space: nowrap;
    border: 2px solid transparent;
  }
  
  .tab:hover {
    background-color: var(--ex-bg-color2); /* Light hover effect */
  }
  
  .tab.active {
    background-color: var(--ex-primary-color); /* Blue background for active tab */
    color: var(--ex-bg-primary-text-color);
    border-color: var(--ex-primary-color);
  }
  </style>
  