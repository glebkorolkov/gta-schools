import React from 'react'
import {Map} from 'google-maps-react'


export class MapWrapper extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.children.length !== this.props.children.length ||
      nextProps.colorFunc !== this.props.colorFunc ||
      nextProps.schoolBoundaries !== this.props.schoolBoundaries
    )
  }

  render() {
    let allChildren = this.props.children
    if (this.props.schoolBoundaries)
      allChildren = [...this.props.children, ...this.props.schoolBoundaries]
    console.log(this.props.schoolBoundaries)
    return (
      <Map {...this.props}>
        {allChildren}
      </Map>
    )
  }
}
