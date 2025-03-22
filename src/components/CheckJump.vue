<!-- 检测是否开市 并跳转 -->
<template>
    <div>
        <BottomPopup round :title="'交易类型'" v-model:show="showDialog" position="bottom" closeable teleport="body">
            <div class="lists">
                <div @click="clickItem(item)" class="item" v-for="item in arr" :key="item">{{ titleMap[item] }}</div>
            </div>
        </BottomPopup>
    </div>
</template>

<script setup>
import ciper from "@/utils/ciper.js"
import { showLoadingToast, closeToast, showToast } from "vant"
import { _basic } from "@/api/api.js"
import { ref } from "vue"
import BottomPopup from "./BottomPopup.vue"
import router from "@/router"
import store from "@/store"

const showDialog = ref(false)
const titleMap = {
    stock: '股票',
    trade: '币币',
    futures: '加密货币合约',
    aiquant: '交易机器人',
    forex: '外汇',
    blocktrade: '大宗商品',
}
const tradeTypeMap = {
    stock: 'stock',
    trade: 'spot',
    futures: 'constract',
    aiquant: 'ai',
    forex: 'foreign',
    blocktrade: 'commodities',
}

const arr = ref([])
const target = ref({})
const check = item => {
    let type = ''
    switch (item.type) {
        case "stock":
            type = 'stock'
            sessionStorage.setItem("currStockItem", JSON.stringify(item));
            store.commit("setCurrStockItem", item);
            break
        case "spot":
            type = 'spot'
            sessionStorage.setItem("currSpot", JSON.stringify(item));
            store.commit("setCurrSpot", item);
            break;
        case 'crypto':
        case "constract":
            type = 'constract'
            sessionStorage.setItem("currConstract", JSON.stringify(item))
            store.commit('setCurrConstract', item)
            break
        case "ai":
            type = 'ai'
            sessionStorage.setItem("currAi", JSON.stringify(item))
            store.commit('setCurrAi', item)
            break
        case 'forex': // 外汇
        case "foreign":
            type = 'foreign'
            store.commit("setCurrForeign", item);
            sessionStorage.setItem("currForeign", JSON.stringify(item));
            break;
        case 'blocktrade': // 大宗
        case "commodities":
            type = 'commodities'
            store.commit("setCurrCommodities", item);
            sessionStorage.setItem("currCommodities", JSON.stringify(item));
            break;
    }
    if (type) {
        router.push({
            name: 'market_info',
            query: {
                symbol: ciper.encrypt(item.symbol),
                tradeType: type,
                check: 1
            }
        })
    } else {
        console.error('未知类型', item)
    }
    if (item) return
    // 这个逻辑放到进入相亲页之后了
    showLoadingToast({
        duration: 0,
        loadingType: "circular",
    });
    arr.value = []
    target.value = JSON.parse(JSON.stringify(item))
    _basic({ symbol: item.symbol }).then(res => {
        const d = res.data || {}
        const list = ['stock', 'trade', 'futures', 'aiquant', 'forex', 'blocktrade']
        list.forEach(it => {
            if (d[it]) {
                arr.value.push(it)
            }
        })
        if (!arr.value.length) return setTimeout(() => showToast('不可交易'), 100)
        if (arr.value.length == 1) {
            clickItem(arr.value[0])
        } else {
            showDialog.value = true
        }
    }).finally(() => {
        closeToast();
    });
}


const clickItem = type => {
    showDialog.value = false
    switch (type) {
        case 'stock': // 股票
            store.commit('setCurrStockItem', target.value);
            break;
        case 'trade': // 现货
            store.commit('setCurrSpot', target.value);
            break;
        case 'futures': // 合约
            store.commit('setCurrConstract', target.value);
            break;
        case 'aiquant': // ai
            store.commit('setCurrAi', target.value);
            break;
        case 'forex': // 外汇
            store.commit('setCurrForeign', target.value);
            break;
        case 'blocktrade': // 大宗商品
            store.commit('setCurrCommodities', target.value);
            break;
    }
    router.push({
        name: 'tradeInfo',
        query: {
            symbol: ciper.encrypt(target.value.symbol),
            tradeType: tradeTypeMap[type]
        }
    })
}

defineExpose({
    check
})
</script>

<style lang="less" scoped>
.lists {
    padding: 0.6rem 0.32rem;

    .item {
        height: 0.92rem;
        border-radius: 1rem;
        background-color: var(--ex-bg-white2);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.32rem;
        color: var(--ex-white);

        &:active {
            background-color: var(--ex-primary-color);
        }
    }
}
</style>