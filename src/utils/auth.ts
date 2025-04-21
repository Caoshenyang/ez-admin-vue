import type { TokenInfoVO } from '@/types/auth'

import Cookies from 'js-cookie'

// token key
export const TOKEN_KEY = 'ezadmin-token'
/**
 * expires:  token 过期时间 单位：天 不设置则默认为会话级别，关闭浏览器则失效
 * path: 指定该 Cookie 对应的 URL 路径。这个路径限制了 Cookie 的作用范围，只有当 URL 路径匹配时，浏览器才会发送这个 Cookie。将 path 设置为根路径 '/'，
 *       使得该 Cookie 在整个站点有效。
 * secure: 指定 Cookie 只有在使用 HTTPS 协议时才会发送。通过设置 secure 为 true，可以增强 Cookie 的安全性，避免在不安全的 HTTP 连接中传输敏感信息。
 * sameSite: 这个属性控制第三方请求是否可以携带 Cookie。它主要用于防止 CSRF（跨站请求伪造）攻击。它有以下几种值：
 *     - Strict：只有在同站请求时，Cookie 才会被发送。例如，如果你在 siteA.com 中的页面请求了 siteA.com 上的资源，Cookie 会随请求一起发送，
 *               但如果是从外部网站（如 other-site.com）发起的请求，Cookie 不会被发送。
 *     - Lax：对于一些跨站请求（如从其他站点的链接跳转），Cookie 会被发送，但对于其他类型的跨站请求（如通过 POST 发送的请求），Cookie 不会被发送。
 *     - None：允许跨站请求携带 Cookie。但是，如果设置为 None，必须同时设置 secure: true，即只能在 HTTPS 协议下发送。
 * httpOnly: 如果设置了这个属性，Cookie 就不能通过 JavaScript 访问，它只能通过 HTTP 请求传递。这有助于防止客户端的 JavaScript 访问敏感数据，降低被 XSS 攻击的风险。
 * domain: window.location.hostname 指定哪些域名下的页面可以访问该 Cookie。默认情况下，Cookie 只能被设置它的创建页面所在的域名访问。如果你希望子域名也能访问这个 Cookie，可以设置 domain 参数。
 * @param token 存储 token 信息
 */
export const setToken = (token: TokenInfoVO) => {
  Cookies.set(TOKEN_KEY, token.tokenValue, {
    expires: 30,
    path: '/'
    // secure: true,
    // sameSite: 'Strict',
  })
}

// 获取 token
export const getToken = () => {
  return Cookies.get(TOKEN_KEY)
}

// 删除 token
export const removeToken = () => {
  Cookies.remove(TOKEN_KEY)
}
