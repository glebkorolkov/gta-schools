import React from 'react'
import PropTypes from 'prop-types'

import OpenStreetMap from '../OpenStreetMap'
import './SchoolMap.css'


export default class SchoolMap extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedSchool: null
    }
  }

  render() {
    return (
      <div className="school-map-container">
        <OpenStreetMap
          zoom={14}
          className="school-map"
          initialCenter={{
            lat: 43.741667,
            lng: -79.373333
          }}>

          
        </OpenStreetMap>
        <div className="school-counter">
          <span className="tag is-light">
            Showing {this.props.schools.length} schools
          </span>
        </div>
      </div>
    )
  }
}


SchoolMap.propTypes = {
  schools: PropTypes.arrayOf(PropTypes.object).isRequired,
}
