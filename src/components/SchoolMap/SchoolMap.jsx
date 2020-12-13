import React from 'react'
import { Map, GoogleApiWrapper } from 'google-maps-react'
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
        </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
})(GoogleMapContainer)