import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

// 扩展自定义配置类型
interface RequestConfig<T = unknown> extends AxiosRequestConfig {
  /**
   * 是否使用mock数据
   */
  mock?: boolean
  /**
   * mock数据
   */
  mockData?: T
  /**
   * 是否显示错误提示
   */
  noErrorToast?: boolean
}

class Request {
  private readonly instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_APP_BASE_API,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data } = response

        // 业务状态码处理
        if (data.code !== 200) {
          return Promise.reject(new Error(data.message || '请求失败'))
        }

        return data.data
      },
      (error) => {
        // 处理mock数据
        if (error.config?.mock) {
          return Promise.resolve(error.config.mockData)
        }

        // HTTP 状态码处理
        if (!error.config?.noErrorToast) {
          this.handleHttpError(error)
        }

        return Promise.reject(error)
      },
    )
  }

  private handleHttpError(error: unknown) {
    let message = '请求错误'

    if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            message = '请求参数错误'
            break
          case 401:
            message = '未授权，请登录'
            break
          case 403:
            message = '拒绝访问'
            break
          case 404:
            message = '请求资源不存在'
            break
          case 500:
            message = '服务器错误'
            break
          default:
            message = `网络错误 (${error.response.status})`
        }
      } else if (error.request) {
        message = '网络连接异常，请检查网络'
      }
    } else if (error instanceof Error) {
      message = error.message
    }
    ElMessage.error(message)
  }

  public async request<T = unknown>(config: RequestConfig<T>): Promise<T> {
    // 模拟数据直接返回
    if (config.mock) {
      return Promise.resolve(config.mockData as T)
    }

    try {
      return await this.instance(config)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  public get<T = unknown>(url: string, config?: RequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'GET', url })
  }

  public post<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'POST', url, data })
  }

  public put<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'PUT', url, data })
  }

  public delete<T = unknown>(url: string, config?: RequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'DELETE', url })
  }

  public patch<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: 'PATCH', url, data })
  }
}

const http = new Request()

export default http
