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
                <input v-model="bj" class="ipt" type="number" placeholder="请输入">
                <span class="all" @click="bj = mainWallet.amount">全部</span>
                <div class="item_icon">
                    <img src="/static/img/crypto/MAIN.png" alt="img">
                </div>
                <span>MAIN</span>
            </div>
            <div class="tip" style="margin-top: 0.12rem;">
                <span>最大可抵押</span>
                <span class="num">{{ mainWallet.amount || '0.00' }}</span>
            </div>
            <!-- 滑块 -->
            <div class="slider_box" @touchmove="sliderMove">
                <div class="slider">
                    <div class="slider_inner" :style="{ width: `${sliderWidth}%` }">
                        <div class="slider_ball"></div>
                    </div>
                </div>
                <div class="slider_bottom">
                    <div @click="sliderTo(i)" class="slider_item" v-for="(item, i) in lever" :key="item"
                        :class="{ 'slider_item_avtive': leverIndex == i }">
                        <span class="text">{{ item }}X</span>
                    </div>
                </div>
            </div>
            <div class="subtitle">借款金额</div>
            <div class="money">{{ amount }}</div>
            <div class="subtitle">期限</div>
            <!-- 期限 -->
            <div class="dates">
                <div class="date" @click="changeDate(i)" v-for="(item, i) in days"
                    :class="{ 'date_active': currDayIndex == i }" :key="i">{{
                        item
                    }}天
                </div>
            </div>
            <div class="tip">
                <span>手续费</span>
                <span class="num">{{ loading ? '--' : showFee }}</span>
            </div>
            <div class="tip">
                <span>隔夜利息</span>
                <span class="num">{{ loading ? '--' : showInterest }}</span>
            </div>
            <div class="tip">
                <span>{{ returnDate }} 归还</span>
                <span class="num">{{ loading ? '--' : returnAmount }}</span>
            </div>
        </div>

        <Button @click="openSafePass" :loading="loading" :disabled="disabled" round color="#014CFA" class="submit"
            type="primary">确定</Button>


        <!-- 安全密码弹窗 -->
        <SafePassword @submit="submit" ref="safeRef">
            <template #top>
                <div class="loan_comfirm_box">
                    <div class="loan_comfirm_title">借款确认</div>
                    <div class="loan_confirm_amount">{{ amount }} <span style="font-size: 0.4rem;">MAIN</span></div>
                    <div class="loan_confirm_item">
                        <span>借款抵押</span>
                        <span class="value">{{ bj }}</span>
                    </div>
                    <div class="loan_confirm_item">
                        <span>杠杆</span>
                        <span class="value">{{ lever[leverIndex] }}x</span>
                    </div>
                    <div class="loan_confirm_item">
                        <span>期限</span>
                        <span class="value">{{ days[currDayIndex] }}天</span>
                    </div>
                    <div class="loan_confirm_item">
                        <span>手续费</span>
                        <span class="value">{{ showFee }}</span>
                    </div>
                    <div class="loan_confirm_item">
                        <span>隔夜利息</span>
                        <span class="value">{{ showInterest }}</span>
                    </div>
                    <div class="loan_confirm_tip">
                        <span>{{ returnDate }} 归还</span>
                        <span class="value">{{ returnAmount }}</span>
                    </div>
                </div>
            </template>
        </SafePassword>
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { _loanPara, _loanRate, _loan } from "@/api/api"
import { ref, computed, onMounted } from "vue"
import { Button, showNotify } from "vant"
import store from "@/store"
import Decimal from 'decimal.js';
import SafePassword from "@/components/SafePassword.vue"
import router from "@/router"


const loading = ref(false)
const disabled = computed(() => {
    return bj.value <= 0
})
const mainWallet = computed(() => (store.state.wallet || []).find(a => a.currency == 'main') || {}) // 主钱包

// 滑块配置
const lever = ref([])
const leverIndex = ref(0)
const sliderWidth = computed(() => {
    const val = leverIndex.value * 20
    return val <= 3 ? 3 : (val >= 99 ? 99 : val) // 两边收边
})
const sliderTo = i => { // 点击滑块
    leverIndex.value = i
    setTimeout(() => {
        getRate()
    }, 0)
}
const totalWidth = ref(window.innerWidth || document.documentElement.clientWidth)
const leverWidthArr = ref([]) // 滑块位置数组
const sliderMove = e => { // 滑动
    const x = e.targetTouches[0].clientX / totalWidth.value
    let i = 0
    leverWidthArr.value.forEach((item, index) => {
        if (x > item) {
            i = index
        }
    })
    sliderTo(i)
}

// 日期配置
const days = ref([])
const currDayIndex = ref(0)
const changeDate = i => {
    currDayIndex.value = i
    setTimeout(() => {
        getRate()
    }, 0)
}


// 借款金额
const bj = ref("")
const amount = computed(() => {
    if (!bj.value) return 0
    return new Decimal(bj.value).mul(lever.value[leverIndex.value] || 0)
})

// 手续费
const fee = ref(0)
const showFee = computed(() => {
    if (!bj.value) return '--'
    return new Decimal(amount.value).mul(fee.value)
})

// 隔夜利息
const interest = ref(0)
const showInterest = computed(() => {
    if (!bj.value) return '--'
    return new Decimal(interest.value).mul(100) + '%'
})

// 归还
const returnAmount = computed(() => {
    if (!bj.value) return '--'
    return new Decimal(amount.value).mul(interest.value).plus(showFee.value).plus(amount.value)
})

const returnDate = computed(() => {
    const today = new Date(); // 获取今天的日期
    today.setDate(today.getDate() + (Number(days.value[currDayIndex.value]) || 0));
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
})

// 获取借贷配置
const getConfig = () => {
    loading.value = true
    _loanPara().then(res => {
        if (res.code == 200) {
            lever.value = res.data.lever.split(',')
            leverWidthArr.value = lever.value.map((item, i) => {
                const n = (i / (lever.value.length - 1)) - (1 / (lever.value.length - 1) / 2)
                return n <= 0 ? 0 : n
            })
            days.value = res.data.days.split(',')

            setTimeout(() => {
                getRate()
            }, 300)
        }
    }).finally(() => {
        loading.value = false
    })
}
getConfig()

// 获取汇率
const getRate = () => {
    loading.value = true
    _loanRate({
        lever: lever.value[leverIndex.value],
        days: days.value[currDayIndex.value]
    }).then(res => {
        if (res.code == 200) {
            fee.value = res.data.fee || 0
            interest.value = res.data.interest || 0
        }
    }).finally(() => {
        loading.value = false
    })
}


// 表单提交
const safeRef = ref()
const openSafePass = () => {
    safeRef.value.open()
}
const submit = s => {
    const params = {
        lever: lever.value[leverIndex.value],
        days: days.value[currDayIndex.value],
        amount: bj.value,
        safeword: s,
        token: sessionToken.value
    }
    if (loading.value) return
    loading.value = true
    _loan(params).then(res => {
        if (res.code == 200) {
            showNotify({ type: 'success', message: '借贷成功' });
            bj.value = ''
            leverIndex.value = 0
            currDayIndex.value = 0
            store.dispatch('updateWallet') // 更新钱包
            setTimeout(() => {
                getRate()
            }, 100)
        }
    }).finally(() => {
        getSessionToken()
        loading.value = false
    })
}

// 查看记录
const goRecord = () => {
    router.push({
        name: 'loanRecord'
    })
}


// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    store.dispatch("updateSessionToken")
}
getSessionToken()

onMounted(() => {
    setTimeout(() => {
        totalWidth.value = document.querySelector('.form').clientWidth
    }, 500)
})
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
        width: 100%;

        .subtitle {
            color: #333333;
            font-size: 0.28rem;
            font-weight: 400;
            margin-bottom: 0.12rem;
        }

        .money {
            font-size: 0.6rem;
            color: #000000;
            margin-bottom: 0.4rem;
        }

        .dates {
            margin-bottom: 0.2rem;
            display: flex;
            align-items: stretch;

            .date {
                height: 0.8rem;
                flex: 1;
                margin-right: 0.14rem;
                border-radius: 0.1rem;
                background-color: #F7F7F7;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                font-weight: 400;
                font-size: 0.28rem;
                color: #000000;
                transition: all ease .2s;

                &:last-child {
                    margin-right: 0;
                }
            }

            .date_active {
                color: #0066FF;
                border: 1px solid #0066FF;
                background-color: #EEF3FF;
            }
        }

        .item {
            border: 1px solid #D0D8E2;
            height: 1.12rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-radius: 0.32rem;
            padding: 0 0.4rem 0 0.76rem;

            .ipt {
                width: 50px;
                flex: 1;
                color: #292929;
                font-size: 0.32rem;
                font-weight: 400;
            }

            .all {
                color: #1A59F6;
                font-size: 0.28rem;
                font-weight: 500;
            }

            .item_icon {
                width: 0.56rem;
                height: 0.56rem;
                margin: 0 0.1rem 0 0.6rem;
            }
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

        .slider_box {
            margin: 0.4rem 0;

            .slider {
                width: 100%;
                height: 0.16rem;
                background-color: #EEEEEE;
                border-radius: 0.32rem;

                .slider_inner {
                    position: relative;
                    height: 100%;
                    background-color: #0066FF;
                    border-radius: 0.32rem;
                    transition: all ease .1s;

                    .slider_ball {
                        width: 0.36rem;
                        height: 0.36rem;
                        border-radius: 50%;
                        background-color: #fff;
                        border: 0.1rem solid #0066FF;
                        position: absolute;
                        right: -0.09rem;
                        top: -0.09rem;
                    }
                }
            }

            .slider_bottom {
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #A2A2A7;
                font-weight: 400;
                font-size: 0.28rem;
                margin-top: 0.24rem;
                height: 0.36rem;

                .slider_item {
                    width: 0;
                    height: 100%;
                    position: relative;
                    text-align: center;

                    .text {
                        position: absolute;
                        left: 0;
                        transform: translateX(-50%);
                    }

                    &:nth-child(1) {
                        .text {
                            transform: translateX(0%);
                        }
                    }

                    &:last-child {
                        .text {
                            transform: translateX(-100%);
                        }
                    }
                }

                .slider_item_avtive {
                    color: #1E1E2D;
                }
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
.loan_comfirm_box {
    .loan_comfirm_title {
        color: #061023;
        font-size: 0.32rem;
        text-align: center;
        margin-bottom: 0.4rem;
    }

    .loan_confirm_amount {
        font-size: 0.64rem;
        color: #000000;
        font-weight: 700;
        margin-bottom: 0.3rem;
        text-align: center;
    }

    .loan_confirm_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.28rem;
        color: #8F92A1;
        height: 0.48rem;

        .value {
            color: #000000;
        }
    }

    .loan_confirm_tip {
        border-top: 1px dashed #CBCBCB;
        padding-top: 0.05rem;
        margin-top: 0.05rem;
        margin-bottom: 0.2rem;
        text-align: right;
        color: #8F92A1;
        font-size: 0.24rem;

        .value {
            color: #000000;
            margin-left: 0.2rem;
        }
    }
}
</style>