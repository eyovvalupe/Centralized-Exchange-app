<!-- IPO认购 -->
<template>
    <div class="page page_ipo_subs">
        <Top :title="'认购'" />

        <!-- tabs -->
        <div class="tabs">
            <div class="tab" :class="{ 'active_tab': avtiveTab == 1 }" @click="avtiveTab = 1">普通认购</div>
            <div class="tab" :class="{ 'active_tab': avtiveTab == 2 }" @click="avtiveTab = 2">VIP认购</div>
        </div>

        <div class="form">
            <div class="subtitle">认购名称</div>
            <div class="item" style="background-color: #F9FAFB;">
                <span>{{ currIpo.company_name }}</span>
            </div>
            <div class="subtitle" v-show="avtiveTab == 2">VIP认购码</div>
            <div class="item" v-show="avtiveTab == 2" :class="{ 'err_ipt': errStatus2 }">
                <input @blur="errStatus2 = false" v-model="form.keyword" type="text" class="ipt"
                    placeholder="请输入VIP认购码">
            </div>
            <div class="subtitle">认购数量</div>
            <div class="item" :class="{ 'err_ipt': errStatus }">
                <input @blur="errStatus = false" v-model="form.volume" type="number" class="ipt" placeholder="请输入认购数量">
            </div>
            <div class="subtitle" v-show="avtiveTab == 2">杠杆</div>
            <!-- 滑块 -->
            <div class="slider_box" v-show="avtiveTab == 2" @mousedown="startMove = true" @mousemove="mousemove"
                @touchmove="sliderMove">
                <div class="slider">
                    <div class="slider_inner" :style="{ width: `${moveWith ? moveWith + 'px' : sliderWidth + '%'}` }">
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
        </div>


        <Button @click="openSafe" :loading="loading" round color="#014CFA" class="submit" type="primary">确定</Button>

        <!-- 安全密码弹窗 -->
        <SafePassword @submit="submit" ref="safeRef"></SafePassword>
    </div>
</template>

<script setup>
import Top from '@/components/Top.vue';
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import { useRoute } from "vue-router"
import { Button, showToast } from "vant"
import SafePassword from "@/components/SafePassword.vue"
import store from '@/store';
import { _orderBuy } from "@/api/api"
import router from '@/router'

const route = useRoute()
const currIpo = ref(route.query)
const avtiveTab = ref(1)
const loading = ref(false)
const safeRef = ref()

const form = ref({
    volume: '',
    keyword: '',
})

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


// 滑块配置
const lever = ref([1, 2, 5, 10, 20, 50])
const leverIndex = ref(0)
const moveWith = ref(0)
const sliderWidth = computed(() => {
    const val = leverIndex.value * 20
    return val <= 3 ? 3 : (val >= 99 ? 99 : val) // 两边收边
})
const sliderTo = i => { // 点击滑块
    if (leverIndex.value != i) {
        leverIndex.value = i
    }
}
const totalWidth = ref(window.innerWidth || document.documentElement.clientWidth)
if (totalWidth.value > 750) totalWidth.value = 375
const leverWidthArr = ref([]) // 滑块位置数组
leverWidthArr.value = lever.value.map((item, i) => {
    const n = (i / (lever.value.length - 1)) - (1 / (lever.value.length - 1) / 2)
    return n <= 0 ? 0 : n
})
const startMove = ref(false)
const cancelListen = () => {
    startMove.value = false
    if (!moveWith.value) return
    const x = moveWith.value / totalWidth.value
    let i = 0
    leverWidthArr.value.forEach((item, index) => {
        if (x > item) {
            i = index
        }
    })
    moveWith.value = 0
    sliderTo(i)
}
const mousemove = e => { // pc 拖动
    if (!startMove.value) return
    moveWith.value = e.offsetX
}
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


// sessionToken
const sessionToken = computed(() => store.state.sessionToken || '')
const getSessionToken = () => {
    loading.value = true
    store.dispatch("updateSessionToken").finally(() => {
        loading.value = false
    })
}
getSessionToken()

onMounted(() => {
    document.body.addEventListener('mouseup', cancelListen)
    setTimeout(() => {
        totalWidth.value = document.querySelector('.form').clientWidth
    }, 500)
})
onBeforeUnmount(() => {
    document.body.removeEventListener('mouseup', cancelListen)
})
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
        }

        .active_tab {
            color: #121826;
            font-weight: 500;
            border-bottom: 3px solid #014CFA;
        }
    }

    .subtitle {
        color: #333333;
        font-size: 0.28rem;
        font-weight: 400;
        margin-bottom: 0.16rem;
    }

    .item {
        height: 0.88rem;
        border: 1px solid #D0D8E2;
        border-radius: 0.12rem;
        margin-bottom: 0.4rem;
        display: flex;
        align-items: center;
        padding: 0 0.28rem;
        justify-content: flex-end;

        &:has(.ipt:focus) {
            border: 1px solid #014CFA;
        }

        .ipt {
            height: 100%;
            text-align: right;
            flex: 1;
        }
    }

    .err_ipt {
        border: 1px solid #E8503A;
    }

    .slider_box {
        padding: 0.2rem 0 0.5rem 0;


        .slider {
            width: 100%;
            height: 0.16rem;
            background-color: #EEEEEE;
            border-radius: 0.32rem;
            cursor: pointer;

            .slider_inner {
                position: relative;
                height: 100%;
                background-color: #0066FF;
                border-radius: 0.32rem;
                transition: all ease .1s;
                pointer-events: none;

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
                    pointer-events: none;
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

    .submit {
        position: absolute;
        bottom: 0.5rem;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 0.64rem);
    }
}
</style>