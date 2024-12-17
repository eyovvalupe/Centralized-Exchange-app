<template>
  <Popup round v-model:show="orderConfirmDialog" position="bottom" closeable teleport="body">
    <div class="van-popup-custom-title">
      订单确认
    </div>

    <div class="px-[0.32rem] pt-[0.52rem]">
      <div class="flex justify-between items-center px-[0.32rem] border-solid border-[1px] h-[1.2rem] box-border rounded-[0.32rem]">
        <template v-if="offset == 'sell'">
          <div class="text-[0.32rem] font-bold text-[#061023]">你将支付</div>
          <div class="flex items-center">
            <strong class="text-[#014CFA] text-[0.48rem]">{{ money }}</strong>
            <span class="text-[0.28rem] text-[#061023] ml-[0.1rem] relative top-[0.04rem]">{{ payCurrency }}</span>
          </div>
        </template>
        <template v-else>
          <div class="text-[0.32rem] font-bold text-[#061023]">你将卖出</div>
          <div class="flex items-center">
            <strong class="text-[#014CFA] text-[0.48rem]">{{ volume }}</strong>
            <span class="text-[0.28rem] text-[#061023] ml-[0.1rem] relative top-[0.04rem]">{{ currency }}</span>
          </div>
        </template>
      </div>
      <div class="mt-[0.2rem] flex justify-between items-center px-[0.32rem] border-solid border-[1px] h-[1.2rem] box-border rounded-[0.32rem]">
        <div class="text-[0.32rem] font-bold text-[#061023]">你将收到</div>
        <div class="flex items-center" v-if="offset == 'sell'">
          <strong class="text-[#014CFA] text-[0.48rem]">{{ volume }}</strong>
          <span class="text-[0.28rem] text-[#061023] ml-[0.1rem] relative top-[0.04rem]">{{ currency }}</span>
        </div>
        <div class="flex items-center" v-else>
          <strong class="text-[#014CFA] text-[0.48rem]">{{ money }}</strong>
          <span class="text-[0.28rem] text-[#061023] ml-[0.1rem] relative top-[0.04rem]">{{ payCurrency }}</span>
        </div>
      </div>

      <FormItem size="large" title="交易密码" input-type="password" v-model="safeword" />
      <div class="pt-[0.6rem] pb-[0.32rem]">
        <Button size="large" round :loading="loading" @click="submit" color="#014CFA">确认</Button>
      </div>
    </div>
    
  </Popup>
</template>

<script setup>

import {ref} from 'vue'
import { Popup,Button,showToast } from 'vant'
import FormItem from '@/components/Form/FormItem.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const orderConfirmDialog = ref(false)
const safeword = ref('')

defineProps({
  volume:[String,Number],
  money:[String,Number],
  currency:String,
  payCurrency:String,
  offset:String,
  loading:Boolean
})

const emit = defineEmits(['submit'])

const submit = ()=>{
  if(!safeword.value){
    return showToast(t("assets.safety_trade_no_password"));
  }
  emit("submit",safeword.value)
  
}

const open = ()=>{
  safeword.value = ''
  orderConfirmDialog.value = true
}
const close = ()=>{
  orderConfirmDialog.value = false
}

defineExpose({
  open,
  close
})

</script>

