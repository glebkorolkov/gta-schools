import _get from 'lodash.get';


const sortNullsLast = (arr, keyPath, order) => {
  order = order || 'asc';
  const mult = order.toLowerCase() === 'asc' ? 1 : -1;
  let outArr = [...arr];
  return outArr.sort((a, b) => {
    const aVal = keyPath === null ? a : _get(a, keyPath, null);
    const bVal = keyPath === null ? b : _get(b, keyPath, null);
    if (aVal === null && bVal === null) return 0;
    if (aVal === null) return 1;
    if (bVal === null) return -1;
    if (aVal < bVal) return (-1 * mult);
    if (aVal > bVal) return (1 * mult);
    return 0;
  });
};


export { sortNullsLast };