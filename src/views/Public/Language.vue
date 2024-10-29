<!-- 语言选择 -->
<template>
  <div class="page page_language">
    <Top :title="'语言选择'" />

    <CheckboxGroup v-model="checked" class="lang_box" :max="2">
      <div v-for="(item, i) in navs" :key="i" class="lang_item" @click="clickItem(item)">
        <div class="logo">
          <img :src="item.icon" alt="english" />
        </div>
        <div class="name">{{ item.name }}</div>
        <div :class="checked == item.val ? 'check' : 'uncheck'">
          <!-- <Checkbox checked-color="#014CFA" :name="item.val" /> -->
           <div :class="checked == item.val ? 'inner' : ''"></div>
        </div>
      </div>
    </CheckboxGroup>
  </div>
</template>

<script setup>
import { Checkbox, CheckboxGroup } from 'vant'
import { ref } from 'vue'
import Top from '@/components/Top.vue'
import router from '@/router'
import store from '@/store'
import { setLocale } from '@/i18/utils'

const props = defineProps({
  from: {
    type: String,
    default: ''
  }
})

const checked = ref([store.state.i18Data.locale])
const navs = ref([
  { name: '中文简体', icon: '/static/img/common/cn.png', val: 'zh' },
  { name: 'English', icon: '/static/img/common/en.png', val: 'en' },
])

const clickItem = item => {
  checked.value = [item.val]
  store.commit('setI18Data', {
    name: item.name,
    locale: item.val,
    icon: item.icon,
  })
  setLocale()
  router.back()
}
</script>

<style lang="less" scoped>
.page_language {
  padding-top: 1.12rem;

  .lang_box {
    padding: 0.4rem 0.32rem;

    .lang_item {
      height: 1.04rem;
      overflow: hidden;
      background-color: #f5f7fc;
      border-radius: 0.32rem;
      display: flex;
      align-items: center;
      margin-bottom: 0.2rem;
      padding: 0 0.32rem;

      .logo {
        width: 0.52rem;
        height: 0.52rem;
        margin-right: 0.16rem;
      }

      .name {
        flex: 1;
        text-align: left;
        color: #1e1e2d;
        font-size: 0.32rem;
      }

      .uncheck {
        width: 0.36rem;
        height: 0.36rem;
        border: 0.02rem solid #d0d8e2;
        border-radius: 0.36rem;
      }

      .check {
        width: 0.36rem;
        height: 0.36rem;
        border: 0.02rem solid #014cfa;
        border-radius: 0.36rem;
        display: flex;
        justify-content: center;
        align-items: center;

        .inner {
          width: 0.2rem;
          height: 0.2rem;
          background-color: #014fca;
          border-radius: 0.2rem;
        }
      }
    }
  }
}
</style>
