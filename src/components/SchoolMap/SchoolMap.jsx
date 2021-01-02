import React from 'react'
import PropTypes from 'prop-types'
import {Marker, Polygon, GoogleApiWrapper} from 'google-maps-react'
import './SchoolMap.css'

import SchoolCard from '../SchoolCard'
import {MapWrapper} from './MapWrapper'


const SCHOOL_AREA_DEFAULT_COLOR = 'green'


export class GoogleMapContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedSchool: null
    }
    this.defaultZoom = 14
    this.handleMarkerClick = this.handleMarkerClick.bind(this)
    this.handleMapClick = this.handleMapClick.bind(this)
    this.renderBoundaries = this.renderBoundaries.bind(this)
  }

  componentDidUpdate(prevProps) {
    const selectedSchool = this.state.selectedSchool
    const isThatSchool = (school, refSchool) => (
        school.school_board === refSchool.school_board &&
        school.name === refSchool.name)
    if (selectedSchool &&
        !this.props.schools.find(school => isThatSchool(school, selectedSchool))) {
      this.setState({selectedSchool: null})
    }
  }

  buildColor(school) {
    const defaultColor = '#FF0000'
    return this.props.colorFunc(school) || defaultColor
  }

  handleMarkerClick(school) {
    this.setState({selectedSchool: school})
  }

  handleMapClick() {
    this.setState({selectedSchool: null})
  }

  renderBoundaries() {
    const school = this.state.selectedSchool
    if (!school || !school.boundaries) return ''
    const prepPaths = 
      (path) => path.map(
        segm => segm.map(
          p => ({lat: p.lat, lng: p.lon})
        )
      )
    const color = SCHOOL_AREA_DEFAULT_COLOR
    return (
      [<Polygon
        key="Catchment area"
        title={`${school.name} catchment area`}
        paths={prepPaths(school.boundaries)}
        strokeColor={color}
        strokeOpacity={0.8}
        strokeWeight={2}
        fillColor={color}
        fillOpacity={0.2}
      />]
    )
  }

  render() {
    return (
      <div className="school-map-container">
        <MapWrapper
          google={this.props.google}
          zoom={this.props.zoom || this.defaultZoom}
          className="school-map"
          initialCenter={{
            lat: 43.741667,
            lng: -79.373333
          }}
          containerStyle={{ position: "relative", height: "100%", width: "100%" }}
          mapTypeControl={false}
          streetViewControl={true}
          fullscreenControl={false}
          streetViewControlOptions={{position: this.props.google.maps.ControlPosition.RIGHT_TOP}}
          zoomControlOptions={{position: this.props.google.maps.ControlPosition.RIGHT_TOP}}
          colorFunc={this.props.colorFunc}
          onClick={this.handleMapClick}
          schoolBoundaries={this.renderBoundaries()}>

          {this.props.schools
            .filter(school => school.coords)
            .map(school => (
              <Marker
                key={school.school_board + ' - ' + school.name}
                name={school.name}
                title={school.name}
                position={{
                  lat: school.coords.lat,
                  lng: school.coords.lon
                }}
                onClick={() => this.handleMarkerClick(school)}
                icon={{
                  path: "M-10,0a10,10 0 1,0 20,0a10,10 0 1,0 -20,0",
                  fillColor: this.buildColor(school),
                  fillOpacity: .75,
                  anchor: new this.props.google.maps.Point(0, 0),
                  strokeWeight: 1,
                  strokeColor: this.buildColor(school),
                  scale: .75
                }}
              />)
            )
          }
        </MapWrapper>
        <div className="school-info">
          <SchoolCard school={this.state.selectedSchool} />
        </div>
        <div className="school-counter">
          <span className="tag is-light">
            Showing {this.props.schools.length} schools
          </span>
        </div>
      </div>
    )
  }
}


GoogleMapContainer.propTypes = {
  zoom: PropTypes.number,
  schools: PropTypes.arrayOf(PropTypes.object).isRequired,
  colorFunc: PropTypes.func
}


export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
})(GoogleMapContainer)