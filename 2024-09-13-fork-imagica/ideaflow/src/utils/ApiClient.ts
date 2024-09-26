import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export default class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async post<T, D = unknown>(
    endpoint: string,
    data: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    try {
      return await this.axiosInstance.post<T>(endpoint, data, config);
    } catch (error) {
      console.error("API请求错误:", error);
      throw error;
    }
  }

  async postStream<D = unknown>(
    endpoint: string,
    data: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    try {
      const response = await this.axiosInstance.post(endpoint, data, {
        ...config,
        responseType: "stream",
      });
      return response;
    } catch (error) {
      console.error("API流式请求错误:", error);
      throw error;
    }
  }

  setAuthToken(token: string) {
    this.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  }
}
