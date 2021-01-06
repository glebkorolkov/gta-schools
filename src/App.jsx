import React from 'react'
import _get from 'lodash.get'

import './App.scss'
import SchoolMap from './components/SchoolMap'
import SchoolList from './components/SchoolList'
import ControlPanel from './components/ControlPanel'
import MobilePlug from './components/MobilePlug'
import {sortNullsLast, makeColorFunc} from './utils'



class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      schools: [],
      focusedSchoolId: null,
      filters: null,
      controls: {}
    }
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleControlChange = this.handleControlChange.bind(this)
    this.handleFocusClick = this.handleFocusClick.bind(this)
    this.renderSchools = this.renderSchools.bind(this)
  }

  componentDidMount() {
    fetch("schools.json")
      .then(res => res.json())
      .then(schools => {
        schools.forEach((school, i) => {school['id'] = i + 1})
        this.setState({ schools: schools })
      })
  }

  getFilteredSchools() {
    if (!this.state.filters)
      return []
    let schools = this.state.schools
    for (const key in this.state.filters) {
      const filterFunc = this.state.filters[key]
      schools = schools.filter(school => filterFunc(_get(school, key, null)))
    }
    return schools
  }

  makeColorFunc() {
    return makeColorFunc(
      this.state.schools,
      this.state.controls.sortBy,
      this.state.controls.sortByOrder
    )
  }

  makeSortFunc() {
    const field = this.state.controls.sortBy
    const order = this.state.controls.sortByOrder
    return (collection) => sortNullsLast(collection, field, order)
  }

  handleFilterChange(filters) {
    this.setState({ filters: filters })
  }

  handleControlChange(controls) {
    this.setState({ controls: controls })
  }

  handleFocusClick(schoolId) {
    let controls = this.state.controls
    if (controls.display !== 'map') {
      controls.display = 'map'
      this.setState({controls: controls})
    }
    this.setState({ focusedSchoolId: schoolId })
  }

  renderSchools() {
    const mapView = !this.state.controls.display || this.state.controls.display === 'map'
    return (
      <React.Fragment>
        <div className={!mapView ? 'is-hidden' : null}>
          <SchoolMap
            schools={this.getFilteredSchools()}
            colorFunc={this.makeColorFunc()}
            focusedSchoolId={this.state.focusedSchoolId}
          />
        </div>
        <div className={mapView ? 'is-hidden' : null}>
          <SchoolList
            className={mapView ? 'is-hidden' : null}
            schools={this.getFilteredSchools()}
            sortFunc={this.makeSortFunc()}
            pageSize={this.state.controls.pageSize}
            onFocusClick={this.handleFocusClick}
          />
        </div>
      </React.Fragment>
    )
  }

  render() {
    return (
      <React.Fragment>
        <div className="app is-hidden-mobile">
          <ControlPanel
            onFilterChange={this.handleFilterChange}
            onControlChange={this.handleControlChange}
            displayMode={this.state.controls ? this.state.controls.display : null} />
          {this.renderSchools()}
        </div>
        <div className="is-hidden-tablet mobile-plug-container">
          <MobilePlug />
        </div>
      </React.Fragment>
    );
  }
}

export default App;