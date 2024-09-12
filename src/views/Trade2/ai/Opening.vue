<!-- ai量化交易 -->
<template>
    <div class="trade_ai">

        <!-- 涨跌 -->
        <div class="tabs" style="margin-bottom:0.6rem">
            <div class="tab" @click="tab = 1">
                <span :style="{ color: tab == 1 ? '#fff' : '#014cfa' }">看涨</span>
                <img v-if="tab == 1" src="/static/img/trade/ai_active_tab.png" alt="bg" />
                <img style="transform: rotate(180deg);" v-if="tab == 2" src="/static/img/trade/ai_tab.png" alt="bg" />
            </div>
            <div class="tab" @click="tab = 2">
                <span :style="{ color: tab == 2 ? '#fff' : '#014cfa' }">看跌</span>
                <img v-if="tab == 1" src="/static/img/trade/ai_tab.png" alt="bg" />
                <img style="transform: rotate(180deg);" v-if="tab == 2" src="/static/img/trade/ai_active_tab.png"
                    alt="bg" />
            </div>
        </div>


        <!-- 品种 -->
        <div class="curr">
            <div class="subtitle" style="color: #014CFA;" @click="showNavDialog">交易品种</div>
            <div class="ipt_box" style="margin-left:0.32rem" :class="{ 'error_border': !form1.name }">{{ form1.name }}
            </div>
            <div class="curr_icon">
                <img src="/static/img/trade/market_icon.png" alt="icon">
            </div>
        </div>

        <!-- 时间 -->
        <div class="subtitle">时间区域</div>
        <div class="times">
            <div class="time" @click="currTime = obj"
                :class="{ 'curr_time': currTime.time == obj.time && currTime.unit == obj.unit }"
                v-for="(obj, i) in times" :key="i">{{ obj.time }}{{ obj.unit }}
            </div>
        </div>

        <!-- 数量 -->
        <div class="item_content">
            <div class="subtitle">网格数量</div>
            <div class="item item_box select" :class="{ 'error_border': error1 }">
                <!-- <span>2000</span>
                <div class="select_more">
                    <img src="/static/img/assets/more.png" alt="more">
                </div> -->
                <span class="ipt_tip" v-show="!(form1.grid && !gridFocus)">最大网格 {{ maxgrid }}</span>
                <input @focus="gridFocus = true, error1 = false" @blur="gridFocus = false" type="number" class="ipt"
                    v-model="form1.grid" :min="1" :max="maxgrid" @change="changeGrid">
            </div>
        </div>

        <!-- 利润 -->
        <div class="item_content" style="margin-top: 0.32rem;">
            <div class="subtitle">每格利润</div>
            <div class="item item_box ipt_box">
                <span class="ipt">{{ getPercent() }}</span>
            </div>
        </div>

        <!-- 投资额 -->
        <div class="subtitle" style="margin-top: 0.32rem;">
            <span>投资额</span>
            <span class="link">账户划转</span>
        </div>
        <div class="item item_box" style="margin-top: 0" :class="{ 'error_border': error2 }">
            <span class="ipt_tip" v-show="!(form1.volume !== '' && !amountFocus)">余额 {{ usdt.amount }}</span>
            <input @focus="amountFocus = true, error2 = false" @blur="amountFocus = false" type="number"
                v-model="form1.volume" class="ipt" @change="changePercent">
        </div>

        <!-- 拖动 -->
        <div class="slider-container" style="margin-top: 0.4rem">
            <Slider v-model="sliderValue" bar-height="0.08rem" active-color="#014cfa" inactive-color="#f2f2f2"
                @change="onSliderChange">
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
        <div style="margin-top: 0.6rem">
            <Button :loading="loading || submitLoading" @click="checkForm" v-if="token" size="large" class="submit"
                :color="tab == 1 ? '#18b762' : '#e8503a'" round>{{
                    tab == 1 ?
                        '买涨' : '买跌' }}</Button>

            <Button size="large" color="#014cfa" class="submit" round v-if="!token" style="margin-bottom: 0.34rem"
                @click="jump('login')">登录</Button>
            <Button size="large" color="#f2f2f2" round v-if="!token" style="color: #999999"
                @click="jump('register')">注册</Button>
        </div>



        <!-- 开仓确认弹窗 -->
        <Popup teleport="body" v-model:show="showModel" position="bottom" round closeable>
            <div class="stock_submit_box">
                <div class="title">开仓确认</div>
                <div class="item">
                    <div class="item_name">时间区域</div>
                    <div class="item_val">
                        <div class="tag">{{ currTime.time }}{{ currTime.unit }}</div>
                    </div>
                </div>
                <div class="item">
                    <div class="item_name">网格数量</div>
                    <div class="item_val">
                        <div class="tag">{{ form1.grid }}</div>
                    </div>
                </div>
                <div class="item">
                    <div class="item_name">投资额</div>
                    <div class="item_val">
                        <div class="tag">{{ form1.volume }}</div>
                        <span style="margin-left: 0.32rem;">USDT</span>
                    </div>
                </div>
                <div class="item">
                    <div class="item_name">预期盈亏金额</div>
                    <div class="item_val">
                        <div class="tag">{{ getRange() }}</div>
                        <span style="margin-left: 0.32rem;">USDT</span>
                    </div>
                </div>


                <!-- <div class="subtitle" style="margin-top: 0.6rem;">请输入交易密码</div>
                <div class="item pass_ipt">
                    <input v-model="safePass" type="password" class="ipt">
                </div> -->
                <Button @click="submitFormDialog" size="large" class="submit" color="#014cfa" round>开仓</Button>
            </div>
        </Popup>

        <!-- ai订单详情 -->
        <AiInfo ref="AiInfoRef" />
        <!-- 开仓-安全密码弹窗 -->
        <SafePassword @submit="submitForm" ref="safeRef" :key="'open'"></SafePassword>
    </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { Slider, Button, Popup, showToast } from "vant"
import Decimal from 'decimal.js';
import store from "@/store"
import router from "@/router"
import AiInfo from "../components/AiInfo.vue"
import { useRoute } from "vue-router"
import { _aipara, _aibuy } from "@/api/api"
import SafePassword from "@/components/SafePassword.vue"

const route = useRoute()
const wallet = computed(() => store.state.wallet || [])
const usdt = computed(() => wallet.value.find(item => item.currency == 'USDT') || {})

const emits = defineEmits(['showNavDialog'])
const showNavDialog = () => {
    emits('showNavDialog', 'ai')
}

const safeRef = ref()

const AiInfoRef = ref()
const openInfo = () => {
    showModel.value = false
    AiInfoRef.value.open()
}
const token = computed(() => store.state.token)

const tab = ref(1) // 1-看涨 2-看跌
const showModel = ref(false)



// 表单
const amountFocus = ref(false)
const gridFocus = ref(false)
const form1 = ref({
    name: route.query.name || '',
    symbol: route.query.symbol || '',
    grid: '',
    volume: ''
})
const safePass = ref('')
const changeGrid = () => {
    setTimeout(() => {
        form1.value.grid = parseInt(form1.value.grid)
        if (form1.value.grid > maxgrid.value) {
            form1.value.grid = maxgrid.value
        }
        if (form1.value.grid <= 1) {
            form1.value.grid = 1
        }
    }, 0)
}

// 拖动
const percentages = [25, 50, 75, 100];
const sliderValue = ref(0);
const maxStockNum = computed(() => usdt.value.amount)
const step = computed(() => 1)
const onSliderChange = (newValue) => {
    sliderValue.value = newValue;
    if (maxStockNum.value == '--') return sliderValue.value = 0
    let v = new Decimal(maxStockNum.value).mul(newValue).div(100)
    v = v.sub(v.mod(step.value))
    form1.value.volume = v.toNumber()
    setTimeout(() => {
        changePercent()
    }, 0)
};
const changePercent = () => {
    if (maxStockNum.value == '--' || !form1.value.volume) return sliderValue.value = 0
    let v = new Decimal(form1.value.volume)
    form1.value.volume = v.sub(v.mod(step.value))
    let p = new Decimal(form1.value.volume).div(maxStockNum.value).mul(100).toNumber()
    if (p < 0) p = 0
    if (p > 100) p = 100
    sliderValue.value = Number(p)
}

// 开仓
const error1 = ref(false)
const error2 = ref(false)
const checkForm = () => {
    if (!form1.value.symbol) return showToast('请选择品种')
    if (!form1.value.grid) {
        error1.value = true
        showToast('请输入网格数量')
        return
    }
    if (!form1.value.volume || form1.value.volume < 0) {
        error2.value = true
        showToast('请输入投资额')
        return
    }
    showModel.value = true
}
const submitFormDialog = () => {
    showModel.value = false
    safeRef.value && safeRef.value.open()
}
const submitLoading = ref(false)
const submitForm = (s) => {
    if (submitLoading.value) return
    submitLoading.value = true
    _aibuy({
        symbol: form1.value.symbol,
        offset: tab.value == 1 ? 'long' : 'short',
        time: currTime.value.time,
        unit: currTime.value.unit,
        lever: form1.value.grid,
        amount: form1.value.volume,
        token: sessionToken.value,
        safeword: s,
    }).then(res => {
        if (res && res.code == 200) {
            showModel.value = false
            store.dispatch('updateWallet')
            showToast('开仓成功')
            form1.value.volume = ''
            form1.value.grid = ''
            sliderValue.value = 0
        }
    }).finally(() => {
        getSessionToken()
        setTimeout(() => {
            submitLoading.value = false
        }, 500);
    })
}


// 交易参数
const loading = ref(false)
const minamount = ref(0) // 最小投资额
const maxgrid = ref(0) // 最大网格
const currTime = ref({}) // 当前时间选项
const getPercent = () => { // 获取利润展示文案
    if (!currTime.value.rangereturn) return '--'
    const rangereturn = currTime.value.rangereturn
    let rs = '--'
    try {
        const arr = rangereturn.split(' - ')
        rs = `${arr[0]}% - ${arr[1]}%`
    } catch { }

    return rs
}
const getRange = () => { // 获取预计盈亏
    if (!currTime.value.rangereturn) return '--'
    if (!form1.value.volume) return '--'
    const rangereturn = currTime.value.rangereturn
    let rs = '--'
    try {
        const arr = rangereturn.split(' - ')
        const start = new Decimal(form1.value.volume).mul(Number(arr[0])).div(100)
        const end = new Decimal(form1.value.volume).mul(Number(arr[1])).div(100)
        rs = `${start} - ${end}`
    } catch { }

    return rs
}
const times = ref([]) // 时间选项
const getParams = () => {
    if (!form1.value.symbol) return
    loading.value = true
    _aipara({
        symbol: form1.value.symbol
    }).then(res => {
        if (!res.data) return
        minamount.value = res.data.minamount
        maxgrid.value = res.data.maxgrid
        times.value = res.data.list || []
        if (times.value[0]) {
            currTime.value = times.value[0]
        }
    }).finally(() => {
        loading.value = false
    })
}
getParams()


// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    store.dispatch("updateSessionToken")
}
getSessionToken()



// 跳转
const jump = (name) => {
    router.push({
        name
    })
}
</script>

<style lang="less" scoped>
.trade_ai {
    padding: 0.32rem 0.32rem 3rem 0.32rem;

    .tabs {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .tab {
            flex: 1;
            height: 0.72rem;
            position: relative;

            span {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translateX(-50%) translateY(-50%);
                z-index: 9;
            }
        }
    }

    .subtitle {
        height: 0.88rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .link {
            color: #014CFA;
        }
    }

    .curr {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.32rem;

        .ipt_box {
            flex: 1;
            height: 0.88rem;
            border-radius: 0.12rem;
            border: 1px solid #E5E5E5;
            background-color: #F5F5F5;
            color: #014CFA;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .curr_icon {
            width: 0.88rem;
            height: 0.88rem;
            padding: 0.2rem;
        }
    }

    .times {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;

        .time {
            background-color: #F7F7F7;
            border-radius: 0.1rem;
            height: 0.64rem;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 22%;
            margin-bottom: 0.32rem;
            margin-right: 4%;

            &:nth-child(4n) {
                margin-right: 0;
            }
        }

        .curr_time {
            background-color: #EEF3FF;
            color: #014CFA;
        }
    }

    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;

        &:has(.ipt:focus) {
            padding-top: 0.204rem;

            .ipt_tip {
                top: 0.2rem;
                left: 0.32rem;
                font-size: 0.2rem;
            }
        }

        .ipt_tip {
            color: #b7b7b7;
            font-size: 0.24rem;
            position: absolute;
            left: 0.24rem;
            transition: all ease .3s;
            pointer-events: none;
        }

        .select {
            height: 0.88rem;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-left: 0.32rem;
            padding: 0 0.32rem;
            border: 1px solid #D0D8E2;
            border-radius: 0.12rem;

            .select_more {
                width: 0.32rem;
                height: 0.32rem;
                margin-left: 1rem;
            }
        }

        .ipt_box {
            height: 0.88rem;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-left: 0.32rem;
            padding: 0 0.32rem;
            border: 1px solid #e5e5e5;
            border-radius: 0.12rem;
            background-color: #F5F5F5;
            padding-right: 1rem;

        }
    }

    .item_box {
        border: 1px solid #D0D8E2;
        border-radius: 0.12rem;

        .ipt {
            width: 100%;
            height: 0.88rem;
            text-align: left;
            padding: 0 0.32rem;
            display: flex;
            align-items: center;
            justify-content: flex-start;

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

    .error_border {
        border: 1px solid #e8503a !important;
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
        font-weight: bold;
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

    .submit {
        margin-top: 0.6rem;
    }
}
</style>