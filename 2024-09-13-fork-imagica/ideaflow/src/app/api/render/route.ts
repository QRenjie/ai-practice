import { NextRequest, NextResponse } from "next/server";
import { transform } from "@babel/core";
import presetTypescript from "@babel/preset-typescript";

export async function POST(req: NextRequest) {
  const { language, code } = await req.json();

  if (!(language === "jsx" || language === "tsx")) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  // 使用 Babel 转换代码
  const result = await transform(code, {
    presets: [presetTypescript],
    filename: 'file.tsx',
  });

  if (!result || !result.code) {
    return NextResponse.json({ error: "Failed to transform code" }, { status: 500 });
  }

  // 直接返回转换后的代码
  return NextResponse.json({ content: result.code }); // 返回转换后的代码
}
