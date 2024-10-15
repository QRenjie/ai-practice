import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { StreamApiProcessorType, streamProcessor } from "./StreamProcessor";
import JSONUtil from "@/utils/JSONUtil";
import { Uid } from "@/utils/Uid";
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
          body: JSONUtil.stringify(data),
          ...config,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await streamProcessor.processStream(
        response,
        Uid.generate(),
        onChunk
      );

      return result;
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
