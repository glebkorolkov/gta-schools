import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import './ControlPanel.scss'

import MultiCheckbox from '../MultiCheckbox'


export default class ControlPanel extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      schoolTypes: ['Elementary', 'Senior'],
      filters: {}
    }
    this.toggle = this.toggle.bind(this)
    this.handleSchoolTypeFilter = this.handleSchoolTypeFilter.bind(this)
  }

  toggle() {
    this.setState({collapsed: !this.state.collapsed})
  }

  handleSchoolTypeFilter(fields) {
    const includeVals = fields
      .filter(field => field.checked)
      .map(field => field.label)
    let updatedFilters = this.state.filters
    updatedFilters.school_type = includeVals
    this.setState({filters: updatedFilters})
    this.props.onChange(this.state.filters)
  }

  render() {
    const renderFilters = () => {
      if (!this.state.collapsed) {
        return (
          <div>
            <h3 className="title is-3">Filters</h3>
            <h5 className="title is-6 filter-title">School Type</h5>
            <MultiCheckbox
              fields={ this.state.schoolTypes.map(schType => ({label: schType, checked: true})) }
              onChange={ this.handleSchoolTypeFilter }
            />
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
  onChange: PropTypes.func
}
