import React, { useState, useContext, useCallback, useMemo } from "react";
import WorkspaceContext from "@/container/WorkspaceContext";
import { FiEdit2, FiCheck } from "react-icons/fi";
import IconButton from "./IconButton";
import { Input, Tooltip } from "antd"; // 假设你有一个 Tooltip 组件
import { locales } from "@/utils/Locales";
import WorkspacePopover from "../workspace/WorkspacePopover";
import { Recommender } from "@/utils/Recommender";

const validateTitle = (newValue: string) => {
  if (!/^[\u4e00-\u9fa5a-zA-Z0-9\s]*$/.test(newValue)) {
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
        size="small"
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
  const [recommendedTitles, setRecommendedTitles] = useState<string[]>([]);
  const recommender = useMemo(() => new Recommender(), []);

  const handleSave = useCallback(
    (value: string) => {
      controller.updateTitle(value.trim());
      setIsEditing(false);
    },
    [controller]
  );

  const onBlur = useCallback(() => {
    setIsEditing(false);
  }, [setIsEditing]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);

    if (recommender.ok()) {
      recommender.staged();
      // 获取推荐标题
      controller
        .getRecommendedTitles()
        .then((titles) => {
          setRecommendedTitles(titles); // 保存推荐标题
        })
        .catch((error) => {
          console.error("获取推荐标题失败", error);
        });
    }
  }, [controller, recommender]);

  const TitleRecommend = useMemo(() => {
    return (
      <ul className="flex flex-1 p-1.5 flex-nowrap gap-2 text-[0.7rem] items-center overflow-x-auto no-scrollbar">
        {recommendedTitles.map((title, index) => (
          <li
            key={index}
            onMouseDown={(e) => {
              // 使用 onMouseDown 而不是 onClick
              handleSave(title);
              e.stopPropagation();
              e.preventDefault();
            }}
            className="cursor-pointer px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200"
          >
            {title.endsWith("?") ? `${title}` : `#${title}`}
          </li>
        ))}
      </ul>
    );
  }, [handleSave, recommendedTitles]);

  return (
    <WorkspacePopover
      content={TitleRecommend}
      open={isEditing && recommendedTitles.length > 0}
      noPadding
    >
      <div data-testid="editable-title" className="flex items-center">
        {isEditing ? (
          <div className="flex flex-col">
            <EditableInput
              value={state.ui.title}
              onBlur={onBlur}
              onChange={handleSave}
            />
          </div>
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
            icon={<FiEdit2 />}
            onClick={handleEdit}
          />
        )}
      </div>
    </WorkspacePopover>
  );
};

export default EditableTitle;
