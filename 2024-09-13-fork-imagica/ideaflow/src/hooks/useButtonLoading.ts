import { useCallback } from "react";
import { useState } from "react";

/**
 * 点击按钮后，根据 onClick 是否为 promise 是否开启loading
 * @param onClick 
 * @returns 
 */
export default function useButtonLoading(
  onClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void | Promise<void>
) {
  const [loading, setLoading] = useState(false);

  const onClickInner = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (!onClick) {
        return;
      }

      setLoading(true);

      const result = onClick(e);

      // 根据 onClick 是否为 promise 是否开启loading
      if (result instanceof Promise) {
        result.finally(() => {
          setLoading(false);
        });
        return;
      }

      setLoading(false);
    },
    [onClick]
  );

  return { loading, onClick: onClickInner };
}
