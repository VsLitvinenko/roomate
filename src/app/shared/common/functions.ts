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
