import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { StreamApiProcessorType, streamProcessor } from "./StreamProcessor";
import { v4 as uuidv4 } from "uuid";
export default class ApiClient {
  private axiosInstance: AxiosInstance;
  token: string = "";

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
  ): Promise<AxiosResponse<T>> {
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
    config?: RequestInit,
    onChunk?: (chunk: string) => void
  ): Promise<StreamApiProcessorType> {
    try {
      const response = await fetch(
        `${this.axiosInstance.defaults.baseURL}${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify(data),
          ...config,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await streamProcessor.processStream(response, uuidv4(), onChunk);
    } catch (error) {
      console.error("API流式请求错误:", error);
      throw error;
    }
  }

  setAuthToken(token: string) {
    this.token = token;
    this.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  }
}
