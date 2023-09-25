const useMemoizedFn = <T,>(fn: T): T => {
  return {} as T;
};

function Foo() {}

type P = ReturnType<typeof Foo>;

export default useMemoizedFn;
