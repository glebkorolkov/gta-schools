import React from 'react'
import PropTypes from 'prop-types'

import './Control.scss'


const Control = (props) => {
  return (
    <div className="regular-control">
      <h5 className="title is-6">{props.label}</h5>
      {props.control}
      {props.children}
    </div>
  )
}


Control.propTypes = {
  label: PropTypes.string.isRequired,
  control: PropTypes.element
}

export default Control