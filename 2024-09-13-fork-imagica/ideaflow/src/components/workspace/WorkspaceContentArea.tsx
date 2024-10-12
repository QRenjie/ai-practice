import WorkspaceContext from "@/context/WorkspaceContext";
import { useContext } from "react";
import WorkspaceCode from "../WorkspaceCode";
import WorkspacePreview from "../WorkspacePreview";
import clsx from "clsx";

export default function WorkspaceContentArea({
  className,
}: {
  className?: string;
}) {
  const { state } = useContext(WorkspaceContext)!;
  const { activeTab } = state.ui;

  const showCode = activeTab === "code";

  return (
    <div
      data-testid="WorkspaceContentArea"
      className={clsx("relative", className)}
    >
      <div className={clsx("transition-all duration-300 w-full")}>
        <WorkspacePreview />
      </div>

      <div
        className={clsx(
          "transition-all duration-300 md:static h-full",
          "absolute md:static",
          {
            "w-full z-10 left-0 md:w-1/2 md:z-auto": showCode, // 小屏幕时代码宽度为100%
            "left-full z-0 md:w-0": !showCode, // 默认隐藏代码
          }
        )}
      >
        <WorkspaceCode />
      </div>
    </div>
  );
}
