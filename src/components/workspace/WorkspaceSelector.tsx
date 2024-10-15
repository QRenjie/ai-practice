import React, { useMemo } from "react";
import WorkspaceContext from "@/container/WorkspaceContext";
import { WorkspaceType } from "@/types/workspace";
import { workspaceStateCreator } from "@/utils/WorkspaceStateCreator";

const WorkspaceSelector: React.FC = () => {
  const { controller } = React.useContext(WorkspaceContext)!;

  const workspaceOptions = useMemo(() => {
    return workspaceStateCreator.getOptions();
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">选择工作区类型</h2>
        <div className="grid grid-cols-2 gap-4">
          {workspaceOptions.map((option) => (
            <button
              key={option.value}
              className="p-4 border rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() =>
                controller.store.resetState(option.value as WorkspaceType)
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSelector;
