<template>
    <div class="open-position">
        <div class="position-header">
            <div class="up-botton" :style="backgroundImageStyle">
                买涨
            </div>
            <div class="down-button" :style="blueBackgroundImageStyle">
                买跌
            </div>

            <div class="position-tabs">
                <Tabs class="tabs" v-model:active="active" :swipeable="false" animated :color="'#014CFA'" shrink @change="onChange">
                    <Tab title="市价">
                    </Tab>
                    <Tab title="限价">          
                    </Tab>
                    <Tab title="止盈/止损">
                    </Tab>
                </Tabs>
            </div>

        </div>

        <div class="position-box">
            <span class="grop-title">股票</span>
            <Field v-model="value" class="stock-input" />
            <span class="grop-title" style="color: #014cfa;">全仓 VS 逐仓</span>
            <div style="display: flex;margin-top: 0.12rem;margin-bottom: 0.2rem;">
                <div class="small-select">
                    <span style="margin-left: 0.2rem;">全仓</span>
                    <img src="/static/img/trade/down.png" class="down-img">
                </div>
                <div class="big-selcet">
                    200 X
                    <img src="/static/img/trade/down.png" class="down-img">
                </div>
            </div>
            <span class="grop-title">数量</span>
            <Field v-model="sliderValue" class="num-input" />
            
        </div>

        <div class="position-account">
            可买数量 <span style="color: #333;">0</span>
        </div>


        <Slider v-model="sliderValue">
            <template #button>
                <div class="custom-button"></div>
            </template>
        </Slider>

        <div class="position-bottom">
            <div><span class="position-pay">支付 </span><span class="pay-num">872000.12</span></div>
            <div class="position-line-dashed"></div>
            <div class="position-fee">保证金 30000 + 手续费 20</div>
        </div>


        <Button size="large" color="#18b762" round >买跌</Button>


    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Tab, Tabs, Field, CellGroup, Slider, Button } from 'vant';

const backgroundImageStyle = computed(() => ({
    backgroundImage: `url(/static/img/trade/light-blue.png)`,
}));

const blueBackgroundImageStyle = computed(() => ({
    backgroundImage: `url(/static/img/trade/blue.png)`,
}));


const active =ref(0);
const value = ref('');
const sliderValue = ref(20)

const onChange = (val) => {
  active.value = val
}


</script>


<style lang="less">
    .open-position {
        padding: 0 0.3rem;
        padding-bottom: 0.76rem;
        background-color: white;
        .position-header {
            display: flex;
            .up-botton {
                width: 1.32rem;
                height: 0.56rem;
                color: #014cfa;
                line-height: 0.56rem;
                text-align: center;
                position: relative;
                overflow: hidden;
                background-size: cover;
                background-position: center;
            }
            .down-button {
                width: 1.32rem;
                height: 0.56rem;
                color: white;
                line-height: 0.56rem;
                text-align: center;
                background-size: cover;
                background-position: center;
            }
            .position-tabs {
                width: 4.4rem;
                margin-left: 0.12rem;
                .tabs .van-tab {
                    margin-left: 0.2rem !important;
                }
            }
        }
        .grop-title {
            color: #333;
            text-align: center;
            font-size: 0.28rem;
            font-style: normal;
            font-weight: 400;
            line-height: 0.36rem;
        }
        .position-box {
            .stock-input{
                width: 100%;
                height: 1.14rem;
                border-radius: 0.12rem;
                border: 0.02rem solid #D0D8E2;
                margin: 0.2rem 0;
            }

            .num-input {
                width: 100%;
                height: 0.88rem;
                border-radius: 0.12rem;
                border: 0.02rem solid #D0D8E2;
                margin-top: 0.2rem;
            }

            .small-select {
                width: 1.48rem;
                height: 0.88rem;
                flex-shrink: 0;
                border-radius: 0.12rem;
                border: 0.02rem solid #D0D8E2;
                margin-right: 0.24rem;
                line-height: 0.88rem;
                position: relative;
            }
            .big-selcet {
                flex: 1;
                height: 0.88rem;
                border-radius: 0.12rem;
                border: 0.02rem solid #D0D8E2;
                line-height: 0.88rem;
                text-align: center;
                position: relative;
            }
            .down-img {
                display: inline-block;
                width: 0.32rem !important;
                height: 0.32rem !important;
                vertical-align: middle;
                position: absolute;
                right: 0.2rem;
                top: 0.28rem;
            }
        }
        .position-account {
            margin: 0.1rem 0;
            text-align: right;
            color: #8f92a1;
            font-size: 0.28rem;
            font-style: normal;
            font-weight: 400;
            line-height: 0.48rem;
        }
        .position-bottom {
            text-align: right;
            margin-top: 0.8rem;
            position: relative;
            .position-pay {
                color: #014CFA;
                font-size: 0.28rem;
                font-style: normal;
                font-weight: 600;
                line-height: 0.48rem;
                vertical-align: middle;
            }
            .pay-num {
                color: #014CFA;
                text-align: right;
                font-size: 0.36rem;
                font-style: normal;
                font-weight: 600;
                line-height: 0.56rem;
                vertical-align: middle;
            }
            .position-line-dashed {
                width: 3.44rem;
                border-bottom: 0.02rem dashed #cbcbcb;
                position: absolute;
                right: 0;
                top: 0.5rem;
            }
            .position-fee {
                margin-top: 0.1rem;
                color: #333;
                font-size: 0.24rem;
                font-style: normal;
                font-weight: 400;
                line-height: 0.36rem;
                margin-bottom: 0.76rem;
            }
        }
        .custom-button {
            width: 0.06rem;
            height: 0.48rem;
            background: #014CFA;
        }
    }
</style>