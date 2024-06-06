<template>
    <div class="open-position">
        <div class="position-header">
            <div class="up-botton" :style="isUpActive ? activeBackgroundImageStyle : backgroundImageStyle" @click="activateUp">
                买涨
            </div>
            <div class="down-button" :style="isDownActive ? activeBlueBackgroundImageStyle : blueBackgroundImageStyle" @click="activateDown">
                买跌
            </div>

            <div class="position-tabs">
                <Tabs class="tabs" v-model:active="active" :swipeable="false" :color="'#014CFA'" shrink @change="onChange">
                    <Tab title="市价">
                    </Tab>
                    <Tab title="限价">          
                    </Tab>
                    <Tab title="止盈/止损">
                    </Tab>
                </Tabs>
            </div>

        </div>

        <Loading v-if="loading"></Loading>

        <div class="position-box" v-if="!loading">
            <span class="grop-title" v-if="active === 1">价格</span>
            <Field v-model="priceValue" class="num-input num-right-text" style="margin-bottom: 0.2rem;" v-if="active === 1"/>


            <span class="grop-title" v-if="active === 2">止损</span>
            <Field v-model="loseValue" class="num-input num-right-text" style="margin-bottom: 0.2rem;" v-if="active === 2"/>

            <span class="grop-title" v-if="active === 2">价格</span>
            <div style="display: flex;"  v-if="active === 2">
              <Field v-model="marketValue" style="margin-bottom: 0.2rem;"  :class="['price-num-input', { pricenlarged: marketValue.length > 0 }]"/>
              <div :class="['market-button', { marketenlarged: marketValue.length > 0 }]">市场</div>
            </div>
            

            <div class="stock-box">
              <span class="grop-title">股票</span>
              <img src="/static/img/trade/blue-stock.png" class="stock-img" v-if="value.length > 0">
              <img src="/static/img/trade/white-stock.png" class="stock-img" v-else>
            </div>
            
            <Field
                v-model="value"
                :class="['num-input', 'stock-input-text', { enlarged: value.length > 0 }]"
                style="margin-bottom: 0.2rem;"
                @input="handleInput"
            >
            <template #button v-if="value.length > 0">
                <div class="co-text">
                    <div>
                        ADORWELD
                    </div>
                    <div style="color: #9ea3ae;">
                        Ador Welding Limited
                    </div>
                </div>
            </template>
            </Field>

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
            <Field v-model="sliderValue" class="num-input num-right-text" />
            

        <div class="position-account">
            可买数量 <span style="color: #333;">0</span>
        </div>

      <Slider
        v-model="sliderValue"
        bar-height="0.08rem"
        active-color="#f2f2f2"
        inactive-color="#f2f2f2"
        @change="onSliderChange"
      />
      <div class="percentages">
        <div v-for="percent in percentages" :key="percent" class="percentage">
          <div class="line"></div>
          {{ percent }}%
        </div>
      </div>


        <div class="position-bottom">
            <div><span class="position-pay">支付 </span><span class="pay-num">872000.12</span></div>
            <div class="position-line-dashed"></div>
            <div class="position-fee">保证金 30000 + 手续费 20</div>
        </div>


        <Button size="large" color="#18b762" round v-if="isDownActive" >买跌</Button>
        <Button size="large" color="#e8503a" round v-if="isUpActive" >买涨</Button>
        </div>


    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Tab, Tabs, Field, CellGroup, Slider, Button, Loading } from 'vant';

const backgroundImageStyle = computed(() => ({
    backgroundImage: `url(/static/img/trade/light-blue.png)`
}));

const activeBackgroundImageStyle = computed(() => ({
    backgroundImage: `url(/static/img/trade/left-blue.png)`,
    color:'white'
}));

const activeBlueBackgroundImageStyle = computed(() => ({
    backgroundImage: `url(/static/img/trade/blue.png)`,
}));

const blueBackgroundImageStyle = computed(() => ({
    backgroundImage: `url(/static/img/trade/right-white.png)`,
    color:'#014cfa'
}));


const active =ref(0);
const value = ref('');
const priceValue = ref('')
const loseValue = ref('')
const marketValue = ref('')
const sliderValue = ref(20)
const loading = ref(false)
const percentages = [25, 50, 75, 100];

const isUpActive = ref(true);
const isDownActive = ref(false);

const activateUp = () => {
  isUpActive.value = true;
  isDownActive.value = false;
};

const activateDown = () => {
  isUpActive.value = false;
  isDownActive.value = true;
};


const onSliderChange = (newValue) => {
  sliderValue.value = newValue;
};


const handleInput = () => {

}

const onChange = (val) => {
  active.value = val
  loading.value = true

  setTimeout(() => {
      loading.value = false;
  }, 1000);
}

</script>


<style lang="less">
    .open-position {
        padding: 0 0.3rem;
        padding-bottom: 0.76rem;
        background-color: white;
        .van-loading {
            left: 47%;
            margin-top: 2rem !important;
        }
        .position-header {
            display: flex;
            .up-botton {
                width: 1.32rem;
                height: 0.56rem;
                color: #014cfa;
                line-height: 0.56rem;
                text-align: center;
                position: relative;
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

        .fade-enter-active, .fade-leave-active {
            transition: opacity 0.5s;
        }
        .fade-enter-from, .fade-leave-to {
            opacity: 0;
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
            .stock-input-text {
                .van-field__control {
                    text-align: center;
                    caret-color: #014cfa;
                }
            }

            .num-input.enlarged {
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
                transition: all 0.3s ease;
            }
            .price-num-input {
              width: 4.9rem;
              height: 0.88rem;
              border-radius: 0.12rem;
              border: 0.02rem solid #D0D8E2;
              margin-top: 0.2rem;
              background: #f9fafb;
            }
            .pricenlarged {
              background: white;
            }
            .market-button {
              width: 1.9rem;
              height: 0.72rem;
              border-radius: 1.26rem;
              background: #F2F2F2;
              text-align: center;
              line-height: 0.72rem;
              color: #999;
              text-align: center;
              font-size: 0.28rem;
              font-style: normal;
              font-weight: 600;
              margin-left: 0.16rem;
              margin-top: 0.28rem;
              cursor: pointer;
            }
            .marketenlarged {
              background: #014cfa;
              color: white;
            }
            .num-right-text {
                .van-field__control {
                    text-align: right;
                }
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
                color: #333333;
            }
            .big-selcet {
                flex: 1;
                height: 0.88rem;
                border-radius: 0.12rem;
                border: 0.02rem solid #D0D8E2;
                line-height: 0.88rem;
                text-align: center;
                position: relative;
                color: #333333;
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
        .co-text {
            color: #333;
            text-align: center;
            font-size: 0.28rem;
            font-style: normal;
            font-weight: 400;
            line-height: 0.36rem;
        }
        .percentages {
          display: flex;
          justify-content: space-between;
          margin-top: 0.2rem;
          width: 100%;
          z-index: 7;
          .line {
            width: 0.06rem;
            height: 0.2rem;
            position: absolute;
            right: 0;
            top: -0.36rem;
            background: white;
            z-index: 88;
          }
        }

        .percentage {
          color: #8f92a1;
          font-size: 0.28rem;
          font-style: normal;
          font-weight: 400;
          text-align: center;
          width: 25%;
          position: relative;
        }
        .purchase-amount {
          margin-top: 0.2rem;
          color: #333;
          font-size: 0.32rem;
        }

    .van-slider {
      margin-top: 0.1rem;
      height: 0.16rem !important;
      border-radius: 0.02rem;
    }

    .van-slider__bar {
      position: relative;
    }

    .van-slider__button {
      width: 0.06rem;
      height: 0.48rem;
      background-color: #014cfa;
      border-radius: inherit;
      top: -0.36rem;
    }

    .van-slider__button-wrapper {
      z-index: 99999!important;
    }

    .stock-box {
      display: flex;
      justify-content: space-between;
      .stock-img {
        width: 0.4rem!important;
        height: 0.4rem!important;
      }
    }

  }
</style>