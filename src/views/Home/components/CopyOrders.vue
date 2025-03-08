<template>
    <div class="pt-[0.32rem] px-[0.32rem] pb-[1.6rem]">
        <div class="my-total" v-if="!isEmpty(myCopyData)">
            <div class="info-flex">
                <div class="info-item">
                    <div class="name">{{ $t('copy.copy_order_total_profit') }}<span class="text-[0.24rem]">(USDT)</span></div>
                    <div class="val" :class="[myCopyData.returnamount >= 0 ? 'up' : 'down']">{{ myCopyData.returnamount }}</div>
                </div>
                <div class="info-item" style="text-align: right;">
                    <div class="name">{{ $t('copy.copy_order_total_amount') }}<span class="text-[0.24rem]">(USDT)</span></div>
                    <div class="val" @click="plus">
                        <span>{{ myCopyData.amount }}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="flex gap-[0.1rem] mb-[0.2rem]">
            <div class="w-max px-[0.4rem] h-[0.78rem] rounded-[1rem] text-[0.3rem] font-semibold flex items-center justify-center"
                :class="typeChange == 'option' ? 'bg-white text-black ripple-primary' : 'text-color2 ripple-btn'"
                @click="typeChange = 'option'"
                :style="typeChange == 'option' ? '' : 'background-color: var(--ex-bg-white2)'">{{
                    $t('common.option') }}</div>
        </div> -->
        <div class="list-i" v-if="myFollowList.length">
            <MyFollowItem @openInfo="openInfo" :item="item"  v-for="(item, i) in myFollowList" :key="i" :showDetail="false" />
        </div>
        <NoData v-if="!myFollowList.length" />

        <!-- 详情 -->
        <Popup teleport="body" v-model:show="showInfo" position="right" :style="{ height: '100%', width: '100%' }">
            <FollowInfo v-if="showInfo" @back="showInfo = false" style="width: 100%;height: 100%;" />
        </Popup>

    </div>
</template>
<script setup>
import store from '@/store'
import { isEmpty } from "@/utils/isEmpty";
import MyFollowItem from "../components/MyFollowItem.vue"
import { ref } from 'vue';
import { Popup } from 'vant'
import NoData from '@/components/NoData.vue';
import FollowInfo from "../Follow/FollowInfo.vue"
const myFollowList = computed(() => store.state.myCopy)
const myCopyData = computed(() => store.state.myCopyData)
const typeChange = ref('option')
const showInfo = ref(false)
// 跟单详情
const openInfo = () => {
    showInfo.value = true
}

</script>
<style lang="less" scoped>
.list-i {
    margin-bottom: 0.24rem;
}

.my-total {
    border-radius: 0.32rem;
    background: var(--ex-bg-color3);
    padding: 0.12rem;
    margin-bottom: 0.2rem;
    border:1px solid var(--ex-bg-white2);

    .info-flex {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0.16rem 0;

        .info-item {
            text-align: left;
            padding: 0 0.16rem;

            .name {
                color: var(--ex-placeholder-color);
                font-size: 0.3rem;
                margin-bottom: 0.24rem;
            }

            .val {
                color: var(--ex-white);
                font-weight: bold;
                font-size: 0.36rem;
            }
        }
    }

    .info-box {
        width: 100%;
        border-radius: 0.32rem;
        background-color: var(--ex-bg-white2);
        padding: 0.28rem;

        .info-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 0.52rem;

            .name {
                color: var(--ex-placeholder-color);
            }

            .val {
                display: flex;
                align-items: center;

                .plus {
                    width: 0.4rem;
                    height: 0.4rem;
                    margin-left: 0.12rem;
                }
            }
        }
    }
}
</style>