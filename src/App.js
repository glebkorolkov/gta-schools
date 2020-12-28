import React from 'react'
import './App.scss'
import SchoolMap from './components/SchoolMap'
import ControlPanel from './components/ControlPanel'


class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      schools: [],
      filters: null,
      display: 'map'
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

  handleFilterChange(filters) {
    this.setState({ filters: filters })
  }

  handleControlChange(controls) {
    const displayType = controls.display.toLowerCase()
    this.setState({ display: displayType })
  }

  renderSchools() {
    if (this.state.display == 'map')
      return <SchoolMap zoom={12} schools={this.getFilteredSchools()} />
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