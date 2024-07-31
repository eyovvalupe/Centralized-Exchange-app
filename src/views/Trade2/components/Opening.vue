<!-- 开仓 -->
<template>
    <div class="opening">

        <!-- Tabs -->
        <div class="open_tab_box">
            <div class="type_tabs">
                <div @click="activeType = 1" class="type_tab" :class="{ 'active_type_tab': activeType == 1 }"
                    :style="{ backgroundImage: `url('/static/img/trade/${activeType == 1 ? 'left-blue' : 'light-blue'}.svg')` }">
                    买涨</div>
                <div @click="activeType = 2" class="type_tab" :class="{ 'active_type_tab': activeType == 2 }"
                    :style="{ backgroundImage: `url('/static/img/trade/${activeType == 2 ? 'blue' : 'right-white'}.svg')` }">
                    买跌</div>
            </div>

            <Tabs key="form" v-if="!pageLoading" class="tabs" v-model="activeTab" :swipeable="false" animated
                :color="'#014CFA'" shrink>
                <Tab title="市价" name="0">
                    <div class="form">
                        <div class="subtitle">
                            <span>股票</span>
                            <Loading v-show="searchLoading" type="spinner" style="width:0.28rem;height:0.28rem"
                                color="#034cfa" />
                            <div class="stock_icon" v-show="!searchLoading && currStock.symbol">
                                <img src="/static/img/trade/blue-stock.png" />
                            </div>
                        </div>
                        <!-- 搜索 -->
                        <div class="item_box">
                            <div class="item"
                                :class="{ 'item_focus': searchFocus || (searchStr && !currStock.symbol) }">
                                <span class="ipt_tip" v-show="!(currStock.symbol && !searchFocus)">股票代码</span>
                                <input :style="{ 'opacity': (currStock.symbol && !searchFocus) ? '0' : '1' }"
                                    @focus="searchFocus = true, searchStr = currStock.symbol || searchStr"
                                    @blur="searchFocus = false" v-model.trim="searchStr" @keyup="inputSearch"
                                    class="ipt" type="text">
                                <div class="base_ipt" v-show="currStock.symbol && searchFocus">{{ currStock.symbol }}
                                </div>

                                <div class="info" v-show="currStock.symbol && !searchFocus">
                                    <div>{{ currStock.symbol }}</div>
                                    <div style="color: #9ea3ae;">{{ currStock.name }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- 数量 -->
                        <div class="item_box">
                            <div class="item_box_left" @click="showTypeDialog = true">
                                <div class="subtitle"><span style="color: #014CFA;">全仓 VS 逐仓</span></div>
                                <div class="item" style="justify-content: center;">
                                    <span>{{ modeMap[form1.leverType] || '--' }}</span>
                                    <div class="more_icon">
                                        <img src="/static/img/trade/down.png" alt="↓">
                                    </div>
                                </div>
                            </div>

                            <div class="item_box_right">
                                <div class="subtitle">
                                    <span>数量</span>
                                    <div style="color: #014CFA;display: flex;align-items: center;">
                                        <span>账户划转</span>
                                        <span style="margin-left: 0.24rem;">借贷</span>
                                    </div>
                                </div>
                                <div class="item" :class="{ 'item_focus': amountFocus }">
                                    <span class="ipt_tip" v-show="form1.volume === '' || amountFocus">最大可{{ activeType
                                        ==
                                        1 ? '买' : '卖' }} {{ maxStockNum == '--' ? '0' : maxStockNum }}
                                        <span v-show="min">&nbsp;&nbsp;&nbsp;最少{{ activeType
                                            ==
                                            1 ? '购买' : '出售' }} {{ min }}</span>
                                    </span>
                                    <input v-model="form1.volume" @focus="amountFocus = true"
                                        @blur="amountFocus = false" @change="changePercent" type="number" class="ipt">
                                </div>
                            </div>
                        </div>

                        <!-- 拖动 -->
                        <div class="slider-container">
                            <Slider v-model="sliderValue" bar-height="0.08rem" active-color="#014cfa"
                                inactive-color="#f2f2f2" @change="onSliderChange">
                                <template #button>
                                    <div class="slider-custom-num">
                                        <span class="number" v-show="sliderValue">{{ sliderValue }}%</span>
                                    </div>
                                </template>
                            </Slider>
                        </div>
                        <div class="percentages">
                            <div v-for="percent in percentages" :key="percent" class="percentage">
                                <div class="line"></div>
                                {{ percent }}%
                            </div>
                        </div>

                        <!-- 按钮 -->
                        <Button :loading="configLoading" size="large" @click="submit1" class="submit"
                            :color="activeType == 1 ? '#18b762' : '#e8503a'" round>{{
                                activeType == 1 ?
                                    '买涨' : '买跌' }}</Button>
                    </div>
                </Tab>
                <Tab title="限价" name="1">
                    限价
                </Tab>
                <Tab title="止盈/止损" name="2">
                    止盈/止损
                </Tab>
            </Tabs>
        </div>


        <!-- 仓位模式选择 -->
        <ActionSheet teleport="body" v-model:show="showTypeDialog" :actions="modeList" @select="onSelectForm1Type"
            title="保证金模式">
        </ActionSheet>

        <!-- 开仓确认弹窗 -->
        <Popup teleport="body" v-model:show="showModel" position="bottom" round closeable>
            <div class="stock_submit_box">
                <div class="title">开仓确认</div>
                <div class="item">
                    <div class="item_name">股票</div>
                    <div class="item_val">
                        <div style="line-height: 0.32rem;">
                            <div style="text-align: right">{{ currStock.symbol }}</div>
                            <div style="color: #9ea3ae;">{{ currStock.name }}</div>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class="item_name">开仓</div>
                    <div class="item_val">
                        <div class="tag" :class="activeType == 1 ? 'red_tag' : 'green_tag'">{{ activeType == 1 ? '买涨' :
                            '买跌' }}
                        </div>
                        <div class="tag">{{ modeMap[params.lever_type] }}</div>
                        <div class="lever">{{ params.lever || 1 }}X</div>
                    </div>
                </div>
                <div class="item">
                    <div class="item_name">价格</div>
                    <div class="item_val">
                        <div class="tag">{{ params.price_type == 'market' ? '市价' : '限价' }}</div>
                    </div>
                </div>
                <div class="item">
                    <div class="item_name">开仓数量</div>
                    <div class="item_val">{{ params.volume }}</div>
                </div>
                <div class="item">
                    <div class="item_name">止盈/止损</div>
                    <div class="item_val">
                        <div class="tag">无</div>
                    </div>
                </div>

                <div class="money_box">
                    <div class="amount">支付 {{ payAmount }}</div>
                    <div class="fee">保证金 {{ payOrigin }} + 手续费 {{ payFee }}</div>
                </div>

                <div class="subtitle">请输入交易密码</div>
                <div class="item pass_ipt">
                    <input v-model="safePass" type="password" class="ipt">
                </div>
                <Button :loading="submitLoading" @click="submitForm" size="large" class="submit" color="#014cfa"
                    round>开仓</Button>
            </div>
        </Popup>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { Tab, Tabs, Loading, ActionSheet, Slider, Button, showToast, Popup } from "vant";
import { _search, _basic, _stocksPara, _stocksBuy } from "@/api/api"
import store from "@/store";
import Decimal from 'decimal.js';
import { useRoute } from "vue-router"

const route = useRoute()


const wallet = computed(() => store.state.wallet || [])
const stockWalletAmount = computed(() => { // 股票账户余额
    const target = wallet.value.find(item => item.currency == 'stock')
    if (target) return target.amount
    return 0
})
const maxStockNum = computed(() => { // 最大可买 可卖
    if (currStock.value.price) {
        return new Decimal(stockWalletAmount.value).div(currStock.value.price).floor()
    }
    return '--'

})


// 仓位类型
const modeMap = ref({
    'cross': '全仓',
    'isolated': '逐仓'
})
const modeList = computed(() => {
    const list = []
    for (let key in modeMap.value) {
        list.push({ name: modeMap.value[key], value: key, className: form1.value.leverType == key ? 'action-sheet-active' : '', icon: form1.value.leverType == key ? 'success' : '' },)
    }
    return list
})

const activeType = ref(1) // 1-买涨 2-买跌
const activeTab = ref(0) // 0-市价 1-限价 2-止盈止损
const pageLoading = ref(true)
onMounted(() => {
    setTimeout(() => {
        pageLoading.value = false
    }, 200)
})


// 市价
const currStock = ref({}) // 当前股票
const form1 = ref({
    leverType: 'cross',
    volume: ''
})
const submit1 = () => {
    if (!currStock.value.symbol) return showToast('请输入股票代码')
    if (!form1.value.volume || form1.value.volume < min.value) return showToast(`最小交易量：${min.value}`)
    console.error('提交')
    // 打开确认弹窗
    params.value = {
        symbol: currStock.value.symbol,
        offset: activeType.value == 1 ? 'long' : 'short',
        volume: form1.value.volume,
        lever_type: form1.value.leverType,
        // lever: '',
        price_type: 'market',
        // price: '',
        // stop_profit_price: '',
        // stop_loss_type: '',
        // stop_loss_price: '',

    }
    safePass.value = ''
    showModel.value = true
}
const amountFocus = ref(false)
// 市价-类型
const showTypeDialog = ref(false)
const onSelectForm1Type = (item) => {
    showTypeDialog.value = false
    form1.value.leverType = item.value
}
// 市价-拖动
const percentages = [25, 50, 75, 100];
const sliderValue = ref(0);
const onSliderChange = (newValue) => {
    sliderValue.value = newValue;
    if (maxStockNum.value == '--') return sliderValue.value = 0
    let v = new Decimal(maxStockNum.value).mul(newValue).div(100).floor()
    v = v.sub(v.mod(step.value))
    form1.value.volume = v
    setTimeout(() => {
        changePercent()
    }, 0)
};
const changePercent = () => {
    if (maxStockNum.value == '--' || !form1.value.volume) return sliderValue.value = 0
    let v = new Decimal(form1.value.volume)
    form1.value.volume = v.sub(v.mod(step.value))
    let p = new Decimal(form1.value.volume).div(maxStockNum.value).mul(100).floor()
    if (p < 0) p = 0
    if (p > 100) p = 100
    sliderValue.value = Number(p)
}
// 市价-搜索
const searchLoading = ref(false)
const searchFocus = ref(false)
const searchStr = ref('')
let searchTimeout = null
const inputSearch = () => {
    searchStr.value = searchStr.value.toUpperCase()
    currStock.value = {}
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        if (searchStr.value == '') {
            currStock.value = {}
            return
        }
        goSearch()
    }, 600)
}
const goSearch = () => {
    searchLoading.value = true
    const s = searchStr.value
    _search({
        symbol: s,
        mode: 'right'
    }).then(res => {
        if (s != searchStr.value) return
        if (res && res.data && res.data[0]) {
            currStock.value = res.data[0]
            _basic({ symbol: currStock.value.symbol }).then(r => {
                if (r && r.data && r.data.symbol) {
                    currStock.value = {
                        ...currStock.value,
                        ...r.data
                    }
                }
            })
        } else {
            currStock.value = {}
        }
    }).finally(() => {
        searchLoading.value = false
    })
}
// url参数处理
if (route.query.symbol) {
    searchStr.value = route.query.symbol
    activeType.value = route.query.type || 1
    goSearch()
}


// 下单限制的参数
const min = ref(0) // 最小购买
const step = ref(1) // 步长
const openFee = ref(0) // 开仓手续费
const closeFee = ref(0) // 平仓手续费
const flowerFee = ref(0) // 印花税
const configLoading = ref(false)
const getParam = () => {
    configLoading.value = true
    _stocksPara().then(res => {
        if (res && res.data) {
            if (res.data.volume) {
                const arr = res.data.volume.split(',')
                min.value = arr[0] || 0
                step.value = arr[1] || 1
            }
            if (res.data.fee) {
                const arr = res.data.fee.split(',')
                openFee.value = arr[0] || 0
                closeFee.value = arr[1] || 0
                flowerFee.value = arr[2] || 0
            }
        }

    }).finally(() => {
        configLoading.value = false
    })
}
getParam()



// 开仓
const params = ref({})
const showModel = ref(false)
const safePass = ref('')
const payAmount = computed(() => { // 需要支付
    return new Decimal(payOrigin.value).add(payFee.value)
})
const payOrigin = computed(() => { // 保证金
    if (!params.value.volume || !currStock.value.price) return 0
    return new Decimal(params.value.volume).mul(currStock.value.price)
})
const payFee = computed(() => { // 手续费
    return new Decimal(payOrigin.value).mul(openFee.value)
})
const submitLoading = ref(false)
const submitForm = () => {
    if (submitLoading.value) return
    submitLoading.value = true
    _stocksBuy({
        ...params.value,
        token: sessionToken.value,
        safeword: safePass.value,
    }).then(res => {
        if (res && res.code == 200) {
            showModel.value = false
            store.dispatch('updateWallet')
            showToast('开仓成功')
            form1.value.volume = ''
            sliderValue.value = 0
        }
    }).finally(() => {
        setTimeout(() => {
            submitLoading.value = false
        }, 500);
    })
}


// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    store.dispatch("updateSessionToken")
}
getSessionToken()
</script>

<style lang="less" scoped>
.opening {
    padding: 0.32rem 0;

    .open_tab_box {
        position: relative;
        display: flex;
        align-items: flex-start;

        .type_tabs {
            position: absolute;
            left: 0.32rem;
            display: flex;
            align-items: center;
            z-index: 99;

            .type_tab {
                width: 1.2rem;
                height: 0.6rem;
                background-size: 100% 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #034cfa;
                font-size: 0.28rem;
            }

            .active_type_tab {
                color: #fff;
            }
        }

        .tabs {
            width: 100%;
        }

        :deep(.van-tabs__wrap) {
            height: 0.6rem !important;
        }

        :deep(.van-tabs__nav) {
            padding-left: 3rem !important;

            &::after {
                width: calc(100% - 3.32rem) !important;
                left: 3rem !important;
            }
        }
    }

    .form {
        padding: 0.4rem 0.32rem 1.6rem 0.32rem;

        .subtitle {
            color: #333;
            font-size: 0.28rem;
            margin-bottom: 0.1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .stock_icon {
                width: 0.36rem;
                height: 0.36rem;
            }
        }

        .item_box {
            display: flex;
            align-items: stretch;
            margin-bottom: 0.5rem;

            .item {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: relative;
                height: 0.88rem;
                border-radius: 0.12rem;
                border: 1px solid #d0d8e2;
                padding: 0 0.24rem;

                .info {
                    flex: 1;
                    text-align: right;
                    margin-left: 0.2rem;
                    font-size: 0.28rem;
                    font-weight: 400;
                    color: #333;
                    position: absolute;
                    right: 0.24rem;
                    pointer-events: none;
                }

                .ipt_tip {
                    color: #b7b7b7;
                    font-size: 0.24rem;
                    position: absolute;
                    left: 0.24rem;
                    transition: all ease .3s;
                }

                .ipt {
                    flex: 1;
                    height: 100%;
                    width: 2rem;
                    font-size: 0.28rem;
                    padding: 0;
                    color: #034cfa;
                    position: relative;
                    z-index: 1;
                }

                .base_ipt {
                    font-size: 0.28rem;
                    color: #b7b7b7;
                    position: absolute;
                    left: 0.24rem;
                    z-index: 0;
                }

                .more_icon {
                    width: 0.32rem;
                    height: 0.32rem;
                    margin-left: 0.08rem;
                }
            }

            .item_focus {
                height: 1.12rem;
                padding-top: 0.2rem;
                border: 1px solid #034cfa;

                .ipt_tip {
                    font-size: 0.2rem;
                    transform: translateY(-0.36rem);
                }
            }

            .item_box_left {
                width: 1.8rem;
                margin-right: 0.2rem;
                display: flex;
                flex-direction: column;
            }

            .item_box_right {
                flex: 1;
            }
        }

        .submit {
            margin-top: 1rem;
        }
    }

    .slider-container {
        margin: 0 auto;
        width: 100%;
        height: 0.8rem;
        padding: 0.2rem 0 0 0;

        :deep(.slider-custom-num) {
            position: relative;
            background: #014CFA;
            color: #fff;
            display: inline-block;
            width: .1rem;
            height: .5rem;
            font-size: 12px;
            text-align: center;
            line-height: .4rem;
            border-radius: 10px;

            .number {
                color: #014CFA;
                position: absolute;
                top: -0.4rem;
                left: -0.1rem;
                font-size: .2rem;
            }
        }

        :deep(.van-slider) {
            margin-top: 0.1rem;
            height: 0.16rem !important;
            border-radius: 0.02rem;
            padding-right: 0.1rem;
        }

        :deep(.van-slider__bar) {
            position: relative;
        }

        :deep(.van-slider__button) {
            width: 0.1rem;
            height: 0.48rem;
            background-color: #014cfa;
            border-radius: inherit;
            top: -0.36rem;
        }

        :deep(.van-slider__button-wrapper) {
            z-index: 999 !important;
            padding: 0.24rem;
        }



    }

    .percentages {
        display: flex;
        justify-content: space-between;
        width: 100%;
        z-index: 7;

        .percentage {
            color: #8f92a1;
            font-size: 0.28rem;
            font-style: normal;
            font-weight: 400;
            text-align: center;
            width: 25%;
            position: relative;
        }

        .line {
            width: 0.06rem;
            height: 0.2rem;
            position: absolute;
            right: 0;
            top: -0.5rem;
            background: #fff;
            z-index: 88;
        }
    }
}
</style>

<style lang="less">
.stock_submit_box {
    padding: 0.32rem 0.32rem 1rem 0.32rem;

    .title {
        font-size: 0.32rem;
        line-height: 0.6rem;
        text-align: center;
        margin-bottom: 0.2rem;
    }

    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.2rem 0;
        border-bottom: 1px solid #f5f5f5;

        .item_name {
            color: #8F92A1;
            font-size: 0.28rem;
            font-weight: 400;
        }

        .item_val {
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
                margin-left: 0.2rem
            }

            .red_tag {
                background-color: #fbf1ef;
                color: #e8503a;
            }

            .green_tag {
                background-color: #eff9f2;
                color: #18b762;
            }

            .lever {
                width: 2rem;
                text-align: right;
            }
        }
    }

    .subtitle {
        font-size: 0.24rem;
        margin-bottom: 0.2rem;
        color: #121826;
        font-weight: 400;
    }

    .pass_ipt {
        margin-bottom: 0.4rem;
        border-radius: 0.12rem;
        border: 1px solid #d0d8e2;
        padding: 0 0.24rem;

        .ipt {
            height: 0.8rem;
        }
    }

    .money_box {
        margin: 0.5rem 0;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;

        .amount {
            color: #014cfa;
            font-size: 0.36rem;
            font-weight: 600;
            line-height: 0.56rem;
        }

        .fee {
            color: #333;
            font-size: 0.24rem;
            font-weight: 400;
            line-height: 0.36rem;
            border-top: 1px dashed #cbcbcb;
            padding: 0.1rem 0 0 0.2rem;
        }
    }
}
</style>