<!-- 折线图 -->
<template>
    <div class="chat_area" id="chat_area">

    </div>
</template>

<script setup>
import { onMounted } from "vue"
import { init } from 'klinecharts'
import { klineConfig } from './kline.conf';

onMounted(() => {
    const chart = init('chat_area')
    chart.setStyles(klineConfig)
    chart?.setScrollEnabled(false) // 是否滚动
    chart?.setOffsetRightDistance(0) // 设置右边距
    chart?.setMaxOffsetLeftDistance(0) // 设置左边最大空出的边距
    chart?.setMaxOffsetRightDistance(0) // 设置右边最大空出的边距
    chart?.setStyles({
        grid: {
            vertical: {
                show: false
            }
        },
        xAxis: {
            show: false,
            size: 'auto'
        },
        yAxis: {
            show: false
        },
        candle: {
            area: {
                point: {
                    show: false
                }
            },
            priceMark: {
                show: false
            },
            tooltip: {
                offsetLeft: 2,
                offsetTop: 3,
                offsetRight: 2,
                offsetBottom: 3,
                showRule: 'none', /// ,follow_cross
                showType: 'rect',
                custom: [
                    // { title: 'time', value: '{time}' },
                    // { title: 'open', value: '{open}' },
                    // { title: 'high', value: '{high}' },
                    // { title: 'low', value: '{low}' },
                    // { title: 'close', value: '{close}' },
                    // { title: 'volume', value: '{volume}' }
                ],
                text: {
                    size: 10,
                    family: 'Helvetica Neue',
                    weight: 'normal',
                    color: '#121826',
                    marginLeft: 8,
                    marginTop: 4,
                    marginRight: 8,
                    marginBottom: 4
                },
            }
        },
    })
    chart.applyNewData(genData())
    chart.setStyles({
        candle: { type: 'area' }
    })
})



function genData(timestamp = new Date().getTime(), length = 800) {
    let basePrice = 5000
    timestamp = Math.floor(timestamp / 1000 / 60) * 60 * 1000 - length * 60 * 1000
    const dataList = []
    for (let i = 0; i < length; i++) {
        const prices = []
        for (let j = 0; j < 4; j++) {
            prices.push(basePrice + Math.random() * 60 - 30)
        }
        prices.sort()
        const open = +(prices[Math.round(Math.random() * 3)].toFixed(2))
        const high = +(prices[3].toFixed(2))
        const low = +(prices[0].toFixed(2))
        const close = +(prices[Math.round(Math.random() * 3)].toFixed(2))
        const volume = Math.round(Math.random() * 100) + 10
        const turnover = (open + high + low + close) / 4 * volume
        dataList.push({ timestamp, open, high, low, close, volume, turnover })

        basePrice = close
        timestamp += 60 * 1000
    }
    return dataList
}
</script>

<style lang="less" scoped>
.chat_area {
    width: 100%;
    height: 100%;
}
</style>