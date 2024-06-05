<!-- 自选 -->
<template>
    <div class="market_optional">
        <div class="tr th">
            <div class="td td5">名称</div>
            <div class="td td2">行情</div>
            <div class="td td2 td_r">涨跌幅</div>
        </div>
        <Loading v-show="!watchList.length && loading" />
        <div class="tr" v-for="(item, i) in watchList" :key="i">
            <StockItem :item="item" />
        </div>
    </div>
</template>

<script setup>
// import router from "@/router"
import store from "@/store";
import { defineExpose, computed, ref } from "vue"
import StockItem from "@/components/StockItem.vue"
import { _watchlist } from "@/api/api"
import Loading from "@/components/Loaidng.vue"
import { useSocket } from '@/utils/ws'

const loading = ref(false)
const { startSocket } = useSocket()
let socket = null
const subs = () => {
    socket = startSocket(() => {
        const keys = watchList.value.map(item => item.symbol)

        socket && socket.emit('realtime', keys.join(',')) // 价格变化
        socket && socket.on('realtime', res => {
            if (res.code == 200) {
                const arr = watchList.value.map(item => { // 数据和观察列表里的数据融合
                    const target = res.data.find(a => a.symbols == item.symbol)
                    if (target) {
                        Object.assign(item, target)
                    }
                    return item
                })
                store.commit('setMarketWatchList', arr || [])
            }
        })

        socket && socket.emit('snapshot', keys.join(',')) // 快照数据
        socket && socket.on('snapshot', res => {
            if (res.code == 200) {
                const target = watchList.value.find(item => item.symbols == res.symbols)
                if (target) {
                    target.points = getSnapshotLine(res.data)
                }
            }
        })
    })
}

function getSnapshotLine(data) {
    let str = ''
    const w = 69
    const h = 25
    let min = null
    let max = null
    data.map((item, index) => {
        if (min === null) {
            min = item.price
        }
        if (max === null) {
            max = item.price
        }
        if (item.price < min) {
            min = item.price
        }
        if (item.price > max) {
            max = item.price
        }
        str += `${index},${item.price} `
    })
    let _str = '' // 最终字符串
    const gap = max - min || min // 最大与最小值的间隙
    str.split(' ').map(item => {
        const _item = item.split(',')
        if (item.length) {
            _str += `${((_item[0] / 1) * (w / data.length)).toFixed(2)},${((_item[1] / 1 - min) * (h / gap)).toFixed(2)} `
        }
    })
    return _str.substring(0, _str.length - 1)
}



const watchList = computed(() => store.state.marketWatchList || [])
const getWatchList = () => { // 获取订阅列表
    if (loading.value) return
    loading.value = true
    if (watchList.value.length) {
        subs()
    }
    _watchlist().then(res => {
        if (res.code == 200) {
            if (watchList.value.length) { // 有历史数据就更新
                const rs = res.data.map(item => {
                    const target = watchList.value.find(a => a.symbol == item.symbol)
                    if (target) {
                        Object.assign(target, item)
                        item = target
                    }
                    return item
                })
                store.commit('setMarketWatchList', rs || [])
            } else { // 没有就直接提交
                store.commit('setMarketWatchList', res.data || [])
            }



            setTimeout(() => {
                subs()
            }, 0)
        }
    }).finally(() => {
        loading.value = false
    })
}

const init = () => {
    getWatchList()
}

defineExpose({
    init
})
</script>

<style lang="less" scoped>
.market_optional {
    padding: 0;

    .tr {
        display: flex;
        align-items: center;

        .td {
            flex: 1;
        }

        .td5 {
            flex: 5;
        }

        .td2 {
            flex: 2;
        }
    }

    .th {
        padding: 0 0.3rem 0.16rem 0.3rem;
        height: 0.64rem;
        color: #9EA3AE;
        font-size: 0.28rem;
        font-weight: 400;
        border-bottom: 1px solid #E8E8E8;

        .td_r {
            text-align: right;
        }
    }
}
</style>