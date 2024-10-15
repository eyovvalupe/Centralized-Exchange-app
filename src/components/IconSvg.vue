<template>
  <!-- 
    @description: 
      所有 fill 属性要去掉
      需要保留viewBox属性(一键替换复制到剪贴板的js联系@jznzbw)

      vscode搜索"Svg Preview"插件,点击每一个可以看到预览图. 也可以单独开个路由去掉v-if可以查看全部图标

      希望大家共同维护本文件
   -->
  <!-- eslint-disable max-len 示范 -->
  <!-- 时钟 -->
  <svg v-if="name === 'clock'" viewBox="0 0 13 13" v-bind="attrs" aria-hidden="true">
    <path
      d="M6.5 12.75C3.04822 12.75 0.25 9.95175 0.25 6.5C0.25 3.04822 3.04822 0.25 6.5 0.25C9.95175 0.25 12.75 3.04822 12.75 6.5C12.75 9.95175 9.95175 12.75 6.5 12.75ZM6.5 11.5C9.26144 11.5 11.5 9.26144 11.5 6.5C11.5 3.73857 9.26144 1.5 6.5 1.5C3.73857 1.5 1.5 3.73857 1.5 6.5C1.5 9.26144 3.73857 11.5 6.5 11.5ZM7.125 6.5H9.625V7.75H5.875V3.375H7.125V6.5Z"
    />
  </svg>
</template>

<script setup>
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
