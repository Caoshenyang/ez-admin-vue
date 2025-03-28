import axios, { type AxiosRequestConfig } from 'axios'
import { getToken } from './auth'
import { msgErr } from './message'

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})
// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 请求成功做点什么
    // 设置统一token
    const token = getToken()
    if (token && config.headers) {
      config.headers.set('Authorization', `Bearer ` + token)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应成功做点什么
    const { success, message, data } = response.data

    if (success) {
      return data
    } else {
      // 请求失败，业务失败，消息提示
      msgErr(message)
      return Promise.reject(new Error(message))
    }
  },
  (error) => {
    // 对响应错误做点什么
    console.log('error', error)

    if (error.code === 'ERR_BAD_RESPONSE') {
    }
    if (error.code === 'ECONNABORTED') {
    }
    return Promise.reject(error)
  },
)

// 指定返回数据类型，类型推断提示
export default async <T>(config: AxiosRequestConfig) => {
  const response: T = await instance(config)
  return response
}
