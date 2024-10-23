import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class ApiService {
    private api: AxiosInstance;

    constructor(baseURL: string) {
        this.api = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Interceptor để thêm Authorization header trước mỗi request
        this.api.interceptors.request.use(
        config => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('authorization'); // Lấy token từ localStorage
                if (token) {
                    config.headers.Authorization = token;
                    //console.log('Authorization Header:', config.headers.Authorization); // In ra header để kiểm tra
                }
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    }

    post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.post<T>(url, data, config);
    }

    get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.get<T>(url, config);
    }

    put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.put<T>(url, data, config);
    }

    delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.delete<T>(url, config);
    }
    
}

const apiService = new ApiService('http://localhost:9000');

export default apiService;
