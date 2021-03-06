import Vue from 'vue'
import VueI18n from 'vue-i18n'
import locale from 'element-ui/lib/locale'
import messages from './lang'
import { Local } from '@/utils/storage'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: Local.get('lang') || 'en',
  messages: messages
})
locale.i18n((key, value) => i18n.t(key, value))

export default i18n
