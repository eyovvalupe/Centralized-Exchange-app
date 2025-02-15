<!-- 处理pwa相关业务 -->
<template>
    <!-- 按钮 -->
    <div v-if="showBtn" class="add2home ripple-btn" @click="install">添加到主屏幕</div>

    <!-- ios提示 -->
    <div v-if="showTip" class="ios-tip" @click="showTip = false">
        <div class="tip-box">
            <div class="top">
                <span>添加到主屏幕</span>
            </div>
            <div class="tip1">1.轻触底部[分享]</div>
            <div class="tip-img">
                <img :src="getStaticImgUrl('/static/img/home/pwa1.png')" alt="">
            </div>
            <div class="tip1">2.选择[添加到主屏幕]</div>
            <div class="tip-img">
                <img :src="getStaticImgUrl('/static/img/home/pwa2.png')" alt="">
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { showToast } from "vant"
import { getStaticImgUrl } from "@/utils/index.js"

const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isAndroid = /Android/.test(navigator.userAgent);

// 按钮
const showBtn = ref(false)

// ios 提示
const showTip = ref(false)

// 安装
const install = () => {

    setTimeout(() => {
        showBtn.value = false
    }, 0)

    if (isiOS) {
        showTip.value = true
    } else {

        if (!deferredPrompt || !deferredPrompt.prompt) {
            showToast('当前浏览器不支持安装，请手动添加到桌面')
            return
        }

        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    }
}

// 判断是否可安装
const isInstall = () => {

    if (isiOS && window.navigator.standalone === true) {
        return false;
    }

    if (isAndroid && (window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: fullscreen)').matches)) {
        return false;
    }

    if (window && (window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: fullscreen)').matches)) {
        return false
    }

    return true
}

onMounted(() => {
    setTimeout(() => {
        showBtn.value = isInstall()
    }, 5000)
})
</script>


<style lang="less" scoped>
.ios-tip {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999999;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);

    .tip-box {
        width: 6.2rem;
        border-radius: 0.32rem;
        padding: 0.32rem;
        padding-bottom: 0;
        color: var(--ex-white);
        background-color: var(--ex-bg-color3);

        .top {
            display: flex;
            align-content: center;
            justify-content: space-between;
            font-size: 0.36rem;
            margin-bottom: 0.64rem;
        }

        .tip1 {
            font-size: 0.28rem;
            margin-bottom: 0.4rem;
        }

        .tip-img {
            width: 100%;
            height: 1.6rem;
            margin-bottom: 0.6rem;
        }
    }
}

.add2home {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99999;
    bottom: 2rem;
    width: 6.8rem;
    height: 1.12rem;
    border-radius: 1rem;
    background-color: var(--ex-primary-color);
    color: var(--ex-white);
    font-size: 0.32rem;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>