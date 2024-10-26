import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false
    },
    resources: {
      en: {
        translation: {
          title:'FMAS',
          login: 'Login',
          register:'Register',
          exercise:'Exercise',
          statistics:'Statistics',
          email:'Email',
          password:'Password',
          newAccount:'Create New Account'
        }
      },
      zh: {
        translation: {
          title:'健身动作评估系统',
          login: '登录',
          register:'注册',
          exercise:'健身',
          statistics:'统计',
          email:'邮箱',
          password:'密码',
          newAccount:'创建新账号'
        }
      }
    }
  })

export default i18n
