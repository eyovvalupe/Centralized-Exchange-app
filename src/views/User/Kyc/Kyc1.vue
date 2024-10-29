<!-- 身份认证1 -->
<template>
    <div class="kyc_1">
      <Top :title="'身份认证'">
        <!-- 从注册来的 -->
        <template #right v-if="from == 'register'">
          <span
            @click="nextStep"
            style="color: #014cfa; font-weight: 400; font-size: 0.28rem"
            >跳过</span
          >
        </template>
        <!-- 提交过认证信息 -->
        <template #right v-if="kycInfo.name">
          <div class="kyc_status">
            <!-- <div class="icon">
                          <img class="status_icon" src="/static/img/user/record.png" alt="⚪">
                      </div> -->
            <span class="status" v-if="kycInfo.status == 'review'">审核中</span>
            <span class="status status_pass" v-if="kycInfo.status == 'success'"
              >审核通过</span
            >
            <span class="status status_fail" v-if="kycInfo.status == 'failure'"
              >审核失败</span
            >
          </div>
        </template>
        <template #right v-else>
          <div
            @click="jump('chat')"
            class="w-[0.72rem] h-[0.72rem] rounded-[50%] border-[#EDF2F7] border-[0.02rem] flex items-center justify-center"
          >
            <div class="w-[0.4rem] h-[0.4rem]">
              <img src="/static/img/user/serverB.svg" alt="server" />
            </div>
          </div>
        </template>
      </Top>
      <!-- 查看模式头部 -->
      <Tabs
        @change="nextStep"
        class="tabs"
        v-if="checkMode"
        style="width: 100%"
        :lazy-render="false"
        v-model:active="activeTab"
        sticky
        animated
        shrink
      >
        <Tab :title="'身份信息'"></Tab>
        <Tab :title="'照片'"></Tab>
      </Tabs>
      <!-- 表单模式头部 -->
      <div class="steps" v-if="!checkMode">
        <div class="bg-[#D9E4FF] w-[0.56rem] h-[0.56rem] rounded-[50%] flex items-center justify-center">
          <div class="bg-[#014CFA] w-[0.32rem] h-[0.32rem] rounded-[50%] flex items-center justify-center">
              <div class="bg-[#D9E4FF] w-[0.12rem] h-[0.12rem] rounded-[50%]"></div>
          </div>
        </div>
        <div class="w-[3.04rem] h-[0.16rem] bg-[#F5F7FC]"></div>
        <div class="bg-[#F5F7FC] w-[0.56rem] h-[0.56rem] rounded-[50%] text-[0.32rem] font-bold text-[#8F92A1] flex items-center justify-center">2</div>
      </div>
      <div class="steps" v-if="!checkMode">
          <div class="text-[0.28rem] text-[#061023] mr-[2.52rem]">基本信息</div>
          <div class="text-[0.28rem] text-[#8F92A1]">证件上传</div>
      </div>
      <div class="title" v-if="!checkMode">验证您的身份</div>
      <div class="tip" v-if="!checkMode">根据金融法规，我们需要确保您的详细信息与您的政府签发的身份证件完全匹配。</div>
  
      <!-- 表单 -->
      <div class="subtitle">法定姓名</div>
      <div
        class="item"
        :style="{ backgroundColor: checkMode ? '#f5f5f5' : '#fff' }"
      >
        <input
          :disabled="checkMode"
          v-model.trim="form.name"
          class="ipt"
          type="text"
          placeholder="法定姓名"
          maxlength="20"
        />
      </div>
      <div class="subtitle">证件号码</div>
      <div
        class="item"
        :style="{ backgroundColor: checkMode ? '#f5f5f5' : '#fff' }"
      >
        <input
          :disabled="checkMode"
          v-model.trim="form.idnum"
          class="ipt"
          type="text"
          placeholder="证件号码"
          maxlength="20"
        />
      </div>
      <div class="subtitle">出生日期</div>
      <div
        class="item"
        :style="{ backgroundColor: checkMode ? '#f5f5f5' : '#fff' }"
        @click="checkMode ? (showBottom = false) : (showBottom = true)"
      >
        {{ form.birthday }}
      </div>
  
      <Button
        v-if="kycInfo.status == 'none' || kycInfo.status == 'failure'"
        @click="submit"
        :loading="loading"
        :disabled="disabled"
        round
        :color="disabled ? '#C8CED5' : '#014CFA'"
        class="submit"
        type="primary"
        >继续</Button
      >
      <!-- <Button v-if="kycInfo.status == 'review' || kycInfo.status == 'success'" round color="#014CFA" class="submit"
              type="primary" @click="next">继续</Button> -->
  
      <!-- 日期选择 -->
      <Popup
        style="border-top-left-radius: 12px; border-top-right-radius: 12px"
        :safe-area-inset-top="true"
        :safe-area-inset-bottom="true"
        v-model:show="showBottom"
        position="bottom"
      >
        <DatePicker
          @cancel="cancelDate"
          @confirm="confirmDate"
          v-model="currentDate"
          title="选择日期"
          :min-date="minDate"
          :max-date="maxDate"
        />
      </Popup>
    </div>
  </template>
  
  <script setup>
  import Top from "@/components/Top.vue";
  import { Button, Popup, DatePicker, Tabs, Tab } from "vant";
  import { ref, computed } from "vue";
  import { _kyc1 } from "@/api/api";
  import { useRoute } from "vue-router";
  import router from "@/router";
  
  const activeTab = ref(0);
  const props = defineProps({
    kycInfo: {
      type: Object,
      default: () => {},
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
  const confirmDate = (val) => {
    const { selectedValues } = val;
    form.value.birthday = selectedValues.join(",");
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
      currentDate.value = props.kycInfo.birthday.split(",");
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
  
    .steps {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.2rem;
    }
  
    .title {
      color: #061023;
      font-weight: 600;
      font-size: 0.36rem;
      margin-bottom: 0.2rem;
      margin-top: 0.4rem;
    }
  
    .tip {
      color: #8F92A1;
      font-weight: 400;
      font-size: 0.24rem;
      margin-bottom: 0.6rem;
      line-height: 0.36rem;
    }
  
    .subtitle {
      font-weight: 400;
      color: #333333;
      font-size: 0.24rem;
      line-height: 0.36rem;
      margin-bottom: 0.2rem;
    }
  
    .item {
      height: 0.88rem;
      border: 1px solid #d0d8e2;
      border-radius: 0.16rem;
      margin-bottom: 0.4rem;
      padding: 0 0.24rem;
      display: flex;
      align-items: center;
  
      .ipt {
        width: 100%;
        height: 100%;
        font-weight: 400;
        font-size: 0.28rem;
      }
    }
  
    .submit {
      width: 100%;
      margin-top: 1.12rem;
      height: 1.12rem;
    }
  
    .kyc_status {
      display: flex;
      align-items: center;
  
      .icon {
        width: 0.8rem;
        height: 0.8rem;
        background-color: #ededed;
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
        color: #f3ba2f;
      }
  
      .status_pass {
        color: #38a843;
      }
  
      .status_fail {
        color: #e8503a;
      }
    }
  
    .tabs {
      margin-bottom: 0.4rem;
  
      :deep(.van-tabs__nav) {
        &::after {
          content: "";
          width: 100%;
          height: 0.02rem;
          background-color: #3b82f6;
          position: absolute;
          bottom: 0.32rem;
          left: 0;
          opacity: 0.3;
        }
      }
    }
  }
  </style>
  