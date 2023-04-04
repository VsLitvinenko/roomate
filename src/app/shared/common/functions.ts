// eslint-disable-next-line no-bitwise
export const integerDivision = (a: number, b: number) => (~~(a / b));

export const promiseDelay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

export const extractError = (error: any): string => {
  if (error.hasOwnProperty('detail')) {
    return error.detail;
  }
  if (error.hasOwnProperty('message')) {
    return error.message;
  }
  else {
    return 'UNKNOWN ERROR';
  }
};

export const filterVisibleElements = (array: HTMLElement[], scrollTarget: HTMLElement) => {
  let firstVisibleIndex: number;
  let lastVisibleIndex: number;

  let isPrevElementVisible = false;
  for (let i = 0; i < array.length; i++) {
    const rect = array[i].getBoundingClientRect();
    const isItemVisible = (rect.y + rect.height) > 0 && ((rect.bottom - rect.height) < scrollTarget.clientHeight);
    if (!isPrevElementVisible && isItemVisible) {
      firstVisibleIndex = i;
    }
    if (isPrevElementVisible && !isItemVisible) {
      lastVisibleIndex = i;
      break;
    }
    isPrevElementVisible = isItemVisible;
    // console.log(i);
  }
  return array.slice(firstVisibleIndex, lastVisibleIndex);
};

export const openElementsChildren = (
  array: HTMLElement[],
  options: {
    filterHandler?: (...args: any[]) => boolean;
    reverseLeaf?: boolean;
  } = {}) =>
  array.reduce((previousValue, currentValue) => {
    let leaf = Array.from(currentValue.children);
    if (options.filterHandler) {
      leaf = leaf.filter(options.filterHandler);
    }
    if (options.reverseLeaf) {
      leaf.reverse();
    }
    return [...previousValue, ...leaf] as HTMLElement[];
  }, []);
