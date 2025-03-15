<!-- 折线图 -->
<template>
    <div class="chat_area_box">
        <div class="chat_area" id="chat_area"></div>

        <!-- 加载 -->
        <div class="chat_area_loading" v-show="loading">
            <!-- <div class="lines">
                <div class="item item_1"></div>
                <div class="item item_2"></div>
                <div class="item item_3"></div>
            </div> -->
            <Loading type="circular" :loading="loading" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed, ref, onBeforeUnmount, watch } from "vue"
import { init, dispose } from 'klinecharts'
import { klineConfig } from './kline.conf';
import { _time } from "@/api/api"
import { useSocket } from '@/utils/ws'
import { _maxTail } from "@/utils/index"
import { Loading } from "vant"

const { startSocket } = useSocket()
let socket = null

const props = defineProps({
    symbol: '',
    showY: {
        type: Boolean,
        default: false
    },
    mini: false,
})
const symbol = computed(() => props.symbol || '')
watch(symbol, val => {
    setTimeout(() => {
        initData()
    }, 0)
})
let chart = ''

onMounted(() => {
    if (symbol.value) {
        chart = init('chat_area')
        chart.setStyles(klineConfig)
        chart?.setScrollEnabled(true) // 是否滚动
        chart?.setOffsetRightDistance(props.showY ? 50 : 0) // 设置右边距
        chart?.setMaxOffsetLeftDistance(0) // 设置左边最大空出的边距
        chart?.setMaxOffsetRightDistance(props.showY ? 50 : 0) // 设置右边最大空出的边距
    }
    initData()
})
onBeforeUnmount(() => {
    dispose('chat_area')
    socket && socket.emit('time', '') // 取消订阅
})


const loading = ref(true)
let timeout = null
const initData = async () => {
    // 样式
    const selfStyle = {
        grid: {
            show: true,
            horizontal: {
                show: true,
                size: 1,
                // color: 'var(--ex-border-color3)',
                color: '#414345',

                style: 'dashed',
                dashedValue: [2, 2]
            },
            vertical: {
                show: true,
                size: 1,
                // color: 'var(--ex-border-color)',
                color: '#414345',

                style: 'dashed',
                dashedValue: [2, 2]
            }
        },
        xAxis: {
            show: props.showY,
            size: 'auto'
        },
        yAxis: {
            show: props.showY
        },
        candle: {
            type: 'area',
            priceMark: {
                show: props.showY
            },
            area: {
                // lineColor: props.color || "var(--ex-primary-color)",
                lineColor: props.color || "#00D77C",

                point: {
                    show: props.showY
                },
                lineSize: 2,
                backgroundColor: [
                    {
                        offset: 0,
                        color: props.color ? `rgba(${props.rgbColor}, 0.01)` : "rgba(151 225 128, 0.01)"
                    },
                    {
                        offset: 1,
                        color: props.color ? `rgba(${props.rgbColor}, 0.3)` : "rgba(151 225 128, 0.3)"
                    }
                ],
                smooth: true,
                point: {
                    show: true,
                    color: props.color ? `rgba(${props.rgbColor}, 0.3)` : "rgba(151 225 128, 0.3)",
                    radius: 4,
                    rippleColor: props.color ? `rgba(${props.rgbColor}, 0.3)` : "rgba(151 225 128, 0.3)", // getAlphaBlue(0.3),
                    rippleRadius: 8,
                    animation: true,
                    animationDuration: 1000
                }
            },
            tooltip: {
                offsetLeft: 2,
                offsetTop: 3,
                offsetRight: 2,
                offsetBottom: 3,
                showRule: 'follow_cross', /// ,follow_cross
                showType: 'rect',
                custom: [
                    { title: 'time', value: '{time}' },
                    // { title: 'open', value: '{open}' },
                    // { title: 'high', value: '{high}' },
                    // { title: 'low', value: '{low}' },
                    // { title: 'close', value: '{close}' },
                    { title: 'price', value: '{open}' }
                ],
                text: {
                    size: 10,
                    family: 'Helvetica Neue',
                    weight: 'normal',
                    color: 'var(--ex-text-color)',
                    marginLeft: 8,
                    marginTop: 4,
                    marginRight: 8,
                    marginBottom: 4
                },
            }
        },
    }
    if (props.showY) {
        delete selfStyle.yAxis
    }
    chart.setStyles(selfStyle)
    // 数据
    const query = symbol.value
    loading.value = true
    if (!symbol.value) return
    const datas = await getData({ symbol: query })
    loading.value = false
    if (query == symbol.value) { // 当前股票
        if (datas && datas.length) {
            let num = 2
            try {
                num = datas[0].price.toString().split('.')[1].length || 0
            } catch {
                num = 2
            }
            const maxTail = _maxTail(datas[0].high)
            if (num > maxTail) num = maxTail
            chart.setPriceVolumePrecision(num, 2)
            if (datas[0] && datas[0].timezone) {
                chart.setTimezone(datas[0].timezone)
            }
            const dd = datas.map(item => {
                const data = {
                    close: Number(item.close),
                    high: Number(item.high),
                    low: Number(item.low),
                    open: Number(item.open),
                    timestamp: item.timestamp ? Number(item.timestamp) : Number(item.ts),
                    volume: Number(item.volume)
                }
                return data
            })
            chart.applyNewData(dd) // 重设图表数据
            chart.zoomAtTimestamp(2, dd[dd.length - 1].timestamp, 300)
            subs()
            resetSize()
        } else {
            console.error('没有数据')
        }
    }
}

const subs = () => { // 订阅新数据
    socket = startSocket(() => {
        const query = props.symbol
        socket && socket.emit('time', query) // 分时
        socket && socket.off('time')
        socket && socket.on('time', res => {
            if (res.code == 200 && res.symbol == props.symbol) {
                res.data.forEach(item => {
                    chart.updateData({
                        ...item,
                        open: Number(item.price),
                        close: Number(item.price),
                        high: Number(item.price),
                        low: Number(item.price),
                        timestamp: (item.timestamp || item.ts)
                    })
                })
            }
        })
    })
}

const getData = (params) => { // 获取数据
    const key = `${params.symbol}_time`
    return new Promise(resolve => {
        let rs = []
        // 先从session里找
        const s_rs = sessionStorage.getItem(key)
        if (s_rs) {
            try {
                rs = JSON.parse(s_rs)
            } catch { }
        }
        if (rs && rs.length) {
            // 判断数据存储的时间
            const t = Number(sessionStorage.getItem(key + '_time') || 0)
            if (Date.now() - t > 5 * 60 * 1000) { // 大于5分钟了就去重新请求

            } else {
                resolve(rs)
                return
            }
        }
        _time(params).then(res => {
            if (res.code == 200) {
                const dd = res.data.map(item => {
                    item.open = Number(item.price)
                    item.close = Number(item.price)
                    item.high = Number(item.price)
                    item.low = Number(item.price)
                    item.timestamp = (item.timestamp || item.ts)
                    return item
                }).reverse()
                resolve(dd)
                // 把结果放到sessionData
                sessionStorage.setItem(key + '_time', Date.now())
                sessionStorage.setItem(key, JSON.stringify(dd))
            } else {
                resolve([])
            }
        }).catch(() => {
            resolve([])
        })
    })
}

// 重置图表大小
let timeout2 = null
const resetSize = () => {
    if (timeout2) clearTimeout(timeout2)
    timeout2 = setTimeout(() => {
        chart.resize()
    }, 500)
}

defineExpose({
    resetSize,
    initData,
})
</script>

<style lang="less" scoped>
.chat_area_box {
    width: 100%;
    height: 100%;
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .chat_area {
        width: 100%;
        height: 100%;
        flex: 1;
    }

    .chat_area_loading {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--ex-none);

        z-index: 99;
        // border-right: 1px solid var(--ex-info-color);
        // border-bottom: 1px solid var(--ex-info-color);
        display: flex;
        align-items: center;
        justify-content: center;

        .lines {
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(45deg);
            position: relative;
            left: -2rem;
            top: 2rem;
            animation: loading 2s linear infinite;
        }

        @keyframes loading {
            0% {
                opacity: 1;
            }

            50% {
                opacity: 0.2;
            }

            100% {
                opacity: 1;
            }
        }

        .item {
            width: 1rem;
            height: 2rem;
            border-left: 1px solid var(--ex-info-color);
            border-top: 1px solid var(--ex-info-color);
            position: relative;
        }

        .item_2 {
            top: -2rem;
        }

        .item_3 {
            top: -4rem;
        }
    }
}
</style>