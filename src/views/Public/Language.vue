<!-- 语言选择 -->
<template>
  <div class="page page_language">
    <Top :title="t('language.page_title')" />

    <CheckboxGroup v-model="checked" class="lang_box" :max="2">
      <div v-for="(item, i) in langList" :key="i" @click="clickItem(item)">
        <div class="lang_item" v-if="item.show">
          <div style="width: 0.57rem; height: 0.57rem" class="mr-[0.1rem]">
            <div style="width: 0.52rem;height: 0.52rem;">
              <img :src="getStaticImgUrl(`/static/icons/${item.icon}.svg`)" alt="">
            </div>
          </div>
          <div class="name">{{ item.name }}</div>
          <div :class="checked.val == item.val ? 'check' : 'uncheck'">
            <!-- <Checkbox checked-color="var(--ex-primary-color)" :name="item.val" /> -->
            <div :class="checked.val == item.val ? 'inner' : ''"></div>
          </div>
        </div>
      </div>
    </CheckboxGroup>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import { Checkbox, CheckboxGroup } from "vant";
import { ref } from "vue";
import Top from "@/components/Top.vue";
import router from "@/router";
import store from "@/store";
// import { setLocale } from "@/i18/utils";
import { useI18n } from "vue-i18n";
import { _langMap } from "@/utils/dataMap";

const { t, locale } = useI18n();
const props = defineProps({
  from: {
    type: String,
    default: "",
  },
});
const envLangList = ref(
  navigator.languages.reduce((acc, cur) => {
    if (cur == "zh-TW" || cur == "zh-HK") acc = acc.concat("ch");
    else acc = acc.concat(cur.slice(0, 2));
    return acc;
  }, [])
);
const checked = ref(JSON.parse(localStorage.getItem("language")) || "");
const langList = ref(_langMap);
const filteredLangList = ref(
  langList.value.filter((item) => envLangList.value.includes(item.val))
);
const clickItem = (item) => {
  localStorage.setItem("language", JSON.stringify(item));
  store.commit("setLanguage", item);
  checked.value = [item.val];
  locale.value = item.val;
  router.back();
};
</script>

<style lang="less" scoped>
.page_language {
  padding-top: 1.12rem;

  .lang_box {
    padding: 0.4rem 0.32rem;

    .lang_item {
      height: 1.04rem;
      overflow: hidden;
      background-color: var(--ex-bg-color2);
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
        color: var(--ex-text-color);
        font-size: 0.32rem;
      }

      .uncheck {
        width: 0.36rem;
        height: 0.36rem;
        border: 0.02rem solid var(--ex-border-color2);
        border-radius: 0.36rem;
      }

      .check {
        width: 0.36rem;
        height: 0.36rem;
        border: 0.02rem solid var(--ex-primary-color);
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
