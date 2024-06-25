<!-- 提现 -->
<template>
    <div class="page page_withdraw">
        <Top :title="'提现'">
            <template #right>
                <div class="top-record" @click="goRecord">
                    <img src="/static/img/user/record.png" alt="img">
                </div>
            </template>
        </Top>

        <div class="form">
            <div class="subtitle">金额</div>
            <div class="item">
                <div class="item_content">
                    <input type="number" v-model="form.amount" placeholder="请输入">
                    <span class="all" @click="maxIpt">全部</span>
                </div>
                <div class="currency" @click="showDialog = true">
                    <div class="currency_icon">
                        <img :src="`/static/img/crypto/${form.from.toUpperCase()}.png`" alt="currency">
                    </div>
                    <span>{{ form.from.toUpperCase() }}</span>
                </div>
                <div class="more" @click="showDialog = true">
                    <img src="/static/img/assets/more.png" alt="more">
                </div>
            </div>
            <div class="tip">
                <div>
                    <span>手续费: </span>
                    <span class="num">--</span>
                </div>
                <div>
                    <span>可用余额: </span>
                    <span class="num">{{ balance }}</span>
                </div>
            </div>
        </div>

        <Button :loading="loading" :disabled="disabled" round color="#014CFA" class="submit" type="primary">确定</Button>


        <!-- 账户选择弹窗 -->
        <Popup class="self_van_popup" v-model:show="showDialog" position="bottom" teleport="body"
            :safe-area-inset-bottom="true">
            <div class="withdraw_accounr_dialog">
                <div class="close_icon" @click="showDialog = false">
                    <img src="/static/img/common/close.png" alt="x">
                </div>
                <div @click="clickItem(item)" class="swap_dialog_item" v-for="(item, i) in wallet" :key="i">
                    <div class="icon">
                        <img :src="`/static/img/crypto/${item.currency.toUpperCase()}.png`" alt="currency">
                    </div>
                    <span>{{ item.currency.toUpperCase() }}</span>
                </div>
            </div>
        </Popup>
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { ref, computed } from "vue"
import store from "@/store"
import { Button, Popup, showNotify } from "vant"

const loading = ref(false)
const disabled = computed(() => {
    return false
})

// 钱包
const wallet = computed(() => { // 可选钱包列表
    return store.state.wallet.filter(item => !['stock', 'contract', form.value.from].includes(item.currency)) || []
})
const balance = computed(() => { // main钱包余额
    let b = 0
    const main = store.state.wallet.find(item => item.currency == form.value.from)
    if (main) b = main.amount
    return b
})

// 收款方式
// store.dispatch('updateAccountList')
const accountList = computed(() => store.state.accountList || []) // 收款方式列表

console.error('收款方式', accountList.value)

// 表单
const form = ref({
    amount: '',
    from: 'main',
})
const maxIpt = () => {
    form.value.amount = balance.value
}



// 账户弹窗
const showDialog = ref(false)
const clickItem = item => {
    form.value.from = item.currency
    showDialog.value = false
}


// 跳转记录
const goRecord = () => {
    // router.push({
    //     name: 'swapRecord'
    // })
}
</script>

<style lang="less" scoped>
.page_withdraw {
    padding: 1.4rem 0.32rem 1.5rem 0.32rem;

    position: relative;

    .top-record {
        width: 0.4rem;
        height: 0.4rem;
    }

    .form {
        .item {
            width: 100%;
            height: 1.12rem;
            border: 1px solid #D0D8E2;
            border-radius: 0.32rem;
            padding: 0 0.4rem 0 0.76rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-weight: 400;

            .item_pre {
                width: 1rem;
                font-size: 0.32rem;
                color: #707070;
            }

            .item_content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex: 1;
                font-size: 0.28rem;
                color: #000;
                position: relative;
                line-height: 0.28rem;
                height: 100%;

                .all {
                    color: #1A59F6;
                    position: absolute;
                    right: 0.24rem;
                }
            }

            .currency {
                display: flex;
                align-items: center;
                margin-right: 0.24rem;
                line-height: 0;

                .currency_icon {
                    width: 0.56rem;
                    height: 0.56rem;
                    margin-right: 0.12rem;
                }
            }

            .more {
                width: 0.32rem;
                height: 0.32rem;
            }

            .ipt {
                flex: 1;
                color: #292929;
                font-size: 0.28rem;
            }

            .btn {
                color: #1A59F6;
                font-size: 0.28rem;
                margin-left: 0.4rem;
            }
        }

        .subtitle {
            font-size: 0.28rem;
            color: #333333;
            font-weight: 400;
            line-height: 0.36rem;
            margin: 0rem 0 0.12rem 0;
        }

        .tip {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-weight: 400;
            font-size: 0.24rem;
            color: #707070;
            line-height: 0.4rem;
            margin-top: 0.12rem;

            .num {
                color: #333333;
                margin-left: 0.04rem;
                font-weight: 500;
            }

        }
    }

    .submit {
        width: 100%;
        height: 1.12rem;
        margin: 1.2rem 0 0.4rem 0;
    }
}
</style>
<style lang="less" scoped>
.withdraw_accounr_dialog {
    background-color: #fff;
    border-top-left-radius: 0.4rem;
    border-top-right-radius: 0.4rem;
    overflow: hidden;
    padding: 0.86rem 0.32rem 0.8rem 0.32rem;
    position: relative;

    .close_icon {
        position: absolute;
        width: 0.4rem;
        height: 0.4rem;
        top: 0.24rem;
        right: 0.32rem;
    }

    .swap_dialog_item {
        height: 1.12rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #F5F5F5;
        overflow: hidden;

        .icon {
            width: 0.4rem;
            height: 0.4rem;
            margin-right: 0.24rem;
        }
    }


}
</style>