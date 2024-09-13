<!-- 自选区 -->
<template>
    <div class="buycoin_self">

        <!-- tab -->
        <div class="tabs">
            <div class="tab active_tab">买入</div>
            <div class="tab">卖出</div>
            <div style="flex:1"></div>
            <div style="display: flex;align-items: center;">
                <span>CNY</span>
                <div class="icon">
                    <img src="/static/img/market/trans.png" alt="img">
                </div>
            </div>
        </div>

        <!-- list -->
        <div class="list">

            <div class="item" v-for="i in 10" :key="i">
                <div class="top">
                    <div class="avatar"></div>
                    <div class="top_content">
                        <div class="name">撒大大实打实/挨打</div>
                        <div class="info">
                            <span>成交量 3244</span>
                            <span>|</span>
                            <span>成交率 95%</span>
                            <div class="time_icon">
                                <img src="/static/img/market/time.png" alt="img">
                            </div>
                            <span>10分钟</span>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="price">
                        <div class="amount">7.18 USD</div>
                        <div>订单限额100-10000</div>
                    </div>
                    <div class="btn">购买</div>
                </div>
            </div>

        </div>
    </div>
</template>

<style lang="less" scoped>
.buycoin_self {
    padding: 0 0.32rem;

    .tabs {
        height: 0.8rem;
        padding-top: 0.2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(59, 130, 246, 0.3);

        .tab {
            margin-right: 0.24rem;
            min-width: 1rem;
            color: #999;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .active_tab {
            color: #000;
            border-bottom: 3px solid #014cfa;
        }

        .icon {
            font-size: 0.28rem;
            height: 0.28rem;
            margin-left: 0.2rem;
        }
    }

    .list {
        .item {
            padding: 0.4rem 0;
            color: #666;
            border-bottom: 1px solid #e8e8e8;

            .top {
                display: flex;
                align-items: flex-start;

                .avatar {
                    width: 0.64rem;
                    height: 0.64rem;
                    border-radius: 50%;
                    background-color: #014cfa;
                    margin-right: 0.24rem;
                }

                .top_content {
                    padding-top: 0.16rem;

                    .name {
                        margin-bottom: 0.2rem;
                        color: #000;
                    }

                    .info {
                        font-size: 0.24rem;
                        display: flex;
                        align-items: center;

                        span {
                            margin-right: 0.1rem;
                        }

                        .time_icon {
                            width: 0.24rem;
                            height: 0.24rem;
                            margin-right: 0.1rem;
                        }
                    }
                }
            }

            .bottom {
                margin-top: 0.4rem;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .price {
                    .amount {
                        color: #000;
                        font-weight: bold;
                        font-size: 0.48rem;
                        margin-bottom: 0.2rem;
                    }
                }

                .btn {
                    width: 40%;
                    height: 0.64rem;
                    border-radius: 0.64rem;
                    background-color: #014cfa;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
    }
}
</style>