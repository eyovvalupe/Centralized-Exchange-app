import { createGlobalState, useSessionStorage } from '@vueuse/core'
import { nextTick, ref } from 'vue'

const fiatEnum = {
  INR: 'FIAT_INR',
  USD: 'FIAT_USD',
}
export const useBuyCoinState = createGlobalState(() => {
  const buycoinScrollTop1 = useSessionStorage('buycoinScrollTop1')
  const buycoinScrollTop2 = useSessionStorage('buycoinScrollTop2')
  const buycoinActive = useSessionStorage('buycoinActive', '0')
  const active = ref(buycoinActive.value)
  const selfRef = ref()
  const listRef = ref()
  let scrollData = {}
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
    return `/static/img/crypto/${result}.png`
  }
  const setScrollData = params => (scrollData = params)
  return { active, selfRef, listRef, onChange, handleUrl, setScrollData, setScrollTop }
})
