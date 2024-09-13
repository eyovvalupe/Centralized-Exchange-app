<!-- 订单列表 -->
<template>
    <div class="buycoin_list">
        <div class="list">

            <div class="item">
                <div class="left">
                    <div style="margin-bottom: 0.2rem;">
                        <span class="type">购入 USDT</span>
                        <span>1000</span>
                    </div>
                    <div class="no">2423423423423423424</div>
                </div>
                <div class="right">
                    <div class="amount">00:18:12</div>
                    <div>等待付款</div>
                </div>
            </div>
            <div class="item">
                <div class="left">
                    <div style="margin-bottom: 0.2rem;">
                        <span class="type">购入 USDT</span>
                        <span>1000</span>
                    </div>
                    <div class="no">2423423423423423424</div>
                </div>
                <div class="right">
                    <div class="amount down">-2342</div>
                    <div>USD</div>
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
            border-bottom: 1px solid #e8e8e8;
            display: flex;
            align-items: stretch;

            .left {
                flex: 1;

                .type {
                    font-weight: bold;
                    font-size: 0.32rem;
                    margin-right: 0.4rem;

                }

                .no {
                    font-size: 0.24rem;
                    color: #999;
                }
            }

            .right {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                justify-content: space-between;

                .amount {
                    font-size: 0.32rem;
                    font-weight: bold;
                }
            }
        }
    }
}
</style>