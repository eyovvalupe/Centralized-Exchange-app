<!-- 买币 -->
<template>
    <div class="page page-coinbuy">
        <div class="tr th">
            <div class="td td_left">名称/交易量</div>
            <div class="td">价格</div>
            <div class="td td_right">24小时涨跌</div>
        </div>
        <div class="coinbuy_content">
            <div class="tr" v-for="i in 20">
                <div class="td td_left">
                    <div>
                        <span class="amount">BTC</span>
                        <span> / USDT</span>
                    </div>
                    <div style="display: flex;align-items: center;justify-content: flex-start;margin-top: 0.15rem;">
                        <div class="x">10X</div>
                        <span>Val:243b</span>
                    </div>
                </div>
                <div class="td">
                    <span class="amount" style="font-size: 0.28rem;">$3966.520</span>
                </div>
                <div class="td td_right">
                    <span class="amount down">6868</span>
                    <div class="percent down_bg">-0.70%</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="less" scoped>
.page-coinbuy {


    .tr {
        border-bottom: 1px solid #E8E8E8;
        display: flex;
        align-items: center;
        padding: 0.2rem 0;

        .td {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #9EA3AE;
            font-size: 0.24rem;

            .amount {
                color: #333;
                font-weight: bold;
            }

            .x {
                color: #014CFA;
                background-color: #EEF3FE;
                border-radius: 0.04rem;
                padding: 0.04rem 0.08rem;
                margin-right: 0.16rem;
            }

            .percent {
                padding: 0.08rem 0.2rem;
                border-radius: 0.08rem;
                color: #fff;
                margin-top: 0.08rem;
            }
        }

        .td_left {
            align-items: flex-start;
        }

        .td_right {
            align-items: flex-end;
        }
    }

    .coinbuy_content {
        padding: 0 0.32rem;
    }

    .th {
        padding: 0.24rem 0.32rem;
    }
}
</style>