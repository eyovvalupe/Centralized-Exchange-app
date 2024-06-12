<!-- 身份认证1 -->
<template>
    <div class="kyc_1">
        <Top :title="''">
            <!-- 从注册来的 -->
            <template #right v-if="from == 'register'">
                <span @click="nextStep" style="color: #014CFA;font-weight: 400;font-size: 0.28rem;">跳过</span>
            </template>
            <!-- 提交过认证信息 -->
            <template #right v-if="kycInfo.name">
                <div class="kyc_status">
                    <div class="icon">
                        <img class="status_icon" src="/static/img/user/record.png" alt="⚪">
                    </div>
                    <span class="status" v-if="kycInfo.status == 'none'">审核中</span>
                    <span class="status status_pass" v-if="kycInfo.status == 'success'">审核通过</span>
                    <span class="status status_fail" v-if="kycInfo.status == 'failed'">审核失败</span>
                </div>
            </template>
        </Top>

        <div class="title">验证您的身份</div>
        <div class="tip">根据金融法规，我们需要询问这个问题，确保您的详细信息与您的政府签发的身份证件完全匹配。</div>

        <div class="subtitle">法定姓名</div>
        <div class="item">
            <input v-model.trim="form.name" class="ipt" type="text" placeholder="法定姓名" maxlength="20">
        </div>
        <div class="subtitle">证件号码</div>
        <div class="item">
            <input v-model.trim="form.idnum" class="ipt" type="text" placeholder="证件号码" maxlength="20">
        </div>
        <div class="subtitle">出生日期</div>
        <div class="item" @click="showBottom = true">{{ form.birthday }}</div>

        <Button v-if="!pageLoading && !kycInfo.name" @click="submit" :loading="loading" :disabled="disabled" round
            color="#014CFA" class="submit" type="primary">继续</Button>
        <Button v-if="!pageLoading && kycInfo.name && kycInfo.status == 'success'" round color="#014CFA" class="submit"
            type="primary" @click="next">继续</Button>


        <!-- 日期选择 -->
        <Popup v-model:show="showBottom" position="bottom">
            <DatePicker @cancel="cancelDate" @confirm="confirmDate" v-model="currentDate" title="选择日期"
                :min-date="minDate" :max-date="maxDate" />
        </Popup>
    </div>
</template>

<script setup>
import Top from '@/components/Top.vue';
import { Button, Popup, DatePicker, showLoadingToast, closeToast, showNotify } from "vant"
import { ref, computed } from 'vue'
import { _kyc1, _kycGet } from "@/api/api"
import router from '@/router';
import store from '@/store';
import { useRoute } from "vue-router"

const route = useRoute()
const from = ref(route.query.from) // 'register'-表示从注册来

const userInfo = computed(() => store.state.userInfo || {})

const loading = ref(false)
const disabled = computed(() => {
    return !(form.value.name && form.value.idnum && form.value.birthday)
})
const showBottom = ref(false)
const maxDate = ref(new Date())
const minDate = ref(new Date(Date.now() - 365 * 100 * 24 * 60 * 60 * 1000))
const currentDate = ref([maxDate.value.getFullYear() - 18, '01', '01'])

const cancelDate = () => {
    showBottom.value = false
}
const confirmDate = (val) => {
    const { selectedValues } = val
    form.value.birthday = selectedValues.join(',')
    showBottom.value = false
}

const form = ref({
    name: '',
    idtype: '身份证',
    idnum: '',
    birthday: '',
})

const submit = () => {
    if (loading.value) return
    loading.value = true
    _kyc1(form.value).then(res => {
        if (res.code == 200) {
            if (from.value == 'register') {
                setTimeout(() => {
                    showNotify({ type: 'success', message: '提交成功' })
                }, 300)
                nextStep()
            } else {
                router.replace({
                    name: 'submit'
                })
            }
        }
    }).finally(() => {
        loading.value = false
    })
}


const pageLoading = ref(true)
const kycInfo = ref({})
const getKyc = () => {
    pageLoading.value = true
    showLoadingToast({
        duration: 0,
        loadingType: 'spinner',
    })
    _kycGet().then(res => {
        if (res.code == 200) {
            pageLoading.value = false
            kycInfo.value = res.data
            form.value.name = res.data.name
            form.value.idnum = res.data.idnum
            form.value.birthday = res.data.birthday
            if (res.data.birthday) {
                currentDate.value = res.data.birthday.split(',')
            }
        }
    }).finally(() => {
        closeToast()
    })
}
getKyc()

const next = () => { // 审核成功后 点击继续跳转2
    const u = JSON.parse(JSON.stringify(userInfo.value))
    ukyc = 2
    store.commit('setUserInfo', u)
}

const nextStep = () => {
    router.replace({
        name: 'user',
    })
}
</script>

<style lang="less" scoped>
.kyc_1 {
    padding: 1.24rem 0.32rem 0.2rem 0.32rem;

    .title {
        color: #0D0D12;
        font-weight: 600;
        font-size: 0.56rem;
        line-height: 0.8rem;
        margin-bottom: 0.6rem;
    }

    .tip {
        color: #666D80;
        font-weight: 400;
        font-size: 0.28rem;
        line-height: 0.42rem;
        margin-bottom: 0.4rem;
    }

    .subtitle {
        font-weight: 400;
        color: #333333;
        font-size: 0.24rem;
        line-height: 0.36rem;
        margin-bottom: 0.2rem;
    }

    .item {
        height: 0.88rem;
        border: 1px solid #D0D8E2;
        border-radius: 0.16rem;
        margin-bottom: 0.4rem;
        padding: 0 0.24rem;
        display: flex;
        align-items: center;

        .ipt {
            width: 100%;
            height: 100%;
            font-weight: 400;
            font-size: 0.28rem;
        }
    }

    .submit {
        width: 100%;
        margin-top: 1.12rem;
        height: 1.12rem;
    }

    .kyc_status {
        display: flex;
        align-items: center;

        .icon {
            width: 0.8rem;
            height: 0.8rem;
            background-color: #EAF0F3;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 0.16rem;

            .status_icon {
                width: 0.48rem !important;
                height: 0.48rem !important;
            }
        }

        .status {
            font-size: 0.28rem;
            font-weight: 400;
            color: #000000;
        }

        .status_pass {
            color: #38A843;
        }

        .status_fail {
            color: #E8503A;
        }
    }
}
</style>