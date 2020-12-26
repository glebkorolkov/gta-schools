import React from 'react'
import './App.scss'
import SchoolMap from './components/SchoolMap'
import ControlPanel from './components/ControlPanel'


class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      schools: []
    }
  }

  componentDidMount() {
    fetch("schools.json")
      .then(res => res.json())
      .then(schools => {
        this.setState({ schools: schools })
      })
  }

  render() {
    return (
      <div className="App">
        <ControlPanel />
        <SchoolMap zoom={12} schools={this.state.schools}/>
      </div>
    );
  }
}

export default App;