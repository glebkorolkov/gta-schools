import './App.scss'
import SchoolMap from './components/SchoolMap'
import ControlPanel from './components/ControlPanel'

function App() {
  return (
    <div className="App">
      <ControlPanel />
      <SchoolMap />
    </div>
  );
}

export default App;