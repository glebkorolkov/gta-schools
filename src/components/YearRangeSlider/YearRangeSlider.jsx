import React from 'react'
import PropTypes from 'prop-types'
import Slider from '@material-ui/core/Slider'
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import _debounce from 'lodash.debounce'

import './YearRangeSlider.scss'


const YearRangeSlider = (props) => {

  const [data, setData] = React.useState({value: props.initRange, showNa: props.naToggle})
  const [initData] = React.useState({value: props.initRange, showNa: props.naToggle})

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

  const {onChange} = props
  React.useEffect(() => {
    onChange({range: initData.value, showNa: initData.showNa})
  }, [initData, onChange])

  const handleChange = (event, val) => {
    setData({...data, value: val})
    const payload = {range: data.value, showNa: data.showNa}
    reportRangeDebounced.current(payload)
  }

  const handleNaToggleChange = (event) => {
    const checked = event.target.checked
    setData({ ...data, showNa: checked })
    reportRange({ range: data.value, showNa: checked })
  }

  const renderNaToggle = () => {
    if (props.naToggle === true || props.naToggle === false) {
      const naSwitch = <Switch
        color="primary"
        size="small"
        checked={ data.showNa }
        onChange={ handleNaToggleChange }
      />
      return (
        <FormControlLabel
          control={ naSwitch }
          label = "Include schools without year"
        />
      )
    }
  }

  return (
    <div className="range-slider">
      <div className="px-3">
        <Slider
          className="mb-2"
          value={data.value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          min={minRange}
          max={maxRange}
          marks={yearMarks}
        />
        { renderNaToggle() }
      </div>
    </div>
  )
}


YearRangeSlider.propTypes = {
  initRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  increment: PropTypes.number,
  shortLabel: PropTypes.bool,
  naToggle: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  debounce: PropTypes.number
}


export default YearRangeSlider