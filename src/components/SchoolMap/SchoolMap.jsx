import React from 'react'
import PropTypes from 'prop-types'
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'
import './SchoolMap.css'


export class GoogleMapContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  buildColor(school) {
    const defaultColor = '#FF0000'
    return this.props.colorFunc(school) || defaultColor
  }

  render() {
    return (
      <Map google={this.props.google} zoom={this.props.zoom || 14} className="SchoolMap"
        initialCenter={{
          lat: 43.741667,
          lng: -79.373333
        }}
        containerStyle={{ position: "relative", height: "100%", width: "100%" }}>

        { this.props.schools
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
              icon={{
                path: "M-10,0a10,10 0 1,0 20,0a10,10 0 1,0 -20,0",
                fillColor: this.buildColor(school),
                fillOpacity: .6,
                anchor: new this.props.google.maps.Point(0, 0),
                strokeWeight: 0,
                scale: .75
              }}
            />)
          )
        }
      </Map>
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