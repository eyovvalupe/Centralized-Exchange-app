<!-- IPO认购 -->
<template>
    <div class="page page_ipo_subs">
        <Top :title="'认购'" />

        <!-- tabs -->
        <div class="tabs">
            <div class="tab" :class="{ 'active_tab': avtiveTab == 1 }" @click="changeTab(1)">
                <span>普通认购</span>
            </div>
            <div class="tab" :class="{ 'active_tab': avtiveTab == 2 }" @click="changeTab(2)">
                <span>VIP认购</span>
                <div class="tag_tag">{{ lever }}X</div>
            </div>
        </div>

        <div class="form">
            <!-- <div class="subtitle">认购名称</div>
            <div class="item" style="background-color: #F9FAFB;">
                <span>{{ currIpo.company_name }}</span>
            </div> -->
            <div class="subtitle" v-show="avtiveTab == 2">VIP认购码</div>
            <div class="item " v-show="avtiveTab == 2">
                <div class="border_item ipt_box" :class="{ 'err_ipt': errStatus2 }">
                    <input @blur="errStatus2 = false" v-model="form.keyword" type="text" class="ipt2"
                        placeholder="请输入VIP认购码">
                </div>

            </div>
            <div class="subtitle">认购数量</div>
            <div class="item">
                <div v-show="avtiveTab == 2" class="border_item account_box" style="background-color: #f5f5f5">
                    <span>{{ lever }}X</span>
                </div>
                <div class="border_item ipt_box" :class="{ 'err_ipt': errStatus }">
                    <div class="ipt_tip" v-show="form.volume === '' || focus">最大认购 <span>{{ maxNum || '--'
                            }}</span>
                    </div>
                    <input @change="inputNum" @focus="focus = true" @blur="focus = errStatus = false"
                        v-model="form.volume" class="ipt" type="number" placeholder="">
                    <span class="all" @click="form.volume = maxNum, sliderValue = 100">全部</span>
                </div>
            </div>
            <div class="slider-container">
                <Slider v-model="sliderValue" bar-height="0.08rem" active-color="#014cfa" inactive-color="#f2f2f2"
                    @change="onSliderChange" />
            </div>
            <div class="percentages">
                <div v-for="percent in percentages" :key="percent" class="percentage">
                    <div class="line"></div>
                    {{ percent }}%
                </div>
            </div>


        </div>


        <Button @click="openSafe" :loading="loading" round color="#014CFA" class="submit" type="primary">确定</Button>

        <!-- 安全密码弹窗 -->
        <SafePassword @submit="submit" ref="safeRef">
            <template #top>
                <div class="iposubs_dialog">
                    <div class="title">订购确认</div>
                    <div style="margin-bottom: 0.4rem">
                        <div class="item">
                            <span>订购数量</span>
                            <span class="val">{{ form.volume }}</span>
                        </div>
                        <div class="item">
                            <span>冻结金额</span>
                            <span class="val">{{ avtiveTab == 2 ? (form.volume / 10) : form.volume }}</span>
                        </div>
                        <div class="item">
                            <span>借贷金额</span>
                            <span class="val">{{ form.volume }}</span>
                        </div>
                        <div class="item">
                            <span>借贷手续费</span>
                            <span class="val">{{ feeNum }}</span>
                        </div>
                    </div>
                </div>

            </template>
        </SafePassword>
    </div>
</template>

<script setup>
import Top from '@/components/Top.vue';
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import { useRoute } from "vue-router"
import { Button, showToast, Slider } from "vant"
import SafePassword from "@/components/SafePassword.vue"
import store from '@/store';
import { _orderBuy, _orderPara } from "@/api/api"
import Decimal from 'decimal.js';
import router from '@/router'

const mainWallet = computed(() => (store.state.wallet || []).find(a => a.currency == 'main') || {}) // 主钱包
const lever = ref(10)


const route = useRoute()
const currIpo = ref(route.query)
const avtiveTab = ref(1)
const loading = ref(false)
const safeRef = ref()

const changeTab = key => {
    sliderValue.value = 0
    form.value = {
        volume: '',
        keyword: '',
    }
    avtiveTab.value = key
}

const maxNum = computed(() => { // 最大值
    if (avtiveTab.value == 2) return new Decimal(mainWallet.value.amount).mul(lever.value)
    return mainWallet.value.amount
})

const form = ref({
    volume: '',
    keyword: '',
})
const sliderValue = ref(0);
const onSliderChange = (newValue) => {
    errStatus.value = false
    sliderValue.value = newValue;
    const val = new Decimal(maxNum.value).mul(newValue).div(100).toFixed(2)
    if (!Number(val)) {
        sliderValue.value = 0
        form.value.volume = ''
    } else {
        form.value.volume = Number(val)
    }
};
const percentages = [25, 50, 75, 100];
const inputNum = () => {
    setTimeout(() => {
        console.error(form.value.volume * 100 / maxNum.value)
        if (form.value.volume) {
            sliderValue.value = parseInt(form.value.volume * 100 / maxNum.value)
            if (sliderValue.value > 100) sliderValue.value = 100
        } else {
            sliderValue.value = 0
        }
    }, 0)
}

const focus = ref(false)
const errStatus = ref(false)
const errStatus2 = ref(false)
const openSafe = () => {
    if (!form.value.volume || form.value.volume <= 0) {
        errStatus.value = true
        return showToast('请输入认购数量')
    }
    if (avtiveTab.value == 2 && !form.value.keyword) {
        errStatus2.value = true
        return showToast('请输入VIP认购码')
    }
    safeRef.value.open()
}
// 提交表单
const submit = (s) => {
    if (loading.value) return
    const params = {
        volume: form.value.volume,
        keyword: avtiveTab.value == 2 ? form.value.keyword : '',
        ipoid: currIpo.value.id,
        safeword: s,
        token: sessionToken.value
    }
    loading.value = true
    _orderBuy(params).then(res => {
        if (res.code == 200) {
            router.replace({
                name: 'subscriptionSuccess'
            });
        }
    }).finally(() => {
        setTimeout(() => {
            loading.value = false
        }, 500)
    })
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

// 手续费
const fee = ref(0)
const feeNum = computed(() => {
    if (!form.value.volume) return 0
    return new Decimal(form.value.volume).mul(fee.value).toFixed(2)
})
const getFee = () => {
    _orderPara().then(res => {
        if (res.code == 200) {
            fee.value = res.data.fee
        }
    })
}
getFee()
</script>

<style lang="less" scoped>
.page_ipo_subs {
    padding: 1.6rem 0.32rem 1.6rem 0.32rem;

    position: relative;

    .tabs {
        display: flex;
        align-items: stretch;
        justify-content: flex-start;
        border-bottom: 1px solid #3B82F6;
        height: 0.54rem;
        padding-left: 0.4rem;
        margin-bottom: 0.4rem;

        .tab {
            color: #9EA3AE;
            font-size: 0.28rem;
            font-weight: 400;
            margin-right: 0.44rem;
            position: relative;

            .tag_tag {
                position: absolute;
                width: 0.36rem;
                height: 0.34rem;
                border-radius: 50%;
                background-color: #666;
                color: #fff;
                font-size: 0.16rem;
                display: flex;
                align-items: center;
                justify-content: center;
                right: -0.3rem;
                top: -0.2rem;
            }
        }

        .active_tab {
            color: #121826;
            font-weight: 500;
            border-bottom: 3px solid #014CFA;

            .tag_tag {
                background-color: #000;
            }
        }
    }

    .subtitle {
        color: #333333;
        font-size: 0.28rem;
        font-weight: 400;
        margin-bottom: 0.16rem;
    }

    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.4rem;
        height: 0.88rem;

        &:has(.ipt:focus) {
            height: 1.12rem;
        }

        .account_box {
            width: 2.4rem;
            margin-right: 0.2rem;
            color: #000000;
            font-size: 0.28rem;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .ipt_box {
            flex: 1;
            padding: 0 0 0 0.2rem;
            display: flex;
            align-items: center;

            position: relative;

            .ipt {
                height: 100%;
                display: flex;
                align-items: center;
            }

            &:has(.ipt:focus) {
                padding-top: 0.3rem;

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
                left: 0.4rem;
                top: 50%;
                transform: translateY(-50%);
                pointer-events: none;
                transition: all ease .2s;

                span {
                    // color: #111111;
                }
            }

            .all {
                color: #1A59F6;
                position: absolute;
                right: 0.32rem;
            }
        }

        .border_item {
            border: 1px solid #D0D8E2;

            border-radius: 0.12rem;
            height: 100%;

            .item_icon {
                width: 0.26rem;
                height: 0.26rem;
                margin-right: 0.08rem;
                position: relative;
                top: -0.02rem;
            }

            &:has(.ipt:focus) {
                border: 1px solid #014CFA;
            }

            &:has(.ipt2:focus) {
                border: 1px solid #014CFA;
            }
        }

        .err_ipt {
            border: 1px solid #E8503A;
        }
    }

    .slider-container {
        margin-top: .2rem;
        height: 1rem;
        padding: .4rem 0 0 0;

        :deep(.van-slider) {
            margin-top: 0.1rem;
            height: 0.16rem !important;
            border-radius: 0.02rem;
            padding-right: 0.1rem;
        }

        :deep(.van-slider__bar) {
            position: relative;
        }

        :deep(.van-slider__button) {
            width: 0.1rem;
            height: 0.48rem;
            background-color: #014cfa;
            border-radius: inherit;
            top: -0.36rem;
        }

        :deep(.van-slider__button-wrapper) {
            z-index: 999 !important;
            padding: 0.24rem;
        }

        :deep(.slider-custom-num) {
            position: relative;
            background: #014CFA;
            color: #fff;
            display: inline-block;
            width: .05rem;
            height: .5rem;
            font-size: 12px;
            text-align: center;
            line-height: .4rem;
            border-radius: 10px;

            :deep(.number) {
                color: #014CFA;
                position: absolute;
                top: -0.4rem;
                left: -0.1rem;
                font-size: .2rem;
            }
        }


    }

    .percentages {
        display: flex;
        justify-content: space-between;
        width: 98%;
        z-index: 7;

        .percentage {
            color: #8f92a1;
            font-size: 0.28rem;
            font-style: normal;
            font-weight: 400;
            text-align: center;
            width: 25%;
            position: relative;
        }

        .line {
            width: 0.06rem;
            height: 0.2rem;
            position: absolute;
            right: 0;
            top: -0.5rem;
            background: #fff;
            z-index: 88;
        }
    }



    .err_ipt {
        border: 1px solid #E8503A;
    }

    .submit {
        position: absolute;
        bottom: 0.5rem;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 0.64rem);
    }
}
</style>

<style lang="less">
.iposubs_dialog {
    position: relative;

    .title {
        position: absolute;
        width: 100%;
        text-align: center;
        top: -0.64rem;
        font-size: 0.28rem;
        font-weight: 500;
    }

    .item {
        height: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #F5F5F5;
        font-weight: 400;
        color: #8F92A1;
        font-size: 0.28rem;

        .val {
            color: #000;
            font-weight: 500;
        }
    }
}
</style>