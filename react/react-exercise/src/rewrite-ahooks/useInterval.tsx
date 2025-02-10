import { useMemoizedFn } from "ahooks";
import { useCallback, useEffect, useRef } from "react";

const useInterval = (fn: () => void, wait: number) => {
  const cb = useMemoizedFn(fn);
  const ref = useRef<NodeJS.Timer | null>(null);

  const clear = useCallback(() => {
    if (ref.current) {
      clearInterval(ref.current);
    }
  }, []);

  useEffect(() => {
    ref.current = setInterval(cb, wait);

    return clear;
  }, []);
};

export default useInterval;
