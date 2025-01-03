<!-- 修改交易密码 -->
<template>
  <div class="page page-loginpass">
    <Top :title="t('change_login_pw.page_title')" />

    <!-- 表单 -->
    <div class="form">
      <div class="form_item margin_item">
        <div :class="originFocus || form.prevPassword ? 'flex flex-col' : 'flex'">
          <div class="text-color5"
            :class="originFocus || form.prevPassword ? 'text-[0.28rem] mb-[0.15rem]' : 'text-[0.32rem]'">{{
              $t("change_login_pw.origin_pw") }}</div>
          <input maxlength="20" v-model.trim="form.prevPassword" :type="showPass0 ? 'text' : 'password'"
            class="item_input" @focus="originFocus = true" @blur="originFocus = false" />
        </div>
        <div class="form_item_icon" @click="showPass0 = !showPass0">
          <div :class="showPass0 ? 'eye-show-icon' : 'eye-hidden-icon'">
            <img v-if="showPass0" :src="getStaticImgUrl('/static/img/common/open_eye.svg')" alt="">
            <img v-else :src="getStaticImgUrl('/static/img/common/close_eye.svg')" alt="">
          </div>
        </div>
      </div>

      <div class="form_item margin_item" :class="[isSame ? 'border-color-2' : 'border-error']">
        <div :class="newFocus || form.password ? 'flex flex-col' : 'flex'">
          <div class="text-color5"
            :class="newFocus || form.password ? 'text-[0.28rem] mb-[0.15rem]' : 'text-[0.32rem]'">{{
              $t("change_login_pw.new_pw") }}</div>
          <input maxlength="20" v-model.trim="form.password" :type="showPass ? 'text' : 'password'" class="item_input"
            @input="isSame = true" @focus="newFocus = true" @blur="newFocus = false" />
        </div>
        <div class="form_item_icon" @click="showPass = !showPass">
          <div :class="showPass ? 'eye-show-icon' : 'eye-hidden-icon'">
            <img v-if="showPass" :src="getStaticImgUrl('/static/img/common/open_eye.svg')" alt="">
            <img v-else :src="getStaticImgUrl('/static/img/common/close_eye.svg')" alt="">
          </div>
        </div>
      </div>
      <!-- 密码等级 -->
      <PasswordLevel style="position: relative; top: -0.25rem; left: 0.32rem" :password="form.password"
        :from="'reset'" />

      <div class="form_item margin_item" :class="[isSame ? 'border-color-2' : 'border-error']">
        <div :class="confirmFocus || form.password2 ? 'flex flex-col' : 'flex'">
          <div class="text-color5" :class="confirmFocus || form.password2 ? 'text-[0.28rem] mb-[0.15rem]' : 'text-[0.32rem]'">{{ $t("change_login_pw.confirm_pw") }}</div>
          <input maxlength="20" v-model.trim="form.password2" :type="showPass2 ? 'text' : 'password'" class="item_input"
            @input="isSame = true" @focus="confirmFocus = true" @blur="confirmFocus = false" />
        </div>
        <div class="form_item_icon" @click="showPass2 = !showPass2">
          <div :class="showPass2 ? 'eye-show-icon' : 'eye-hidden-icon'">
            <img v-if="showPass2" :src="getStaticImgUrl('/static/img/common/open_eye.svg')" alt="">
            <img v-else :src="getStaticImgUrl('/static/img/common/close_eye.svg')" alt="">
          </div>
        </div>
      </div>
    </div>

    <!-- 按钮 -->
    <div class="submit_box">
      <Button :loading="loading" round :disabled="disapled" color="var(--ex-primary-color)" class="submit"
        type="primary" @click="submit"><span style="color: var(--ex-black);">{{ $t("change_login_pw.btn")
          }}</span></Button>
    </div>

    <!-- 谷歌 -->
    <GoogleVerfCode @submit="submitForm" ref="ggRef" />
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import Top from "@/components/Top.vue";
import { _updatepw } from "@/api/api";
import GoogleVerfCode from "@/components/GoogleVerfCode.vue";
import { Button } from "vant";
import { ref, computed } from "vue";
import router from "@/router";
import { _login } from "@/api/api";
import PasswordLevel from "@/components/PasswordLevel.vue";
import { showToast } from "vant";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const ggRef = ref();
const showPass0 = ref(false);
const showPass = ref(false); // 密码显示
const showPass2 = ref(false);
const form = ref({
  // 表单
  prevPassword: "",
  password: "",
  password2: "",
});
const disapled = computed(
  () =>
    !form.value.password || !form.value.password2 || !form.value.prevPassword
);
const loading = ref(false); // 加载
const isSame = ref(true);
const originFocus = ref(false);
const newFocus = ref(false);
const confirmFocus = ref(false);
const submit = () => {
  if (form.value.password != form.value.password2) {
    showToast(t('change_login_pw.no_match_noti'));
    isSame.value = false;
  } else ggRef.value.open();
};
const submitForm = (code) => {
  const params = {
    password: form.value.password,
    googlecode: code,
  };
  if (loading.value) return;
  loading.value = true;
  _updatepw(params)
    .then((res) => {
      if (res.code == 200) {
        router.replace({
          name: "success",
        });
      }
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style lang="less" scoped>
.page-loginpass {
  padding-top: 1.52rem;

  .form {
    padding-inline: 0.32rem;
    padding-bottom: 0.1rem;

    .form_title {
      color: var(--ex-text-color5);
      font-weight: 400;
    }

    .form_item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 1.12rem;
      border-radius: 0.32rem;
      padding: 0 0.32rem;
      background-color: var(--ex-bg-color5);

      .item_input {
        flex: 1;
        color: var(--ex-text-color);
        font-weight: 400;
        font-size: 0.3rem;
      }

      &:has(.item_input:focus) {
        border: 0.02rem solid var(--ex-primary-color);
      }

      .form_item_user {
        width: 0.64rem;
        height: 0.64rem;
        margin-right: 0.32rem;
      }

      .form_item_icon {
        width: 0.4rem;
        height: 0.4rem;
        margin-left: 0.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .margin_item {
      margin-bottom: 0.4rem;
    }
  }

  .submit_box {
    padding: 0 0.32rem;

    .submit {
      width: 100%;
      height: 1.12rem;
      font-size: 0.36rem;
    }
  }
}

.eye-hidden-icon {
  width: 0.4rem;
  height: 0.32rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.eye-show-icon {
  width: 0.4rem;
  height: 0.26rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
