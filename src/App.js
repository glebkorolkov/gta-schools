import React from 'react'
import _get from 'lodash.get'

import './App.scss'
import SchoolMap from './components/SchoolMap'
import ControlPanel from './components/ControlPanel'
import {makeColorFunc} from './utils/color'


class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      schools: [],
      filters: null,
      controls: {}
    }
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleControlChange = this.handleControlChange.bind(this)
    this.renderSchools = this.renderSchools.bind(this)
  }

  componentDidMount() {
    fetch("schools.json")
      .then(res => res.json())
      .then(schools => {
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
    return makeColorFunc(this.state.schools, this.state.controls.sortBy)
  }

  handleFilterChange(filters) {
    this.setState({ filters: filters })
  }

  handleControlChange(controls) {
    this.setState({ controls: controls })
  }

  renderSchools() {
    if (this.state.controls.display === 'map')
      return (
        <SchoolMap
          zoom={12}
          schools={this.getFilteredSchools()}
          colorFunc={this.makeColorFunc()}
        />
      )
    else
      return <p>List placeholder</p>
  }

  render() {
    return (
      <div className="App">
        <ControlPanel
          onFilterChange={this.handleFilterChange}
          onControlChange={this.handleControlChange} />
        { this.renderSchools() }
      </div>
    );
  }
}

export default App;