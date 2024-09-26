import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

class ApiClient {
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
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(endpoint, data, config);
      return response.data;
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

// 创建OpenAI API客户端实例
const openAIClient = new ApiClient("http://openai-proxy.brain.loocaa.com/v1");

// 如果有token，可以在这里设置
openAIClient.setAuthToken("DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK");

export { ApiClient, openAIClient };
