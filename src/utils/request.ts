import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading'
import { msgErr } from './message'
import { getToken } from './auth'

type RequestConfig<T = unknown> = AxiosRequestConfig & {
  // 可以在这里扩展自定义配置
  mock?: boolean // 是否使用mock数据
  mockData?: T // mock数据
}

class Request {
  private instance: AxiosInstance // axios实例
  private loadingInstance: LoadingInstance | null = null // loading实例
  private loadingCount = 0 // loading计数

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_APP_BASE_API,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Mock 模拟数据
        if ((config as RequestConfig).mock) {
          return Promise.reject({
            config,
            data: (config as RequestConfig).mockData
          })
        }

        // 全局 Loading 控制 loadingCount 计数 (避免多个请求时加载闪烁问题)
        if (!config.noLoading) {
          if (this.loadingCount === 0) {
            this.loadingInstance = ElLoading.service({
              lock: true,
              text: '加载中...',
              background: 'rgba(0, 0, 0, 0.5)'
            })
          }
          this.loadingCount++
        }

        // 添加认证 token
        const token = getToken()
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        this.handleLoadingError(error.config)
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        this.handleLoadingComplete(response.config)

        // 业务状态码处理
        if (response.data.code !== 200) {
          if (!response.config.noErrorToast) {
            msgErr(response.data.message || '请求失败')
          }
          return Promise.reject(response.data)
        }

        return response.data.data
      },
      (error) => {
        this.handleLoadingComplete(error.config)

        // HTTP 状态码处理
        if (!error.config?.noErrorToast) {
          let message = '请求错误'
          if (error.response) {
            switch (error.response.status) {
              case 401:
                message = '未授权，请登录'
                break
              case 403:
                message = '拒绝访问'
                break
              case 500:
                message = '服务器错误'
                break
            }
          }
          ElMessage.error(message)
        }

        return Promise.reject(error)
      }
    )
  }

  private handleLoadingComplete(config?: RequestConfig) {
    if (!config?.noLoading) {
      this.loadingCount--
      if (this.loadingCount <= 0) {
        this.loadingInstance?.close()
      }
    }
  }

  private handleLoadingError(config?: RequestConfig) {
    if (!config?.noLoading) {
      this.loadingCount--
      if (this.loadingCount <= 0) {
        this.loadingInstance?.close()
      }
    }
  }

  // 封装核心请求方法
  public request<T = unknown>(config: RequestConfig<T>): Promise<T> {
    // 模拟数据直接返回
    if (config.mock) {
      return Promise.resolve(config.mockData as T)
    }

    return this.instance(config)
  }

  public get<T = unknown>(url: string, config?: RequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'GET', url })
  }

  public post<T = unknown>(url: string, data?: unknown, config?: RequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'POST', url, data })
  }

  public put<T = unknown>(url: string, data?: unknown, config?: RequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'PUT', url, data })
  }

  public delete<T = unknown>(url: string, data?: unknown, config?: RequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'DELETE', url })
  }
}

const http = new Request()

export default http
