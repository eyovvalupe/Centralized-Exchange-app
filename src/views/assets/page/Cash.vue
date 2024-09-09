<!-- 现金账户 -->
<template>
    <div class="page_assets_cash">
        <!-- 总览 -->
        <div class="overview">
            <div class="top">
                <div class="title">现金账户</div>
                <div class="eyes" @click="hidden = !hidden">
                    <Icon v-show="!hidden" name="eye-o" />
                    <Icon v-show="hidden" name="closed-eye" />
                </div>
            </div>
            <div class="money">
                <span>{{ hidden ? '****' : (mainWallet.amount || '0.00') }}</span>
            </div>
            <div class="navs">
                <!-- <div class="nav">
                    <div class="nav_icon">
                        <img src="/static/img/assets/cash_recharge_icon.png" alt="img">
                    </div>
                    <span>充值</span>
                </div>
                <div class="line"></div>
                <div class="nav">
                    <div class="nav_icon">
                        <img src="/static/img/assets/cash_withdraw_icon.png" alt="img">
                    </div>
                    <span>提现</span>
                </div> -->
                <div class="nav">
                    <div>现金 </div>
                    <div class="num" style="margin-left:0.1rem">{{ hidden ? '***' : (assets.money || '0.00') }}</div>
                </div>
                <div class="line"></div>
                <div class="nav">
                    <div>冻结 </div>
                    <div class="num" style="margin-left:0.1rem">{{ hidden ? '****' : '--' }}</div>
                </div>
            </div>

            <!-- 货币兑换 -->
            <!-- <div class="currency_btn " @click="jump('swap')">
                <span>货币兑换</span>
            </div> -->

            <!-- <div class="loan_box">
                <div>借贷</div>
                <div class="num">{{ hidden ? '***' : (assets.loan || '0.00') }}</div>
            </div> -->
        </div>
        <!-- 按钮 -->
        <div class="btns">
            <div class=" btn" @click="jump('topUp', true)">
                <div class="icon_box">
                    <div class="btn_icon">
                        <img src="/static/img/assets/recharge_icon.png" alt="img">
                    </div>
                </div>
                <span>充值</span>
            </div>
            <div class=" btn btn2" @click="jump('withdraw', true)">
                <div class="icon_box">
                    <div class="color_text">
                        <!-- <div class="withdraw_icon">
                            <img src="/static/img/assets/withdraw_icon.svg" alt="icon">
                        </div> -->
                        <span style=" font-size: 0.2rem;font-weight: 400;color:#666;margin-right:0.04rem">可提现</span>
                        <span>{{ (assets.money || '0.00') }}</span>
                    </div>
                    <div>
                        <span class="tip">冻结</span>
                        <span>{{ '--' }}</span>
                    </div>

                    <div class="process">
                        <div class="left">
                            <div class="ball"></div>
                        </div>
                    </div>
                </div>
                <span>提现</span>
            </div>
        </div>
        <div class="cash_tab_content tabs">
            <div class="tab_title">
                <Switch v-model="show0" />
                <span style="margin-left:0.1rem">{{ show0 ? '已隐藏余额为0的币种' : '已展示余额为0的币种' }}</span>
            </div>
            <div class=" tab" @click="switchOpen(i, $event)" v-for="(item, i) in showList" :key="i">
                <div class="tab_icon">
                    <img :src="`/static/img/crypto/${item.name.toUpperCase()}.png`" alt="img">
                </div>
                <div :class="{ 'open_tab': switchs[i] == true }">
                    <div>{{ item.name }}</div>
                </div>
                <div class="amount" :class="{ 'open_amount': switchs[i] == true }">{{ item.amount }}</div>
                <div class="more" :class="{ 'open_tab': switchs[i] == true }">
                    <img src="/static/img/common/menu.png" alt="img">
                </div>
                <div class="rights" style="width:2.4rem" :class="{ 'open_tab': switchs[i] != true }">
                    <div class="right" style="background-color: #32D74B;" @click="goTopUp(item.currency.toUpperCase())">
                        <div class="right_icon">
                            <img src="/static/img/assets/money.png" alt="img">
                        </div>
                        <div>充值</div>
                    </div>
                    <div class="right" style="background-color: #5E5CE6;">
                        <div class="right_icon">
                            <img src="/static/img/assets/pay.png" alt="img">
                        </div>
                        <div>提现</div>
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue"
import { Icon, Switch } from "vant"
import store from "@/store"
import router from "@/router"
import { _cryptoCoin } from "@/api/api"

const emits = defineEmits(['setLoading'])
const token = computed(() => store.state.token || '')
const hidden = ref(false)





// 刷新现金钱包
const assets = computed(() => store.state.assets || {})
const wallet = computed(() => (store.state.wallet || [])) // 钱包
const mainWallet = computed(() => (store.state.wallet || []).find(a => a.currency == 'main') || {}) // 主钱包
const getAssets = () => {
    if (!token.value) return
    // emits('setLoading', true)
    store.dispatch('updateWallet').finally(() => {
        emits('setLoading', false)
    })
    // store.dispatch('updateOrderHint')
}
const show0 = ref(false) // 是否隐藏余额为0的钱包
const coinMap = computed(() => store.state.coinMap || {})
const showList = computed(() => {
    const arr = [...wallet.value]
    for (let key in coinMap.value) {
        const target = wallet.value.find(item => item.currency == key)
        if (target) {
            if (!arr.find(item => item.currency == key)) {
                arr.push(target)
            }
        } else {
            arr.push({
                currency: key,
                amount: 0
            })
        }
    }
    if (show0.value) return arr.filter(item => item.amount)
    return arr
})
// _cryptoCoin().then(res => {
//     store.commit('setCoinMap', res.data || {})
// })


// 展开状态
const switchs = ref([])
const switchOpen = (i, e) => {
    switchs.value[i] = !switchs.value[i]
    switchs.value = switchs.value.map((item, index) => {
        return i == index ? item : false
    })
    e.stopPropagation()
}

// 跳转充值
const goTopUp = name => {
    router.push({
        name: 'topUp',
        query: {
            currency: name
        }
    })
}


const removeSwitch = () => {
    switchs.value = switchs.value.map(() => {
        return false
    })
}

onMounted(() => {
    getAssets()
    document.querySelector('.page').addEventListener('click', removeSwitch)
})
onUnmounted(() => {
    document.querySelector('.page').removeEventListener('click', removeSwitch)
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
.page_assets_cash {
    border-top: 1px solid rgba(0, 0, 0, 0);
    position: relative;
    padding-bottom: 2rem;

    .overview {
        background-size: 100% 100%;
        margin: 0 0.32rem 0.36rem 0.32rem;
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
        margin: 0.16rem 0.32rem 0.1rem 0.32rem;
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
                opacity: 0.8;
                transform: scale(0.98)
            }

            .icon_box {
                overflow: hidden;
                width: 100%;
                height: 0.8rem;
                background-color: #EDEDED;
                margin-bottom: 0.16rem;
                border-radius: 0.12rem;
                display: flex;
                align-items: center;
                justify-content: center;


                .btn_icon {
                    width: 0.42rem;
                    height: 0.42rem;
                }

                .tip {
                    font-size: 0.2rem;
                    font-weight: 400;
                    margin-right: 0.04rem;
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

    .cash_tab_content {
        padding: 0 0.32rem 0.32rem 0.32rem;
        margin-bottom: 1rem;

        .cash_tab_item {
            height: 1.2rem;
            border-bottom: 1px solid #EAEAEA;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }





    .list_box {
        margin: 0 0.32rem 0.32rem 0.32rem;
    }

    .tabs {
        padding: 0 0.32rem;

        .tab_title {
            border-bottom: 1px solid #EAEAEA;
            line-height: 0.48rem;
            padding: 0.24rem 0 0.24rem 0;
            color: #121826;
            font-size: 0.28rem;
            display: flex;
            align-items: center;
            font-size: 0.24rem;
            color: #999;
        }

        .tab {
            overflow: hidden;
            height: 1rem;
            // border-bottom: 1px solid #EAEAEA;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;

            &::before {
                content: '';
                width: 100%;
                position: absolute;
                height: 0;
                border-bottom: 1px solid #EAEAEA;
                bottom: 0;
                right: 0;
                z-index: 1;
            }

            >div {
                transition: all ease .2s;
                overflow: hidden;
            }

            .tab_icon {
                width: 0.46rem;
                height: 0.46rem;
                margin-right: 0.3rem;

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