import IconButton from "@/components/common/IconButton";
import { FiMinimize2, FiX, FiMinus } from "react-icons/fi";

export default function WorkspaceActions() {
  return (
    <div data-testid="WorkspaceActions">
      <IconButton>
        <FiMinus />
      </IconButton>
      <IconButton>
        {/* {isMaximized ? <FiMinimize2 /> : <FiMaximize2 />} */}
        <FiMinimize2 />
      </IconButton>
      <IconButton>
        <FiX />
      </IconButton>
    </div>
  );
}
