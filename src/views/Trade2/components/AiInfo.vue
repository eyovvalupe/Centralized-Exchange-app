<!-- ai量化-订单详情 -->
<template>
    <Popup teleport="body" lazy-render v-model:show="showModel" position="bottom" round closeable>
        <div class="ai_order_info">
            <div class="title">订单详情</div>

            <div style="display: flex;flex-direction: column;align-items: center;">
                <!-- 加载 -->
                <Loaidng v-if="loading" :loading="loading" />

                <template v-else>
                    <!-- 盈利 -->
                    <div class="win" v-if="currItem.status == 'close'">
                        <div class="win_name">盈利</div>
                        <div class="amount" :class="[currItem.profit > 0 ? 'up' : 'down']">{{ currItem.profit > 0 ? '+'
                            : ''
                            }}{{ currItem.profit }}</div>
                    </div>
                    <Circle v-if="currItem.status == 'open'" class="circle" :start-position="'bottom'"
                        :stroke-linecap="'butt'" :stroke-width="150" :layer-color="'#E5E5E5'" :color="gradientColor"
                        size="150px" :rate="rate" v-model:current-rate="currentRate"
                        :text="currItem.time + _dateUnitMap[currItem.unit]" />
                </template>


                <div class="time" v-if="currItem.status == 'open'">{{ formatSec2(currItem.endtime) }}</div>
                <div class="adress">{{ currItem.order_no }}</div>
                <div class="success_icon">
                    <img src="/static/img/assets/status_success.png" alt="√">
                </div>
                <div class="name">{{ currItem.name }}</div>


                <div class="item">
                    <span>时间区域</span>

                    <div class="val">
                        <div class="tag">{{ currItem.time }}{{ currItem.unit }}</div>
                    </div>
                </div>
                <div class="item">
                    <span>网格数量</span>

                    <div class="val">
                        <div class="tag">{{ currItem.lever }}</div>
                    </div>
                </div>
                <div class="item">
                    <span>投资额</span>

                    <div class="val">
                        <div class="tag">{{ currItem.amount }}</div>
                        <span style="margin-left: 0.2rem;">USDT</span>
                    </div>
                </div>
                <div class="item" v-if="currItem.status == 'open'">
                    <span>预期盈亏金额</span>

                    <div class="val">
                        <div class="tag">{{ getRange() }}</div>
                        <span style="margin-left: 0.2rem;">USDT</span>
                    </div>
                </div>

                <Button size="large" color="#f2f2f2" round style="color: #999999;margin-top: 0.6rem"
                    @click="showModel = false">关闭</Button>
            </div>

        </div>
    </Popup>
</template>

<script setup>
import { Button, Popup, Circle } from "vant"
import { ref, computed, onBeforeUnmount } from "vue"
import { _aiget } from "@/api/api"
import { formatSec2 } from "@/utils/time"
import Decimal from 'decimal.js';
import { _dateUnitMap } from "@/utils/dataMap"
import Loaidng from "@/components/Loaidng.vue"


const currentRate = ref(100)
const rate = computed(() => {
    let t = currItem.value.time || 1
    if (currItem.value.unit == 'm') {
        t *= 60
    }
    if (currItem.value.unit == 'h') {
        t *= 3600
    }
    if (currItem.value.unit == 'd') {
        t *= (3600 * 24)
    }
    const p = currItem.value.endtime * 100 / t
    return p > 100 ? 100 : p
})
const gradientColor = {
    '0%': '#62B7F9',
    '60%': '#0066FF',
    '100%': '#0066FF',
};

const showModel = ref(false)
const currItem = ref({})
const open = (item) => {
    currItem.value = item
    getInfo()
    showModel.value = true
    if (timeout) clearInterval(timeout)
}

// 获取详情
let timeout = null
const loading = ref(false)
const getInfo = () => {
    loading.value = true
    _aiget({
        order_no: currItem.value.order_no
    }).then(res => {
        if (res.data) {
            currItem.value = res.data
            if (currItem.value.endtime) { // 开始倒计时
                if (timeout) clearInterval(timeout)
                timeout = setInterval(() => {
                    currItem.value.endtime--
                    if (currItem.value.endtime <= 0) {
                        clearInterval(timeout)

                        loading.value = true
                        setTimeout(() => {
                            getInfo()
                        }, 1000)
                    }
                }, 1000)
            }
        }
    }).finally(() => {
        loading.value = false
    })
}


const getRange = () => { // 获取预计盈亏
    if (!currItem.value.amountreturn) return '--'
    if (!currItem.value.amount) return '--'
    const rangereturn = currItem.value.amountreturn
    let rs = '--'
    try {
        const arr = rangereturn.split(' - ')
        const start = new Decimal(currItem.value.amount).mul(Number(arr[0])).div(100)
        const end = new Decimal(currItem.value.amount).mul(Number(arr[1])).div(100)
        rs = `${start} - ${end}`
    } catch { }

    return rs
}


onBeforeUnmount(() => {
    timeout && clearInterval(timeout)
})
defineExpose({
    open
})

</script>

<style lang="less">
.ai_order_info {
    padding: 0.32rem 0.32rem 1rem 0.32rem;

    .title {
        font-size: 0.32rem;
        line-height: 0.6rem;
        text-align: center;
        margin-bottom: 0.2rem;
    }

    .win {
        text-align: center;
        margin: 0.4rem 0 0.6rem 0;
        font-weight: bold;

        .win_name {
            color: #000;
            margin-bottom: 0.2rem;
        }

        .amount {
            font-size: 0.68rem;

        }
    }

    .circle {
        margin: 0.2rem 0;
    }

    .time {
        margin: 0.2rem 0;
        font-weight: 600;
        color: #000;
        font-size: 0.5rem;
    }

    .success_icon {
        width: 0.48rem;
        height: 0.48rem;
        margin: 0.4rem 0 0.1rem 0;
    }

    .name {
        font-weight: 600;
        color: #000;
        font-size: 0.32rem;
        margin: 0 0 0.2rem 0;
    }

    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.2rem 0;
        border-bottom: 1px solid #f5f5f5;
        width: 100%;

        .val {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            color: #121826;
            font-size: 0.28rem;
            font-weight: 500;

            .tag {
                height: 0.44rem;
                color: #014CFA;
                background-color: #ecf1fe;
                line-height: 0.44rem;
                padding: 0 0.24rem;
                border-radius: 0.04rem;
                margin-left: 0.2rem;
                font-size: 0.24rem;
            }

            .red_tag {
                background-color: #fbf1ef;
                color: #e8503a;
            }

            .green_tag {
                background-color: #eff9f2;
                color: #18b762;
            }
        }
    }
}
</style>