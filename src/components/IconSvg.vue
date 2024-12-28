<template>
  <div>
    <!-- 
    @description: 
      所有 fill 属性要去掉
      需要保留viewBox属性(一键替换复制到剪贴板的js联系@jznzbw)

      vscode搜索"Svg Preview"插件,点击每一个可以看到预览图. 也可以单独开个路由去掉v-if可以查看全部图标

      希望大家共同维护本文件
   -->
    <!-- eslint-disable max-len 示范 -->
    <!-- 时钟 -->
    <img v-if="name === 'clock'" :src="getStaticImgUrl(`/static/img/common/clock.svg`)" alt="">
    <!-- 聊天文件 -->
    <img v-else-if="name === 'chatFile'" :src="getStaticImgUrl(`/static/img/common/link.svg`)" alt="">
    <!-- 聊天发送 -->
    <img v-else-if="name === 'chatSend'" :src="getStaticImgUrl(`/static/img/common/send.svg`)" alt="">
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
defineProps({
  name: String,
})
const attrs = useAttrs()
</script>

<style scoped>
svg {
  /* 通过设置 font-size 来改变图标大小 */
  width: 1em;
  /* 图标和文字相邻时，垂直对齐 */
  vertical-align: -0.15em;
  /* 通过设置 color 来改变 SVG 的颜色/fill */
  fill: currentColor;
  /* path 和 stroke 溢出 viewBox 部分在 IE 下会显示
      normalize.css 中也包含这行 */
  overflow: hidden;
  /* display: block; */
  -webkit-transition:
    font-size 0.25s linear,
    width 0.25s linear;
  -moz-transition:
    font-size 0.25s linear,
    width 0.25s linear;
  transition:
    font-size 0.25s linear,
    width 0.25s linear;
}
</style>
