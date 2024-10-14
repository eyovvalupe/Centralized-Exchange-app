<!-- 持仓 -->
<template>
    <div v-if="token" class="positions">
        <div class="tr th">
            <div class="td td-5">股票/状态</div>
            <div class="td td-4">开仓/可售</div>
            <div class="td td-4">现价/成本</div>
            <div class="td td-4">盈亏/盈亏比</div>
        </div>
        <NoData v-if="!positionsList.length && !loading" />
        
        <div class="tr" @click="OpeningForm(item)" v-for="(item, i) in positionsList" :key="i">
            <div class="td td-5">
                <div class="name van-omit1">{{ item.symbol }}</div>
                <div class="lever">
                    <div class="status">{{ item.lever }}X</div>
                    <div class="status" :class="'status-' + item.status">{{ statusMap[item.status] || '--' }}</div>
                </div>
            </div>
            <div class="td td-4">
                <div class="state" :class="'state-' + item.offset">{{ offsetMap[item.offset] || '--' }}</div>
                <div class="amount">{{ item.unsold_volume || '--' }}</div>
            </div>
            <div class="td td-4">
                <div class="price">{{ item.settled_price || '--' }}</div>
                <div class="price">{{ item.open_price || '--' }}</div>
            </div>
            <div class="td td-4">
                <div class="num" :class="!item.profit ? '' : (item.profit > 0 ? 'up' : 'down')">{{ item.profit ||
                    '--' }}</div>
                <div class="num" :class="!item.ratio ? '' : (item.ratio > 0 ? 'up' : 'down')">{{
                    getRatio(item.ratio) }}</div>
            </div>
        </div>
            

        <!-- 订单详情 -->
        <Popup v-model:show="showInfo" position="bottom" round closeable teleport="body">
            <div class="van-popup-custom-title">股票订单</div>
            <div class="order_info_box">
                
                <div class="info_boxs">
                    <div class="info_box">
                        <div>可售股票</div>
                        <div class="amount">{{ currStock.unsold_volume || '--' }}</div>
                    </div>
                    <div class="info_box">
                        <div>盈亏/盈亏比</div>
                        <div class="amount" :class="!currStock.profit ? '' : (currStock.profit > 0 ? 'up' : 'down')">
                            <div>{{ currStock.profit || '--' }}</div>
                            <div style="font-size: 0.32rem;">{{ getRatio(currStock.ratio) }}</div>
                        </div>
                    </div>
                </div>

                <div class="info_item">
                    <div class="name">订单号</div>
                    <div class="val_box" style="color:#999">
                        <span>{{ currStock.order_no || '--' }}</span>
                        <div class="copy_icon" @click="copy(currStock.order_no)">
                            <img src="/static/img/trade/copy.png" alt="copy">
                        </div>
                    </div>
                </div>
                <div class="info_item">
                    <div class="name">股票</div>
                    <div class="val_box">
                        <div class="text">{{ currStock.symbol || '--' }}</div>
                    </div>
                </div>
                <div class="info_item">
                    <div class="name">开仓</div>
                    <div class="val_box">
                        <div class="tag" :class="'tag_' + currStock.offset">{{ offsetMap[currStock.offset] || '--' }}
                        </div>
                        <div class="tag">{{ leverTypeap[currStock.lever_type] || '--' }}</div>
                        <div class="text">{{ currStock.lever || '1' }}X</div>
                    </div>
                </div>
                <div class="info_item">
                    <div class="name">价格</div>
                    <div class="val_box">
                        <div class="tag">{{ priceTypeMap[currStock.price_type] || '--' }}</div>
                        <div class="text">{{ currStock.settled_price || '--' }}</div>
                    </div>
                </div>
                <div class="info_item">
                    <div class="name">开仓数量</div>
                    <div class="val_box">
                        <div class="text">{{ currStock.open_volume || '--' }}</div>
                    </div>
                </div>
                <div class="info_item">
                    <div class="name">手续费</div>
                    <div class="val_box">
                        <div class="text">{{ currStock.fee || '0' }}</div>
                    </div>
                </div>
                <div class="info_item">
                    <div class="name">止盈/止损</div>
                    <div>
                        <div class="val_box" style="margin-bottom:0.1rem" v-if="currStock.stop_profit">
                            <div class="tag red_tag">止盈({{ stopMap[currStock.stop_profit_type] }})</div>
                            <div class="text">{{ currStock.stop_profit_price }}{{ currStock.stop_profit_type == 'ratio'
                                ? '%' :
                                '' }}</div>
                        </div>
                        <div class="val_box" v-if="currStock.stop_loss">
                            <div class="tag green_tag">止损({{ stopMap[currStock.stop_loss_type] }})</div>
                            <div class="text">{{ currStock.stop_loss_price }}{{ currStock.stop_loss_type == 'ratio' ?
                                '%' : '' }}
                            </div>
                        </div>
                        <div class="val_box" v-if="!currStock.stop_profit && !currStock.stop_loss">
                            <div class="tag">无</div>
                        </div>
                    </div>

                </div>
                <div class="info_item">
                    <div class="name">订单价值</div>
                    <div class="val_box">
                        <div class="text">{{ currStock.settled_price || '--' }}</div>
                    </div>
                </div>
                <div class="info_item">
                    <div class="name">保证金</div>
                    <div class="val_box">
                        <div class="text">{{ currStock.margin || '0' }}</div>
                    </div>
                </div>
                <div class="info_item">
                    <div class="name">持仓利息</div>
                    <div class="val_box">
                        <div class="text">0</div>
                    </div>
                </div>
            </div>

            <div class="btns">
                
                <div class="btn btn2" @click="update(currStock)"
                    v-if="currStock.status != 'done'"
                    :class="{ 'disabled_btn': !['none', 'lock', 'open'].includes(currStock.status) }">
                    <div class="btn_icon">
                        <img src="/static/img/trade/update.png" alt="img">
                    </div>
                    <div>更新</div>
                </div>
                <div class="btn btn3" @click="sell(currStock)"
                    v-if="currStock.status != 'done'"
                    :class="{ 'disabled_btn': !['none', 'lock', 'open'].includes(currStock.status) }">
                    <div class="btn_icon">
                        <img src="/static/img/trade/close.png" alt="img">
                    </div>
                    <div>平仓</div>
                </div>
                <div class="btn btn4" @click="cancel(currStock)"
                    :class="{ 'disabled_btn': !['none'].includes(currStock.status) }">
                    <div class="btn_icon">
                        <img src="/static/img/trade/cancel.png" alt="img">
                    </div>
                    <div>撤单</div>
                </div>
            </div>
        </Popup>

        <!-- 平仓 -->
        <Popup v-model:show="showSell" position="bottom" round closeable teleport="body">
            <div class="order_sell_box">
                <div class="title">平仓</div>
                <div style="height:0.4rem"></div>
                <div class="form">
                    <div class="subtitle">数量</div>
                    <div class="item" style="margin-bottom:0.1rem">
                        <input @focus="amountFocus = true" @blur="amountFocus = false" v-model="sellForm.volume"
                            @input="changeValue" type="number" class="ipt">
                        <span :style="{ opacity: amountFocus ? '1' : '0', visibility: amountFocus ? '' : 'hidden' }"
                            style="color: #014CFA;word-break: keep-all;transition: all ease .3s"
                            @click="sellForm.volume = currStock.unsold_volume">全部</span>
                    </div>

                    <div class="tip">持仓数量 <span class="num">{{ currStock.unsold_volume }}</span></div>
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

                    <!-- 收益分析 -->
                    <!-- <div class="total_box">
                        <div class="total_item">
                            <div class="total_num total_big"
                                :class="!currStock.profit ? '' : (currStock.profit > 0 ? 'up' : 'down')">{{
                                    currStock.profit }}
                            </div>
                        </div>
                        <div class="total_item">
                            <div class="total_name">盈亏/盈亏比</div>
                            <div class="total_num total_big"
                                :class="!currStock.profit ? '' : (currStock.profit > 0 ? 'up' : 'down')">{{
                                    getRatio(currStock.ratio) }}</div>
                        </div>
                        <div class="total_item" style="border-top: 1px dashed #CBCBCB">
                            <div class="total_name">手续费</div>
                            <div class="total_num">{{ currStock.fee || 0 }}</div>
                        </div>
                    </div> -->

                    <!-- <div class="subtitle" style="margin-top: 0.2rem;">请输入交易密码</div>
                    <div class="item">
                        <input v-model="sellForm.safeword" type="password" class="ipt">
                    </div> -->

                    <Button @click="goSellDialog" :loading="sellLoading" type="primary" class="btn" color="#014CFA">
                        <span style="font-size: 0.28rem;">确定</span>
                    </Button>
                </div>
            </div>
        </Popup>
        

        <!-- 更新 -->
        <Popup v-model:show="showUpdate" position="bottom" round closeable teleport="body">
            <div class="order_sell_box">
                <div class="title">更新订单</div>
                <div style="height:0.4rem"></div>
                <div class="form">
                    <!-- <div class="item_box">
                        <div class="item_box_left" @click="showUpModelDialog = true">
                            <div class="subtitle"><span>止盈</span></div>
                            <div class="item" style="justify-content: center;">
                                <span>{{ stopMap[updateForm.stop_profit_type] || '--' }}</span>
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
                                <input @input="inputStop(1)" v-model="updateForm.stop_profit_price" type="number"
                                    class="ipt">
                                <span v-if="updateForm.stop_profit_type == 'ratio'">%</span>
                            </div>
                        </div>
                    </div> -->
                    <div class="item_box"><!-- 止损 -->
                        <!-- <div class="item_box_left" @click="showDownModelDialog = true">
                            <div class="subtitle"><span>止损</span></div>
                            <div class="item" style="justify-content: center;">
                                <span>{{ stopMap[updateForm.stop_loss_type] || '--' }}</span>
                                <div class="more_icon">
                                    <img src="/static/img/trade/down.png" alt="↓">
                                </div>
                            </div>
                        </div> -->
                        <div class="item_box_right">
                            <div class="subtitle">
                                <span>止损</span>
                            </div>
                            <div class="item">
                                <input @focus="priceFocus3 = true" @blur="priceFocus3 = false" @input="inputStop(2)"
                                    v-model="updateForm.stop_loss_price" type="number" class="ipt">
                                <span style="color: #014CFA;margin-left: 0.2rem;transition: all ease .3s;"
                                    @click="setPriceStop(20)" v-show="currStock.open_price"
                                    :style="{ visibility: priceFocus3 ? '' : 'hidden' }">{{
                                        currStock.offset ==
                                            'long' ? '-' : '+' }}20%</span>
                                <span style="color: #014CFA;margin-left: 0.2rem;transition: all ease .3s;"
                                    @click="setPriceStop(15)" v-show="currStock.open_price"
                                    :style="{ visibility: priceFocus3 ? '' : 'hidden' }">{{
                                        currStock.offset ==
                                            'long' ? '-' : '+' }}15%</span>
                                <span style="color: #014CFA;margin-left: 0.2rem;transition: all ease .3s;"
                                    @click="setPriceStop(10)" v-show="currStock.open_price"
                                    :style="{ visibility: priceFocus3 ? '' : 'hidden' }">{{
                                        currStock.offset ==
                                            'long' ? '-' : '+' }}10%</span>
                                <!-- <span v-if="updateForm.stop_loss_type == 'ratio'">%</span> -->
                            </div>
                        </div>
                    </div>
                    <div class="subtitle">增加保证金</div>
                    <div class="item" style="margin-bottom:0.1rem">
                        <input @focus="amountFocus = true" @blur="amountFocus = false" @input="changeAmount"
                            v-model="updateForm.amount" type="number" class="ipt">
                        <span :style="{ opacity: amountFocus ? '1' : '0', visibility: amountFocus ? '' : 'hidden' }"
                            style="color: #014CFA;word-break: keep-all;transition: all ease .3s"
                            @click="updateForm.amount = stockWalletAmount">全部</span>
                    </div>
                    <div class="tip">≤ {{ stockWalletAmount }}</div>
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
                    <!-- <div class="subtitle" style="margin-top: 0.2rem;">请输入交易密码</div>
                    <div class="item">
                        <input v-model="updateForm.safeword" type="password" class="ipt">
                    </div> -->

                    <Button @click="goUpdateDialog" :loading="updateLoading" type="primary" class="btn" color="#014CFA">
                        <span style="font-size: 0.28rem;">确定</span>
                    </Button>
                </div>
            </div>
        </Popup>

        <!-- 止盈类型选择 -->
        <ActionSheet teleport="body" v-model:show="showUpModelDialog" @select="onSelectUpMode" :actions="upModeList"
            title="止盈">
        </ActionSheet>

        <!-- 止损类型选择 -->
        <ActionSheet teleport="body" v-model:show="showDownModelDialog" @select="onSelectDownMode"
            :actions="downModeList" title="止损">
        </ActionSheet>
    </div>

    <UnLogin @loginfinish="loginfinish" v-show="!token" />

    <!-- 更新订单-安全密码弹窗 -->
    <SafePassword @submit="goUpdate" ref="safeRef" :key="'update'"></SafePassword>
    <!-- 平仓-安全密码弹窗 -->
    <SafePassword @submit="goSell" ref="safeRef2" :key="'sell'"></SafePassword>
</template>

<script setup>
import { SwipeCell, Popup, Button, Slider, showToast, ActionSheet, showConfirmDialog, showLoadingToast, closeToast } from 'vant';
import { useSocket } from "@/utils/ws";
import { onMounted, onUnmounted, computed, ref } from "vue"
import store from '@/store';
import NoData from "@/components/NoData.vue"
import Decimal from 'decimal.js';
import { _stocksSell, _stocksUpdate, _stocksCancel } from "@/api/api"
import { _copyTxt } from "@/utils/index"
import UnLogin from "@/components/UnLogin.vue"
import SafePassword from "@/components/SafePassword.vue"


const loginfinish = () => {

}

const safeRef = ref()
const safeRef2 = ref()

const token = computed(() => store.state.token)
const positionsList = computed(() => store.state.positionsList)
const elseWallet = computed(() => store.state.elseWallet || [])
const stockWalletAmount = computed(() => { // 股票账户余额
    const target = elseWallet.value.find(item => item.account == 'stock')
    if (target) return target.amount
    return 0
})

const items = ref()
const clickDom = (e, i) => {
    if (e == 'cell' && items.value[i]) {
        items.value[i]._opened = !(items.value[i]._opened)
        if (items.value[i]._opened) {
            setTimeout(() => {
                items.value[i].open('right')
            }, 0)
        }
    }
}
const closeDom = (i) => {
    if (items.value[i]) items.value[i]._opened = false
}


const statusMap = ref({ // 仓位状态
    'none': '开仓',
    'lock': '锁定',
    'open': '持仓',
    'done': '平仓',
    'fail': '失败',
    'cancel': '已取消'
})
const offsetMap = ref({ // 涨跌状态
    'long': '买涨',
    'short': '买跌'
})
const leverTypeap = ref({ // 仓位
    'cross': '全仓',
    'isolated': '逐仓'
})
const priceTypeMap = ref({ // 价格类型
    'market': '市价',
    'limit': '限价'
})
const stopMap = ref({ // 止损类型
    'price': '价格',
    'amount': '金额',
    'ratio': '百分比'
})

const { startSocket } = useSocket();
// 订阅
const loading = ref(false)
const subs = () => {
    const socket = startSocket(() => {
        socket && socket.off('user')
        socket && socket.off('stockorder')
        socket && socket.emit('user', token.value)
        socket && socket.emit('stockorder', '#all')
        loading.value = true
        socket.on('stockorder', res => {
            store.commit('setPositionsList', res.data || [])
            loading.value = false
        })
    });
}
// 取消订阅
const cancelSubs = () => {
    const socket = startSocket(() => {
        socket && socket.off('user')
        socket && socket.off('stockorder')
        socket && socket.emit('user', '')
        socket && socket.emit('stockorder', '')
    })
}

onMounted(() => {
    if (token.value) {
        subs()
    }
})
onUnmounted(() => {
    cancelSubs()
})

const getRatio = (num) => {
    if (!num) return '--'
    return new Decimal(num).mul(100) + '%'
}



// 详情
const showInfo = ref(false)
const currStock = ref({})
const OpeningForm = item => {
    currStock.value = item
    showInfo.value = true
}

// 平仓
const amountFocus = ref(false)
const sellForm = ref({
    volume: '',
    safeword: ''
})
const showSell = ref(false)
const sell = item => {
    if (!['none', 'lock', 'open'].includes(item.status)) return
    currStock.value = item
    showSell.value = true
    sellForm.value = {
        volume: '',
        safeword: ''
    }
    sliderValue.value = 0
}
const sellLoading = ref(false)
const goSellDialog = () => {
    if (sellLoading.value) return
    if (!sellForm.value.volume) return showToast('请输入平仓数量')
    // if (!sellForm.value.safeword) return showToast('请输入交易密码')
    showSell.value = false
    safeRef2.value && safeRef2.value.open()
}
const goSell = (s) => {
    sellLoading.value = true
    _stocksSell({
        ...sellForm.value,
        safeword: s,
        order_no: currStock.value.order_no,
        token: sessionToken.value
    }).then(res => {
        if (res && res.code == 200) {
            showToast('操作成功')
            store.dispatch('updateWallet')
            showSell.value = false
        }
    }).finally(() => {
        sellLoading.value = false
        getSessionToken()
    })
}

// 更新
const showUpdate = ref(false)
const updateForm = ref({
    amount: '',
    stop_profit_type: null,
    stop_profit_price: null,
    stop_loss_type: null,
    stop_loss_price: null,
    safeword: ''
})
const update = item => {
    if (!['none', 'lock', 'open'].includes(item.status)) return
    currStock.value = item
    showUpdate.value = true
    updateForm.value = {
        amount: '',
        stop_profit_type: currStock.value.stop_profit_type || 'price',
        stop_profit_price: currStock.value.stop_profit_price,
        stop_loss_type: currStock.value.stop_loss_type || 'price',
        stop_loss_price: currStock.value.stop_loss_price,
        safeword: ''
    }
    sliderValue.value = 0
}
const updateLoading = ref(false)
const goUpdateDialog = () => {
    if (updateLoading.value) return
    if (!updateForm.value.amount) return showToast('请输入保证金')
    // if (!updateForm.value.safeword) return showToast('请输入交易密码')
    showUpdate.value = false
    safeRef.value && safeRef.value.open()
}
const goUpdate = (s) => {
    updateLoading.value = true
    _stocksUpdate({
        ...updateForm.value,
        safeword: s,
        order_no: currStock.value.order_no,
        token: sessionToken.value
    }).then(res => {
        if (res && res.code == 200) {
            showToast('操作成功')
            store.dispatch('updateWallet')
            showUpdate.value = false
        }
    }).finally(() => {
        updateLoading.value = false
        getSessionToken()
    })
}
const showUpModelDialog = ref(false)
const showDownModelDialog = ref(false)
const upModeList = computed(() => {
    const list = []
    for (let key in stopMap.value) {
        list.push({ name: stopMap.value[key], value: key, className: updateForm.value.stop_profit_type == key ? 'action-sheet-active' : '' },)
    }
    return list
})
const downModeList = computed(() => {
    const list = []
    for (let key in stopMap.value) {
        list.push({ name: stopMap.value[key], value: key, className: updateForm.value.stop_loss_type == key ? 'action-sheet-active' : '' },)
    }
    return list
})
const onSelectUpMode = (item) => { // 选择止盈类型
    showUpModelDialog.value = false
    updateForm.value.stop_profit_type = item.value
    updateForm.value.stop_profit_price = ''
}
const onSelectDownMode = (item) => { // 选择止损类型
    showDownModelDialog.value = false
    updateForm.value.stop_loss_type = item.value
    updateForm.value.stop_loss_price = ''
}
const inputStop = key => { // 输入止盈止损
    if (key == 1) { // 止盈
        updateForm.value.stop_profit_price = updateForm.value.stop_profit_price < 0 ? 0 : updateForm.value.stop_profit_price
        if (updateForm.value.stop_profit_type == 'ratio') {
            updateForm.value.stop_profit_price = updateForm.value.stop_profit_price > 100 ? 100 : updateForm.value.stop_profit_price
        }
    } else { // 止损
        updateForm.value.stop_loss_price = updateForm.value.stop_loss_price < 0 ? 0 : updateForm.value.stop_loss_price
        if (updateForm.value.stop_loss_type == 'ratio') {
            updateForm.value.stop_loss_price = updateForm.value.stop_loss_price > 100 ? 100 : updateForm.value.stop_loss_price
        }
    }
}
const priceFocus3 = ref(false)
const setPriceStop = i => { // 设置止损价格
    if (currStock.value.offset == 'long') { // 买涨
        updateForm.value.stop_loss_price = new Decimal(currStock.value.open_price).mul(100 - i).div(100).toNumber()
    } else { // 买跌
        updateForm.value.stop_loss_price = new Decimal(currStock.value.open_price).mul(100 + i).div(100).toNumber()
    }
}

// 拖动
const percentages = [25, 50, 75, 100];
const sliderValue = ref(0);
const onSliderChange = (newValue) => {
    sliderValue.value = newValue;
    if (showSell.value) { // 平仓
        sellForm.value.volume = new Decimal(currStock.value.unsold_volume).mul(newValue).div(100).toNumber()
    }
    if (showUpdate.value) { // 更新
        updateForm.value.amount = new Decimal(stockWalletAmount.value).mul(newValue).div(100).toNumber()
    }
};
const changeValue = () => {
    let val = 0
    if (showSell.value) val = sellForm.value.volume
    if (!val || val < 0) {
        sliderValue.value = 0
        sellForm.value.volume = 0
        return
    }
    if (val > currStock.value.unsold_volume) {
        sliderValue.value = 100
        if (showSell.value) sellForm.value.volume = currStock.value.unsold_volume
        return
    }
    sliderValue.value = Number(new Decimal(val).mul(100).div(currStock.value.unsold_volume).floor())
}
const changeAmount = () => {
    let val = 0
    if (showUpdate.value) val = updateForm.value.amount
    if (!val || val < 0) {
        sliderValue.value = 0
        updateForm.value.amount = 0
        return
    }
    if (val > stockWalletAmount.value) {
        sliderValue.value = 100
        if (showUpdate.value) updateForm.value.amount = stockWalletAmount.value
        return
    }
    sliderValue.value = Number(new Decimal(val).mul(100).div(stockWalletAmount.value).floor())
}


// 撤单
const cancel = item => {
    if (!['none'].includes(item.status)) return
    showConfirmDialog({
        title: '撤单',
        message:
            '确认撤单吗？',
    })
        .then(() => {
            showLoadingToast({
                duration: 0,
                loadingType: 'spinner',
            })
            _stocksCancel({
                order_no: item.order_no,
                token: sessionToken.value
            }).then(res => {
                if (res && res.code == 200) {
                    setTimeout(() => {
                        store.dispatch('updateWallet')
                        showToast('操作成功')
                    }, 100)
                }
            }).finally(() => {
                getSessionToken()
                closeToast()
            })
        })
        .catch(() => { });
}


// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    store.dispatch("updateSessionToken")
}
getSessionToken()


//  复制
const copy = text => {
    _copyTxt(text)
    showToast('已复制')
}
</script>

<style lang="less" scoped>
.positions {
    padding-bottom: 1.6rem;

    .tr {
        padding: 0.24rem 0.32rem;
        border-bottom: 1px solid #EFF3F8;
        display: flex;
        align-items: stretch;
    }
    .tr:last-child{
        border-bottom: 0px;
    }
  

    .th {
        color: #8F92A1;
        font-size: 0.22rem;
        padding: 0.48rem 0.32rem 0.24rem 0.32rem;
    }

    .td {
        text-align: center;
        flex-shrink: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        line-height: 0.3rem;

        .name {
            font-size: 0.32rem;
            color: #061023;
            line-height: 0.32rem;
            margin-bottom: 0.18rem;
        }

        .lever {
            display: flex;
            align-items: center;
            
        }

        .status {
            color: #014CFA;
            height: 0.3rem;
            padding: 0 0.08rem;
            border-radius: 0.3rem;
            border:1px solid #014CFA;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.22rem;
            margin-right: 0.08rem;
        }
        

        .status-open {
            color: #18B762;
            border-color: #18B762;
        }

        .status-fail,
        .status-lock{
            color:#E8503A;
            border-color: #E8503A;
        }
        .status-none{
            color:#7E99D6;
            border-color:#7E99D6;
        }
 

        .state {
            width: 0.68rem;
            height: 0.36rem;
            color: #E8503A;
            border-radius: 0.12rem;
            background: rgba(232, 80, 58, 0.10);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.24rem;
            margin:0 auto;
        }

        .state-short {
            color: #18B762;
            background-color: rgba(24, 183, 98, 0.08);
        }

        .amount {
            color: #061023;
            font-size: 0.28rem;
        }

        .price {
            color: #666D80;
            font-size: 0.24rem;
            
        }
        .price:first-child{
            color:#061023;
            font-size: 0.28rem;
            font-weight: 600;
            line-height: 0.36rem;
        }
        .num {
            color: #6C7B90;
            font-weight: 600;
            font-size: 0.24rem;
            text-align: right;
        }
        .num:first-child{
            font-size: 0.28rem;
            line-height: 0.36rem;
        }
    }

    .td-5 {
        flex: 5;
        text-align: left;
    }

    .td-4 {
        flex: 4;
    }

    
}

.order_info_box {
    padding: 0.32rem;

    .title {
        text-align: center;
        font-size: 0.28rem;
        color: #121826;
        font-weight: bold;
    }

    .info_boxs {
        display: flex;
        align-items: stretch;
        padding: 0.4rem 0.32rem;
        position: relative;

        // &::after {
        //     content: '';
        //     width: 40%;
        //     position: absolute;
        //     bottom: 0;
        //     left: 30%;
        //     border-bottom: 1px dashed #CBCBCB;
        // }

        .info_box {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #9EA3AE;
            font-size: 0.28rem;

            .amount {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin-top: 0.2rem;
                font-weight: 600;
                color: #014CFA;
                font-size: 0.4rem;
            }
        }

    }

    .info_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.32rem 0 0.18rem 0;
        border-bottom: 1px solid #F5F5F5;

        .name {
            color: #8F92A1;
            font-size: 0.28rem;
            font-weight: 400;
        }

        .val_box {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            font-size: 0.28rem;
            color: #121826;

            .copy_icon {
                width: 0.4rem;
                height: 0.4rem;
                margin-left: 0.1rem;
            }

            .tag {
                color: #014CFA;
                font-size: 0.24rem;
                background-color: rgba(1, 76, 250, 0.08);
                height: 0.44rem;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 0.24rem;
                border-radius: 0.08rem;
                margin-right: 0.1rem;
            }

            .red_tag,
            .tag_long {
                color: #E8503A;
                background-color: rgba(232, 80, 58, 0.08);
            }

            .green_tag,
            .tag_short {
                color: #18B762;
                background-color: rgba(24, 183, 98, 0.08);
            }

            .text {
                min-width: 0.5rem;
                text-align: right;
                font-weight: bold;
            }
        }
    }

    .btns {
        display: flex;
        
        .btn {
            width: 1.4rem;
            height: 1.4rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 0.24rem;
            font-weight: 400;

            .btn_icon {
                width: 0.4rem;
                height: 0.4rem;
                margin-bottom: 0.2rem;
            }
        }

        .btn1 {
            background-color: #F7931F;
        }

        .btn2 {
            background-color: #627EEA;
        }

        .btn3 {
            background-color: #014CFA;
        }

        .btn4 {
            background-color: #ef4d4b;
        }

        .disabled_btn {
            background-color: #000;
            filter: invert(0.9);

            >div {
                filter: invert(0.6);
            }
        }
    }
}

.order_sell_box {
    padding: 0.32rem 0.32rem 0.64rem 0.32rem;

    .title {
        text-align: center;
        font-size: 0.28rem;
        color: #121826;
        font-weight: 600;
    }

    .form {
        .subtitle {
            color: #333333;
            font-weight: 400;
            font-size: 0.28rem;
            margin-bottom: 0.1rem;
        }

        .item_box {
            display: flex;
            align-items: stretch;
            margin-bottom: 0.5rem;

            .item_box_left {
                width: 1.8rem;
                margin-right: 0.2rem;
                display: flex;
                flex-direction: column;
            }

            .item_box_right {
                flex: 1;
            }

            .more_icon {
                width: 0.32rem;
                height: 0.32rem;
                margin-left: 0.08rem;
            }
        }

        .item {
            width: 100%;
            height: 0.96rem;
            border: 1px solid #D0D8E2;
            border-radius: 0.12rem;
            padding: 0 0.24rem;
            display: flex;
            align-items: center;

            .ipt {
                width: 100%;
                height: 100%;
            }
        }

        .btn {
            width: 100%;
            border-radius: 0.5rem;
            margin-top: 0.6rem;
            height: 0.96rem;
        }

        .tip {
            text-align: right;
            font-size: 0.24rem;
            color: #8F92A1;

            .num {
                color: #333;
            }
        }

        .total_box {
            margin: 0.4rem 0;
            display: flex;
            flex-direction: column;
            align-items: flex-end;

            .total_item {
                width: 50%;
                display: flex;
                align-items: center;
                font-size: 0.24rem;
                color: #333;
                font-weight: 400;
                padding: 0.08rem 0.1rem 0.08rem 0;

                .total_name {
                    text-align: right;
                    flex: 1;
                }

                .total_num {
                    flex: 1;
                    text-align: right;
                    font-weight: 500;
                    font-size: 0.28rem;
                }

                .total_big {
                    font-size: 0.36rem;
                    font-weight: 600;
                }
            }
        }

        .slider-container {
            margin: 0 auto;
            width: 100%;
            height: 0.8rem;
            padding: 0.2rem 0 0 0;

            .slider-custom-num {
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

            .van-slider {
                margin-top: 0.1rem;
                height: 0.16rem !important;
                border-radius: 0.02rem;
                padding-right: 0.1rem;
            }

            .van-slider__bar {
                position: relative;
            }

            .van-slider__button {
                width: 0.1rem;
                height: 0.48rem;
                background-color: #014cfa;
                border-radius: inherit;
                top: -0.36rem;
            }

            .van-slider__button-wrapper {
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
}
</style>