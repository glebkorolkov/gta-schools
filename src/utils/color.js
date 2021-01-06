import * as d3Color from 'd3-color';
import * as d3Interpolate from 'd3-interpolate';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import _get from 'lodash.get';

import {sortNullsLast} from './sort';


const NULL_COLOR = 'gray'
const COLOR_INTERPOLATOR = d3Interpolate.piecewise(
  d3Interpolate.interpolateRgb.gamma(2.2),
  ["green", "yellow", "red"]
)


const makeContiColorFunc = (range, field) => {
  const rangeStart = range[0]
  const rangeEnd = range[range.length - 1]
  return (item) => {
    const fieldVal = _get(item, field, null)
    if (fieldVal === null)
      return NULL_COLOR
    const fieldValNorm = (fieldVal - rangeStart) / (rangeEnd - rangeStart)
    return COLOR_INTERPOLATOR(fieldValNorm)
  }
}

const makeCatColorFunc = (range, field) => {
  return (item) => {
    const fieldVal = _get(item, field, null)
    if (fieldVal === null) {
      return NULL_COLOR
    }
    const palette = d3ScaleChromatic.schemeCategory10
    return palette[range.indexOf(fieldVal)]
  }
}

const makeMultiCatColorFunc = (range, field) => {
  return (item) => {
    const fieldVal = _get(item, field, null)
    if (fieldVal === null) {
      return NULL_COLOR
    }
    const fieldValNorm = range.indexOf(fieldVal) / (range.length - 1)
    return COLOR_INTERPOLATOR(fieldValNorm)
  }
}

const makeColorFunc = (data, field, order) => {
  let colorFunc = (val) => null;
  if (!field) return colorFunc;

  const fieldVals = data.map(item => _get(item, field, null));
  const fieldRange = [...new Set(fieldVals)]
    .filter(item => item !== null);
  const fieldRangeSorted = sortNullsLast(fieldRange, null, order);
  // Field considered non-numeric if at least one non-numeric value found
  const numericScale = fieldRangeSorted.find(item => isNaN(item)) === undefined;
  if (numericScale) {
    colorFunc = makeContiColorFunc(fieldRangeSorted, field);
  } else if (fieldRangeSorted.length < 10) {
    colorFunc = makeCatColorFunc(fieldRangeSorted, field);
  } else {
    colorFunc = makeMultiCatColorFunc(fieldRangeSorted, field);
  }
  return colorFunc;
}

const addOpacity = (color, opacity) => {
  const rgbColor = d3Color.rgb(color);
  rgbColor.opacity = opacity;
  return rgbColor.rgb();
}

export { makeColorFunc, addOpacity }