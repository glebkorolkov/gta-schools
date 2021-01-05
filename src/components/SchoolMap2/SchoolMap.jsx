import React from 'react';
import PropTypes from 'prop-types';

import OpenStreetMap from '../OpenStreetMap';
import SchoolCard from '../SchoolCard';
import {addOpacity} from '../../utils';
import './SchoolMap.css';


export default class SchoolMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedSchool: null
    };
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
  }

  componentDidUpdate() {
    const selectedSchool = this.state.selectedSchool
    if (selectedSchool &&
      !this.props.schools.find((school) => school.id === selectedSchool.id)) {
      this.setState({ selectedSchool: null })
    }
  }

  getSchools() {
    return this.props.schools || [];
  }

  isSelectedSchool(school) {
    return this.state.selectedSchool && this.state.selectedSchool.id === school.id;
  }

  buildColor(school, opacity) {
    if (!this.props.colorFunc) return null;
    const solidColor = this.props.colorFunc(school);
    return addOpacity(solidColor, opacity || 1.0);
  }

  makeSchoolMarkers() {
    const fillOpacity = 0.85;
    // const borderColor = '#3273dc';
    return (
      this.getSchools()
        .filter((school) => school.coords)
        .map((school) => ({
          id: school.id,
          name: school.name,
          position: { lat: school.coords.lat, lon: school.coords.lon },
          icon: {
            type: 'circle',
            radius: this.isSelectedSchool(school) ? 10 : 7,
            strokeColor: this.buildColor(school, 1.0),
            strokeWidth: this.isSelectedSchool(school) ? 3 : 1,
            fillColor: this.buildColor(school, fillOpacity)
          }
        }))
      )
  }

  makeSchoolAreaPolygons() {
    const selectedSchool = this.state.selectedSchool
    if (!selectedSchool || !selectedSchool.boundaries) return null;
    const selectedSchoolBoundaries = selectedSchool.boundaries.map(
      (path) => path.map(
        (point) => [point.lon, point.lat]
      ));
    return [{
      coords: selectedSchoolBoundaries,
      name: selectedSchool.name,
      style: {
        strokeColor: '#48c774',
        strokeWidth: 2,
        fillColor: '#48c77499'
      }
    }];
  }

  handleMarkerClick(markerId) {
    const selectedSchool = this.getSchools().find((school) => school.id === markerId) || null;
    this.setState({ selectedSchool: selectedSchool });
  }

  render() {
    return (
      <div className="school-map-container">
        <OpenStreetMap
          zoom={12}
          className="school-map"
          center={{
            lat: 43.741667,
            lon: -79.373333
          }}
          markers={this.makeSchoolMarkers()}
          polygons={this.makeSchoolAreaPolygons()}
          onMarkerClick={this.handleMarkerClick} />
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


SchoolMap.propTypes = {
  schools: PropTypes.arrayOf(PropTypes.object).isRequired,
  colorFunc: PropTypes.func
}
