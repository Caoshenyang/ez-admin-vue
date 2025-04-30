import nprogress from '../plugins/nprogress'
import router from '@/router'
import { useUserStore } from '@/stores/modules/userStore'
import { generateDynamicRoutes } from '@/utils/routeGenerator'
import { ref } from 'vue'

/**  白名单，用户不登录也可以进入 */
const whiteList = ['/login']
/** 是否注册路由 */
const isRouteRegister = ref(false)

router.beforeEach(async (to, from) => {
  // 显示进度条
  nprogress.start()

  // 检查是否登录，或是否需要登录
  const userStore = useUserStore()
  if (userStore.isLogin()) {
    // 已经登录的情况下请求登录页面，不允许，跳转到原来的页面
    if (to.path === '/login') {
      return from.fullPath
    } else {
      if (!isRouteRegister.value) {
        // 登录成功跳转时，用户信息为空，则取请求用户信息
        await userStore.getUserInfo()
        // 获取菜单列表
        const menus = userStore.userInfo.menus
        // 完成动态路由组装
        if (menus.length > 0) {
          // 生成动态路由
          const dynamicRoutes = await generateDynamicRoutes(menus)
          dynamicRoutes.forEach((route) => router.addRoute(route))
          // 可能需要等待路由更新完成
          router.isReady()
        }
        // 修改路由组织过标记
        isRouteRegister.value = true
        // 确保添加路由已完成
        return to.fullPath
      }
    }
  } else {
    // 未登录状态，检查是否为白名单，否则直接跳转到登录页面
    if (whiteList.indexOf(to.path) > -1) {
      return true
    } else {
      return '/login'
    }
  }
})

router.afterEach(() => {
  // 关闭进度条
  nprogress.done()
})
