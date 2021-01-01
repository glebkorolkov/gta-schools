import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import './ControlPanel.scss'

import Control from '../Control'
import InlineControl from '../InlineControl'
import MultiCheckbox from '../MultiCheckbox'
import ButtonToggle from '../ButtonToggle'
import SingleSelect from '../SingleSelect'
import YearRangeSlider from '../YearRangeSlider'


export default class ControlPanel extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      defaults: {
        display: [
          {label: 'Map', value: 'map', selected: true},
          {label: 'List', value: 'list', selected: false}
        ],
        sortBy: [
          {label: 'School Type', value: 'type'},
          {label: 'School Board', value: 'school_board'},
          {label: 'Year', value: 'year'},
          {label: 'Fraser Rank', value: 'fraser.rank'},
          {label: 'Fraser Score', value: 'fraser.score'}
        ],
        schoolTypes: [
          {label: 'Elementary', checked: true},
          {label: 'Secondary', checked: true}
        ],
        schoolBoards: [
          { label: 'Toronto DSB', checked: true, value: 'TDSB' },
          { label: 'York Region DSB', checked: false, value: 'YRDSB' }
        ]
      },
      filters: {},
      controls: {}
    }
    this.toggle = this.toggle.bind(this)
    this.isMap = this.isMap.bind(this)
    this.handleDisplayControl = this.handleDisplayControl.bind(this)
    this.handleSortByControl = this.handleSortByControl.bind(this)
    this.updateFilters = this.updateFilters.bind(this)
    this.updateControls = this.updateControls.bind(this)
    this.selectedValsFromMultiCheckBoxFields = this.selectedValsFromMultiCheckBoxFields.bind(this)
    this.handleSchoolTypeFilter = this.handleSchoolTypeFilter.bind(this)
    this.handleSchoolBoardFilter = this.handleSchoolBoardFilter.bind(this)
    this.handleYearChange = this.handleYearChange.bind(this)
  }

  toggle() {
    this.setState({collapsed: !this.state.collapsed})
  }

  isMap() {
    return this.state.controls.display && this.state.controls.display.toLowerCase() === 'map'
  }

  selectedValsFromMultiCheckBoxFields(fields) {
    return fields
      .filter(field => field.checked)
      .map(field => (field.value || field.label))
  }

  updateFilters(key, val) {
    let updatedFilters = this.state.filters
    updatedFilters[key] = val
    this.setState({ filters: updatedFilters })
    this.props.onFilterChange(this.state.filters)
  }

  handleSchoolTypeFilter(fields) {
    const includeVals = this.selectedValsFromMultiCheckBoxFields(fields)
    this.updateFilters('type', val => includeVals.includes(val))
  }

  handleSchoolBoardFilter(fields) {
    const includeVals = this.selectedValsFromMultiCheckBoxFields(fields)
    this.updateFilters('school_board', val => includeVals.includes(val))
  }

  updateControls(key, val) {
    let updatedControls = this.state.controls
    updatedControls[key] = val
    this.setState({ controls: updatedControls })
    this.props.onControlChange(this.state.controls)
  }

  handleDisplayControl(fields) {
    const selectedVals = fields
      .filter(field => field.selected)
      .map(field => (field.value || field.label))
    const selectedVal = selectedVals[0] || null
    this.updateControls('display', selectedVal)
  }

  handleSortByControl(selectedValue) {
    this.updateControls('sortBy', selectedValue)
  }

  handleYearChange(payload) {
    const { range, showNa } = payload
    this.updateFilters('year', val => {
      const isBetween = (val <= range[range.length - 1] && val >= range[0])
      const isNull = (val === null)
      return showNa ? isBetween || isNull : isBetween
    })
  }

  render() {
    const renderFilters = () => {
      return (
        <div className={this.state.collapsed ? 'is-hidden' : null}>
          <h3 className="title is-3">Controls</h3>
          <InlineControl label="Display">
            <ButtonToggle
              fields={this.state.defaults.display}
              onChange={this.handleDisplayControl}
            />
          </InlineControl>
          <InlineControl label={this.isMap() ? 'Color by' : 'Sort by'}>
            <SingleSelect
              fields={this.state.defaults.sortBy}
              onChange={this.handleSortByControl}
            />
          </InlineControl>
          <Control label="School Type">
            <MultiCheckbox
              fields={this.state.defaults.schoolTypes}
              onChange={this.handleSchoolTypeFilter}
            />
          </Control>
          <Control label="School Board">
            <MultiCheckbox
              fields={this.state.defaults.schoolBoards}
              onChange={this.handleSchoolBoardFilter}
            />
          </Control>
          <Control label="Year">
            <YearRangeSlider
              initRange={[1900, 2021]}
              increment={10}
              naToggle={true}
              onChange={this.handleYearChange}
            />
          </Control>
        </div>
      )
    }
    return (
      <div className={'ControlPanel' + (this.state.collapsed ? ' collapsed' : '')}>
        <div className="column">
          { renderFilters() }
          <FontAwesomeIcon
            className="toggle"
            icon={this.state.collapsed ? faAngleDoubleRight : faAngleDoubleLeft}
            onClick={this.toggle} />
        </div>
      </div>
    )
  }
}


ControlPanel.propTypes = {
  onFilterChange: PropTypes.func,
  onControlChange: PropTypes.func
}
