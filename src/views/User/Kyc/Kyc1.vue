<!-- 身份认证1 -->
<template>
  <div class="kyc_1">
    <Top :title="t('kyc.page_title')">
      <!-- 从注册来的 -->
      <template #right v-if="from == 'register'">
        <span @click="nextStep" style="color: var(--ex-primary-color); font-weight: 400; font-size: 0.28rem">{{ t('google_auth.from_register_skip') }}</span>
      </template>
      <!-- 提交过认证信息 -->
      <template #right v-if="kycInfo.name">
        <div class="kyc_status">
          <span class="status" v-if="kycInfo.status == 'review'">{{ t('kyc.status_pending') }}</span>
          <span class="status status_pass" v-if="kycInfo.status == 'success'">{{ t('kyc.verify_success') }}</span>
          <span class="status status_fail" v-if="kycInfo.status == 'failure'">{{ t('kyc.verify_failure') }}</span>
        </div>
      </template>
      <template #right v-else>
        <div @click="jump('chat')"
          class="w-[0.72rem] h-[0.72rem] rounded-[50%] border-color border-[0.02rem] flex items-center justify-center">
          <div class="w-[0.4rem] h-[0.4rem]">
            <img :src="getStaticImgUrl('/static/img/user/server.svg')" alt="server" />
          </div>
        </div>
      </template>
    </Top>
    <!-- 查看模式头部 -->
    <Tabs @change="nextStep" class="tabs" v-if="checkMode" style="width: 100%" :lazy-render="false"
      v-model:active="activeTab" sticky animated shrink>
      <Tab :title="'身份信息'"></Tab>
      <Tab :title="'照片'"></Tab>
    </Tabs>
    <!-- 表单模式头部 -->
    <div class="steps" v-if="!checkMode">
      <div class="bg-color4 w-[0.56rem] h-[0.56rem] rounded-[50%] flex items-center justify-center">
        <div class="bg-primary w-[0.32rem] h-[0.32rem] rounded-[50%] flex items-center justify-center">
          <div class="bg-color4 w-[0.12rem] h-[0.12rem] rounded-[50%]"></div>
        </div>
      </div>
      <div class="w-[3.04rem] h-[0.16rem] bg-color2"></div>
      <div
        class="bg-color2 w-[0.56rem] h-[0.56rem] rounded-[50%] text-[0.32rem] font-bold text-color3 flex items-center justify-center">
        2
      </div>
    </div>
    <div class="steps" v-if="!checkMode">
      <div class="text-[0.28rem] text-color mr-[2.52rem]">{{ $t("kyc.first_basic_info") }}</div>
      <div class="text-[0.28rem] text-color3">{{ $t("kyc.first_upload_card") }}</div>
    </div>
    <div class="title" v-if="!checkMode">{{ $t("kyc.first_title") }}</div>
    <div class="tip" v-if="!checkMode">
      {{ $t('kyc.first_description') }}
    </div>

    <!-- 表单 -->
    <div class="subtitle">{{ $t("kyc.first_legal_name") }}</div>
    <div class="item" :style="{ backgroundColor: checkMode ? 'var(--ex-bg-color2)' : 'var(--ex-bg-color)' }">
      <input :disabled="checkMode" v-model.trim="form.name" class="ipt" type="text"
        :placeholder="t('kyc.first_legal_name')" maxlength="20" />
    </div>
    <div class="subtitle">{{ $t("kyc.first_card_id") }}</div>
    <div class="item" :style="{ backgroundColor: checkMode ? 'var(--ex-bg-color2)' : 'var(--ex-bg-color)' }">
      <input :disabled="checkMode" v-model.trim="form.idnum" class="ipt" type="text"
        :placeholder="t('kyc.first_card_id')" maxlength="20" />
    </div>
    <div class="subtitle">{{ $t('kyc.first_birthday') }}</div>
    <div class="item justify-between" :style="{ backgroundColor: checkMode ? 'var(--ex-bg-color2)' : 'var(--ex-bg-color)' }"
      @click="checkMode ? (showBottom = false) : (showBottom = true)">
      <div :class="form.birthday ? 'text-color' : 'text-color4'">
        {{ form.birthday || $t("kyc.first_birthday_placeholder") }}
      </div>
      <div class="calendar-icon">
        <img :src="getStaticImgUrl('/static/img/user/calendar.svg')" alt="">
      </div>
    </div>

    <Button v-if="kycInfo.status == 'none' || kycInfo.status == 'failure'" @click="submit" :loading="loading"
      :disabled="disabled" round :color="'var(--ex-primary-color)'" class="submit" type="primary">{{ $t("kyc.first_btn") }}</Button>
    <!-- <Button v-if="kycInfo.status == 'review' || kycInfo.status == 'success'" round color="var(--ex-primary-color)" class="submit"
              type="primary" @click="next">继续</Button> -->

    <!-- 日期选择 -->
    <Popup style="border-top-left-radius: 0.32rem; border-top-right-radius: 0.32rem" :safe-area-inset-top="true"
      :safe-area-inset-bottom="true" v-model:show="showBottom" position="bottom" class="date_picker">
      <div class="flex justify-between items-center mx-[0.32rem] mt-[0.24rem]">
        <div @click="cancelDate" class="close-icon">
          <img :src="getStaticImgUrl('/static/img/common/close.svg')" alt="">
        </div>
        <div @click="confirmDate"
          class="w-[1.2rem] h-[0.6rem] rounded-[0.32rem] bg-primary text-white text-[0.3rem] flex items-center justify-center font-medium">
          {{ $t("kyc.first_confirm") }}
        </div>
      </div>
      <DatePicker @cancel="cancelDate" @confirm="confirmDate" v-model="currentDate" :title="t('kyc.first_birthday')"
        :min-date="minDate" :max-date="maxDate" class="date_picker" />
    </Popup>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import Top from "@/components/Top.vue";
import { Button, Popup, DatePicker, Tabs, Tab } from "vant";
import { ref, computed } from "vue";
import { _kyc1 } from "@/api/api";
import { useRoute } from "vue-router";
import router from "@/router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const activeTab = ref(0);
const props = defineProps({
  kycInfo: {
    type: Object,
    default: () => { },
  },
});
const route = useRoute();
const from = ref(route.query.from); // 'register'-表示从注册来

const checkMode = computed(() => {
  return props.kycInfo.status == "review" || props.kycInfo.status == "success";
});

const loading = ref(false);
const disabled = computed(() => {
  return !(form.value.name && form.value.idnum && form.value.birthday);
});
const showBottom = ref(false);
const maxDate = ref(new Date());
const minDate = ref(new Date(Date.now() - 365 * 100 * 24 * 60 * 60 * 1000));
const currentDate = ref([maxDate.value.getFullYear() - 18, "01", "01"]);
const jump = (name, query) => {
  router.push({
    name,
    query,
  });
};

const cancelDate = () => {
  showBottom.value = false;
};
const confirmDate = () => {
  form.value.birthday = currentDate.value.join("/");
  showBottom.value = false;
};

const form = ref({
  name: "",
  idtype: "身份证",
  idnum: "",
  birthday: "",
});
if (props.kycInfo) {
  form.value.name = props.kycInfo.name;
  form.value.idnum = props.kycInfo.idnum;
  form.value.birthday = props.kycInfo.birthday;
  if (props.kycInfo.birthday) {
    currentDate.value = props.kycInfo.birthday.split("/");
  }
}

const submit = () => {
  if (loading.value) return;
  loading.value = true;
  _kyc1(form.value)
    .then((res) => {
      if (res.code == 200) {
        nextStep();
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const emits = defineEmits(["next"]);
const next = () => {
  // 审核成功后 点击继续跳转2
  emits("next");
};

const nextStep = () => {
  next();
};
</script>

<style lang="less" scoped>
.kyc_1 {
  padding: 1.24rem 0.32rem 0.2rem 0.32rem;

  .date_picker {
    :deep(.van-picker__toolbar) {
      .van-picker__cancel {
        display: none;
      }

      .van-picker__confirm {
        display: none;
      }
    }
  }

  .steps {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.2rem;
  }

  .title {
    color: var(--ex-text-color);
    font-size: 0.36rem;
    margin-bottom: 0.2rem;
    margin-top: 0.6rem;
  }

  .tip {
    color: var(--ex-text-color3);
    font-weight: 400;
    font-size: 0.24rem;
    margin-bottom: 0.6rem;
    line-height: 0.36rem;
  }

  .subtitle {
    font-weight: 400;
    color: var(--ex-text-color);
    font-size: 0.28rem;
    margin-bottom: 0.2rem;
  }

  .item {
    height: 0.92rem;
    border: 0.02px solid var(--ex-border-color2);
    border-radius: 0.32rem;
    margin-bottom: 0.4rem;
    padding: 0 0.32rem;
    display: flex;
    align-items: center;

    .ipt {
      width: 100%;
      height: 100%;
      font-weight: 400;
      font-size: 0.3rem;
      color: var(--ex-text-color);
    }
  }

  .submit {
    width: 100%;
    height: 1.12rem;
    margin-top: 0.4rem;
    font-size: 0.36rem;
  }

  .kyc_status {
    display: flex;
    align-items: center;

    .icon {
      width: 0.8rem;
      height: 0.8rem;
      background-color: var(--ex-bg-color3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 0.16rem;

      .status_icon {
        width: 0.48rem !important;
        height: 0.48rem !important;
      }
    }

    .status {
      font-size: 0.28rem;
      font-weight: 400;
      color: var(--ex-warning-color);
    }

    .status_pass {
      color: var(--ex-success-color);
    }

    .status_fail {
      color: var(--ex-error-color);
    }
  }

  .tabs {
    margin-bottom: 0.4rem;

    :deep(.van-tabs__nav) {
      &::after {
        content: "";
        width: 100%;
        height: 0.02rem;
        background-color: var(--ex-primary-color);
        position: absolute;
        bottom: 0.32rem;
        left: 0;
        opacity: 0.3;
      }
    }
  }
}

.calendar-icon {
  width: 0.32rem;
  height: 0.32rem;
  background-size: contain;
  background-repeat: no-repeat;
}

.close-icon {
  width: 0.4rem;
  height: 0.4rem;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
