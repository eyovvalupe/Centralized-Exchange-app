<template>
  <div class="list_page" v-for="item in props.list">
    <div class="list_delete_icon" @click="() => console.log('click')">
      <div class="delete_icon"></div>
    </div>
    <div class="list_detail">
      <div
        class="mr-[0.2rem]"
        :class="
          item.symbol == 'USDT'
            ? 'usdt_icon'
            : item.symbol == 'DASH'
            ? 'dash_icon'
            : 'btc_icon'
        "
      ></div>
      <div class="flex flex-col">
        <div class="flex flex-row items-center">
          <span class="text-[0.32rem] text-[#121212] font-semibold mr-[0.2rem]"
            >**** **** **** {{ (item.address).slice(-4) }}</span
          >
          <div class="copy_icon" @click="copyToClipboard(item.address)"></div>
        </div>
        <span class="text-[0.28rem] text-[#666d80]">{{ item.symbol }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { showToast } from 'vant';

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
      showToast('成功复制好')
    }, 200);
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};
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

    .copy_icon {
      width: 0.24rem;
      height: 0.24rem;
      background-image: url('data:image/svg+xml;utf8,<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.6 2.4H12V12H2.4V9.6H0V0H9.6V2.4ZM9.6 3.2V9.6H3.2V11.2H11.2V3.2H9.6ZM0.8 0.8V8.8H8.8V0.8H0.8Z" fill="%23014CFA"/></svg>');
      background-size: contain;
      background-repeat: no-repeat;
    }

    .usdt_icon {
      width: 0.96rem;
      height: 0.96rem;
      background-image: url('data:image/svg+xml;utf8,<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(%23clip0_553_6578)"><path d="M47.957 23.9919C47.957 37.1812 37.2657 47.8725 24.0764 47.8725C10.8876 47.8725 0.195801 37.1812 0.195801 23.9919C0.195801 10.8029 10.8876 0.111328 24.0764 0.111328C37.2657 0.111328 47.957 10.8029 47.957 23.9919Z" fill="%231BA27A"/><path d="M35.2843 12.1523H12.6718V17.6114H21.2485V25.6353H26.7076V17.6114H35.2843V12.1523Z" fill="white"/><path d="M24.0298 26.4902C16.9349 26.4902 11.1828 25.3673 11.1828 23.982C11.1828 22.5969 16.9346 21.4738 24.0298 21.4738C31.1247 21.4738 36.8766 22.5969 36.8766 23.982C36.8766 25.3673 31.1247 26.4902 24.0298 26.4902ZM38.4549 24.4002C38.4549 22.6139 31.9966 21.166 24.0298 21.166C16.0632 21.166 9.60449 22.6139 9.60449 24.4002C9.60449 25.9732 14.6125 27.2837 21.2487 27.5741V39.0927H26.7073V27.5787C33.3946 27.2974 38.4549 25.9813 38.4549 24.4002Z" fill="white"/></g><defs><clipPath id="clip0_553_6578"><rect width="48" height="48" fill="white"/></clipPath></defs></svg>');
      background-size: contain;
      background-repeat: no-repeat;
    }
    .dash_icon {
      width: 0.96rem;
      height: 0.96rem;
      background-image: url('data:image/svg+xml;utf8,<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(%23clip0_553_6569)"><path d="M24.0117 0.00390625C37.2667 0.00390625 48.0093 10.7466 48.0093 24.0016C48.0093 37.2565 37.2667 47.9992 24.0117 47.9992C10.7567 47.9992 0.0140381 37.2565 0.0140381 24.0016C0.0140381 10.7466 10.7567 0.00390625 24.0117 0.00390625Z" fill="%233E5BF2"/><path d="M41.9303 14.3944L37.2433 33.6113C37.1121 34.1409 36.8215 34.5487 36.3059 34.5487H8.27737C7.7618 34.5487 7.12436 34.2066 7.33996 33.6113L8.27737 31.0897C8.45079 30.5788 8.69921 30.1523 9.21478 30.1523H29.5847C30.1002 30.1523 30.4049 29.6929 30.5221 29.2149L33.3343 18.7909C33.3343 18.2753 32.9125 17.8535 32.3969 17.8535H12.9644C12.4488 17.8535 11.8301 17.4738 12.027 16.9161L12.9644 14.3944C13.1519 13.8929 13.3862 13.457 13.9018 13.457H40.9929C41.5132 13.457 41.9303 13.8742 41.9303 14.3944Z" fill="white"/><path d="M17.3749 26.5616H6.55719C6.24784 26.5616 6.02286 26.2663 6.10723 25.971L7.25556 21.7902C7.3118 21.5887 7.49459 21.4434 7.70551 21.4434H18.5232C18.8326 21.4434 19.0575 21.7386 18.9732 22.0339L17.8248 26.2148C17.7733 26.421 17.5858 26.5616 17.3749 26.5616Z" fill="white"/></g><defs><clipPath id="clip0_553_6569"><rect width="48" height="48" fill="white"/></clipPath></defs></svg>');
      background-size: contain;
      background-repeat: no-repeat;
    }
    .btc_icon {
      width: 0.96rem;
      height: 0.96rem;
      background-image: url('data:image/svg+xml;utf8,<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(%23clip0_553_6587)"><path d="M47.9282 24.0001C47.9282 37.1906 37.2355 47.883 24.0453 47.883C10.8547 47.883 0.162354 37.1906 0.162354 24.0001C0.162354 10.8098 10.8547 0.117188 24.0453 0.117188C37.2355 0.117188 47.9282 10.8098 47.9282 24.0001Z" fill="%238AC072"/><path d="M32.8803 24.5957C33.0402 24.9011 33.138 25.2352 33.168 25.5787C33.1979 25.9222 33.1594 26.2682 33.0546 26.5966C32.9518 26.9258 32.7847 27.2313 32.563 27.4953C32.3412 27.7594 32.0692 27.9768 31.7628 28.1349L25.5372 31.373L23.1155 26.7165L29.341 23.4785C30.6248 22.8109 32.2125 23.312 32.8805 24.5957M27.3404 15.6105C27.6695 15.7134 27.9749 15.8806 28.2389 16.1023C28.503 16.3241 28.7204 16.596 28.8787 16.9023C29.5462 18.1858 29.0444 19.7738 27.7619 20.4415H27.7614L21.5359 23.6796L19.1137 19.0231L25.3399 15.7848C25.6453 15.625 25.9794 15.5274 26.3227 15.4974C26.6661 15.4675 27.012 15.5059 27.3404 15.6105ZM28.3712 12.3464C26.8307 11.8602 25.1928 12.0027 23.7599 12.7481L22.9364 13.1766L20.9226 9.30469L17.9635 10.8435L19.9775 14.7154L17.4517 16.0292L15.4376 12.157L14.729 12.5258L11.8576 14.0192L13.7988 17.7516L10.2999 19.5715L12.0245 22.8878L15.5238 21.068L21.8019 33.1384L18.3026 34.9583L20.0277 38.2747L23.5268 36.4548L25.1651 39.6049L25.874 39.2364L28.7452 37.7428L27.034 34.4529L29.566 33.136L31.2772 36.4261L34.2244 34.8933L32.5129 31.6032L33.3424 31.1719C33.8638 30.9013 34.3433 30.5566 34.7658 30.1485C35.4854 29.4505 36.0191 28.5838 36.3187 27.6272C36.8052 26.0867 36.6626 24.4493 35.917 23.0161C35.1329 21.5086 33.7971 20.4728 32.2853 20.0198C32.7833 18.5211 32.7002 16.8311 31.9156 15.3227C31.1705 13.8895 29.9111 12.8327 28.3714 12.3464" fill="white"/></g><defs><clipPath id="clip0_553_6587"><rect width="48" height="48" fill="white"/></clipPath></defs></svg>');
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
