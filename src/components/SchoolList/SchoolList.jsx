import React from 'react';
import PropTypes from 'prop-types';

import SchoolCard from '../SchoolCard';
import './SchoolList.scss';


const SchoolList = (props) => {

  const [collapsedHint, setCollapsedHint] = React.useState(false);

  let sortedSchools = props.schools;
  if (props.sortFunc)
    sortedSchools = props.sortFunc(props.schools);

  const renderCard = (school) => {
    return (
      <SchoolCard
        school={school}
        key={`${school.school_board} - ${school.name}`}
        collapsed={collapsedHint}
      />
    );
  };

  const toggleCollapsed = (val) => {
    setCollapsedHint(val)
  }
  
  return (
    <div className="school-list container is-fluid has-background-white-ter">
      <div className="column">
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              <h1 className="subtitle is-3">Showing {props.schools.length} schools</h1>
            </div> 
          </div>
          <div className="level-right">
            <div className="level-item">
              <button
                className="button is-text is-small"
                onClick={() => toggleCollapsed(true)}>
                  Collapse all
              </button> 
              <button
                className="button is-text is-small"
                onClick={() => toggleCollapsed(false)}>
                  Expand all
              </button> 
            </div>
          </div>
        </div>
        {sortedSchools.map(renderCard)}
      </div>
    </div>
  )
};


SchoolList.propTypes = {
  schools: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortFunc: PropTypes.func
};


export default SchoolList;