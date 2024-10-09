"use client";

import React from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { workspaceStateCreator } from "@/context/WorkspaceContext";

const worspacestate = workspaceStateCreator.create();
export default function RenderPage() {
  return (
    <Sandpack
      template="vite-react"
      files={worspacestate.code.files}
      customSetup={worspacestate.code.customSetup}
      theme="light"
    />
  );
}
