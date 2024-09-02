<!-- 合约账户 -->
<template>
    <div class="page_assets_contract">
        <!-- 总览 -->
        <div class="overview">
            <div class="top">
                <div class="title">持仓资金</div>
                <div class="eyes" @click="hidden = !hidden">
                    <Icon v-show="!hidden" name="eye-o" />
                    <Icon v-show="hidden" name="closed-eye" />
                </div>
            </div>
            <div class="money">
                <span>{{ hidden ? '****' : (assets.futures_value || '0') }}</span>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { Icon } from "vant"
import store from "@/store"

const hidden = ref(false)

const assets = computed(() => store.state.assets || {})
</script>

<style lang="less" scoped>
.page_assets_contract {
    .overview {
        background-size: 100% 100%;
        margin: 0 0.32rem 0.36rem 0.32rem;
        padding: 0.4rem 0.3rem 0.24rem 0.3rem;
        background-color: #25253D;
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

}
</style>