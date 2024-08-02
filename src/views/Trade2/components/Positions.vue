<!-- 持仓 -->
<template>
    <div class="positions">
        <div class="tr th">
            <div class="td td-5">股票/状态</div>
            <div class="td td-4">开仓/可售</div>
            <div class="td td-4">现价/成本</div>
            <div class="td td-4">盈亏/盈亏比</div>
        </div>
        <NoData v-if="!positionsList.length && !loading" />
        <SwipeCell ref="items" v-for="(item, i) in positionsList" @close="closeDom(i)" :key="i" disabled
            @click="clickDom($event, i)">
            <div class="tr">
                <div class="td td-5">
                    <div class="name">{{ item.symbol }}</div>
                    <div class="lever">
                        <span>{{ item.lever }}X</span>
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
            <template #right>
                <div class="btns">
                    <div class="btn btn1" @click="OpeningForm(item)">
                        <div class="btn_icon">
                            <img src="/static/img/trade/detail.png" alt="img">
                        </div>
                        <div>订单详情</div>
                    </div>
                    <div class="btn btn2">
                        <div class="btn_icon">
                            <img src="/static/img/trade/update.png" alt="img">
                        </div>
                        <div>更新</div>
                    </div>
                    <div class="btn btn3" @click="sell(item)"
                        :class="{ 'disabled_btn': !['none', 'lock', 'open'].includes(item.status) }">
                        <div class="btn_icon">
                            <img src="/static/img/trade/close.png" alt="img">
                        </div>
                        <div>平仓</div>
                    </div>
                </div>
            </template>
        </SwipeCell>

        <!-- 订单详情 -->
        <Popup v-model:show="showInfo" position="bottom" round closeable teleport="body">
            <div class="order_info_box">
                <div class="title">订单详情</div>

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
                    <div class="val_box">
                        <span>{{ currStock.order_no || '--' }}</span>
                        <div class="copy_icon">
                            <img src="/static/img/trade/copy.png" alt="copy">
                        </div>
                    </div>
                </div>
                <div class="info_item">
                    <div class="name">股票</div>
                    <div class="val_box">
                        <div>{{ currStock.symbol || '--' }}</div>
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
        </Popup>

        <!-- 平仓 -->
        <Popup v-model:show="showSell" position="bottom" round closeable teleport="body">
            <div class="order_sell_box">
                <div class="title">平仓</div>

                <div class="form">
                    <div class="subtitle">数量</div>
                    <div class="item" style="margin-bottom:0.1rem">
                        <input v-model="sellForm.volume" @input="changeValue" type="number" class="ipt">
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
                    <div class="total_box">
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
                    </div>

                    <div class="subtitle" style="margin-top: 0.2rem;">请输入交易密码</div>
                    <div class="item">
                        <input v-model="sellForm.safeword" type="password" class="ipt">
                    </div>

                    <Button @click="goSell" :loading="sellLoading" type="primary" class="btn" color="#014CFA">
                        <span style="font-size: 0.28rem;">确定</span>
                    </Button>
                </div>
            </div>
        </Popup>
    </div>
</template>

<script setup>
import { SwipeCell, Popup, Button, Slider, showToast } from 'vant';
import { useSocket } from "@/utils/ws";
import { onMounted, onUnmounted, computed, ref } from "vue"
import store from '@/store';
import NoData from "@/components/NoData.vue"
import Decimal from 'decimal.js';
import { _stocksSell } from "@/api/api"

const token = computed(() => store.state.token)
const positionsList = computed(() => store.state.positionsList)

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
        socket && socket.off('stocksorder')
        socket && socket.emit('user', token.value)
        socket && socket.emit('stocksorder', '#all')
        loading.value = true
        socket.on('stocksorder', res => {
            store.commit('setPositionsList', res.data || [])
            loading.value = false
        })
    });
}
// 取消订阅
const cancelSubs = () => {
    const socket = startSocket(() => {
        socket && socket.off('user')
        socket && socket.off('stocksorder')
        socket && socket.emit('user', '')
        socket && socket.emit('stocksorder', '')
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
const goSell = () => {
    if (sellLoading.value) return
    if (!sellForm.value.volume) return showToast('请输入平仓数量')
    if (!sellForm.value.safeword) return showToast('请输入交易密码')
    sellLoading.value = true
    _stocksSell({
        ...sellForm.value,
        order_no: currStock.value.order_no,
        token: sessionToken.value
    }).then(res => {
        if (res && res.code == 200) {
            showToast('操作成功')
            showSell.value = false
        }
    }).finally(() => {
        sellLoading.value = false
        getSessionToken()
    })
}

// 拖动
const percentages = [25, 50, 75, 100];
const sliderValue = ref(0);
const onSliderChange = (newValue) => {
    sliderValue.value = newValue;
    if (showSell.value) { // 平仓
        sellForm.value.volume = new Decimal(currStock.value.unsold_volume).mul(newValue).div(100).floor()
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


// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    store.dispatch("updateSessionToken")
}
getSessionToken()
</script>

<style lang="less" scoped>
.positions {
    padding-bottom: 2rem;

    .tr {
        padding: 0.2rem 0.32rem;
        border-bottom: 1px solid #e8e8e8;
        display: flex;
        align-items: stretch;
    }

    .th {
        color: #9ea3ae;
        font-size: 0.24rem;
        font-weight: 400;
    }

    .td {
        text-align: center;
        flex-shrink: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 0.04rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        line-height: 0.44rem;

        .name {
            font-size: 0.28rem;
            font-weight: 600;
            color: #061023;
            margin-bottom: 0.1rem;
        }

        .lever {
            display: flex;
            align-items: center;
            padding-left: 0.1rem;
            font-size: 0.24rem;
            color: #000;
            font-weight: 400;
        }

        .status {
            color: #F89A29;
            font-weight: 500;
            height: 0.4rem;
            padding: 0 0.16rem;
            border-radius: 0.08rem;
            background-color: rgba(248, 154, 41, 0.08);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 0.1rem;
        }

        .status-open {
            color: #18B762;
            background-color: rgba(24, 183, 98, 0.08);
        }

        .state {
            color: #E8503A;
            font-weight: 500;
            height: 0.44rem;
            padding: 0 0.2rem;
            border-radius: 0.08rem;
            background-color: rgba(232, 80, 58, 0.08);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .state-short {
            color: #18B762;
            background-color: rgba(24, 183, 98, 0.08);
        }

        .amount {
            color: #014CFA;
            font-size: 0.24rem;
            font-weight: 400;
        }

        .price {
            color: #000;
            font-size: 0.24rem;
            font-weight: 400;
        }

        .num {
            color: #6C7B90;
            font-weight: 600;
            font-size: 0.28rem;
            text-align: right;
        }
    }

    .td-5 {
        flex: 5;
        text-align: left;
    }

    .td-4 {
        flex: 4;
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

        .disabled_btn {
            background-color: #000;
            filter: invert(0.9);

            >div {
                filter: invert(0.6);
            }
        }
    }
}
</style>

<style lang="less">
.order_info_box {
    padding: 0.32rem;

    .title {
        text-align: center;
        font-size: 0.28rem;
        color: #121826;
    }

    .info_boxs {
        display: flex;
        align-items: stretch;
        padding: 0.4rem 0.32rem;
        position: relative;

        &::after {
            content: '';
            width: 40%;
            position: absolute;
            bottom: 0;
            left: 30%;
            border-bottom: 1px dashed #CBCBCB;
        }

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
                min-width: 1.5rem;
                text-align: right;
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
    }

    .form {
        .subtitle {
            color: #333333;
            font-weight: 400;
            font-size: 0.28rem;
            margin-bottom: 0.1rem;
        }

        .item {
            width: 100%;
            height: 0.96rem;
            border: 1px solid #D0D8E2;
            border-radius: 0.12rem;
            padding: 0 0.24rem;

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