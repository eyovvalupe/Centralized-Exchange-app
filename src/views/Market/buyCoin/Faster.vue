<!-- 快捷区 -->
<template>
    <div class="page_fasters">
        <div class="form">

            <!-- 售出 -->
            <div class="item_box">
                <div class="item_box_left">
                    <div class="subtitle"><span>售出</span></div>
                    <div class="item" :class="{ 'item_focus': priceFocus }">
                        <span class="ipt_tip" v-show="form1.price === '' || priceFocus">余额 10000</span>
                        <input v-model="form1.price" @focus="priceFocus = true" @blur="priceFocus = false" type="number"
                            class="ipt">
                    </div>
                </div>
                <div class="item_box_right">
                    <div class="subtitle"><span>&nbsp;</span><span class="link">账户划转</span></div>
                    <div class="item" :class="{ 'item_focus': priceFocus }"
                        style="justify-content: center;border:1px solid #d0d8e2!important">
                        <span>USDT</span>
                        <div class="more_icon">
                            <img src="/static/img/trade/down.png" alt="↓">
                        </div>
                    </div>
                </div>

            </div>

            <!-- 收到 -->
            <div class="item_box">
                <div class="item_box_left">
                    <div class="subtitle"><span>收到</span></div>
                    <div class="item">

                    </div>
                </div>
                <div class="item_box_right">
                    <div class="subtitle"><span>&nbsp;</span></div>
                    <div class="item" :class="{ 'item_focus': priceFocus }"
                        style="justify-content: center;border:1px solid #d0d8e2!important">
                        <span>USDT</span>
                        <div class="more_icon">
                            <img src="/static/img/trade/down.png" alt="↓">
                        </div>
                    </div>
                </div>

            </div>
            <div class="tip">1USDT ≈ 1USDT</div>

            <Button size="large" class="submit" color="#014cfa" round>卖出</Button>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { Button } from "vant"

const priceFocus = ref(false)
const form1 = ref({
    price: ''
})
</script>

<style lang="less" scoped>
.page_fasters {
    .form {
        padding: 0.64rem 0.32rem;

        .tip {
            color: #b7b7b7;
            font-size: 0.24rem;
            position: relative;
            top: -0.2rem
        }

        .subtitle {
            color: #333;
            font-size: 0.28rem;
            margin-bottom: 0.1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .link {
                color: #034cfa;
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
                width: 4.2rem;
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
    }

    .submit {
        margin-top: 4rem;
    }
}
</style>