<!-- AI量化 -->
<template>
    <div class="page_ai">
        <Tabs type="card" sticky class="tab_content tabs" v-if="!pageLoading" @change="changeTab"
            v-model:active="active" :swipeable="false" animated shrink>
            <Tab :title="'默认'">
                <div class="list">
                    <AiItem v-for="i in 10" :key="i" />
                </div>
            </Tab>
            <Tab :title="'历史高收益率'">
                <div class="list">
                    <AiItem v-for="i in 10" :key="i" />
                </div>
            </Tab>
            <Tab :title="'24小时高收益率'">
                <div class="list">
                    <AiItem v-for="i in 10" :key="i" />
                </div>
            </Tab>
            <Tab :title="'高杠杆'">
                <div class="list">
                    <AiItem v-for="i in 10" :key="i" />
                </div>
            </Tab>
        </Tabs>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { Tabs, Tab } from "vant"
import AiItem from "./AiItem.vue"

const AiInfoRef = ref()

const active = ref(0)
const changeTab = (val) => {
    console.error(val)
}

const pageLoading = ref(true)
onMounted(() => {
    setTimeout(() => {
        pageLoading.value = false
    }, 300)
})
</script>

<style lang="less" scoped>
.page_ai {
    .list {
        padding: 0 0.32rem 0.32rem 0.32rem;
    }
}
</style>