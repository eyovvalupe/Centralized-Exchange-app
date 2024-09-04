<!-- 开仓表单 -->
<template>
    <div class="form">

        <!-- 止盈止损 -->
        <template v-if="props.activeTab == 2">
            <!-- <div class="subtitle" style="position: absolute;right: 0.32rem;">
                <span></span>
                <span style="color:#014CFA" @click="changeMode">{{ mode == 1 ? '复杂模式' : '简单模式' }}</span>
            </div> -->

            <!-- 复杂模式 -->
            <div class="item_box" v-show="mode == 2"><!-- 止盈 -->
                <div class="item_box_left" @click="showUpModelDialog = true">
                    <div class="subtitle"><span>止盈</span></div>
                    <div class="item" style="justify-content: center;">
                        <span>{{ stopMap[form1.stop_profit_type] || '--' }}</span>
                        <div class="more_icon">
                            <img src="/static/img/trade/down.png" alt="↓">
                        </div>
                    </div>
                </div>
                <div class="item_box_right">
                    <div class="subtitle">
                        <span>&nbsp;</span>
                    </div>
                    <div class="item">
                        <input @input="inputStop(1)" v-model="form1.stop_profit_price" type="number" class="ipt">
                        <span v-if="form1.stop_profit_type == 'ratio'">%</span>
                    </div>
                </div>
            </div>
            <div class="item_box" v-show="mode == 2"><!-- 止损 -->
                <div class="item_box_left" @click="showDownModelDialog = true">
                    <div class="subtitle"><span>止损</span></div>
                    <div class="item" style="justify-content: center;">
                        <span>{{ stopMap[form1.stop_loss_type] || '--' }}</span>
                        <div class="more_icon">
                            <img src="/static/img/trade/down.png" alt="↓">
                        </div>
                    </div>
                </div>
                <div class="item_box_right">
                    <div class="subtitle">
                        <span>&nbsp;</span>
                    </div>
                    <div class="item">
                        <input @input="inputStop(2)" v-model="form1.stop_loss_price" type="number" class="ipt">
                        <span v-if="form1.stop_loss_type == 'ratio'">%</span>
                    </div>
                </div>
            </div>

            <!-- 简单模式 -->
            <div class="subtitle" v-show="mode == 1">
                <span>止损</span>
            </div>
            <div class="item_box" v-show="mode == 1">
                <div class="item">
                    <input @input="inputStop(2)" v-model="form1.stop_loss_price" type="number" class="ipt">
                </div>
            </div>

            <!-- 价格 -->
            <div class="item_box">
                <div class="item_box_left" @click="showPriceTypeDialog = true">
                    <div class="subtitle"><span>价格</span></div>
                    <div class="item" style="justify-content: center;">
                        <span>{{ priceMode == 1 ? '市价' : '限价' }}</span>
                        <div class="more_icon">
                            <img src="/static/img/trade/down.png" alt="↓">
                        </div>
                    </div>
                </div>
                <div class="item_box_right">
                    <div class="subtitle">
                        <span>&nbsp;</span>
                    </div>
                    <div class="item" :class="{ 'disabled_item': priceMode == 1 }">
                        <span v-show="priceMode == 1" style="color: #999;">最新价格成交</span>
                        <input v-show="priceMode != 1" v-model="form1.price" type="number" class="ipt">

                        <span v-show="priceMode != 1 && currStock.price" style="color: #014CFA;margin-left: 0.2rem"
                            @click="setPricePercent(3)">3%</span>
                        <span v-show="priceMode != 1 && currStock.price" style="color: #014CFA;margin-left: 0.2rem"
                            @click="setPricePercent(1)">1%</span>
                    </div>
                </div>

                <!-- <div class="mode_btn" @click="changePriceMode" :class="{ 'active_btn': priceMode == 2 }">{{ priceMode ==
                    1 ? '市价' : '限价' }}</div> -->
            </div>
        </template>

        <!-- 价格 -->
        <div class="subtitle" v-if="props.activeTab == 1">
            <span>价格</span>
        </div>
        <div class="item_box" v-if="props.activeTab == 1">
            <div class="item" :class="{ 'item_focus': priceFocus }">
                <span class="ipt_tip" v-show="form1.price === '' || priceFocus">满足价格才能成交</span>
                <input v-model="form1.price" @focus="priceFocus = true" @blur="priceFocus = false" type="number"
                    class="ipt">

                <span style="color: #014CFA;margin-left: 0.2rem" @click="setPricePercent(3)"
                    v-show="currStock.price">3%</span>
                <span style="color: #014CFA;margin-left: 0.2rem" @click="setPricePercent(2)"
                    v-show="currStock.price">2%</span>
                <span style="color: #014CFA;margin-left: 0.2rem" @click="setPricePercent(1)"
                    v-show="currStock.price">1%</span>
                <span style="color: #014CFA;margin-left: 0.2rem" @click="setNowPrice" v-show="currStock.price">市价</span>
            </div>
        </div>

        <!-- 股票 -->
        <div class="subtitle">
            <span style="color: #014CFA;" @click="showNavDialog">股票</span>
            <Loading v-show="searchLoading" type="spinner" style="width:0.28rem;height:0.28rem" color="#034cfa" />
            <div class="stock_icon" v-show="!searchLoading && currStock.symbol" @click="openStockModel">
                <img src="/static/img/trade/blue-stock.png" />
            </div>
        </div>
        <!-- 搜索 -->
        <div class="item_box">
            <div class="item" :class="{ 'item_focus': searchFocus || (searchStr && !currStock.symbol) }">
                <span class="ipt_tip" v-show="!(currStock.symbol && !searchFocus)">股票代码</span>
                <input :style="{ 'opacity': (currStock.symbol && !searchFocus) ? '0' : '1' }"
                    @focus="searchFocus = true, searchStr = currStock.symbol || searchStr" @blur="blurSearch"
                    v-model.trim="searchStr" @keyup="inputSearch" class="ipt" type="text">
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
                <div class="subtitle"><span>模式&杠杆</span></div>
                <div class="item" style="justify-content: center;">
                    <span>{{ modeMap[form1.leverType] || '--' }} {{ form1.lever }}X</span>
                    <div class="more_icon">
                        <img src="/static/img/trade/down.png" alt="↓">
                    </div>
                </div>
            </div>

            <div class="item_box_right">
                <div class="subtitle">
                    <span>数量</span>
                    <div style="color: #014CFA;display: flex;align-items: center;font-size:0.24rem">
                        <!-- 划转/兑换/充值 -->
                        <span @click="jump('transfer')">划转</span>
                        <!-- <span @click="jump('loanList')" style="margin-left: 0.24rem;">借贷</span> -->
                    </div>
                </div>
                <div class="item" :class="{ 'item_focus': amountFocus }">
                    <!-- <span class="ipt_tip ipt_tip2" v-show="form1.volume === '' || amountFocus">最大可买 {{ maxStockNum }}
                    </span> -->
                    <span @click="putAll"
                        :style="{ opacity: amountFocus ? '1' : '0', visibility: amountFocus ? '' : 'hidden' }"
                        style="color: #014CFA;position: absolute;right: 0.24rem;font-size: 0.24rem;z-index:9999;transition: all ease .2s">全部</span>
                    <input v-model="form1.volume" @focus="amountFocus = true" @blur="amountFocus = false"
                        @change="changePercent" type="number" class="ipt">
                </div>
            </div>
        </div>
        <div
            style="color: #b7b7b7;text-align: left;font-size: 0.24rem;position: relative;top: -0.4rem;padding-left: 2.4rem;">
            最大可买 {{
                maxStockNum }}
        </div>

        <!-- 拖动 -->
        <div class="slider-container">
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
        <Button v-if="token" :loading="configLoading" size="large" @click="submit1" class="submit"
            :color="activeType == 1 ? '#18b762' : '#e8503a'" round>{{
                activeType == 1 ?
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
                    <div class="lever" v-if="params.price">{{ params.price }}</div>
                </div>
            </div>
            <div class="item">
                <div class="item_name">开仓数量</div>
                <div class="item_val">{{ params.volume }}</div>
            </div>
            <div class="item">
                <div class="item_name">止盈/止损</div>
                <div class="item_val" v-if="props.activeTab != 2">
                    <div class="tag">无</div>
                </div>
                <div v-if="props.activeTab == 2">
                    <div class="item_val" style="margin-bottom:0.12rem" v-if="mode == 2">
                        <div class="tag red_tag">止盈</div>
                        <div class="lever">{{ params.stop_profit_price }}</div>
                    </div>
                    <div class="item_val">
                        <div class="tag green_tag">止损</div>
                        <div class="lever">{{ params.stop_loss_price }}</div>
                    </div>
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

    <!-- 股票行情弹窗 -->
    <Popup teleport="body" v-model:show="showStockModel" position="bottom" round closeable>
        <StockPopup style="height:90vh" />
    </Popup>

    <!-- 止盈类型选择 -->
    <ActionSheet teleport="body" v-model:show="showUpModelDialog" @select="onSelectUpMode" :actions="upModeList"
        title="止盈">
    </ActionSheet>

    <!-- 止损类型选择 -->
    <ActionSheet teleport="body" v-model:show="showDownModelDialog" @select="onSelectDownMode" :actions="downModeList"
        title="止损">
    </ActionSheet>

    <!-- 仓位模式选择 -->
    <!-- <ActionSheet teleport="body" v-model:show="showTypeDialog" :actions="modeList" @select="onSelectForm1Type"
        title="保证金模式">
    </ActionSheet> -->
    <Popup v-model:show="showTypeDialog" round position="bottom" teleport="body">
        <Picker :swipe-duration="300" :columns="columns" @cancel="showTypeDialog = false"
            @confirm="onSelectForm1Type" />
    </Popup>

    <!-- 限价模式选择 -->
    <ActionSheet teleport="body" v-model:show="showPriceTypeDialog" :actions="priceModeList"
        @select="onSelectForm1PriceType" title="限价模式">
    </ActionSheet>

    <!-- 跳转选择 -->
    <ActionSheet teleport="body" v-model:show="showJumpTypeDialog" :actions="jumpModeList"
        @select="onSelectJumpModeType" title="划转/兑换/充值">
    </ActionSheet>
</template>

<script setup>
import { Loading, Slider, Button, showToast, Popup, ActionSheet, Picker } from "vant";
import { ref, computed } from "vue"
import { _search, _basic, _stocksPara, _stocksBuy } from "@/api/api"
import store from "@/store";
import Decimal from 'decimal.js';
import { useRoute } from "vue-router"
import router from "@/router"
import StockPopup from "../../trade/StockPopup.vue"

const emits = defineEmits(['showNavDialog'])
const showNavDialog = () => {
    emits('showNavDialog')
}
const showJumpTypeDialog = ref(false) // 跳转开关
const jumpModeList = ref([
    { name: '划转', value: 'transfer' },
    { name: '兑换', value: 'swap' },
    { name: '充值', value: 'topUpCrypto' },
])
const onSelectJumpModeType = item => {
    jump(item.value)
}

const props = defineProps({
    activeTab: null, // 0-市价 1-限价 2-止盈止损
    activeType: null,
})

// 仓位类型
const modeMap = ref({
    'cross': '全仓',
    'isolated': '逐仓'
})

// 市价-类型
const showTypeDialog = ref(false)
const onSelectForm1Type = (item) => {
    showTypeDialog.value = false
    form1.value.leverType = item.selectedValues[0]
    form1.value.lever = item.selectedValues[1]
}

// 限价模式
const showPriceTypeDialog = ref(false)
const priceModeList = computed(() => {
    const list = []
    list.push({ name: '市价', value: 1, className: priceMode.value == 1 ? 'action-sheet-active' : '' })
    list.push({ name: '限价', value: 2, className: priceMode.value == 2 ? 'action-sheet-active' : '' })
    return list
})
const columns = computed(() => {
    return [
        [
            { text: '全仓', value: 'cross', className: form1.value.leverType == 'cross' ? 'action-sheet-active' : '' },
            { text: '逐仓', value: 'isolated', className: form1.value.leverType == 'isolated' ? 'action-sheet-active' : '' }
        ],
        levers.value.map(item => {

            return {
                text: item + 'X',
                value: item,
                className: form1.value.lever == item ? 'action-sheet-active' : ''
            }
        })
    ]
})
const onSelectForm1PriceType = item => {
    showPriceTypeDialog.value = false
    priceMode.value = item.value
    if (priceMode.value == 1) {
        form1.value.price = ''
    }
}


const route = useRoute()
const token = computed(() => store.state.token)
const modeList = computed(() => {
    const list = []
    for (let key in modeMap.value) {
        list.push({ name: modeMap.value[key], value: key, className: form1.value.leverType == key ? 'action-sheet-active' : '' },)
    }
    return list
})


const elseWallet = computed(() => store.state.elseWallet || [])
const stockWalletAmount = computed(() => { // 股票账户余额
    const target = elseWallet.value.find(item => item.account == 'stock')
    if (target) return target.amount
    return 0
})
const maxStockNum = computed(() => { // 最大可买 可卖
    if (currStock.value.price) {
        return new Decimal(stockWalletAmount.value).div(form1.value.price || currStock.value.price).mul(form1.value.lever).floor()
    }
    return '--'
})


// 限价
const setNowPrice = () => { // 设置为当前价格
    form1.value.price = currStock.value.price || ''
}
const setPricePercent = (i) => { // 设置浮动价格
    if (props.activeType == 1) { // 买涨
        form1.value.price = new Decimal(currStock.value.price).mul(100 - i).div(100).toNumber()
    } else { // 买跌
        form1.value.price = new Decimal(currStock.value.price).mul(100 + i).div(100).toNumber()
    }
}

// 市价
const currStock = ref({}) // 当前股票
try {
    currStock.value = JSON.parse(sessionStorage.getItem('currStock') || '{}')
} catch {
    currStock.value = {}
}

const form1 = ref({
    leverType: 'cross',
    lever: 1,
    volume: '',
    price: '',
    price_type: props.activeTab == 1 ? 'limit' : 'market',
    stop_profit_type: null, // 价格-[ price ]  金额-[ amount ]  百分比-[ ratio ]
    stop_profit_price: null,
    stop_loss_type: null,
    stop_loss_price: null,
})

// 止盈止损参数
const mode = ref(1) // 1-简单模式  2-复杂模式
const priceMode = ref(1) // 1-市价 2-限价
const changeMode = () => {
    mode.value = mode.value == 1 ? 2 : 1
    if (mode.value == 1) {
        form1.value.stop_profit_type = null
        form1.value.stop_profit_price = null
    } else {
        form1.value.stop_profit_type = 'price'
        form1.value.stop_profit_price = ''
    }
    form1.value.stop_loss_type = 'price'
    form1.value.stop_loss_price = ''
}
const stopMap = ref({
    price: '价格',
    amount: '金额',
    ratio: '百分比'
})
if (props.activeTab == 2) {
    form1.value.stop_loss_type = 'price'
    form1.value.stop_loss_price = ''
}
const showUpModelDialog = ref(false)
const showDownModelDialog = ref(false)
const upModeList = computed(() => {
    const list = []
    for (let key in stopMap.value) {
        list.push({ name: stopMap.value[key], value: key, className: form1.value.stop_profit_type == key ? 'action-sheet-active' : '' },)
    }
    return list
})
const downModeList = computed(() => {
    const list = []
    for (let key in stopMap.value) {
        list.push({ name: stopMap.value[key], value: key, className: form1.value.stop_loss_type == key ? 'action-sheet-active' : '' },)
    }
    return list
})
const onSelectUpMode = (item) => { // 选择止盈类型
    showUpModelDialog.value = false
    form1.value.stop_profit_type = item.value
    form1.value.stop_profit_price = ''
}
const onSelectDownMode = (item) => { // 选择止损类型
    showDownModelDialog.value = false
    form1.value.stop_loss_type = item.value
    form1.value.stop_loss_price = ''
}
const inputStop = key => { // 输入止盈止损
    if (key == 1) { // 止盈
        form1.value.stop_profit_price = form1.value.stop_profit_price < 0 ? 0 : form1.value.stop_profit_price
        if (form1.value.stop_profit_type == 'ratio') {
            form1.value.stop_profit_price = form1.value.stop_profit_price > 100 ? 100 : form1.value.stop_profit_price
        }
    } else { // 止损
        form1.value.stop_loss_price = form1.value.stop_loss_price < 0 ? 0 : form1.value.stop_loss_price
        if (form1.value.stop_loss_type == 'ratio') {
            form1.value.stop_loss_price = form1.value.stop_loss_price > 100 ? 100 : form1.value.stop_loss_price
        }
    }
}



const submit1 = () => {
    if (!currStock.value.symbol) return showToast('请输入股票代码')
    if (!form1.value.volume || form1.value.volume < min.value) return showToast(`最小交易量：${min.value}`)
    // 止盈止损校验
    if (props.activeTab == 2) {
        if (mode.value == 1) { // 简单模式
            if (!form1.value.stop_loss_price) return showToast('请输入止损价格')
        } else { // 复杂模式
            if (!form1.value.stop_profit_price) return showToast('请输入止盈价格')
            if (!form1.value.stop_loss_price) return showToast('请输入止损价格')
        }
        if (priceMode.value == 2 && !form1.value.price) { // 限价
            return showToast('请输入限价')
        }
    }
    // 打开确认弹窗
    params.value = {
        symbol: currStock.value.symbol,
        offset: props.activeType == 1 ? 'long' : 'short',
        volume: Number(form1.value.volume),
        lever_type: form1.value.leverType,
        lever: form1.value.lever,
        price_type: form1.value.price_type,
        price: form1.value.price || '',
        stop_profit_type: form1.value.stop_profit_type,
        stop_profit_price: form1.value.stop_profit_price,
        stop_loss_type: form1.value.stop_loss_type,
        stop_loss_price: form1.value.stop_loss_price,
    }
    if (props.activeTab == 2) { // 止盈止损
        if (priceMode.value == 1) { // 市价
            params.value.price_type = 'market'
            params.value.price = ''
        } else { // 限价
            form1.value.price_type = 'limit'
        }
    }

    safePass.value = ''
    showModel.value = true
}
const amountFocus = ref(false)
const priceFocus = ref(false)


// 全部
const putAll = () => {
    onSliderChange(100)
}
// 市价-拖动
const percentages = [25, 50, 75, 100];
const sliderValue = ref(0);
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
// 市价-搜索
const searchLoading = ref(false)
const searchFocus = ref(false)
const searchStr = ref('')
const blurSearch = () => {
    searchFocus.value = false
    if (!currStock.value.symbol && searchStr.value) { // 失去焦点时没有结果的情况
        sureStock()
    }
}
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
// 用详情接口来确认搜索到的股票
const sureStock = () => {
    searchLoading.value = true
    _basic({ symbol: searchStr.value.toUpperCase() }).then(r => {
        if (r && r.data && r.data.symbol) {
            currStock.value = {
                ...currStock.value,
                ...r.data
            }
            sessionStorage.setItem('currStock', JSON.stringify(currStock.value))
        }
    }).finally(() => {
        searchLoading.value = false
    })
}
const goSearch = () => {
    searchLoading.value = true
    const s = searchStr.value
    _search({
        symbol: s,
        mode: 'right',
        page: 1
    }).then(res => {
        if (s != searchStr.value) return // 搜索内容已经变化就不处理了
        if (!searchFocus.value) return // 失去焦点就不处理了
        if (res && res.data && res.data[0]) {

            currStock.value = res.data[0]
            _basic({ symbol: currStock.value.symbol }).then(r => {
                if (r && r.data && r.data.symbol) {
                    currStock.value = {
                        ...currStock.value,
                        ...r.data
                    }
                    sessionStorage.setItem('currStock', JSON.stringify(currStock.value))
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
    // activeType.value = route.query.type || 1
    goSearch()
}


// 下单限制的参数
const min = ref(0) // 最小购买
const step = ref(1) // 步长
const openFee = ref(0) // 开仓手续费
const closeFee = ref(0) // 平仓手续费
const flowerFee = ref(0) // 印花税
const configLoading = ref(false)
const levers = ref([1]) // 杠杆
const getParam = () => {
    configLoading.value = true
    paramHandle()
    _stocksPara().then(res => {
        if (res && res.data) {
            paramHandle(res.data)
        }
    }).finally(() => {
        configLoading.value = false
    })
}
const paramHandle = data => {
    if (data) {
        sessionStorage.setItem('open_param', JSON.stringify(data))
    } else {
        try {
            data = JSON.parse(sessionStorage.getItem('open_param') || '{}')
        } catch {
            data = {}
        }
    }
    if (data.volume) {
        const arr = data.volume.split(',')
        min.value = arr[0] || 0
        step.value = arr[1] || 1
        configLoading.value = false
    }
    if (data.fee) {
        const arr2 = data.fee.split(',')
        openFee.value = arr2[0] || 0
        closeFee.value = arr2[1] || 0
        flowerFee.value = arr2[2] || 0
    }
    if (data.lever) {
        levers.value = data.lever.split(',')
    }
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
    return new Decimal(params.value.volume).mul(currStock.value.price).div(form1.value.lever)
})
const payFee = computed(() => { // 手续费
    return new Decimal(payOrigin.value).mul(openFee.value)
})
const submitLoading = ref(false)
const submitForm = () => {
    if (!safePass.value) return showToast('请输入交易密码')
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
        getSessionToken()
        setTimeout(() => {
            submitLoading.value = false
        }, 500);
    })
}



// 打开行情
const showStockModel = ref(false)
const openStockModel = () => {
    store.commit('setCurrStock', currStock.value)
    showStockModel.value = true
}


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

// 选择某个股票
const choose = (item) => {
    currStock.value = item
    _basic({ symbol: item.symbol }).then(r => {
        if (r && r.data && r.data.symbol) {
            if (item.symbol == currStock.value.symbol) {
                currStock.value = {
                    ...currStock.value,
                    ...r.data
                }
            }
        }
    })
}

defineExpose({
    choose
})
</script>

<style lang="less" scoped>
.form {
    padding: 0.6rem 0.32rem 2rem 0.32rem;
    position: relative;

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

            .ipt_tip2 {
                left: auto;
                right: 0.24rem;
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

        .disabled_item {
            background-color: #f5f5f5;
        }

        .item_focus {
            height: 1.12rem;
            // padding-top: 0.2rem;
            border: 1px solid #034cfa;

            .ipt_tip {
                font-size: 0.2rem;
                transform: translateY(-0.36rem);
            }
        }

        .item_box_left {
            width: 2.2rem;
            margin-right: 0.2rem;
            display: flex;
            flex-direction: column;
        }

        .item_box_right {
            flex: 1;
        }

        .mode_btn {
            padding: 0 0.6rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 1.26rem;
            background: #f2f2f2;
            height: 0.72rem;
            color: #999;
            text-align: center;
            font-size: 0.28rem;
            font-weight: 600;
            margin-left: 0.16rem;
            margin-top: 0.08rem;
        }

        .active_btn {
            background: #014cfa;
            color: #fff;
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