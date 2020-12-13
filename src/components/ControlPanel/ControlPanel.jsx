import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import './ControlPanel.css'


export default class ControlPanel extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
        collapsed: false
    }
    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({collapsed: !this.state.collapsed})
  }

  render() {
    return (
      <div className={ 'ControlPanel' + (this.state.collapsed ? ' collapsed' : '') }>
        <div className={ 'column has-text-' + (this.state.collapsed ? 'centered' : 'right') }>
          <FontAwesomeIcon
            icon={ this.state.collapsed ? faAngleDoubleRight : faAngleDoubleLeft}
            onClick={this.toggle} />
        </div>
      </div>
    )
  }
}
