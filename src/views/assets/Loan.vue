<!-- 借贷 -->
<template>
    <div class="page page_loadn">
        <Top :title="'借贷'">
            <template #right>
                <div class="top-record" @click="goRecord">
                    <img src="/static/img/user/record.png" alt="img">
                </div>
            </template>
        </Top>

        <!-- 表单 -->
        <div class="form">
            <div class="subtitle">借款抵押</div>
            <div class="item">
                <input class="ipt" type="number" placeholder="请输入">
                <span class="all">全部</span>
                <div class="item_icon">
                    <img src="/static/img/crypto/MAIN.png" alt="img">
                </div>
                <span>MAIN</span>
            </div>
            <div class="tip">
                <span>最大可抵押</span>
                <span class="num">100</span>
            </div>
            <div class="subtitle">借款金额</div>
            <div class="subtitle">期限</div>
            <div class="tip">
                <span>手续费</span>
                <span class="num">100</span>
            </div>
            <div class="tip">
                <span>隔夜利息</span>
                <span class="num">100</span>
            </div>
            <div class="tip">
                <span>2022-02-02 归还</span>
                <span class="num">100</span>
            </div>
        </div>

    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { _loanPara } from "@/api/api"


// 获取借贷配置
const getConfig = () => {
    _loanPara().then(res => {
        console.error(res)
    })
}

// 查看记录
const goRecord = () => {

}
</script>

<style lang="less" scoped>
.page_loadn {
    padding: 1.4rem 0.32rem 1.5rem 0.32rem;

    position: relative;

    .top-record {
        width: 0.4rem;
        height: 0.4rem;
    }

    .form {
        .subtitle {
            color: #333333;
            font-size: 0.28rem;
            font-weight: 400;
            margin-bottom: 0.12rem;
        }

        .tip {
            font-size: 0.24rem;
            line-height: 0.4rem;
            color: #999;
            font-weight: 400;

            .num {
                color: #181818;
                margin-left: 0.08rem;
                font-size: 0.28rem;
                font-weight: 500
            }
        }
    }
}
</style>