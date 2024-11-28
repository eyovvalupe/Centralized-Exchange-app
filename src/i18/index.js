import { createI18n } from 'vue-i18n'
import en from './lang-en'
import zh from './lang-zh'
import ch from './lang-ch'
import { default_language } from '@/config'
// 设置语言资源包
const messages = {
  en,
  zh,
  ch
}
const supportedLanguage = ['en', 'zh', 'ch'];

const getUserLanguage = () => {
  const userLanguage = localStorage.getItem('language') || null;
  const environmentLanguage = navigator.language.slice(0, 2);
  const defaultLanguage = default_language;
  const language = userLanguage || (supportedLanguage.includes(environmentLanguage) ? environmentLanguage : defaultLanguage )
  return supportedLanguage.includes(language) ? language : defaultLanguage;
}
const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  messages,
  locale: getUserLanguage(),
  missingWarn: false, // 关闭缺失键的警告
  fallbackWarn: false, // 关闭回退键的警告
  // fallbackLocale: 'en'
})
export default i18n