import { createI18n } from 'vue-i18n'

// 设置语言资源包
const messages = {
  en: {
    // 语言包
  },
  zh: {
    // 语言包
  },
}

// 设置语言
const locale = 'zh'

const i18n = createI18n({
  // 使用 composition API
  legacy: false,
  // 全局使用 t 函数
  globalInjection: true,
  locale,
  messages,
})

export default i18n
