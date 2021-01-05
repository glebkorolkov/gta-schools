import * as d3Color from 'd3-color';
import * as d3Interpolate from 'd3-interpolate';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import _get from 'lodash.get';


const NULL_COLOR = 'gray'
const COLOR_INTERPOLATOR = d3Interpolate.piecewise(
  d3Interpolate.interpolateRgb.gamma(2.2),
  ["red", "orange", "green"]
)


const makeContiColorFunc = (range, field) => {
  const sortedRange = range.sort((a, b) => {
    if (a < b) return -1;
    else if (a > b) return 1;
    return 0;
  })
  const rangeStart = sortedRange[0]
  const rangeEnd = sortedRange[sortedRange.length - 1]
  return (item) => {
    const fieldVal = _get(item, field, null)
    if (fieldVal === null)
      return NULL_COLOR
    const fieldValNorm = (fieldVal - rangeStart) / (rangeEnd - rangeStart)
    return COLOR_INTERPOLATOR(fieldValNorm)
  }
}

const makeCatColorFunc = (range, field) => {
  const sortedRange = range.sort()
  return (item) => {
    const fieldVal = _get(item, field, null)
    if (fieldVal === null) {
      return NULL_COLOR
    }
    const palette = d3ScaleChromatic.schemeCategory10
    return palette[sortedRange.indexOf(fieldVal)]
  }
}

const makeMultiCatColorFunc = (range, field) => {
  const sortedRange = range.sort()
  return (item) => {
    const fieldVal = _get(item, field, null)
    if (fieldVal === null) {
      return NULL_COLOR
    }
    const fieldValNorm = sortedRange.indexOf(fieldVal) / (sortedRange.length - 1)
    return COLOR_INTERPOLATOR(fieldValNorm)
  }
}

const makeColorFunc = (data, field) => {
  let colorFunc = (val) => null
  if (!field)
    return colorFunc
  const fieldVals = data.map(item => _get(item, field, null))
  const fieldRange = [...new Set(fieldVals)]
    .filter(item => item !== null)
  // Field considered non-numeric if at least one non-numeric value found
  const numericScale = fieldRange.find(item => isNaN(item)) === undefined
  if (numericScale)
    colorFunc = makeContiColorFunc(fieldRange, field)
  else if (fieldRange.length < 10)
    colorFunc = makeCatColorFunc(fieldRange, field)
  else
    colorFunc = makeMultiCatColorFunc(fieldRange, field)
  return colorFunc
}

const addOpacity = (color, opacity) => {
  const rgbColor = d3Color.rgb(color);
  rgbColor.opacity = opacity;
  return rgbColor.rgb();
}

export { makeColorFunc, addOpacity }