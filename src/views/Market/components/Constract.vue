<!-- 合约 -->
<template>
    <div class="page page-constract">
        <!-- <div class="tr th">
            <div class="td td_left">名称/交易量</div>
            <div class="td">价格</div>
            <div class="td td_right">24小时涨跌</div>
        </div> -->
        <div class="coinbuy_content">
            <Loaidng :loading="loading" v-if="loading && !contractList.length" />
            <NoData v-if="!loading && !contractList.length" />
            <div class="tr" v-for="(item, i) in contractList" :key="i" @click="goInfo(item)">
                <div class="td td_left">
                    <div>
                        <span class="amount">{{ item.name || '--' }}</span>
                    </div>
                    <div style="display: flex;align-items: center;justify-content: flex-start;margin-top: 0.15rem;">
                        <div class="x">{{ item.lever || 1 }}X</div>
                        <span style="word-break: keep-all;white-space:nowrap;">Val: {{ item.volume ?
                            item.volume.toFixed(2) : '--'
                            }}</span>
                    </div>
                </div>
                <div class="td">
                    <span class="amount">{{ item.price || '--' }}</span>
                </div>
                <div class="td td_right">
                    <span class="percent" :class="[item.ratio == 0 ? '' : (item.ratio > 0 ? 'up' : 'down')]"
                        style="font-weight: 500;">{{ getUpDown(item) }}</span>
                    <div class="percent " :class="[item.ratio == 0 ? '' : (item.ratio > 0 ? 'up' : 'down')]">{{
                        item.ratio > 0 ? '+' : '' }}{{
                            ((item.ratio || 0) * 100).toFixed(2) }}%</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { _futures } from "@/api/api"
import { ref, computed } from "vue"
import store from "@/store/index"
import router from "@/router"
import Decimal from 'decimal.js';
import NoData from "@/components/NoData.vue"
import Loaidng from "@/components/Loaidng.vue"

const contractList = computed(() => store.state.contractList || [])


const loading = ref(false)
const getList = () => {
    loading.value = true
    _futures().then(res => {
        const list = res.data.map(item => {
            const target = contractList.value.find(a => a.symbol == item.symbol)
            if (target) return target
            return item
        })
        store.commit('setContractList', list || [])
        setTimeout(() => {
            store.dispatch('subList', {
                commitKey: 'setContractList',
                listKey: 'contractList',
            })
        }, 500)
    }).finally(() => {
        loading.value = false
    })
}

getList()


const getUpDown = (item) => {
    if (!item.price || !item.ratio) return 0
    return new Decimal(item.price).mul(item.ratio).toNumber()
}


// 去详情
const goInfo = (item) => {
    store.commit('setCurrConstract', item)
    router.push({
        name: 'market_info',
        query: {
            symbol: item.symbol,
            type: 'constract'
        }
    })
}
</script>

<style lang="less" scoped>
.page-constract {


    .tr {
        border-bottom: 1px solid #E8E8E8;
        display: flex;
        align-items: center;
        padding: 0.24rem 0;

        .td {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #9EA3AE;
            font-size: 0.28rem;

            .amount {
                color: #333;
                font-weight: bold;
                font-size: 0.32rem;
                font-weight: bold;
            }

            .x {
                color: #014CFA;
                background-color: #EEF3FE;
                border-radius: 0.04rem;
                padding: 0.04rem 0.08rem;
                margin-right: 0.16rem;
            }

            .percent {
                padding: 0.08rem 0.2rem;
                border-radius: 0.08rem;
                color: #fff;
                font-size: 0.24rem;
            }
        }

        .td_left {
            flex: 1.5;
            align-items: flex-start;
        }

        .td_right {
            align-items: flex-end;
        }
    }

    .coinbuy_content {
        padding: 0 0.32rem;
    }

    .th {
        padding: 0.24rem 0.32rem;
    }
}
</style>