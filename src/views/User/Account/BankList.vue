<template>
  <div class="list_page" v-for="item in props.list">
    <div class="list_delete_icon" @click="next">
      <div class="delete_icon"></div>
    </div>
    <GoogleVerfCode ref="googleRef" @submit="(code) => submit(code, item.id)" />
    <div class="list_detail">
      <div class="bank_icon_container mr-[0.2rem]">
        <div :class="item.bankName == '建设银行' ? 'building_icon' : item.bankName == '工商银行' ? 'ecobusiness_icon' : item.bankName == '工商银行' ? 'company_icon' : 'emg_company_icon'"></div>
      </div>
      <div class="flex flex-col">
        <div class="flex flex-row items-center">
          <span class="text-[0.32rem] text-[#121212] font-semibold mr-[0.2rem]"
            >**** **** **** {{ item.bankCardNumber.slice(-4) }}</span
          >
          <div class="copy_icon" @click="copyToClipboard(item.bankCardNumber)"></div>
        </div>
        <span class="text-[0.28rem] text-[#666d80]">{{ item.bankName }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { showToast } from "vant";
import { ref } from 'vue';
import GoogleVerfCode from "@/components/GoogleVerfCode.vue";
import { _delAccount, _listAccount } from "@/api/api";
import router from "@/router";
import store from "@/store";

const loading = ref(false);
const googleRef = ref();

const next = () => {
  googleRef.value[0].open();
};
const props = defineProps({
  list: {
    type: Array,
    default: [
      {
        accountName: null,
        address: "123123123",
        bankCardNumber: null,
        bankName: null,
        channel: "crypto",
        id: "",
        network: "TRC20",
        symbol: "USDT",
      },
    ],
  },
});
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);

    setTimeout(() => {
      showToast("成功复制支付地址");
    }, 200);
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};
// 提交
const submit = (googleCode, id) => {
  if (loading.value) return;
  loading.value = true;
  const params = {
    id,
    googlecode: googleCode,
  };
  _delAccount(params)
    .then((res) => {
      if (res.code == 200) {
        showToast("成功删除");
        _listAccount()
        .then(res => store.commit("setAccountList", res.data || {}))
      }
    })
    .finally(() => {
      getSessionToken();
      loading.value = false;
    });
};
const getSessionToken = () => {
  loading.value = true;
  store.dispatch("updateSessionToken").finally(() => {
    loading.value = false;
  });
};
getSessionToken();
</script>
<style lang="less">
.list_page {
  position: relative;
  width: 100%;
  height: 1.44rem;
  border-width: 0.02rem;
  border-color: #d0d8e2;
  border-radius: 0.36rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  margin-bottom: 0.2rem;

  .list_detail {
    padding-left: 0.32rem;
    display: flex;
    align-items: center;

    .bank_icon_container {
        width: 0.96rem;
        height: 0.96rem;
        background-color: #f5f7fc;
        border-radius: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .copy_icon {
      width: 0.24rem;
      height: 0.24rem;
      background-image: url('data:image/svg+xml;utf8,<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.6 2.4H12V12H2.4V9.6H0V0H9.6V2.4ZM9.6 3.2V9.6H3.2V11.2H11.2V3.2H9.6ZM0.8 0.8V8.8H8.8V0.8H0.8Z" fill="%23014CFA"/></svg>');
      background-size: contain;
      background-repeat: no-repeat;
    }

    .building_icon {
      width: 0.72rem;
      height: 0.72rem;
      background-image: url('data:image/svg+xml;utf8,<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.7539 1.91124C16.7539 1.91124 19.7142 -0.356765 24.8027 1.29231C24.8027 1.29231 26.5155 1.91123 28.4885 3.66416L34.6155 10.0583L31.345 13.308L21.9988 3.87047C21.9988 3.87047 20.4411 1.96247 16.7539 1.91124ZM30.2539 14.442L26.4116 18.1542C26.4116 18.1542 25.7885 19.032 25.2693 18.2068L18.2078 11.3488C18.2078 11.3488 17.5847 10.5235 17.1181 11.2449L10.0039 18.4643C10.0039 18.4643 9.5373 19.1857 10.1078 19.4958L17.0655 26.4051C17.0655 26.4051 17.6373 27.3328 18.1565 26.6114L25.3731 19.392C25.3731 19.392 25.5808 18.7731 26.7231 18.9282H34.0962C34.0962 18.9282 34.4078 26.3538 28.6962 30.9951C28.6962 30.9951 21.2719 38.3682 11.095 33.8308C11.095 33.8308 1.28223 30.4274 1.38607 17.7942C1.38607 17.7942 1.645 9.33693 9.38084 4.85077C9.38084 4.85077 15.0412 0.673389 19.5578 3.768L30.2539 14.442Z" fill="%23003A90"/></svg>');
      background-size: contain;
      background-repeat: no-repeat;
    }

    .ecobusiness_icon {
      width: 0.68rem;
      height: 0.68rem;
      background-image: url('data:image/svg+xml;utf8,<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(%23clip0_553_6678)"><path d="M3.49953 16.944L3.61564 15.5646L3.73192 14.3011L4.07501 12.9218L4.5352 11.7746L5.10929 10.5103L5.79948 9.47618L6.1434 8.90177L6.6024 8.44277L7.40887 7.40949L8.44314 6.60438L9.47623 5.80129L10.6222 5.11094L11.7728 4.53566L13.036 4.07546L14.2993 3.73257L14.9895 3.6163L15.6775 3.50138H18.4364L19.6997 3.73241L21.0779 4.0753L22.2271 4.53549L23.4915 5.11077L24.5248 5.80113L25.0989 6.14505L25.5579 6.60405L26.5923 7.40916L27.3954 8.44244L28.1995 9.47585L28.8887 10.51L29.465 11.7743L29.9242 12.9214L30.2693 14.3008L30.3832 14.8749L30.4981 15.5642V18.322L30.2691 19.7003L29.924 20.9646L29.4648 22.2267L28.8885 23.3762L28.1993 24.5268L27.8543 25.0995L27.3953 25.5597L26.5922 26.4781L25.5577 27.3969L24.5246 28.2012L23.4914 28.8905L22.2269 29.4658L21.0777 29.9257L19.6995 30.2696L19.1255 30.385H18.4363L17.7459 30.4999H17.0557L15.6775 30.385L14.2993 30.2696L13.036 29.9257L11.7728 29.4658L10.6222 28.8905L9.47623 28.2012L8.90115 27.8563L8.44314 27.3969L7.40887 26.4781L6.60236 25.5597L5.79931 24.5268L5.10909 23.3762L4.535 22.2267L4.07481 20.9646L3.73175 19.7003L3.61548 19.011V18.3218L3.49937 17.6326V16.944H3.49953ZM0.169922 16.944L0.286033 18.6672L0.400086 19.5864L0.513973 20.3907L0.974035 21.9989L1.20317 22.8022L1.54828 23.4915L1.8934 24.2946L2.23848 24.986L3.04053 26.363L3.49973 27.0534L4.07501 27.7413L5.10929 28.891L5.6832 29.4663L6.25967 29.9262L6.94884 30.5004L7.63804 30.9594L8.32617 31.4184L9.0164 31.7637L10.5097 32.4527L12.0031 33.027L12.8072 33.2572L13.6101 33.4858L14.4153 33.6021L15.3334 33.7172L17.0557 33.8301L18.7803 33.7172L19.5844 33.6021L20.3887 33.4858L21.9971 33.0268L22.8001 32.7966L23.6053 32.4527L24.2934 32.1088L24.9838 31.7639L26.4761 30.9596L27.0513 30.5006L27.7405 29.9264L28.8887 28.8912L29.465 28.3168L30.0391 27.7415L30.4981 27.0535L30.9573 26.3632L31.4163 25.6741L31.7624 24.9862L32.5666 23.4917L33.1407 21.9992L33.2546 21.1941L33.4848 20.391L33.5998 19.5868L33.7146 18.6676L33.8299 16.944L33.7148 15.2191L33.5999 14.4173L33.485 13.6109L33.1409 12.0036L32.7958 11.1995L32.5668 10.3952L32.2217 9.70704L31.7625 9.01805L30.9574 7.52357L30.4983 6.94966L30.0393 6.2603L28.8889 5.11094L28.3149 4.53566L27.7409 3.96174L27.0517 3.50155L26.4764 3.04255L25.7884 2.58355L24.9843 2.24033L23.6059 1.43402L21.9978 0.85994L21.1945 0.630772L20.3894 0.515823L19.5851 0.399544L18.781 0.285824L17.0564 0.171604L15.3341 0.285824L14.4159 0.399544L13.6108 0.515823L12.0034 0.859741L11.1982 1.20469L10.5102 1.43382L9.70606 1.77893L9.0169 2.24013L7.63853 3.04238L6.94934 3.50138L6.26017 3.96158L5.10978 5.11077L4.5357 5.68485L4.07551 6.26013L3.50023 6.94949L3.04103 7.52341L2.58206 8.21377L2.23901 9.01788L1.54878 10.395L0.974699 12.0036L0.745896 12.8087L0.51467 13.6109L0.400783 14.4172L0.286697 15.2191L0.169922 16.944ZM26.4761 15.7936V8.32785H18.2063V10.7403H23.8334V13.4969H18.2063V20.9648H23.8334V23.4916H18.2063V25.9038H26.4761V18.4374H20.8489V15.9109H26.4761V15.7936ZM7.52156 15.7936V8.32785H15.7924V10.7403H10.1642V13.4969H15.7924V20.9648H10.1642V23.4916H15.7924V25.9038H7.52156V18.4374H13.1508V15.9109H7.52156V15.7936Z" fill="%23E50012"/></g><defs><clipPath id="clip0_553_6678"><rect width="34" height="34" fill="white" transform="matrix(1 0 0 -1 0 34)"/></clipPath></defs></svg>');
      background-size: contain;
      background-repeat: no-repeat;
    }

    .company_icon {
      width: 0.68rem;
      height: 0.68rem;
      background-image: url('data:image/svg+xml;utf8,<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(%23clip0_553_6686)"><path d="M34 16.3193C34 12.0127 28.1067 8.38602 20.8533 8.38602C15.0733 8.38602 10.0867 10.6527 8.38667 13.826C8.16 14.166 8.04667 14.506 8.04667 14.846C8.04667 15.6393 8.5 16.3193 9.29333 16.7727L15.98 20.626C16.32 20.8527 16.7733 20.966 17.2267 20.966C17.68 20.966 18.1333 20.8527 18.4733 20.626L24.82 16.9993C25.2733 16.7727 25.5 16.3193 25.5 15.9793C25.5 15.526 25.2733 15.186 24.82 14.9593L22.44 13.5993L17.2267 16.6593L13.26 14.3927C14.7333 13.0327 17.68 12.126 20.8533 12.126C25.7267 12.126 29.6933 14.166 29.6933 16.7727C29.58 20.7393 23.8 23.7993 16.7733 23.5727C9.74667 23.2327 4.08 19.8327 4.19333 15.866C4.19333 10.6527 11.1067 6.45935 19.4933 6.57268C20.2867 6.57268 20.9667 6.57268 21.6467 6.68602C19.9467 6.11935 17.7933 5.66602 15.4133 5.66602C13.6 5.66602 11.7867 5.89268 10.3133 6.34602C4.30667 8.04602 0 11.8993 0 16.3193C0 22.326 7.59333 27.1993 17 27.1993C26.4067 27.3127 34 22.4393 34 16.3193Z" fill="%23003F8D"/></g><defs><clipPath id="clip0_553_6686"><rect width="34" height="34" fill="white"/></clipPath></defs></svg>');
      background-size: contain;
      background-repeat: no-repeat;
    }

    .emg_company_icon {
      width: 0.72rem;
      height: 0.72rem;
      background-image: url('data:image/svg+xml;utf8,<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M32.6667 13.293V11.418C32.6667 10.4233 32.2716 9.46954 31.5684 8.76642C30.8652 8.06307 29.9112 7.66797 28.9167 7.66797H6.41675C5.42225 7.66797 4.46825 8.06307 3.76505 8.76642C3.06185 9.46954 2.66675 10.4233 2.66675 11.418V13.293H32.6667ZM12.0417 24.543V22.6681C12.0417 22.1709 11.8443 21.6939 11.4924 21.3422C11.1408 20.9905 10.6641 20.793 10.1667 20.793H8.29175C7.79435 20.793 7.31765 20.9905 6.96605 21.3422C6.61415 21.6939 6.41675 22.1709 6.41675 22.6681V24.543C6.41675 25.0403 6.61415 25.5173 6.96605 25.869C7.31765 26.2204 7.79435 26.418 8.29175 26.418H10.1667C10.6641 26.418 11.1408 26.2204 11.4924 25.869C11.8443 25.5173 12.0417 25.0403 12.0417 24.543ZM2.66675 17.043H32.6667V26.4178C32.6667 27.4125 32.2716 28.3663 31.5684 29.0694C30.8652 29.7728 29.9112 30.1679 28.9167 30.1679H6.41675C5.42225 30.1679 4.46825 29.7728 3.76505 29.0694C3.06185 28.3663 2.66675 27.4125 2.66675 26.4178V17.043Z" fill="%23014CFA"/></svg>');
      background-size: contain;
      background-repeat: no-repeat;
    }
  }

  .list_delete_icon {
    width: 0.8rem;
    height: 0.52rem;
    background-color: #d0d8e2;
    border-bottom-left-radius: 0.36rem;
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .delete_icon {
      width: 0.3rem;
      height: 0.25rem;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 17"><path d="M14.4813 3.59546H3.5192C3.38792 3.59546 3.26758 3.70486 3.26758 3.84708V15.4218C3.26758 16.1767 3.88023 16.7893 4.6351 16.7893H13.3763C13.7373 16.7893 14.0765 16.6471 14.3281 16.3955C14.5797 16.1438 14.7219 15.7938 14.7219 15.4327V3.83614C14.7329 3.70486 14.6235 3.59546 14.4813 3.59546ZM6.80125 13.0806C6.80125 13.2119 6.74655 13.3432 6.65903 13.4307C6.56057 13.5291 6.44023 13.5729 6.30895 13.5729C6.03544 13.5729 5.81664 13.3541 5.81664 13.0806V6.99785C5.81664 6.72435 6.03544 6.50554 6.30895 6.50554C6.58245 6.50554 6.80125 6.72435 6.80125 6.99785V13.0806ZM9.49254 13.0806C9.49254 13.3541 9.27373 13.5729 9.00023 13.5729C8.72672 13.5729 8.50792 13.3541 8.50792 13.0806V6.99785C8.50792 6.72435 8.72672 6.50554 9.00023 6.50554C9.27373 6.50554 9.49254 6.72435 9.49254 6.99785V13.0806ZM12.1948 13.0806C12.1948 13.3541 11.976 13.5729 11.7024 13.5729C11.4289 13.5729 11.2101 13.3541 11.1992 13.0696V6.99785C11.1992 6.72435 11.418 6.50554 11.7024 6.50554C11.976 6.50554 12.1948 6.72435 12.1948 6.99785V13.0806Z" fill="%23666D80"/><path d="M16.5925 3.09238H12.9932V2.1187C12.9932 1.45135 12.4462 0.915283 11.7898 0.915283H6.24311C5.57576 0.915283 5.03969 1.46229 5.03969 2.1187V3.09238H1.40756C1.10123 3.09238 0.849609 3.344 0.849609 3.65033C0.849609 3.95665 1.10123 4.20827 1.40756 4.20827H16.5925C16.8988 4.20827 17.1505 3.95665 17.1505 3.65033C17.1505 3.344 16.8988 3.09238 16.5925 3.09238ZM11.8773 3.09238H6.15559V2.02024H11.8773V3.09238Z" fill="%23666D80"/></svg>');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
}
</style>
