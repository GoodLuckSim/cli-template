// 注册成全局组件
import FuseDialogTemplate from './Fuse-dialog/index.vue'
import FuseFormTemplate from './fuse-form/index.vue'

const Fuse = {
  install: function (Vue) {
    Vue.component('FuseDialog', FuseDialogTemplate)
    Vue.component('FuseForm', FuseFormTemplate)
  }
}
export default Fuse
