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
          title: 'FMAS',
          login: 'Login',
          register: 'Register',
          exercise: 'Exercise',
          statistics: 'Statistics',
          email: 'Email',
          password: 'Password',
          newAccount: 'Create New Account',
          passwordEnsure: 'Ensure Your Password',
          returnToLogin: 'Return To Login Page',
          pushUp: 'Push Up',
          pullUp: 'Pull Up',
          squat: 'Squat',
          walk: 'Walk',
          sitUp: 'Sit Up',
          closeFile: 'Close File',
          closeCamP: 'Close Cameral First',
          openFile: 'Open Video File',
          closeCam: 'Close Cameral',
          closeFileP: 'Close Video File First',
          openCam: 'Open Cameral',
          uploadData: 'Upload Data',
          score: 'Score',
          counter: 'Sequence Number',
          actChoose: 'Choose Activities',
          vidChoose: 'Choose Video File',
          times:'Time'
        }
      },
      zh: {
        translation: {
          title: '健身动作评估系统',
          login: '登录',
          register: '注册',
          exercise: '健身',
          statistics: '统计',
          email: '邮箱',
          password: '密码',
          newAccount: '创建新账号',
          passwordEnsure: '请确认你的密码',
          returnToLogin: '返回登录页面',
          pushUp: '引体向上',
          pullUp: '俯卧撑',
          squat: '深蹲',
          walk: '行走',
          sitUp: '仰卧起坐',
          closeFile: '关闭视频文件',
          closeCamP: '请先关闭摄像头',
          openFile: '打开视频文件',
          closeCam: '关闭摄像头',
          closeFileP: '请先关闭视频文件',
          openCam: '打开摄像头',
          uploadData: '上传健身数据',
          score: '分数',
          counter: '计次',
          actChoose: '选择健身动作类型',
          vidChoose: '选择健身视频',
          times:'次'
        }
      }
    }
  })

export default i18n
