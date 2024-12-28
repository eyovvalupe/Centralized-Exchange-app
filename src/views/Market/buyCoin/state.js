import { createGlobalState, useSessionStorage } from '@vueuse/core'
import { nextTick, ref } from 'vue'
import { useSocket } from '@/utils/ws'
import store from '@/store'
import { getStaticImgUrl } from "@/utils/index.js"

const fiatEnum = {
  INR: 'FIAT_INR',
  USD: 'FIAT_USD',
}
export const useBuyCoinState = createGlobalState(() => {
  const buycoinScrollTop1 = useSessionStorage('buycoinScrollTop1')
  const buycoinScrollTop2 = useSessionStorage('buycoinScrollTop2')
  const buycoinActive = useSessionStorage('buycoinActive', '0')
  const { startSocket } = useSocket()
  const token = computed(() => store.state.token)
  const active = ref(buycoinActive.value)
  const selfRef = ref()
  const listRef = ref()
  let scrollData = {}
  let socket
  const setScrollTop = (key, value) => {
    switch (key) {
      case '1':
        nextTick(() => {
          scrollData.y.value = value || buycoinScrollTop1.value
        })
        break
      case '2':
        nextTick(() => {
          scrollData.y.value = value || buycoinScrollTop2.value
        })
        break
    }
  }
  const onChange = (i, isSetScroll = true) => {
    active.value = i
    buycoinActive.value = i
    switch (i) {
      case '1':
        nextTick(() => {
          if (isSetScroll) setScrollTop(i)
          selfRef.value?.init()
        })
        break
      case '2':
        nextTick(() => {
          if (isSetScroll) setScrollTop(i)
          listRef.value?.init()
        })
        break
    }
  }
  function handleUrl(params) {
    const result = fiatEnum[params.toUpperCase()] || params.toUpperCase()
    return getStaticImgUrl(`/static/img/crypto/${result}.svg`)
  }
  const setScrollData = params => (scrollData = params)

  const subs = () => {
    if (!token.value) return
    return new Promise(resolve => {
      socket = startSocket(() => {
        socket && socket.off('user')
        socket && socket.off('c2corder')
        socket && socket.emit('user', token.value)
        socket && socket.emit('c2corder', '#all')
        // store.commit('setC2cList', [])
        socket.on('c2corder', res => {
          store.commit('setC2cList', res.data || [])
          resolve()
        })
      })
    })
  }
  // 取消订阅
  const cancelSubs = () => {
    // const socket = startSocket(() => {
    socket && socket.off('user')
    socket && socket.off('c2corder')
    // socket && socket.close()
    // socket && socket.emit('user', '')
    // socket && socket.emit('c2corder', '')
    // })
  }
  return { active, selfRef, listRef, onChange, handleUrl, setScrollData, setScrollTop, subs, cancelSubs }
})
