<!-- IPO -->
<template>
    <div class="page_ipo">
        <div class="filter_box" @click="showPopup = true">
            <span>{{ selectedOptiontext }}</span>
            <div class="filter_icon">
                <img src="/static/img/trade/down.png" alt="img">
            </div>
        </div>

        <div class="list">
            <div class="item" v-for="(item, i) in ipoDataList" :key="i" @click="openDetail(item)">
                <div class="item_top">
                    <div class="name">{{ item.company_name }}</div>
                    <div class="control_box">
                        <!-- 认购中 -->
                        <div class="status_ing" v-if="item.status == 'issuing' || item.status == 'listed'">认购中</div>
                        <!-- 预售中 -->
                        <div class="status_pre_box" v-if="item.status == 'none'">
                            <div class="status_ing status_pre">预售中</div>
                            <div class="pre_times" v-if="item._timedown">
                                <div class="pre_time">{{ item._timedown[0] }}</div>
                                <span>:</span>
                                <div class="pre_time">{{ item._timedown[1] }}</div>
                                <span>:</span>
                                <div class="pre_time">{{ item._timedown[2] }}</div>
                            </div>
                        </div>
                        <!-- 已结束 -->
                        <div class="status_ing status_done" v-if="item.status == 'done'">已结束</div>
                    </div>
                </div>
                <div class="item_mid">
                    <div class="mid_item">
                        <div class="mid_val" style="text-align: left">{{
                            item.issue_price_max }}</div>
                        <div style="text-align: left">认购价格</div>
                    </div>
                    <div class="mid_item">
                        <div class="mid_val">{{ item.issue_start_date }} 至 {{ item.issue_end_date }}</div>
                        <div>认购日期</div>
                    </div>
                    <div class="mid_item" v-if="item.listing_price">
                        <div class="mid_val">-{{ item.listing_price }}</div>
                        <div>上市价格</div>
                    </div>
                </div>
                <div class="item_bottom" v-if="item.status == 'issuing' || item.status == 'listed'">
                    <div class="btn" @click.stop="goBuy(item)">认购</div>
                </div>
            </div>

            <LoadingMore v-if="!(finish && ipoDataList.length == 0)" :loading="loading" :finish="finish" />
            <NoData v-if="(finish && ipoDataList.length == 0)" />
        </div>
        <div style="height: 1rem"></div>

        <!-- 下拉框 -->
        <teleport to="body">
            <Popup :safe-area-inset-top="true" :safe-area-inset-bottom="true" v-model:show="showPopup" position="bottom"
                class="market_ipo-popup" closeable>
                <div class="market_ipo-box">
                    <div v-for="(i, key) in option" :key="key" class="market_ipo-box-item"
                        :class="{ 'selected-class': selectedOption === i.value }" @click="selectOption(i.value)">
                        {{ i.text }}
                    </div>
                </div>
            </Popup>
        </teleport>

        <!-- 详情弹窗 -->
        <teleport to="body">
            <Popup style="background-color: rgba(0,0,0,0);" :safe-area-inset-top="true" :safe-area-inset-bottom="true"
                v-model:show="showPopupInfo" position="bottom" closeable>
                <div class="ipo_detail">
                    <div class="detail_title">IPO详情</div>

                    <div class="detail_item">
                        <div class="name">{{ currDetail.company_name }}</div>
                        <div class="status" :class="{ 'close_status': currDetail.status == 'done' }">{{
                            (currDetail.status
                                == 'issuing' || currDetail.status == 'listed') ? '认购中'
                                : (currDetail.status == 'none' ? '预售中' : '已结束') }}</div>
                    </div>
                    <div class="detail_item">
                        <div>股票代码</div>
                        <div class="val">--</div>
                    </div>
                    <div class="detail_item">
                        <div>认购价格</div>
                        <div class="val">{{ currDetail.issue_price_max || '--' }}</div>
                    </div>
                    <div class="detail_item">
                        <div>认购开始日期</div>
                        <div class="val">{{ currDetail.issue_start_date || '--' }}</div>
                    </div>
                    <div class="detail_item">
                        <div>认购结束日期</div>
                        <div class="val">{{ currDetail.issue_end_date || '--' }}</div>
                    </div>
                    <div class="detail_item">
                        <div>上市日期</div>
                        <div class="val">{{ currDetail.listing_date || '--' }}</div>
                    </div>
                    <div class="detail_item">
                        <div>上市价格</div>
                        <div class="val">{{ currDetail.listing_price || '--' }}</div>
                    </div>
                    <div class="detail_item">
                        <div>最低认购数量</div>
                        <div class="val">--</div>
                    </div>
                    <div class="detail_item">
                        <div>VIP认购</div>
                        <div class="val">{{ currDetail.lever ? currDetail.lever + 'X' : '--' }}</div>
                    </div>
                    <div class="detail_item">
                        <div>VIP利息</div>
                        <div class="val">--</div>
                    </div>
                </div>
            </Popup>
        </teleport>
    </div>
</template>

<script setup>
import LoadingMore from "@/components/LoadingMore.vue"
import NoData from "@/components/NoData.vue"
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import store from "@/store"
import { _ipoList, _ipoGet } from "@/api/api";
import { Popup } from "vant"
import router from "@/router"

const props = defineProps({
    scrollDom: {
        type: String,
        default: '.page'
    }
})

const ipoDataList = computed(() => store.state.ipoDataList || [])
const selectedOption = ref('')
const option = [
    { text: "所有", value: "" },
    { text: "发行中", value: "lssuing" },
    { text: "已上市", value: "listed" },
];
const selectedOptiontext = computed(() => option.find(item => item.value == selectedOption.value).text)
const selectOption = (val) => {
    showPopup.value = false
    if (selectedOption.value == val) return
    selectedOption.value = val
    setTimeout(() => {
        init(true)
    }, 0)
}
const showPopup = ref(false)

const loading = ref(false)
const finish = ref(false)
const page = ref(0)

// 初始化
const init = (reset) => {
    if (reset) {
        store.commit('setIpoDataList', [])
    }
    loading.value = false
    finish.value = false
    page.value = 0
    getData()
}
// 获取数据
const getData = () => {
    if (loading.value || finish.value) return
    loading.value = true
    page.value++
    _ipoList({
        status: selectedOption.value,
        page: page.value
    }).then(res => {
        if (res.data && res.data.length) {
            res.data = res.data.map(item => {
                item._timedown = countdown(item.listing_date)
                return item
            })
            if (page.value == 1) {
                store.commit('setIpoDataList', res.data)
            } else {
                store.commit('setIpoDataList', [...ipoDataList.value, ...res.data])
            }
        } else {
            setTimeout(() => {
                finish.value = true
            }, 500)
        }
    }).finally(() => {
        setTimeout(() => {
            loading.value = false
        }, 500)
    })
}

// 滚动监听
let loadingMore = ''
const totalHeight = window.innerHeight || document.documentElement.clientHeight;
const scrollHandler = () => {
    if (!loadingMore) return
    const rect = loadingMore.getBoundingClientRect()
    if (rect.top <= totalHeight) {
        // 加载更多
        getData()
    }
}
// 倒计时
let interval = null
onMounted(() => {
    interval = setInterval(() => {
        const arr = ipoDataList.value.map(item => {
            item._timedown = countdown(item.listing_date)
            return item
        })
        store.commit('setIpoDataList', arr)
    }, 1000)
    setTimeout(() => {
        loadingMore = document.querySelector('.loading_more')
        document.querySelector(props.scrollDom).addEventListener('scroll', scrollHandler)
    }, 500)
})
onBeforeUnmount(() => {
    if (interval) clearInterval(interval)
    document.querySelector('.page').removeEventListener('scroll', scrollHandler)
})

defineExpose({
    init
})

// 去购买
const goBuy = (query) => {
    router.push({
        name: 'subscription',
        query
    })
}


// 详情
const showPopupInfo = ref(false)
const currDetail = ref({})
const openDetail = (val) => {
    currDetail.value = val
    showPopupInfo.value = true
    _ipoGet({
        id: currDetail.value.id
    }).then(res => {
        if (res.data) {
            currDetail.value = {
                ...currDetail.value,
                ...res.data
            }
        }
    })
}


function countdown(endTime) {
    if (!endTime) return ['--', '--', '--']
    const endDate = new Date(endTime);
    const now = new Date();
    const diff = endDate - now;
    if (diff <= 0) {
        return ["--", "--", "--"];
    }
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return [formattedHours, formattedMinutes, formattedSeconds];
}
</script>

<style lang="less" scoped>
.page_ipo {
    padding: 0 0.32rem;

    .list {
        .item {
            border-bottom: 1px solid #EAEAEA;
            padding: 0.1rem 0 0.1rem 0;

            .item_top {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                padding: 0.28rem 0;

                .name {
                    font-size: 0.28rem;
                    font-weight: 600;
                    color: #0D0D12;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    flex: 1;
                    margin-right: 0.4rem;
                    line-height: 0.48rem;
                }

                .control_box {
                    .status_ing {
                        height: 0.44rem;
                        padding: 0 0.24rem;
                        border-top-right-radius: 0.12rem;
                        border-bottom-left-radius: 0.12rem;
                        background-color: #E4ECFB;
                        min-width: 1rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 0.2rem;
                        color: #014CFA;
                    }

                    .status_pre_box {
                        .status_pre {
                            background-color: #333;
                            color: #fff;
                        }

                        .pre_times {
                            display: flex;
                            align-items: center;
                            justify-content: flex-end;
                            color: #9798A7;
                            font-size: 0.32rem;
                            line-height: 0;
                            margin-top: 0.1rem;

                            .pre_time {
                                height: 0.36rem;
                                min-width: 0.36rem;
                                display: flex;
                                padding: 0 0.12rem;
                                align-items: center;
                                justify-content: center;
                                color: #fff;
                                background-color: #333;
                                border-radius: 0.08rem;
                                font-size: 0.24rem;

                            }

                            span {
                                margin: 0 0.04rem;
                            }
                        }
                    }

                    .status_done {
                        background-color: #EBEBEB;
                        color: #838383;
                    }
                }
            }

            .item_mid {
                display: flex;
                align-items: stretch;
                justify-content: space-between;
                margin-bottom: 0.24rem;

                .mid_item {
                    text-align: center;
                    font-size: 0.24rem;
                    font-weight: 400;
                    color: #818898;

                    .mid_val {
                        font-size: 0.28rem;
                        font-weight: 500;
                        color: #014CFA;
                        margin-bottom: 0.28rem;
                    }
                }
            }

            .item_bottom {
                border-top: 1px dashed #CBCBCB;

                padding: 0.3rem 0 0.2rem 0;
                display: flex;
                align-items: center;
                justify-content: flex-end;

                .link {
                    color: #014CFA;
                    font-size: 0.28rem;
                }

                .btn {
                    height: 0.56rem;
                    border-radius: 0.5rem;
                    background-color: #014CFA;
                    padding: 0 0.32rem;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-size: 0.28rem;
                }
            }
        }
    }

    .filter_box {
        height: 0.56rem;
        margin-bottom: 0;
        padding: 0 0.4rem;
        background-color: #F6F8FF;
        border-radius: 0.4rem;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        color: #014CFA;
        font-size: 0.24rem;
        min-width: 2.8rem;

        .filter_icon {
            width: 0.32rem;
            height: 0.32rem;
            margin-left: 0.4rem;
        }
    }
}
</style>
<style lang="less">
.market_ipo-popup {
    border-top-left-radius: 0.36rem;
    border-top-right-radius: 0.36rem;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    padding-bottom: 1.2rem;

    .market_ipo-box {
        margin-top: 1rem;

        .market_ipo-box-item {
            width: 100%;
            height: 0.96rem;
            text-align: center;
            line-height: 0.96rem;
            color: #333333;
            font-size: 0.28rem;
            font-style: normal;
            font-weight: 400;
            border-bottom: 0.02rem solid #f4f5f7;
        }

        .market_ipo-box-item:first-of-type {
            margin-right: 0.3rem;
        }

        .selected-class {
            color: #014cfa;
            background-color: #f4f5f7;
            position: relative;
        }
    }
}

.ipo_detail {
    border-top-left-radius: 0.36rem;
    border-top-right-radius: 0.36rem;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    background-color: #fff;
    padding: 0.32rem 0.32rem 0.4rem 0.32rem;
    position: relative;

    .detail_title {
        text-align: center;
        font-size: 0.32rem;
        margin-bottom: 0.32rem;
    }

    .detail_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 1rem;
        border-bottom: 1px solid #F5F5F5;
        color: #8F92A1;
        font-size: 0.28rem;
        font-weight: 400;

        .name {
            color: #0D0D12;
            font-weight: 600;
            font-size: 0.32rem;
        }

        .status {
            height: 0.48rem;
            background-color: #E4ECFB;
            color: #014CFA;
            font-size: 0.24rem;
            padding: 0 0.32rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.08rem;
            white-space: nowrap;
        }

        .close_status {
            background-color: #EBEBEB;
            color: #838383;
        }

        .val {
            color: #121826;
            font-weight: 500
        }
    }
}
</style>