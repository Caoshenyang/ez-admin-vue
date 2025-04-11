import 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    /**
     * 是否禁用全局 Loading
     */
    noLoading?: boolean
    /**
     * 是否禁用错误提示
     */
    noErrorToast?: boolean
  }

  interface AxiosResponse<T> {
    code: number
    success: boolean
    message: string
    data: T
  }
}
