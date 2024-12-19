import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

class ApiService {
  private api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Interceptor để thêm Authorization header trước mỗi request
    this.api.interceptors.request.use(
      (config) => {
        if (typeof window !== "undefined") {
          // Lấy `authData` từ localStorage và phân tích cú pháp
          const authData = JSON.parse(localStorage.getItem("authData") || "{}");
          if (authData.authorization) {
            config.headers.Authorization = authData.authorization;
            //console.log("Authorization Header:", config.headers.Authorization); // In ra header để kiểm tra
          } else {
            //console.log("Authorization token is missing in localStorage");
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data, config);
  }

  get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url, config);
  }

  put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.api.put<T>(url, data, config);
  }

  delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(url, config);
  }
}

//const apiService = new ApiService("http://localhost:9000");
const apiService = new ApiService("https://be-hote-luxury.vercel.app");

export default apiService;
git