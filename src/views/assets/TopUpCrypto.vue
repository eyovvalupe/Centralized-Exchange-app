<!-- 充值-虚拟货币 -->
<template>
    <div class="page page_topup_crypto">
        <Top :title="'充值'">
            <template #right>
                <div class="top-record" @click="goRecord">
                    <img src="/static/img/user/withdraw_record_icon.png" alt="img">
                </div>
            </template>
        </Top>

        <div class="form">
            <div class="subtitle">币种</div>
            <div class="item">
                <div class="select_item border_item" @click="showDialog = true">
                    <div class="currency">
                        <div class="currency_icon">
                            <img :src="`/static/img/crypto/${form.currency.toUpperCase()}.png`" alt="currency">
                        </div>
                        <span>{{ form.currency.toUpperCase() }}</span>
                    </div>
                    <div class="more">
                        <img src="/static/img/assets/more.png" alt="more">
                    </div>
                </div>
                <div class="select_item border_item" style="margin-left: 0.6rem" @click="showNetDialog = true">
                    <div class="currency">
                        <span>{{ form.network.toUpperCase() }}</span>
                    </div>
                    <div class="more">
                        <img src="/static/img/assets/more.png" alt="more">
                    </div>
                </div>
            </div>

            <div class="subtitle">充值金额</div>
            <div class="item border_item">
                <div class="item_content">
                    <input class="ipt" type="number" v-model="form.amount" placeholder="请输入">
                </div>
                <div>{{ form.currency.toUpperCase() }}</div>
            </div>

            <div class="border_item act_body">
                <div>活动内容</div>
                <div>这里是配置的活动内容</div>
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
                <div @click="clickItem(item)" class="swap_dialog_item"
                    :class="{ 'swap_dialog_item_active': form.currency == item.currency }" v-for="(item, i) in wallet"
                    :key="i">
                    <div class="icon">
                        <img :src="`/static/img/crypto/${item.currency.toUpperCase()}.png`" alt="currency">
                    </div>
                    <span>{{ item.currency.toUpperCase() }}</span>

                    <Icon v-if="form.currency == item.currency" class="check_icon" name="success" />
                </div>
            </div>
        </Popup>

        <!-- 账户种类选择弹窗 -->
        <Popup class="self_van_popup" v-model:show="showNetDialog" position="bottom" teleport="body"
            :safe-area-inset-bottom="true">
            <div class="topup_accounr_dialog">
                <div class="close_icon" @click="showNetDialog = false">
                    <img src="/static/img/common/close.png" alt="x">
                </div>
                <div @click="clickNetItem(item)" class="swap_dialog_item"
                    :class="{ 'swap_dialog_item_active': form.network == item }" v-for="(item, i) in _networkMapList"
                    :key="i">
                    <span>{{ item.toUpperCase() }}</span>

                    <Icon v-if="form.network == item" class="check_icon" name="success" />
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
import { Popup, Button, Icon } from "vant"
import { useRoute } from "vue-router"
import { _networkMapList } from "@/utils/dataMap.js"

const route = useRoute()
const loading = ref(false)
const disabled = computed(() => {
    return !(form.value.amount && form.value.amount > 0)
})
// 表单
const form = ref({
    amount: '',
    currency: '',
    network: _networkMapList[0],
})

// 货币选择
const showDialog = ref(false)
// 钱包
const wallet = computed(() => { // 可选钱包列表
    return store.state.wallet.filter(item => !['stock', 'contract', 'main'].includes(item.currency)) || []
})
form.value.currency = route.query.currency || wallet.value.length > 0 && wallet.value[0].currency || 'BTC' // 初始化默认币种
const clickItem = item => {
    form.value.currency = item.currency
    showDialog.value = false
}

// 网络选择
const showNetDialog = ref(false)
const clickNetItem = item => {
    form.value.network = item
    showNetDialog.value = false
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
            currency: form.value.currency,
            network: form.value.network,
        }
    })
}
</script>

<style lang="less" scoped>
.page_topup_crypto {
    padding: 1rem 0.32rem 1.5rem 0.32rem;

    position: relative;

    .top-record {
        width: 0.64rem;
        height: 0.64rem;
        border-radius: 50%;
        background-color: #EAF0F3;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            width: 0.36rem !important;
            height: 0.36rem !important;
        }
    }

    .form {
        margin-top: 0.5rem;

        .item {
            width: 100%;
            height: 1.12rem;
            margin-bottom: 0.6rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-weight: 400;

            .item_pre {
                width: 1rem;
                font-size: 0.28rem;
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

                .ipt {
                    width: 100%;
                    height: 100%;
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
        }

        .border_item {
            border-radius: 0.12rem;
            border: 1px solid #D0D8E2;
            padding: 0 0.4rem 0 0.76rem;

            &:has(.ipt:focus) {
                border: 1px solid #014CFA;
            }
        }

        .select_item {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 100%;
        }

        .subtitle {
            font-size: 0.28rem;
            color: #333333;
            font-weight: 400;
            line-height: 0.36rem;
            margin: 0rem 0 0.12rem 0;
        }

        .act_body {
            padding: 0.4rem;
            font-size: 0.28rem;
            line-height: 0.36rem;
        }
    }

    .submit {
        width: calc(100% - 0.64rem);
        height: 1.12rem;
        position: absolute;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
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
        line-height: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #F5F5F5;
        overflow: hidden;
        position: relative;

        .icon {
            width: 0.4rem;
            height: 0.4rem;
            margin-right: 0.24rem;
        }
    }

    .swap_dialog_item_active {
        color: #014CFA;
        font-weight: 600;

        .check_icon {
            position: absolute;
            right: 0.24rem;
            color: #014CFA;
            font-size: 0.28rem;
        }
    }
}
</style>