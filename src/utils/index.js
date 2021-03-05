import {makeColorFunc, addOpacity} from './color';
import {sortNullsLast} from './sort';


const callInProd = (func, args) => {
  if (process.env.NODE_ENV === 'production') {
    return func(...args);
  }
}


export {sortNullsLast, makeColorFunc, addOpacity, callInProd};

