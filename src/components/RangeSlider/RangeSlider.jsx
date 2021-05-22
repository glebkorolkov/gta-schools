import React from 'react'
import PropTypes from 'prop-types'
import Slider from '@material-ui/core/Slider'
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import _debounce from 'lodash.debounce'

import './RangeSlider.scss'


export default class RangeSlider extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      value: props.initRange,
      toggles: props.toggles.map(item => item.toggled)
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleToggleChange = this.handleToggleChange.bind(this)
    this.onChangeDebounced = _debounce(props.onChange, props.debounce || 1000)
  }

  componentDidMount() {
    const payload = {
      range: this.props.initRange,
      toggles: this.props.toggles.map(item => item.toggled)
    }
    this.props.onChange(payload)
  }

  makeReportRangeDebounced() {
    const reportRange = (val) => this.props.onChange(val)
    const debounceMs = this.props.debounce || 1000
    return _debounce(reportRange, debounceMs)
  }

  handleChange(event, val) {
    this.setState({value: val})
    const payload = {range: val, toggles: this.state.toggles}
    this.onChangeDebounced(payload)
  }

  handleToggleChange(event, i) {
    const toggles = [...this.state.toggles]
    toggles[i] = event.target.checked
    this.setState({ toggles: toggles })
    const payload = { range: this.state.value, toggles: toggles }
    this.props.onChange(payload)
  }

  renderToggle(toggle, i) {
    const toggleSwitch = <Switch
      color="primary"
      size="small"
      checked={ this.state.toggles[i] }
      onChange={ event => this.handleToggleChange(event, i) }
    />
    return (
      <FormControlLabel
        control={toggleSwitch}
        label={toggle.label || 'On/Off'}
        key={i}
      />
    )
  }

  render() {
    const fullRange = this.props.fullRange || this.props.initRange
    const minRange = fullRange[0]
    const maxRange = fullRange[1]
    const increment = this.props.increment
    let marks = null
    if (increment) {
      const numMarks = parseInt((maxRange - minRange) / increment) + 1
      const markVals = Array.from({ length: numMarks }, (v, i) => i * increment + minRange)
      const makeLabel = this.props.labelFormattingFunc || (y => y.toString())
      marks = markVals.map(val => { return { value: val, label: makeLabel(val) } })
    }
    return (
      <div className="range-slider">
        <div className="px-3">
          <Slider
            className="mb-1"
            value={this.state.value}
            onChange={this.handleChange}
            valueLabelDisplay="auto"
            min={minRange}
            max={maxRange}
            marks={marks}
            step={this.props.step}
          />
          { this.props.toggles.map((toggle, i) => this.renderToggle(toggle, i)) }
        </div>
      </div>
    )
  }

}


RangeSlider.propTypes = {
  initRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  fullRange: PropTypes.arrayOf(PropTypes.number),
  increment: PropTypes.number,
  step: PropTypes.number,
  labelFormattingFunc: PropTypes.func,
  toggles: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
  debounce: PropTypes.number
}
