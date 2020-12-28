import React from 'react'
import PropTypes from 'prop-types'
import './MultiCheckbox.scss'


export default class MultiCheckbox extends React.Component {

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

  renderCheckbox(field, i) {
    return (
      <React.Fragment key={ i }>
        <label className="checkbox">
          <input type="checkbox"
            checked={ field.checked }
            onChange={ e => this.handleChange(i, e) }
          />
          { field.label }
        </label>
      </React.Fragment>
    )
  }

  handleChange(checkboxInd, e) {
    let fields = this.state.fields
    fields[checkboxInd].checked = e.target.checked
    this.setState({fields: fields})
    this.props.onChange(fields)
  }

  render() {
    return (
      <div className="multi-checkbox">
        { this.state.fields.map((field, i) => this.renderCheckbox(field, i)) }
      </div>
    )
  }
}


MultiCheckbox.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.exact({
      label: PropTypes.string,
      checked: PropTypes.bool,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ])
    })
  ),
  onChange: PropTypes.func
}
