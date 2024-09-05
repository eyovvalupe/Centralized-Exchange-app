<!-- ai量化-订单详情 -->
<template>
    <Popup teleport="body" v-model:show="showModel" position="bottom" round closeable>
        <div class="ai_order_info">
            <div class="title">订单详情</div>

            <div style="display: flex;flex-direction: column;align-items: center;">
                <Circle class="circle" :start-position="'bottom'" :stroke-linecap="'butt'" :stroke-width="150"
                    :layer-color="'#E5E5E5'" :color="gradientColor" size="200px" :rate="rate"
                    v-model:current-rate="currentRate" :text="currentRate + '分钟'" />

                <div class="time">00 : 18 : 66</div>
                <div class="adress">sdfsdfsdfs7df9sd7f9sd</div>
                <div class="name">BTC/USDT</div>

                <div class="item">
                    <span>投资额</span>

                    <div class="val">
                        <div class="tag">2000</div>
                        <span style="margin-left: 0.2rem;">USDT</span>
                    </div>
                </div>
                <div class="item">
                    <span>预期盈亏金额</span>

                    <div class="val">
                        <div class="tag">20~40</div>
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
import { ref } from "vue"


const currentRate = ref(100)
const rate = ref(80)
const gradientColor = {
    '0%': '#62B7F9',
    '60%': '#0066FF',
    '100%': '#0066FF',
};

const showModel = ref(false)
const open = () => {
    showModel.value = true
}

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

    .circle {
        margin: 0.2rem 0;
    }

    .time {
        margin: 0.2rem 0;
        font-weight: 600;
        color: #000;
        font-size: 0.5rem;
    }

    .name {
        font-weight: 600;
        color: #000;
        font-size: 0.32rem;
        margin: 0.4rem 0 0.2rem 0;
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