<!-- 划转 -->
<template>
    <div class="page page_trnsfer">
        <Top :title="'划转'" />

        <!-- 表单 -->
        <div class="form">
            <div class="item" @click="openDialog('from')">
                <div class="item_pre">从</div>
                <div class="item_content">{{ _accountMap[form.from] }}</div>
                <div class="more">
                    <img src="/static/img/assets/more.png" alt="more">
                </div>
            </div>

            <div class="trans">
                <div class="line"></div>
                <div class="trans_icon" @click="transAccount" :class="[transing ? 'transing_icon' : 'transing_stop']">
                    <img src="/static/img/assets/transfer.png" alt="img">
                </div>
                <div class="line"></div>
            </div>

            <div class="item" @click="openDialog('to')">
                <div class="item_pre">到</div>
                <div class="item_content">{{ _accountMap[form.to] }}</div>
                <div class="more">
                    <img src="/static/img/assets/more.png" alt="more">
                </div>
            </div>

            <div class="subtitle">数量</div>
            <div class="item">
                <input v-model="form.amount" type="number" placeholder="请输入" class="ipt">
                <div class="btn" @click="maxIpt">最大</div>
            </div>
            <div class="tip">
                <span>最多可转</span>
                <span class="num">{{ balance }}</span>
            </div>
        </div>

        <Button @click="openSafePass" :loading="loading" :disabled="!disabled" round color="#014CFA" class="submit"
            type="primary">确定</Button>

        <!-- 账户选择弹窗 -->
        <Popup class="self_van_popup" v-model:show="showDialog" position="bottom" teleport="body"
            :safe-area-inset-bottom="true">
            <div class="transfer_accounr_dialog">
                <div class="close_icon">
                    <img src="/static/img/common/close.png" alt="x">
                </div>
                <div @click="clickItem(item)" class="transfer_dialog_item" v-for="(item, i) in showAccountMapList"
                    :key="i">
                    {{ item.value }}
                </div>
            </div>
        </Popup>

        <!-- 安全密码弹窗 -->
        <SafePassword @submit="submit" ref="safeRef" />
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { Button, Popup, showNotify } from "vant"
import { ref, computed } from "vue"
import { _accountMap, _accountMapList } from "@/utils/dataMap"
import store from "@/store"
import SafePassword from "@/components/SafePassword.vue"
import { _transfer } from "@/api/api"

const assets = computed(() => store.state.assets || {})
const balance = computed(() => {
    return assets.value[form.value.from] || 0
})
console.error(assets.value)

// 表单
const loading = ref(false)
const disabled = computed(() => {
    return !(balance.value && balance.value >= form.value.amount)
})
const form = ref({
    from: 'money',
    to: 'stock',
    amount: "",
})
const maxIpt = () => {
    form.value.amount = balance.value
}

// 表单提交
const safeRef = ref()
const openSafePass = () => {
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
            showNotify({ type: 'success', message: '划转成功' });
            form.value.amount = ''
            store.dispatch('updateAssets') // 更新资产
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
const showAccountMapList = computed(() => {
    const filterKey = clickKey.value == 'from' ? form.value.from : form.value.to
    return _accountMapList.filter(item => item.key != filterKey)
})
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
</script>

<style lang="less" scoped>
.page_trnsfer {
    padding: 1.4rem 0.32rem 1.5rem 0.32rem;

    position: relative;

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
                flex: 1;
                font-size: 0.28rem;
                color: #000;
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

        .trans {
            margin: 0.26rem 0 0.46rem 0;
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
            margin: 0.9rem 0 0.12rem 0;
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
        margin: 1.2rem 0 0.4rem 0;
    }
}
</style>

<style lang="less" scoped>
.transfer_accounr_dialog {
    background-color: #fff;
    border-top-left-radius: 0.4rem;
    border-top-right-radius: 0.4rem;
    overflow: hidden;
    padding: 0.68rem 0.32rem 0.8rem 0.32rem;
    position: relative;

    .close_icon {
        position: absolute;
        width: 0.4rem;
        height: 0.4rem;
        top: 0.24rem;
        right: 0.32rem;
    }

    .transfer_dialog_item {
        height: 1.12rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #F5F5F5;
    }
}
</style>