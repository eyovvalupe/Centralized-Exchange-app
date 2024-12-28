<!-- ai -->
<template>
    <div class="ai-block">

        <Ai @clickItems="clickItem" :show-tabs="false" v-if="!pageLoading"></Ai>
        
        <div style="height:50vh" v-else></div>

        <!-- 下单弹窗 -->
        <Popup teleport="body" v-model:show="showModel" position="right" style="width:100%;height:100%;">
            <Opening @showNavDialog="showNavDialog" ref="OpeningRef" @back="showModel = false" />
        </Popup>
    </div>
</template>

<script setup>
import {  Popup } from "vant";
import { ref, onMounted, computed, defineExpose } from "vue"
import Opening from "../ai/Opening.vue"
import Ai from "../../Market/components/Ai.vue"
import store from "@/store";

const token = computed(() => store.state.token || '')
const activeType = ref(1)
const OpeningRef = ref()
const showModel = ref(false)
const clickItem = item => {
    if (!token.value) {
        return store.commit('setIsLoginOpen', true)
        // return router.push({
        //     name: 'login',
        //     query: {
        //         reurl: "trade"
        //     }
        // })
    }
    showModel.value = true
    setTimeout(() => {
        OpeningRef.value.init()
    }, 100)
}

const emits = defineEmits(['showNavDialog'])
const showNavDialog = () => {
    emits('showNavDialog', 'ai')
}



const pageLoading = ref(true)
const handleMounted = () => {
    setTimeout(() => {
        pageLoading.value = false
    }, 300)
}
onMounted(() => {
    handleMounted()
})

defineExpose({
    handleMounted
})
</script>

<style lang="less" scoped>
.ai-block {
    padding: 0.24rem 0.32rem 0.32rem;

    .ai-block-content {
        padding: 0.4rem 0 0 0;

        .ai-block-title {
            padding: 0 0.32rem;
            font-weight: 600;
        }
    }

    .tabs {
        :deep(.van-tabs__nav) {
            padding-left: 0.32rem;
        }

        :deep(.van-tabs__nav) {
            position: relative;

            &::after {
                content: '';
                width: 100%;
                height: 1px;
                background-color: var(--ex-primary-color);
                position: absolute;
                bottom: 16px;
                left: 0;
                opacity: 0.3;
            }
        }
    }
}

.type_tabs {
    width: 3.5rem;
    height: 0.68rem;
    display: flex;
    align-items: center;
    z-index: 99;
    margin-top: 0.32rem;
    border: 1px solid var(--ex-border-color2);
    border-radius: 0.6rem;

    .type_tab {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--ex-text-color2);
        font-size: 0.3rem;
    }

    .type_tab_text {
        position: relative;
        z-index: 1;
    }

    .active_type_tab {
        color: var(--ex-white);
        position: relative;

        &::after {
            content: '';
            width: calc(100% + 1px);
            height: calc(100% + 1px);
            background-color: var(--ex-primary-color);
            position: absolute;
            left: 0;
            top: -1px;
            border-radius: 0.6rem;
        }
    }

    .type_tab:first-child.active_type_tab {
        left: -1px;
    }

    .type_tab:last-child.active_type_tab {
        right: -1px;
    }
}
</style>