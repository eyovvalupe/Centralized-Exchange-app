<!-- 现金账户 -->
<template>
    <div class="page_assets_cash">
        <!-- 总览 -->
        <div class="overview">
            <div class="top">
                <div class="title">总资金</div>
                <div class="eyes" @click="hidden = !hidden">
                    <Icon v-show="!hidden" name="eye-o" />
                    <Icon v-show="hidden" name="closed-eye" />
                </div>
            </div>
            <div class="money">
                <span>{{ hidden ? '****' : (mainWallet.amount || '0.00') }}</span>
            </div>
            <div class="navs">
                <div class="nav">
                    <div>借贷</div>
                    <div class="num">{{ hidden ? '***' : (assets.loan || '0.00') }}</div>
                </div>
                <div class="line"></div>
                <div class="nav">
                    <div>冻结</div>
                    <div class="num">{{ hidden ? '****' : (assets.frozen || '0.00') }}</div>
                </div>
            </div>
        </div>
        <div class="cash_tab_content tabs">
            <div class="tab" @click="switchOpen(i, $event)" v-for="(item, i) in showWallet" :key="i">
                <div class="tab_icon">
                    <img :src="`/static/img/crypto/${item.currency.toUpperCase()}.png`" alt="img">
                </div>
                <div :class="{ 'open_tab': switchs[i] == true }">
                    <div>{{ item.currency }}</div>
                </div>
                <div class="amount" :class="{ 'open_amount': switchs[i] == true }">{{ item.amount }}</div>
                <div class="more" :class="{ 'open_tab': switchs[i] == true }">
                    <img src="/static/img/common/menu.png" alt="img">
                </div>
                <div class="rights" style="width:2.4rem" :class="{ 'open_tab': switchs[i] != true }">
                    <div class="right" style="background-color: #18B565;" @click="goTopUp(item.currency.toUpperCase())">
                        <div class="right_icon">
                            <img src="/static/img/assets/money.png" alt="img">
                        </div>
                        <div>充值</div>
                    </div>
                    <div class="right" style="background-color: #FF9500;">
                        <div class="right_icon">
                            <img src="/static/img/assets/pay.png" alt="img">
                        </div>
                        <div>提现</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 充提记录 -->
        <RaWrecords :bottom="'1.4rem'" :hiddenBeforeOpen="false" ref="RaWrecordsRef" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue"
import { Icon } from "vant"
import store from "@/store"
import RaWrecords from "@/components/RaWrecords.vue"
import router from "@/router"

const emits = defineEmits(['setLoading'])
const token = computed(() => store.state.token || '')
const hidden = ref(false)

const RaWrecordsRef = ref()



// 刷新现金钱包
const assets = computed(() => store.state.assets || {})
const showWallet = computed(() => (store.state.wallet || []).filter(a => !['main', 'stock', 'contract'].includes(a.currency))) // 除了主钱包外的其他钱包
const mainWallet = computed(() => (store.state.wallet || []).find(a => a.currency == 'main') || {}) // 主钱包
const getAssets = () => {
    if (!token.value) return
    // emits('setLoading', true)
    store.dispatch('updateWallet').finally(() => {
        emits('setLoading', false)
    })
}


// 展开状态
const switchs = ref([])
const switchOpen = (i, e) => {
    switchs.value[i] = !switchs.value[i]
    switchs.value = switchs.value.map((item, index) => {
        return i == index ? item : false
    })
    e.stopPropagation()
}

// 跳转充值
const goTopUp = name => {
    router.push({
        name: 'topUp',
        query: {
            currency: name
        }
    })
}


const removeSwitch = () => {
    switchs.value = switchs.value.map(() => {
        return false
    })
}

onMounted(() => {
    getAssets()
    document.querySelector('.page').addEventListener('click', removeSwitch)
})
onUnmounted(() => {
    document.querySelector('.page').removeEventListener('click', removeSwitch)
})

const refresh = () => {
    RaWrecordsRef.value && RaWrecordsRef.value.close()
    getAssets()
}
defineExpose({
    refresh
})
</script>

<style lang="less" scoped>
.page_assets_cash {
    height: 100%;
    overflow-y: hidden;
    border-top: 1px solid rgba(0, 0, 0, 0);
    position: relative;
    padding-bottom: 1.5rem;

    .overview {
        background-size: 100% 100%;
        margin: 0 0.32rem 0.24rem 0.32rem;
        padding: 0.4rem 0.3rem 0.24rem 0.3rem;
        background-color: #1A59F6;
        border-radius: 0.32rem;

        .top {

            font-size: 0.28rem;
            font-weight: 400;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            .title {
                color: #fff;
                margin-right: 0.32rem;
            }

            .eyes {
                width: 0.32rem;
                height: 0.32rem;
                color: #fff;
                font-size: 0.32rem;
            }

        }

        .money {
            font-size: 0.68rem;
            font-weight: 500;
            color: #fff;
            margin-top: 0.3rem;
            margin-bottom: 0.25rem;
        }

        .navs {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            line-height: 0.44rem;

            .line {
                width: 1px;
                height: 0.44rem;
                background-color: rgba(255, 255, 255, 0.4);
            }

            .nav {
                color: #fff;
                font-weight: 400;
                font-size: 0.24rem;
                text-align: center;
                flex: 1;
            }
        }
    }

    .cash_tab_content {
        padding: 0 0.32rem 0.32rem 0.32rem;

        .cash_tab_item {
            height: 1.2rem;
            border-bottom: 1px solid #EAEAEA;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }





    .list_box {
        margin: 0 0.32rem 0.32rem 0.32rem;
    }

    .tabs {
        border-top: 1px solid #EAEAEA;
        padding: 0 0.32rem;


        .tab {
            overflow: hidden;
            height: 1rem;
            // border-bottom: 1px solid #EAEAEA;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;

            &::before {
                content: '';
                width: 85vw;
                position: absolute;
                height: 0;
                border-bottom: 1px solid #EAEAEA;
                bottom: 0;
                right: 0;
                z-index: 1;
            }

            >div {
                transition: all ease .2s;
                overflow: hidden;
            }

            .tab_icon {
                width: 0.32rem;
                height: 0.32rem;
                margin-right: 0.2rem;

            }

            .tab_info {
                font-size: 0.2rem;
                color: #666;
                margin-top: 0.1rem;
            }

            .open_tab {
                width: 0 !important;
            }

            .more {
                width: 0.24rem;
                height: 0.24rem
            }

            .amount {
                flex: 1;
                text-align: right;
                padding: 0 0.2rem;
            }

            .open_amount {
                text-align: left;
            }

            .rights {
                display: flex;
                align-items: stretch;
                height: 100%;

                .right {
                    display: flex;
                    height: 100%;
                    width: 1.2rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.24rem;
                    font-weight: 400;
                    text-align: center;
                    color: #fff;

                    .right_icon {
                        width: 0.44rem;
                        height: 0.44rem;
                        margin-bottom: 0.08rem;
                    }
                }
            }
        }
    }
}
</style>