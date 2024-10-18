export default class JSONUtil {
  static stringify(value, replacer, space) {
    // 去除字符串中的 \r\n, 保证不同平台下的字符串一致
    const customReplacer = (key, val) => {
      if (typeof val === "string") {
        return val.replace(/\r\n/g, "\n");
      }
      return replacer ? replacer(key, val) : val;
    };

    return JSON.stringify(value, customReplacer, space);
  }

  static parse(text, reviver, defaultValue) {
    try {
      return JSON.parse(text, reviver);
    } catch (error) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw error;
    }
  }
}
