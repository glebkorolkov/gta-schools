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
        ]
      },
      filters: {},
      controls: {}
    }
    this.toggle = this.toggle.bind(this)
    this.handleSchoolTypeFilter = this.handleSchoolTypeFilter.bind(this)
    this.handleDisplayControl = this.handleDisplayControl.bind(this)
  }

  toggle() {
    this.setState({collapsed: !this.state.collapsed})
  }

  handleSchoolTypeFilter(fields) {
    const includeVals = fields
      .filter(field => field.checked)
      .map(field => field.label)
    let updatedFilters = this.state.filters
    updatedFilters.type = includeVals
    this.setState({filters: updatedFilters})
    this.props.onFilterChange(this.state.filters)
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
    const renderFilters = () => {
      if (!this.state.collapsed) {
        return (
          <div>
            <h3 className="title is-3">Controls</h3>
            <InlineControl label="Display" control={ displayToggle } />
            <Control label="School Type" control={ schoolTypeMultiCheckbox }/>
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
