import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleDown, faMap, faMapMarkerAlt, faGlobe }
  from '@fortawesome/free-solid-svg-icons'
import _padStart from 'lodash.padstart'

import './SchoolCard.scss'


const SchoolCard = (props) => {

  const [collapsed, setCollapsed] = React.useState(props.collapsed || false)

  React.useEffect(() => {setCollapsed(props.collapsed)}, [props]);

  const toggle = () => {
    setCollapsed(!collapsed)
  }

  const school = props.school
  if (!school) return ''

  const nDash = '\u2013'

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

  const makeGradesLabel = grades => {
    const formatGrade = (grade) => (isNaN(grade) ? grade : _padStart(grade, 2, '0'))
    if (Array.isArray(grades))
      return `${formatGrade(grades[0])}${nDash}${formatGrade(grades[1])}`
    else if ('start' in grades && 'end' in grades)
      return `${formatGrade(grades.start)}${nDash}${formatGrade(grades.end)}`
    return nDash
  }

  const schoolTypeTag = (
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

  const makeFraserTag = (school) => {
    let colorClass = 'is-light'
    let label = `Fr. ${nDash}`
    if (school.fraser) {
      const score = school.fraser.score
      if (score >= 7.5)
        colorClass = 'is-success'
      else if (score < 7.5 && score >= 5.0)
        colorClass = 'is-warning'
      else
        colorClass = 'is-danger'
      label = `Fr. #${school.fraser.rank} (${school.fraser.score.toFixed(1)})`
    }
    return (
      <div className="tags has-addons">
        <span className={'tag ' + colorClass}>{label}</span>
      </div>
    )
  }

  const fraserTagItem = !collapsed ? '' : (
    <span className="ml-4">
      {makeFraserTag(school)}
    </span>
  )

  return (
    <div className="box p-4 school-card">
      <div className="level m-0">
        <div className="level-left">
          <div className="level-item pr-6">
            <span className="title is-6">{school.name}</span>{fraserTagItem}
          </div>
        </div>
        <div className="level-right">
          {/* {fraserTagItem} */}
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
  school: PropTypes.object,
  collapsed: PropTypes.bool
}


export default SchoolCard