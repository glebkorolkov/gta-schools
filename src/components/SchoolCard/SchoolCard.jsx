import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleDown, faMap, faLocationArrow, faMapMarkerAlt, faGlobe, faCrosshairs, faImage, faTimesCircle }
  from '@fortawesome/free-solid-svg-icons'
import _padStart from 'lodash.padstart'

import './SchoolCard.scss'


const NDASH = '\u2013'


export default class SchoolCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      collapsed: props.collapsed || false,
      narrow: false,
      superNarrow: false,
      imageDisplayed: false
    };
    this.toggle = this.toggle.bind(this);
    this.toggleImage = this.toggleImage.bind(this);
  }

  componentDidMount() {
    this.updateNarrowFlags();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.collapsed !== this.props.collapsed) {
      this.setState({collapsed: this.props.collapsed});
    }
    this.updateNarrowFlags();
  }

  updateNarrowFlags() {
    const isSuperNarrow = this.props.width === 'xs';
    const isNarrow = this.props.width === 's' || isSuperNarrow;
    if (this.state.narrow !== isNarrow || this.state.superNarrow !== isSuperNarrow) {
      this.setState({narrow: isNarrow, superNarrow: isSuperNarrow});
    }
  }

  toggle() {
    this.setState({collapsed: !this.state.collapsed});
  }

  toggleImage() {
    const newImageState = this.props.school.image_url ? !this.state.imageDisplayed : false;
    this.setState({ imageDisplayed: newImageState });
  }

  makeQuickFacts(school) {

    const normalizeEqao = (percent) => {
      return (percent === null || percent === undefined) ? NDASH : (percent * 100).toFixed(0) + '%'
    }

    let eqaoContent = NDASH;
    if (school.eqao) {
      let eqaoEsl = normalizeEqao(school.eqao.esl_percent)
      let eqaoSpecial = normalizeEqao(school.eqao.special_percent)
      if (eqaoEsl !== NDASH || eqaoSpecial !== NDASH) {
        eqaoContent = eqaoEsl + ' | ' + eqaoSpecial;
      }
    };
    const wideView = (
      <nav className="level my-2 school-card-body">
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
            <p className="heading"># Students</p>
            <p className="title is-7">{school.num_students ? school.num_students : NDASH}</p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Fraser</p>
            <p className="title is-7">
              {school.fraser ? school.fraser.score.toFixed(1) + ' (#' + Number(school.fraser.rank).toLocaleString() + ")" : NDASH}
            </p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading" title="English as a second language &amp; special needs students">ESL | Special</p>
            <p className="title is-7">
              {eqaoContent}
            </p>
          </div>
        </div>
      </nav>
    );
    const narrowView = wideView;
    return this.state.narrow ? narrowView : wideView;
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
    const boundaryLink = school.boundaries_url ? (
      <span className="school-card-footer-item is-size-7">
        <FontAwesomeIcon icon={faMap} /> <a target="_blank" rel="noreferrer" href={school.boundaries_url} title="Open boundary map in new window">Catchment area</a>
      </span>
    ) : '';
    const focusBtn = this.props.onFocusClick && this.props.school.coords ? (
      <button
        className="button is-small is-text"
        title="Zoom on map"
        onClick={() => this.props.onFocusClick(this.props.school.id)}>
        <FontAwesomeIcon icon={faCrosshairs} />
      </button>
    ) : null;
    const imageBtn = this.props.school.image_url ? (
      <button
        className={'button is-small is-text' + (this.state.imageDisplayed ? ' is-active' : '')}
        title="Show school image"
        onClick={this.toggleImage}>
        <FontAwesomeIcon icon={this.state.imageDisplayed ? faTimesCircle : faImage} />
      </button>
    ) : null;
    const imageBox = (this.state.imageDisplayed && this.props.school.image_url) ? (
      <div className="school-card-footer-image box">
        <img
          className={this.state.superNarrow ? 'narrow' : null}
          src={this.props.school.image_url}
          alt={this.props.school.name} />
      </div>) : null;
    return (
      <nav className="level school-card-footer">
        <div className="level-left">
          <span className="school-card-footer-item is-size-7 mr-3">
            <FontAwesomeIcon icon={faLocationArrow} /> {fullAddress}
          </span>
          <span className="school-card-footer-item is-size-7 mr-3">
            <FontAwesomeIcon icon={faGlobe} /> {webLink}
          </span>
          {boundaryLink}
        </div>
        <div className="level-right">
          {imageBtn}
          {focusBtn}
        </div>
        {imageBox}
      </nav>
    )
  }

  makeCardBody(school) {
    const narrow = this.state.narrow;
    return this.state.collapsed ? null : (
      <div className="school-card-content">
        <hr className="my-2" />
        {this.makeQuickFacts(school, narrow)}
        <hr className="my-2" />
        {this.makeExtraDetails(school, narrow)}
      </div>
    );
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

    const narrowReplace = {'Elementary': 'Elem.', 'Secondary': 'Sec.'};
    const isSuperNarrowView = this.state.superNarrow && this.state.collapsed;
    const narrowType = narrowReplace[school.type] || school.type;
    const schoolType = isSuperNarrowView ? narrowType : school.type;

    const fiTag = school.french_immersion ?
      (<span className="tag is-success" title="French Immersion">FI</span>): null
    return (
      <div className="tags has-addons">
        <span
          className={'tag ' + (school.type === 'Elementary' ? 'is-light' : 'is-dark')}>
          {schoolType}
        </span>
        <span className="tag is-info">{makeGradesLabel(school.grades)}</span>
        {fiTag}
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
    let containerClasses = "tags has-addons"
    if (['m'].includes(this.props.width)) {
      containerClasses += ' ml-2';
    }
    return (
      <div className={containerClasses}>
        <span className={'tag ' + colorClass}>{label}</span>
      </div>
    );
  }

  render() {
    const school = this.props.school;
    if (!school) return null;

    const typeGradesTag = this.makeTypeGradesTag(school);
    const fraserTag = this.makeFraserTag(school);

    const wideView = (
      <React.Fragment>
        <div className="level is-mobile m-0">
          <div className="level-left">
            <div className="level-item">
              <span className="title is-6">{school.name}</span>{fraserTag}
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <small className="is-6_5 mr-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} />  {school.address.city}
              </small>
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
        {this.makeCardBody(school, false)}
      </React.Fragment>
    );

    const narrowView = (
      <React.Fragment>
        <div className="level is-mobile mb-2 school-card-header">
          <div className="level-left">
              <span className="title is-6">{school.name}</span>
          </div>
          <div className="level-right">
              <FontAwesomeIcon
                className="toggle"
                icon={this.state.collapsed ? faAngleLeft : faAngleDown}
                onClick={this.toggle} />
          </div>
        </div>
        <div className="level is-mobile m-0 school-card-subheader">
          <div className="school-card-subheader-city level-item">
            <small className="is-6_5">
              <FontAwesomeIcon
                className={'mr-1' + (this.state.superNarrow && this.state.collapsed ? ' is-hidden' : '')}
                icon={faMapMarkerAlt} />
                {school.address.city}
            </small>
          </div>
          <div className="level-item">
            {typeGradesTag}
          </div>
          <div className="school-card-subheader-fraser-summary level-item">
            {fraserTag}
          </div>
        </div>
        {this.makeCardBody(school, true)}
      </React.Fragment>
    );

    return (
      <div
        className={'box p-4 school-card' + (this.state.narrow ? ' narrow' : '')}
        ref={(elem) => this.cardDiv = elem} >
        {this.state.narrow ? narrowView : wideView}
      </div>
    );
  }
}


SchoolCard.propTypes = {
  school: PropTypes.object,
  collapsed: PropTypes.bool,
  width: PropTypes.oneOf(['m', 's', 'xs']),
  onFocusClick: PropTypes.func
};