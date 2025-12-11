// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => void;

const debounce = <T extends AnyFunction>(func: T, wait: number) => {
  let timeout: number | null;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout!);

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

export default debounce;
