<!-- 股票单个元素 -->
<template>
    <SwipeCell class="stock_item_box" :class="'stock_item_' + updownStatus">
        <div class="stock_item" @click="goInfo">
            <div class="td5">
                <div class="item_name">{{ props.item.symbol }}</div>
                <div class="item_info">{{ props.item.name }}</div>
            </div>
            <div class="td2 spark_line_box">
                <SparkLine v-if="props.item.points" style="width:100%;height:0.45rem" :points="props.item.points"
                    :ratio="props.item.ratio" />
                <Loading v-else :loading="!props.item.points" :size="24" />
            </div>
            <div class="td2 td_r">
                <div class="item_num" :class="[updown === 0 ? '' : (updown > 0 ? 'up' : 'down')]">{{
                    props.item.price ? (props.item.price).toFixed(2) : '--' }}</div>
                <div class="item_info_box" @click.stop="mode = !mode">
                    <transition :name="'opacity'" v-if="props.item.ratio !== undefined">
                        <div v-if="mode == true" class="item_percent"
                            :class="[updown === 0 ? '' : (updown > 0 ? 'up_bg' : 'down_bg')]">{{ (props.item.ratio *
                                100).toFixed(2)
                            }}%
                        </div>
                        <div v-else class="item_num" :class="[updown === 0 ? '' : (updown > 0 ? 'up' : 'down')]">{{
                            props.item.ratio }}
                        </div>
                    </transition>
                    <div v-else class="item_percent nodata_percent">--</div>
                </div>
            </div>
        </div>
    </SwipeCell>

</template>

<script setup>
import SparkLine from "./SparkLine.vue"
import { ref, defineProps, computed, watch } from "vue"
import router from "@/router"
import { SwipeCell } from 'vant';
import store from "@/store"
import Loading from "./Loaidng.vue"

const props = defineProps({
    item: {
        type: Object,
        default: () => { }
    }
})

const mode = ref(true)
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
    setTimeout(() => {
        router.push({
            name: 'market_info',
            query: {
                symbol: props.item.symbol
            }
        })
    }, 100)
}
</script>

<style lang="less" scoped>
.stock_item_box {
    width: 100%;
    transition: all ease .3s;
    padding: 0 0.3rem;
}

.stock_item {
    display: flex;
    align-items: center;
    height: 1.32rem;
    border-bottom: 1px solid #EAEAEA;


    .td5 {
        flex: 5;
        flex-shrink: 0;
        overflow: hidden;

        .item_name {
            font-size: 0.32rem;
            color: #061023;
            line-height: 0.42rem;
        }

        .item_info {
            font-size: 0.24rem;
            line-height: 0.32rem;
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
            height: 0.48rem;
            overflow: hidden;

            .item_percent {
                line-height: 0.32rem;
                font-size: 0.28rem;
                font-weight: 400;
                color: #fff;
                text-align: center;
                padding: 0.08rem 0;
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