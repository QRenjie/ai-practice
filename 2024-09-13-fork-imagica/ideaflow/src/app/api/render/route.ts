import { NextRequest, NextResponse } from "next/server";
import { transform } from "@babel/core";
import presetTypescript from "@babel/preset-typescript";
import presetReact from "@babel/preset-react";
import * as vm from "vm";

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  try {
    // 使用 Babel 转换 TSX 代码
    const result = await transform(code, {
      presets: [presetTypescript, presetReact],
      filename: 'component.tsx',
    });

    if (!result || !result.code) {
      return NextResponse.json({ error: "转换代码失败" }, { status: 500 });
    }

    // 创建一个安全的上下文
    const context = vm.createContext({
      React: require('react'),
      Component: null,
    });

    // 在安全的上下文中执行代码
    vm.runInContext(`
      ${result.code}
      Component = Component;
    `, context);

    // 获取组件
    const Component = context.Component;

    if (typeof Component !== 'function') {
      throw new Error('无效的组件');
    }

    // 返回组件定义
    return NextResponse.json({ componentDefinition: Component.toString() });
  } catch (error) {
    console.error("处理组件时出错:", error);
    return NextResponse.json({ error: "处理组件失败" }, { status: 500 });
  }
}
