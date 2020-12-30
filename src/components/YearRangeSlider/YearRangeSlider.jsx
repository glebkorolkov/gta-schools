import React from 'react'
import PropTypes from 'prop-types'
import Slider from '@material-ui/core/Slider'

import _debounce from 'lodash.debounce'

import './YearRangeSlider.scss'


const YearRangeSlider = (props) => {

  const [value, setValue] = React.useState(props.initRange)

  const round5Up = x => Math.ceil(x / 5) * 5
  const round5Down = x => Math.floor(x / 5) * 5

  const minRange = round5Down(props.initRange[0])
  const maxRange = round5Up(props.initRange[1])

  const increment = props.increment || 10

  const numYears = parseInt((maxRange - minRange) / increment) + 1
  const markYears = Array.from({ length: numYears }, (v, i) => i * increment + minRange)
  const makeShortLabel = year => `'${("00" + (year % 100)).substr(-2, 2)}`
  const makeLabel = props.shortLabel ? makeShortLabel : (y) => y.toString()
  const yearMarks = markYears.map(year => { return { value: year, label: makeLabel(year) } })

  const reportRange = (val) => props.onChange(val)
  const debounceMs = props.debounce || 1000
  const reportRangeDebounced = React.useRef(_debounce(reportRange, debounceMs))

  const handleChange = (event, val) => {
    setValue(val)
    reportRangeDebounced.current(val)
  }

  return (
    <div className="range-slider px-3">
      <Slider
        className="range-slider"
        value={ value }
        onChange={ handleChange }
        valueLabelDisplay="auto"
        min={ minRange }
        max={ maxRange }
        marks={ yearMarks }
      />
    </div>
  )
}


YearRangeSlider.propTypes = {
  initRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  increment: PropTypes.number,
  shortLabel: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  debounce: PropTypes.number
}


export default YearRangeSlider