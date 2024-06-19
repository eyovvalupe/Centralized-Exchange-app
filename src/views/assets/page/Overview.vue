<!-- 资产总览 -->
<template>
    <div class="page_assets_overview">
        <!-- 总览 -->
        <div class="overview" :style="{ backgroundImage: `url(/static/img/assets/one.png)` }">
            <div class="top">
                <div class="title">资产合计</div>
                <div class="eyes" @click="hidden = !hidden">
                    <Icon v-show="!hidden" name="eye-o" />
                    <Icon v-show="hidden" name="closed-eye" />
                </div>
                <div class="ripple_button btn">账户间划转</div>
            </div>
            <div class="money">
                {{ hidden ? '****' : '43534535.00' }}
            </div>
            <div class="navs">
                <div class="nav">
                    <div>现金</div>
                    <div class="num">{{ hidden ? '***' : '232424.00' }}</div>
                </div>
                <div class="line"></div>
                <div class="nav">
                    <div>保证金</div>
                    <div class="num">{{ hidden ? '****' : '232424.00' }}</div>
                </div>
                <div class="line"></div>
                <div class="nav">
                    <div>冻结</div>
                    <div class="num">{{ hidden ? '****' : '232424.00' }}</div>
                </div>
            </div>
        </div>

        <!-- 按钮 -->
        <div class="btns">
            <div class="btn" :style="{ backgroundImage: `url(/static/img/assets/two.png)` }">
                <div class="icon">
                    <img src="/static/img/assets/money.png" alt="img">
                </div>
                <div class="name">充值</div>
            </div>
            <div class="btn" :style="{ backgroundImage: `url(/static/img/assets/three.png)` }">
                <div class="icon">
                    <img src="/static/img/assets/pay.png" alt="img">
                </div>
                <div class="name">提现</div>
            </div>
            <div class="btn" :style="{ backgroundImage: `url(/static/img/assets/four.png)` }">
                <div class="icon">
                    <img src="/static/img/assets/trans.png" alt="img">
                </div>
                <div class="name">现金账户兑换</div>
            </div>
        </div>

        <!-- 列表 -->
        <div class="tabs">
            <div ref="tab1" :key="1" class="ripple_button tab" @click="rightSwitch1 = !rightSwitch1">
                <div class="tab_icon">
                    <img src="/static/img/user/safe.png" alt="img">
                </div>
                <div :class="{ 'open_tab': rightSwitch1 == true }">现金账户</div>
                <div class="amount" :class="{ 'open_amount': rightSwitch1 == true }">1000</div>
                <div class="more" :class="{ 'open_tab': rightSwitch1 == true }">
                    <Icon name="arrow" />
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
                    <img src="/static/img/user/safe.png" alt="img">
                </div>
                <div :class="{ 'open_tab': rightSwitch2 == true }">股票</div>
                <div class="amount" :class="{ 'open_amount': rightSwitch2 == true }">1000</div>
                <div class="more" :class="{ 'open_tab': rightSwitch2 == true }">
                    <Icon name="arrow" />
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
                    <img src="/static/img/user/safe.png" alt="img">
                </div>
                <div :class="{ 'open_tab': rightSwitch3 == true }">合约</div>
                <div class="amount" :class="{ 'open_amount': rightSwitch3 == true }">1000</div>
                <div class="more" :class="{ 'open_tab': rightSwitch3 == true }">
                    <Icon name="arrow" />
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
                    <img src="/static/img/user/safe.png" alt="img">
                </div>
                <div :class="{ 'open_tab': rightSwitch4 == true }">IPO</div>
                <div class="amount" :class="{ 'open_amount': rightSwitch4 == true }">1000</div>
                <div class="more" :class="{ 'open_tab': rightSwitch4 == true }">
                    <Icon name="arrow" />
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
import { ref, onMounted } from "vue"
import { useClickAway } from '@vant/use';

const hidden = ref(true) // 隐藏数字

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
</script>

<style lang="less" scoped>
.page_assets_overview {
    padding-bottom: 1rem;

    .overview {
        background-size: 100% 100%;
        margin: 0.2rem 0.32rem 0.36rem 0.32rem;
        padding: 0.4rem 0.3rem 0.24rem 0.3rem;

        .top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.28rem;
            font-weight: 400;



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

            .btn {
                overflow: hidden;
                margin-left: auto;
                height: 0.6rem;
                border-radius: 0.3rem;
                background-color: #fff;
                padding: 0 0.3rem;
                display: flex;
                align-items: center;
                color: #000;

                &:active {
                    background: rgba(1, 76, 250, 0.5);
                    color: #fff;
                }
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
        margin: 0.16rem 0.32rem 0.4rem 0.32rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .btn {
            width: 2.08rem;
            height: 1.7rem;
            background-size: 100% 100%;
            padding: 0.24rem;

            .icon {
                width: 0.7rem;
                height: 0.7rem;
            }

            .name {
                text-align: right;
                font-weight: 400;
                font-size: 0.24rem;
                margin-top: 0.2rem;
                color: #fff;
                padding-right: 0.06rem;
            }
        }
    }

    .tabs {
        border-top: 1px solid #EAEAEA;
        padding: 0 0.32rem;

        .tab {
            overflow: hidden;
            height: 1.2rem;
            border-bottom: 1px solid #EAEAEA;
            display: flex;
            align-items: center;
            justify-content: space-between;

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
                font-size: 0.32rem;
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