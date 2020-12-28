import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import './ControlPanel.scss'

import MultiCheckbox from '../MultiCheckbox'
import ButtonToggle from '../ButtonToggle'
import InlineControl from '../InlineControl'
import Control from '../Control'


export default class ControlPanel extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      schoolTypes: ['Elementary', 'Secondary'],
      defaults: {
        display: ['Map', 'List'],
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
    this.handleDisplayControl = this.handleDisplayControl.bind(this)
    this.updateFilters = this.updateFilters.bind(this)
    this.selectedValsFromMultiCheckBoxFields = this.selectedValsFromMultiCheckBoxFields.bind(this)
    this.handleSchoolTypeFilter = this.handleSchoolTypeFilter.bind(this)
    this.handleSchoolBoardFilter = this.handleSchoolBoardFilter.bind(this)
  }

  toggle() {
    this.setState({collapsed: !this.state.collapsed})
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
    this.updateFilters('type', includeVals)
  }

  handleSchoolBoardFilter(fields) {
    const includeVals = this.selectedValsFromMultiCheckBoxFields(fields)
    this.updateFilters('school_board', includeVals)
  }

  handleDisplayControl(option) {
    let updatedControls = this.state.controls
    updatedControls.display = option
    this.setState({ controls: updatedControls })
    this.props.onControlChange(this.state.controls)
  }

  render() {
    const displayToggle =
      <ButtonToggle
        options={this.state.defaults.display}
        onChange={this.handleDisplayControl}
      />
    const schoolTypeMultiCheckbox = 
      <MultiCheckbox
        fields={this.state.defaults.schoolTypes}
        onChange={this.handleSchoolTypeFilter}
      />
    const schoolBoardMultiCheckbox =
      <MultiCheckbox
        fields={this.state.defaults.schoolBoards}
        onChange={this.handleSchoolBoardFilter}
      />
    const renderFilters = () => {
      if (!this.state.collapsed) {
        return (
          <div>
            <h3 className="title is-3">Controls</h3>
            <InlineControl label="Display" control={ displayToggle } />
            <Control label="School Type" control={ schoolTypeMultiCheckbox }/>
            <Control label="School Board" control={ schoolBoardMultiCheckbox }/>
          </div>
        )
      }
    }
    return (
      <div className={ 'ControlPanel' + (this.state.collapsed ? ' collapsed' : '') }>
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
