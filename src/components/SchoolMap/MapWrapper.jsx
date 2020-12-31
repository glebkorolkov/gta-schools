import React from 'react'
import {Map} from 'google-maps-react'


export class MapWrapper extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.children.length !== this.props.children.length ||
      nextProps.colorFunc !== this.props.colorFunc
    )
  }

  render() {
    return (
      <Map {...this.props}/>
    )
  }
}
