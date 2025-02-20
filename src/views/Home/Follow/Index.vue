<!-- 跟单广场 -->
<template>
    <div class="page-follow" :class="from != 'finance' ? 'pt-[1.28rem]' : ''">
        <Top :title="$t('copy.copy_ground')" v-if="from != 'finance'"></Top>

        <!-- Tab -->
        <!-- <div class="tabs">
            <div class="tab" :class="{ 'active_tab': active == 1 }" @click="changeTab(1)">{{ $t('copy.copy_portfolio')
                }}</div>
            <div class="tab" :class="{ 'active_tab': active == 2 }" @click="changeTab(2)">{{ $t('copy.copy_tab_tab2') }}
            </div>
        </div> -->
        <Tabs type="custom-card-stake" @change="onChange" v-model="activeTab" :swipeable="false" animated>
            <Tab :title="$t('copy.copy_portfolio')" :active="activeTab == 0" :name="'0'">
                <div class="pt-[0.32rem] px-[0.32rem] ">
                    <NoData v-if="!loading && !showList.length" />
                    <div class="list-i" v-for="(item, i) in showList" :key="i">
                        <FollowItem :item="item" :showDetail="true" />
                    </div>
                </div>
            </Tab>
            <Tab class="mb-[1.2rem]" :title="$t('copy.copy_tab_tab2')" :active="activeTab == 1" :name="'1'">
                <CopyOrders />
            </Tab>
        </Tabs>
        <LoadingMore :loading="loading" :finish="finish" v-if="(finish && showList.length) || !finish" />
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
import { _copyMyList, _copyList } from '@/api/api'
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import store from "@/store";
import { Popup, Tabs, Tab } from "vant"
import FollowInfo from "../Follow/FollowInfo.vue"
import CopyOrders from '../components/CopyOrders.vue'

const props = defineProps({
    from: {
        type: String,
        default: ''
    }
})
const active = ref(1) // 1-跟单  2-订单
const showInfo = ref(false)

const activeTab = ref(0)

const onChange = (val) => {
    activeTab.value = val
}
const token = computed(() => store.state.token)
// 我的跟单统计
const followList = computed(() => store.state.followList)
const followList2 = ref([])
const showList = computed(() => {
    return [...followList.value, ...followList2.value]
})
const loading = ref(false)
const finish = ref(false)


// 获取从第二页开始的数据
const page = ref(2)
const getMoreData = () => {
    if (activeTab.value == 0) { // 跟单
        if (loading.value || finish.value) return;
        loading.value = true;
        _copyList({
            page: page.value
        })
            .then((res) => {
                page.value++
                res.data = res.data || [];
                followList2.value.concat(res.data)
                if (!res.data.length) {
                    finish.value = true;
                }
            })
            .finally(() => {
                setTimeout(() => {
                    loading.value = false;
                }, 300)
            });
    }
}


let moreDom = null;
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
const scrolHandle = () => {
    const rect = moreDom.getBoundingClientRect();
    if (rect.top <= totalHeight) {
        // 加载更多
        getMoreData();
    }
};
onMounted(() => {
    store.dispatch('updateFollowList')
    if (token.value) {
        store.dispatch('updateMyFollowList')
    }
    setTimeout(() => {
        try {
            moreDom = document.querySelector(".loading_more");
            document
                .querySelector('.page-follow')
                .addEventListener("scroll", scrolHandle);
        } catch { }
    }, 500);
})
onBeforeUnmount(() => {
    try {
        document
            .querySelector('.page-follow')
            .removeEventListener("scroll", scrolHandle);
    } catch { }
})

</script>

<style lang="less" scoped>
.page-follow {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;

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
        margin-bottom: 0.24rem;
    }

    .my-total {
        border-radius: 0.32rem;
        background: var(--ex-bg-color3);
        padding: 0.12rem;
        margin-bottom: 0.2rem;

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