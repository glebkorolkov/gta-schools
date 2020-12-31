import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleDown, faMap, faMapMarkerAlt, faGlobe }
  from '@fortawesome/free-solid-svg-icons'

import './SchoolCard.scss'


const SchoolCard = (props) => {

  const [collapsed, setCollapsed] = React.useState(false)

  const toggle = () => {
    setCollapsed(!collapsed)
  }

  const school = props.school
  if (!school) return ''

  const nDash = '\u2013'
  const gradesLabel = school.grades ? `${school.grades.start}${nDash}${school.grades.end}` : nDash

  const quickFacts = (
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
          <p className="title is-7">{school.year || nDash}</p>
        </div>
      </div>
      <div className="level-item has-text-centered">
        <div>
          <p className="heading">Fraser Rank</p>
          <p className="title is-7">
            {school.fraser ? '#' + Number(school.fraser.rank).toLocaleString() : nDash}
          </p>
        </div>
      </div>
      <div className="level-item has-text-centered">
        <div>
          <p className="heading">Fraser Score</p>
          <p className="title is-7">{school.fraser ? school.fraser.score.toFixed(1) : nDash}</p>
        </div>
      </div>
    </nav>
  )

  const fullAddress = school.address ? `${school.address.address}, ${school.address.city}, ${school.address.postal_code}` : nDash
  const websiteLink = school.website ? (
    <a href={school.website} target="_blank" rel="noreferrer">{school.website}</a>
  ) : nDash
  const extraDetails = (
    <nav className="level">
      <div className="level-item is-justify-content-flex-start">
        <p className="is-size-7"><FontAwesomeIcon icon={faMap} /> {fullAddress}</p>
      </div>
      <div className="level-item is-justify-content-flex-start">
        <p className="is-size-7"><FontAwesomeIcon icon={faGlobe} /> {websiteLink}</p>
      </div>
    </nav>
  )

  const cardContent = collapsed ? '' : (
    <div className="school-card-content">
      <hr className="my-2" />
      {quickFacts}
      <hr className="my-2" />
      {extraDetails}
    </div>
  )

  const schoolTypeTag = (
    <div className="level-item">
      <div className="tags has-addons">
        <span
          className={'tag ' + (school.type === 'Elementary' ? 'is-light' : 'is-dark')}>
          {school.type}
        </span>
        <span className="tag is-info">{gradesLabel}</span>
      </div>
    </div>
  )

  return (
    <div className="box p-4 school-card">
      <div className="level m-0">
        <div className="level-left">
          <div className="level-item pr-6">
            <p className="title is-6">{school.name}</p>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <small className="is-6_5">
              <FontAwesomeIcon icon={faMapMarkerAlt} />  {school.address.city}
            </small>
          </div>
          <div className="level-item">
            {schoolTypeTag}
          </div>
          <div className="level-item">
            <FontAwesomeIcon
              className="toggle"
              icon={collapsed ? faAngleLeft : faAngleDown}
              onClick={toggle} />
          </div>
        </div>
      </div>
      { cardContent }
    </div>
  )
}


SchoolCard.propTypes = {
  school: PropTypes.object
}


export default SchoolCard