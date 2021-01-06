import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleDown, faMap, faMapMarkerAlt, faGlobe, faCrosshairs }
  from '@fortawesome/free-solid-svg-icons'
import _padStart from 'lodash.padstart'

import './SchoolCard.scss'


const NDASH = '\u2013'


export default class SchoolCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      collapsed: props.collapsed || false
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.collapsed !== this.props.collapsed) {
      this.setState({collapsed: this.props.collapsed})
    }
  }

  toggle() {
    this.setState({collapsed: !this.state.collapsed});
  }

  makeQuickFacts(school) {
    return (
      <nav className="level my-2">
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">School Board</p>
            <p className="title is-7">{school.school_board}</p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Opening Year</p>
            <p className="title is-7">{school.year || NDASH}</p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Fraser Rank</p>
            <p className="title is-7">
              {school.fraser ? '#' + Number(school.fraser.rank).toLocaleString() : NDASH}
            </p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Fraser Score</p>
            <p className="title is-7">{school.fraser ? school.fraser.score.toFixed(1) : NDASH}</p>
          </div>
        </div>
      </nav>
    )
  }

  makeExtraDetails(school) {
    let fullAddress = NDASH;
    if (school.address) {
      fullAddress = `${school.address.address}, ${school.address.city}, ${school.address.postal_code}`;
    }
    let webLink = NDASH;
    if (school.website) {
      webLink = (
        <a href={school.website} target="_blank" rel="noreferrer">
          {school.website}
        </a>
      );
    }
    const focusBtn = this.props.onFocusClick && this.props.school.coords ? (
      <div className="level-item">
        <button
          className="button is-small is-text"
          title="Zoom on map"
          onClick={() => this.props.onFocusClick(this.props.school.id)}>
          <FontAwesomeIcon icon={faCrosshairs} />
        </button>
      </div>
    ) : null;
    return (
      <nav className="level">
        <div className="level-left">
          <div className="level-item">
            <p className="is-size-7"><FontAwesomeIcon icon={faMap} /> {fullAddress}</p>
          </div>
          <div className="level-item">
            <p className="is-size-7"><FontAwesomeIcon icon={faGlobe} /> {webLink}</p>
          </div>
        </div>
        <div className="level-right">
          {focusBtn}
        </div>
      </nav>
    )
  }

  makeTypeGradesTag(school) {

    const makeGradesLabel = (grades) => {
      const formatGrade = (grade) => (isNaN(grade) ? grade : _padStart(grade, 2, '0'));
      if (Array.isArray(grades)) {
        return `${formatGrade(grades[0])}${NDASH}${formatGrade(grades[1])}`;
      }
      else if ('start' in grades && 'end' in grades) {
        return `${formatGrade(grades.start)}${NDASH}${formatGrade(grades.end)}`;
      }
      return NDASH;
    };

    return (
      <div className="level-item">
        <div className="tags has-addons">
          <span
            className={'tag ' + (school.type === 'Elementary' ? 'is-light' : 'is-dark')}>
            {school.type}
          </span>
          <span className="tag is-info">{makeGradesLabel(school.grades)}</span>
        </div>
      </div>
    )
  }

  makeFraserTag(school) {
    if (!this.state.collapsed) return null;

    let colorClass = 'is-light';
    let label = `Fr. ${NDASH}`;
    if (school.fraser) {
      const score = school.fraser.score;
      if (score >= 7.5) {
        colorClass = 'is-success';
      }
      else if (score < 7.5 && score >= 5.0) {
        colorClass = 'is-warning';
      }
      else {
        colorClass = 'is-danger';
      }
      label = `Fr. #${school.fraser.rank} (${school.fraser.score.toFixed(1)})`;
    }
    return (
      <span className="ml-4">
        <div className="tags has-addons">
          <span className={'tag ' + colorClass}>{label}</span>
        </div>
      </span>
    );
  }

  render() {
    const school = this.props.school;
    if (!school) return null;
    // Body parts
    const quickFacts = this.makeQuickFacts(school);
    const extraDetails = this.makeExtraDetails(school);
    const cardBody = this.state.collapsed ? null : (
      <div className="school-card-content">
        <hr className="my-2" />
        {quickFacts}
        <hr className="my-2" />
        {extraDetails}
      </div>
    );
    // Header parts
    const typeGradesTag = this.makeTypeGradesTag(school);
    const fraserTag = this.makeFraserTag(school);

    return (
      <div className="box p-4 school-card">
        <div className="level m-0">
          <div className="level-left">
            <div className="level-item pr-6">
              <span className="title is-6">{school.name}</span>{fraserTag}
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <small className="is-6_5">
                <FontAwesomeIcon icon={faMapMarkerAlt} />  {school.address.city}
              </small>
            </div>
            <div className="level-item">
              {typeGradesTag}
            </div>
            <div className="level-item">
              <FontAwesomeIcon
                className="toggle"
                icon={this.state.collapsed ? faAngleLeft : faAngleDown}
                onClick={this.toggle} />
            </div>
          </div>
        </div>
        {cardBody}
      </div>
    );
  }
}


SchoolCard.propTypes = {
  school: PropTypes.object,
  collapsed: PropTypes.bool,
  onFocusClick: PropTypes.func
};