type Procedure = (...args: any[]) => void;

export default function debounce<F extends Procedure>(func: F, waitMilliseconds = 50): F & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  function debouncedFunction(this: any, ...args: any[]) {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => func.apply(this, args), waitMilliseconds);
  }

  debouncedFunction.cancel = function() {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return debouncedFunction as F & { cancel: () => void };
}
