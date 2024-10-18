import { Logger, LogLevel } from "lib/logger";
import chalk from "chalk";
import { isArray } from "lodash-es";
class ColorLogger extends Logger {
  prefix(value: string, level: LogLevel): string {
    switch (level) {
      case "INFO":
        return chalk.blue(value);
      case "WARN":
        return chalk.yellow(value);
      case "ERROR":
        return chalk.red(value);
      case "DEBUG":
        return chalk.green(value);
      default:
        return value;
    }
  }
}

class BrowserLogger extends Logger {
  prefix(value: string, level: LogLevel): string[] {
    const style = this.getStyleForLevel(level);
    return [`%c${value}`, style];
  }

  protected print(
    level: LogLevel,
    prefix: string | string[],
    ...args: unknown[]
  ): void {
    if (!this.isSilent) {
      if (isArray(prefix)) {
        console.log(...prefix, ...args);
      } else {
        console.log(prefix, ...args);
      }
    }
  }

  private getStyleForLevel(level: LogLevel): string {
    switch (level) {
      case "INFO":
        return "color: blue; font-weight: bold;";
      case "WARN":
        return "color: orange; font-weight: bold;";
      case "ERROR":
        return "color: red; font-weight: bold;";
      case "DEBUG":
        return "color: green; font-weight: bold;";
      default:
        return "";
    }
  }
}

let browserLogInstance: Logger | null = null;
let serverLogInstance: Logger | null = null;

export function getLogger(): Logger {
  const isServer = typeof window === "undefined";
  const isProduction = process.env.NODE_ENV === "production";

  if (isServer) {
    if (serverLogInstance === null) {
      serverLogInstance = new ColorLogger({
        isCI: process.env.CI === "true",
        dryRun: process.env.DRY_RUN === "true",
        debug: process.env.DEBUG === "true",
        silent: false, // 服务器端通常不需要静默
      });
    }
    return serverLogInstance;
  } else {
    if (browserLogInstance === null) {
      browserLogInstance = new BrowserLogger({
        isCI: false, // 浏览器环境通常不是 CI
        dryRun: false, // 浏览器环境通常不是 dry run
        debug: process.env.NODE_ENV !== "production",
        silent: isProduction, // 生产环境下浏览器端静默
      });
    }
    return browserLogInstance;
  }
}

export const log = getLogger();
