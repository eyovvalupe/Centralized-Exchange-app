import { createI18n } from 'vue-i18n'
import en from './lang-en'
import zh from './lang-zh'
import ch from './lang-ch'
import kr from './lang-kr'
import jp from './lang-jp'
import de from './lang-de'
import { default_language } from '@/config'
// 设置语言资源包
const messages = {
  en,
  zh,
  ch,
  kr,
  jp,
  de
}
const supportedLanguage = ['en', 'zh', 'ch', 'kr', 'jp', 'de'];

const getUserLanguage = () => {
  const userLanguage = localStorage.getItem('language') ? JSON.parse(localStorage.getItem('language')).val : null;
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