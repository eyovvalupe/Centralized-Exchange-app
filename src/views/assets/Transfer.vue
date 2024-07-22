<!-- 划转 -->
<template>
    <div class="page page_trnsfer">
        <Top :title="'划转'">
            <template #right>
                <div class="top-record" @click="goRecord">
                    <div class="top-record-icon">
                        <img src="/static/img/user/withdraw_record_icon.png" alt="img">
                    </div>
                    <span>
                        记录
                    </span>
                </div>
            </template>
        </Top>

        <!-- 表单 -->
        <div class="form">
            <div class="subtitle">从</div>
            <div class="item_box">
                <div class="item account_item">
                    <div class="account_item_icon">
                        <img v-if="form.from == 'money'" src="/static/img/assets/cash_icon.svg" alt="icon">
                        <img v-else :src="`/static/img/crypto/${form.from.toUpperCase()}.svg`" alt="img">
                    </div>
                    <div class="item_content" @click="openDialog('from')">
                        <span>{{ _accountMap[form.from] }}</span>
                        <span class="monty_span" v-if="form.from == 'money'">main</span>
                    </div>
                    <div style="flex:1"></div>
                    <div class="more" @click="openDialog('from')">
                        <img src="/static/img/assets/more.png" alt="more">
                    </div>
                </div>

                <div class="item ipt_item" :class="{ 'err_ipt': errStatus }">
                    <div class="ipt_tip" v-show="form.amount === '' || focus">可用余额 <span>{{ balance }}</span></div>
                    <input @focus="focus = true" @blur="errStatus = focus = false" v-model="form.amount" type="number"
                        :placeholder="``" class="ipt">
                    <div class="btn" @click="maxIpt">全部</div>
                </div>
            </div>


            <div class="trans">
                <div class="line"></div>
                <div class="trans_icon" @click="transAccount" :class="[transing ? 'transing_icon' : 'transing_stop']">
                    <img src="/static/img/assets/transfer.png" alt="img">
                </div>
                <div class="line" style="flex:12"></div>
            </div>

            <div class="subtitle">到</div>
            <div class="item_box">
                <div class="item account_item">
                    <div class="account_item_icon">
                        <img v-if="form.to == 'money'" src="/static/img/crypto/MAIN.png" alt="icon">
                        <img v-else :src="`/static/img/crypto/${form.to.toUpperCase()}.svg`" alt="img">
                    </div>
                    <div class="item_content" @click="openDialog('to')">
                        <span>{{ _accountMap[form.to] }}</span>
                        <span class="monty_span" v-if="form.to == 'money'">main</span>
                    </div>
                    <div style="flex:1"></div>
                    <div class="more" @click="openDialog('to')">
                        <img src="/static/img/assets/more.png" alt="more">
                    </div>
                </div>

                <div class="item ipt_item" style="background-color: #f5f5f5">
                    <div class="ipt">{{ form.amount || '--' }}</div>
                </div>
            </div>

        </div>

        <Button @click="openSafePass" :loading="loading" round color="#014CFA" class="submit" type="primary">确定</Button>

        <!-- 账户选择弹窗 -->
        <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" class="self_van_popup"
            v-model:show="showDialog" position="bottom" teleport="body">
            <div class="transfer_accounr_dialog">
                <div class="close_icon" @click="showDialog = false">
                    <img src="/static/img/common/close.png" alt="x">
                </div>
                <div @click="clickItem(item)" class="transfer_dialog_item"
                    :class="{ 'transfer_dialog_item_active': (clickKey == 'from' ? (form.from == item.key) : (form.to == item.key)) }"
                    v-for="(item, i) in _accountMapList" :key="i">
                    <span>{{ item.value }}</span>

                    <Icon v-if="(clickKey == 'from' ? (form.from == item.key) : (form.to == item.key))"
                        class="check_icon" name="success" />
                </div>
            </div>
        </Popup>

        <!-- 充提记录 -->
        <RecordList ref="RecordListRef" />

        <!-- 安全密码弹窗 -->
        <SafePassword @submit="submit" ref="safeRef" />
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { Button, Popup, Icon, showToast } from "vant"
import { ref, computed } from "vue"
import { _accountMap, _accountMapList } from "@/utils/dataMap"
import store from "@/store"
import SafePassword from "@/components/SafePassword.vue"
import { _transfer } from "@/api/api"
import RecordList from "@/components/RecordList.vue"
import { useRoute } from "vue-router"
import router from "@/router"

const route = useRoute()
const focus = ref(false) // 是否在输入中

// 表单
const loading = ref(false)
const form = ref({
    from: route.query.from || 'money',
    to: route.query.to || 'stock',
    amount: "",
})
const maxIpt = () => {
    form.value.amount = balance.value
}

store.dispatch('updateAssets') // 更新资产
const assets = computed(() => store.state.assets || {})
const wallet = computed(() => store.state.wallet || []) // 钱包
const balance = computed(() => {
    let key = form.value.from
    if (key == 'money') key = 'main'
    const target = wallet.value.find(item => item.currency == key)
    if (target) return target.amount
    return 0
})



// 表单提交
const safeRef = ref()
const errStatus = ref(false)
const openSafePass = () => {
    if (!form.value.amount || form.value.amount <= 0) {
        errStatus.value = true
        return showToast('请输入金额')
    }
    if (balance.value < form.value.amount) {
        return showToast('余额不足')
    }
    safeRef.value.open()
}
const submit = s => {
    const params = {
        ...form.value,
        safeword: s,
        token: sessionToken.value
    }
    if (loading.value) return
    loading.value = true
    _transfer(params).then(res => {
        if (res.code == 200) {
            showToast('划转成功');
            form.value.amount = ''
            store.dispatch('updateAssets') // 更新资产
            setTimeout(() => {
                router.back()
            }, 500)
        }
    }).finally(() => {
        getSessionToken()
        loading.value = false
    })
}


// 弹窗
const transing = ref(false) // 转换动画中
const goTransing = () => {
    transing.value = true
    setTimeout(() => {
        transing.value = false
    }, 500)
}
const transAccount = () => {
    goTransing()
    const to = form.value.to
    form.value.to = form.value.from
    form.value.from = to
}
const showDialog = ref(false)
const clickKey = ref('from') // 从哪里点开弹窗
const openDialog = key => {
    clickKey.value = key
    showDialog.value = true
}
const clickItem = item => { // 选择账户
    if (clickKey.value == 'from') {
        if (item.key == form.value.to) {
            form.value.to = form.value.from
            goTransing()
        }
        form.value.from = item.key
    } else if (clickKey.value == 'to') {
        if (item.key == form.value.from) {
            form.value.from = form.value.to
            goTransing()
        }
        form.value.to = item.key
    }
    showDialog.value = false
}




// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    loading.value = true
    store.dispatch("updateSessionToken").finally(() => {
        loading.value = false
    })
}
getSessionToken()



// 跳转记录
const RecordListRef = ref()
const goRecord = () => {
    // router.push({
    //     name: 'transferRecord'
    // })
    RecordListRef.value && RecordListRef.value.open(2)
}
</script>

<style lang="less" scoped>
.page_trnsfer {
    padding: 1.4rem 0.32rem 1.5rem 0.32rem;

    position: relative;

    .top-record {
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0953fa;
        font-size: 0.24rem;

        .top-record-icon {
            background-color: #EAF0F3;
            width: 0.52rem;
            height: 0.52rem;
            padding: 0.06rem;
            border-radius: 50%;
            margin-right: 0.04rem;
        }

    }

    .form {
        .item_box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 0.88rem;

            &:has(.ipt:focus) {
                height: 1.12rem;
            }
        }

        .item {
            width: 100%;
            height: 100%;
            border: 1px solid #D0D8E2;
            border-radius: 0.12rem;
            padding: 0 0.18rem 0 0.32rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-weight: 400;

            &:has(.ipt:focus) {
                padding-top: 0.3rem;
                border: 1px solid #014CFA;
            }

            .item_pre {
                width: 1rem;
                font-size: 0.32rem;
                color: #707070;
            }

            .item_content {
                font-size: 0.24rem;
                color: #000;
                white-space: nowrap;
                display: flex;
                align-items: flex-end;

                .monty_span {
                    font-size: 0.2rem;
                    margin-left: 0.1rem;
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
                width: 2rem;
            }

            .btn {
                color: #1A59F6;
                font-size: 0.24rem;
                margin: 0 0.24rem;
                white-space: nowrap;
            }
        }

        .ipt_item {
            flex: 6;
            position: relative;

            &:has(.ipt:focus) {
                .ipt_tip {
                    transform: translateY(-200%);
                    font-size: 0.2rem;

                    span {
                        color: #A4ACB9;
                    }
                }
            }

            .ipt_tip {
                position: absolute;
                font-size: 0.24rem;
                font-weight: 400;
                color: #A4ACB9;
                left: 0.32rem;
                top: 50%;
                transform: translateY(-50%);
                pointer-events: none;
                transition: all ease .2s;

                span {
                    // color: #111111;
                }
            }


        }

        .err_ipt {
            border: 1px solid #E8503A;
        }

        .account_item {
            height: 100% !important;
            flex: 4;
            margin-right: 0.2rem;

            .account_item_icon {
                width: 0.3rem;
                height: 0.3rem;
                margin-right: 0.1rem;
            }
        }

        .trans {
            margin: 0.56rem 0 0.26rem 0;
            padding: 0 0.2rem;
            display: flex;
            align-items: center;

            .trans_icon {
                width: 0.8rem;
                height: 0.8rem;
                margin: 0 0.48rem;
            }

            .transing_icon {
                transition: all ease .5s;
                transform: rotate(360deg);
            }

            .transing_stop {
                transition: none;
                transform: rotate(0deg);
            }

            .line {
                flex: 1;
                height: 1px;
                background-color: rgba(59, 130, 246, 0.1);
            }
        }

        .subtitle {
            font-size: 0.28rem;
            color: #333333;
            font-weight: 400;
            line-height: 0.36rem;
            margin: 0.4rem 0 0.12rem 0;
        }

        .tip {
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
        margin: 2.4rem 0 0.4rem 0;
    }
}
</style>

<style lang="less" scoped>
.transfer_accounr_dialog {
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

    .transfer_dialog_item {
        overflow: auto;
        height: 1.12rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #F5F5F5;
    }

    .transfer_dialog_item_active {
        color: #014CFA;
        font-weight: 600;

        .check_icon {
            position: absolute;
            right: 0.64rem;
            color: #014CFA;
            font-size: 0.28rem;
        }
    }
}
</style>