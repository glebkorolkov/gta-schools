import React from 'react'
import _get from 'lodash.get'

import './App.scss'
import SchoolMap from './components/SchoolMap'
import SchoolList from './components/SchoolList'
import ControlPanel from './components/ControlPanel'
import {sortNullsLast, makeColorFunc} from './utils'



class App extends React.Component {

  narrowThreshold = 1012
  superNarrowThreshold = 769

  constructor(props) {
    super(props)
    this.state = {
      schools: [],
      focusedSchoolId: null,
      filters: null,
      controls: {},
      narrow: false,
      superNarrow: false
    }
    this.appDiv = null
    this.resizeObserverSet = false;
    this.adjustLookOnResize = this.adjustLookOnResize.bind(this)
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
    this.setResizeObserver();
  }

  componentDidUpdate() {
    this.setResizeObserver();
  }

  setResizeObserver() {
    if (this.appDiv && !this.resizeObserverSet) {
      const resizeObserver = new ResizeObserver(this.adjustLookOnResize);
      resizeObserver.observe(this.appDiv);
      this.resizeObserverSet = true;
    }
  }

  adjustLookOnResize(resizeEvent) {
    const width = resizeEvent[0].borderBoxSize[0].inlineSize;
    const isNarrow = width < this.narrowThreshold;
    const isSuperNarrow = width < this.superNarrowThreshold;
    if ((isNarrow !== this.state.narrow) || (isSuperNarrow !== this.state.superNarrow)) {
      this.setState({ narrow: isNarrow });
      this.setState({ superNarrow: isSuperNarrow });
    }
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
    const cardWidth = this.state.superNarrow ? 'xs' : this.state.narrow ? 's' : 'm'
    return (
      <React.Fragment>
        <div className={'map-wrapper' + (!mapView ? ' is-hidden' : '')}>
          <SchoolMap
            schools={this.getFilteredSchools()}
            colorFunc={this.makeColorFunc()}
            focusedSchoolId={this.state.focusedSchoolId}
            cardWidth={cardWidth}
          />
        </div>
        <div className={'list-wrapper' + (mapView ? ' is-hidden' : '')}>
          <SchoolList
            schools={this.getFilteredSchools()}
            sortFunc={this.makeSortFunc()}
            pageSize={this.state.controls.pageSize}
            onFocusClick={this.handleFocusClick}
            cardWidth={cardWidth}
          />
        </div>
      </React.Fragment>
    )
  }

  render() {
    return (
      <div className="app" ref={(elem) => this.appDiv = elem}>
        <ControlPanel
          onFilterChange={this.handleFilterChange}
          onControlChange={this.handleControlChange}
          displayMode={this.state.controls ? this.state.controls.display : null}
          collapsed={this.state.narrow} />
        {this.renderSchools()}
      </div>
    );
  }
}

export default App;