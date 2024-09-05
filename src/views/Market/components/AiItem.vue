<!-- ai交易元素 -->
<template>
    <div class="ai_item">
        <div class="title">BTC/USDT</div>
        <div class="tip">
            <div class="tip_member">
                <div class="tip_icon">
                    <img src="/static/img/common/member.png" alt="icon">
                </div>
                <span>4</span>
            </div>
            <div>最大网格24</div>
        </div>

        <div>盈亏（USDT）</div>
        <div class="amount down">23424.32</div>

        <div class="table">
            <div class="td">
                <div class="td_title">历史收益率</div>
                <div>24.56%</div>
            </div>
            <div class="td">
                <div class="td_title">24小时收益率</div>
                <div>24.56%</div>
            </div>
            <div class="td" style="align-items: flex-end">
                <div class="td_title">最小投资金额</div>
                <div>288</div>
            </div>
            <div class="td" style="margin-top: 0.4rem;">
                <div class="td_title">运行时间</div>
                <div>7天12时18分</div>
            </div>
            <div class="btns" style="margin-top: 0.4rem;">
                <div class="btn">交易</div>
            </div>
        </div>


        <!-- 图表 -->
        <div class="canvas"></div>
    </div>
</template>

<script setup></script>

<style lang="less" scoped>
.ai_item {
    padding: 0.32rem;
    border-radius: 0.44rem;
    border: 1px solid #ECECEC;
    font-size: 0.28rem;
    color: #333333;
    margin-bottom: 0.32rem;
    position: relative;

    .canvas {
        position: absolute;
        width: 3rem;
        height: 1.5rem;
        border: 1px solid #eee;
        right: 0.32rem;
        top: 0.9rem;
    }


    .title {
        color: #0D0D12;
        font-size: 0.32rem;
        font-weight: bold;
        margin-bottom: 0.1rem;
    }

    .tip {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: #8F8F8F;
        margin-bottom: 0.44rem;

        .tip_member {
            display: flex;
            align-items: center;
            height: 0.36rem;
            padding: 0 0.2rem;
            border-radius: 0.18rem;
            background-color: rgba(248, 154, 41, 0.08);
            font-size: 0.24rem;
            color: #F89A29;
            margin-right: 0.2rem;

            .tip_icon {
                width: 0.2rem;
                height: 0.2rem;
                margin-right: 0.1rem;
            }
        }
    }

    .amount {
        font-size: 0.48rem;
        font-weight: bold;
        margin: 0.2rem 0 0.44rem 0;
    }

    .table {
        display: flex;
        align-items: stretch;
        flex-wrap: wrap;

        .td {
            width: 32%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;

            .td_title {
                color: #6C7B90;
                margin-bottom: 0.2rem;
            }
        }

        .btns {
            flex: 1;
            padding: 0.1rem 0.48rem 0 0.48rem;

            .btn {
                height: 0.64rem;
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 0.32rem;
                background-color: #014CFA;
            }
        }
    }
}
</style>