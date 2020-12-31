import * as d3 from "d3-scale-chromatic"

const NULL_COLOR = 'gray'

const makeContiColorFunc = (range, field) => {
  const rangeStart = range[0]
  const rangeEnd = range[range.length - 1]
  return (item) => {
    const fieldVal = item[field]
    if (fieldVal === null)
      return NULL_COLOR
    const fieldValNorm = (fieldVal - rangeStart) / (rangeEnd - rangeStart)
    return d3.interpolateWarm(fieldValNorm)
  }
}

const makeCatColorFunc = (range, field) => {
  return (item) => {
    const fieldVal = item[field]
    if (fieldVal === null) {
      return NULL_COLOR
    }
    return d3.schemeCategory10[range.indexOf(fieldVal)]
  }
}

const makeMultiCatColorFunc = (range, field) => {
  return (item) => {
    const fieldVal = item[field]
    if (fieldVal === null) {
      return NULL_COLOR
    }
    const fieldValNorm = range.indexOf(fieldVal) / (range.length - 1)
    return d3.interpolateWarm(fieldValNorm)
  }
}

const makeColorFunc = (data, field) => {
  let colorFunc = (val) => null
  if (!field)
    return colorFunc
  const fieldVals = data.map(item => item[field])
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


export { makeColorFunc }