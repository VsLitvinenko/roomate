import { integerDivision } from '../common';

export const ruCaseByNumeral: (n: number) => 'single' | 'middle' | 'default' = (n: number) => {
  if (isNaN(n)) {
    return 'default';
  }
  if (
    integerDivision(n, 10) !== 1 &&
    (n % 10) === 1
  ) {
    return 'single';
  }
  else if (
    integerDivision(n, 10) !== 1 &&
    [2, 3, 4].includes((n % 10))
  ) {
    return 'middle';
  }
  else {
    return 'default';
  }
};
