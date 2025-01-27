<!-- 跟单广场 -->
<template>
    <div class="page-follow pb-[0.32rem] px-[0.32rem]" :class="from != 'finance' ? 'pt-[1.28rem]' : ''">
        <Top :title="$t('copy.copy_ground')" v-if="from != 'finance'"></Top>

        <!-- Tab -->
        <!-- <div class="tabs">
            <div class="tab" :class="{ 'active_tab': active == 1 }" @click="changeTab(1)">{{ $t('copy.copy_portfolio')
                }}</div>
            <div class="tab" :class="{ 'active_tab': active == 2 }" @click="changeTab(2)">{{ $t('copy.copy_tab_tab2') }}
            </div>
        </div> -->

        <Tabs type="custom-card" @change="onChange" v-model="activeTab"
            style="height: calc(var(--vh) * 100 - 0.88rem); overflow-y: auto;" :swipeable="false" animated>
            <Tab :title="$t('copy.copy_portfolio')" :active="activeTab == 0" :name="'0'">
                <div class="px-[0.1rem] pt-[0.32rem] pb-[1.6rem]">
                    <NoData v-if="!loading && !followList.length" />
                    <div class="list-i" v-for="(item, i) in followList" :key="i">
                        <FollowItem :item="item" :showDetail="true" />
                    </div>
                </div>
            </Tab>
            <Tab class="mb-[1.2rem]" :title="$t('copy.copy_tab_tab2')" :active="activeTab == 1" :name="'1'">
                <div class="px-[0.1rem] pt-[0.32rem] pb-[1.6rem]">
                    <div class="my-total" v-if="!isEmpty(myCopyData)">
                        <div class="info-flex">
                            <div class="info-item">
                                <div class="name">{{ $t('copy.copy_order_total_profit') }}</div>
                                <div class="val">{{ myCopyData.returnamount }}</div>
                            </div>
                            <div class="info-item" style="text-align: right;">
                                <div class="name">{{ $t('copy.copy_order_total_amount') }}</div>
                                <div class="val" @click="plus">
                                    <span>{{ myCopyData.amount }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-[0.12rem] mb-[0.32rem]">
                        <div class="w-max px-[0.4rem] h-[0.78rem] rounded-[1rem] text-[0.3rem] font-semibold flex items-center justify-center"
                            :class="typeChange == 'option' ? 'bg-white text-black ripple-primary' : 'text-color2 ripple-btn'"
                            @click="typeChange = 'option'"
                            :style="typeChange == 'option' ? '' : 'background-color: var(--ex-bg-white2)'">{{
                                $t('common.option') }}</div>
                        <div class="w-max px-[0.4rem] h-[0.78rem] rounded-[1rem] text-[0.3rem] font-semibold flex items-center justify-center"
                            :class="typeChange == 'future' ? 'bg-white text-black ripple-primary' : 'text-color2 ripple-btn'"
                            @click="typeChange = 'future'"
                            :style="typeChange == 'future' ? '' : 'background-color: var(--ex-bg-white2)'">{{
                                $t('common.crypto') }}</div>
                    </div>
                    <div class="list-i" v-if="myFollowList.length" v-for="(item, i) in myFollowList" :key="i">
                        <MyFollowItem @openInfo="openInfo" :item="item" :showDetail="false" />
                    </div>
                    <NoData v-if="!myFollowList.length" />
                </div>
            </Tab>
        </Tabs>
        <!-- 列表 -->
        <!-- <div class="list" ref="listDom">
            <template v-if="active == 1">
                <NoData v-if="!loading && !followList.length" />
                <div class="list-i" v-for="(item, i) in followList" :key="i">
                    <FollowItem :item="item" :showDetail="true" />
                </div>
            </template>
<template v-if="active == 2">
                <div class="my-total" v-if="!isEmpty(myCopyData)">
                    <div class="info-flex">
                        <div class="info-item">
                            <div class="name">{{ $t('copy.copy_order_total_profit') }}</div>
                            <div class="val">{{ myCopyData.returnamount }}</div>
                        </div>
                        <div class="info-item" style="text-align: right;">
                            <div class="name">{{ $t('copy.copy_order_total_amount') }}</div>
                            <div class="val" @click="plus">
                                <span>{{ myCopyData.amount }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex gap-[0.12rem] mb-[0.32rem]">
                    <div class="w-max px-[0.4rem] h-[0.78rem] rounded-[1rem] text-[0.3rem] font-semibold flex items-center justify-center"
                        :class="typeChange == 'option' ? 'bg-white text-black ripple-primary' : 'text-color2 ripple-btn'"
                        @click="typeChange = 'option'"
                        :style="typeChange == 'option' ? '' : 'background-color: var(--ex-bg-white2)'">{{
                            $t('common.option') }}</div>
                    <div class="w-max px-[0.4rem] h-[0.78rem] rounded-[1rem] text-[0.3rem] font-semibold flex items-center justify-center"
                        :class="typeChange == 'future' ? 'bg-white text-black ripple-primary' : 'text-color2 ripple-btn'"
                        @click="typeChange = 'future'"
                        :style="typeChange == 'future' ? '' : 'background-color: var(--ex-bg-white2)'">{{
                            $t('common.crypto') }}</div>
                </div>
                <div class="list-i" v-if="myFollowList.length" v-for="(item, i) in myFollowList" :key="i">
                    <MyFollowItem @openInfo="openInfo" :item="item" :showDetail="false" />
                </div>
                <NoData v-if="!myFollowList.length" />
            </template>
</div> -->
    </div>

    <!-- 详情 -->
    <Popup teleport="body" v-model:show="showInfo" position="right" :style="{ height: '100%', width: '100%' }">
        <FollowInfo v-if="showInfo" @back="showInfo = false" style="width: 100%;height: 100%;" />
    </Popup>
</template>

<script setup>
import Top from "@/components/Top.vue";
import NoData from '@/components/NoData.vue';
import LoadingMore from "@/components/LoadingMore.vue"
import FollowItem from "../components/FollowItem.vue"
import MyFollowItem from "../components/MyFollowItem.vue"
import { _copyMyList, _copyList } from '@/api/api'
import { ref, computed, onMounted, onUnmounted } from "vue"
import store from "@/store";
import { Popup, Tabs, Tab } from "vant"
import FollowInfo from "../Follow/FollowInfo.vue"
import { isEmpty } from "@/utils/isEmpty";

const props = defineProps({
    from: {
        type: String,
        default: ''
    }
})
const listDom = ref()
const active = ref(1) // 1-跟单  2-订单
const changeTab = val => {
    active.value = val
    setTimeout(() => {
        if (listDom.value) {
            listDom.value.scrollTop = 0
        }
    }, 100)
}
const typeChange = ref('option')
const activeTab = ref(1)

const onChange = (val) => {
    activeTab.value = val
}
const token = computed(() => store.state.token)
// 我的跟单统计
const followList = computed(() => store.state.followList)
const myFollowList = computed(() => store.state.myCopy)
console.log('my followlist', myFollowList.value)
const myCopyData = computed(() => store.state.myCopyData)
console.log('my copy data ======> ', myCopyData.value)

const loading = ref(false)

let moreDom = null
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
const scrolHandle = () => {
    const rect = moreDom.getBoundingClientRect()
    if (rect.top <= totalHeight) {
        // 加载更多
        console.error('加载更多')
        if (active.value == 1) {
            // getData()
        }
    }
}

onMounted(() => {
    store.dispatch('updateFollowList')
    if (token.value) {
        store.dispatch('updateMyFollowList')
    }
    setTimeout(() => {
        try {
            moreDom = document.querySelector('.loading_more')
            document.querySelector('.list').addEventListener('scroll', scrolHandle)
        } catch {
        }
    }, 500)
})
onUnmounted(() => {
    try {
        document.querySelector('.list').removeEventListener('scroll', scrolHandle)
    } catch { }
})

// 跟单详情
const showInfo = ref(false)
const openInfo = item => {
    showInfo.value = true
}
</script>

<style lang="less" scoped>
.page-follow {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .tabs {
        height: 0.96rem;
        border-radius: 0.32rem;
        display: flex;
        padding: 0.08rem;
        background-color: var(--ex-bg-color3);

        .tab {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.32rem;
            color: var(--ex-text-color7);
            font-size: 0.32rem;
            transition: all ease-in .1s;
        }

        .active_tab {
            background-color: var(--ex-primary-color);
            color: var(--ex-white);
        }
    }


    // .list {
    //     flex: 1;
    //     margin-top: 0.32rem;
    //     overflow-y: auto;

        .list-i {
            margin-bottom: 0.32rem;
        }

        .my-total {
            border-radius: 0.32rem;
            background: var(--ex-bg-color3);
            padding: 0.12rem;
            margin-bottom: 0.32rem;

            .info-flex {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin: 0.16rem 0;

                .info-item {
                    text-align: left;
                    padding: 0 0.16rem;

                    .name {
                        color: var(--ex-placeholder-color);
                        font-size: 0.28rem;
                        margin-bottom: 0.24rem;
                    }

                    .val {
                        color: var(--ex-white);
                        font-weight: bold;
                        font-size: 0.36rem;
                    }
                }
            }

            .info-box {
                width: 100%;
                border-radius: 0.32rem;
                background-color: var(--ex-bg-white2);
                padding: 0.28rem;

                .info-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 0.52rem;

                    .name {
                        color: var(--ex-placeholder-color);
                    }

                    .val {
                        display: flex;
                        align-items: center;

                        .plus {
                            width: 0.4rem;
                            height: 0.4rem;
                            margin-left: 0.12rem;
                        }
                    }
                }
            }
        }
    // }
}
</style>