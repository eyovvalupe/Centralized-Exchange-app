<!-- 提现记录-元素 -->
<template>
  <div class="withdraw_item" @click="goInfo" v-if="item.account">
    <div class="icon_box">
      <!-- <img
        v-if="item.account && item.account.symbol"
        :src="`/static/img/crypto/${item.account.symbol}.png`"
        alt="img"
      /> -->
      <div :class="`${item.currency.toLocaleLowerCase()}_icon`"></div>
      <img
        v-if="item.account && item.account.bank_name"
        src="/static/img/user/card_type_b.png"
        alt="img"
      />
    </div>
    <div class="content">
      <div class="address">
        {{
          item.account && item.account.address
            ? getAddress(item.account.address)
            : getAddress(item.account.bank_card_number)
        }}
      </div>
      <div class="item_title">
        {{
          item.account && item.account.channel == "crypto"
            ? item.account.symbol.toUpperCase()
            : item.account.bank_name
        }}
      </div>
      <div class="time">{{ formatDate(item.date) }}</div>
    </div>
    <div class="right">
      <div class="amount">{{ parseFloat(item.amount).toFixed(2) }}</div>
      <div class="status" :class="['status_' + item.status]">
        {{ _withdrawStatusMap[item.status] || "未知" }}
      </div>
    </div>
  </div>
</template>

<script setup>
import router from "@/router";
import { _withdrawStatusMap } from "@/utils/dataMap";
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
});

const emits = defineEmits(["close"]);
const goInfo = () => {
  emits("close");
  router.push({
    name: "withdrawInfo",
    query: {
      order_no: props.item.order_no,
    },
  });
};
const getAddress = (address) => {
  if (!address) {
    return "--";
  }
  return "**** **** **** " + address.substr(address.length - 4);
};

const formatDate = (date) => {
  const currentDate = new Date();
  const newDate = date.split(" ");
  const newDate1 = newDate[0].split("-");
  const isToday =
    newDate1[2] == currentDate.getDate().toString() &&
    newDate1[1] == currentDate.getMonth().toString() &&
    newDate1[0] == currentDate.getFullYear().toString();

  const isYesterday =
    newDate1[2] + 1 == currentDate.getDate().toString() &&
    newDate1[1] == currentDate.getMonth().toString() &&
    newDate1[0] == currentDate.getFullYear().toString();
  if (isToday) {
    return `今天 ${newDate[1]}`;
  } else if (isYesterday) {
    return `昨天 ${newDate[1]}`;
  } else return `${newDate1[1]}/${newDate1[2]} ${newDate[1]}`;
};
</script>

<style lang="less" scoped>
.withdraw_item {
  width: calc(100% - 0.02rem);
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0.32rem;
  border: 1px solid #d0d8e2;
  border-radius: 0.32rem;
  margin-top: 0.2rem;
  .icon_box {
    width: 0.8rem;
    height: 0.8rem;
  }

  .content {
    padding: 0 0.2rem;
    flex: 1;
    display: flex;
    flex-direction: column;

    .address {
      color: #061023;
      font-size: 0.3rem;
      font-weight: 400;
      line-height: 0.3rem;
      margin-top: 0.1rem;
    }

    .item_title {
      color: #121212;
      font-weight: 400;
      margin-top: 0.08rem;
      font-size: 0.28rem;
    }

    .time {
      color: #8f92a1;
      font-size: 0.24rem;
      font-weight: 400;
      line-height: 0.24rem;
      margin-top: 0.28rem;
    }
  }

  .right {
    height: 100%;
    text-align: right;
    line-height: 0.3rem;
    .amount {
      font-size: 0.3rem;
      color: #000000;
      font-weight: 600;
    }

    .status {
      font-size: 0.28rem;
      color: #014cfa;
      margin-top: 0.14rem;
    }

    .status_success {
      color: #18b762;
    }

    .status_failure {
      color: #8f92a1;
    }
  }
  .usdt_icon {
    width: 40px;
    height: 40px;
    background-image: url('data:image/svg+xml;utf8,<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(%23clip0_553_6578)"><path d="M47.957 23.9919C47.957 37.1812 37.2657 47.8725 24.0764 47.8725C10.8876 47.8725 0.195801 37.1812 0.195801 23.9919C0.195801 10.8029 10.8876 0.111328 24.0764 0.111328C37.2657 0.111328 47.957 10.8029 47.957 23.9919Z" fill="%231BA27A"/><path d="M35.2843 12.1523H12.6718V17.6114H21.2485V25.6353H26.7076V17.6114H35.2843V12.1523Z" fill="white"/><path d="M24.0298 26.4902C16.9349 26.4902 11.1828 25.3673 11.1828 23.982C11.1828 22.5969 16.9346 21.4738 24.0298 21.4738C31.1247 21.4738 36.8766 22.5969 36.8766 23.982C36.8766 25.3673 31.1247 26.4902 24.0298 26.4902ZM38.4549 24.4002C38.4549 22.6139 31.9966 21.166 24.0298 21.166C16.0632 21.166 9.60449 22.6139 9.60449 24.4002C9.60449 25.9732 14.6125 27.2837 21.2487 27.5741V39.0927H26.7073V27.5787C33.3946 27.2974 38.4549 25.9813 38.4549 24.4002Z" fill="white"/></g><defs><clipPath id="clip0_553_6578"><rect width="48" height="48" fill="white"/></clipPath></defs></svg>');
    background-size: contain;
    background-repeat: no-repeat;
  }
  .dash_icon {
    width: 40px;
    height: 40px;
    background-image: url('data:image/svg+xml;utf8,<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(%23clip0_553_6569)"><path d="M24.0117 0.00390625C37.2667 0.00390625 48.0093 10.7466 48.0093 24.0016C48.0093 37.2565 37.2667 47.9992 24.0117 47.9992C10.7567 47.9992 0.0140381 37.2565 0.0140381 24.0016C0.0140381 10.7466 10.7567 0.00390625 24.0117 0.00390625Z" fill="%233E5BF2"/><path d="M41.9303 14.3944L37.2433 33.6113C37.1121 34.1409 36.8215 34.5487 36.3059 34.5487H8.27737C7.7618 34.5487 7.12436 34.2066 7.33996 33.6113L8.27737 31.0897C8.45079 30.5788 8.69921 30.1523 9.21478 30.1523H29.5847C30.1002 30.1523 30.4049 29.6929 30.5221 29.2149L33.3343 18.7909C33.3343 18.2753 32.9125 17.8535 32.3969 17.8535H12.9644C12.4488 17.8535 11.8301 17.4738 12.027 16.9161L12.9644 14.3944C13.1519 13.8929 13.3862 13.457 13.9018 13.457H40.9929C41.5132 13.457 41.9303 13.8742 41.9303 14.3944Z" fill="white"/><path d="M17.3749 26.5616H6.55719C6.24784 26.5616 6.02286 26.2663 6.10723 25.971L7.25556 21.7902C7.3118 21.5887 7.49459 21.4434 7.70551 21.4434H18.5232C18.8326 21.4434 19.0575 21.7386 18.9732 22.0339L17.8248 26.2148C17.7733 26.421 17.5858 26.5616 17.3749 26.5616Z" fill="white"/></g><defs><clipPath id="clip0_553_6569"><rect width="48" height="48" fill="white"/></clipPath></defs></svg>');
    background-size: contain;
    background-repeat: no-repeat;
  }
  .bch_icon {
    width: 40px;
    height: 40px;
    background-image: url('data:image/svg+xml;utf8,<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(%23clip0_553_6587)"><path d="M47.9282 24.0001C47.9282 37.1906 37.2355 47.883 24.0453 47.883C10.8547 47.883 0.162354 37.1906 0.162354 24.0001C0.162354 10.8098 10.8547 0.117188 24.0453 0.117188C37.2355 0.117188 47.9282 10.8098 47.9282 24.0001Z" fill="%238AC072"/><path d="M32.8803 24.5957C33.0402 24.9011 33.138 25.2352 33.168 25.5787C33.1979 25.9222 33.1594 26.2682 33.0546 26.5966C32.9518 26.9258 32.7847 27.2313 32.563 27.4953C32.3412 27.7594 32.0692 27.9768 31.7628 28.1349L25.5372 31.373L23.1155 26.7165L29.341 23.4785C30.6248 22.8109 32.2125 23.312 32.8805 24.5957M27.3404 15.6105C27.6695 15.7134 27.9749 15.8806 28.2389 16.1023C28.503 16.3241 28.7204 16.596 28.8787 16.9023C29.5462 18.1858 29.0444 19.7738 27.7619 20.4415H27.7614L21.5359 23.6796L19.1137 19.0231L25.3399 15.7848C25.6453 15.625 25.9794 15.5274 26.3227 15.4974C26.6661 15.4675 27.012 15.5059 27.3404 15.6105ZM28.3712 12.3464C26.8307 11.8602 25.1928 12.0027 23.7599 12.7481L22.9364 13.1766L20.9226 9.30469L17.9635 10.8435L19.9775 14.7154L17.4517 16.0292L15.4376 12.157L14.729 12.5258L11.8576 14.0192L13.7988 17.7516L10.2999 19.5715L12.0245 22.8878L15.5238 21.068L21.8019 33.1384L18.3026 34.9583L20.0277 38.2747L23.5268 36.4548L25.1651 39.6049L25.874 39.2364L28.7452 37.7428L27.034 34.4529L29.566 33.136L31.2772 36.4261L34.2244 34.8933L32.5129 31.6032L33.3424 31.1719C33.8638 30.9013 34.3433 30.5566 34.7658 30.1485C35.4854 29.4505 36.0191 28.5838 36.3187 27.6272C36.8052 26.0867 36.6626 24.4493 35.917 23.0161C35.1329 21.5086 33.7971 20.4728 32.2853 20.0198C32.7833 18.5211 32.7002 16.8311 31.9156 15.3227C31.1705 13.8895 29.9111 12.8327 28.3714 12.3464" fill="white"/></g><defs><clipPath id="clip0_553_6587"><rect width="48" height="48" fill="white"/></clipPath></defs></svg>');
    background-size: contain;
    background-repeat: no-repeat;
  }
  .eth_icon {
    width: 40px;
    height: 40px;
    background-image: url('data:image/svg+xml;utf8,<svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.225586 16C0.225586 20.2435 1.91129 24.3131 4.91188 27.3137C7.91246 30.3143 11.9821 32 16.2256 32C20.469 32 24.5387 30.3143 27.5393 27.3137C30.5399 24.3131 32.2256 20.2435 32.2256 16C32.2256 11.7565 30.5399 7.68687 27.5393 4.68629C24.5387 1.68571 20.469 0 16.2256 0C11.9821 0 7.91246 1.68571 4.91188 4.68629C1.91129 7.68687 0.225586 11.7565 0.225586 16Z" fill="%232168F6"/><path d="M23.572 16.4139L16.2256 20.5063L8.87915 16.4139L8.91312 16.3524L16.2256 4.10156L23.5309 16.3456L23.572 16.4139Z" fill="white"/><path d="M23.5657 17.7695L23.5314 17.8174L16.2261 27.8991L8.91365 17.8106L8.88647 17.7695L8.91365 17.7899L16.2261 22.1351L23.5314 17.7899L23.5657 17.7695Z" fill="white"/><path d="M23.572 16.4137L16.2256 20.5062L8.87915 16.4137L8.91312 16.3522L16.2256 13.0371L23.5309 16.3454L23.572 16.4137Z" fill="white"/><path opacity="0.8" d="M23.572 16.4139L16.2256 20.5063V4.10156L23.5309 16.3456L23.572 16.4139Z" fill="white"/><path d="M23.5652 17.7695L23.5309 17.8174L16.2256 27.8991V22.1351L23.5309 17.7899L23.5652 17.7695Z" fill="white"/></svg>');
    background-size: contain;
    background-repeat: no-repeat;
  }
  .trx_icon {
    width: 40px;
    height: 40px;
    background-image: url('data:image/svg+xml;utf8,<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 16C0 20.2435 1.68571 24.3131 4.68629 27.3137C7.68687 30.3143 11.7565 32 16 32C20.2435 32 24.3131 30.3143 27.3137 27.3137C30.3143 24.3131 32 20.2435 32 16C32 11.7565 30.3143 7.68687 27.3137 4.68629C24.3131 1.68571 20.2435 0 16 0C11.7565 0 7.68687 1.68571 4.68629 4.68629C1.68571 7.68687 0 11.7565 0 16Z" fill="%23D80917"/><path d="M14.7218 25.8734C14.6918 25.8734 14.6607 25.8716 14.6307 25.867C14.5095 25.8503 14.3952 25.8007 14.3003 25.7234C14.2055 25.6462 14.1337 25.5443 14.0929 25.429L7.59209 7.0145C7.5095 6.77995 7.5642 6.51895 7.73403 6.33732C7.90387 6.15569 8.16165 6.08275 8.40013 6.15032L21.4965 9.80261C21.5813 9.82621 21.6621 9.86697 21.7311 9.92239L24.1935 11.8781C24.4709 12.098 24.5281 12.4967 24.3236 12.7849L15.266 25.5913C15.2045 25.6785 15.123 25.7496 15.0283 25.7987C14.9336 25.8478 14.8285 25.8734 14.7218 25.8734ZM9.27647 7.77893L14.921 23.77L22.8702 12.5303L21.0081 11.0512L9.27647 7.77893Z" fill="white"/><path d="M14.7228 25.8738C14.6981 25.8738 14.6745 25.8724 14.6498 25.8699C14.2841 25.8302 14.0195 25.5013 14.0588 25.1355L15.0392 16.0579C15.0782 15.6907 15.4182 15.4329 15.7736 15.4669C16.1393 15.5066 16.4039 15.8355 16.3646 16.2013L15.3842 25.2789C15.3477 25.6203 15.0589 25.8738 14.7228 25.8738Z" fill="white"/><path d="M15.702 16.796C15.5329 16.796 15.3635 16.7324 15.2333 16.604C14.9716 16.3448 14.9691 15.9229 15.2279 15.6608L20.8428 9.97628C21.102 9.71456 21.5239 9.71205 21.7856 9.97056C22.0473 10.2298 22.0498 10.6517 21.791 10.9138L16.1758 16.598C16.1139 16.6607 16.0402 16.7106 15.9588 16.7446C15.8775 16.7786 15.7902 16.7961 15.702 16.796Z" fill="white"/><path d="M15.7019 16.7956C15.4506 16.7956 15.2096 16.6522 15.0966 16.4084C14.9429 16.0744 15.0887 15.6779 15.422 15.5235L23.4989 11.795C23.8349 11.6406 24.2293 11.7864 24.3841 12.1211C24.5379 12.455 24.392 12.8516 24.0588 13.006L15.9819 16.7345C15.894 16.7747 15.7986 16.7955 15.7019 16.7956Z" fill="white"/><path d="M15.7982 16.9122C15.603 16.9122 15.4103 16.8267 15.2787 16.6622L7.70059 7.2099C7.46997 6.92279 7.51646 6.50339 7.80428 6.27314C8.09067 6.04395 8.51185 6.09008 8.74104 6.37682L16.3177 15.8292C16.5483 16.1163 16.5026 16.5357 16.2147 16.7659C16.0966 16.8608 15.9497 16.9124 15.7982 16.9122Z" fill="white"/></svg>');
    background-size: cover;
    background-repeat: no-repeat;
  }
  .btc_icon {
    width: 40px;
    height: 40px;
    background-image: url('data:image/svg+xml;utf8,<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(%23clip0_1862_22400)"><path d="M0.0300293 16.0063C0.0300293 18.1075 0.443882 20.1881 1.24796 22.1293C2.05203 24.0705 3.23058 25.8343 4.71632 27.3201C6.20206 28.8058 7.96589 29.9843 9.90709 30.7884C11.8483 31.5925 13.9289 32.0063 16.03 32.0063C18.1312 32.0063 20.2118 31.5925 22.153 30.7884C24.0942 29.9843 25.858 28.8058 27.3437 27.3201C28.8295 25.8343 30.008 24.0705 30.8121 22.1293C31.6162 20.1881 32.03 18.1075 32.03 16.0063C32.03 13.9052 31.6162 11.8246 30.8121 9.88341C30.008 7.9422 28.8295 6.17838 27.3437 4.69264C25.858 3.2069 24.0942 2.02835 22.153 1.22428C20.2118 0.4202 18.1312 0.00634766 16.03 0.00634766C13.9289 0.00634766 11.8483 0.4202 9.90709 1.22428C7.96589 2.02835 6.20206 3.2069 4.71632 4.69264C3.23058 6.17838 2.05203 7.9422 1.24796 9.88341C0.443882 11.8246 0.0300293 13.9052 0.0300293 16.0063Z" fill="%23F7931A"/><path d="M20.3918 16.0732L20.2116 16.0249C21.7511 16.41 23.3351 15.4954 23.7491 13.9498C23.85 13.5777 23.8763 13.1893 23.8265 12.807C23.7768 12.4247 23.6519 12.056 23.4592 11.7221C23.2664 11.3882 23.0096 11.0958 22.7034 10.8615C22.3972 10.6273 22.0477 10.4559 21.675 10.3572L20.3743 10.0086L21.1473 7.12357L19.2927 6.62659L18.5197 9.5116L17.0327 9.1133L17.8071 6.22328L15.9497 5.72559L15.1752 8.6156L11.7711 7.70351L11.2294 9.72541L13.5992 10.3604L11.1214 19.6075L8.75164 18.9725L8.20996 20.9944L11.6141 21.9065L10.8132 24.8956L12.6707 25.3932L13.4715 22.4042L14.9586 22.8025L14.158 25.7905L16.0126 26.2875L16.8131 23.2995L18.3459 23.7103C20.4579 24.2763 22.63 23.0224 23.196 20.91C23.762 18.7977 22.5038 16.6392 20.3918 16.0732ZM16.6555 11.1105L17.9948 11.4695L18.8833 11.7076C19.2437 11.8042 19.5383 11.9937 19.77 12.2629C20.1765 12.703 20.3503 13.343 20.1844 13.9612C20.0189 14.5794 19.5483 15.0471 18.9763 15.2248C18.6412 15.342 18.2916 15.3588 17.9308 15.2623L17.0423 15.0242L15.703 14.6652L16.6555 11.1105ZM17.4617 20.8786C17.4195 20.8811 17.3938 20.8743 17.3552 20.8639L15.6036 20.3945L14.2642 20.0355L15.2167 16.4808L16.5561 16.8398L18.3077 17.3092C18.3463 17.3196 18.372 17.3264 18.4074 17.3496C19.3242 17.6367 19.8608 18.6225 19.6088 19.5628C19.3567 20.5031 18.3992 21.0884 17.4617 20.8786Z" fill="white"/></g><defs><clipPath id="clip0_1862_22400"><rect width="32" height="32" fill="white"/></clipPath></defs></svg>');
    background-size: cover;
    background-repeat: no-repeat;
  }
  .ltc_icon {
    width: 40px;
    height: 40px;
    background-image: url('data:image/svg+xml;utf8,<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 16C0 20.2435 1.68571 24.3131 4.68629 27.3137C7.68687 30.3143 11.7565 32 16 32C20.2435 32 24.3131 30.3143 27.3137 27.3137C30.3143 24.3131 32 20.2435 32 16C32 11.7565 30.3143 7.68687 27.3137 4.68629C24.3131 1.68571 20.2435 0 16 0C11.7565 0 7.68687 1.68571 4.68629 4.68629C1.68571 7.68687 0 11.7565 0 16Z" fill="%23D88C22"/><path d="M24.1448 24.9655L25.1855 21.092L15.0104 21.1111L16.3208 16.2546L19.3268 15.1755L20.1363 12.2077L17.0918 13.3639L19.2304 5.25049H13.1217L10.308 15.8307L7.99507 16.6401L7.18555 19.6079L9.53724 18.7215L7.91798 24.9269L24.1448 24.9655Z" fill="white"/></svg>');
    background-size: cover;
    background-repeat: no-repeat;
  }
  .doge_icon {
    width: 40px;
    height: 40px;
    background-image: url('data:image/svg+xml;utf8,<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(%23clip0_1862_22531)"><path d="M31.9897 16.0771C31.9897 24.8697 24.8622 31.9975 16.0693 31.9975C7.27681 31.9975 0.148926 24.8697 0.148926 16.0771C0.148926 7.2843 7.27681 0.156738 16.0693 0.156738C24.8622 0.156738 31.9897 7.2843 31.9897 16.0771Z" fill="%23C3A723"/><path d="M17.7119 21.503H14.1931V16.966H17.6823V15.1351H14.1931V10.6777H17.4996C17.4996 10.6777 21.5694 10.6777 21.5694 15.7145C21.5694 21.6531 17.7117 21.5028 17.7117 21.5028M17.1648 7.49316H10.9559V15.135H8.88623V16.9658H10.9559V24.6872H17.5628C17.5628 24.6872 24.8066 24.926 24.8066 15.4932C24.8066 7.49316 17.1648 7.49316 17.1648 7.49316Z" fill="white"/></g><defs><clipPath id="clip0_1862_22531"><rect width="32" height="32" fill="white"/></clipPath></defs></svg>');
    background-size: cover;
    background-repeat: no-repeat;
  }
  .etc_icon {
    width: 40px;
    height: 40px;
    background-image: url('data:image/svg+xml;utf8,<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(%23clip0_1862_22489)"><path d="M31.9714 15.9946C31.9714 24.7875 24.8438 31.915 16.051 31.915C7.2585 31.915 0.130615 24.7875 0.130615 15.9946C0.130615 7.20194 7.2585 0.0742188 16.051 0.0742188C24.8438 0.0742188 31.9714 7.20194 31.9714 15.9946Z" fill="%23659172"/><path d="M9.8208 17.9272L15.9532 20.9978V25.9353L9.8208 17.9272ZM22.4823 17.9272L16.328 25.9354V20.9978L22.4823 17.9272Z" fill="white"/><path d="M22.8972 14.2269L16.132 3.52393L9.17139 14.2269L16.132 11.3416L22.8972 14.2269ZM9.44533 17.1751L16.2106 27.6539L23.1712 17.1751L16.2106 21.3412L9.44533 17.1751Z" fill="white"/><path d="M23.1711 15.7995L16.1317 12.8667L9.17114 15.7995L16.1317 19.9682L23.1711 15.7995Z" fill="white"/></g><defs><clipPath id="clip0_1862_22489"><rect width="32" height="32" fill="white"/></clipPath></defs></svg>');
    background-size: cover;
    background-repeat: no-repeat;
  }
  .rvn_icon {
    width: 40px;
    height: 40px;
    background-image: url('data:image/svg+xml;utf8,<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(%23clip0_1862_22548)"><path d="M16 32C24.8365 32 32 24.8365 32 16C32 7.16349 24.8365 0 16 0C7.16349 0 0 7.16349 0 16C0 24.8365 7.16349 32 16 32Z" fill="%2384182D"/><path d="M9.50014 27L13.118 10.2111L15.148 22.8111L9.5 27H9.50014ZM13.1881 10.1151L18.685 22.824L15.2421 22.7641L13.1881 10.1139V10.1151ZM13.27 10.0191L20.47 11.042L18.8021 22.824L13.27 10.0191ZM18.9301 22.6431L20.5531 11.15L21.6151 12.498L18.9301 22.6431ZM20.4471 10.9329L13.421 9.93396L19.7471 7.85193L20.4471 10.9329ZM13.3871 9.82604L17.693 6.84102L19.7471 7.744L13.3871 9.82604ZM13.2809 9.78996L14.1111 8.20102L17.6231 6.79302L13.2811 9.78996H13.2809ZM14.1111 8.13004L14.5071 6.89004L17.4011 6.79302L14.1111 8.12902V8.13004ZM14.484 6.79302L15.4171 5.79404L17.4251 6.69702L14.484 6.79302ZM15.476 5.73411L16.876 5.048L18.686 7.16596L15.476 5.73396V5.73411ZM17.0751 5.13193L19.164 6.04698L18.79 7.17804L17.0751 5.13207V5.13193ZM18.8601 7.21396L19.245 6.05905L19.7121 7.648L18.8601 7.21396ZM16.9231 5H18.452L19.2091 5.84204C19.2143 5.84814 19.2178 5.85542 19.2195 5.86324C19.2211 5.87106 19.2208 5.87917 19.2186 5.88684C19.2163 5.89451 19.2122 5.9015 19.2066 5.90719C19.201 5.91287 19.194 5.91708 19.1864 5.91942C19.1761 5.92244 19.1651 5.92193 19.1551 5.91796L16.9231 5ZM19.3391 5.96291L22.4491 6.83098C22.4647 6.83485 22.4786 6.84385 22.4886 6.85655C22.4985 6.86924 22.5039 6.8849 22.5039 6.90102C22.5039 6.91714 22.4985 6.9328 22.4886 6.94549C22.4786 6.95819 22.4647 6.96718 22.4491 6.97105L19.806 7.696L19.3391 5.96305V5.96291Z" fill="white"/></g><defs><clipPath id="clip0_1862_22548"><rect width="32" height="32" fill="white"/></clipPath></defs></svg>');
    background-size: cover;
    background-repeat: no-repeat;
  }
  .arb_icon {
    width: 40px;
    height: 40px;
    background-image: url('data:image/svg+xml;utf8,<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g clip-path="url(%23clip0_1862_22516)"><rect width="32" height="32" rx="16" fill="url(%23pattern0_1862_22516)"/></g><defs><pattern id="pattern0_1862_22516" patternContentUnits="objectBoundingBox" width="1" height="1"><use xlink:href="%23image0_1862_22516" transform="scale(0.015625)"/></pattern><clipPath id="clip0_1862_22516"><rect width="32" height="32" fill="white"/></clipPath><image id="image0_1862_22516" width="64" height="64" xlink:href="data:image/png;base64,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"/></defs></svg>');
    background-size: cover;
    background-repeat: no-repeat;
  }
}
</style>
