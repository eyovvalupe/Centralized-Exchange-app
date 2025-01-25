<!-- 加密货币图标 -->
<template>
    <img v-if="props.name" @error="imgError" :key="props.name" v-lazy="getStaticImgUrl(`static/img/crypto/${props.name}.svg`)" :alt="props.name" />
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js";

const props = defineProps({
    name: ''
})

const imgError = e => {
    e.target.src = getStaticImgUrl(`static/img/crypto/default.svg`)
}
</script>