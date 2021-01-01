import React from 'react'
import PropTypes from 'prop-types'
import Slider from '@material-ui/core/Slider'
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import _debounce from 'lodash.debounce'

import './RangeSlider.scss'


const RangeSlider = (props) => {

  const [data, setData] = React.useState({value: props.initRange, showNa: props.naToggle})
  const [initData] = React.useState({value: props.initRange, showNa: props.naToggle})

  const fullRange = props.fullRange || props.initRange
  const minRange = fullRange[0]
  const maxRange = fullRange[1]


  const increment = props.increment
  let marks = null
  if (increment) {
    const numMarks = parseInt((maxRange - minRange) / increment) + 1
    const markVals = Array.from({ length: numMarks }, (v, i) => i * increment + minRange)
    const makeLabel = props.labelFormattingFunc || (y => y.toString())
    marks = markVals.map(val => { return { value: val, label: makeLabel(val) } })
  }

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
          control={naSwitch}
          label={props.naToggleLabel || 'Include null values'}
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
          marks={marks}
        />
        { renderNaToggle() }
      </div>
    </div>
  )
}


RangeSlider.propTypes = {
  initRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  fullRange: PropTypes.arrayOf(PropTypes.number),
  increment: PropTypes.number,
  labelFormattingFunc: PropTypes.func,
  naToggle: PropTypes.bool,
  naToggleLabel: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  debounce: PropTypes.number
}


export default RangeSlider