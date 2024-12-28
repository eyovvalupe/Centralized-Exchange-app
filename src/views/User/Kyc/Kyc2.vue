<!-- 身份认证2 -->
<template>
  <div class="kyc_2">
    <Top :title="t('kyc.page_title')">
      <!-- 从注册来的 -->
      <template #right v-if="from == 'register'">
        <span @click="nextStep" style="color: var(--ex-primary-color); font-weight: 400; font-size: 0.28rem">跳过</span>
      </template>
      <!-- 从个人中心来的 -->
      <template #right v-else>
        <div @click="goTip" style="display: flex; align-items: center; line-height: 0">
          <div style="
              width: 0.24rem;
              height: 0.24rem;
              position: relative;
              top: -0.01rem;
              left: -0.04rem;
            ">
            <img :src="getStaticImgUrl('/static/img/user/warning.png')" alt="icon" />
          </div>
          <span style="color: var(--ex-primary-color); font-weight: 400; font-size: 0.24rem">照片上传要求</span>
        </div>
      </template>
      <!-- 提交过认证信息 -->
      <template #right v-if="kycInfo.idimg_1">
        <div class="kyc_status">
          <span class="status" v-if="kycInfo.status == 'review'">审核中</span>
          <span class="status status_pass" v-if="kycInfo.status == 'success'">审核通过</span>
          <span class="status status_fail" v-if="kycInfo.status == 'failure'">审核失败</span>
        </div>
      </template>
      <template #right v-else>
        <div @click="jump('chat')"
          class="w-[0.72rem] h-[0.72rem] rounded-[50%] border-color border-[0.02rem] flex items-center justify-center">
          <div class="w-[0.4rem] h-[0.4rem]">
            <img :src="getStaticImgUrl('/static/img/user/serverB.svg')" alt="server" />
          </div>
        </div>
      </template>
    </Top>
    <!-- 查看模式头部 -->
    <Tabs @change="preStep" class="tabs" v-if="checkMode" style="width: 100%" :lazy-render="false"
      v-model:active="activeTab" sticky animated shrink>
      <Tab :title="'身份信息'"></Tab>
      <Tab :title="'照片'"></Tab>
    </Tabs>

    <!-- 表单模式头部 -->
    <div class="steps" v-if="!checkMode">
      <div class="bg-color4 w-[0.68rem] h-[0.68rem] rounded-[50%] flex items-center justify-center">
        <div class="bg-primary w-[0.56rem] h-[0.56rem] rounded-[50%] flex items-center justify-center">
          <div class="check-icon">
            <img :src="getStaticImgUrl('/static/icons/right_white.svg')" alt="">
          </div>
        </div>
      </div>
      <div class="w-[3.04rem] h-[0.16rem] bg-color2"></div>
      <div class="bg-color4 w-[0.56rem] h-[0.56rem] rounded-[50%] flex items-center justify-center">
        <div class="bg-primary w-[0.32rem] h-[0.32rem] rounded-[50%] flex items-center justify-center">
          <div class="bg-color4 w-[0.12rem] h-[0.12rem] rounded-[50%]"></div>
        </div>
      </div>
    </div>
    <div class="steps" v-if="!checkMode">
      <div class="text-[0.28rem] text-color mr-[2.52rem]">{{ $t("kyc.second_basic_info") }}</div>
      <div class="text-[0.28rem] text-color3">{{ $t("kyc.second_upload_card") }}</div>
    </div>
    <div class="content_title" v-if="!checkMode">{{ $t("kyc.second_title") }}</div>
    <div class="tip" v-if="!checkMode">{{ $t("kyc.second_description") }}</div>
    <!-- 表单 -->
    <!-- 上传元素 -->
    <div class="flex justify-between flex-wrap gap-[0.2rem] mb-[0.4rem]">
      <div class="item">
        <!-- 没有上传 -->
        <div class="id_back1 flex flex-col items-center justify-center"
          :style="{ 'background-image': `url('/static/icons/iden1.svg')` }"
          v-if="!files.front.loading && !files.front.url">
          <div class="camera_icon mb-[0.16rem]"></div>
          <div class="text-[0.28rem] text-color">{{ $t("kyc.second_card_front") }}</div>
        </div>
        <!-- 上传中 -->
        <div class="item_box loading" v-if="files.front.loading">
          <Loaidng :loading="files.front.loading" />
        </div>
        <!-- 已上传 -->
        <div class="item_box success" v-if="files.front.url">
          <img :src="files.front.url" alt="img" />

          <div
            class="w-[0.8rem] h-[0.52rem] flex items-center justify-center bg-[rgba(0,0,0,0.6)] rounded-tr-[0.32rem] rounded-bl-[0.32rem] absolute top-0 right-0"
            @click.stop="deleteImg('front')" v-if="!checkMode">
            <div class="delete_svg_icon">
              <img :src="getStaticImgUrl('/static/icons/delete_white.svg')" alt="">
            </div>
          </div>
        </div>
        <!-- 上传 -->
        <Uploader v-if="!checkMode && !files.front.url" :name="'front'" class="uploader" :after-read="afterRead" />
      </div>
      <div class="item">
        <!-- 没有上传 -->
        <div class="id_back2 flex flex-col items-center justify-center"
          :style="{ 'background-image': `url('/static/icons/iden2.svg')` }"
          v-if="!files.back.loading && !files.back.url">
          <div class="camera_icon mb-[0.16rem]"></div>
          <div class="text-[0.28rem] text-color">{{ $t("kyc.second_card_back") }}</div>
        </div>
        <!-- 上传中 -->
        <div class="item_box loading" v-if="files.back.loading">
          <Loaidng :loading="files.back.loading" />
        </div>
        <!-- 已上传 -->
        <div class="item_box success" v-if="files.back.url">
          <img :src="files.back.url" alt="img" />

          <div
            class="w-[0.8rem] h-[0.52rem] flex items-center justify-center bg-[rgba(0,0,0,0.6)] rounded-tr-[0.32rem] rounded-bl-[0.32rem] absolute top-0 right-0"
            @click="deleteImg('back')" v-if="!checkMode">
            <div class="delete_svg_icon">
              <img :src="getStaticImgUrl('/static/icons/delete_white.svg')" alt="">
            </div>
          </div>
        </div>
        <!-- 上传 -->
        <Uploader v-if="!checkMode && !files.back.url" :name="'back'" class="uploader" :after-read="afterRead" />
      </div>
      <div class="item">
        <!-- 没有上传 -->
        <div class="id_back3 flex flex-col items-center justify-center"
          :style="{ 'background-image': `url('/static/icons/iden3.svg')` }"
          v-if="!files.hand.loading && !files.hand.url">
          <div class="camera_icon mb-[0.16rem]">
            <img :src="getStaticImgUrl('/static/icons/carema.svg')" alt="">
          </div>
          <div class="text-[0.28rem] text-color">{{ $t("kyc.second_card_hand") }}</div>
        </div>
        <!-- 上传中 -->
        <div class="item_box loading" v-if="files.hand.loading">
          <Loaidng :loading="files.hand.loading" />
        </div>
        <!-- 已上传 -->
        <div class="item_box success" v-if="files.hand.url">
          <img :src="files.hand.url" alt="img" />

          <div
            class="w-[0.8rem] h-[0.52rem] flex items-center justify-center bg-[rgba(0,0,0,0.6)] rounded-tr-[0.32rem] rounded-bl-[0.32rem] absolute top-0 right-0"
            @click="deleteImg('hand')" v-if="!checkMode">
            <div class="delete_svg_icon">
              <img :src="getStaticImgUrl('/static/icons/delete_white.svg')" alt="">
            </div>
          </div>
        </div>
        <!-- 上传 -->
        <Uploader v-if="!checkMode && !files.hand.url" :name="'hand'" class="uploader" :after-read="afterRead" />
      </div>
    </div>
    <div class="bg-color2 rounded-[0.32rem] w-full h-[2.62rem] px-[0.32rem] py-[0.24rem] mb-[0.8rem]">
      <div class="text-[0.28rem text-color mb-[0.2rem]">{{ $t("kyc.second_upload_rule") }}</div>
      <div class="text-[0.24rem] text-color3 mb-[0.2rem]">
        {{ $t("kyc.second_upload_description") }}
      </div>
      <div class="flex justify-between">
        <div>
          <div
            class="w-[1.26rem] h-[0.8rem] bg-color flex items-center justify-center overflow-hidden rounded-[0.2rem] mb-[0.12rem]">
            <div class="id_status" :style="{ 'background-image': `url('/static/icons/id_status_1.svg')` }"></div>
          </div>
          <div class="flex items-center justify-between">
            <div class="check_icon">
              <img :src="getStaticImgUrl('/static/icons/right_primary.svg')" alt="">
            </div>
            <div class="text-[0.24rem] text-color">{{ $t("kyc.second_standard_img") }}</div>
          </div>
        </div>
        <div>
          <div
            class="w-[1.26rem] h-[0.8rem] relative bg-color flex items-center overflow-hidden rounded-[0.2rem] mb-[0.12rem]">
            <div class="id_status absolute right-0 -mr-[0.16rem]"
              :style="{ 'background-image': `url('/static/icons/id_status_1.svg')` }"></div>
          </div>
          <div class="flex items-center justify-between">
            <div class="uncheck_icon">
              <img :src="getStaticImgUrl('/static/icons/error_red.svg')" alt="">
            </div>
            <div class="text-[0.24rem] text-color">{{ $t("kyc.second_failed1") }}</div>
          </div>
        </div>
        <div>
          <div
            class="w-[1.26rem] h-[0.8rem] bg-color flex items-center justify-center overflow-hidden rounded-[0.2rem] mb-[0.12rem]">
            <div class="id_status" :style="{ 'background-image': `url('/static/icons/id_status_1.svg')` }">
              <div class="bg-[rgba(255,255,255,0.4)] w-full h-full rounded-[0.08rem] backdrop-blur-[0.02rem]"></div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="uncheck_icon">
              <img :src="getStaticImgUrl('/static/icons/error_red.svg')" alt="">
            </div>
            <div class="text-[0.24rem] text-color">{{ $t("kyc.second_failed2") }}</div>
          </div>
        </div>
        <div>
          <div
            class="w-[1.26rem] h-[0.8rem] bg-color flex items-center justify-center overflow-hidden rounded-[0.2rem] mb-[0.12rem]">
            <div class="id_status flex items-center justify-center"
              :style="{ 'background-image': `url('/static/icons/id_status_1.svg')` }">
              <div class="bg-color w-[0.68rem] h-[0.28rem] rounded-[0.2rem] blur-[0.05rem]"></div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="uncheck_icon">
              <img :src="getStaticImgUrl('/static/icons/error_red.svg')" alt="">
            </div>
            <div class="text-[0.24rem] text-color">{{ $t("kyc.second_failed3") }}</div>
          </div>
        </div>
      </div>
    </div>

    <Button v-if="kycInfo.status == 'none' || kycInfo.status == 'failure'" :color="'var(--ex-primary-color)'" @click="submit"
      :loading="loading" :disabled="disabled" round class="submit" type="primary">{{ $t("kyc.second_btn") }}</Button>
  </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
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
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const route = useRoute();
const from = ref(route.query.from); // 'register'-表示从注册来

const activeTab = ref(1);
const props = defineProps({
  kycInfo: {
    type: Object,
    default: () => { },
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
        // if ((from.value = "register")) {
        //   setTimeout(() => {
        //     showToast("提交成功");
        //   }, 300);
        //   nextStep();
        // } else {
        router.replace({
          name: "submit",
        });
        // }
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
    color: var(--ex-text-color);
    font-size: 0.36rem;
    margin-bottom: 0.2rem;
    margin-top: 0.6rem;
  }

  .tip {
    color: var(--ex-text-color3);
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
    color: var(--ex-text-color);
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
      color: var(--ex-primary-color);
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
    background-color: var(--ex-bg-color3);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

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

      >img {
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
        background-color: var(--ex-bg-color);
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
        color: var(--ex-primary-color);
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
  background-size: contain;
  background-repeat: no-repeat;
}

.id_back1 {
  width: 2.72rem;
  height: 1.4rem;
  background-size: cover;
}

.id_back2 {
  width: 2.72rem;
  height: 1.48rem;
  background-size: cover;
}

.id_back3 {
  background-size: cover;
  background-repeat: no-repeat;
  width: 1.66rem;
  height: 1.7rem;
}



.camera_icon {
  width: 0.7rem;
  height: 0.7rem;
  background-size: cover;
  background-repeat: no-repeat;
}

.check_icon {
  width: 0.2rem;
  height: 0.16rem;
  background-size: contain;
  background-repeat: no-repeat;
}

.uncheck_icon {
  width: 0.18rem;
  height: 0.18rem;
  background-size: contain;
  background-repeat: no-repeat;
}

.id_status {
  width: 1.02rem;
  height: 0.58rem;
  background-size: contain;
  background-repeat: no-repeat;
}

.delete_svg_icon {
  width: 0.32rem;
  height: 0.3rem;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
