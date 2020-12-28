import React from 'react'
import PropTypes from 'prop-types'


export default class SingleSelect extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      fields: []
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    const { fields } = this.props
    this.setState({ fields })
    this.props.onChange(fields)
  }

  renderOption(field, i) {
    return (
      <option
        value={ field.value || null }
        selected={ field.selected }>
          { field.label }
      </option>
    )
  }

  handleChange(e) {
    const selectedInd = e.target.selectedIndex
    let fields = this.state.fields
    fields.forEach(field => {field.selected = false})
    fields[selectedInd].selected = true
    this.setState({ fields: fields })
    this.props.onChange(fields)
  }

  render() {
    return (
      <div class="select is-small">
        <select onChange={ this.handleChange }>
          { this.state.fields.map((field, i) => this.renderOption(field, i)) }
        </select>
      </div>
    )
  }

}


SingleSelect.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.exact({
      label: PropTypes.string,
      selected: PropTypes.bool,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ])
    })
  ),
  onChange: PropTypes.func
}