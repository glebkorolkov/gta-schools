import * as d3 from "d3-scale-chromatic";
import * as d3Color from 'd3-color';
import _get from 'lodash.get'


const NULL_COLOR = 'gray'

const makeContiColorFunc = (range, field) => {
  const rangeStart = range[0]
  const rangeEnd = range[range.length - 1]
  return (item) => {
    const fieldVal = _get(item, field, null)
    if (fieldVal === null)
      return NULL_COLOR
    const fieldValNorm = (fieldVal - rangeStart) / (rangeEnd - rangeStart)
    const lowerAdj = 0.4
    const fieldValAdj = fieldValNorm * (1 - lowerAdj) + lowerAdj
    return d3.interpolateWarm(fieldValAdj)
  }
}

const makeCatColorFunc = (range, field) => {
  return (item) => {
    const fieldVal = _get(item, field, null)
    if (fieldVal === null) {
      return NULL_COLOR
    }
    return d3.schemeCategory10[range.indexOf(fieldVal)]
  }
}

const makeMultiCatColorFunc = (range, field) => {
  return (item) => {
    const fieldVal = _get(item, field, null)
    if (fieldVal === null) {
      return NULL_COLOR
    }
    const fieldValNorm = range.indexOf(fieldVal) / (range.length - 1)
    const lowerAdj = 0.4
    const fieldValAdj = fieldValNorm * (1 - lowerAdj) + lowerAdj
    return d3.interpolateWarm(fieldValAdj)
  }
}

const makeColorFunc = (data, field) => {
  let colorFunc = (val) => null
  if (!field)
    return colorFunc
  const fieldVals = data.map(item => _get(item, field, null))
  const fieldRange = [...new Set(fieldVals)]
    .sort()
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