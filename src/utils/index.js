import _get from 'lodash.get';

import {makeColorFunc, addOpacity} from './color'


const sortNullsLast = (arr, keyPath, order) => {
  order = order || 'asc';
  const mult = order.toLowerCase() === 'asc' ? 1 : -1;
  let outArr = [...arr];
  return outArr.sort((a, b) => {
    const aVal = _get(a, keyPath, null);
    const bVal = _get(b, keyPath, null);
    if (aVal === null && bVal === null) return 0;
    if (aVal === null) return 1;
    if (bVal === null) return -1;
    if (aVal < bVal) return (-1 * mult);
    if (aVal > bVal) return (1 * mult);
    return 0;
  });
};


export {sortNullsLast, makeColorFunc, addOpacity};