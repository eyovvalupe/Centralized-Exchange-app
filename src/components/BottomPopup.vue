<template>
    <Popup class="ex-bottom-popup" round v-model:show="popupShow" position="bottom" :safe-area-inset-top="safeAreaInsetTop" :safe-area-inset-bottom="safeAreaInsetBottom" :closeable="props.closeable" teleport="body" @closed="onClose">
        <div class="ex-bottom-popup-top">
            <img :src="getStaticImgUrl('/static/img/common/popup_top.svg')" />
        </div>
        <div class="ex-bottom-popup-body">
            <div class="ex-bottom-popup-title" v-if="title">
                {{ title }}
            </div>
            <slot/>
        </div>
    </Popup>
</template>

<script setup>
import { Popup } from 'vant'
import { ref, watch } from 'vue';
import { getStaticImgUrl } from "@/utils/index.js"
const props = defineProps({
    closeable:{
        type:Boolean,
        default:false
    },
    title:String,
    show:{
        type:Boolean,
        default:false
    },
    safeAreaInsetTop:{
        type:Boolean,
        default:false
    },
    safeAreaInsetBottom:{
        type:Boolean,
        default:false
    }
})
const emits = defineEmits(['update:show'])
const popupShow = ref(props.show)
watch(()=>props.show,(v)=>{
    popupShow.value = v
})
const onClose = ()=>{
    emits('update:show',popupShow.value)
}
</script>
<style lang="less" scoped>
.ex-bottom-popup{
    background: none;
    :deep(.van-popup__close-icon) {
        width: 0.6rem;
        height: 0.6rem;
        background-color: var(--ex-bg-color3);
        border-radius: 50%;
        text-align: center;
        line-height: 0.6rem;
        font-size: 0.36rem !important;
        position: absolute;
        right:0.28rem;
        top:0.24rem;
    }
}
.ex-bottom-popup-top{
    width: 100%;
    height: 0.58rem;
    img{
        object-fit: fill;
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
.ex-bottom-popup-body{
    background: linear-gradient(-180deg, #2e2e2e 0%, #1c1c1c 100%);
}
</style>
