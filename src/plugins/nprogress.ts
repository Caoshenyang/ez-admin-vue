import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 全局进度条配置
nprogress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条速度
  showSpinner: false, // 是否现实加载ico
  trickleSpeed: 400, // 自动递增间隔
  minimum: 0.3, // 初始化时最小百分比
})

export default nprogress
