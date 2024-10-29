<!-- 身份认证2 -->
<template>
    <div class="kyc_2">
      <Top :title="'身份认证'">
        <!-- 从注册来的 -->
        <template #right v-if="from == 'register'">
          <span
            @click="nextStep"
            style="color: #014cfa; font-weight: 400; font-size: 0.28rem"
            >跳过</span
          >
        </template>
        <!-- 从个人中心来的 -->
        <template #right v-else>
          <div
            @click="goTip"
            style="display: flex; align-items: center; line-height: 0"
          >
            <div
              style="
                width: 0.24rem;
                height: 0.24rem;
                position: relative;
                top: -0.01rem;
                left: -0.04rem;
              "
            >
              <img src="/static/img/user/warning.png" alt="icon" />
            </div>
            <span style="color: #014cfa; font-weight: 400; font-size: 0.24rem"
              >照片上传要求</span
            >
          </div>
        </template>
        <!-- 提交过认证信息 -->
        <template #right v-if="kycInfo.idimg_1">
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
        @change="preStep"
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
          class="bg-[#D9E4FF] w-[0.68rem] h-[0.68rem] rounded-[50%] flex items-center justify-center"
        >
          <div
            class="bg-[#014CFA] w-[0.56rem] h-[0.56rem] rounded-[50%] flex items-center justify-center"
          >
            <div class="check-icon"></div>
          </div>
        </div>
        <div class="w-[3.04rem] h-[0.16rem] bg-[#F5F7FC]"></div>
        <div
          class="bg-[#D9E4FF] w-[0.56rem] h-[0.56rem] rounded-[50%] flex items-center justify-center"
        >
          <div
            class="bg-[#014CFA] w-[0.32rem] h-[0.32rem] rounded-[50%] flex items-center justify-center"
          >
            <div class="bg-[#D9E4FF] w-[0.12rem] h-[0.12rem] rounded-[50%]"></div>
          </div>
        </div>
      </div>
      <div class="steps" v-if="!checkMode">
        <div class="text-[0.28rem] text-[#061023] mr-[2.52rem]">基本信息</div>
        <div class="text-[0.28rem] text-[#8F92A1]">证件上传</div>
      </div>
      <div class="content_title" v-if="!checkMode">证件上传</div>
      <div class="tip" v-if="!checkMode">请上传证件，仅用于身份核实</div>
      <!-- 表单 -->
      <!-- 上传元素 -->
      <div class="flex justify-between flex-wrap gap-[0.2rem] mb-[0.4rem]">
        <div class="item">
          <!-- 没有上传 -->
          <div
            class="id_back1 flex flex-col items-center justify-center"
            v-if="!files.front.loading && !files.front.url"
          >
            <div class="camera_icon mb-[0.16rem]"></div>
            <div class="text-[0.28rem] text-[#061023]">证件正面</div>
          </div>
          <!-- 上传中 -->
          <div class="item_box loading" v-if="files.front.loading">
            <Loaidng :loading="files.front.loading" />
          </div>
          <!-- 已上传 -->
          <div class="item_box success" v-if="files.front.url">
            <img :src="files.front.url" alt="img" />
  
            <div
              class="delete_icon"
              @click="deleteImg('front')"
              v-if="!checkMode"
            >
              <img src="/static/img/user/delete.png" alt="x" />
            </div>
          </div>
          <!-- 上传 -->
          <Uploader
            v-if="!checkMode"
            :name="'front'"
            class="uploader"
            :after-read="afterRead"
          />
        </div>
        <div class="item">
          <!-- 没有上传 -->
          <div
            class="id_back2 flex flex-col items-center justify-center"
            v-if="!files.back.loading && !files.back.url"
          >
            <div class="camera_icon mb-[0.16rem]"></div>
            <div class="text-[0.28rem] text-[#061023]">证件反面</div>
          </div>
          <!-- 上传中 -->
          <div class="item_box loading" v-if="files.back.loading">
            <Loaidng :loading="files.back.loading" />
          </div>
          <!-- 已上传 -->
          <div class="item_box success" v-if="files.back.url">
            <img :src="files.back.url" alt="img" />
  
            <div class="delete_icon" @click="deleteImg('back')" v-if="!checkMode">
              <img src="/static/img/user/delete.png" alt="x" />
            </div>
          </div>
          <!-- 上传 -->
          <Uploader
            v-if="!checkMode"
            :name="'back'"
            class="uploader"
            :after-read="afterRead"
          />
        </div>
        <div class="item">
          <!-- 没有上传 -->
          <div
            class="id_back3 flex flex-col items-center justify-center"
            v-if="!files.hand.loading && !files.hand.url"
          >
            <div class="camera_icon mb-[0.16rem]"></div>
            <div class="text-[0.28rem] text-[#061023]">手持证件</div>
          </div>
          <!-- 上传中 -->
          <div class="item_box loading" v-if="files.hand.loading">
            <Loaidng :loading="files.hand.loading" />
          </div>
          <!-- 已上传 -->
          <div class="item_box success" v-if="files.hand.url">
            <img :src="files.hand.url" alt="img" />
  
            <div class="delete_icon" @click="deleteImg('hand')" v-if="!checkMode">
              <img src="/static/img/user/delete.png" alt="x" />
            </div>
          </div>
          <!-- 上传 -->
          <Uploader
            v-if="!checkMode"
            :name="'hand'"
            class="uploader"
            :after-read="afterRead"
          />
        </div>
      </div>
      <div
        class="bg-[#F5F7FC] rounded-[0.32rem] w-full h-[2.62rem] px-[0.32rem] py-[0.24rem] mb-[0.8rem]"
      >
        <div class="text-[0.28rem text-[#061023] mb-[0.2rem]">上传要求</div>
        <div class="text-[0.24rem] text-[#8F92A1] mb-[0.2rem]">
          拍摄时确保身份证边框完整、字迹清晰、亮度均匀
        </div>
        <div class="flex justify-between">
          <div>
            <div
              class="w-[1.26rem] h-[0.8rem] bg-white flex items-center justify-center overflow-hidden rounded-[0.2rem] mb-[0.12rem]"
            >
              <div class="id_status"></div>
            </div>
            <div class="flex items-center justify-between">
              <div class="check_icon"></div>
              <div class="text-[0.24rem] text-[#061023]">标准拍摄</div>
            </div>
          </div>
          <div>
            <div
              class="w-[1.26rem] h-[0.8rem] relative bg-white flex items-center overflow-hidden rounded-[0.2rem] mb-[0.12rem]"
            >
              <div class="id_status absolute right-0 -mr-[0.16rem]"></div>
            </div>
            <div class="flex items-center justify-between">
              <div class="uncheck_icon"></div>
              <div class="text-[0.24rem] text-[#061023]">拍摄不全</div>
            </div>
          </div>
          <div>
            <div
              class="w-[1.26rem] h-[0.8rem] bg-white flex items-center justify-center overflow-hidden rounded-[0.2rem] mb-[0.12rem]"
            >
              <div class="id_status">
                <div
                  class="bg-[rgba(255,255,255,0.4)] w-full h-full  rounded-[0.08rem] backdrop-blur-[0.02rem]"
                ></div>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="uncheck_icon"></div>
              <div class="text-[0.24rem] text-[#061023]">拍摄模糊</div>
            </div>
          </div>
          <div>
            <div
              class="w-[1.26rem] h-[0.8rem] bg-white flex items-center justify-center overflow-hidden rounded-[0.2rem] mb-[0.12rem]"
            >
              <div class="id_status flex items-center justify-center">
                <div
                  class="bg-white w-[0.68rem] h-[0.28rem] rounded-[0.2rem] blur-[0.05rem]"
                ></div>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="uncheck_icon"></div>
              <div class="text-[0.24rem] text-[#061023]">闪光过度</div>
            </div>
          </div>
        </div>
      </div>
  
      <Button
        v-if="kycInfo.status == 'none' || kycInfo.status == 'failure'"
        :color="'#014CFA'"
        @click="submit"
        :loading="loading"
        :disabled="disabled"
        round
        class="submit"
        type="primary"
        >完成</Button
      >
      <!-- <Button v-if="kycInfo.status == 'review' || kycInfo.status == 'success'" color="#014CFA" @click="nextStep"
              :loading="loading" round class="submit" type="primary">完成</Button> -->
    </div>
  </template>
  
  <script setup>
  import Top from "@/components/Top.vue";
  import { Uploader, Button, showToast, Tabs, Tab } from "vant";
  import { ref, computed } from "vue";
  import { UPLOAD_ADDRESS, UPLOAD_TOKEN } from "@/config.js";
  import { _fetchWithTimeout } from "@/api/upload";
  import Loaidng from "@/components/Loaidng.vue";
  import { _compressImg } from "@/utils/index";
  import { _kyc2, _kycGet } from "@/api/api";
  import router from "@/router";
  import { useRoute } from "vue-router";
  
  const route = useRoute();
  const from = ref(route.query.from); // 'register'-表示从注册来
  
  const activeTab = ref(1);
  const props = defineProps({
    kycInfo: {
      type: Object,
      default: () => {},
    },
  });
  const loading = ref(false);
  const disabled = computed(() => {
    return !(
      files.value.front.url &&
      files.value.back.url &&
      files.value.hand.url
    );
  });
  const checkMode = computed(() => {
    return props.kycInfo.status == "review" || props.kycInfo.status == "success";
  });
  // 表单
  const files = ref({
    front: {
      url: "",
      loading: false,
      file: {},
    },
    back: {
      url: "",
      loading: false,
      file: {},
    },
    hand: {
      url: "",
      loading: false,
      file: {},
    },
  });
  
  const deleteImg = (key) => {
    files.value[key] = {
      url: "",
      loading: false,
      file: {},
    };
  };
  
  if (props.kycInfo) {
    files.value.front.url = props.kycInfo.idimg_1;
    files.value.back.url = props.kycInfo.idimg_2;
    files.value.hand.url = props.kycInfo.idimg_3;
  }
  const jump = (name, query) => {
    router.push({
      name,
      query,
    });
  };
  
  const submit = () => {
    if (loading.value) return;
    loading.value = true;
    _kyc2({
      idimg_1: files.value.front.url,
      idimg_2: files.value.back.url,
      idimg_3: files.value.hand.url,
    })
      .then((res) => {
        if (res.code == 200) {
          if ((from.value = "register")) {
            setTimeout(() => {
              showToast("提交成功");
            }, 300);
            nextStep();
          } else {
            router.replace({
              name: "submit",
            });
          }
        }
      })
      .finally(() => {
        loading.value = false;
      });
  };
  
  const nextStep = () => {
    router.replace({
      name: "user",
    });
  };
  const emits = defineEmits(["pre", "info"]);
  const preStep = () => {
    emits("pre");
  };
  const goTip = () => {
    emits("info");
  };
  
  // 图片处理
  const afterRead = (file, { name }) => {
    files.value[name].file = file.objectUrl;
  
    let fileName = file.file.name; // 'test.png'
    fileName = [fileName.split(".")[0] + Date.now(), fileName.split(".")[1]].join(
      "."
    );
    const apiUrl = `${UPLOAD_ADDRESS}${fileName}`;
  
    const reader = new FileReader();
    reader.onloadend = function () {
      let ratio = 0.5;
      const size = file.file.size / 1024;
      if (size < 50) {
        ratio = 1;
      } else if (size < 150) {
        ratio = 0.9;
      } else {
        ratio = 0.5;
      }
      files.value[name].loading = true;
      _compressImg(reader.result, ratio, (base64Img) => {
        const base64result = base64Img.substr(base64Img.indexOf(",") + 1);
  
        _fetchWithTimeout(apiUrl, {
          method: "PUT",
          headers: {
            Authorization: UPLOAD_TOKEN,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: base64result,
            message: `upload ${fileName}`,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            const {
              content: { download_url },
            } = data;
            files.value[name].url = download_url;
          })
          .finally(() => {
            files.value[name].loading = false;
          });
      });
    };
    reader.readAsDataURL(file.file);
  };
  </script>
  
  <style lang="less" scoped>
  .kyc_2 {
    padding: 1.24rem 0.32rem 0.4rem 0.32rem;
    height: 100%;
    overflow-y: auto;
    .steps {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.2rem;
    }
  
    .content_title {
      color: #061023;
      font-size: 0.36rem;
      margin-bottom: 0.2rem;
      margin-top: 0.6rem;
    }
  
    .tip {
      color: #8f92a1;
      font-weight: 400;
      font-size: 0.24rem;
      margin-bottom: 0.4rem;
      line-height: 0.36rem;
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
  
    .title {
      color: #0d0d12;
      font-weight: 600;
      font-size: 0.48rem;
      line-height: 0.8rem;
      margin-bottom: 0.6rem;
    }
  
    .upload_title {
      margin: 0.6rem 0 0.32rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.24rem;
      color: #404040;
      font-weight: 400;
  
      .line {
        flex: 1;
        margin: 0 0.12rem;
        height: 1px;
        background-color: #f2f2f2;
      }
    }
  
    .server_link {
      margin: 0.4rem 0;
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.24rem;
      font-weight: 400;
  
      span {
        color: #1a59f6;
      }
    }
  
    .upload_rules {
      display: flex;
      align-items: stretch;
      justify-content: space-between;
  
      .upload_rule {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
  
        .rule_img {
          width: 1.2rem;
          height: 1.2rem;
          margin-bottom: 0.4rem;
        }
  
        .rule_text {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.24rem;
          color: rgba(0, 0, 0, 0.6);
          font-weight: 400;
  
          .rule_flag {
            width: 0.32rem;
            height: 0.32rem;
            margin-right: 0.08rem;
          }
        }
      }
    }
  
    .submit {
      width: 100%;
      height: 1.12rem;
      font-size: 0.36rem;
    }
  
    .item {
      height: 1.96rem;
      border-radius: 0.32rem;
      position: relative;
      width: 3.33rem;
      background-color: #eff3f8;
      display: flex;
      align-items: center;
      justify-content: center;
      .uploader {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 99;
        opacity: 0;
  
        :deep(.van-uploader__wrapper) {
          width: 100%;
          height: 100%;
  
          .van-uploader__upload {
            width: 100%;
            height: 100%;
          }
        }
      }
  
      .item_box {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        position: relative;
  
        > img {
          object-fit: fill !important;
        }
  
        .delete_icon {
          position: absolute;
          top: 0.1rem;
          right: 0.1rem;
          width: 0.64rem;
          height: 0.64rem;
          z-index: 9998;
          padding: 0.14rem;
          border-radius: 50%;
          background-color: #fff;
        }
      }
  
      .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
  
        .camera {
          width: 0.96rem;
          height: 0.96rem;
          margin-bottom: 0.08rem;
          margin-top: 0.6rem;
          position: relative;
          z-index: 9;
        }
  
        .title {
          font-weight: 400;
          color: #1a59f6;
          font-size: 0.36rem;
          line-height: 0.42rem;
          text-align: center;
          position: relative;
          z-index: 9;
        }
  
        .subtitle {
          position: absolute;
          z-index: 2;
          top: 0.42rem;
          left: 0.44rem;
          font-size: 0.36rem;
          color: #212121;
          line-height: 0.44rem;
  
          span {
            font-size: 0.24rem;
            color: #a8a8a8;
            font-weight: 400;
            line-height: 0.34rem;
          }
        }
  
        .icon {
          position: absolute;
          z-index: 1;
          width: 3.76rem;
          height: 2.44rem;
          top: 0.42rem;
          right: 0.44rem;
        }
      }
  
      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
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
  .check-icon {
    width: 0.28rem;
    height: 0.22rem;
    background-image: url('data:image/svg+xml;utf8,<svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 6.6L4.2 9.8L13 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
    background-size: contain;
    background-repeat: no-repeat;
  }
  .id_back1 {
    width: 2.72rem;
    height: 1.4rem;
    background-image: url("data:image/svg+xml,%3Csvg width='136' height='70' viewBox='0 0 136 70' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect y='9' width='8' height='8' rx='4' fill='%23DEE4EC'/%3E%3Crect x='10' y='9' width='8' height='8' rx='4' fill='%23DEE4EC'/%3E%3Crect x='20' y='9' width='8' height='8' rx='4' fill='%23DEE4EC'/%3E%3Crect y='24' width='51' height='8' rx='4' fill='%23DEE4EC'/%3E%3Crect y='37' width='67' height='8' rx='4' fill='%23DEE4EC'/%3E%3Crect y='62' width='136' height='8' rx='4' fill='%23DEE4EC'/%3E%3Cpath d='M103.782 37.0542H115.139V46.4261H103.744L103.782 37.0542ZM96.5715 24.5084C96.5715 26.1753 95.563 27.5259 94.2929 27.5259C93.0228 27.5259 92.0176 26.1753 92.0176 24.5084C92.0176 22.8416 93.0261 21.4918 94.2962 21.4918C95.5663 21.4918 96.5748 22.8424 96.5748 24.5084M126.947 24.4666C126.947 26.1327 125.937 27.4832 124.667 27.4832C123.397 27.4832 122.386 26.1302 122.386 24.4666C122.386 22.803 123.395 21.4492 124.665 21.4492C125.935 21.4492 126.947 22.8424 126.947 24.4666Z' fill='white'/%3E%3Cpath d='M103.783 38.3984C103.783 38.3984 105.95 39.5187 109.05 39.5187C112.711 39.6687 115.102 38.4361 115.102 38.4361V39.5564C115.102 39.5564 111.068 41.7215 109.275 41.7215C107.444 41.7215 103.781 39.1811 103.781 39.1811L103.783 38.3984Z' fill='%23DEE4EC'/%3E%3Cpath d='M124.293 22.0534C124.293 25.9157 123.124 31.1499 121.161 33.978C118.455 37.8756 112.353 39.6768 109.499 39.6768C106.614 39.6768 101.124 38.2075 98.4145 34.7598C96.1055 31.8202 94.7051 26.2804 94.7051 22.0575C94.7051 12.8724 101.318 5.4043 109.499 5.4043C117.68 5.4043 124.293 12.8724 124.293 22.0575' fill='white'/%3E%3Cpath d='M125.601 14.4269C125.601 14.4269 125.473 8.6773 122.193 4.57977C119.902 1.71806 112.6 -0.359385 107.37 0.0520062C107.37 0.0520062 97.1266 0.461758 96.9134 7.26365C95.0415 8.38391 93.1179 10.3163 92.9121 13.564C92.5022 20.0987 93.6591 21.8164 93.6591 21.8164C93.6591 21.8164 95.3031 21.8164 95.7147 24.2799C95.7147 24.2799 96.4616 24.7289 96.5346 24.2799C96.6461 23.5333 95.8623 19.9488 97.4308 16.6634C97.6243 16.2479 97.8178 15.8775 98.0047 15.5472C103.141 9.8369 118.205 10.4286 121.735 16.6724C121.88 17.1069 121.984 17.5538 122.048 18.0074C122.346 20.1381 122.72 24.1684 122.72 24.1684C122.72 24.1684 123.28 24.5413 123.654 23.6456C124.028 22.7121 123.953 21.8164 124.289 21.555C126.198 20.2872 125.713 14.9875 125.601 14.4269Z' fill='%23DEE4EC'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M133.531 49.9436C134.353 50.7695 135.072 51.4919 135.648 51.9505C135.634 51.9664 135.619 51.9822 135.604 51.998H82.9727C83.4376 51.5766 83.9839 50.962 84.6117 50.2556C86.2172 48.4492 88.3565 46.0423 91.0357 44.729C96.6375 42.0034 103.745 42.8352 103.745 42.8352L103.782 43.0966C104.268 43.6211 106.509 45.637 109.46 45.637C112.449 45.637 114.653 43.4719 115.102 42.9859V42.8032C115.102 42.8032 121.545 42.0083 127.111 44.734C129.466 45.8602 131.742 48.1469 133.531 49.9436Z' fill='%23DEE4EC'/%3E%3C/svg%3E");
    background-size: cover;
  }
  .id_back2 {
  width: 2.72rem;
  height: 1.48rem;
  background-image: url("data:image/svg+xml,%3Csvg width='136' height='74' viewBox='0 0 136 74' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='71' y='12' width='44' height='8' rx='4' fill='%23DEE4EC'/%3E%3Crect x='71' y='30' width='65' height='8' rx='4' fill='%23DEE4EC'/%3E%3Crect y='66' width='136' height='8' rx='4' fill='%23DEE4EC'/%3E%3Ccircle cx='33.5' cy='20.5' r='20.5' fill='%23DEE4EC'/%3E%3Cpath d='M13 40.4714C13 38.3382 15.1636 36.8866 17.1375 37.6954L32.3625 43.9339C33.0914 44.2326 33.9086 44.2326 34.6375 43.9339L49.8625 37.6954C51.8364 36.8866 54 38.3382 54 40.4714V45C54 46.6569 52.6569 48 51 48H16C14.3431 48 13 46.6569 13 45V40.4714Z' fill='%23DEE4EC'/%3E%3C/svg%3E");
  background-size: cover;
}
.id_back3 {
  background-image: url("data:image/svg+xml,%3Csvg width='83' height='85' viewBox='0 0 83 85' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M51.7501 49.4047V38.4512H31.1758V48.8837L41.4811 55.4268L51.7501 49.0291' fill='white'/%3E%3Cpath d='M53.5071 47.7377C53.2897 47.6931 53.0823 47.6089 52.8952 47.4893L48.4908 49.6521C46.3114 50.7209 43.9084 51.2537 41.4815 51.2063C39.0547 51.1588 36.6743 50.5325 34.5383 49.3795L30.4428 47.1621C30.1406 47.4164 29.7933 47.6117 29.419 47.7377L12.5403 51.6877C10.4925 52.1663 9.58984 54.5715 9.58984 56.6799L11.789 84.918C11.789 84.918 21.0644 84.9604 32.4058 84.9604H70.198C70.4578 84.9588 70.7065 84.8549 70.8903 84.6712C71.074 84.4875 71.1779 84.2388 71.1795 83.979V55.4924C71.1795 53.378 72.1912 52.1058 70.1314 51.6211L53.5071 47.7377Z' fill='%23DEE4EC'/%3E%3Cpath d='M31.1758 41.4743V46.3877C44.1407 47.9931 51.7077 39.8446 51.7077 39.8446V38.4512H31.1758' fill='%23F4F4F4'/%3E%3Cpath d='M71.0589 52.0469C71.0589 52.0469 72.8582 53.7069 74.1245 54.9731C74.9847 55.8334 76.6629 58.6566 79.1953 63.4003C80.4615 67.1202 83 72.809 83 74.6871C73.6761 78.4918 68.684 80.4123 68.0721 80.4123C67.0058 78.2858 64.5946 73.6632 60.8323 66.5083V63.4003C60.8353 62.6059 61.0045 61.8208 61.329 61.0957C61.6535 60.3705 62.1261 59.7213 62.7165 59.1897C67.8237 54.6883 71.0589 52.0469 71.0589 52.0469ZM20.2835 59.1897C20.8736 59.7215 21.346 60.3708 21.6705 61.0959C21.9949 61.821 22.1643 62.6059 22.1677 63.4003V66.5083C19.7214 71.1257 17.3081 75.7605 14.9279 80.4123C14.316 80.4123 9.32387 78.4918 0 74.6871C0 72.8029 2.53847 67.1202 3.80467 63.4003C6.34314 58.6566 8.01526 55.8334 8.87555 54.9731C10.1418 53.7069 11.0869 52.4346 11.0869 52.4346C11.0869 52.4346 15.1702 54.6883 20.2835 59.1897Z' fill='%23DEE4EC'/%3E%3Cpath d='M2.7632 84.9185H0.339844L0.630647 74.7344H5.29561L2.7632 84.9185Z' fill='%23F4F4F4'/%3E%3Cpath d='M13.2082 62.1337C13.7838 61.4794 18.4851 57.5112 23.1864 54.8515C27.8877 52.1919 26.6942 54.8515 26.1126 56.1601C25.5371 57.5112 19.0667 60.8251 18.4851 62.1337C17.8732 63.4847 12.5963 62.788 13.2082 62.1337ZM9.96094 72.0937C14.0806 67.4287 16.5404 65.793 17.3704 67.1864C18.6002 69.3129 17.9823 73.4871 22.938 72.7904C27.8877 72.0937 30.3474 74.1839 29.7355 74.8745C29.0873 75.5712 25.3977 75.5712 21.6718 76.2679C17.9459 76.9647 14.226 79.7455 12.9962 79.7455C12.1662 79.7455 11.1544 77.207 9.96094 72.0937Z' fill='white'/%3E%3Cpath d='M13.3885 84.9193C13.7156 84.3861 14.5093 76.0861 14.5093 73.996C14.5093 71.8695 16.351 68.392 16.351 68.392H18.1928C18.8047 68.392 19.4226 68.392 19.4226 69.0887C19.4226 69.7854 15.6967 69.7854 16.3147 70.4821C16.9266 71.1788 19.4226 73.2629 21.2644 71.1788C23.1061 69.0948 23.1061 63.4907 22.4942 62.794C21.8823 62.0973 12.5888 62.0973 10.747 62.794C8.28731 66.0656 7.56636 66.2715 2.2168 84.9193H13.3885Z' fill='white'/%3E%3Cpath d='M77.9043 74.7285H82.545L82.8298 84.9127H80.4185L77.9043 74.7285Z' fill='%23F4F4F4'/%3E%3Cpath d='M64.5334 62.1337C63.9578 60.8251 57.5178 57.5112 56.9422 56.1601C56.3667 54.8515 55.1792 52.1919 59.8563 54.8515C64.5334 57.5112 69.2105 61.4794 69.786 62.1337C70.3919 62.788 65.1392 63.4847 64.5334 62.1337ZM70.9735 79.7455C69.7497 79.7455 66.048 76.9647 62.3403 76.2679C58.6386 75.5712 54.9672 75.5712 54.3189 74.8745C53.707 74.1778 56.1546 72.0937 61.0801 72.7904C66.0056 73.4871 65.3937 69.3129 66.6235 67.1864C67.4535 65.793 69.9209 67.4287 74.0265 72.0937C72.8399 77.207 71.8353 79.7455 70.9735 79.7455Z' fill='white'/%3E%3Cpath d='M67.2073 73.996C67.2073 76.0861 68.001 84.3861 68.3281 84.9193H79.4998L74.1495 66.2715C68.7988 62.0973 59.9349 62.0973 59.323 62.794C58.7111 63.4907 58.7111 69.0948 60.5529 71.1788C62.3947 73.2629 64.8907 71.1788 65.5026 70.4821C66.1206 69.7854 62.3947 69.7854 62.3947 69.0887C62.3947 68.392 63.0126 68.392 63.6246 68.392H65.4725C65.4725 68.392 67.2073 71.8695 67.2073 73.996Z' fill='white'/%3E%3C/svg%3E");
  background-size: cover;
  background-repeat: no-repeat;
  width: 1.66rem;
  height: 1.7rem;
}
.id_back3_head {
  background-size: cover;
  background-repeat: no-repeat;
  width: 0.74rem;
  height: 1.12rem;
  background-image: url("data:image/svg+xml,%3Csvg width='37' height='56' viewBox='0 0 37 56' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28.7508 49.4047V38.4512H8.17651V48.8837L18.4818 55.4268L28.7508 49.0291' fill='white'/%3E%3Cpath d='M8.17651 41.4743V46.3877C21.1415 47.9931 28.7084 39.8446 28.7084 39.8446V38.4512H8.17651' fill='%23F4F4F4'/%3E%3Cpath d='M4.57788 12.4414L5.55934 33.4216C5.64416 35.3845 6.62562 37.1839 8.21897 38.3713L12.7991 41.764C13.9442 42.6243 15.3376 43.0727 16.7674 43.0727H21.1839C22.6137 43.0727 24.0072 42.6243 25.1522 41.764L29.7323 38.3713C31.3257 37.1839 32.2708 35.3845 32.392 33.4216L33.3734 12.4414H4.57788Z' fill='white'/%3E%3Cpath d='M4.6991 3.89441L6.37727 5.03944C-1.26842 10.6435 0.161359 20.2157 0.161359 20.2157C2.45143 22.4634 2.45143 28.1522 2.45143 28.1522L4.74151 25.9046C4.74151 25.9046 3.8388 19.3615 8.17661 16.8654C12.1873 14.5329 15.6587 15.7204 19.2211 15.7204C28.7933 15.7204 31.453 12.1641 30.9986 7.7839C30.7502 5.53623 27.2787 0.82886 18.4395 0.992437C14.8833 1.02879 8.17661 2.09506 4.6991 3.89441Z' fill='%23DEE4EC'/%3E%3Cpath d='M25.3944 5.89452L26.4607 13.3766C31.3256 14.3581 32.0647 21.925 32.1435 24.0939C32.1435 24.5059 32.307 24.8694 32.513 25.1966L34.3972 28.0622C34.3972 28.0622 33.7429 23.3185 36.6873 20.1257C36.6448 20.1742 37.6687 1.39919 25.3944 5.89452Z' fill='%23DEE4EC'/%3E%3C/svg%3E");
}
.camera_icon {
  width: 0.7rem;
  height: 0.7rem;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('data:image/svg+xml;utf8,<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="17.5" cy="17.5" r="17.5" fill="%23014CFA"/><path d="M16.9668 14.9746C15.3887 14.9746 14.1035 16.2578 14.1035 17.8379C14.1035 19.418 15.3867 20.7012 16.9668 20.7012C18.5469 20.7012 19.8301 19.418 19.8301 17.8379C19.8301 16.2578 18.5449 14.9746 16.9668 14.9746Z" fill="white"/><path d="M22.8242 12.4238H22.2617C22.1074 12.4238 21.9629 12.3398 21.8867 12.2051L21.082 10.7754C20.8125 10.2969 20.3047 9.99805 19.7539 9.99805H14.1797C13.6289 9.99805 13.1211 10.2949 12.8516 10.7754L12.0488 12.2051C11.9727 12.3398 11.8301 12.4238 11.6738 12.4238H11.1113C9.51758 12.4238 8.2207 13.7207 8.2207 15.3145V21.1387C8.2207 22.7324 9.51758 24.0293 11.1113 24.0293H22.8242C24.418 24.0293 25.7148 22.7324 25.7148 21.1387V15.3145C25.7148 13.7207 24.418 12.4238 22.8242 12.4238ZM16.9668 21.793C14.7852 21.793 13.0098 20.0176 13.0098 17.8359C13.0098 15.6543 14.7852 13.8789 16.9668 13.8789C19.1484 13.8789 20.9238 15.6543 20.9238 17.8359C20.9238 20.0176 19.1484 21.793 16.9668 21.793Z" fill="white"/></svg>');
}
.check_icon {
  background-image: url("data:image/svg+xml,%3Csvg%20width%3D%2210%22%20height%3D%228%22%20viewBox%3D%220%200%2010%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M9.47206%200.863231C9.73241%201.12358%209.73241%201.54569%209.47206%201.80604L3.60539%207.67271C3.34504%207.93306%202.92293%207.93306%202.66258%207.67271L0.529247%205.53938C0.268897%205.27903%200.268897%204.85692%200.529246%204.59657C0.789595%204.33622%201.21171%204.33622%201.47206%204.59657L3.13399%206.25849L8.52925%200.863231C8.7896%200.602881%209.21171%200.602881%209.47206%200.863231Z%22%20fill%3D%22%23014CFA%22/%3E%3C/svg%3E");
  width: 0.2rem;
  height: 0.16rem;
  background-size: contain;
  background-repeat: no-repeat;
}
.uncheck_icon {
  background-image: url("data:image/svg+xml,%3Csvg%20width%3D%229%22%20height%3D%229%22%20viewBox%3D%220%200%209%209%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M7.72239%208.49465C7.54304%208.49465%207.37647%208.42392%207.25334%208.29544L0.384259%201.13076C0.264732%201.00611%200.200874%200.841606%200.204586%200.667608C0.208297%200.493611%200.278922%200.331948%200.40369%200.212421L0.411549%200.204889C0.532496%200.0888542%200.692084%200.024997%200.860842%200.024997C1.04019%200.024997%201.20676%200.0957312%201.32989%200.22421L8.19897%207.38888C8.44687%207.64737%208.43813%208.05933%208.17965%208.30723L8.17179%208.31476C8.05062%208.43079%207.89103%208.49465%207.72239%208.49465ZM0.860733%200.0304549C1.03855%200.0304549%201.20371%200.100643%201.32574%200.22803L8.19482%207.3927C8.31337%207.51638%208.37668%207.67946%208.37308%207.85193C8.36947%208.0244%208.29939%208.18475%208.17572%208.3033L8.16786%208.31083C8.04789%208.42588%207.88972%208.48919%207.72239%208.48919C7.54457%208.48919%207.37941%208.41901%207.25727%208.29162L0.388189%201.12694C0.269644%201.00327%200.206332%200.840187%200.209935%200.667718C0.213537%200.495248%200.283616%200.334896%200.407292%200.21635L0.415151%200.208819C0.535225%200.0937663%200.693394%200.0304549%200.860733%200.0304549ZM0.860733%200.0195392C0.697542%200.0195392%200.534024%200.0797943%200.407728%200.200959L0.399869%200.208491C0.139855%200.457807%200.131123%200.874462%200.38033%201.13448L7.24941%208.29915C7.37756%208.43276%207.54981%208.5%207.72239%208.5C7.88558%208.5%208.0491%208.43974%208.17539%208.31858L8.18325%208.31105C8.44326%208.06173%208.452%207.64508%208.20279%207.38506L1.33371%200.220389C1.20556%200.0867804%201.03331%200.0195392%200.860733%200.0195392ZM0.661957%208.4034C0.482611%208.4034%200.316145%208.33266%200.192906%208.20418L0.185374%208.19632C0.0658464%208.07167%200.00198916%207.90716%200.00570052%207.73317C0.00941189%207.55917%200.0800369%207.39751%200.204804%207.27798L7.60264%200.185241C7.72359%200.069206%207.88317%200.0053487%208.05193%200.0053487C8.23117%200.0053487%208.39775%200.0760828%208.52098%200.204561L8.52852%200.212421C8.64804%200.337079%208.7119%200.50158%208.70819%200.675577C8.70448%200.849574%208.63385%201.01124%208.50909%201.13076L1.11125%208.2235C0.990194%208.33954%200.830714%208.4034%200.661957%208.4034ZM8.05193%200.0109158C8.22975%200.0109158%208.39491%200.0811041%208.51694%200.208491L8.52448%200.21635C8.64302%200.340026%208.70633%200.503108%208.70273%200.675577C8.69913%200.848046%208.62905%201.0084%208.50537%201.12694L1.10743%208.21957C0.987465%208.33463%200.829295%208.39794%200.661957%208.39794C0.484139%208.39794%200.318983%208.32775%200.196836%208.20036L0.189304%208.1925C0.0707585%208.06883%200.00744702%207.90575%200.0110492%207.73328C0.0146514%207.56081%200.0847307%207.40045%200.208406%207.28191L7.60635%200.189279C7.72632%200.0742272%207.88448%200.0109158%208.05193%200.0109158ZM8.05182%200C7.88863%200%207.72512%200.060255%207.59882%200.18142L0.200874%207.27405C-0.0591392%207.52337%20-0.0678717%207.94002%200.181335%208.20003L0.188867%208.2079C0.317018%208.3415%200.489269%208.40874%200.661847%208.40874C0.825038%208.40874%200.988556%208.34849%201.11485%208.22732L8.5128%201.13469C8.77281%200.885378%208.78154%200.468723%208.53234%200.208709L8.5248%200.20085C8.39676%200.0672411%208.2244%200%208.05182%200Z%22%20fill%3D%22%23E8503A%22/%3E%3C/svg%3E");
  width: 0.18rem;
  height: 0.18rem;
  background-size: contain;
  background-repeat: no-repeat;
}
.id_status {
  background-image: url("data:image/svg+xml,%3Csvg%20width%3D%2251%22%20height%3D%2229%22%20viewBox%3D%220%200%2051%2029%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Crect%20width%3D%2251%22%20height%3D%2229%22%20rx%3D%224%22%20fill%3D%22url(%23paint0_linear_33_31172)%22/%3E%3Cpath%20d%3D%22M38.8292%203.98242C40.7925%203.98242%2042.384%205.54797%2042.384%207.47892C42.384%209.41025%2040.7925%2010.9759%2038.8292%2010.9759C36.8659%2010.9759%2035.2744%209.41026%2035.2744%207.47892C35.2744%205.54752%2036.8664%203.98242%2038.8292%203.98242ZM38.8292%203.98242C40.7925%203.98242%2042.384%205.54797%2042.384%207.47892C42.384%209.41025%2040.7925%2010.9759%2038.8292%2010.9759C36.8659%2010.9759%2035.2744%209.41026%2035.2744%207.47892C35.2744%205.54752%2036.8664%203.98242%2038.8292%203.98242ZM37.4962%2012.1417H40.4591C42.9953%2012.1417%2045.051%2014.1634%2045.051%2016.6582V16.9492C45.051%2017.9324%2042.9949%2017.9697%2040.4591%2017.9697H37.4962C34.9599%2017.9697%2032.9043%2017.9683%2032.9043%2016.9492V16.6582C32.9043%2014.1634%2034.9599%2012.1417%2037.4962%2012.1417Z%22%20fill%3D%22white%22/%3E%3Crect%20x%3D%224%22%20y%3D%224%22%20width%3D%223%22%20height%3D%223%22%20rx%3D%221.5%22%20fill%3D%22white%22/%3E%3Crect%20x%3D%224%22%20y%3D%2210%22%20width%3D%2210%22%20height%3D%222%22%20rx%3D%221%22%20fill%3D%22white%22/%3E%3Crect%20x%3D%224%22%20y%3D%2214%22%20width%3D%2217%22%20height%3D%222%22%20rx%3D%221%22%20fill%3D%22white%22/%3E%3Crect%20x%3D%224%22%20y%3D%2223%22%20width%3D%2243%22%20height%3D%222%22%20rx%3D%221%22%20fill%3D%22white%22/%3E%3Crect%20x%3D%228%22%20y%3D%224%22%20width%3D%223%22%20height%3D%223%22%20rx%3D%221.5%22%20fill%3D%22white%22/%3E%3Crect%20x%3D%2212%22%20y%3D%224%22%20width%3D%223%22%20height%3D%223%22%20rx%3D%221.5%22%20fill%3D%22white%22/%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22paint0_linear_33_31172%22%20x1%3D%2246%22%20y1%3D%22-1.25303e-06%22%20x2%3D%222%22%20y2%3D%2227%22%20gradientUnits%3D%22userSpaceOnUse%22%3E%3Cstop%20stop-color%3D%22%23D3DCF0%22/%3E%3Cstop%20offset%3D%220.515%22%20stop-color%3D%22%23F1DBDB%22/%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23D3DCF0%22/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E");
  width: 1.02rem; 
  height: 0.58rem; 
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
