// const fiatEnum = {
//   INR: 'FIAT_INR',
//   USD: 'FIAT_USD',
// }
// export const useBuyCoinState = createGlobalState(() => {
//   const buycoinScrollTop1 = useSessionStorage('buycoinScrollTop1', 0)
//   const buycoinScrollTop2 = useSessionStorage('buycoinScrollTop2', 0)
//   const buycoinActive = useSessionStorage('buycoinActive', '0')
//   const active = ref(buycoinActive.value)
//   const selfRef = ref()
//   const listRef = ref()

//   const onChange = i => {
//     active.value = i
//     buycoinActive.value = i
//     switch (i) {
//       case '1':
//         nextTick(() => {
//           const page2 = document.querySelector('.page_market')
//           if (page2) page2.scrollTop = buycoinScrollTop1.value
//           selfRef.value?.init()
//         })
//         break
//       case '2':
//         nextTick(() => {
//           const page2 = document.querySelector('.page_market')
//           if (page2) page2.scrollTop = buycoinScrollTop2.value
//           listRef.value?.init()
//         })
//         break
//     }
//   }
//   function handleUrl(params) {
//     const result = fiatEnum[params.toUpperCase()] || params.toUpperCase()
//     return `/static/img/crypto/${result}.png`
//   }
//   return { active, selfRef, listRef, onChange, handleUrl }
// })
