// 定义递归的 DeepPartial 类型
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
