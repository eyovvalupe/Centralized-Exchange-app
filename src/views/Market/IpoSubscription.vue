<!-- IPO认购 -->
<template>
    <div class="page page_ipo_subs">
        <HeaderTabs v-model:active="activeTab" :tabs="[t('trade.ipo_sub_ordinary'), t('trade.ipo_sub_leveraged')]"
            v-if="currIpo.lever > 1" @change="changeTab">
            <template #before>
                <div class="back" @click="back()">
                    <img :src="getStaticImgUrl(`/static/img/user/back.svg`)" alt="">
                </div>
            </template>
        </HeaderTabs>
        <div v-else>
            <Top title="IPO认购"></Top>
            <div class="h-[1.12rem]"></div>
        </div>

        <div class="ipo_info" @click="ipoDetail">
            <div class="ipo_info_lt">
                <div class="ipo_info_name">{{ currIpo.company_name }}<span v-if="currIpo.lever > 1"
                        class="lever_icon">{{
                            t('trade.ipo_leveraged_trading') }}</span> </div>
                <div class="ipo_info_price">
                    {{ t('trade.ipo_detail_price') }} <span>{{ currIpo.issue_price_max }} {{ currIpo.currency }}</span>
                </div>
            </div>
            <Icon class="ipo_info_arrow" name="arrow" size="0.4rem" color="var(--ex-text-color2)" />
        </div>

        <div class="form">
            <FormItem :title="t('trade.ipo_detail_item10')" v-model="form.volume" btn-show-mode="focus"
                @btnClick="onSliderChange(100)" show-btn :inputType="'number'" :tip="max > 0 ? '<=' + max : ''"
                @change="changePercent">
                <template #title-right>
                    <div class="flex items-center">
                        <span>{{ t('assets.wallet_available') }}&nbsp;</span>
                        <Loading size="0.3rem" color="var(--ex-primary-color)" class="mx-[0.2rem]" v-if="!mainWallet.currency" /> <span
                            v-else @click="openConfirmBox()" class="text-primary">{{ mainWallet.amount }} {{
                                mainWallet.currency }}</span>
                        <Icon class="ml-[0.1rem]" name="arrow" size="0.26rem" color="var(--ex-text-color2)" />
                    </div>
                </template>
            </FormItem>


            <div style="height:0.47rem;"></div>
            <!-- 拖动 -->
            <SlideContainer v-model="sliderValue" @change="onSliderChange" />

            <div class="flex" v-if="activeTab == 1">
                <div class="flex-1">
                    <FormItem :title="t('trade.ipo_detail_lever')" disabled :modelValue="currIpo.lever + 'X'">
                    </FormItem>
                </div>
                <div class="flex-2 ml-[0.2rem]">
                    <FormItem :title="t('trade.ipo_sub_buy_code')" v-model="form.keyword"></FormItem>
                </div>
            </div>

        </div>
        <Button @click="openSafe" :loading="loading" round size="large" color="var(--ex-primary-color)" class="submit" type="primary">{{
            t('trade.ipo_opening_btn') }}</Button>


        <!-- 订单确认弹窗 -->
        <Popup teleport="body" v-model:show="showModel" position="bottom" round closeable>
            <div class="van-popup-custom-title">
                {{ t('trade.ai_opening_confirm_order') }}
            </div>

            <div class="main_item">
                <div class="item_box">
                    <div class="name_box">
                        <div class="name">
                            {{ currIpo.company_name }}
                            <span class="lever_icon" v-if="currIpo.lever > 1">{{ t('trade.ipo_leveraged_trading')
                                }}</span>
                        </div>
                    </div>

                </div>

                <div class="info_boxs">
                    <div class="info_box">
                        <div>{{ $t("trade.ipo_detail_item10") }}</div>
                        <div class="amount">
                            {{ form.volume }}
                        </div>
                    </div>

                    <div class="info_box info_box--line">
                        <div>{{ $t("trade.ipo_detail_item14") }}({{ currIpo.currency }})</div>
                        <div class="amount">
                            {{ freezeNum || "--" }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="stock_submit_box">
                <div class="item" v-if="activeTab == 1">
                    <div class="item_name">{{ $t('trade.ipo_detail_lever') }}</div>
                    <div class="item_val">
                        <div class="item_val_text">{{ lever }}X</div>
                    </div>
                </div>
                <!-- <div class="item">
                    <div class="item_name">{{ $t("trade.ipo_detail_item13") }}</div>
                    <div class="item_val">
                        <div class="item_val_text">
                            {{ form.volume }}
                        </div>
                    </div>
                </div> -->

                <div class="item">
                    <div class="item_name">{{ $t("trade.ipo_detail_item9") }}</div>
                    <div class="item_val">
                        <div class="item_val_text">{{ feeNum }}</div>
                        <div class="item_val_unit">{{ currIpo.currency }}</div>
                    </div>
                </div>

                <div class="money_box">
                    {{ t('market.market_buy_fast_pay') }} <strong>{{ all }}</strong> <span>{{ currIpo.currency }}</span>
                </div>

                <FormItem v-model="safeword" size="large" input-type="password"
                    :title="$t('trade.stock_opening_trade_pw')">
                </FormItem>

                <Button :loading="loading" @click="submit(safeword)" size="large" class="submit" color="var(--ex-primary-color)"
                    round>{{
                        $t("trade.ipo_opening_btn") }}</Button>
            </div>
        </Popup>

    </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { ref, computed, nextTick } from "vue"
import { useRoute } from "vue-router"
import { Button, showToast, Loading, Popup, Icon, showConfirmDialog } from "vant"
import HeaderTabs from "@/components/HeaderTabs.vue";
import SlideContainer from "@/components/SlideContainer.vue"
import store from '@/store';
import { _orderBuy, _orderPara, _basic } from "@/api/api"
import FormItem from "@/components/Form/FormItem.vue";
import Decimal from 'decimal.js';
import router from '@/router'
import { useI18n } from "vue-i18n";
import Top from "@/components/Top.vue"

const params = ref({})

const { t } = useI18n();

const mainWallet = computed(() => (store.state.wallet || []).find(a => a.currency == params.value.currency) || {}) // 主钱包
const route = useRoute()

const currIpo = ref(route.query)
const activeTab = ref(0)
const lever = computed(() => {
    return activeTab.value == 1 ? currIpo.value.lever : 1
})

const safeword = ref('')

const showModel = ref(false)

const loading = ref(false)


const changeTab = key => {
    sliderValue.value = 0
    form.value = {
        volume: '',
        keyword: '',
    }
    activeTab.value = key
}

const ipoDetail = () => {
    router.push('/ipo/detail?id=' + currIpo.value.id)
}
const form = ref({
    volume: '',
    keyword: '',
})
const sliderValue = ref(0);

const onSliderChange = (newValue) => {
    sliderValue.value = newValue;
    let v = new Decimal(max.value).mul(newValue).div(100);
    if (params.value.step > 0) {
        v = v.sub(v.mod(params.value.step));
    }
    form.value.volume = v.toNumber();
};
const changePercent = () => {
    let p = 0;
    let v = new Decimal(form.value.volume || 0)
    if (v.toNumber() <= 0) {
        form.value.volume = ''
        sliderValue.value = 0
        return
    }
    if (params.value.step > 0) {
        v = v.sub(v.mod(params.value.step));
    }
    form.value.volume = v.toNumber();
    p = new Decimal(form.value.volume).div(max.value).mul(100).toNumber();

    if (p > 100) p = 100;
    sliderValue.value = p;

};

const errStatus = ref(false)
const errStatus2 = ref(false)
const openSafe = () => {
    if (!form.value.volume || form.value.volume <= 0) {
        errStatus.value = true
        return showToast(t('trade.ipo_sub_buy_no_amount'))
    }
    if (activeTab.value == 1 && !form.value.keyword) {
        errStatus2.value = true
        return showToast(t('trade.ipo_sub_buy_no_code'))
    }
    showModel.value = true
    getSessionToken()
}
// 提交表单
const submit = (s) => {
    if (loading.value) return
    const params = {
        volume: form.value.volume,
        keyword: activeTab.value == 1 ? form.value.keyword : '',
        lever: activeTab.value == 1 ? currIpo.value.lever : '',
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
        getSessionToken()
        setTimeout(() => {
            loading.value = false
        }, 500)
    })
}

const back = () => {
    router.back()
}

// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    loading.value = true
    store.dispatch("updateSessionToken").finally(() => {
        loading.value = false
    })
}

const max = computed(() => {
    // 最大认购数量
    let v = new Decimal(mainWallet.value.amount || 0)

    if (lever.value > 1) {
        //计算加杠杆后，单张的实际成本
        const m = new Decimal(currIpo.value.issue_price_max || 0).div(lever.value) //单张支付价格
        const fee = new Decimal(currIpo.value.issue_price_max || 0).mul(lever.value - 1).mul(0.1).mul(params.value.fee || 0) //单张手续费
        const s = m.add(fee) //单张实际成本 = 单张支付价格 + 单张手续费
        v = v.div(s)
    } else {
        v = v.div(currIpo.value.issue_price_max || 1);
    }

    if (params.value.step > 0) {
        v = v.sub(v.mod(params.value.step));
    }
    return v.floor()

});

// 冻结金额
const freezeNum = computed(() => {
    if (!form.value.volume) return 0
    const val = new Decimal(form.value.volume).div(lever.value).mul(currIpo.value.issue_price_max || 0).toFixed(3).toString()
    return val.substring(0, val.length - 1)
})
//订单金额
const loanNum = computed(() => {
    if (!form.value.volume) return 0
    const val = new Decimal(form.value.volume).mul(currIpo.value.issue_price_max || 0).toFixed(3).toString()
    return val.substring(0, val.length - 1)
})
//手续费
const feeNum = computed(() => {
    if (!form.value.volume) return 0
    const val = new Decimal(loanNum.value).sub(freezeNum.value).mul(params.value.fee || 0).toFixed(3).toString()
    return val.substring(0, val.length - 1)
})

const all = computed(() => {
    // 实际支付金额
    const val = new Decimal(freezeNum.value).add(feeNum.value).toFixed(3).toString();
    return val.substring(0, val.length - 1)
});


// 获取订购配置

const getFee = () => {
    _orderPara({
        market: currIpo.value.market
    }).then(res => {
        if (res.code == 200) {
            const data = res.data || {};
            data.min = data.volume ? data.volume.split(',')[0] : 0
            data.step = data.volume ? data.volume.split(',')[1] : 0
            form.value.volume = data.min > 0 ? data.min : ''
            params.value = res.data
            changePercent()

        }
    })
}
getFee()


const openConfirmBox = () => {

    const type = max.value > 0 ? 2 : 1
    // type 1-余额不足 2-余额展示
    const title =
        type == 1
            ? t("trade.stock_opening_no_balance")
            : t("trade.stock_opening_enough_balance");
    const content =
        type == 1
            ? `<div class="text-color" style="font-size:0.28rem;line-height:0.44rem;margin-top:0.32rem;">${t(
                "trade.ipo_account_balance"
            )} <span style="font-weight:600;color:var(--ex-primary-color);">` +
            mainWallet.value.amount +
            "</span> " +
            mainWallet.value.currency +
            `</div><div class="text-color" style="font-size:0.28rem;line-height:0.44rem;margin-top:0.12rem;">${t(
                "trade.stock_account_notification"
            )}</div>`
            : `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:var(--ex-bg-color2);border:1px solid var(--ex-border-color);border-radius:0.32rem;padding:0.2rem 0;line-height:0.4rem;margin-top:0.32rem;">
        <div style="color:var(--ex-text-color);font-size:0.32rem;font-weight:400;margin-bottom:0.2rem">${t(
                "trade.ipo_account_balance"
            )}</div>
        <div style="display:flex;align-items:center;justify-content:center;">
            <b style="font-size:0.4rem;color:var(--ex-primary-color);font-weight:bold">${mainWallet.value.amount
            }</b><span style="font-size:0.28rem;margin-left:0.12rem;color:var(--ex-text-color);font-weight:400">${mainWallet.value.currency
            }</span>
        </div>
    </div>`;
    showConfirmDialog({
        closeOnClickOverlay: true,
        className: "van-custom-confirm-dialog",
        title: title,
        message: content,
        allowHtml: true,
        confirmButtonText: t("trade.stock_opening_btn_transfer"),
        cancelButtonText: t("trade.stock_opening_btn_recharge"),
        confirmButtonColor: "var(--ex-primary-color)",
        cancelButtonColor: "var(--ex-primary-color)",
    })
        .then(() => {
            router.push({
                name: "transfer",
            });
        })
        .catch(() => {
            router.push({
                name: "topUpCrypto",
            });
        });
};

</script>

<style lang="less" scoped>
.page :deep(.header_tabs) {
    position: relative;
}

.page :deep(.header_tabs .tab_body) {
    display: flex;
    justify-content: center;
    align-items: center;
}

.page :deep(.header_tabs .tab) {
    padding: 0 0.5rem;
}

.page_ipo_subs {
    padding: 0rem 0.32rem 1.6rem 0.32rem;
    position: relative;


    .ipo_info {
        border-radius: 0.32rem;
        border: 1px solid var(--ex-border-color);
        background: var(--ex-bg-color2);
        padding: 0.28rem 0.32rem;
        display: flex;
        justify-content: space-between;
        margin-top: 0.28rem;

        &_lt {
            flex: 1;
        }

        &_arrow {
            margin-top: 0.32rem;
        }

        &_name {
            color: var(--ex-text-color);
            font-size: 0.32rem;
            font-weight: 600;
            line-height: 0.36rem;
            /* 112.5% */
        }

        .lever_icon {
            display: inline-block;
            height: 0.32rem;
            padding: 0rem 0.08rem;
            font-size: 0.22rem;
            color: var(--ex-primary-color);
            border-radius: 0.08rem;
            line-height: 0.32rem;
            font-weight: 400;
            margin-left: 0.1rem;
            background: rgba(1, 76, 250, 0.10);
        }

        &_price {
            color: var(--ex-text-color3);
            font-size: 0.3rem;
            font-weight: 400;
            line-height: 0.36rem;
            margin-top: 0.2rem;

            span {
                margin-left: 0.12rem;
                color: var(--ex-error-color);
            }

            .blue {
                color: var(--ex-primary-color);
            }
        }

    }

    .put_all {
        color: var(--ex-primary-color);
        position: absolute;
        right: 0.32rem;
        font-size: 0.3rem;
        z-index: 9;
        transition: all ease .3s;
    }

    .subtitle {
        color: var(--ex-text-color);
        font-size: 0.28rem;
        margin-bottom: 0.12rem;
        line-height: 0.36rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 0.4rem;
    }

    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;

        .ipt {
            flex: 1;
            height: 100%;
            width: 2rem;
            font-size: 0.28rem;
            padding: 0;
            position: relative;
            z-index: 1;
        }
    }

    .item_box {
        position: relative;
        height: 0.92rem;
        border-radius: 0.32rem;
        border: 1px solid var(--ex-border-color2);
        padding: 0 0.24rem;

    }

    .submit {
        margin-top: 0.8rem;
    }

}

.main_item {
    border-radius: 0.32rem;
    border: 1px solid var(--ex-border-color);
    background: var(--ex-bg-color2);
    margin: 0.4rem 0.32rem 0 0.32rem;

    .name {
        color: var(--ex-text-color);
        font-size: 0.32rem;
        font-weight: 600;
        line-height: 0.36rem;
        color: var(--ex-text-color);
        overflow: hidden;
        margin-bottom: 0.14rem;

        .lever_icon {
            display: inline-block;
            height: 0.32rem;
            padding: 0rem 0.08rem;
            font-size: 0.22rem;
            color: var(--ex-primary-color);
            border-radius: 0.08rem;
            line-height: 0.32rem;
            font-weight: 400;
            margin-left: 0.1rem;
            background: rgba(1, 76, 250, 0.10);
        }

    }

    .item_box {
        padding: 0.26rem 0.32rem 0.16rem 0.32rem;
        position: relative;
    }


    .info_boxs {
        padding: 0.3rem 0;
        position: relative;
        border: 1px solid var(--ex-border-color);
        border-bottom: 0px;
        border-radius: 0.32rem;
        background-color: var(--ex-bg-color);
        width: calc(100% + 2px);
        left: -1px;
        z-index: 1;

        &::after {
            content: '';
            display: block;
            clear: both;
        }

        .info_box {
            width: 50%;
            float: left;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--ex-text-color3);
            font-size: 0.28rem;
            line-height: 0.44rem;
            position: relative;

            .amount {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                line-height: 0.44rem;
                margin-top: 0.12rem;
                font-weight: 600;
                color: var(--ex-text-color);
                font-size: 0.36rem;
            }

            .blue {
                color: var(--ex-primary-color);
            }
        }

        .info_box--line::after {
            content: '';
            width: 1px;
            height: 0.9rem;
            background-color: var(--ex-bg-color3);
            position: absolute;
            left: 0;
            top: 50%;
            margin-top: -0.45rem;
        }
    }
}

.stock_submit_box {
    padding: 0.2rem 0.5rem 0.6rem;

    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.36rem 0 0.2rem 0;
        border-bottom: 1px solid var(--ex-border-color);

        .item_name {
            color: var(--ex-text-color3);
            font-size: 0.28rem;
            font-weight: 400;
        }

        .item_val {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            color: var(--ex-text-color);
            font-size: 0.28rem;
            font-weight: 600;

            &_unit {
                margin-left: 0.06rem;
                font-size: 0.24rem;
                line-height: 100%;
                margin-top: 0.04rem;
            }
        }
    }

    .subtitle {
        font-size: 0.24rem;
        margin-bottom: 0.2rem;
        color: var(--ex-text-color);
        font-weight: 400;
    }

    .pass_ipt {
        margin-bottom: 0.4rem;
        border-radius: 0.12rem;
        border: 1px solid var(--ex-border-color2);
        padding: 0 0.24rem;

        .ipt {
            height: 0.8rem;
        }
    }

    .money_box {
        background-color: var(--ex-bg-color2);
        border-radius: 0.32rem;
        margin-top: 0.36rem;
        min-height: 1rem;
        display: flex;
        justify-content: flex-end;
        padding: 0.24rem 0.32rem;
        color: var(--ex-text-color2);
        align-items: center;

        strong {
            font-size: 0.36rem;
            font-weight: 600;
            font-family: "PingFang SC";
            color: var(--ex-text-color);
            margin: 0 0.08rem;
        }

        span {
            font-size: 0.24rem;
            font-weight: 600;
            font-family: "PingFang SC";
            color: var(--ex-text-color);
            position: relative;
            top: 0.04rem;
        }
    }

    .submit {
        margin-top: 0.5rem;
    }
}
</style>