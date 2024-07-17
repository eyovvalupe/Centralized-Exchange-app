<!-- 股票 -->
<template>
    <div class="market_stock">

        <!-- 市场涨跌分布 -->
        <div class="total_box">
            <div class="total_title">
                <span>市场涨跌分布</span>
                <span style="color: #121826;margin-left: 0.1rem">总计 {{ count }}</span>
            </div>
            <!-- <div class="total_subtitle">
                <div class="percent">66</div>
                <span>今天</span>
            </div> -->

            <div class="table_box">
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
            </Tab>
            <Tab :title="'涨幅'">
                <StockTable :key="'up'" :loading="loading" :list="marketUpList" />
            </Tab>
            <Tab :title="'跌幅'">
                <StockTable :key="'down'" :loading="loading" :list="marketDownList" />
            </Tab>
        </Tabs>

    </div>
</template>

<script setup>
import { Tab, Tabs } from 'vant';
import StockTable from "@/components/StockTable.vue"
import { ref, computed } from "vue"
import { _sort, _marketOverview } from "@/api/api"
import store from "@/store"
import { _add, _del } from '@/api/api'

const loading = ref(false)

// tabs
const active = ref(-1)
const changeTab = (key, scrollToTop = true) => {
    if (scrollToTop) {
        try {
            //   document.querySelector('.page').scrollTo({ top: document.querySelector('.home_banner').clientHeight, behavior: 'smooth' });
        } catch {
            console.error('滚动失败')
        }
    }
    switch (key) {
        case 0:
            getData(marketVolumeList, 'setMarketVolumeList', 'volume')
            break
        case 1:
            getData(marketUpList, 'setMarketUpList', 'up')
            break
        case 2:
            getData(marketDownList, 'setMarketDownList', 'down')
            break
    }
}

// 获取列表数据
const marketVolumeList = computed(() => store.state.marketVolumeList || []) // 活跃列表
const marketUpList = computed(() => store.state.marketUpList || []) // 涨幅列表
const marketDownList = computed(() => store.state.marketDownList || []) // 跌幅列表
const subs = (list, key) => { // 订阅ws
    store.dispatch('subList', {
        commitKey: key,
        proxyListValue: list.value
    })
}
const getData = (list, key, query) => {
    if (loading.value) return
    loading.value = true
    if (list.value.length) {
        subs(list, key)
    }
    _sort({
        orderby: query
    }).then(res => {
        if (res.code == 200) {
            res.data = res.data.map(item => {
                item.ratio = undefined // 弃用接口里的该字段
                return item
            })
            if (list.value.length) { // 有历史数据就更新
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
                store.commit(key, rs || [])
            } else { // 没有就直接提交
                store.commit(key, res.data || [])
            }

            setTimeout(() => {
                subs(list, key)
            }, 0)
        }
    }).finally(() => {
        loading.value = false
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

const getOverviewData = () => {
    try {
        const d = sessionStorage.setItem('overview_data') || '{}'
        count.value = d.count || 0
        for (let key in overview.value) {
            overview.value[key] = d[key] || 0
        }
    } catch { }
    _marketOverview().then(res => {
        if (!res.data) return
        sessionStorage.setItem('overview_data', JSON.stringify(res.data))
        count.value = res.data.count || 0
        for (let key in overview.value) {
            overview.value[key] = res.data[key] || 0
        }
    })
}

const initData = () => {
    changeTab(active.value)
    getOverviewData()
}

defineExpose({
    initData
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