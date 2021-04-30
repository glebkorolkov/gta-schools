import React from 'react'
import ReactGA from 'react-ga'
import _get from 'lodash.get'

import './App.scss'
import SchoolMap from './components/SchoolMap'
import SchoolList from './components/SchoolList'
import ControlPanel from './components/ControlPanel'
import AboutPage from './components/AboutPage'
import {sortNullsLast, makeColorFunc, callInProd} from './utils'
import regionalSettings from './regional_settings'


class App extends React.Component {

  narrowThreshold = 1012
  superNarrowThreshold = 769

  constructor(props) {
    super(props)
    this.region = process.env.REACT_APP_REGION || 'gta'
    this.state = {
      mapCenter: regionalSettings[this.region].center,
      schools: [],
      updateDate: null,
      focusedSchoolId: null,
      filters: null,
      controls: {},
      narrow: false,
      superNarrow: false,
      aboutActive: false,
      paypalNo: null
    }
    this.appDiv = null
    this.resizeObserverSet = false;
    this.adjustLookOnResize = this.adjustLookOnResize.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleControlChange = this.handleControlChange.bind(this)
    this.handleFocusClick = this.handleFocusClick.bind(this)
    this.handleAboutOpen = this.handleAboutOpen.bind(this)
    this.handleAboutClose = this.handleAboutClose.bind(this)
    this.renderSchools = this.renderSchools.bind(this)
  }

  componentDidMount() {
    const schoolFile = regionalSettings[this.region].dataFile
    fetch(schoolFile)
      .then(res => res.json())
      .then(res => {
        this.setState({ updateDate: res.last_updated })
        return res.schools
      })
      .then(schools => {
        schools.forEach((school, i) => {
          school._id = i + 1
          school._year = school.year < 1900 ? 1900 : school.year
        })
        this.setState({ schools: schools })
      })
    this.setResizeObserver();
    callInProd(ReactGA.initialize, [process.env.REACT_APP_GA_TRACKING_ID, { debug: false }])
    callInProd(ReactGA.pageview, [window.location.pathname + window.location.search])
    this.setState({ paypalNo: process.env.REACT_APP_PAYPAL_NO })
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
    const width = resizeEvent[0].contentRect.width;
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

  handleAboutOpen() {
    this.setState({ aboutActive: true });
    callInProd(ReactGA.event, [{category: 'User', action: 'Open About'}])
  }

  handleAboutClose() {
    this.setState({aboutActive: false});
  }

  renderSchools() {
    const mapView = !this.state.controls.display || this.state.controls.display === 'map'
    const cardWidth = this.state.superNarrow ? 'xs' : this.state.narrow ? 's' : 'm'
    return (
      <React.Fragment>
        <div className={'map-wrapper' + (!mapView ? ' is-hidden' : '')}>
          <SchoolMap
            initCenter={this.state.mapCenter}
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
      <React.Fragment>
        <div
          className={'app' + (this.state.aboutActive ? ' is-hidden' : '')}
          ref={(elem) => this.appDiv = elem} >
          <ControlPanel
            onFilterChange={this.handleFilterChange}
            onControlChange={this.handleControlChange}
            onAboutClick={this.handleAboutOpen}
            displayMode={this.state.controls ? this.state.controls.display : null}
            collapsed={this.state.narrow}
            schoolBoards={regionalSettings[this.region].schoolBoards}
          />
          {this.renderSchools()}
        </div>
        <AboutPage
          region={this.region}
          className={!this.state.aboutActive ? ' is-hidden' : null}
          onClose={this.handleAboutClose}
          updateDate={this.state.updateDate}
          paypalNo={this.state.paypalNo}
        />
      </React.Fragment>
    );
  }
}

export default App;