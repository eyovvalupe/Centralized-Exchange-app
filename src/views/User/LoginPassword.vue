<!-- 修改交易密码 -->
<template>
  <div class="page page-loginpass">
    <Top :title="t('change_login_pw.page_title')" />

    <!-- 表单 -->
    <div class="form">
      <div class="form_title">{{ $t("change_login_pw.origin_pw") }}</div>
      <div class="form_item margin_item">
        <input
          maxlength="20"
          v-model.trim="form.prevPassword"
          :placeholder="t('change_login_pw.origin_pw_placeholder')"
          :type="showPass0 ? 'text' : 'password'"
          class="item_input"
        />
        <div class="form_item_icon" @click="showPass0 = !showPass0">
          <div :class="showPass0 ? 'eye-show-icon' : 'eye-hidden-icon'"></div>
        </div>
      </div>

      <div class="form_title">{{ $t("change_login_pw.new_pw") }}</div>
      <div
        class="form_item margin_item"
        :class="[isSame ? 'border-[#D0D8E2]' : 'border-[#E8503A]']"
      >
        <input
          maxlength="20"
          v-model.trim="form.password"
          :placeholder="t('change_login_pw.new_pw_placeholder')"
          :type="showPass ? 'text' : 'password'"
          class="item_input"
          @focus="isSame = true"
        />
        <div class="form_item_icon" @click="showPass = !showPass">
          <div :class="showPass ? 'eye-show-icon' : 'eye-hidden-icon'"></div>
        </div>
      </div>
      <!-- 密码等级 -->
      <PasswordLevel
        style="position: relative; top: -0.25rem; left: 0.32rem"
        :password="form.password"
        :from="'reset'"
      />

      <div class="form_title">{{ $t("change_login_pw.confirm_pw") }}</div>
      <div
        class="form_item margin_item"
        :class="[isSame ? 'border-[#D0D8E2]' : 'border-[#E8503A]']"
      >
        <input
          maxlength="20"
          v-model.trim="form.password2"
          :placeholder="t('change_login_pw.confirm_pw_placeholder')"
          :type="showPass2 ? 'text' : 'password'"
          class="item_input"
          @focus="isSame = true"
        />
        <div class="form_item_icon" @click="showPass2 = !showPass2">
          <div :class="showPass ? 'eye-show-icon' : 'eye-hidden-icon'"></div>
        </div>
      </div>
    </div>

    <!-- 按钮 -->
    <div class="submit_box">
      <Button
        :loading="loading"
        round
        :disabled="disapled"
        color="#014CFA"
        class="submit"
        type="primary"
        @click="submit"
        >{{ $t("change_login_pw.btn") }}</Button
      >
    </div>

    <!-- 谷歌 -->
    <GoogleVerfCode @submit="submitForm" ref="ggRef" />
  </div>
</template>

<script setup>
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
      color: #061023;
      line-height: 0.42rem;
      font-weight: 400;
      font-size: 0.28rem;
      margin-bottom: 0.1rem;
    }

    .form_item {
      display: flex;
      align-items: center;
      height: 1.12rem;
      border-radius: 0.32rem;
      padding: 0 0.32rem;
      border-width: 0.02rem;

      .item_input {
        flex: 1;
        color: #061023;
        font-weight: 400;
        font-size: 0.3rem;
      }

      &:has(.item_input:focus) {
        border: 0.02rem solid #014cfa;
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
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16"><path d="M10.0007 2.99935C11.5329 2.99425 13.0355 3.42167 14.3358 4.23245C15.636 5.04324 16.681 6.20448 17.3507 7.58268C16.8673 8.57836 16.1836 9.4635 15.3423 10.1827L16.5173 11.3577C17.6757 10.3327 18.5923 9.04935 19.1673 7.58268C17.7257 3.92435 14.1673 1.33268 10.0007 1.33268C8.94232 1.33268 7.92565 1.49935 6.96732 1.80768L8.34232 3.18268C8.88399 3.07435 9.43399 2.99935 10.0007 2.99935ZM9.10899 3.94935L10.834 5.67435C11.309 5.88268 11.6923 6.26602 11.9007 6.74102L13.6257 8.46601C13.6923 8.18268 13.7423 7.88268 13.7423 7.57435C13.7507 5.50768 12.0673 3.83268 10.0007 3.83268C9.69232 3.83268 9.40065 3.87435 9.10899 3.94935ZM1.67565 1.22435L3.90898 3.45768C2.53425 4.53365 1.47253 5.95792 0.833984 7.58268C2.27565 11.241 5.83399 13.8327 10.0007 13.8327C11.2673 13.8327 12.484 13.591 13.6007 13.1493L16.4507 15.9993L17.6257 14.8243L2.85065 0.0410156L1.67565 1.22435ZM7.92565 7.47435L10.1007 9.64935C10.0673 9.65768 10.034 9.66602 10.0007 9.66602C9.44812 9.66602 8.91821 9.44652 8.52751 9.05582C8.13681 8.66512 7.91732 8.13522 7.91732 7.58268C7.91732 7.54102 7.92565 7.51602 7.92565 7.47435ZM5.09232 4.64102L6.55065 6.09935C6.35307 6.56895 6.25109 7.07322 6.25065 7.58268C6.25173 8.2027 6.4063 8.81281 6.70055 9.35856C6.99479 9.90431 7.41957 10.3687 7.93698 10.7104C8.45439 11.052 9.04832 11.2602 9.66579 11.3165C10.2833 11.3727 10.905 11.2752 11.4757 11.0327L12.2923 11.8493C11.559 12.0493 10.7923 12.166 10.0007 12.166C8.46837 12.1711 6.96576 11.7437 5.66555 10.9329C4.36535 10.1221 3.32033 8.96088 2.65065 7.58268C3.23398 6.39102 4.08398 5.40768 5.09232 4.64102Z" fill="%23C0C3D3"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.eye-show-icon {
  width: 0.4rem;
  height: 0.26rem;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 13"><path d="M9.99967 2.00065C11.532 1.99556 13.0346 2.42297 14.3348 3.23376C15.635 4.04454 16.68 5.20578 17.3497 6.58398C15.9747 9.39232 13.158 11.1673 9.99967 11.1673C6.84134 11.1673 4.02467 9.39232 2.64967 6.58398C3.31936 5.20578 4.36437 4.04454 5.66457 3.23376C6.96478 2.42297 8.46739 1.99556 9.99967 2.00065ZM9.99967 0.333984C5.83301 0.333984 2.27467 2.92565 0.833008 6.58398C2.27467 10.2423 5.83301 12.834 9.99967 12.834C14.1663 12.834 17.7247 10.2423 19.1663 6.58398C17.7247 2.92565 14.1663 0.333984 9.99967 0.333984ZM9.99967 4.50065C10.5522 4.5007 11.082 4.72022 11.4727 5.11092C11.8633 5.50161 12.0828 6.03149 12.0828 6.58398C12.0828 7.13648 11.8633 7.66636 11.4727 8.05705C11.082 8.44775 10.5522 8.66726 9.99967 8.66732C9.44718 8.66726 8.91732 8.44775 8.52667 8.05705C8.13601 7.66636 7.91654 7.13648 7.91654 6.58398C7.91654 6.03149 8.13601 5.50161 8.52667 5.11092C8.91732 4.72022 9.44718 4.5007 9.99967 4.50065ZM9.99967 2.83398C7.93301 2.83398 6.24967 4.51732 6.24967 6.58398C6.24967 8.65065 7.93301 10.334 9.99967 10.334C12.0663 10.334 13.7497 8.65065 13.7497 6.58398C13.7497 4.51732 12.0663 2.83398 9.99967 2.83398Z" fill="%238F92A1"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
