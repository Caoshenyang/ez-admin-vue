declare module '*.svg' {
  import { FunctionalComponent, SVGAttributes } from 'vue'
  const src: FunctionalComponent<SVGAttributes>
  export default src
}

// 导出的是一个函数，调用后会注册 SVG 图标。
declare module 'virtual:svg-icons-register' {
  const registerSvgIcons: () => void
  export default registerSvgIcons
}
