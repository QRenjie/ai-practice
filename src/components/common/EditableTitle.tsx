import React, { useState, useContext, useCallback, useMemo } from "react";
import WorkspaceContext from "@/container/WorkspaceContext";
import { FiEdit2, FiCheck } from "react-icons/fi";
import IconButton from "./IconButton";
import { Input, Tooltip } from "antd"; // 假设你有一个 Tooltip 组件
import { locales } from "@/utils/Locales";

const validateTitle = (newValue: string) => {
  if (!/^[a-zA-Z0-9\s]*$/.test(newValue)) {
    return 1; //"标题不能包含特殊字符";
  }
  if (newValue.length > 128) {
    return 2; //"标题不能超过128个字符";
  }
  return 0;
};

const EditableInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}> = ({ value, onChange, onBlur }) => {
  const [title, setTitle] = useState(value);
  const [error, setError] = useState(0);

  const onChangeInner = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(validateTitle(e.target.value));
      setTitle(e.target.value);
    },
    []
  );
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        onBlur();
        return;
      }
      if (e.key === "Enter" && !error && title) {
        onChange(title);
      }
    },
    [title, onChange, error, onBlur]
  );

  const tip = useMemo(() => {
    if (error === 1) {
      return locales.get("locale:workspace.title.error.specialChar");
    }
    if (error === 2) {
      return locales.get("locale:workspace.title.error.maxLength");
    }
    return "";
  }, [error]);

  return (
    <Tooltip title={tip} open={!!error}>
      <Input
        value={title}
        status={error || !title ? "error" : undefined}
        onChange={onChangeInner}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        maxLength={128}
        showCount
        autoFocus
        allowClear
        suffix={
          <IconButton
            size="xs"
            disabled={!title || !!error}
            icon={<FiCheck />}
            onClick={() => onChange(title)}
          />
        }
      />
    </Tooltip>
  );
};

const EditableTitle: React.FC = () => {
  const { state, controller } = useContext(WorkspaceContext)!;
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (value: string) => {
    controller.updateTitle(value);
    setIsEditing(false);
  };

  const onBlur = () => {
    setIsEditing(false);
  };

  return (
    <div data-testid="editable-title" className="flex items-center">
      {isEditing ? (
        <EditableInput
          value={state.ui.title}
          onBlur={onBlur}
          onChange={handleSave}
        />
      ) : (
        <h2 className="text-lg text-gray-700 font-semibold">
          {state.ui.title}
        </h2>
      )}

      {!isEditing && (
        <IconButton
          tooltipProps={{
            title: locales.get("locale:workspace.title.edit"),
          }}
          className="ml-2"
          size="xs"
          icon={<FiEdit2 />}
          onClick={() => setIsEditing(true)}
        />
      )}
    </div>
  );

  //   return isEditing ? (
  //     <div className="flex items-center">
  //       <input
  //         className="text-gray-700 font-semibold border-b-2 border-blue-500 focus:outline-none"
  //         value={title}
  //         onChange={handleTitleChange}
  //         onKeyDown={(e) => e.key === "Enter" && handleSave()}
  //         autoFocus
  //       />
  //       <Tooltip title={error} open={!!error}>
  //         <IconButton
  //           className="ml-2"
  //           size="sm"
  //           icon={<FiCheck />}
  //           onClick={handleSave}
  //           disabled={!!error}
  //         />
  //       </Tooltip>
  //     </div>
  //   ) : (
  //     <div
  //       className="flex items-center text-gray-700 font-semibold cursor-pointer"
  //       onClick={handleDoubleClick}
  //       onDoubleClick={handleDoubleClick}
  //     >
  //       {title}
  //       <IconButton
  //         className="ml-2"
  //         size="sm"
  //         icon={<FiEdit2 />}
  //         onClick={handleDoubleClick}
  //       />
  //     </div>
  //   );
};

export default EditableTitle;
