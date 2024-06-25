<!-- 提现记录 -->
<template>
    <div class="page page_transfer_record">
        <Top :title="'提现记录'" />

        <div class="list">
            <NoData v-if="!loading && !list.length" />
            <div class="item" v-for="(item, i) in list" :key="i">
                <div class="top">
                    <div>{{ item.order_no }}</div>
                    <div class="status">{{ _withdrawStatusMap[item.status] || '--' }}</div>
                </div>
                <div class="item_content">
                    <div class="left">
                        <div class="item_info">
                            <span>手续费: </span>
                            <span class="num">{{ item.fee }}</span>
                        </div>
                        <div class="item_info" v-if="!item.symbol">
                            <span>银行名称: </span>
                            <span class="num">{{ item.bank_name }}</span>
                        </div>
                        <div class="item_info" v-if="!item.symbol">
                            <span>卡号: </span>
                            <span class="num">{{ item.bank_card_number }}</span>
                        </div>
                        <div class="item_info" v-if="item.symbol">
                            <span>网络: </span>
                            <span class="num">{{ item.network }}</span>
                        </div>
                        <div class="item_info" v-if="item.symbol">
                            <span>地址: </span>
                            <span class="num">{{ item.address }}</span>
                        </div>
                    </div>
                    <div class="right">{{ item.amount }}{{ item.currency.toUppercase() }}</div>
                </div>
                <div class="date">{{ item.date }}</div>
            </div>
            <LoadingMore :loading="loading" :finish="finish" v-if="(finish && list.length) || (!finish)" />
        </div>
    </div>
</template>

<script setup>
import Top from '@/components/Top.vue';
import NoData from '@/components/NoData.vue';
import LoadingMore from "@/components/LoadingMore.vue"
import { ref, onMounted, onUnmounted } from 'vue'
import { _withdrawList } from "@/api/api"
import { _withdrawStatusMap } from "@/utils/dataMap"

const loading = ref(false)
const finish = ref(false)
const list = ref([])

const page = ref(0)
const getData = () => {
    if (loading.value || finish.value) return
    loading.value = true
    page.value++
    _withdrawList({
        page: page.value
    }).then(res => {
        list.value.push(...(res.data || []))
        if (!res.data?.length) {
            finish.value = true
        }
    }).finally(() => {
        loading.value = false
    })
}

getData()


onMounted(() => {
    const moreDom = document.querySelector('.loading_more')
    const totalHeight = window.innerHeight || document.documentElement.clientHeight;
    document.querySelector('.list').addEventListener('scroll', () => {
        const rect = moreDom.getBoundingClientRect()
        if (rect.top <= totalHeight) {
            // 加载更多
            getData()
        }
    })
})
onUnmounted(() => {
    document.querySelector('.list').removeEventListener('scroll', () => { })
})
</script>

<style lang="less" scoped>
.page_transfer_record {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 1.2rem 0.32rem 0.2rem 0.32rem;

    .list {
        flex: 1;
        overflow-y: auto;

        .item {
            border-bottom: 1px dashed #CBCBCB;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 0.2rem 0 0.28rem 0;

            .top {
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #343434;
                font-size: 0.24rem;
            }

            .item_content {
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0.12rem 0;

                .left {
                    flex: 1;

                    .item_info {
                        font-size: 0.28rem;
                        color: #919193;
                        line-height: 400;
                        line-height: 0.48rem;

                        .num {
                            color: #333333;
                        }
                    }
                }

                .right {
                    font-size: 0.36rem;
                    color: #000000;
                    font-weight: 700;
                }
            }

            .date {
                color: #919193;
                font-size: 0.24rem;
                font-weight: 400;
            }

        }
    }
}
</style>