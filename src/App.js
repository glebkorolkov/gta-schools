import React from 'react'
import './App.scss'
import SchoolMap from './components/SchoolMap'
import ControlPanel from './components/ControlPanel'
import * as d3 from "d3-scale-chromatic"


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
      const vals = this.state.filters[key]
      schools = schools.filter(school => vals.includes(school[key]))
    }
    return schools
  }

  makeColorFunc() {
    const nullColor = 'gray'
    let colorFunc = (val) => null
    const field = this.state.controls.sortBy
    if (!field) return colorFunc
    const fieldVals = this.state.schools.map(school => school[field])
    const fieldRange = [...new Set(fieldVals)]
      .sort()
      .filter(item => item !== null)
    const numericScale = fieldRange.find(item => isNaN(item)) === undefined
    if (numericScale) {
      colorFunc = (school) => {
        const fieldVal = school[field]
        if (fieldVal === null)
          return nullColor
        const fieldValNorm = (fieldVal - fieldRange[0]) / fieldRange[1]
        return d3.interpolateRdYlGn(fieldValNorm)
      }
    } else {
      colorFunc = (school) => {
        const fieldVal = school[field]
        if (fieldVal === null) {
          console.log(school.name)
          return nullColor
        }
        const fieldValNorm = fieldRange.indexOf(fieldVal) / (fieldRange.length - 1)
        return d3.interpolateRdYlGn(fieldValNorm)
      }
    }
    return colorFunc
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