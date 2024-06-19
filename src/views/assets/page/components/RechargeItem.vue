<!-- 充值记录-元素 -->
<template>
    <div class="recharge_item">
        <div class="name">
            <div>USDT/加密货币</div>
            <div class="time">04-08 10:00:00</div>
        </div>
        <div class="status">成功</div>
        <div class="num">+2342342.00</div>
    </div>
</template>

<style lang="less" scoped>
.recharge_item {
    width: 100%;
    border-bottom: 1px solid #EAEAEA;
    height: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .name {
        font-weight: 600;
        color: #36394C;
        font-size: 0.28rem;
        line-height: 0.42rem;

        .time {
            font-size: 0.24rem;
            font-weight: 400;
            line-height: 0.36rem;
            color: #919193;
            margin-top: 0.1rem;
        }
    }

    .status {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 0.3rem;
        height: 0.44rem;
        background-color: rgba(60, 60, 60, 0.08);
        color: #3C3C3C;
    }

    .status_success {
        color: #E8503A;
        background-color: rgba(232, 80, 58, 0.08)
    }

    .status_error {
        color: #014CFA;
        background-color: rgba(1, 76, 250, 0.08);
    }

    .num {
        color: #000000;
        font-size: 0.32rem;
    }
}
</style>