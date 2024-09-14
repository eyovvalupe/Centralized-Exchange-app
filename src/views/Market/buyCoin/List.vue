<!-- 订单列表 -->
<template>
    <div class="buycoin_list">
        <div class="list">

            <div class="item">

                <div class="avatar">
                    <img src="/static/img/crypto/USDT.png" alt="coin">
                </div>

                <div class="left">
                    <div style="margin-bottom: 0.2rem;">
                        <span class="type">购入 USDT</span>
                        <span>1000</span>
                    </div>
                    <div class="no">2423423423423423424</div>
                </div>
                <div class="right">
                    <div class="right_top">
                        <div class="amount">00:18:12</div>
                    </div>
                    <div class="status status-w">等待付款</div>
                </div>
            </div>
            <div class="item">
                <div class="avatar">
                    <img src="/static/img/crypto/USDT.png" alt="coin">
                </div>
                <div class="left">
                    <div style="margin-bottom: 0.2rem;">
                        <span class="type">购入 USDT</span>
                        <span>1000</span>
                    </div>
                    <div class="no">2423423423423423424</div>
                </div>
                <div class="right">
                    <div class="right_top">
                        <div class="amount down">-3242</div>
                        <div class="unit">USDT</div>
                    </div>
                    <div class="status">取消</div>
                </div>
            </div>

        </div>
    </div>
</template>

<style lang="less" scoped>
.buycoin_list {
    .list {
        padding: 0.2rem 0.32rem;

        .item {
            padding: 0.24rem 0.32rem;
            border-bottom: 1px dashed #e8e8e8;
            display: flex;
            align-items: center;
            line-height: 0.36rem;

            .avatar {
                width: 0.64rem;
                height: 0.64rem;
                margin-right: 0.4rem;
            }

            .left {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: space-between;

                .type {
                    margin-right: 0.32rem;
                    color: #000;
                }

                .no {
                    font-size: 0.24rem;
                    color: #999;
                    padding: 0.05rem 0;
                }
            }

            .right {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                justify-content: space-between;

                .right_top {
                    display: flex;
                    align-items: center;
                }

                .amount {
                    font-size: 0.36rem;
                    font-weight: bold;
                }

                .unit {
                    margin-left: 0.1rem;
                }

                .status {
                    margin-top: 0.24rem;
                    font-size: 0.24rem;
                    padding: 0.05rem 0.32rem;
                    background-color: #F6F6F6;
                    color: #888888;
                }

                .status-w {
                    color: #FFAF2A;
                    background-color: #FFFAF2;
                }

                .status-s {
                    color: #30BF87;
                    background-color: #EBFEED;
                }
            }
        }
    }
}
</style>