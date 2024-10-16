<!-- ai量化交易 -->
<template>
    <div class="trade_ai">

        <!-- 涨跌 -->
        <Tabs type="custom-card" v-model:active="tab" :swipeable="false" animated :color="'#014CFA'">
            <Tab title="看涨" :name="1">
            </Tab>
            <Tab title="看跌" :name="2">
            </Tab>
        </Tabs>


        <!-- 品种 -->
        <div class="item_content">
            <div class="subtitle">
                交易品种
                <div class="stock_icon" v-if="form1.name" @click="openStockModel">
                    <img src="/static/img/trade/blue-stock.png" alt="icon">
                </div>
            </div>

            <div class="item item_box ipt_box" @click="showNavDialog">
                 {{ form1.name }}
            </div>
            
        </div>

        <!-- 时间 -->
        <div class="item_content">
            <div class="subtitle">时间区域</div>
            <div class="times">
                <div class="time" @click="currTime = obj"
                    :class="{ 'curr_time': currTime.time == obj.time && currTime.unit == obj.unit }"
                    v-for="(obj, i) in times" :key="i">{{ obj.time }}{{ _dateUnitMap[obj.unit] }}
                </div>
            </div>
        </div>
        <!-- 数量 -->
        <div class="item_content">
            <div class="subtitle">网格数量</div>
            <div class="item item_box" :class="{ 'error_border': error1 }">
                <span class="ipt_tip" v-show="!(form1.grid && !gridFocus)">最大网格 {{ maxgrid }}</span>
                <input @focus="gridFocus = true, error1 = false" @blur="gridFocus = false" type="number" class="ipt"
                    v-model="form1.grid" :min="1" :max="maxgrid" @change="changeGrid">
            </div>
        </div>

        <!-- 利润 -->
        <div class="item_content">
            <div class="subtitle">每格利润</div>
            <div class="item item_box ipt_box">
                <span class="ipt">{{ getPercent() }}</span>
            </div>
        </div>

        <!-- 投资额 -->
        <div class="item_content">
            <div class="subtitle">
                <span>投资额</span>
                <span style="color:#666D80;" v-show="!(form1.volume !== '' && !amountFocus)">≤ {{ usdt.amount }}</span>
            </div>
            <div class="item item_box" style="margin-top: 0" :class="{ 'error_border': error2 }">
                <input @focus="amountFocus = true, error2 = false" @blur="amountFocus = false" type="number"
                    v-model="form1.volume" class="ipt" @change="changePercent">
            </div>
        </div>

        <div style="height:0.47rem;"></div>
        <!-- 拖动 -->
        <SlideContainer v-model="sliderValue" @change="onSliderChange" />

        <!-- 按钮 -->
        <div style="margin-top: 0.6rem">
            <Button :loading="loading || submitLoading"  @click="checkForm" v-if="token" size="large" class="submit"
                :color="tab == 1 ? '#18b762' : '#e8503a'" round>{{
                    tab == 1 ?
                        '买涨' : '买跌' }}</Button>

            <Button size="large" color="#014cfa" class="submit" round v-if="!token" style="margin-bottom: 0.34rem"
                @click="goLogin">登录</Button>
            <Button size="large" color="#f2f2f2" round v-if="!token" style="color: #999999"
                @click="jump('register')">注册</Button>
        </div>


        <!-- 开仓确认弹窗 -->
        <Popup teleport="body" v-model:show="showModel" position="bottom" round closeable>
             <div class="van-popup-custom-title">开仓确认</div>
            <div class="stock_submit_box">
                <div class="item">
                    <div class="item_name">时间区域</div>
                    <div class="item_val">
                        <div class="tag">{{ currTime.time }}{{ _dateUnitMap[currTime.unit] }}</div>
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


        <!-- 股票行情弹窗 -->
        <Popup teleport="body" v-model:show="showStockModel" position="bottom" round closeable>
            <StockPopup type="ai" style="height:90vh" />
        </Popup>

        <!-- ai列表 -->
        <Popup teleport="body" v-model:show="showBottom" round closeable position="bottom">
            <div class="trade_ai_list">
                <div class="trade_ai_list_title">AI量化列表</div>
                <div class="list">
                    <AiItem @click.stop="chooseItem(item)" v-for="(item, i) in marketAiList" :key="i" :item="item" />
                </div>
            </div>
        </Popup>
    </div>


</template>

<script setup>
import { ref, computed, onBeforeUnmount } from "vue"
import { Slider, Button, Popup, showToast,Tabs,Tab } from "vant"
import Decimal from 'decimal.js';
import store from "@/store"
import router from "@/router"
import AiInfo from "../components/AiInfo.vue"
import AiItem from "../../Market/components/AiItem.vue"
import { useRoute } from "vue-router"
import { _aipara, _aibuy, _aiquant } from "@/api/api"
import SafePassword from "@/components/SafePassword.vue"
import { _dateUnitMap } from "@/utils/dataMap"
import StockPopup from "../../trade/StockPopup.vue"
import eventBus from "@/utils/eventBus"
import SlideContainer from "@/components/SlideContainer.vue"

const goLogin = () => {
    store.commit('setIsLoginOpen', true)
    // eventBus.on('loginSuccess', () => {
    //     eventBus.off('loginSuccess')
    // })
}
// onBeforeUnmount(() => {
//     eventBus.off('loginSuccess')
// })

const route = useRoute()
const wallet = computed(() => store.state.wallet || [])
const usdt = computed(() => wallet.value.find(item => item.currency == 'USDT') || {})

const emits = defineEmits(['showNavDialog'])
const showNavDialog = () => {
    // emits('showNavDialog', 'ai')
    showBottom.value = true
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
    grid: '1',
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
    if (form1.value.volume < minamount.value) {
        error2.value = true
        showToast('最小投资额: ' + minamount.value)
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

// 打开行情
const showStockModel = ref(false)
const openStockModel = () => {
    store.commit('setCurrAi', form1.value)
    showStockModel.value = true
}


// 跳转
const jump = (name) => {
    router.push({
        name
    })
}


// ai列表
const showBottom = ref(false)
const marketAiList = computed(() => store.state.marketAiList || []) // ai量化默认列表
const chooseItem = item => {
    form1.value.name = item.name
    form1.value.symbol = item.symbol
    store.commit('setCurrAi', item)
    showBottom.value = false
    getParams()
}
_aiquant({
    orderby: '',
}).then(res => {
    store.commit('setMarketAiList', res.data || [])
    setTimeout(() => {
        store.dispatch('subList', {
            commitKey: 'setMarketAiList',
            listKey: 'marketAiList',
        })
    }, 500)
})



const init = () => {
    error1.value = false
    error2.value = false
    form1.value = {
        name: route.query.name || '',
        symbol: route.query.symbol || '',
        grid: '1',
        volume: ''
    }
    getParams()
}

defineExpose({
    init
})
</script>

<style lang="less" scoped>
.trade_ai {
    padding: 0.32rem 0.32rem 0.6rem 0.32rem;
    
     .subtitle {
        color: #061023;
        font-size: 0.28rem;
        margin-bottom: 0.12rem;
        line-height: 0.36rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .stock_icon {
            width: 0.36rem;
            height: 0.36rem;
        }
    }

    .item_content {
        margin-top: 0.4rem;
       
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
        
        position: relative;
        height: 0.92rem;
        border-radius: 0.32rem;
        border: 1px solid #d0d8e2;
        padding: 0 0.24rem;

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
    

    .error_border {
        border: 1px solid #e8503a !important;
    }
}

.stock_submit_box {
    padding: 0.2rem 0.6rem 0.6rem;

    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.36rem 0 0.2rem 0;
        border-bottom: 1px solid #F5F7FC;

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
                padding: 0 0.3rem;
                border-radius: 0.4rem;
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

            .lever {
                min-width: 0.7rem;
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

    .submit {
        margin-top: 0.6rem;
    }
}

.trade_ai_list {
    .trade_ai_list_title {
        font-size: 0.32rem;
        line-height: 0.6rem;
        text-align: center;
        margin-bottom: 0.2rem;
        margin-top: 0.2rem;
        font-weight: bold;
    }

    .list {
        max-height: 80vh;
        padding: 0.4rem 0.32rem;
        overflow-y: auto;
    }
}
</style>