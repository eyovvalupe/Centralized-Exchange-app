<!--借贷记录 -->
<template>
    <div class="page page_loan_record">
        <Top :title="'借贷订单'" />
        <div class="tabs">
            <div class="tab">借贷</div>
            <div class="tab active_tab">订单</div>
        </div>
        <div class="list">
            <NoData v-if="!loading && !list.length" />
            <div class="item" v-for="(item, i) in list" :key="i">
                <div class="item_box top">
                    <div class="title">股票账户</div>
                    <div class="status" :class="['status_' + item.status]">{{ _loanStatusMap[item.status || 'open'] ||
                        '--' }}</div>
                </div>

                <div class="item_box mid">
                    <div class="left">
                        <div class="date">{{ item.created }}</div>
                        <div>
                            <span>杠杆</span>
                            <span class="value">{{ item.lever }}x</span>
                            <span style="margin: 0 0.2rem">|</span>
                            <span>期限</span>
                            <span class="value">{{ item.days }}天</span>
                        </div>
                        <div><span>利息</span>
                            <span class="value">{{ item.interest }}</span>
                        </div>
                    </div>
                    <div class="amount">+ {{ item.amount }}</div>
                </div>

                <div class="item_box bottom">
                    <div>
                        <div class="btn" v-if="item.status == 'open'">提前还款</div>
                    </div>
                    <div class="return">
                        <div style="margin-bottom: 0.12rem">
                            <span>冻结本金</span>
                            <span class="value">{{ item.frozen }}</span>
                        </div>
                        <div>
                            <span class="value" style="font-weight: 600">{{ item.deadline }}</span>
                            <span>归还</span>
                            <span class="value" style="font-weight: 600">{{ item.repayment }}</span>
                        </div>
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
    padding: 2.3rem 0.32rem 0.2rem 0.32rem;

    .tabs {
        position: absolute;
        height: 0.8rem;
        display: flex;
        align-items: center;
        top: 1.2rem;

        .tab {
            padding: 0 0.6rem;
            font-size: 0.28rem;
            color: #061023;
            font-weight: 400;
            height: 0.64rem;
            display: flex;
            align-items: center;
            border-radius: 0.48rem;
        }

        .active_tab {
            background-color: #F6F8FF;
            color: #014CFA;
            font-weight: 600;
        }
    }

    .list {
        flex: 1;
        overflow-y: auto;

        .item {
            border-bottom: 1px dashed #CBCBCB;
            padding: 0.2rem 0;
            font-size: 0.28rem;
            font-weight: 400;
            color: rgba(139, 139, 139, 1);

            .item_box {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .top {
                margin-bottom: 0.2rem;
            }

            .title {
                color: #343434;
                font-weight: 600;
            }

            .status {
                height: 0.44rem;
                padding: 0 0.16rem;
                color: rgba(18, 24, 38, 1);
                background-color: rgba(18, 24, 38, 0.08);
                font-size: 0.24rem;
                display: flex;
                align-items: center;
            }

            .status_open {
                color: rgba(232, 80, 58, 1);
                background-color: rgba(232, 80, 58, 0.08);
            }

            .status_done {
                color: rgba(1, 76, 250, 1);
                background-color: rgba(1, 76, 250, 0.08);
            }

            .left {
                >div {
                    margin-bottom: 0.16rem;
                }
            }

            .date {
                color: rgba(145, 145, 147, 1);
                font-weight: 400;
            }

            .value {
                color: rgba(51, 51, 51, 1);
                font-weight: 500;
                margin: 0 0.04rem;
            }

            .amount {
                font-size: 0.32rem;
                color: rgba(0, 0, 0, 1);
                font-weight: 600;
            }

            .return {
                text-align: right;
            }

            .bottom {
                margin-top: 0.2rem;
            }

            .btn {
                height: 0.6rem;
                border-radius: 0.5rem;
                padding: 0 0.4rem;
                color: #fff;
                font-weight: 500;
                font-size: 0.24rem;
                background-color: #014CFA;
                display: flex;
                align-items: center;
            }
        }
    }
}
</style>