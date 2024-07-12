<template>
  <div class="msg-input">
     <span class="icon-left"><img :src="sendImg_icon" >
       <input type="file" id="fileInput" @change="uploadImg" accept="image/*">
      </span>
     <textarea class="textarea" v-model="message" ref="sendInput"></textarea>
     <span class="icon-right" @click="sendMessage"><img :src="send_icon" >
    </span>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { serviceChat } from '@/utils/serviceChat'
import { showToast } from "vant"
import storeUser from "@/store"
import storeChat from "@/store/chat"
import send_icon from '@/assets/send.png'
import sendImg_icon from '@/assets/sendImg.png'
const emit = defineEmits(['scrollToBottom'])
const message=ref('');
const token=computed(()=>storeUser.state.token);
const isConnected=computed(()=>storeChat.state.isConnected);
const sendMessage=()=>{
  if(!isConnected.value){
    showToast('网络错误,请稍等')
    return
  }
  const obj={ type: 'text',nologinid: storeChat.getters.getNologinid, content: message.value }
  if(token.value){
    obj.auth = token.value;
  }
  serviceChat.sendMessage('send',obj)
  message.value = ""
  emit('scrollToBottom');
}
const uploadImg=(event)=>{
  const file = event.target.files
    let fileName = file.name  // 'test.png'
    fileName = [fileName.split('.')[0] + Date.now(), fileName.split('.')[1]].join('.')
    const apiUrl = `${process.env.VUE_APP_UPLOAD_ADDRESS}${fileName}`
    const reader = new FileReader();
    reader.onloadend = function () {
      let ratio = 0.5
      const size = file.size / 1024
      if (size < 50) {
        ratio = 1
      } else if (size < 150) {
        ratio = 0.9
      } else {
        ratio = 0.5
      }
      _compressImg(reader.result, ratio, (base64Img) => {
        const base64result = base64Img.substr(base64Img.indexOf(',') + 1);
        axios.put(apiUrl, JSON.stringify({ content: base64result, message: `upload ${fileName}` }), {
          headers: {
            Authorization:process.env.VUE_APP_UPLOAD_TOKEN
          }
        }).then(res => {
          const { content: { download_url } } = res.data
          insertFn(download_url, fileName, download_url)
        })
      })
    }
    reader.readAsDataURL(file);
}
</script>

<style lang="less">
.msg-input {
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-content:center ;
  .textarea{
    border: none;
    line-height: 36px;
    width: calc(100% - 80px);
  }
  #fileInput{
    width: 30px;
    height: 30px;
    position: absolute;
    z-index: 9;
    opacity: 0;
  }
  .icon-left,.icon-right{
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    img{
     max-height: 22px;
     flex-shrink: 0;
     vertical-align: middle;
  }
  }
  .icon-right{
    img{
     max-height: 22px;
     flex-shrink: 0;
     vertical-align: middle;
  }
  }
}
</style>
