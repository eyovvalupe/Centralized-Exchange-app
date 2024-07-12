<!--借贷记录 -->
<template>
    <div class="page page_loan_record">
        <Top :title="'借贷记录'" />

        <div class="list">
            <NoData v-if="!loading && !list.length" />
            <div class="item" v-for="(item, i) in list" :key="i">
                <div class="top">
                    <div class="date">{{ item.created }}</div>
                    <div class="status">{{ _loanStatusMap[item.status || 'open'] || '--' }}</div>
                </div>

                <div class="bottom">
                    <div class="left">
                        <div>
                            <span>冻结本金</span>
                            <span class="value">{{ item.frozen }}</span>
                        </div>
                        <div>
                            <span>杠杆</span>
                            <span class="value">{{ item.lever }}x</span>
                        </div>
                        <div>
                            <span>期限</span>
                            <span class="value">{{ item.days }}天</span>
                        </div>
                    </div>
                    <div class="right">
                        <div class="amount">{{ item.amount }} <span style="font-size: 0.28rem;">MAIN</span></div>

                        <!-- <div class="btn" v-if="item.status == 'open'">去归还: {{ item.repayment }}</div> -->
                        <div class="btn" v-if="i % 2 == 0">去归还: {{ item.repayment }}</div>
                        <div class="tip" v-else>还款时间：{{ item.deadline }}</div>
                    </div>
                </div>
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
import { _loanLog } from "@/api/api"
import { _loanStatusMap } from "@/utils/dataMap"

const loading = ref(false)
const finish = ref(false)
const list = ref([])

const page = ref(0)
const getData = () => {
    if (loading.value || finish.value) return
    loading.value = true
    page.value++
    _loanLog({
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


const scrolHandle = () => {
    const rect = moreDom.getBoundingClientRect()
    if (rect.top <= totalHeight) {
        // 加载更多
        getData()
    }
}

onMounted(() => {
    const moreDom = document.querySelector('.loading_more')
    const totalHeight = window.innerHeight || document.documentElement.clientHeight;
    document.querySelector('.list').addEventListener('scroll', scrolHandle)
})
onUnmounted(() => {
    document.querySelector('.list').removeEventListener('scroll', scrolHandle)
})
</script>

<style lang="less" scoped>
.page_loan_record {
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
                margin-bottom: 0.1rem;

                .date {
                    font-size: 0.28rem;
                    font-weight: 400;
                    color: #919193;
                }

                .status {
                    color: #333333;
                    font-weight: bold;
                    font-size: 0.28rem;
                }
            }

            .bottom {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .left {
                    color: #919193;
                    font-size: 0.28rem;
                    font-weight: 400;
                    line-height: 0.48rem;

                    .value {
                        color: #333;
                        margin-left: 0.2rem;
                    }
                }

                .right {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;

                    .amount {
                        color: #000;
                        font-weight: 700;
                        font-size: 0.36rem;
                        margin-bottom: 0.2rem;
                    }

                    .btn {
                        color: #014CFA;
                        font-size: 0.24rem;
                        height: 0.46rem;
                        border-radius: 0.46rem;
                        background-color: aliceblue;
                        display: flex;
                        align-items: center;
                        padding: 0 0.24rem;
                    }

                    .tip {
                        font-size: 0.24rem;
                        color: #919193;
                    }
                }
            }
        }
    }
}
</style>