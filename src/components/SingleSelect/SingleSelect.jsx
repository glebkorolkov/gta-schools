import React from 'react'
import PropTypes from 'prop-types'


const SingleSelect = (props) => {

  const [value, setValue] = React.useState(props.selectedValue)

  const renderOption = (field, i) => {
    return (
      <option key={ i } value={ field.value || null }>
        { field.label }
      </option>
    )
  }

  const handleChange = (event) => {
    const selectedVal = event.target.value
    setValue(selectedVal)
    props.onChange(selectedVal)
  }

  return (
    <div className="select is-small">
      <select onChange={ handleChange } value={ value }>
        {props.fields.map((field, i) => renderOption(field, i))}
      </select>
    </div>
  )
}


SingleSelect.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.exact({
      label: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ])
    })
  ),
  selectedValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  onChange: PropTypes.func
}


export default SingleSelect