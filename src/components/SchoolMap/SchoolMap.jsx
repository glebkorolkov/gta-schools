import React from 'react'
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'
import './SchoolMap.css'


export class GoogleMapContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Map google={this.props.google} zoom={this.props.zoom} className="SchoolMap"
        initialCenter={{
          lat: 43.741667,
          lng: -79.373333
        }}
        containerStyle={{ position: "relative", height: "100%", width: "100%" }}>

        { this.props.schools
          .filter(school => school.coords)
          .map(school => (
            <Marker
              key={school.name}
              name={school.name}
              title={school.name}
              position={{
                lat: school.coords.lat,
                lng: school.coords.lon
              }}
              icon={{
                path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
                fillColor: '#FF0000',
                fillOpacity: .6,
                anchor: new this.props.google.maps.Point(0, 0),
                strokeWeight: 0,
                scale: .5
              }}
            />)
          )
        }

      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
})(GoogleMapContainer)