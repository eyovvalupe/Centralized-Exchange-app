<template>
  <div class="open-position">
    <div class="position-header">
      <div
        class="up-botton"
        :style="isUpActive ? activeBackgroundImageStyle : backgroundImageStyle"
        @click="activateUp"
      >
        买涨
      </div>
      <div
        class="down-button"
        :style="
          isDownActive
            ? activeBlueBackgroundImageStyle
            : blueBackgroundImageStyle
        "
        @click="activateDown"
      >
        买跌
      </div>

      <div class="position-tabs">
        <Tabs
          class="tabs"
          v-model:active="active"
          :swipeable="false"
          :color="'#014CFA'"
          shrink
          @change="onChange"
        >
          <Tab title="市价"> </Tab>
          <Tab title="限价"> </Tab>
          <Tab title="止盈/止损"> </Tab>
        </Tabs>
      </div>
    </div>

    <Loading v-if="loading"></Loading>

    <div class="position-box" v-if="!loading">
      <span class="grop-title" v-if="active === 1">价格</span>
      <Field
        v-model="priceValue"
        class="num-input num-right-text"
        style="margin-bottom: 0.2rem"
        type="number"
        v-if="active === 1"
      />

      <span class="grop-title" v-if="active === 2">止损</span>
      <Field
        v-model="loseValue"
        class="num-input num-right-text"
        style="margin-bottom: 0.2rem"
        v-if="active === 2"
      />

      <span class="grop-title" v-if="active === 2">价格</span>
      <div style="display: flex" v-if="active === 2">
        <Field
          v-model="marketValue"
          style="margin-bottom: 0.2rem"
          :class="['price-num-input',{pricenlarged:!marketprice}]"
          :disabled="!marketprice"
        />
        <div
          :class="['market-button', { marketenlarged: marketprice }]"
          @click="changePrice"
        >
         {{ marketprice?'限价':'市价'}}
        </div>
      </div>

      <div class="stock-box">
        <span class="grop-title">股票</span>
        <img
          src="/static/img/trade/blue-stock.png"
          class="stock-img"
          v-if="value.length > 0"
          @click="openPopup"
        />
        <img src="/static/img/trade/white-stock.png" class="stock-img" v-else />
      </div>

      <Field
        v-model="value"
        :class="[
          'num-input',
          'stock-input-text',
          { enlarged: value.length > 0 },
        ]"
        style="margin-bottom: 0.2rem"
        @input="handleInput"
      >
        <template #button v-if="value.length > 0 && stockCo.length > 0">
          <div class="co-text">
            <div>
              {{ stockCo[0].symbol }}
            </div>
            <div style="color: #9ea3ae">
              {{ stockCo[0].name }}
            </div>
          </div>
        </template>
      </Field>

      <span class="grop-title" style="color: #014cfa">全仓 VS 逐仓</span>
      <div style="display: flex; margin-top: 0.12rem; margin-bottom: 0.2rem">

        <div>
          <div class="small-select" @click="allSelect">
            <span style="margin-left: 0.2rem">{{ selectedOptionText }}</span>
            <img src="/static/img/trade/down.png" class="down-img"/>
          </div>

        </div>


        <div style="flex: 1;">
          <div class="big-selcet" @click="leverSelect" >
            {{ selectedLeverOptionText }}
            <img src="/static/img/trade/down.png" class="down-img"/>
          </div>
        </div>

        


      </div>
      <span class="grop-title">数量</span>
      <Field v-model="numValue" class="num-input num-right-text"  type="number" @change="inputChange"/>

      <div class="position-account">
        可买数量 <span style="color: #333">{{ roundedQuantity }}</span>
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
        <div>
          <span class="position-pay">支付 </span
          ><span class="pay-num">{{ amount }}</span>
        </div>
        <div class="position-line-dashed"></div>
        <div class="position-fee">保证金 {{ paymentAmount }} + 手续费 {{ openfee }}</div>
      </div>

      <Button
        size="large"
        color="#18b762"
        round
        v-if="isDownActive && token && active === 0"
        @click="openPositPopup('down')"
        :disabled="value.length === 0 || numValue.length === 0 || numValue === 0"
        >买跌</Button
      >
      <Button
        size="large"
        color="#18b762"
        round
        v-if="isDownActive && token && active === 1"
        @click="openPositPopup('down')"
        :disabled="value.length === 0 || numValue.length === 0 || numValue === 0 || priceValue === ''"
        >买跌</Button
      >

      <Button
        size="large"
        color="#18b762"
        round
        v-if="isDownActive && token && active === 2"
        @click="openPositPopup('down')"
        :disabled="value.length === 0 || numValue.length === 0 || numValue === 0 || loseValue === '' || (marketprice && marketValue == '')"
        >买跌</Button
      >



      <Button
        size="large"
        color="#e8503a"
        round
        v-if="isUpActive && token && active === 0"
        @click="openPositPopup('up')"
        :disabled="value.length === 0 || numValue.length === 0 || numValue === 0"
        >买涨</Button
      >


      <Button
        size="large"
        color="#e8503a"
        round
        v-if="isUpActive && token && active === 1"
        @click="openPositPopup('up')"
        :disabled="value.length === 0 || numValue.length === 0 || numValue === 0 || priceValue === ''"
        >买涨</Button
      >

      <Button
        size="large"
        color="#e8503a"
        round
        v-if="isUpActive && token && active === 2"
        @click="openPositPopup('up')"
        :disabled="value.length === 0 || numValue.length === 0 || numValue === 0 || loseValue === '' || (marketprice && marketValue == '')"
        >买涨</Button
      >

      <Button
        size="large"
        color="#014cfa"
        round
        v-if="!token"
        style="margin-bottom: 17px"
        @click="jump('login')"
        >登陆</Button
      >
      <Button
        size="large"
        color="#f2f2f2"
        round
        v-if="!token"
        style="color: #999999"
        @click="jump('register')"
        >注册</Button
      >
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { Tab,Tabs,Field,CellGroup,Slider,Button,Loading,Popup, showToast} from "vant";
import { _search, _stocksPara, _basic, _walletBalance, _commToken } from "@/api/api";
import { useRouter, useRoute } from "vue-router";
import OpenPositionPopup from "./OpenPositionPopup";
import OpenSelect from "./components/OpenSelect.vue";
import LeverSelect from "./components/LeverSelect.vue";
import StockPopup from './StockPopup.vue'
import store from "@/store";
import Decimal from 'decimal.js';

const token = computed(() => store.state.token);
const router = useRouter();

const backgroundImageStyle = computed(() => ({
  backgroundImage: `url(/static/img/trade/light-blue.png)`,
}));

const activeBackgroundImageStyle = computed(() => ({
  backgroundImage: `url(/static/img/trade/left-blue.png)`,
  color: "white",
}));

const activeBlueBackgroundImageStyle = computed(() => ({
  backgroundImage: `url(/static/img/trade/blue.png)`,
}));

const blueBackgroundImageStyle = computed(() => ({
  backgroundImage: `url(/static/img/trade/right-white.png)`,
  color: "#014cfa",
}));

const active = ref(0);
const value = ref("");
const priceValue = ref("");
const loseValue = ref("");
const marketValue = ref("");
const sliderValue = ref(0);
const loading = ref(false);
const percentages = [25, 50, 75, 100];
const stockCo = ref([]);
const showOpenPositionBottom = ref(false);
const showLeverSelect = ref(false)
const option1 = [
  { text: "全仓", value: 0 },
  { text: "逐仓", value: 1 },
];
const option2 = ref([]);
const roundedQuantity = ref(0)

//数量输入框的值
const minOrder = ref(0)
const numValue = ref(0)
const increment = ref(0)
const lastValidValue = ref(0); // 保存上一个有效值

const isUpActive = ref(true);
const isDownActive = ref(false);
const paymentAmount = ref(0)
const stockPrice = ref(0)
const amount = ref(0)

//手续费
const openfee = ref(0)
const closefee = ref(0)
const ofee = ref(0)
const cfee = ref(0)

const commToken = ref('')

//修改市价和限价
const marketprice = ref(false)


const selectedOptionText = computed(() => {
  const selected = option1.find(option => option.value === store.state.allSelect)
  return selected ? selected.text : ''
})

const selectedLeverOptionText = computed(() => {
  const selected = option2.value.find(option => option.value === store.state.selectedLeverOption)
  return selected ? selected.text : ''
})

const selectedLeverOption = computed(() => {
  return store.state.selectedLeverOption
})

// 监听 selectedLeverOption 的变化，并调用 getPay
watch(selectedLeverOption, (newValue, oldValue) => {
  getPay();
});

const activateUp = () => {
  isUpActive.value = true;
  isDownActive.value = false;
};

const activateDown = () => {
  isUpActive.value = false;
  isDownActive.value = true;
};

const onSliderChange = (newValue) => {
  //滚动滑动条
  sliderValue.value = newValue;
  getnumval(newValue)
};

const getnumval = (newValue)=>{
  //根据滑动条计算数量输入框中的值
  try {
    const percentage = new Decimal(newValue).div(100);
    const calculatedValue = percentage.mul(roundedQuantity.value);

    // 百位数取整
    const roundedValue = calculatedValue.div(100).floor().mul(100);
    numValue.value = roundedValue.toNumber();

    if (numValue.value  !== 0) {
      getPay()
    }

  } catch (error) {
    console.error('Error calculating value:', error);
  }
}

const getPay = ()=> {
  //保证金 数量*股票单价/杠杆
  const result = new Decimal(numValue.value)
      .mul(stockPrice.value)
      .div(selectedLeverOption.value)
      .toFixed(2); 
  paymentAmount.value = result
  //手续费计算
  //开仓手续费  数量*手续费
  openfee.value = new Decimal(numValue.value).mul(ofee.value).toFixed(2);
  //平仓手续费
  closefee.value = new Decimal(cfee.value).mul(numValue.value).toFixed(2);
  amount.value = new Decimal(numValue.value)
      .mul(stockPrice.value)
      .div(selectedLeverOption.value)
    .plus( new Decimal(numValue.value).mul(ofee.value))
    .toFixed(2); 
}

const handleInput = () => {
  //股票搜索
  getData();
};

const onChange = (val) => {
  active.value = val;
  store.commit('clearState')
  value.value = ''
  priceValue.value = ''
  loseValue.value = ''
  marketValue.value = ''
  clear()
  // loading.value = true;

  // setTimeout(() => {
  //   loading.value = false;
  // }, 1000);
};

const clear = ()=>{
  //输入框清空
  stockCo.value = [];
  roundedQuantity.value = 0
  sliderValue.value = 0
  numValue.value = minOrder.value
  paymentAmount.value = 0
  openfee.value = 0
  amount.value = 0
}

const getData = () => {
  //股票搜索
  if (value.value.length === 0) {
    //输入框清空
    clear()
    return;
  }
  _search({
    symbol: value.value,
  })
    .then((res) => {
      if (res.code == 200 && res.data) {
        stockCo.value = res.data;
        //获取股票价格
        getPrice(res.data[0])
      }
    })
    .catch((error) => {})
    .finally(() => {});
};

const getPrice = (val)=>{
  let price;
  let amount;
  //获取股票价格
  if (val.symbol) {
    // 发起 API 请求获取股票价格和钱包余额
    const getPrice = _basic({ symbol: val.symbol }).then(res => {
        if (res.code == 200) {
            console.log(res, 'res');
            price = new Decimal(100); // 假设股票价格为 100
            stockPrice.value = price
        }
    });

    const getBalance = _walletBalance({ currency: 'main' }).then(res => {
        if (res.code == 200) {
            amount = new Decimal(res.data[0].amount);
        }
    });
    
    // 计算可用数量
    Promise.all([getPrice, getBalance]).then(() => {
        if (price !== undefined && amount !== undefined) {
            const availableQuantity = amount.div(price);
            // 百位数取整
            roundedQuantity.value = availableQuantity.div(100).floor().mul(100);
            //数量输入框中的金额
            // getnumval(sliderValue.value)
            getslide()
            getPay()
        } else {
            console.error('获取价格或余额失败');
        }
    }).catch(error => {
        console.error('请求失败', error);
    });
  }
}

const getStockslist = ()=>{
  //交易参数
  _stocksPara({
  })
    .then((res) => {
      if (res.code == 200 && res.data) {
        //杠杆参数
        const str = res.data.lever;
        const lever = str.split(',')
        const levernum = lever.map((num, index) => {
          return {
            text: `${num}x`,
            value: `${num}`
          };
        });
        option2.value = levernum
        store.commit('setOption2',levernum)
        store.commit('selectedLeverOption',levernum[0].value)

        //volume 最低数量 和倍数增加的处理
        const volume = res.data.volume.split(',')
        minOrder.value = new Decimal(volume[0]);
        increment.value = new Decimal(volume[1]);
        numValue.value =  minOrder.value

        //手续费
        const fee = res.data.fee.split(',')
        ofee.value = new Decimal(fee[0]).plus(new Decimal(fee[2]))
        cfee.value = new Decimal(fee[1])

        //开仓手续费  数量*手续费
        openfee.value = new Decimal(numValue.value).mul(ofee.value).toFixed(2);
        //平仓手续费
        closefee.value = new Decimal(cfee.value).mul(numValue.value).toFixed(2);
      }
    })
    .catch((error) => {})
    .finally(() => {});

}


const getslide = ()=>{
  //滑动条值
  if (new Decimal(numValue.value)) {
    if (new Decimal(numValue.value).gt(roundedQuantity.value)) {
      sliderValue.value = 100
      return
    }
    if (roundedQuantity.value.div(new Decimal(numValue.value)).floor() == 1) {
      sliderValue.value = 100
    } else {
      sliderValue.value = new Decimal(numValue.value).div(roundedQuantity.value).mul(100).floor();
    }
  }
}


onMounted(() => {
  getStockslist()
});

const jump = (name) => {
  router.push({
    name,
  });
};

const openPositPopup = (val) => {
  const numValueDecimal = new Decimal(numValue.value);
  if (numValueDecimal.gt(roundedQuantity.value)) {
    showToast('超出最大可买');
    return
  }

  if (numValueDecimal.lt(minOrder.value)) {
    showToast('低于最小可买');
    return
  }

  if (!numValueDecimal.mod(increment.value).equals(0)) {
    showToast('当前值不是递增量的倍数');
    return
  }
  
  //存选择的数据
  const data = {
    'stockCo':stockCo.value,
    'selectedOptionText': selectedOptionText.value,
    'selectedLeverOptionText': selectedLeverOptionText.value,
    'selectedLeverOption': selectedLeverOption.value,
    'numValue':numValue.value,
    'paymentAmount': paymentAmount.value,
    'amount': amount.value,
    'openfee': openfee.value,
    'button':val,
    'active': active.value,
    'priceValue': priceValue.value,
    'marketValue': marketValue.value,
    'marketprice': marketprice.value,
    'loseValue': loseValue.value
  }
  store.commit('setUpOrder', data);
  //买涨按钮
  store.dispatch('openPopup',OpenPositionPopup)
  store.commit('setPopupHeight','90%')
  store.commit('setkeyborader',true)
  getcommToken()
};

const getcommToken = () =>{
  //点击按钮获取 token
  _commToken({ }).then(res => {
        if (res.code == 200) {
          commToken.value = res.data
          store.commit('setCommToken', commToken.value);
        }
    });
}

const allSelect = ()=>{
  store.dispatch('openPopup',OpenSelect)
  store.commit('setPopupHeight','30%')
  store.commit('setkeyborader',false)
}

const leverSelect = ()=>{
  // showLeverSelect.value = !showLeverSelect.value
  store.dispatch('openPopup',LeverSelect)
  store.commit('setPopupHeight','50%')
  store.commit('setkeyborader',false)
}

const inputChange = ()=>{
  if (numValue.value == '' || !numValue.value) {
    numValue.value = minOrder.value
  }
  getslide()
  getPay();
}

const changePrice = ()=>{
  marketprice.value = !marketprice.value
  marketValue.value = ''
}

const openPopup = ()=>{
  store.dispatch('openPopup',StockPopup)
  store.commit('setPopupHeight','80%')
  store.commit('setkeyborader',false)
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

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter-from,
  .fade-leave-to {
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
    .stock-input {
      width: 100%;
      height: 1.14rem;
      border-radius: 0.12rem;
      border: 0.02rem solid #d0d8e2;
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
      border: 0.02rem solid #d0d8e2;
      margin: 0.2rem 0;
    }

    .num-input {
      width: 100%;
      height: 0.88rem;
      border-radius: 0.12rem;
      border: 0.02rem solid #d0d8e2;
      margin-top: 0.2rem;
      transition: all 0.3s ease;
    }
    .price-num-input {
      width: 4.9rem;
      height: 0.88rem;
      border-radius: 0.12rem;
      border: 0.02rem solid #d0d8e2;
      margin-top: 0.2rem;
      background: white;
    }
    .pricenlarged {
      background: #f9fafb;
    }
    .market-button {
      width: 1.9rem;
      height: 0.72rem;
      border-radius: 1.26rem;
      background: #f2f2f2;
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
      border: 0.02rem solid #d0d8e2;
      margin-right: 0.24rem;
      line-height: 0.88rem;
      position: relative;
      color: #333333;
    }
    .select-box {
      .select-box-item {
        width: 1.48rem;
        height: 0.88rem;
        line-height: 0.88rem;
        margin-left: 0.2rem;
      }
      .bigslect {
        width: 100%;
        text-align: center;
        padding-right: 20px;
      }
      .selected-class {
        color: #1e5eff;
      }
    }

    .van-dropdown-menu__title:after {
      border-color: transparent transparent #333333 #333333;
    }
    .van-dropdown-menu__title {
      padding-left: 0;
    }
    .van-overlay {
      background-color: transparent;
    }
    .van-dropdown-item {
      z-index: 9999!important;
    }
    .big-selcet {
      width: 100%;
      height: 0.88rem;
      border-radius: 0.12rem;
      border: 0.02rem solid #d0d8e2;
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
      color: #014cfa;
      font-size: 0.28rem;
      font-style: normal;
      font-weight: 600;
      line-height: 0.48rem;
      vertical-align: middle;
    }
    .pay-num {
      color: #014cfa;
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
    background: #014cfa;
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
    z-index: 999 !important;
  }

  .stock-box {
    display: flex;
    justify-content: space-between;
    .stock-img {
      width: 0.4rem !important;
      height: 0.4rem !important;
    }
  }
}

.detail-popup {
  border-top-left-radius: 0.36rem;
  border-top-right-radius: 0.36rem;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding-bottom: 1.2rem;
}
.keypadding {
  padding-bottom: 5rem !important;
}

@media (min-width: 751px) {
  .detail-popup {
    max-width: 375px;
    position: fixed;
    padding-bottom: 3rem !important;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
