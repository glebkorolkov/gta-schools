import React from 'react'
import PropTypes from 'prop-types'


export default class ButtonToggle extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      fields: []
    }
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    const {fields} = this.props
    this.setState({fields})
    this.props.onChange(fields)
  }

  renderOption(field, i) {
    let classNames = 'button is-small'
    if (field.selected)
      classNames += ' is-selected is-link'
    if (this.props.isNarrow)
      classNames += ' px-2'
    return (
      <button
        key={i}
        className={classNames}
        title={field.title}
        onClick={() => this.handleClick(i)}>
          {field.label}
      </button>
    )
  }

  handleClick(optionInd) {
    let fields = this.state.fields
    fields.forEach(field => {field.selected = false})
    fields[optionInd].selected = true
    this.setState({fields: fields})
    this.props.onChange(fields)
  }

  render() {
    return (
      <div className="buttons has-addons">
        {this.state.fields.map((field, i) => this.renderOption(field, i))}
      </div>
    )
  }

}


ButtonToggle.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      title: PropTypes.string,
      selected: PropTypes.bool,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ])
    })
  ),
  onChange: PropTypes.func,
  isNarror: PropTypes.bool
}