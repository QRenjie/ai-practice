import { NextRequest, NextResponse } from "next/server";
import { WorkspacePublishManager } from "@/utils/server/WorkspaceDataManager";
// import { WorkspaceEncrypt } from "@/utils/server/WorkspaceEncrypt";
// import { WorkspaceState } from "@/types/workspace";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  console.log(searchParams);
  
  // const id = searchParams.get("id");

  // const data = {
  //   id: "9df68365-3c78-4024-9d99-b69159e28aa7",
  //   meta: {
  //     updatedAt: 1728566044330,
  //     image: "",
  //     public: true,
  //     user: {
  //       name: "",
  //       avatar: "",
  //     },
  //   },
  //   config: {
  //     selectedModel: "gpt-3.5-turbo",
  //     recommendedKeywords: [
  //       "创建时钟",
  //       "完成一个计算器应用",
  //       "创建日历",
  //       "完成一个天气应用",
  //       "创建音乐播放器",
  //       "完成一个待办事项应用",
  //     ],
  //     isChatCollapsed: false,
  //     isWindowed: false,
  //     isSandpackLoading: false,
  //     coderPrompt: "locale:coderPrompt:static-html",
  //   },
  //   ui: {
  //     activeTab: "preview",
  //     title: "Untitled",
  //     size: {
  //       width: "100%",
  //       height: "100%",
  //     },
  //     position: {
  //       x: 0,
  //       y: 0,
  //     },
  //     isMaximized: false,
  //     isMinimized: false,
  //     maxSize: {
  //       width: "100%",
  //       height: "100%",
  //     },
  //   },
  //   code: {
  //     mergedCodeBlocks: [],
  //     files: {
  //       "/index.html": {
  //         code: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\n    <meta name="theme-color" content="#000000" />\n    <meta\n      name="description"\n      content="Web site created using html"\n    />\n    <title>Static Html</title>\n  </head>\n  <body>\n    <noscript>You need to enable JavaScript to run this app.</noscript>\n    <h1>Hello Static Html</h1>\n    <div id="root"></div>\n  </body>\n</html>\n',
  //         hidden: false,
  //         active: false,
  //         readOnly: true,
  //       },
  //       "/package.json": {
  //         code: '{\n  "name": "static-html",\n  "version": "0.1.0",\n  "private": true,\n  "config": {\n    "sandpack": {\n      "template": "static"\n    }\n  }\n}\n',
  //         hidden: true,
  //         active: false,
  //         readOnly: true,
  //       },
  //     },
  //     customSetup: {
  //       dependencies: {},
  //       devDependencies: {},
  //     },
  //     template: "static",
  //   },
  //   chat: {
  //     messages: [],
  //   },
  // };
  // const encrypted = WorkspaceEncrypt.encrypt(data as WorkspaceState);
  // console.log(encrypted);
  // console.log("========================");
  // console.log(WorkspaceEncrypt.decrypt(encrypted));

  const workspace = await new WorkspacePublishManager().get(
    "2b078344-1609-4f9a-bef9-9c03e225c8f6"
  );

  return NextResponse.json(workspace);
}
