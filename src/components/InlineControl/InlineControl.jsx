import React from 'react'
import PropTypes from 'prop-types'


const InlineControl = (props) => {
  return (
    <div className="inline-control level mb-3">
      <div className="level-left">
        <div className="level-item">
          <h5 className="title is-6 control-title">{props.label}</h5>
        </div>
      </div>
      <div className="level-right">
        <div className="level-item">
          {props.control}
          {props.children}
        </div>
      </div>
    </div>
  )
}


InlineControl.propTypes = {
  label: PropTypes.string.isRequired,
  control: PropTypes.element
}


export default InlineControl