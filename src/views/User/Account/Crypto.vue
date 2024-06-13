<!-- 添加加密货币 -->
<template>
    <div class="page page_crypto">
        <Top :title="'加密货币'" />

        <div class="subtitle">加密货币</div>
        <div class="item" @click="showCrypto = true">
            <div class="iten_icon">
                <img src="/static/img/crypto/usdt.png" alt="usdt">
            </div>
            <div class="ipt">USDT</div>
            <Icon style="transform: rotate(90deg);" name="play" />
        </div>
        <div class="subtitle">网络</div>
        <div class="item">

            <div class="ipt">TRC20</div>
            <Icon style="transform: rotate(90deg);" name="play" />
        </div>
        <div class="subtitle">地址</div>
        <div class="item">
            <input type="text" class="ipt" maxlength="50">
        </div>

        <div style="flex: 1;"></div>
        <Button class="submit" type="primary" round color="#014CFA">保存</Button>


        <!-- 货币 -->
        <Popup round v-model:show="showCrypto" position="bottom">
            <div class="bottoms">
                <div class="bottom active_bottom">
                    <div class="bottom_icon">
                        <img src="/static/img/crypto/usdt.png" alt="usdt">
                    </div>
                    <span>USDT</span>
                </div>
                <div class="bottom">
                    <div class="bottom_icon">
                        <img src="/static/img/crypto/usdt.png" alt="usdt">
                    </div>
                    <span>USDT</span>
                </div>
                <Icon @click="showCrypto = false" class="close" name="cross" />
            </div>
        </Popup>
    </div>
</template>

<script setup>
import Top from '@/components/Top.vue';
import { Button, Icon, Popup } from "vant"
import { ref } from "vue"

const showCrypto = ref(false)
</script>

<style lang="less" scoped>
.page_crypto {
    padding: 1.4rem 0.32rem 1rem 0.32rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;

    .subtitle {
        font-weight: 400;
        font-size: 0.28rem;
        line-height: 0.36rem;
        color: #333333;
        margin-bottom: 0.15rem;
    }

    .item {
        width: 100%;
        height: 1.12rem;
        border: 1px solid #D0D8E2;
        border-radius: 0.32rem;
        margin-bottom: 0.22rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.44rem;

        .ipt {
            flex: 1;
            height: 100%;
            font-size: 0.24rem;
            text-align: left;
            outline: none;
            border: none;
            background-color: rgba(0, 0, 0, 0);
            display: flex;
            align-items: center;
            justify-content: flex-start;
            font-weight: 600;
            color: #061023;
        }

        .iten_icon {
            width: 0.45rem;
            height: 0.45rem;
            margin-right: 0.15rem;
        }
    }

    .submit {
        height: 1.12rem;
        width: 100%;
    }

    .bottoms {
        position: relative;
        padding: 1.12rem 0;

        .close {
            position: absolute;
            font-size: 0.4rem;
            top: 0.3rem;
            right: 0.4rem;
            color: #161616;
        }

        .bottom {
            color: #111111;
            font-size: 0.28rem;
            height: 1.12rem;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border-bottom: 1px solid #F5F5F5;

            &:last-child {
                border-bottom: none
            }

            .bottom_icon {
                width: 0.44rem;
                height: 0.44rem;
                margin-right: 0.14rem;
                position: relative;
                top: -0.04rem;
            }
        }

        .active_bottom {
            background-color: #F5F5F5;
        }
    }
}
</style>