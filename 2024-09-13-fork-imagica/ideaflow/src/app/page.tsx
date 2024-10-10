"use client";

import Link from "next/link";
import rootConfig from "../../config/root.json";
import WorkspacesGallery from "../components/WorkspacesGallery";
import { WorkspaceState } from "@/context/WorkspaceContext";
import Tabs from "../components/common/Tabs";

// 这里应该从后端或状态管理中获取实际的项目列表
const publicWorkspaces: WorkspaceState[] = [];
const myWorkspaces: WorkspaceState[] = [];

export default function Home() {
  const tabs = [
    {
      key: 'public',
      label: '公开',
      children: <WorkspacesGallery workspaces={publicWorkspaces} itemsPerPage={12} />
    },
    {
      key: 'my',
      label: '我的',
      children: <WorkspacesGallery workspaces={myWorkspaces} itemsPerPage={12} />
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col sm:flex-row justify-between items-center py-4">
          <div className="text-2xl font-bold mb-4 sm:mb-0">
            {rootConfig.name}
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button className="px-4 py-2 bg-black text-white rounded-full w-full sm:w-auto">
              New Generation
            </button>
            <button className="w-full sm:w-auto">Feedback</button>
            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
          </div>
        </header>

        <main className="py-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">探索</h1>
          <Tabs tabs={tabs} defaultActiveKey="public" />
        </main>

        <footer className="py-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex flex-wrap justify-center sm:justify-start space-x-4 mb-4 sm:mb-0">
            <Link href="/faq">FAQ</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/ai-policy">AI Policy</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
