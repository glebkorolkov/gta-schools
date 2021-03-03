import React from 'react';
import PropTypes from 'prop-types';

import OpenStreetMap from '../OpenStreetMap';
import SchoolCard from '../SchoolCard';
import {addOpacity} from '../../utils';
import './SchoolMap.scss';


export default class SchoolMap extends React.Component {

  constructor(props) {
    super(props);
    this.defaultZoom = 12;
    this.focusZoom = 16;
    this.state = {
      selectedSchool: null,
      mapZoom: this.defaultZoom,
      mapCenter: {
        lat: 43.741667,
        lon: -79.373333
      }
    };
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleFocusClick = this.handleFocusClick.bind(this);
  }

  componentDidUpdate(prevProps) {
    const selectedSchool = this.state.selectedSchool
    if (selectedSchool &&
      !this.props.schools.find((school) => school.id === selectedSchool.id)) {
      this.setState({ selectedSchool: null })
    }
    if (prevProps.focusedSchoolId !== this.props.focusedSchoolId) {
      this.handleFocusClick(this.props.focusedSchoolId)
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
    return (
      this.getSchools()
        .filter((school) => school.coords)
        .map((school) => ({
          id: school.id,
          name: school.name,
          position: { lat: school.coords[0], lon: school.coords[1] },
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
        (point) => [point[1], point[0]] // lon, lat
      ));
    const greenColor = '#48c774';
    return [{
      coords: selectedSchoolBoundaries,
      name: selectedSchool.name,
      style: {
        strokeColor: greenColor,
        strokeWidth: 2,
        fillColor: addOpacity(greenColor, 0.3)
      }
    }];
  }

  handleMarkerClick(markerId) {
    const selectedSchool = this.getSchools().find((school) => school.id === markerId) || null;
    this.setState({ selectedSchool: selectedSchool });
  }

  handleFocusClick(schoolId) {
    const school = this.getSchools().find((school) => school.id === schoolId) || null;
    this.setState({
      selectedSchool: school,
      mapZoom: this.focusZoom,
      mapCenter: school.coords,
    });
  }

  render() {
    let containerClasses = 'school-map-container'
    if (this.props.className) {
      containerClasses += ` ${this.props.className}`
    }
    const cardCollapsed = ['s', 'xs'].includes(this.props.cardWidth);
    return (
      <div className={containerClasses}>
        <OpenStreetMap
          className="school-map"
          zoom={this.state.mapZoom}
          center={this.state.mapCenter}
          markers={this.makeSchoolMarkers()}
          polygons={this.makeSchoolAreaPolygons()}
          onMarkerClick={this.handleMarkerClick} />
        <div className="school-info">
          <SchoolCard
            school={this.state.selectedSchool}
            onFocusClick={this.handleFocusClick}
            width={this.props.cardWidth}
            collapsed={cardCollapsed}  />
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
  colorFunc: PropTypes.func,
  focusedSchoolId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  cardWidth: PropTypes.string,
  className: PropTypes.string
}
