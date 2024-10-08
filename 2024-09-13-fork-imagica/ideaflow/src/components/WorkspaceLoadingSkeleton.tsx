import React, { useContext } from "react";
import { Skeleton } from "antd";
import WorkspaceContext from "@/context/WorkspaceContext";

interface WorkspaceLoadingSkeletonProps {
  isLoading?: boolean;
}

const WorkspaceLoadingSkeleton: React.FC<WorkspaceLoadingSkeletonProps> = ({
  isLoading,
}) => {
  const { state } = useContext(WorkspaceContext)!;

  if (!state.config.isSandpackLoading) return null;

  return (
    <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col z-50 p-4">
      <div className="text-2xl font-bold text-gray-700 mb-4">
        Ready Environment...
      </div>
      <div className="flex justify-between items-center mb-4">
        <Skeleton.Button
          active
          size="small"
          shape="round"
          style={{ width: 100 }}
        />
        <Skeleton.Avatar active size="small" shape="circle" />
      </div>
      <div className="flex-1 flex">
        <div className="w-2/3 pr-4">
          <Skeleton active paragraph={{ rows: 4 }} />
          <Skeleton.Input active size="large" block style={{ marginTop: 16 }} />
        </div>
        <div className="w-1/3 border-l pl-4">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      </div>
      <div className="mt-4 border-t pt-4">
        <Skeleton.Input active size="large" block />
      </div>
    </div>
  );
};

export default WorkspaceLoadingSkeleton;
