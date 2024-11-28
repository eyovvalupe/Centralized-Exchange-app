<!-- 语言选择 -->
<template>
  <div class="page page_language">
    <Top :title="t('language.page_title')" />

    <CheckboxGroup v-model="checked" class="lang_box" :max="2">
      <div
        v-for="(item, i) in filteredLangList"
        :key="i"
        class="lang_item"
        @click="clickItem(item)"
      >
        <div style="width: 0.57rem; height: 0.57rem" class="mr-[0.1rem]">
          <div :class="item.icon"></div>
        </div>
        <div class="name">{{ item.name }}</div>
        <div :class="checked.val == item.val ? 'check' : 'uncheck'">
          <!-- <Checkbox checked-color="#014CFA" :name="item.val" /> -->
          <div :class="checked.val == item.val ? 'inner' : ''"></div>
        </div>
      </div>
    </CheckboxGroup>
  </div>
</template>

<script setup>
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
const filteredLangList = ref(langList.value.filter(item => envLangList.value.includes(item.val)))
const clickItem = (item) => {
  localStorage.setItem('language', JSON.stringify(item))
  store.commit("setLanguage", item)
  checked.value = [item.val];
  locale.value = item.val
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
  .china_icon {
    width: 0.52rem;
    height: 0.52rem;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url('data:image/svg+xml,%3Csvg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Ccircle cx="13" cy="13" r="13" fill="%23E22D2D"/%3E%3Cmask id="mask0_585_12466" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="26" height="26"%3E%3Ccircle cx="13" cy="13" r="13" fill="%23CE1126"/%3E%3C/mask%3E%3Cg mask="url(%23mask0_585_12466)"%3E%3Cpath fill-rule="evenodd" clip-rule="evenodd" d="M17.5763 4.02505L17.2186 3L16.8597 4.02531L15.7273 4.03332L16.5812 4.70997L16.2593 5.82851L17.2186 5.17071L18.1779 5.82851L17.8337 4.72469L18.7087 4.03306L17.5763 4.02505ZM21.8676 8.22082L21.51 7.19576L21.151 8.22107L20.0186 8.22908L20.8726 8.90573L20.5507 10.0243L21.51 9.36648L22.4692 10.0243L22.1251 8.92045L23 8.22882L21.8676 8.22082ZM21.7196 14.3104L21.3619 13.2854L21.003 14.3107L19.8706 14.3187L20.7246 14.9954L20.4026 16.1139L21.3619 15.4561L22.3212 16.1139L21.977 15.0101L22.852 14.3184L21.7196 14.3104ZM17.5763 18.4693L17.2186 17.4442L16.8597 18.4695L15.7273 18.4775L16.5812 19.1542L16.2593 20.2727L17.2186 19.6149L18.1779 20.2727L17.8337 19.1689L18.7087 18.4773L17.5763 18.4693ZM8.63639 8.11307L7.54533 4.81818L6.45452 8.11255L3 8.13888L5.60066 10.314L4.61906 13.9091L7.54533 11.7951L10.4716 13.9091L9.42162 10.3614L12.0909 8.13941L8.63639 8.11307Z" fill="%23FCD116"/%3E%3C/g%3E%3C/svg%3E');
  }
  .us_icon {
    width: 0.52rem;
    height: 0.52rem;
    background-image: url('data:image/svg+xml,%3Csvg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cg clip-path="url(%23clip0_33_30884)"%3E%3Cpath d="M0.990442 17.9863H25.0101C24.7198 18.685 24.3709 19.3535 23.9668 19.984H2.03369C1.63069 19.3535 1.28078 18.685 0.990442 17.9863ZM3.60127 21.9816H22.3993C21.6714 22.7436 20.8541 23.4147 19.965 23.9804H6.03444C5.14538 23.4147 4.32802 22.7436 3.60019 21.9816H3.60127ZM0.0371094 13.9866H25.9634C25.9125 14.6691 25.8085 15.3354 25.6568 15.9843H0.343692C0.189731 15.3274 0.0872261 14.6595 0.0371094 13.9866ZM6.07885 1.99414H19.9228C20.8178 2.55828 21.6411 3.22908 22.3743 3.99181H3.62727C4.36054 3.22908 5.18377 2.55828 6.07885 1.99414ZM2.05102 5.99164H23.9495C24.3558 6.62322 24.7078 7.29272 25.0003 7.99364H1.00019C1.29269 7.29272 1.64477 6.62322 2.05102 5.99164ZM0.351276 9.98588H25.6493C25.8031 10.6348 25.9093 11.3021 25.9613 11.9835H0.039276C0.0923593 11.3011 0.197443 10.6348 0.351276 9.98588Z" fill="white"/%3E%3Cpath d="M0.344522 15.9878H25.6555C25.493 16.6758 25.2763 17.3442 25.0098 17.9855H0.990188C0.72105 17.3383 0.505113 16.6702 0.344522 15.9878ZM6.03527 23.9796H19.9658C18.1077 25.1615 15.9785 25.8492 13.78 25.9772H12.2222C10.0237 25.8492 7.89447 25.1615 6.03635 23.9796H6.03527ZM2.03019 19.9788H23.9698C23.5127 20.696 22.9873 21.3655 22.4033 21.9765H3.59669C3.01087 21.3631 2.48622 20.694 2.03019 19.9788ZM0.999938 7.99176H25.0001C25.2688 8.6331 25.4865 9.30043 25.6501 9.98943H0.349939C0.513522 9.30043 0.731272 8.6331 0.999938 7.99176ZM3.62702 3.99102H22.373C22.9613 4.6031 23.4888 5.2726 23.9493 5.98976H2.05077C2.5101 5.2726 3.03877 4.6031 3.62702 3.99102ZM0.0390225 11.9871H25.961C26.0123 12.6523 26.013 13.3205 25.9632 13.9858H0.0368559C-0.0129982 13.3205 -0.0122739 12.6523 0.0390225 11.9871ZM19.9214 1.99335H6.07752C8.14981 0.687021 10.5503 -0.00421491 13 1.93369e-05C15.5437 1.93369e-05 17.9173 0.730185 19.9214 1.99335Z" fill="%23BF0A30"/%3E%3Cpath d="M0.0379193 14.0075C0.0124364 13.6723 -0.000211764 13.3362 2.68145e-06 13C2.68145e-06 5.82074 5.82075 0 13 0C13.4387 0 13.8721 0.0216667 14.3 0.065V14.0075H0.0379193Z" fill="%23002868"/%3E%3Cpath d="M0.00108332 13.1708C0.000330173 13.0892 0.000330173 13.0076 0.00108332 12.926V12.9228C0.00108332 12.8523 0.00108332 12.7819 0.00325 12.7126H0.065L0.176583 12.3876L0.2795 12.7126H0.626166L0.343416 12.9228L0.450666 13.2477L0.176583 13.0419L0 13.1719L0.00108332 13.1708ZM0.28275 10.2892C0.312 10.1516 0.343416 10.0151 0.377 9.87859H0.628333L0.345583 10.0801L0.452833 10.4148L0.284916 10.2881L0.28275 10.2892ZM7.58766 1.17834C7.71766 1.11768 7.84983 1.05918 7.98199 1.00501L8.00583 1.07651H8.34924L8.07408 1.28234L8.17699 1.61276L7.89858 1.40259L7.62449 1.61276L7.72741 1.28234L7.58658 1.17726L7.58766 1.17834ZM10.4758 0.746094L10.5787 1.07543H10.9254L10.6513 1.28126L10.7542 1.61168L10.4802 1.40151L10.1963 1.61168L10.3047 1.28126L10.0295 1.07543H10.3729L10.4758 0.74826V0.746094ZM10.4758 3.65267L10.5787 3.98309H10.9254L10.6513 4.18892L10.7542 4.51826L10.4802 4.31242L10.1963 4.51826L10.3047 4.18892L10.0295 3.98309H10.3729L10.4758 3.65267ZM10.4758 6.56792L10.5787 6.89834H10.9254L10.6513 7.10417L10.7542 7.4335L10.4802 7.22767L10.1963 7.4335L10.3047 7.10417L10.0295 6.89834H10.3729L10.4758 6.56792ZM10.4758 9.54384L10.5787 9.87317H10.9254L10.6513 10.079L10.7542 10.4083L10.4802 10.2025L10.1963 10.4083L10.3047 10.079L10.0295 9.87317H10.3729L10.4758 9.54384ZM10.4758 12.4324L10.5787 12.7627H10.9254L10.6513 12.968L10.7542 13.2973L10.4802 13.0915L10.1963 13.2973L10.3047 12.968L10.0295 12.7627H10.3729L10.4758 12.4324Z" fill="white"/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id="clip0_33_30884"%3E%3Crect width="26" height="26" fill="white"/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E');
    background-size: cover;
    background-repeat: none;
  }
}
</style>
