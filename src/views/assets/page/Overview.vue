<!-- 资产总览 -->
<template>
    <div class="page_assets_overview">
        <!-- 总览 -->
        <div class="overview" :style="{ backgroundImage: `url(/static/img/assets/bg_1.png)` }">
            <div class="top">
                <div class="title">资产合计</div>
                <div class="eyes" @click="hidden = !hidden">
                    <Icon v-show="!hidden" name="eye-o" />
                    <Icon v-show="hidden" name="closed-eye" />
                </div>
            </div>
            <div class="money">
                <span>{{ hidden ? '****' : (assets.total || '0.00') }}</span>
            </div>
            <div class="navs">
                <div class="nav">
                    <div>现金</div>
                    <div class="num">{{ hidden ? '***' : (assets.money || '0.00') }}</div>
                </div>
                <div class="line"></div>
                <div class="nav">
                    <div>保证金</div>
                    <div class="num">{{ hidden ? '****' : (assets.margin || '0.00') }}</div>
                </div>
                <div class="line"></div>
                <div class="nav">
                    <div>冻结</div>
                    <div class="num">{{ hidden ? '****' : (assets.frozen || '0.00') }}</div>
                </div>
            </div>
        </div>

        <!-- 按钮 -->
        <div class="btns">
            <div class="btn">
                <div class="icon_box">
                    <div class="btn_icon">
                        <img src="/static/img/user/record.png" alt="img">
                    </div>
                </div>
                <span>充值</span>
            </div>
            <div class="btn btn2" @click="jump('withdraw')">
                <div class="icon_box">
                    <span class="color_text"><span class="tip">可提</span> {{ (assets.money || '0.00') }}</span>
                    <span><span class="tip">冻结</span> {{ (assets.frozen || '0.00') }}</span>

                    <div class="process">
                        <div class="left">
                            <div class="ball"></div>
                        </div>
                    </div>
                </div>
                <span>提现</span>
            </div>
            <div class="btn" @click="jump('transfer')">
                <div class="icon_box">
                    <div class="btn_icon">
                        <img src="/static/img/user/lang.png" alt="img">
                    </div>
                </div>
                <span>划转</span>
            </div>
            <div class="btn" @click="jump('swap')">
                <div class="icon_box">
                    <div class="btn_icon">
                        <img src="/static/img/user/server.png" alt="img">
                    </div>
                </div>
                <span>兑换</span>
            </div>
            <div class="btn" @click="jump('loan')">
                <div class="icon_box">
                    <div class="btn_icon">
                        <img src="/static/img/user/safe.png" alt="img">
                    </div>
                </div>
                <span>借贷</span>
            </div>
        </div>

        <!-- 列表 -->
        <div class="tabs">
            <div ref="tab1" :key="1" class="ripple_button tab" @click="rightSwitch1 = !rightSwitch1">
                <div class="tab_icon">
                    <img src="/static/img/assets/cash_icon.svg" alt="img">
                </div>
                <div :class="{ 'open_tab': rightSwitch1 == true }">现金账户</div>
                <div class="amount" :class="{ 'open_amount': rightSwitch1 == true }">{{ (assets.money || '0.00') }}
                </div>
                <div class="more" :class="{ 'open_tab': rightSwitch1 == true }">
                    <Icon name="weapp-nav" />
                </div>
                <div class="rights" style="width:4.8rem" :class="{ 'open_tab': rightSwitch1 != true }">
                    <div class="right" style="background-color: #3F845F;">
                        <div class="right_icon">
                            <img src="/static/img/assets/money.png" alt="img">
                        </div>
                        <div>充值</div>
                    </div>
                    <div class="right" style="background-color: #FE9C43;">
                        <div class="right_icon">
                            <img src="/static/img/assets/pay.png" alt="img">
                        </div>
                        <div>提现</div>
                    </div>
                    <div class="right" style="background-color: #2685CA;">
                        <div class="right_icon">
                            <img src="/static/img/assets/down.png" alt="img">
                        </div>
                        <div>转入</div>
                    </div>
                    <div class="right" style="background-color: #E25C5C;">
                        <div class="right_icon">
                            <img src="/static/img/assets/up.png" alt="img">
                        </div>
                        <div>转出</div>
                    </div>
                </div>
            </div>
            <div ref="tab2" :key="2" class="ripple_button tab" @click="rightSwitch2 = !rightSwitch2">
                <div class="tab_icon">
                    <img src="/static/img/assets/stock_icon.svg" alt="img">
                </div>
                <div :class="{ 'open_tab': rightSwitch2 == true }">股票</div>
                <div class="amount" :class="{ 'open_amount': rightSwitch2 == true }">{{ (assets.stock || '0.00') }}
                </div>
                <div class="more" :class="{ 'open_tab': rightSwitch2 == true }">
                    <Icon name="weapp-nav" />
                </div>
                <div class="rights" style="width:2.4rem" :class="{ 'open_tab': rightSwitch2 != true }">
                    <div class="right" style="background-color: #3F845F;">
                        <div class="right_icon">
                            <img src="/static/img/assets/money.png" alt="img">
                        </div>
                        <div>充值</div>
                    </div>
                    <div class="right" style="background-color: #FE9C43;">
                        <div class="right_icon">
                            <img src="/static/img/assets/pay.png" alt="img">
                        </div>
                        <div>提现</div>
                    </div>
                </div>
            </div>
            <div ref="tab3" :key="3" class="ripple_button tab" @click="rightSwitch3 = !rightSwitch3">
                <div class="tab_icon">
                    <img src="/static/img/assets/contract_icon.svg" alt="img">
                </div>
                <div :class="{ 'open_tab': rightSwitch3 == true }">合约</div>
                <div class="amount" :class="{ 'open_amount': rightSwitch3 == true }">{{ (assets.contract || '0.00') }}
                </div>
                <div class="more" :class="{ 'open_tab': rightSwitch3 == true }">
                    <Icon name="weapp-nav" />
                </div>
                <div class="rights" style="width:2.4rem" :class="{ 'open_tab': rightSwitch3 != true }">
                    <div class="right" style="background-color: #3F845F;">
                        <div class="right_icon">
                            <img src="/static/img/assets/money.png" alt="img">
                        </div>
                        <div>充值</div>
                    </div>
                    <div class="right" style="background-color: #FE9C43;">
                        <div class="right_icon">
                            <img src="/static/img/assets/pay.png" alt="img">
                        </div>
                        <div>提现</div>
                    </div>
                </div>
            </div>
            <div ref="tab4" :key="4" class="ripple_button tab" @click="rightSwitch4 = !rightSwitch4">
                <div class="tab_icon">
                    <img src="/static/img/assets/ipo_icon.svg" alt="img">
                </div>
                <div :class="{ 'open_tab': rightSwitch4 == true }">IPO</div>
                <div class="amount" :class="{ 'open_amount': rightSwitch4 == true }">{{ (assets.ipo || '0.00') }}</div>
                <div class="more" :class="{ 'open_tab': rightSwitch4 == true }">
                    <Icon name="weapp-nav" />
                </div>
                <div class="rights" style="width:2.4rem" :class="{ 'open_tab': rightSwitch4 != true }">
                    <div class="right" style="background-color: #3F845F;">
                        <div class="right_icon">
                            <img src="/static/img/assets/money.png" alt="img">
                        </div>
                        <div>充值</div>
                    </div>
                    <div class="right" style="background-color: #FE9C43;">
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
import { Icon } from "vant"
import { ref, computed, onMounted } from "vue"
import { useClickAway } from '@vant/use';
import { _assets } from "@/api/api"
import store from "@/store"
import router from "@/router"

const emits = defineEmits(['setLoading'])
const token = computed(() => store.state.token || '')
const hidden = ref(false) // 隐藏数字

// 功能区域控制
const tab1 = ref()
const tab2 = ref()
const tab3 = ref()
const tab4 = ref()
const rightSwitch1 = ref(false)
const rightSwitch2 = ref(false)
const rightSwitch3 = ref(false)
const rightSwitch4 = ref(false)
useClickAway(tab1, () => { rightSwitch1.value = false })
useClickAway(tab2, () => { rightSwitch2.value = false })
useClickAway(tab3, () => { rightSwitch3.value = false })
useClickAway(tab4, () => { rightSwitch4.value = false })


// 刷新总资产
const assets = computed(() => store.state.assets || {})
const getAssets = () => {
    if (!token.value) return
    store.dispatch('updateAssets').finally(() => {
        emits('setLoading', false)
    })
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

const jump = (name) => {
    router.push({
        name
    })
}
</script>

<style lang="less" scoped>
.page_assets_overview {
    padding-bottom: 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0);

    .overview {
        background-size: 100% 100%;
        margin: 0.2rem 0.32rem 0.36rem 0.32rem;
        padding: 0.4rem 0.3rem 0.24rem 0.3rem;

        .top {

            font-size: 0.28rem;
            font-weight: 400;
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
            font-size: 0.68rem;
            font-weight: 500;
            color: #fff;
            margin-top: 0.3rem;
            margin-bottom: 0.25rem;
        }

        .navs {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            line-height: 0.44rem;

            .line {
                width: 1px;
                height: 0.44rem;
                background-color: rgba(255, 255, 255, 0.4);
            }

            .nav {
                color: #fff;
                font-weight: 400;
                font-size: 0.24rem;
                text-align: center;
                flex: 1;
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
            color: #666;
            text-align: center;
            margin-bottom: 0.3rem;

            &:active {
                opacity: 0.8;
                transform: scale(0.98)
            }

            .icon_box {
                overflow: hidden;
                width: 100%;
                height: 0.8rem;
                background-color: #f2f2f2;
                margin-bottom: 0.1rem;
                border-radius: 0.12rem;
                display: flex;
                align-items: center;
                justify-content: center;

                .btn_icon {
                    width: 0.38rem;
                    height: 0.38rem;
                }

                .tip {
                    font-size: 0.2rem;
                    font-weight: 400;
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
                color: #666;

                .color_text {
                    color: #59ba4e;
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
        border-top: 1px solid #EAEAEA;
        padding: 0 0.32rem;




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
                width: 85vw;
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
                width: 0.32rem;
                height: 0.32rem;
                margin-right: 0.2rem;

            }

            .open_tab {
                width: 0 !important;
            }

            .more {
                font-size: 0.24rem;
                color: #666;
                transform: rotate(90deg)
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