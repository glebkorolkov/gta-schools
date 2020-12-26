import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import './ControlPanel.scss'

import MultiCheckbox from '../MultiCheckbox'


export default class ControlPanel extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      schoolTypes: ['Elementary', 'Senior']
    }
    this.toggle = this.toggle.bind(this)
    this.handleSchoolTypeFilter = this.handleSchoolTypeFilter.bind(this)
  }

  toggle() {
    this.setState({collapsed: !this.state.collapsed})
  }

  handleSchoolTypeFilter(fields) {
    console.log(fields)
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
