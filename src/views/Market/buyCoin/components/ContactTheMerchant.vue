<template>
  <div class="ContactTheMerchant">
    <div class="font-['PingFang SC'] mb-3 text-center text-sm font-normal leading-tight text-[#8f92a1]">2024-10-02 10:02:26</div>
    <div class="mx-auto mb-10 h-[30px] w-[261px] rounded-[50px] bg-[#f5f7fc] text-center">
      <div class="text-center text-[15px] font-normal leading-30 text-[#666d80]">您已成功下单，请耐心等候商家付款</div>
    </div>

    <div class="">
      <template v-for="(item, index) in list">
        <div class="send flex">
          <div class="mr-[0.12rem] w-10 rounded-full bg-my text-center text-xs font-semibold leading-40 text-white">{{ merchant_name ? merchant_name.slice(0, 1) : '' }}</div>
          <!-- <Popover show placement="right" class=""> -->
          123
          <!-- <template #reference>
              <div type="primary">浅色风格</div>
            </template> -->
          <!-- </Popover> -->
          <div class="relative bg-[#eff3f8]">
            <div class="van-popover__arrow" />
            <div class="">123</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { Popover } from 'vant'

const exampleMessage = {
  order_no: '1234567890', // 示例订单号
  msgid: 'MSG123456', // 示例消息ID
  direction: 'send', // 发送方向
  type: 'text', // 文字消息
  content: '您好，这是一条测试消息。', // 消息内容
  time: 1679049600000, // 示例时间戳
}
const merchant_name = '商家名称'
const list = reactive([exampleMessage, exampleMessage, exampleMessage])
</script>

<style lang="less" scoped>
.ContactTheMerchant {
  .van-popover__arrow {
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    border-right-color: red;
    border-left-width: 0;
    margin-left: calc(var(--van-popover-arrow-size) * -1);
    color: var(--van-popover-light-background);
  }
}
</style>
