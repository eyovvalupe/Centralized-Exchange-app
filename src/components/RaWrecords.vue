<!-- 充提记录弹窗 -->
<template>
    <Teleport to="#app">
        <div class="fix_block_record"
            :class="{ 'fix_block_open': openList, 'hidden_fix_block': props.hiddenBeforeOpen && !openList }"
            :style="{ bottom: bottom }">
            <div class="fix_block_header" @click="openRecord">
                <Icon name="arrow-up" class="arrow" :class="{ 'arrow_active': openList }" />
                <span v-show="!openList">充提记录</span>
            </div>

            <div class="list_box list" :class="{ 'open_list': openList }">
                <Tabs v-if="openList" style="width:100%" :lazy-render="false" v-model:active="currTab" type="card"
                    sticky animated shrink>
                    <Tab :title="'充值记录'" name="1">
                        <div style="padding: 0 0.32rem">
                            <Loaidng :loading="listLoading && !depositList.length" />
                            <RechargeItem v-for="(item, i) in depositList" :item="item" :key="i" />
                            <NoData v-if="!listLoading && !depositList.length" />
                        </div>
                    </Tab>
                    <Tab :title="'提现记录'" name="2">
                        <div style="padding: 0 0.32rem">
                            <Loaidng :loading="listLoading && !withdrawList.length" />
                            <WithdrawItem v-for="(item, i) in withdrawList" :item="item" :key="i" />
                            <NoData v-if="!listLoading && !withdrawList.length" />
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </div>
    </Teleport>

</template>

<script setup>
import { ref } from "vue"
import { _depositList, _withdrawList } from "@/api/api"
import RechargeItem from "@/views/Assets/page/components/RechargeItem"
import WithdrawItem from "@/views/Assets/page/components/WithdrawItem"
import Loaidng from "@/components/Loaidng.vue"
import NoData from "@/components/NoData.vue"
import { Icon, Tabs, Tab } from "vant"

const props = defineProps({
    bottom: { // 初始位置
        type: String,
        default: 0,
    },
    hiddenBeforeOpen: { // 未打开前隐藏
        type: Boolean,
        default: true
    }
})


// 打开记录
const openList = ref(false)
const currTab = ref(1) // 1-充值记录  2-提现记录
const openRecord = () => {
    openList.value = !openList.value
    if (openList.value) {
        getList()
    }
}

// 获取充值记录
const listLoading = ref(false)
const depositList = ref([])
const withdrawList = ref([])
const getList = () => {
    listLoading.value = true
    let i = 0
    _depositList({ // 充值记录
        page: 1
    }).then(res => {
        depositList.value = res.data || []
    }).finally(() => {
        i++
        if (i == 2) {
            listLoading.value = false
        }
    })

    _withdrawList({ // 提现记录
        page: 1
    }).then(res => {
        withdrawList.value = res.data || []
    }).finally(() => {
        i++
        if (i == 2) {
            listLoading.value = false
        }
    })
}

const close = () => {
    openList.value = false
}

defineExpose({
    openRecord,
    close
})

</script>

<style lang="less">
.fix_block_record {
    width: 100vw;
    position: fixed;
    overflow: hidden;
    z-index: 99;
    left: auto;
    border-top-left-radius: 0.4rem;
    border-top-right-radius: 0.4rem;
    background-color: #fff;
    box-shadow: -2px 0 5px #ddd;

    .fix_block_header {
        height: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 0 0.4rem;
        font-size: 0.3rem;
        overflow: hidden;

        .arrow {
            margin-right: 0.2rem;
            transition: all ease .8s;
        }

        .arrow_active {
            transform: rotate(180deg);
        }
    }

    .list {
        height: 0;
        padding: 0;
        overflow: hidden;
        transition: all ease .3s;
    }

    .open_list {
        height: calc(100vh - 5.5rem);
        overflow-y: auto;
    }

    .van-tabs__nav--card {
        border: none;
    }

    .van-tab--card {
        border-right: none;
        color: #061023;
        // background-color: #f5f5f5;
        // border-radius: 0.3rem;
        // margin-left: 0.1rem;
        // transition: all ease .2s;
    }

    .van-tab--card.van-tab--active {
        // background-color: #014CFA;
        // color: #fff;

        background-color: #F6F8FF;
        border-radius: 0.3rem;
        color: #014CFA;
        font-weight: 500
    }

    .van-tab--shrink {
        padding: 0 0.3rem;
    }

    .van-tabs__wrap {
        height: 0.8rem;
        border-bottom: 1px solid #F6F8FF;
        padding-bottom: 0.2rem;
    }

    .van-tabs__nav--card {
        height: 0.6rem;
    }

    .van-tab {
        line-height: 0.6rem;
        font-size: 0.28rem;
    }
}

.hidden_fix_block {
    bottom: -1.5rem !important;
}

@media (min-width: 751px) {

    .fix_block_record {
        width: 375px;
    }

}
</style>