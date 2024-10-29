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
        <div
          class="bg-[#D9E4FF] w-[0.56rem] h-[0.56rem] rounded-[50%] flex items-center justify-center"
        >
          <div
            class="bg-[#014CFA] w-[0.32rem] h-[0.32rem] rounded-[50%] flex items-center justify-center"
          >
            <div class="bg-[#D9E4FF] w-[0.12rem] h-[0.12rem] rounded-[50%]"></div>
          </div>
        </div>
        <div class="w-[3.04rem] h-[0.16rem] bg-[#F5F7FC]"></div>
        <div
          class="bg-[#F5F7FC] w-[0.56rem] h-[0.56rem] rounded-[50%] text-[0.32rem] font-bold text-[#8F92A1] flex items-center justify-center"
        >
          2
        </div>
      </div>
      <div class="steps" v-if="!checkMode">
        <div class="text-[0.28rem] text-[#061023] mr-[2.52rem]">基本信息</div>
        <div class="text-[0.28rem] text-[#8F92A1]">证件上传</div>
      </div>
      <div class="title" v-if="!checkMode">验证您的身份</div>
      <div class="tip" v-if="!checkMode">
        根据金融法规，我们需要确保您的详细信息与您的政府签发的身份证件完全匹配。
      </div>
  
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
        class="item justify-between"
        :style="{ backgroundColor: checkMode ? '#f5f5f5' : '#fff' }"
        @click="checkMode ? (showBottom = false) : (showBottom = true)"
      >
        <div :class="form.birthday ? 'text-[#061023]' : 'text-[#A4ACB9]'">
          {{ form.birthday || "请选择出生日期" }}
        </div>
        <div class="calendar-icon"></div>
      </div>
  
      <Button
        v-if="kycInfo.status == 'none' || kycInfo.status == 'failure'"
        @click="submit"
        :loading="loading"
        :disabled="disabled"
        round
        :color="'#014CFA'"
        class="submit"
        type="primary"
        >下一步</Button
      >
      <!-- <Button v-if="kycInfo.status == 'review' || kycInfo.status == 'success'" round color="#014CFA" class="submit"
              type="primary" @click="next">继续</Button> -->
  
      <!-- 日期选择 -->
      <Popup
        style="border-top-left-radius: 0.32rem; border-top-right-radius: 0.32rem"
        :safe-area-inset-top="true"
        :safe-area-inset-bottom="true"
        v-model:show="showBottom"
        position="bottom"
      >
        <div class="flex justify-between items-center mx-[0.32rem] mt-[0.24rem]">
          <div @click="cancelDate" class="close-icon"></div>
          <div
              @click="confirmDate"
            class="w-[1.2rem] h-[0.6rem] rounded-[0.32rem] bg-[#014CFA] text-white text-[0.3rem] flex items-center justify-center font-medium"
          >
            确认
          </div>
        </div>
        <DatePicker
          @cancel="cancelDate"
          @confirm="confirmDate"
          v-model="currentDate"
          title="出生日期"
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
      color: #8f92a1;
      font-weight: 400;
      font-size: 0.24rem;
      margin-bottom: 0.6rem;
      line-height: 0.36rem;
    }
  
    .subtitle {
      font-weight: 400;
      color: #061023;
      font-size: 0.28rem;
      margin-bottom: 0.2rem;
    }
  
    .item {
      height: 0.92rem;
      border: 0.02px solid #d0d8e2;
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
        color: #061023;
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
  .calendar-icon {
    width: 0.32rem;
    height: 0.32rem;
    background-image: url('data:image/svg+xml;utf8,<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(%23clip0_33_30849)"><path d="M13.6838 15.0392H2.39184C1.53584 15.0392 0.839844 14.3432 0.839844 13.4912V3.75122C0.839844 2.89522 1.53584 2.19922 2.39184 2.19922H13.6838C14.5358 2.19922 15.2318 2.89522 15.2318 3.74722V13.4872C15.2318 14.3432 14.5358 15.0392 13.6838 15.0392ZM2.39184 3.15922C2.06784 3.15922 1.79984 3.42322 1.79984 3.75122V13.4912C1.79984 13.8152 2.06384 14.0792 2.38784 14.0792H13.6798C14.0038 14.0792 14.2678 13.8152 14.2678 13.4912V3.75122C14.2678 3.42722 14.0038 3.16322 13.6798 3.16322H2.39184V3.15922Z" fill="%23666D80"/><path d="M14.7409 7.11177H1.44094C1.17694 7.11177 0.960938 6.89577 0.960938 6.63177C0.960938 6.36777 1.17694 6.15177 1.44094 6.15177H14.7409C15.0049 6.15177 15.2209 6.36777 15.2209 6.63177C15.2209 6.89577 15.0049 7.11177 14.7409 7.11177ZM4.79694 4.53177C4.53294 4.53177 4.31694 4.31977 4.31694 4.05577L4.29694 1.24377C4.29694 0.979766 4.50894 0.763766 4.77294 0.759766C5.03694 0.759766 5.25294 0.971766 5.25694 1.23577L5.27694 4.04777C5.27694 4.31177 5.06494 4.52777 4.79694 4.53177ZM11.2009 4.53177C10.9369 4.53177 10.7209 4.31977 10.7209 4.05577L10.7009 1.24377C10.7009 0.979766 10.9129 0.763766 11.1769 0.759766H11.1809C11.4449 0.759766 11.6609 0.971766 11.6609 1.23577L11.6809 4.04777C11.6849 4.31177 11.4729 4.52777 11.2009 4.53177C11.2049 4.53177 11.2049 4.53177 11.2009 4.53177ZM5.32494 9.63977H3.68494C3.42094 9.63977 3.20494 9.42377 3.20494 9.15977C3.20494 8.89577 3.42094 8.67977 3.68494 8.67977H5.32494C5.58894 8.67977 5.80494 8.89577 5.80494 9.15977C5.80494 9.42377 5.58894 9.63977 5.32494 9.63977ZM5.32494 12.1198H3.68494C3.42094 12.1198 3.20494 11.9038 3.20494 11.6398C3.20494 11.3758 3.42094 11.1598 3.68494 11.1598H5.32494C5.58894 11.1598 5.80494 11.3758 5.80494 11.6398C5.80494 11.9038 5.58894 12.1198 5.32494 12.1198ZM8.72094 9.64377H7.08094C6.81694 9.64377 6.60094 9.42776 6.60094 9.16376C6.60094 8.89977 6.81694 8.68377 7.08094 8.68377H8.72094C8.98494 8.68377 9.20094 8.89977 9.20094 9.16376C9.20094 9.42776 8.98494 9.64377 8.72094 9.64377ZM8.72094 12.1198H7.08094C6.81694 12.1198 6.60094 11.9038 6.60094 11.6398C6.60094 11.3758 6.81694 11.1598 7.08094 11.1598H8.72094C8.98494 11.1598 9.20094 11.3758 9.20094 11.6398C9.20094 11.9038 8.98494 12.1198 8.72094 12.1198ZM12.2969 9.64377H10.6569C10.3929 9.64377 10.1769 9.42776 10.1769 9.16376C10.1769 8.89977 10.3929 8.68377 10.6569 8.68377H12.2969C12.5609 8.68377 12.7769 8.89977 12.7769 9.16376C12.7769 9.42776 12.5609 9.64377 12.2969 9.64377ZM12.2969 12.1198H10.6569C10.3929 12.1198 10.1769 11.9038 10.1769 11.6398C10.1769 11.3758 10.3929 11.1598 10.6569 11.1598H12.2969C12.5609 11.1598 12.7769 11.3758 12.7769 11.6398C12.7769 11.9038 12.5609 12.1198 12.2969 12.1198Z" fill="%23666D80"/></g><defs><clipPath id="clip0_33_30849"><rect width="16" height="16" fill="white"/></clipPath></defs></svg>');
    background-size: contain;
    background-repeat: no-repeat;
  }
  .close-icon {
    width: 0.4rem; /* Adjust width as needed */
    height: 0.4rem; /* Adjust height as needed */
    background-image: url('data:image/svg+xml;utf8,<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.4725 9.61561L16.6182 3.43911C16.7272 3.32202 16.7865 3.16716 16.7837 3.00714C16.7809 2.84713 16.7161 2.69446 16.6031 2.5813C16.49 2.46813 16.3375 2.40331 16.1777 2.40049C16.0178 2.39766 15.8631 2.45706 15.7461 2.56616L9.60039 8.72207L3.45465 2.57028C3.33685 2.46881 3.18514 2.41557 3.02982 2.4212C2.87451 2.42683 2.72704 2.49093 2.61689 2.60067C2.50673 2.71041 2.44201 2.85772 2.43565 3.01316C2.42928 3.1686 2.48175 3.32071 2.58257 3.43911L8.7283 9.61561L2.58257 15.7468C2.52486 15.8039 2.47904 15.8718 2.44777 15.9468C2.41649 16.0217 2.40039 16.1021 2.40039 16.1833C2.40039 16.2645 2.41649 16.3449 2.44777 16.4198C2.47904 16.4947 2.52486 16.5627 2.58257 16.6198C2.69826 16.7354 2.85509 16.8004 3.01861 16.8004C3.18213 16.8004 3.33896 16.7354 3.45465 16.6198L9.60039 10.468L15.7461 16.6156C15.8618 16.7313 16.0187 16.7963 16.1822 16.7963C16.3457 16.7963 16.5025 16.7313 16.6182 16.6156C16.6759 16.5586 16.7217 16.4906 16.753 16.4157C16.7843 16.3408 16.8004 16.2604 16.8004 16.1792C16.8004 16.098 16.7843 16.0176 16.753 15.9426C16.7217 15.8677 16.6759 15.7998 16.6182 15.7427L10.4725 9.61561Z" fill="%23161616"/></svg>');
    background-size: contain;
    background-repeat: no-repeat;
  }
  
  </style>
  