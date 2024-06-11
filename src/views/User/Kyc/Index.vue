<!-- 用户认证 -->
<template>
    <div class="page page_kyc">
        <Kyc1 v-if="userInfo.kyc == 0 || userInfo.kyc == 1" />
        <Kyc2 v-if="userInfo.kyc == 2" />
    </div>
</template>

<script setup>
import { defineAsyncComponent, computed } from "vue"
import store from "@/store";

const userInfo = computed(() => store.state.userInfo || {})

const Kyc1 = defineAsyncComponent(() =>
    import("./Kyc1.vue")
);
const Kyc2 = defineAsyncComponent(() =>
    import("./Kyc2.vue")
);
</script>
