<!-- 股票 -->
<template>
    <div class="market_stock">

        <!-- 首页推荐数据 -->
        <!-- <Recommend @ready="readyRecommendData" class="home_recommend" /> -->

        <!-- 市场涨跌分布 -->
        <div class="total_box">
            <!-- 类型 -->
            <div class="type_box" @click="showAS = true">
                <span>全部</span>
                <div class="type_icon">
                    <img src="/static/img/assets/more.png" alt="img">
                </div>
            </div>

            <div class="total_title">
                <span>市场涨跌分布</span>
                <span v-if="!overviewLoading || count" style="color: #121826;margin-left: 0.1rem">总计 {{ count }}</span>
            </div>
            <Loading v-if="overviewLoading && !count" :loading="overviewLoading" :type="'spinner'" />
            <div class="table_box" v-if="!overviewLoading || count">
                <div class="table_list">
                    <div class="table_item" v-for="(key, i) in keySoft" :key="key">
                        <div class="table_item_num" :class="[i == 5 ? '' : (i < 5 ? 'item_red' : 'item_green')]">{{
                            overview[key] }}</div>
                        <div class="table_item_bar"
                            :style="{ height: getHeight(key) + 'rem', backgroundColor: bgColors[i] }"></div>
                        <div class="table_item_name" :class="{ 'item_red': i == 0, 'item_green': i == 10 }">{{
                            overviewTitleMap[key] }}</div>
                    </div>
                </div>
                <div class="table_tabs">
                    <div class="table_tab start_tab" :style="{ flex: getFlex(1) }">
                        <div class="left_radius"></div>
                    </div>
                    <div class="table_tab mid_tab" :style="{ flex: getFlex(0) }"></div>
                    <div class="table_tab end_tab" :style="{ flex: getFlex(-1) }">
                        <div class="right_radius"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <Tabs class="tabs" @change="changeTab" v-model:active="active" :swipeable="false" animated :color="'#014CFA'"
            shrink>
            <Tab :title="'活跃'">
                <StockTable :key="'vol'" :loading="loading" :list="marketVolumeList" />
                <LoadingMore ref="more_1" class="active_more" :loading="!!(marketVolumeList.length && loading)"
                    :finish="finish" v-if="((finish && marketVolumeList.length) || (!finish)) && active == 0" />
            </Tab>
            <Tab :title="'涨幅'">
                <StockTable :key="'up'" :loading="loading" :list="marketUpList" />
                <LoadingMore ref="more_2" class="active_more" :loading="!!(marketUpList.length && loading)"
                    :finish="finish" v-if="((finish && marketUpList.length) || (!finish)) && active == 1" />
            </Tab>
            <Tab :title="'跌幅'">
                <StockTable :key="'down'" :loading="loading" :list="marketDownList" />
                <LoadingMore ref="more_3" class="active_more" :loading="!!(marketDownList.length && loading)"
                    :finish="finish" v-if="((finish && marketDownList.length) || (!finish)) && active == 2" />
            </Tab>
        </Tabs>


        <!-- 类型选择弹窗 -->
        <Teleport to="body">
            <ActionSheet v-model:show="showAS" :actions="actions" @select="onSelect" title="类型"></ActionSheet>
        </Teleport>
    </div>
</template>

<script setup>
import { Tab, Tabs, ActionSheet } from 'vant';
import StockTable from "@/components/StockTable.vue"
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import { _sort, _marketOverview } from "@/api/api"
import store from "@/store"
import { _add, _del } from '@/api/api'
import Recommend from '@/views/Home/components/Recommend.vue';
import Loading from '@/components/Loaidng.vue';
import LoadingMore from "@/components/LoadingMore.vue"

const loading = ref(false)
const finish = ref(false)
const page = ref(0)

const showAS = ref(false)
const currAs = ref('1')
const actions = computed(() => {
    return [
        { name: '全部', value: '1', className: currAs.value == 1 ? 'action-sheet-active' : '', icon: currAs.value == 1 ? 'success' : '' },
        { name: '美股', value: '2', className: currAs.value == 2 ? 'action-sheet-active' : '', icon: currAs.value == 2 ? 'success' : '' },
        { name: '选项三', value: '3', className: currAs.value == 3 ? 'action-sheet-active' : '', icon: currAs.value == 3 ? 'success' : '' },
    ]
})
const onSelect = item => {
    showAS.value = false
    currAs.value = item.value
}

// tabs
const active = ref(-1)
const changeTab = (key) => {
    page.value = 0
    loading.value = false
    finish.value = false
    setTimeout(() => { // 加载更多元素
        switch (key) {
            case 0:
                getData(marketVolumeList, 'setMarketVolumeList', 'volume', 'marketVolumeList')
                break
            case 1:
                getData(marketUpList, 'setMarketUpList', 'up', 'marketUpList')
                break
            case 2:
                getData(marketDownList, 'setMarketDownList', 'down', 'marketDownList')
                break
        }
        target = document.querySelector('.loading_more')
    }, 500)
}
const readyRecommendData = () => { // 推荐数据准备好了，一起监听
    changeTab(active.value)
}

// 获取列表数据
const marketVolumeList = computed(() => store.state.marketVolumeList || []) // 活跃列表
const marketUpList = computed(() => store.state.marketUpList || []) // 涨幅列表
const marketDownList = computed(() => store.state.marketDownList || []) // 跌幅列表
const subs = (listKey, key) => { // 订阅ws
    store.dispatch('subList', {
        commitKey: key,
        listKey: listKey,
        // proxyListValue: list.value
    })
}
const getData = (list, key, query, listKey) => {
    if (loading.value || finish.value) return
    loading.value = true
    page.value++
    let arr = JSON.parse(JSON.stringify(list.value))
    if (page.value == 1) {
        arr = []
    }
    if (arr.length) {
        subs(listKey, key)
    }
    const saveActive = active.value
    _sort({
        orderby: query,
        page: page.value
    }).then(res => {
        if (res.code == 200) {
            if (saveActive != active.value) return
            if (!res.data.length) {
                finish.value = true
            }
            res.data = res.data.map(item => {
                item.ratio = undefined // 弃用接口里的该字段
                return item
            })
            const rs = res.data.map(item => {
                const target = list.value.find(a => a.symbol == item.symbol)
                if (target) {
                    item = {
                        ...target,
                        ...item,
                        ratio: target.ratio
                    }
                }
                return item
            })
            arr.push(...rs)
            store.commit(key, arr || [])

            setTimeout(() => {
                subs(listKey, key)
                scrollHandler()
            }, 500)
        }
    }).finally(() => {
        setTimeout(() => {
            loading.value = false
        }, 300)
    })
}


// 获取总览数据
const count = ref(0)
const keySoft = ref([5, 4, 3, 2, 1, 0, '-1', '-2', '-3', '-4', '-5'])
const bgColors = ref(['#F4AEAD', '#F4AEAD', '#F08685', '#EF4444', '#E8503A', '#87878C', '#18B762', '#4ABA63', '#77CC8A', '#A4DDB0', '#D2EED7'])
const overview = ref({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
    0: 0,
    '-1': 0,
    '-2': 0,
    '-3': 0,
    '-4': 0,
    '-5': 0
})
try {
    const d = JSON.parse(sessionStorage.getItem('overview_data') || '{}')
    count.value = d.count || 0
    for (let key in overview.value) {
        overview.value[key] = d[key] || 0
    }
} catch { }
const overviewTitleMap = ref({
    5: '涨停',
    4: '>7%',
    3: '7~5％',
    2: '5~2％',
    1: '2~0％',
    0: '平',
    '-1': '0~2％',
    '-2': '2~5％',
    '-3': '5~7％',
    '-4': '7％<',
    '-5': '跌停'
})
// 获取柱状图高度
const getHeight = key => {
    let max = 0
    for (let k in overview.value) {
        if (overview.value[k] > max) max = overview.value[k]
    }
    return overview.value[key] * 3 / max // 最高的3rem
}
// 获取下方统计宽度
const getFlex = position => {
    if (position > 0) {
        return (overview.value[5] + overview.value[4] + overview.value[3] + overview.value[2] + overview.value[1]) || 1
    } else if (position == 0) {
        return overview.value[0] || 1
    } else {
        return (overview.value['-1'] + overview.value['-2'] + overview.value['-3'] + overview.value['-4'] + overview.value['-5']) || 1
    }
}
const overviewLoading = ref(false)
const getOverviewData = () => {
    overviewLoading.value = true
    _marketOverview().then(res => {
        if (!res.data) return
        sessionStorage.setItem('overview_data', JSON.stringify(res.data))
        count.value = res.data.count || 0
        for (let key in overview.value) {
            overview.value[key] = res.data[key] || 0
        }
    }).finally(() => {
        overviewLoading.value = false
    })
}

const initData = () => {
    // changeTab(active.value)
    getOverviewData()
}

defineExpose({
    initData
})


// 滚动监听
const more_1 = ref()
const more_2 = ref()
const more_3 = ref()
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
let target = null
const scrollHandler = () => {
    const rect = target.getBoundingClientRect()
    if (rect.top <= totalHeight) {
        // 加载更多
        switch (active.value) {
            case 0:
                getData(marketVolumeList, 'setMarketVolumeList', 'volume', 'marketVolumeList')
                break
            case 1:
                getData(marketUpList, 'setMarketUpList', 'up', 'marketUpList')
                break
            case 2:
                getData(marketDownList, 'setMarketDownList', 'down', 'marketDownList')
                break
        }
    }
}
onMounted(() => {
    setTimeout(() => {
        try {
            document.querySelector('.page').addEventListener('scroll', scrollHandler)
        } catch { }
    }, 500)
})
onBeforeUnmount(() => {
    try {
        document.querySelector('.page').removeEventListener('scroll', scrollHandler)
    } catch { }
})
</script>

<style lang="less" scoped>
.market_stock {
    padding-bottom: 0.6rem;
    height: 100%;
    overflow-y: auto;

    .tabs {
        :deep(.van-tabs__wrap) {
            border-bottom: 1px solid rgba(59, 130, 246, 0.3) !important;
            padding-bottom: 0 !important;
        }
    }

    .total_box {
        margin: 0.32rem;
        position: relative;

        .type_box {
            position: absolute;
            top: -0.03rem;
            right: 0;
            display: flex;
            align-items: center;
            color: #253146;
            font-size: 0.24rem;

            .type_icon {
                width: 0.32rem;
                height: 0.32rem;
                opacity: 0.8;
                margin-left: 0.04rem;
            }
        }

        .total_title {
            color: #9EA3AE;
            font-size: 0.28rem;
            margin-bottom: 0.32rem;
        }

        .table_list {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;

            .table_item {
                width: 7%;
                color: #7E879C;
                font-size: 0.18rem;
                text-align: center;

                .item_red {
                    color: #FC6C6B;
                }

                .item_green {
                    color: #19C09A;
                }

                .table_item_num {
                    font-size: 0.2rem;
                }

                .table_item_bar {
                    min-height: 5px;
                    height: 5px;
                    background-color: #87878C;
                    transition: all ease .3s;
                    border-top-left-radius: 0.08rem;
                    border-top-right-radius: 0.08rem;
                    margin: 0.08rem 0;
                }
            }
        }

        .table_tabs {
            margin-top: 0.08rem;
            height: 0.16rem;
            display: flex;
            align-items: stretch;
            padding: 0 0.12rem;

            .table_tab {
                transform: skew(-30deg);
                position: relative;
            }

            .start_tab {
                background-color: #E8503A;

                .left_radius {
                    background-color: #E8503A;
                    height: 0.16rem;
                    width: 0.5rem;
                    border-top-left-radius: 0.16rem;
                    border-bottom-left-radius: 0.16rem;
                    position: absolute;
                    left: -0.12rem;
                    transform: skew(30deg);
                }
            }

            .end_tab {
                background-color: #18B762;

                .right_radius {
                    background-color: #18B762;
                    height: 0.16rem;
                    width: 0.5rem;
                    border-top-right-radius: 0.16rem;
                    border-bottom-right-radius: 0.16rem;
                    position: absolute;
                    right: -0.12rem;
                    transform: skew(30deg);
                }
            }

            .mid_tab {
                background-color: #D9D9D9;
                margin: 0 0.08rem;
                transform: skew(-30deg);
            }
        }
    }
}
</style>