<!-- ai -->
<template>
    <div class="ai-block">
        <Tabs v-if="!pageLoading" type="custom-card" v-model:active="active" :swipeable="false" animated :color="'#014CFA'"
            shrink @change="onChange">
            <Tab title="开仓" name="0">
                <div class="ai-block-content">
                    <Ai @clickItems="clickItem"></Ai>
                </div>
            </Tab>
            <!-- <Tab title="持仓" name="1">
                <div class="ai-block-content">
                    
                </div>
            </Tab> -->
            <Tab title="订单" name="2">
                <div class="ai-block-content">
                    <div v-if="token" class="ai-block-title">当前持仓</div>
                    <Positions />
                    <div v-if="token" class="ai-block-title" style="margin-top: 0.32rem;">历史订单</div>
                    <Inquire ref="InquireRef" />
                </div>
            </Tab>
        </Tabs>
        <div style="height:50vh" v-else></div>

        <!-- 下单弹窗 -->
        <Popup teleport="body" v-model:show="showModel" position="bottom" round closeable>
            <div style="padding-top: 0.5rem;height: var(--app-height);overflow-y: auto;">
                <Opening @showNavDialog="showNavDialog" ref="OpeningRef" />
            </div>
        </Popup>
    </div>
</template>

<script setup>
import { Tab, Tabs, Popup } from "vant";
import { ref, onMounted, computed } from "vue"
import Opening from "../ai/Opening.vue"
import Ai from "../../Market/components/Ai.vue"
import Positions from "../ai/Positions.vue"
import Inquire from "../ai/Inquire.vue"
import store from "@/store";
import router from "@/router";

const token = computed(() => store.state.token || '')

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

const active = ref(sessionStorage.getItem('trade_ai_tab') || 0)
const InquireRef = ref()
const onChange = async (val) => {
    active.value = val;
    sessionStorage.setItem('trade_ai_tab', val)

    if (val == 2) {
        InquireRef.value && InquireRef.value.init()
    }
};

const pageLoading = ref(true)
onMounted(() => {
    setTimeout(() => {
        pageLoading.value = false
    }, 300)
})
</script>

<style lang="less" scoped>
.ai-block {
    padding: 0.24rem 0.32rem 0.32rem;
    .ai-block-content {
        padding: 0.4rem 0 1.22rem 0;

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
                background-color: #3B82F6;
                position: absolute;
                bottom: 16px;
                left: 0;
                opacity: 0.3;
            }
        }
    }
}
</style>