import { useMemo, useState } from "react";

const useCounter = (
  initialValue: number,
  { min, max }: { min: number; max: number }
) => {
  const [current, setCurrent] = useState(initialValue);
  const inc = (count?: number): void => {
    if (current >= max) {
      return;
    }
    setCurrent((v) => v + (count || 1));
  };
  const dec = (count?: number): void => {
    if (current <= min) {
      return;
    }
    setCurrent((v) => v - (count || 1));
  };
  const set = (...args: any): void => {
    if (typeof args === "number") {
      setCurrent(args);
    } else if (typeof args === "function") {
      const res = args();
      setCurrent(res);
    }
  };
  const reset = () => {
    setCurrent(initialValue);
  };
  const fns = useMemo(() => {
    return { inc, dec, set, reset };
  }, []);

  return [current, fns];
};

export default useCounter;
