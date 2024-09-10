<!-- 资产总览 -->
<template>
    <div class="page_assets_overview">
        <!-- 总览 -->
        <div class="overview">
            <div class="top">
                <div class="title">资产合计</div>
                <div class="eyes" @click="hidden = !hidden">
                    <Icon v-show="!hidden" name="eye-o" />
                    <Icon v-show="hidden" name="closed-eye" />
                </div>
            </div>
            <div class="money">
                <span>{{ hidden ? '****' : (assets.total || '0') }}</span>
            </div>
            <div class="navs">
                <div class="nav">
                    <div>
                        <span>现金账户合计</span>
                        <div class="num">{{ hidden ? '****' : (assets.money || '0')
                            }}</div>
                    </div>
                </div>
                <div class="line"></div>
                <div class="nav">
                    <div>持仓金额</div>
                    <div class="num">{{ hidden ? '****' : (assets.ordervalue || '0') }}</div>
                </div>
            </div>
        </div>

        <!-- 按钮 -->
        <div class="btns">
            <div class="btn" @click="jump('topUpCrypto', true)">
                <div class="icon_box">
                    <div class="btn_icon">
                        <img src="/static/img/assets/recharge_icon.png" alt="img">
                    </div>
                </div>
                <span>加密货币充值</span>
            </div>
            <div class="btn">
                <div class="icon_box">
                    <div class="btn_icon">
                        <img src="/static/img/assets/bank_icon.png" alt="img">
                    </div>
                </div>
                <span>银行卡充值</span>
            </div>
            <div class="btn" @click="jump('transfer')">
                <div class="icon_box">
                    <div class="btn_icon">
                        <img src="/static/img/assets/trans_icon.png" alt="img">
                    </div>
                </div>
                <span>账户划转</span>
            </div>

            <div class="btn" :class="{ 'withdraw_btn': !!(assets.money) }" style="width: 48%;"
                @click="jump('withdraw', true)">
                <div class="icon_box">
                    <div class="btn_icon">
                        <img v-if="!!(assets.money)" src="/static/img/assets/withdraw_icon_ed.png" alt="img">
                        <img v-else src="/static/img/assets/withdraw_icon.png" alt="img">
                    </div>
                    <span style="margin-left:0.1rem;font-size: 0.24rem;font-weight: bold;color: #171D2E;">可提 {{
                        assets.money }}</span>
                </div>
                <span>提现</span>
            </div>
            <div class="btn" :class="{ 'recharge_btn': !!(hintNum) }" style="width: 48%;" @click="showAS = true">
                <div class="icon_box">
                    <div class="btn_icon">
                        <img v-if="!!(hintNum)" src="/static/img/assets/record_icon_ed.png" alt="img">
                        <img v-else src="/static/img/assets/record_icon.png" alt="img">
                    </div>
                    <div v-if="hintNum"
                        style="position:relative;margin-left:0.1rem;font-size: 0.24rem;font-weight: bold;color: #171D2E;">
                        <span>记录状态xxx</span>
                        <span class="hint">{{ hintNum }}</span>
                    </div>
                    <div v-else style="margin-left:0.1rem">充值,提现,划转</div>
                </div>
                <span>资金记录</span>
            </div>

        </div>

        <!-- 列表 -->
        <div class="tabs">
            <div ref="tab1" :key="1" class=" tab" @click="rightSwitch1 = !rightSwitch1">
                <div class="tab_icon">
                    <img src="/static/img/assets/cash_icon.svg" alt="img">
                </div>
                <div :class="{ 'open_tab': rightSwitch1 == true }">
                    <div>现金账户</div>
                    <!-- <div class="tab_info">现金账户币种合计</div> -->
                </div>
                <div class="amount" :class="{ 'open_amount': rightSwitch1 == true }">{{ (assets.money || '0') }}
                </div>
                <div class="more" :class="{ 'open_tab': rightSwitch1 == true }">
                    <img src="/static/img/common/menu.png" alt="img">
                </div>
                <div class="rights" style="width:4.8rem" :class="{ 'open_tab': rightSwitch1 != true }">
                    <div class="right" style="background-color: #32D74B;" @click="jump('topUp', true)">
                        <div class="right_icon">
                            <img src="/static/img/assets/money.png" alt="img">
                        </div>
                        <div>充值</div>
                    </div>
                    <div class="right" style="background-color: #5E5CE6;" @click="jump('withdraw', true)">
                        <div class="right_icon">
                            <img src="/static/img/assets/pay.png" alt="img">
                        </div>
                        <div>提现</div>
                    </div>
                    <div class="right" style="background-color: #FF9500;"
                        @click="jump('transfer', false, { from: 'stock', to: 'money' })">
                        <div class="right_icon">
                            <img src="/static/img/assets/down.png" alt="img">
                        </div>
                        <div>转入</div>
                    </div>
                    <div class="right" style="background-color: #FF453A;" @click="jump('transfer')">
                        <div class="right_icon">
                            <img src="/static/img/assets/up.png" alt="img">
                        </div>
                        <div>转出</div>
                    </div>
                </div>
            </div>
            <div ref="tab2" :key="2" class=" tab" @click="rightSwitch2 = !rightSwitch2">
                <div class="tab_icon">
                    <img src="/static/img/assets/stock_icon.svg" alt="img">
                </div>
                <div :class="{ 'open_tab': rightSwitch2 == true }">
                    <div>股票</div>
                    <!-- <div class="tab_info">股票账户余额+持仓金额</div> -->
                </div>
                <div class="amount" :class="{ 'open_amount': rightSwitch2 == true }">{{
                    new Decimal(assets && assets.stock ? assets.stock : 0).add(assets && assets.stock_value ?
                        assets.stock_value : 0) }}
                </div>
                <div class="more" :class="{ 'open_tab': rightSwitch2 == true }">
                    <img src="/static/img/common/menu.png" alt="img">
                </div>
                <div class="rights" style="width:2.4rem" :class="{ 'open_tab': rightSwitch2 != true }">
                    <div class="right" style="background-color: #32D74B;" @click="jump('topUp', true)">
                        <div class="right_icon">
                            <img src="/static/img/assets/money.png" alt="img">
                        </div>
                        <div>充值</div>
                    </div>
                    <div class="right" style="background-color: #5E5CE6;" @click="jump('withdraw', true)">
                        <div class="right_icon">
                            <img src="/static/img/assets/pay.png" alt="img">
                        </div>
                        <div>提现</div>
                    </div>
                </div>
            </div>
            <div ref="tab3" :key="3" class=" tab" @click="rightSwitch3 = !rightSwitch3">
                <div class="tab_icon">
                    <img src="/static/img/assets/contract_icon.svg" alt="img">
                </div>
                <div :class="{ 'open_tab': rightSwitch3 == true }">
                    <div>合约</div>
                    <!-- <div class="tab_info">合约账户余额+持仓金额</div> -->
                </div>
                <div class="amount" :class="{ 'open_amount': rightSwitch3 == true }">
                    {{ new Decimal(assets && assets.futures ? assets.futures : 0).add(assets && assets.futures_value ?
                        assets.futures_value : 0) }}
                </div>
                <div class="more" :class="{ 'open_tab': rightSwitch3 == true }">
                    <img src="/static/img/common/menu.png" alt="img">
                </div>
                <div class="rights" style="width:2.4rem" :class="{ 'open_tab': rightSwitch3 != true }">
                    <div class="right" style="background-color: #32D74B;" @click="jump('topUp', true)">
                        <div class="right_icon">
                            <img src="/static/img/assets/money.png" alt="img">
                        </div>
                        <div>充值</div>
                    </div>
                    <div class="right" style="background-color: #5E5CE6;" @click="jump('withdraw', true)">
                        <div class="right_icon">
                            <img src="/static/img/assets/pay.png" alt="img">
                        </div>
                        <div>提现</div>
                    </div>
                </div>
            </div>
            <div ref="tab5" :key="5" class=" tab" @click="rightSwitch5 = !rightSwitch5">
                <div class="tab_icon">
                    <img src="/static/img/market/out.svg" alt="img">
                </div>
                <div :class="{ 'open_tab': rightSwitch5 == true }">
                    <div>外汇</div>
                    <!-- <div class="tab_info">合约账户余额+持仓金额</div> -->
                </div>
                <div class="amount" :class="{ 'open_amount': rightSwitch5 == true }">
                    {{ new Decimal(assets && assets.forex ? assets.forex : 0).add(assets && assets.forex_value ?
                        assets.forex_value : 0) }}
                </div>
                <div class="more" :class="{ 'open_tab': rightSwitch5 == true }">
                    <img src="/static/img/common/menu.png" alt="img">
                </div>
                <div class="rights" style="width:2.4rem" :class="{ 'open_tab': rightSwitch5 != true }">
                    <div class="right" style="background-color: #32D74B;" @click="jump('topUp', true)">
                        <div class="right_icon">
                            <img src="/static/img/assets/money.png" alt="img">
                        </div>
                        <div>充值</div>
                    </div>
                    <div class="right" style="background-color: #5E5CE6;" @click="jump('withdraw', true)">
                        <div class="right_icon">
                            <img src="/static/img/assets/pay.png" alt="img">
                        </div>
                        <div>提现</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 类型选择弹窗 -->
        <ActionSheet teleport="body" v-model:show="showAS" :actions="actions" @select="onSelect" title="记录列表">
        </ActionSheet>
    </div>
</template>

<script setup>
import { Icon, ActionSheet } from "vant"
import { ref, computed, onMounted } from "vue"
import { useClickAway } from '@vant/use';
import { _assets } from "@/api/api"
import store from "@/store"
import router from "@/router"
import AccountCheck from "@/components/AccountCheck.vue"
import Decimal from 'decimal.js';


const hintNum = computed(() => store.state.hintNum || 0)

const showAS = ref(false)
const actions = [
    { name: '充值记录', value: '0' },
    { name: '提现记录', value: '1' },
    { name: '划转记录', value: '2' },
];
const onSelect = item => {
    showAS.value = false
    router.push({
        name: 'recordList',
        query: {
            tab: item.value,
        }
    })
}

const emits = defineEmits(['setLoading', 'openRecordPopup'])
const token = computed(() => store.state.token || '')
const hidden = ref(false) // 隐藏数字

const openRecordPopup = () => {
    emits('openRecordPopup')
}

// 功能区域控制
const tab1 = ref()
const tab2 = ref()
const tab3 = ref()
const tab5 = ref()
const rightSwitch1 = ref(false)
const rightSwitch2 = ref(false)
const rightSwitch3 = ref(false)
const rightSwitch5 = ref(false)
useClickAway(tab1, () => { rightSwitch1.value = false })
useClickAway(tab2, () => { rightSwitch2.value = false })
useClickAway(tab3, () => { rightSwitch3.value = false })
useClickAway(tab5, () => { rightSwitch5.value = false })


// 刷新总资产
const assets = computed(() => store.state.assets || {})
const getAssets = () => {
    if (!token.value) return
    store.dispatch('updateAssets').finally(() => {
        emits('setLoading', false)
    })
    store.dispatch('updateWallet')
}

onMounted(() => {
    getAssets()
})

const refresh = () => {
    getAssets()
}

defineExpose({
    refresh
})

const jump = (name, check = false, query) => {
    router.push({
        name,
        query
    })
}
</script>

<style lang="less" scoped>
.page_assets_overview {
    padding-bottom: 2rem;
    border-top: 1px solid rgba(0, 0, 0, 0);

    .overview {
        background-size: 100% 100%;
        margin: 0 0.24rem 0.36rem 0.24rem;
        padding: 0.4rem 0.3rem 0.24rem 0.3rem;
        background-color: #1A59F6;
        border-radius: 0.32rem;
        position: relative;

        .loan_btn {
            position: absolute;
            top: 0.4rem;
            right: 0.6rem;
            height: 0.52rem;
            color: #fff;
            font-size: 0.24rem;
            border-radius: 0.3rem;
            padding: 0 0.4rem;
            display: flex;
            align-items: center;
            background-color: #000;

            &:active {
                background-color: #0B1E4A;
            }
        }

        .loan_max {
            position: absolute;
            top: 1.04rem;
            right: 0.2rem;
            color: #fff;
            font-size: 0.24rem;
            font-weight: 400;
            text-align: center;
            min-width: 2.4rem;
        }

        .top {
            font-size: 0.28rem;
            font-weight: 400;
            padding-left: 0.32rem;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            .title {
                color: #fff;
                margin-right: 0.32rem;
            }

            .eyes {
                width: 0.32rem;
                height: 0.32rem;
                color: #fff;
                font-size: 0.32rem;
            }

        }

        .money {
            padding-left: 0.32rem;
            font-size: 0.68rem;
            font-weight: 500;
            color: #fff;
            margin-top: 0.3rem;
            margin-bottom: 0.25rem;
        }

        .navs {
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 0.44rem;
            padding: 0.1rem 0;

            .line {
                width: 1px;
                height: 0.44rem;
                background-color: rgba(255, 255, 255, 0.4);
            }

            .nav {
                color: #fff;
                font-weight: 400;
                flex: 1;
                font-size: 0.24rem;
                text-align: center;
                border-radius: 0.26rem;
                position: relative;

                &:active {
                    background-color: #5045BD;
                }

                .hint {
                    background-color: #fff;
                    height: 0.24rem;
                    font-size: 0.2rem;
                    line-height: 0.24rem;
                    font-weight: 200;
                    padding: 0 0.1rem;
                    border-radius: 0.2rem;
                    position: absolute;
                    top: -0.1rem;
                    right: -0.08rem;
                    color: #000
                }
            }
        }
    }

    .btns {
        margin: 0.16rem 0.24rem 0.1rem 0.24rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;

        .btn {
            width: 31%;
            font-size: 0.24rem;
            color: #333;
            text-align: center;
            margin-bottom: 0.3rem;
            overflow: hidden;

            &:active {
                .icon_box {
                    background-color: #EAF0F3;
                }
            }

            .icon_box {
                overflow: hidden;
                width: 100%;
                height: 0.8rem;
                background-color: #F2F3F8;
                margin-bottom: 0.16rem;
                border-radius: 0.12rem;
                display: flex;
                align-items: center;
                justify-content: center;


                .btn_icon {
                    width: 0.42rem;
                    height: 0.42rem;
                    opacity: 0.85;
                }

                .tip {
                    font-size: 0.2rem;
                    font-weight: 400;
                    margin-right: 0.04rem;
                }
            }
        }

        .withdraw_btn {
            .icon_box {
                background-color: #CADAFF;
            }
        }

        .recharge_btn {
            .icon_box {
                background-color: #FFE1BE;

                .hint {
                    position: absolute;
                    padding: 0.04rem 0.08rem;
                    border-radius: 0.2rem;
                    background-color: #FD4938;
                    color: #fff;
                    left: 100%;
                    top: -0.2rem;
                    line-height: 0.24rem;
                    transform: scale(0.8);
                }
            }
        }

        .btn2 {
            width: 65.4%;

            .icon_box {
                padding: 0 0.3rem;
                justify-content: space-between;
                font-weight: 600;
                position: relative;
                color: #000;

                .color_text {
                    color: #59ba4e;
                    display: flex;
                    align-items: center;

                    .withdraw_icon {
                        width: 0.28rem;
                        height: 0.28rem;
                        margin-right: 0.1rem;
                    }
                }

                .process {
                    background-color: #dadada;
                    width: 100%;
                    position: absolute;
                    bottom: 0;
                    height: 0.1rem;
                    left: 0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .left {
                        height: 100%;
                        width: 50%;
                        background: linear-gradient(to right, #F4DF6B, #98D450, #6BD45F);
                        position: relative;

                        .ball {
                            background-color: #6BD45F;
                            width: 0.3rem;
                            height: 0.3rem;
                            border-radius: 50%;
                            position: absolute;
                            right: 0;
                            bottom: -0.12rem;
                        }
                    }
                }
            }
        }
    }

    .tabs {
        // border-top: 1px solid #EAEAEA;
        position: relative;

        &::before {
            content: '';
            width: calc(100vw - 0.64rem);
            position: absolute;
            height: 0;
            border-bottom: 1px solid #EAEAEA;
            top: 0;
            right: 0.32rem;
            z-index: 1;
        }

        margin-bottom: 0.6rem;

        .tab {
            padding: 0 0.32rem;
            overflow: hidden;
            height: 1rem;
            // border-bottom: 1px solid #EAEAEA;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.28rem;

            &:active {
                background-color: rgba(237, 237, 237, 0.87);
            }

            &::before {
                content: '';
                width: calc(100vw - 0.64rem);
                position: absolute;
                height: 0;
                border-bottom: 1px solid #EAEAEA;
                bottom: 0;
                right: 0.32rem;
                z-index: 1;
            }

            >div {
                transition: all ease .2s;
                overflow: hidden;
            }

            .tab_icon {
                width: 0.32rem;
                height: 0.32rem;
                margin-right: 0.2rem;

            }

            .tab_info {
                font-size: 0.2rem;
                color: #666;
                margin-top: 0.1rem;
            }

            .open_tab {
                width: 0 !important;
            }

            .more {
                width: 0.24rem;
                height: 0.24rem
            }

            .amount {
                flex: 1;
                text-align: right;
                padding: 0 0.2rem;
            }

            .open_amount {
                text-align: left;
            }

            .rights {
                display: flex;
                align-items: stretch;
                height: 100%;

                .right {
                    display: flex;
                    height: 100%;
                    width: 1.2rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.24rem;
                    font-weight: 400;
                    text-align: center;
                    color: #fff;

                    .right_icon {
                        width: 0.44rem;
                        height: 0.44rem;
                        margin-bottom: 0.08rem;
                    }
                }
            }
        }
    }
}
</style>