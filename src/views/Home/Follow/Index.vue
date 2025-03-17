<!-- 跟单广场 -->
<template>
    <div class="page-follow" :class="from != 'finance' ? 'pt-[1.28rem]' : ''">
        <Top :title="$t('copy.copy_ground')" v-if="from != 'finance'"></Top>

        <div class="pt-[0.32rem] px-[0.32rem] ">
            <NoData v-if="!loading && !followList.length" />
            <div v-else>
                <div class="list-i" v-for="(item, i) in followList" :key="i">
                    <FollowItem :item="item" :showDetail="true" @follow="onFollow" />
                </div>
            </div>
        </div>
        <div class="py-[0.24rem]">
            <LoadingMore :loading="loading" :finish="finish" v-if="(finish && followList.length) || !finish" />
        </div>
    </div>

    <!-- 详情 -->
    <Popup teleport="body" v-model:show="showInfo" position="right" :style="{ height: '100%', width: '100%' }">
        <FollowInfo v-if="showInfo" @back="showInfo = false" style="width: 100%;height: 100%;" />
    </Popup>

     <!-- 跟单弹窗 -->
     <BottomPopup v-model:show="showPlus" :title="t('copy.title')" position="bottom" round closeable teleport="body">
        <FollowSubmit v-if="showPlus" @success="onSuccess" :item="info" :mode="'follow'" />
    </BottomPopup>
    
</template>

<script setup>
import Top from "@/components/Top.vue";
import NoData from '@/components/NoData.vue';
import LoadingMore from "@/components/LoadingMore.vue"
import FollowItem from "../components/FollowItem.vue"
import BottomPopup from "@/components/BottomPopup.vue";
import FollowSubmit from "../components/FollowSubmit.vue"
import { _copyMyList, _copyList } from '@/api/api'
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue"
import store from "@/store";
import { Popup,  showToast } from "vant"
import FollowInfo from "../Follow/FollowInfo.vue"
import { useI18n } from "vue-i18n";
const { t } = useI18n()
const props = defineProps({
    from: {
        type: String,
        default: ''
    }
})
const active = ref(1) // 1-跟单  2-订单
const showInfo = ref(false)
const info = ref({})
const activeTab = ref(0)

const onChange = (val) => {
    activeTab.value = val
}
const token = computed(() => store.state.token)

// 跟单
const showPlus = ref(false)
const onFollow = (item) => {
    if (!token.value) {
        showToast('请先登录')
        store.commit("setIsLoginOpen", true);
        return;
    }
    info.value = item
    showPlus.value = true
}


const onSuccess = ()=>{
    showPlus.value = false
    showInfo.value = true
}

// 我的跟单统计
const followList = ref([])

const loading = ref(false)
const finish = ref(false)

// 获取从第二页开始的数据
const page = ref(1)
const getMoreData = () => {
    if (loading.value || finish.value) return;
    loading.value = true;
    _copyList({
        page: page.value
    })
    .then((res) => {
        res.data = res.data || [];
        followList.value = page.value == 1 ? res.data : followList.value.concat(res.data)
        page.value++
        
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


let moreDom = null;
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
const scrolHandle = () => {
    const rect = moreDom.getBoundingClientRect();
    console.log(666)
    if (rect.top <= totalHeight) {
        // 加载更多
        getMoreData();
    }
};
const init = ()=>{
    page.value = 1
    getMoreData()
    if (token.value) {
        store.dispatch('updateMyFollowList')
    }
}
watch(()=>store.state.token,(v)=>{
    if(v){
        init()
    }
})
onMounted(() => {
    init()
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