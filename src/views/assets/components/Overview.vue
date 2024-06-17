<!-- 资产总览 -->
<template>
    <div class="assets_overview">

        <div class="assets-box">
            <div :style="backgroundImageStyle" class="t-box">
                <div class="assets-t-title">
                    <div style="display: flex;">
                        <div class="assets-all">资产合计</div>
                        <Icon name="eye-o" class="eye-o" />
                    </div>
                    <div class="assets-account-button" @click="goTransfer">
                        账户间划转
                    </div>
                </div>

                <div class="assets-price">
                    32,761.65
                </div>

                <div style="display: flex;">
                    <div class="assets-b">
                        <div class="assets-t">
                            现金
                        </div>
                        <div class="assets-p">
                            156,567.00
                        </div>
                        <div class="r-line"></div>
                    </div>

                    <div class="assets-b">
                        <div class="assets-t">
                            保证金
                        </div>
                        <div class="assets-p">
                            880,88.00
                        </div>
                        <div class="r-line"></div>
                    </div>

                    <div class="assets-b">
                        <div class="assets-t">
                            借贷
                        </div>
                        <div class="assets-p">
                            48,888.00
                        </div>
                    </div>
                </div>


                <div class="assets-dj">
                    2325,255.00 冻结
                </div>
            </div>
        </div>

        <div class="assets-m-box">
            <div :style="twoImage" class="assets-s-box">
                <img src="/static/img/assets/money.png" alt="" class="assets-s-box-img">
                <div class="assets-s-box-text">充值</div>
            </div>
            <div :style="threeImage" class="assets-s-box">
                <img src="/static/img/assets/pay.png" alt="" class="assets-s-box-img" style="margin-bottom: 0.14rem;">
                <div class="assets-s-box-p">
                    100,000
                </div>
                <div class="assets-s-box-text">
                    提现
                </div>
            </div>

            <div :style="fourImage" class="assets-s-box">
                <img src="/static/img/assets/trans.png" alt="" class="assets-s-box-img">
                <div class="assets-s-box-text">
                    现金账户兑换
                </div>
            </div>

        </div>

        <div class="assets-b-box">
            <SwipeCell>
                <div class="assets-b-box-b" style="border-top: 0.02rem solid #eaeaea;">
                    <div class="assets-b-box-b-t">
                        现金账户
                    </div>
                    <div class="assets-b-box-b-p">
                        1000
                    </div>
                </div>
                <template #right>
                    <div class="assets-right-div">
                        <div class="assets-right-div-left-box" style="border-top: 0.02rem solid #eaeaea;">
                        </div>
                        <div class="assets-right-i-div" style="background-color: #3f845f;">
                            <img src="/static/img/assets/money.png" alt="" class="assets-right-i-div-img">
                            充值
                        </div>
                        <div class="assets-right-i-div" style="background-color: #fe9c43;">
                            <img src="/static/img/assets/pay.png" alt="" class="assets-right-i-div-img">
                            提现
                        </div>
                        <div class="assets-right-i-div" style="background-color: #2685ca;">
                            <img src="/static/img/assets/down.png" alt="" class="assets-right-i-div-img">
                            转入
                        </div>
                        <div class="assets-right-i-div" style="background-color: #e25c5c;">
                            <img src="/static/img/assets/up.png" alt="" class="assets-right-i-div-img">
                            转出
                        </div>
                    </div>
                </template>
            </SwipeCell>

            <SwipeCell>
                <div class="assets-b-box-b">
                    <div class="assets-b-box-b-t">
                        股票
                    </div>
                    <div class="assets-b-box-b-p">
                        1000
                    </div>
                </div>
                <template #right>
                    <div class="assets-right-div">
                        <div class="assets-right-div-left-box">
                        </div>
                        <div class="assets-right-i-div" style="background-color: #3f845f;">
                            <img src="/static/img/assets/money.png" alt="" class="assets-right-i-div-img">
                            充值
                        </div>
                        <div class="assets-right-i-div" style="background-color: #fe9c43;">
                            <img src="/static/img/assets/pay.png" alt="" class="assets-right-i-div-img">
                            提现
                        </div>
                    </div>
                </template>
            </SwipeCell>

            <SwipeCell>
                <div class="assets-b-box-b">
                    <div class="assets-b-box-b-t">
                        合约
                    </div>
                    <div class="assets-b-box-b-p">
                        1000
                    </div>
                </div>
                <template #right>
                    <div class="assets-right-div">
                        <div class="assets-right-div-left-box">
                        </div>
                        <div class="assets-right-i-div" style="background-color: #3f845f;">
                            <img src="/static/img/assets/money.png" alt="" class="assets-right-i-div-img">
                            充值
                        </div>
                        <div class="assets-right-i-div" style="background-color: #fe9c43;">
                            <img src="/static/img/assets/pay.png" alt="" class="assets-right-i-div-img">
                            提现
                        </div>
                    </div>
                </template>
            </SwipeCell>

            <SwipeCell>
                <div class="assets-b-box-b">
                    <div class="assets-b-box-b-t">
                        IPO
                    </div>
                    <div class="assets-b-box-b-p">
                        1000
                    </div>
                </div>
                <template #right>
                    <div class="assets-right-div">
                        <div class="assets-right-div-left-box">
                        </div>
                        <div class="assets-right-i-div" style="background-color: #3f845f;">
                            <img src="/static/img/assets/money.png" alt="" class="assets-right-i-div-img">
                            充值
                        </div>
                        <div class="assets-right-i-div" style="background-color: #fe9c43;">
                            <img src="/static/img/assets/pay.png" alt="" class="assets-right-i-div-img">
                            提现
                        </div>
                    </div>
                </template>
            </SwipeCell>

        </div>
    </div>
</template>


<script setup>
import { computed } from "vue";
import { Icon, SwipeCell } from 'vant';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();

const backgroundImageStyle = computed(() => ({
    backgroundImage: `url(/static/img/assets/one.png)`,
}));

const twoImage = computed(() => ({
    backgroundImage: `url(/static/img/assets/two.png)`,
}));

const threeImage = computed(() => ({
    backgroundImage: `url(/static/img/assets/three.png)`,
}));

const fourImage = computed(() => ({
    backgroundImage: `url(/static/img/assets/four.png)`,
}));


const goTransfer = () =>{
    router.push({ name: 'transfer'});
}
</script>

<style lang="less" scoped>
.assets_overview {

    .assets-box {
        padding: 0 0.32rem;
        margin-bottom: 0.3rem;

        .t-box {
            width: 100%;
            height: 4.34rem;
            background-size: cover;
            background-position: center;
            padding: 0.4rem;
        }

        .assets-t-title {
            display: flex;
            justify-content: space-between;

            .assets-all {
                color: #FFF;
                text-align: center;
                font-size: 0.28rem;
                font-style: normal;
                font-weight: 400;
                line-height: 0.6rem;
                margin-right: 0.34rem;
            }

            .eye-o {
                font-size: 0.28rem;
                line-height: 0.6rem;
                color: white;
                font-weight: 600;
            }

            .assets-account-button {
                width: 1.96rem;
                height: 0.6rem;
                border-radius: 0.3rem;
                background: #FFF;
                color: #000;
                text-align: center;
                font-size: 0.28rem;
                font-style: normal;
                font-weight: 400;
                line-height: 0.6rem;
            }
        }

        .assets-price {
            color: #FFF;
            font-size: 0.68rem;
            font-style: normal;
            font-weight: 400;
            line-height: 0.96rem;
            margin-bottom: 0.2rem;
            margin-top: 0.4rem;
        }

        .assets-b {
            flex: 1;
            position: relative;

            .r-line {
                width: 0.02rem;
                height: 0.44rem;
                background-color: #ffffff;
                position: absolute;
                right: 0;
                top: 0.1rem;
            }

            .assets-t {
                color: #FFF;
                text-align: center;
                font-size: 0.28rem;
                font-style: normal;
                font-weight: 400;
                line-height: 0.48rem;
            }

            .assets-p {
                color: #FFF;
                text-align: center;
                font-size: 0.28rem;
                font-style: normal;
                font-weight: 400;
                line-height: 0.48rem;
            }
        }

        .assets-dj {
            text-align: right;
            color: #FFF;
            text-align: right;
            font-size: 0.28re m;
            font-style: normal;
            font-weight: 400;
            line-height: 0.48rem;
            margin-top: 0.06rem;
        }
    }

    .assets-m-box {
        display: flex;
        justify-content: space-between;
        padding: 0 0.32rem;
        margin-bottom: 0.46rem;

        .assets-s-box {
            width: 2.08rem;
            height: 2rem;
            background-size: cover;
            background-position: center;
            padding: 0.2rem;

            .assets-s-box-text {
                color: #FFF;
                text-align: right;
                font-size: 0.28rem;
                font-style: normal;
                font-weight: 400;
                line-height: 0.4rem;
            }

            .assets-s-box-p {
                color: #FFF;
                text-align: right;
                font-size: 0.24rem;
                font-style: normal;
                font-weight: 400;
                line-height: 0.4rem;
            }

            .assets-s-box-img {
                width: 0.7rem !important;
                height: 0.7rem !important;
                margin-bottom: 0.42rem;
            }
        }
    }

    .assets-b-box {
        padding: 0 0.32rem;

        .assets-b-box-b {
            height: 1.18rem;
            border-bottom: 0.02rem solid #eaeaea;
            display: flex;
            line-height: 1.18rem;
            justify-content: space-between;
        }

        .assets-b-box-b-t {
            color: #061023;
            text-align: center;
            font-size: 0.32rem;
            font-style: normal;
            font-weight: 400;
        }

        .assets-b-box-b-p {
            color: #061023;
            text-align: center;
            font-size: 0.32re m;
            font-style: normal;
            font-weight: 400;
        }
    }

    .assets-right-div {
        display: flex;

        .assets-right-i-div {
            width: 1.24rem;
            height: 1.18rem;
            color: #FFF;
            text-align: center;
            font-size: 0.24rem;
            font-style: normal;
            font-weight: 400;
            line-height: 0.4rem;

            .assets-right-i-div-img {
                width: 0.44rem !important;
                height: 0.44rem !important;
                display: block;
                margin: auto;
                margin-top: 0.2rem;
                margin-bottom: 0.04rem;
            }
        }

        .assets-right-div-left-box {
            background-color: white;
            width: 0.52rem;
            height: 1.18rem;
            border-bottom: 0.02rem solid #eaeaea;
        }
    }
}
</style>