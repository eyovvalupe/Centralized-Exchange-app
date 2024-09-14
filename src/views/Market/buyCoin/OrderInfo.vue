<!-- 订单详情 -->
<template>
    <div class="order_info">

        <!-- tabs -->
        <div class="tabs">
            <div class="tab active_tab">
                <span>购买</span>
            </div>
            <div class="tab">
                <span>联系商家</span>
                <div class="hint">2</div>
            </div>
        </div>

        <!-- 顶部详情 -->
        <div class="top">
            <span>2024-08-08 13:13:13</span>
            <span>242342342342342234</span>
            <div class="copy_icon">
                <img src="/static/img/common/copy_default.png" alt="copy">
            </div>
        </div>

        <!-- 价格详情 -->
        <div class="info">
            <div class="info_item">
                <div class="title">总价</div>
                <div class="val">1000 USDT</div>
            </div>
            <div class="info_item">
                <div class="title">价格</div>
                <div class="val">1000 USDT</div>
            </div>
            <div class="info_item">
                <div class="title">数量</div>
                <div class="val">1000 USDT</div>
            </div>
        </div>

        <!-- 商家详情 -->
        <div class="seller">
            <div class="title_box">
                <div class="avatar"></div>
                <div class="title">萨达萨达是/阿松大萨达撒</div>
            </div>
            <div class="remark">备注 诚信交易|快速交易|阿三大苏打萨达萨达</div>
        </div>

        <!-- 银行卡 -->
        <div class="bank">
            <div class="bank_title">
                <div class="bank_icon">
                    <img src="/static/img/user/card_type_b.png" alt="img">
                </div>
                <div>银行卡</div>
            </div>

            <div class="table">
                <div class="tr">
                    <div class="td">银行卡</div>
                    <div class="td td-3">美国银行</div>
                </div>
                <div class="tr">
                    <div class="td">卡号</div>
                    <div class="td td-3">123435</div>
                </div>
                <div class="tr">
                    <div class="td">账号</div>
                    <div class="td td-3">asdasdasds</div>
                </div>
            </div>
        </div>

        <!-- 状态 -->
        <div class="status">
            <div class="status_wait">
                <div style="display: flex;align-items: center;">
                    <div class="amount">等待买家付款</div>
                    <div class="time">14:13:00</div>
                </div>
                <div>请根据总价，向商家提供的银行卡转账</div>
            </div>
        </div>

        <!-- 按钮 -->
        <div class="btns">
            <div class="btn" style="margin-right: 0.64rem;">取消订单</div>
            <div class="btn active_btn">我已付款</div>
        </div>

    </div>
</template>


<style lang="less" scoped>
.order_info {
    padding: 0 0.32rem 0.32rem 0.32rem;

    .tabs {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .tab {
            margin-right: 0.6rem;
            color: #9EA3AE;
            position: relative;

            .hint {
                position: absolute;
                right: -0.2rem;
                top: -0.1rem;
                background-color: #FD4938;
                border-radius: 0.12rem;
                font-size: 0.24rem;
                color: #fff;
                line-height: 0.2rem;
                padding: 0.04rem 0.08rem;
            }
        }

        .active_tab {
            color: #000;
            font-weight: bold;
        }
    }

    .top {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: #666666;
        font-size: 0.24rem;
        padding: 0.28rem 0;

        .copy_icon {
            width: 0.32rem;
            height: 0.32rem;
        }
    }

    .info {
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        padding: 0.24rem 0;
        border-top: 1px dashed #CBCBCB;
        border-bottom: 1px dashed #CBCBCB;

        .info_item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            text-align: center;

            .title {
                color: #666;
                margin-bottom: 0.24rem;
            }

            .val {
                color: #333;
            }
        }
    }

    .seller {
        padding: 0.24rem 0;
        border-bottom: 1px dashed #CBCBCB;

        .title_box {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: 0.18rem;

            .avatar {
                width: 0.52rem;
                height: 0.52rem;
                border-radius: 50%;
                background-color: #014CFA;
                margin-right: 0.32rem;
            }

            .title {
                color: #000;
            }
        }

        .remark {
            font-size: 0.24rem;
            color: #666666;
        }
    }

    .bank {
        padding: 0.24rem 0;

        .bank_title {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: 0.2rem;

            .bank_icon {
                width: 0.4rem;
                height: 0.4rem;
                border-radius: 50%;
                padding: 0.04rem;
                background-color: #D8E4FF;
                margin-right: 0.16rem;
            }
        }

        .table {
            border-left: 1px solid #D4D4D4;
            border-top: 1px solid #D4D4D4;

            .tr {
                display: flex;
                align-items: stretch;

                .td {
                    flex: 1;
                    height: 0.64rem;
                    padding: 0 0.32rem;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    border-right: 1px solid #D4D4D4;
                    border-bottom: 1px solid #D4D4D4;
                }

                .td-3 {
                    flex: 3;
                    justify-content: center;
                }
            }
        }
    }

    .status {
        padding: 0.24rem 0;

        .status_wait {
            line-height: 0.56rem;
            color: #333;

            .amount {
                font-weight: bold;
                color: #000;
                margin-right: 0.2rem;
            }

            .time {
                color: #FD4938;
                font-weight: bold;
                font-size: 0.32rem;
            }
        }
    }

    .btns {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 0.32rem;

        .btn {
            flex: 1;
            height: 0.88rem;
            border-radius: 0.88rem;
            background-color: #EFF6FF;
            color: #014CFA;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .active_btn {
            background-color: #014CFA;
            color: #fff;
        }
    }
}
</style>