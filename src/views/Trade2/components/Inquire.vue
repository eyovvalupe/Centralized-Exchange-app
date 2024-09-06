<!-- 查询 -->
<template>
    <div class="inquire" v-if="token">
        <div class="tr th">
            <div class="td td-5">股票/状态</div>
            <div class="td td-4">开仓/可售</div>
            <div class="td td-4">现价/成本</div>
            <div class="td td-4">盈亏/盈亏比</div>
        </div>
        <NoData v-if="!loading && !inquireList.length" />

        <SwipeCell ref="items" v-for="(item, i) in inquireList" :key="i" disabled>
            <div class="tr">
                <div class="td td-5">
                    <div class="name">{{ item.symbol }}</div>
                    <div class="lever">
                        <span>{{ item.lever }}X</span>
                        <div class="status" :class="'status-' + item.status">{{ statusMap[item.status] || '--' }}</div>
                    </div>
                </div>
                <div class="td td-4">
                    <div class="state" :class="'state-' + item.offset">{{ offsetMap[item.offset] || '--' }}</div>
                    <div class="amount">{{ item.unsold_volume || '--' }}</div>
                </div>
                <div class="td td-4">
                    <div class="price">{{ item.settled_price || '--' }}</div>
                    <div class="price">{{ item.open_price || '--' }}</div>
                </div>
                <div class="td td-4">
                    <div class="num" :class="!item.profit ? '' : (item.profit > 0 ? 'up' : 'down')">{{ item.profit ||
                        '--' }}</div>
                    <div class="num" :class="!item.ratio ? '' : (item.ratio > 0 ? 'up' : 'down')">{{
                        getRatio(item.ratio) }}</div>
                </div>
            </div>
        </SwipeCell>
        <LoadingMore :loading="loading" :finish="finish" v-if="(finish && inquireList.length) || (!finish)" />
    </div>

    <UnLogin v-else />
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { SwipeCell } from "vant"
import store from "@/store"
import NoData from '@/components/NoData.vue';
import LoadingMore from "@/components/LoadingMore.vue"
import { _stocksList } from "@/api/api"
import UnLogin from "@/components/UnLogin.vue"

const inquireList = computed(() => store.state.inquireList || [])
const token = computed(() => store.state.token)

const statusMap = ref({ // 仓位状态
    'none': '开仓',
    'lock': '锁定',
    'open': '持仓',
    'done': '平仓',
    'fail': '失败',
    'cancel': '已取消'
})
const offsetMap = ref({ // 涨跌状态
    'long': '买涨',
    'short': '买跌'
})
const leverTypeap = ref({ // 仓位
    'cross': '全仓',
    'isolated': '逐仓'
})
const priceTypeMap = ref({ // 价格类型
    'market': '市价',
    'limit': '限价'
})
const stopMap = ref({ // 止损类型
    'price': '价格',
    'amount': '金额',
    'ratio': '百分比'
})
const getRatio = (num) => {
    if (!num) return '--'
    return new Decimal(num).mul(100) + '%'
}


const page = ref(0)
const loading = ref(false)
const finish = ref(false)
const timeMap = ref({
    start_time: null,
    end_time: null
})
const init = (times) => {
    if (token.value) {
        if (times) {
            timeMap.value = times
        }
        page.value = false
        loading.value = false
        finish.value = false
        getList()
    }
}
const getList = () => {
    if (loading.value || finish.value) return
    page.value++
    const params = {
        ...timeMap.value,
        page: page.value
    }
    loading.value = true
    _stocksList(params).then(res => {
        if (page.value == 1) {
            store.commit('setInquireList', res.data || [])
        } else {
            const arr = inquireList.value
            arr.push(...LoadingMore(res.data || []))
            store.commit('setInquireList', arr)
        }
        if (!res.data?.length) {
            finish.value = true
        }
    }).finally(() => {
        loading.value = false
    })
}


let moreDom = null
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
const scrolHandle = () => {
    const rect = moreDom.getBoundingClientRect()
    if (rect.top <= totalHeight) {
        // 加载更多
        getList()
    }
}
onMounted(() => {
    setTimeout(() => {
        try {
            moreDom = document.querySelector('.loading_more')
            document.querySelector('.page').addEventListener('scroll', scrolHandle)
        } catch {
        }
    }, 500)
})
onUnmounted(() => {
    try {
        document.querySelector('.page').removeEventListener('scroll', scrolHandle)
    } catch { }
})

defineExpose({
    init
})
</script>

<style lang="less" scoped>
.inquire {
    padding-bottom: 2rem;

    .tr {
        padding: 0.24rem 0.32rem;
        border-bottom: 1px solid #e8e8e8;
        display: flex;
        align-items: stretch;
    }

    .th {
        color: #9ea3ae;
        font-size: 0.28rem;
        font-weight: 400;
    }

    .td {
        text-align: center;
        flex-shrink: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 0.04rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        line-height: 0.44rem;

        .name {
            font-size: 0.28rem;
            font-weight: 600;
            color: #061023;
            margin-bottom: 0.1rem;
        }

        .lever {
            display: flex;
            align-items: center;
            padding-left: 0.1rem;
            font-size: 0.24rem;
            color: #000;
            font-weight: 400;
        }

        .status {
            color: #F89A29;
            font-weight: 500;
            height: 0.4rem;
            padding: 0 0.16rem;
            border-radius: 0.08rem;
            background-color: rgba(248, 154, 41, 0.08);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 0.1rem;
        }

        .status-open {
            color: #18B762;
            background-color: rgba(24, 183, 98, 0.08);
        }

        .state {
            color: #E8503A;
            font-weight: 500;
            height: 0.44rem;
            padding: 0 0.2rem;
            border-radius: 0.08rem;
            background-color: rgba(232, 80, 58, 0.08);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .state-short {
            color: #18B762;
            background-color: rgba(24, 183, 98, 0.08);
        }

        .amount {
            color: #014CFA;
            font-size: 0.28rem;
            font-weight: 500;
        }

        .price {
            color: #000;
            font-size: 0.28rem;
            font-weight: 500;
        }

        .num {
            color: #6C7B90;
            font-weight: 600;
            font-size: 0.28rem;
            text-align: right;
        }
    }

    .td-5 {
        flex: 5;
        text-align: left;
    }

    .td-4 {
        flex: 4;
    }
}
</style>