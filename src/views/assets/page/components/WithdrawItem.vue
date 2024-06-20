<!-- 提现记录-元素 -->
<template>
    <div class="withdraw_item">
        <div class="icon">
            <img src="/static/img/crypto/USDT.png" alt="icon">
        </div>
        <div style="flex:1;text-align: left;">
            <div class="name">充值USDT</div>
            <div class="date">2024/04/14</div>
        </div>
        <div style="text-align: left;">
            <div class="rate">查看汇率 →</div>
            <div class="date">15:00:18</div>
        </div>
        <div style="flex:1;display: flex;flex-direction: column;align-items: flex-end;">
            <div class="status">未知</div>
            <div class="num">+23424.00</div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.withdraw_item {
    width: 100%;
    border-bottom: 1px solid #EAEAEA;
    height: 1.4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 400;

    .icon {
        width: 0.5rem;
        height: 0.5rem;
        margin-right: 0.4rem;
    }

    .name {
        color: #061023;
        font-size: 0.32rem;
        line-height: 0.44rem;
    }

    .rate {
        color: #1A59F6;
        font-size: 0.28rem;
        line-height: 0.44rem;
    }

    .date {
        color: #8F92A1;
        font-size: 0.24rem;
        line-height: 0.3rem;
        margin-top: 0.08rem;
    }

    .num {
        font-size: 0.32rem;
        line-height: 0.48rem;
        color: #E8503A;
        margin-top: 0.08rem;
    }

    .status {
        height: 0.44rem;
        padding: 0 0.3rem;
        color: rgba(60, 60, 60, 1);
        background-color: rgba(60, 60, 60, 0.08);
        display: inline-flex;
        align-items: center;
    }

    .status_1 {
        color: rgba(1, 76, 250, 1);
        background-color: rgba(1, 76, 250, 0.08);
    }

    .status_2 {
        color: rgba(232, 80, 58, 1);
        background-color: rgba(232, 80, 58, 0.08);
    }

    .status_3 {
        color: rgba(25, 192, 154, 1);
        background-color: rgba(25, 192, 154, 0.08);
    }
}
</style>