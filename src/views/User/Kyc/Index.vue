<!-- 用户认证 -->
<template>
    <div class="page page_kyc" style="height:100%">
        <Kyc1 v-if="userInfo.kyc == 0 || userInfo.kyc == 1" />
        <Kyc2 v-if="userInfo.kyc == 2" />
    </div>
</template>

<script setup>
import { defineAsyncComponent, computed, onBeforeUnmount } from "vue"
import store from "@/store";

const userInfo = computed(() => store.state.userInfo || {})


const Kyc1 = defineAsyncComponent(() =>
    import("./Kyc1.vue")
);
const Kyc2 = defineAsyncComponent(() =>
    import("./Kyc2.vue")
);

onBeforeUnmount(() => {
    store.dispatch('updateUserInfo')
})
</script>
