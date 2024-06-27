<!-- 充值 -->
<template>
    <div class="page page_topup">
        <Top :title="'充值'">
            <template #right>
                <div class="top-record" @click="goRecord">
                    <img src="/static/img/user/record.png" alt="img">
                </div>
            </template>
        </Top>


        <Tabs v-model:active="active" shrink>
            <Tab title="虚拟货币"></Tab>
            <Tab title="银行卡" disabled></Tab>
        </Tabs>

        <div class="form">
            <div class="subtitle">充值金额</div>
            <div class="item">
                <div class="item_content">
                    <input type="number" v-model="form.amount" placeholder="请输入">
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
                    <span class="num">{{ loading ? '--' : fee }}</span>
                </div>
            </div>

        </div>

        <Button @click="goTopUp" :loading="loading" :disabled="disabled" round color="#014CFA" class="submit"
            type="primary">确定</Button>


        <!-- 账户种类选择弹窗 -->
        <Popup class="self_van_popup" v-model:show="showDialog" position="bottom" teleport="body"
            :safe-area-inset-bottom="true">
            <div class="topup_accounr_dialog">
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
import router from "@/router"
import { ref, computed } from "vue"
import store from "@/store";
import { Popup, Button, Tabs, Tab } from "vant"
import { useRoute } from "vue-router"

const active = ref(0)
const route = useRoute()

const loading = ref(false)
const disabled = computed(() => {
    return !(form.value.amount && form.value.amount > 0)
})
// 表单
const form = ref({
    amount: '',
    from: ''
})
// 手续费
const fee = ref('--')

// 货币选择
const showDialog = ref(false)
// 钱包
const wallet = computed(() => { // 可选钱包列表
    return store.state.wallet.filter(item => !['stock', 'contract', 'main', form.value.from].includes(item.currency)) || []
})
form.value.from = route.query.currency || wallet.value[0].currency // 初始化默认币种
const clickItem = item => {
    form.value.from = item.currency
    showDialog.value = false
}

const goRecord = () => {
    router.push({
        name: 'topUpRecord'
    })
}
const goTopUp = () => {
    router.push({
        name: 'recharging',
        query: {
            amount: form.value.amount,
            currency: form.value.from,
        }
    })
}
</script>

<style lang="less" scoped>
.page_topup {
    padding: 1.4rem 0.32rem 1.5rem 0.32rem;

    position: relative;

    .top-record {
        width: 0.4rem;
        height: 0.4rem;
    }

    .form {
        margin-top: 0.5rem;

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
        margin: 3.2rem 0 0.4rem 0;
    }
}
</style>
<style lang="less" scoped>
.topup_accounr_dialog {
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

    .search_box {
        height: 0.8rem;
        background-color: #F5F5F5;
        border-radius: 0.4rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.32rem;
        padding: 0 0.4rem;

        input {
            flex: 1;
            color: #121826;
        }
    }

    .list {
        max-height: 50vh;
        overflow-y: auto;

        .add_account {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.4rem 0;
        }
    }

    .dialog_account_item {
        position: relative;
        background: linear-gradient(161.26deg, #FFA498 -25.84%, #FF4747 106.1%);
        padding: 0.28rem 0.28rem 0.24rem 0.32rem;
        color: #fff;
        flex: 1;
        border-radius: 0.16rem;
        margin-top: 0.4rem;

        .name {
            font-size: 0.36rem;
            margin-bottom: 0.2rem;
        }

        .code {
            font-size: 0.28rem;
        }

        .logo {
            width: 0.8rem;
            height: 0.8rem;
            right: 0.3rem;
            top: 0.28rem;
            position: absolute;
        }
    }

}
</style>