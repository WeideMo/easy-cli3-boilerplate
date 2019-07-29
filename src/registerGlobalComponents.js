/**
*{全局扫描注册组件}
*/
import Vue from 'vue'

// 自动加载 common 目录下的 .js 结尾的文件
const componentsContext = require.context('@/components/common', true, /\.js$/)

componentsContext.keys().forEach(component => {
  const componentConfig = componentsContext(component)
  /**
  * 兼容 import export 和 require module.export 两种规范
  */
  const ctrl = componentConfig.default || componentConfig
  Vue.component(ctrl.name, ctrl)
})
