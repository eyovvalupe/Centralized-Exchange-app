<!-- 跟单元素 -->
<template>
    <div class="follow-item ripple-btn" @click="goFollow">
        <div class="title-box">
            <div class="left">
                <div class="top">
                    <div class="avatar overflow-hidden">
                        <img v-lazy="getStaticImgUrl(`static/avatar/${item.avatar}.png`)" alt="" />
                    </div>
                    <div class="name">{{ props.item.name }}</div>
                    <div class="level">LV.{{ props.item.lv }}</div>
                </div>
                <div class="bottom">
                    <div class="bottom-info">
                        <div class="icon"><img v-lazy="getStaticImgUrl('/static/home2/group.svg')" alt=""></div>
                        <div>{{ props.item.followers }}</div>
                    </div>
                    <!-- <div class="info-a" v-if="props.showDetail">@{{ props.item.uid }}</div> -->
                </div>
            </div>
            <div class="btn ripple-btn"  @click.stop="emits('follow',props.item)">{{ $t('copy.copy_tab_tab1') }}</div>
        </div>

        <div class="info-box">
            <div class="info-left">
                <div class="text-[0.24rem] text-color2 mb-[0.2rem]">{{ $t('copy.total_revenue') }}</div>
                <div class="text-[0.32rem] font-semibold mb-[0.2rem]"
                    :class="[props.item.returnrate < 0 ? 'down' : 'up']">{{ (props.item.returnrate > 0
                        ? '+' : '') }}{{ props.item.returnrate }}%</div>
                <div class="text-[0.24rem]">
                    {{ (props.item.returnamount > 0 ? '+' : '') }}{{ props.item.returnamount || '--' }}
                </div>
            </div>
            <div class="line-box">
                <SparkLine :points="points" :ratio="item.returnrate > 0 ? 1 : -1" />
            </div>
        </div>

        <div v-if="props.showDetail" class="detail-box">
            <div class="detail-item">
                <div class="item-name">{{ $t('copy.copy_profit_rate') }}</div>
                <div class="item-val">{{ props.item.winrate }}%</div>
            </div>
            <div class="detail-item detail-item2">
                <div class="item-name">{{ $t('copy.copy_belong_total_amount') }}</div>
                <div class="item-val">{{ props.item.amount }}</div>
            </div>
            <div class="icons">
                <div class="icon" v-for="(item, i) in currencies" :key="i">
                    <CryptoIcon :name="item" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getStaticImgUrl, getPoints } from "@/utils/index.js"
import SparkLine from "@/components/SparkLine.vue";
import router from "@/router";
import store from "@/store";
const points = ref(getPoints('id-123456', 100))
const emits = defineEmits(['follow'])
const props = defineProps({
    showDetail: { // 是否显示详细信息
        type: Boolean,
        default: false
    },
    item: {
        type: Object,
        default: () => { }
    }
})

const currencies = ['USDT', 'BTC', 'ETH', 'TRX', 'LTC']

const goFollow = () => {
    store.commit('setCopyItem', props.item)
    sessionStorage.setItem('copyItem', JSON.stringify(props.item))
    setTimeout(() => {
        router.push({
            name: 'followDetail',
        })
    }, 50);
}
</script>

<style lang="less">
.follow-item {
    width: 100%;
    height: 100%;
    border-radius: 0.32rem;
    background: var(--ex-bg-white2);
    flex-shrink: 0;
    padding: 0.12rem;

    .title-box {
        padding: 0.16rem;
        width: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;

        .left {
            flex: 1;

            .top {
                display: flex;
                align-items: center;
                justify-content: flex-start;

                .avatar {
                    width: 0.48rem;
                    height: 0.48rem;
                    border-radius: 50%;
                    background-color: var(--ex-bg-color);
                    margin-right: 0.12rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.24rem;
                }

                .name {
                    font-size: 0.28rem;
                    font-weight: 600;
                    line-height: 1.4;
                }

                .level {
                    margin-left: 0.08rem;
                    height: 0.34rem;
                    padding: 0 0.08rem;
                    border-radius: 0.12rem;
                    font-size: 0.24rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--ex-black);
                    background-color: var(--ex-status-color1);
                }
            }

            .bottom {
                padding-left: 0.6rem;
                margin-top: 0.04rem;
                display: flex;
                align-items: center;
                justify-content: flex-start;

                .bottom-info {
                    background-color: var(--ex-bg-white1);
                    height: 0.36rem;
                    padding: 0 0.1rem;
                    border-radius: 0.12rem;
                    align-items: center;
                    display: inline-flex;
                    font-size: 0.2rem;

                    .icon {
                        width: 0.2rem;
                        height: 0.2rem;
                        margin-right: 0.04rem;
                        position: relative;
                        top: -0.01rem;
                    }
                }

                .info-a {
                    font-size: 0.24rem;
                    margin-left: 0.16rem;
                }
            }
        }

        .btn {
            background-color: var(--ex-primary-color);
            color: var(--ex-white);
            height: 0.68rem;
            border-radius: 0.5rem;
            padding: 0 0.26rem;
            min-width: 1.4rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.28rem;
        }
    }

    .info-box {
        width: 100%;
        height: 1.84rem;
        border-radius: 0.32rem;
        background-color: var(--ex-bg-white2);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.28rem;
        margin-top:0.08rem;

        .line-box {
            width: 2.08rem;
            height: 1.12rem;
            margin-top: 0.012rem;
        }

        .info-left {
            text-align: left;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;

            .info-title {
                font-size: 0.24rem;
                font-weight: 400;
                line-height: 1;
            }

            .info-num {
                font-size: 0.3rem;
                font-weight: 600;
                line-height: 0.4rem;
            }

            .info-text {
                color: var(--ex-placeholder-color);
                font-size: 0.24rem;
                font-weight: 400;
                line-height: 1;
                margin-top: 0.24rem;

                b {
                    color: var(--ex-white);
                    margin-left: 0.24rem;
                }
            }
        }
    }

    .detail-box {
        display: flex;
        align-items: center;
        padding: 0.24rem 0.16rem 0.12rem 0.16rem;

        .detail-item {
            flex: 1.2;
            font-size: 0.24rem;
            line-height: 1.5;

            .item-name {
                color: var(--ex-text-color3);
                width: max-content;
                margin-right: 0.2rem;
            }

            .item-val {
                color: var(--ex-text-color);
                margin-top:0.16rem;
                font-weight: 600;
            }
        }

        .detail-item2 {
            flex: 2;
        }

        .icons {
            flex: 2;
            display: flex;
            align-items: center;
            justify-content: flex-end;

            .icon {
                width: 0.4rem;
                height: 0.4rem;
                margin-left: -0.1rem;
            }
        }
    }
}
</style>