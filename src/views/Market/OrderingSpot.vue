<!-- 现货-订单行情 -->
<template>
    <div class="spot-ordering">

        <!-- 竖排 -->
        <div style="display: flex;flex: 1;" v-if="props.type == 'infinite'">
            <div class="ordering-box" :style="{ background: innerPage ? 'none' : '' }" style="height: 100%;">
                <div class="lists-tr lists-title" v-if="currStockItem.symbol">
                    <div class="lists-td">{{ $t('market.market_buy_list_price') }}(USDT)</div>
                    <div class="lists-td">{{ $t('market.market_buy_list_amount') }}({{
                        currStockItem.symbol.replace('usdt', '').toUpperCase() }})</div>
                </div>
                <Loaidng :loading="loading" v-if="loading" />
                <div class="lists-box" ref="listBox">
                    <div class="lists-down">
                        <div class="lists-item" @click="clickItem(item)" v-for="(item, i) in showBids" :key="i">
                            <div class="bg" :style="{ transform: `scaleX(${item[2]})` }"></div>
                            <div class="lists-tr">
                                <div class="lists-td up">{{ item[0] }}</div>
                                <div class="lists-td">{{ item[1] }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ordering-box" style="height: 100%;margin-left: 0.1rem;">
                <div class="lists-tr lists-title" v-if="currStockItem.symbol">
                    <div class="lists-td">{{ $t('market.market_buy_list_price') }}(USDT)</div>
                    <div class="lists-td">{{ $t('market.market_buy_list_amount') }}({{
                        currStockItem.symbol.replace('usdt', '').toUpperCase() }})</div>
                </div>
                <Loaidng :loading="loading" v-if="loading" />
                <div class="lists-box" ref="listBox">
                    <div class="lists-down">
                        <div class="lists-item" @click="clickItem(item)" v-for="(item, i) in showAsks" :key="i">
                            <div class="bg" :style="{ transform: `scaleX(${item[2]})` }"></div>
                            <div class="lists-tr">
                                <div class="lists-td down">{{ item[0] }}</div>
                                <div class="lists-td">{{ item[1] }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 横排 -->
        <div class="ordering-box" v-if="props.type == 'nomal'">
            <div class="control-box">
                <div class="nav" :class="{ 'nav-active': currNav == 1 }" @click="changeNav(1)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2.66663 2.66699L7.33329 2.66699L7.33329 7.33366L2.66663 7.33366L2.66663 2.66699Z"
                            fill="var(--ex-down-color)"></path>
                        <path d="M2.66663 8.66699L7.33329 8.66699L7.33329 13.3337L2.66663 13.3337L2.66663 8.66699Z"
                            fill="var(--ex-up-color)"></path>
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M8.66663 2.66699L13.3333 2.66699L13.3333 5.33366L8.66663 5.33366L8.66663 2.66699ZM8.66663 6.66699L13.3333 6.66699L13.3333 9.33366L8.66663 9.33366L8.66663 6.66699ZM13.3333 10.667L8.66663 10.667L8.66663 13.3337L13.3333 13.3337L13.3333 10.667Z"
                            fill="var(--ex-info-color)"></path>
                    </svg>
                </div>
                <div class="nav" :class="{ 'nav-active': currNav == 2 }" @click="changeNav(2)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <g>
                            <path d="M2.66663 2.66699L7.33329 2.66699L7.33329 13.3337L2.66663 13.3337L2.66663 2.66699Z"
                                fill="var(--ex-up-color)"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M8.66663 2.66699L13.3333 2.66699L13.3333 5.33366L8.66663 5.33366L8.66663 2.66699ZM8.66663 6.66699L13.3333 6.66699L13.3333 9.33366L8.66663 9.33366L8.66663 6.66699ZM13.3333 10.667L8.66663 10.667L8.66663 13.3337L13.3333 13.3337L13.3333 10.667Z"
                                fill="var(--ex-info-color)"></path>
                        </g>
                    </svg>
                </div>
                <div class="nav" :class="{ 'nav-active': currNav == 3 }" @click="changeNav(3)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <g>
                            <path d="M2.66663 2.66699L7.33329 2.66699L7.33329 13.3337L2.66663 13.3337L2.66663 2.66699Z"
                                fill="var(--ex-down-color)"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M8.66663 2.66699L13.3333 2.66699L13.3333 5.33366L8.66663 5.33366L8.66663 2.66699ZM8.66663 6.66699L13.3333 6.66699L13.3333 9.33366L8.66663 9.33366L8.66663 6.66699ZM13.3333 10.667L8.66663 10.667L8.66663 13.3337L13.3333 13.3337L13.3333 10.667Z"
                                fill="var(--ex-info-color)"></path>
                        </g>
                    </svg>
                </div>
                <div style="flex: 1;"></div>
                <div class="mix" v-if="pips.length" @click="showPicker = true">
                    <span style="margin-right: 0.04rem;">{{ currPip }}</span>
                    <div class="more">
                        <img :src="getStaticImgUrl('static/img/market/more_white.svg')" alt="^" />
                    </div>

                    <!-- 精度弹窗 -->
                    <!-- <div class="min_dialog">
                        <div class="min_item" @click="changeType(item)"
                            :class="{ min_item_active: pipType == item.value }" v-for="(item, i) in pips" :key="i">
                            {{ item.key }}
                        </div>
                    </div> -->
                </div>
            </div>
            <div class="lists-tr lists-title" v-if="currStockItem.symbol">
                <div class="lists-td">{{ $t('market.market_buy_list_price') }}(USDT)</div>
                <div class="lists-td">{{ $t('market.market_buy_list_amount') }}({{ currStockItem.symbol.replace('usdt',
                    '').toUpperCase() }})</div>
            </div>
            <Loaidng :loading="loading" v-if="loading" />
            <div class="lists-box" ref="listBox">
                <div class="lists-up" v-if="currNav != 2">
                    <div class="lists-item" @click="clickItem(item)" v-for="(item, i) in showAsks" :key="i">
                        <div class="bg bg-r" :style="{ transform: `scaleX(${item[2]})` }"></div>
                        <div class="lists-tr">
                            <div class="lists-td down">{{ item[0] }}</div>
                            <div class="lists-td">{{ item[1] }}</div>
                        </div>
                    </div>
                </div>
                <div class="lists-mid" v-show="midData[0] && !loading" :class="[midData[2] < 0 ? 'down' : 'up']">
                    <div class="price">{{ midData[0] }}</div>
                    <div class="arr" v-show="midData[2] >= 0">↑</div>
                    <div class="arr" v-show="midData[2] < 0">↓</div>
                    <div class="tip" style="color: var(--ex-text-color3);" v-show="midData[3]">{{ Math.abs(midData[3])
                    }}</div>
                </div>
                <div class="lists-down" v-if="currNav != 3">
                    <div class="lists-item" @click="clickItem(item)" v-for="(item, i) in showBids" :key="i">
                        <div class="bg" :style="{ transform: `scaleX(${item[2]})` }"></div>
                        <div class="lists-tr">
                            <div class="lists-td up">{{ item[0] }}</div>
                            <div class="lists-td">{{ item[1] }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 最新 -->
        <div class="ordering-box bbo-box" v-if="props.type == 'news'">
            <div class="lists-tr lists-title" v-if="currStockItem.symbol">
                <div class="lists-td">{{ $t('market.market_buy_list_price') }}(USDT)</div>
                <div class="lists-td">{{ $t('market.market_buy_list_amount') }}({{ currStockItem.symbol.replace('usdt',
                    '').toUpperCase() }})</div>
                <div class="lists-td">{{ $t('trade.spot_time') }}</div>
            </div>
            <div class="lists-box" style="overflow-y: auto;">
                <Loaidng :loading="loading2" v-if="loading2" />
                <template v-if="!loading2">
                    <div class="lists-item" v-for="(item, i) in news" :key="i">
                        <div class="lists-tr">
                            <div class="lists-td " :class="[item.type == 'ask' ? 'down' : 'up']">{{ item.price }}</div>
                            <div class="lists-td">{{ item.size }}</div>
                            <div class="lists-td">{{ getTimestrTimezone(item.timestamp || item.ts, item.timezone, 2) }}
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- 时间选择弹窗 -->
        <BottomPopup :safe-area-inset-top="true" :safe-area-inset-bottom="true" v-model:show="showPicker">
            <div class="times_list">
                <div v-for="(item, i) in pips" :key="i" @click="changeType(item)" class="item"
                    :class="{ active_item: pipType == item.value }">
                    {{ item.key }}
                </div>
            </div>
        </BottomPopup>
    </div>
</template>

<script setup>
import { ref, computed, onUnmounted, watch, onMounted } from "vue";
import store from "@/store";
import { useSocket } from "@/utils/ws";
import { getStaticImgUrl } from "@/utils/index";
import eventBus from "@/utils/eventBus";
import Decimal from "decimal.js";
import { getTimestrTimezone } from "@/utils/time"
import Loaidng from "@/components/Loaidng.vue"
import BottomPopup from "@/components/BottomPopup.vue";

const props = defineProps({
    type: {
        type: String,
        default: 'nomal'
    },
    innerPage: {
        type: Boolean,
        default: false
    },
    tradeType: {
        type: String,
        default: 'crypto'
    },
})

const clickItem = item => {
    eventBus.emit('choosePrice', item[0])
}

const showPicker = ref(false); // 时间选择弹窗

// 盘类型
const currNav = ref(1) // 1-买卖盘 2-买盘 3-卖盘
const changeNav = val => {
    currNav.value = val
    reset()
}
const changeType = item => {
    showPicker.value = false
    if (pipType.value == item.value) return
    pipType.value = item.value
    subs()
}
// 精度
const pips = ref([])
const pipType = ref('step0')
const currPip = computed(() => {
    const target = pips.value.find(item => item.value == pipType.value)
    if (target) return target.key
    return '--'
})

// 展示控制
const asks = ref([]) // 卖单
const bids = ref([]) // 买单
const midData = ref([]) // 中间数据
const showAsks = computed(() => {
    const arr = asks.value.slice(0, max.value).reverse()
    let maxn = 0
    arr.forEach(item => maxn = Number(item[1]) > maxn ? Number(item[1]) : maxn)
    arr.forEach(item => item[2] = (item[1] / (maxn || 1)))
    return arr
})

const showBids = computed(() => {
    const arr = bids.value.slice(0, max.value)
    let maxn = 0
    arr.forEach(item => maxn = Number(item[1]) > maxn ? Number(item[1]) : maxn)
    arr.forEach(item => item[2] = (item[1] / (maxn || 1)))
    return arr
})
const max = ref(0)
const listBox = ref()
const reset = () => {
    if (!listBox.value) return
    const h = Math.floor(listBox.value.clientHeight / 20)
    if (currNav.value != 1 || props.type == 'infinite') {
        max.value = h - 1
    } else {
        max.value = Math.floor(h / 2)
    }
}

// 最新成交
const news = ref([])


// 数据订阅
const currStockItem = computed(() => { // 当前合约
    switch (props.tradeType) {
        case "constract":
        case "crypto":
            return store.state.currConstact || {};
        case "spot":
            return store.state.currSpot || {};
        case "foreign":
        case "forex":
            return store.state.currForeign || {};
        case "commodities":
        case "blocktrade":
            return store.state.currCommodities || {};
        case 'ai': // ai
            return store.state.currAi || {};
        case "stock": //股票
            return store.state.currStockItem || {};
    }
});
const { startSocket } = useSocket();
// 订阅
const loading = ref(false);
const loading2 = ref(false)
const lastSymbol = ref('')
const lastType = ref('')
const subs = () => {
    const socket = startSocket(() => {
        if (lastSymbol.value == currStockItem.value.symbol && lastType.value == pipType.value) return
        if (lastSymbol.value != currStockItem.value.symbol) {
            pipType.value = 'step0'
        }
        asks.value = []
        bids.value = []
        lastSymbol.value = currStockItem.value.symbol
        lastType.value = pipType.value
        socket && socket.off("depth");
        socket && socket.emit("depth", JSON.stringify({ type: pipType.value, symbol: currStockItem.value.symbol }));
        loading.value = true;
        reset()
        socket.on("depth", (res) => {
            // console.error('行情', res)

            asks.value = res.data.asks || []
            bids.value = res.data.bids || []
            loading.value = false;

            try {
                const d = res.data?.asks[0] || res.data?.bids[0] || {}
                if (d && d[0]) {
                    const diff = new Decimal(d[0]).sub((midData.value[0] || d[0])).toNumber()
                    midData.value = [d[0], d[1], diff, midData.value[0] || d[0]]
                }
            } catch { }
        });

        loading2.value = true
        socket && socket.emit("bbo", JSON.stringify({ symbol: currStockItem.value.symbol }));
        socket.on("bbo", (res) => {
            news.value = res.data || []
            loading2.value = false
        });
    });
};
// 取消订阅
const cancelSubs = () => {
    const socket = startSocket(() => {
        socket && socket.off("depth");
        socket && socket.emit("depth", "");
    });
};

watch(() => currStockItem.value, val => {
    if (val && val.symbol) {
        pips.value = []
        let p = Number(val.pip) || 1
        pips.value.push({ key: p, value: 'step0' })
        pips.value.push({ key: new Decimal(p).mul(10).toNumber(), value: 'step1' })
        pips.value.push({ key: new Decimal(p).mul(100).toNumber(), value: 'step2' })
        pips.value.push({ key: new Decimal(p).mul(1000).toNumber(), value: 'step3' })
        pips.value.push({ key: new Decimal(p).mul(10000).toNumber(), value: 'step4' })
        pips.value.push({ key: new Decimal(p).mul(100000).toNumber(), value: 'step6' })
        setTimeout(() => {
            subs();
        }, 500)
    }
}, { immediate: true })

onMounted(() => {

})
onUnmounted(() => {
    cancelSubs();
});
</script>

<style lang="less" scoped>
.spot-ordering {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
    width: 100%;

    .ordering-box {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        border-radius: 0.32rem;
        padding: 0.32rem;

        .title {
            font-size: 0.28rem;
            color: var(--ex-white);
            border-bottom: 1px solid var(--ex-border-color);
            padding-bottom: 0.24rem;
        }

        .control-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 0.4rem;
            margin-bottom: 0.2rem;

            .nav {
                cursor: pointer;
                margin-right: 0.12rem;
                opacity: 0.5;
                transition: all ease-in .2s;

                >svg {
                    width: 0.32rem;
                    height: 0.32rem;
                }
            }

            .nav-active {
                opacity: 1;
            }

            .mix {
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                position: relative;

                .more {
                    height: 0.12rem;
                    width: auto;
                    transform: rotate(180deg);
                }

                &:hover {
                    .min_dialog {
                        visibility: visible;
                        opacity: 1;
                        transform: translateY(100%);
                    }
                }
            }
        }

        .lists-item {
            position: relative;
            height: 0.4rem;

            .bg {
                position: absolute;
                z-index: 1;
                width: 100%;
                height: 100%;
                top: 0;
                right: 0;
                transform: scaleX(0);
                transform-origin: 100% 100%;
                transition: all ease-in .1s;
                background-color: rgb(var(--ex-up-color-rgb) / 0.1);
            }

            .bg-r {
                background-color: rgb(var(--ex-down-color-rgb) / 0.1);
            }
        }

        .lists-tr {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.24rem;
            height: 100%;
            position: absolute;
            z-index: 1;
            top: 0;
            left: 0;
            width: 100%;
            cursor: pointer;

            &:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }

            .lists-td {
                flex: 1;
                overflow: hidden;
                text-align: right;

                &:first-child {
                    text-align: left;
                }
            }
        }

        .lists-title {
            padding-bottom: 0.16rem;
            position: relative;
            height: 0.6rem;
            cursor: default;

            &:hover {
                background-color: rgba(255, 255, 255, 0);
            }

            .lists-td {
                color: var(--ex-text-color3);
                line-height: 1;
            }
        }

        .lists-mid {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: 0.8rem;
            line-height: 1;
            flex-wrap: wrap;

            .price {
                font-size: 0.4rem;
                font-weight: bold;
            }

            .arr {
                margin-left: 0.16rem;
            }

            .tip {
                margin-left: 0.16rem;
                position: relative;
                top: 0.04rem;
            }
        }

        .lists-box {
            flex: 1;
            overflow: hidden;
        }
    }

    .bbo-box {
        margin-top: 0.08rem;
    }
}

.times_list {
    padding: 0.5rem 0.32rem;

    .item {
        height: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.28rem;
        color: var(--ex-text-color2);
        overflow: hidden;
    }

    .active_item {
        background-color: var(--ex-bg-color2);
        color: var(--ex-primary-color);
        border-radius: 0.32rem;
    }
}
</style>