<!-- 股票单个元素 -->
<template>
    <div ref="root" style="width:100%">
        <SwipeCell v-if="show" class="stock_item_box" :class="'stock_item_' + updownStatus">
            <div class="stock_item" @click="goInfo">
                <div class="td5">
                    <div class="item_name">{{ props.item.symbol }}</div>
                    <div class="item_info">{{ props.item.name || '--' }}</div>
                </div>
                <div class="td2 spark_line_box">
                    <SparkLine v-if="props.item.points" style="width:100%;height:0.45rem" :points="props.item.points"
                        :ratio="props.item.ratio" />
                    <div v-else></div>
                </div>
                <div class="td2 td_r">
                    <div class="item_num" :class="[updown === 0 ? '' : (updown > 0 ? 'up' : 'down')]">{{
                        props.item.price ? (props.item.price).toFixed(2) : '--' }}</div>
                    <div class="item_info_box" @click.stop="() => mode = mode == 3 ? 1 : mode + 1">
                        <div v-if="props.item.ratio !== undefined" class="item_percent"
                            :class="[updown === 0 ? '' : (updown > 0 ? 'up_bg' : 'down_bg')]">
                            <transition :name="'opacity'">
                                <span v-if="mode == 1">{{ (props.item.ratio * 100).toFixed(2) }}%</span>
                                <span v-else-if="mode == 2">{{ (props.item.price).toFixed(2) }}</span>
                                <span v-else>{{ _formatNumber(props.item.volume) }}</span>
                            </transition>
                        </div>
                    </div>
                </div>
            </div>

            <template #right v-if="props.deleteItem">
                <div class="delete_content" @click="removeStock(item)">
                    <div class="delete_icon">
                        <img src="/static/img/market/delete.png" alt="🚮">
                    </div>
                </div>
            </template>
        </SwipeCell>
        <div style="height: 1.44rem;" v-if="!show"></div>
    </div>
</template>

<script setup>
import SparkLine from "./SparkLine.vue"
import { ref, computed, watch, onMounted, onUnmounted } from "vue"
import router from "@/router"
import { SwipeCell } from 'vant';
import store from "@/store"
import { _formatNumber } from "@/utils/index"

const emits = defineEmits(['remove'])
const props = defineProps({
    item: {
        type: Object,
        default: () => { }
    },
    scrollBox: { // 滚动的父级
        type: String,
        default: '.page'
    },
    deleteItem: { // 是否可以滑动删除
        type: Boolean,
        default: false
    },
    type: { //从交易页面侧边栏点击
        type:String,
        default: ''
    }
})

// 虚拟 dom
const show = ref(false)
const root = ref()
let scrollParent = {}
onMounted(() => {
    setTimeout(() => {
        scrollParent = document.querySelector(props.scrollBox)
        if (scrollParent && scrollParent.addEventListener) {
            scrollParent.addEventListener('scroll', getShow)
        }
        getShow()
    }, 500)
})
onUnmounted(() => {
    if (scrollParent && scrollParent.removeEventListener) {
        scrollParent.removeEventListener('scroll', getShow)
    }
})
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
function getShow() {
    show.value = false
    if (root.value) {
        const rect = root.value.getBoundingClientRect()
        if (rect && rect.top > -rect.height && rect.top < totalHeight) {
            show.value = true
        }
    }
}

const mode = ref(1)
const updown = computed(() => { // 1-涨 -1-跌 0-平
    if (props.item.ratio === undefined) return 0
    return props.item.ratio > 0 ? 1 : -1
})
const price = computed(() => props.item.price)


const updownStatus = ref('')
watch(price, (newVal, oldVal) => {
    if (newVal > oldVal) { // 上升
        updownStatus.value = 'up'
    } else { // 下降
        updownStatus.value = 'down'
    }
    setTimeout(() => {
        updownStatus.value = ''
    }, 1000)
})

const goInfo = () => {
    store.commit('setCurrStock', props.item)
    if (props.type === 'trade') {
        const data = [
            {
                name:props.item.name,
                symbol:props.item.symbol,
            }
        ]
        store.commit('setShowLeft',false)
        store.commit('setChooseSymbol',data)
        return
    } else {
        setTimeout(() => {
        router.push({
            name: 'market_info',
            query: {
                symbol: props.item.symbol
                }
            })
        }, 100)
    } 
}


const removeStock = item => {
    emits('remove', item)
}
</script>

<style lang="less" scoped>
.stock_item_box {
    width: 100%;
    transition: all ease .3s;


    .delete_content {
        width: 1.12rem;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #014CFA;

        .delete_icon {
            font-size: 0.52rem;
            height: 0.52rem
        }
    }
}

.stock_item {
    display: flex;
    align-items: center;
    height: 1.44rem;
    padding: 0 0.3rem;
    // border-bottom: 1px solid #EAEAEA;


    .td5 {
        flex: 5;
        flex-shrink: 0;
        overflow: hidden;

        .item_name {
            font-size: 0.32rem;
            color: #061023;
            line-height: 0.46rem;
            font-weight: 600;
            margin-bottom: 0.06rem;
        }

        .item_info {
            font-size: 0.28rem;
            line-height: 0.36rem;
            color: #8F92A1;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
            overflow: hidden;
            padding-right: 0.4rem;
        }
    }

    .td2 {
        flex-shrink: 0;
        flex: 2;
        overflow: hidden;

        .item_num {
            font-size: 0.32rem;
            font-weight: 400;
            line-height: 0.42rem;
            color: #6C7B90;
        }

        .item_info_box {
            margin-top: 0.06rem;
            height: 0.48rem;
            overflow: hidden;

            .item_percent {
                line-height: 0.32rem;
                font-size: 0.24rem;
                font-weight: 400;
                color: #fff;
                text-align: center;
                padding: 0.08rem 0;
                border-radius: 0.04rem;
                white-space: nowrap;
            }

            .nodata_percent {
                background-color: #6C7B90;
            }
        }
    }

    .td_r {
        text-align: right;
    }

    .spark_line_box {
        padding-right: 0.4rem;
        padding-left: 0.2rem;
    }
}

.stock_item_up {
    background-color: rgba(24, 183, 98, 0.12);

    .stock_item {
        border-bottom: 1px solid rgba(24, 183, 98, 0.12);
    }
}

.stock_item_down {
    background-color: rgba(250, 100, 102, 0.12);

    .stock_item {
        border-bottom: 1px solid rgba(250, 100, 102, 0.12);
    }
}
</style>