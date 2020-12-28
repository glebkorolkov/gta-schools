import React from 'react'
import PropTypes from 'prop-types'


export default class ButtonToggle extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    const selected = this.props.selectedOption || this.props.options[0]
    this.setState({ selectedOption: selected })
    this.props.onChange(selected)
  }

  renderOption(option, i) {
    let classNames = 'button is-small'
    if (this.state.selectedOption === option)
      classNames += ' is-selected is-info'
    return (
      <button
        key={ i }
        className={ classNames }
        onClick={ () => this.handleClick(option) }>
          { option }
      </button>
    )
  }

  handleClick(option) {
    this.setState({ selectedOption: option })
    this.props.onChange(option)
  }

  render() {
    return (
      <div class="buttons has-addons">
        { this.props.options.map((option, i) => this.renderOption(option, i)) }
      </div>
    )
  }

}


ButtonToggle.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.string),
  selectedOption: PropTypes.string 
}