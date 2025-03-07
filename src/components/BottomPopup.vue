<template>
    <Popup class="ex-bottom-popup" round v-model:show="popupShow" position="bottom" :close-on-popstate="closeOnPopstate"
        :safe-area-inset-top="safeAreaInsetTop" :safe-area-inset-bottom="safeAreaInsetBottom"
        :closeable="props.closeable" :teleport="from != 'account' ? 'body' : ''" @opened="emits('opened')"
        @close="emits('close')" @closed="onClose">
        <div class="ex-bottom-popup-top relative top-[0.02rem]">
            <div class="t"></div>
            <!-- <img v-lazy="getStaticImgUrl('/static/img/common/popup_top.svg')" /> -->
        </div>
        <div class="ex-bottom-popup-body">
            <div class="ex-bottom-popup-title" v-if="title">
                {{ title }}
            </div>
            <slot />
        </div>
    </Popup>
</template>

<script setup>
import { Popup } from 'vant'
import { ref, watch } from 'vue';
import { getStaticImgUrl } from "@/utils/index.js"
const props = defineProps({
    closeable: {
        type: Boolean,
        default: false
    },
    closeOnPopstate: Boolean, //是否在页面回退时自动关闭
    title: String,
    show: {
        type: Boolean,
        default: false
    },
    safeAreaInsetTop: { //是否开启顶部安全区适配
        type: Boolean,
        default: false
    },
    safeAreaInsetBottom: { //是否开启底部安全区适配
        type: Boolean,
        default: false
    },
    from: {
        type: String,
        default: ''
    }
})
const emits = defineEmits(['update:show', 'close', 'closed', 'opened'])
const popupShow = ref(props.show)
watch(() => props.show, (v) => {
    popupShow.value = v
})
const onClose = () => {
    emits('update:show', popupShow.value)
    emits('closed')
}
</script>
<style lang="less" scoped>
.ex-bottom-popup {
    background: none;
    border-radius: 0.48rem 0.48rem 0 0 !important;

    :deep(.van-popup__close-icon) {
        width: 0.6rem;
        height: 0.6rem;
        background-color: var(--ex-none);
        border-radius: 50%;
        text-align: center;
        line-height: 0.6rem;
        font-size: 0.36rem !important;
        position: absolute;
        right: 0.28rem;
        top: 0.24rem;
    }
}

.ex-bottom-popup-top {
    width: 100%;
    height: 0.58rem;
    background-color: var(--ex-bg-color9);
    position: relative;

    img {
        object-fit: fill;
    }

    .t {
        width: 0.64rem;
        height: 0.08rem;
        border-radius: 2rem;
        background-color: rgba(255, 255, 255, 0.5);
        position: absolute;
        top: 0.2rem;
        left: 50%;
        transform: translateX(-50%);
    }
}

.ex-bottom-popup-title {
    height: 0.44rem;
    line-height: 0.44rem;
    color: var(--ex-text-color);
    text-align: center;
    font-size: 0.32rem;
    font-weight: 500;
}

.ex-bottom-popup-body {
    background: var(--ex-bg-color9);
}
</style>
