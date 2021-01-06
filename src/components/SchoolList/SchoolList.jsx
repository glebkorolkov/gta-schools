import React from 'react';
import PropTypes from 'prop-types';

import SchoolCard from '../SchoolCard';
import Pagination from '../Pagination';
import './SchoolList.scss';


const SchoolList = (props) => {

  const pageSize = parseInt(props.pageSize) || 25;

  const [collapsedHint, setCollapsedHint] = React.useState(false);
  const [page, setPage] = React.useState(1);

  let sortedSchools = props.schools;
  if (props.sortFunc)
    sortedSchools = props.sortFunc(props.schools);

  const numPages = Math.ceil(sortedSchools.length / pageSize) || 1;
  if (page > numPages) {
    setPage(numPages);
  }
  const displayStartIndex = (page - 1) * pageSize;
  const displayEndIndex = displayStartIndex + pageSize;
  const displaySchools = sortedSchools.slice(displayStartIndex, displayEndIndex)

  const handleFocusClick = (schoolId) => {
    props.onFocusClick(schoolId)
  };

  const renderCard = (school) => {
    return (
      <SchoolCard
        school={school}
        key={`${school.school_board} - ${school.name}`}
        collapsed={collapsedHint}
        onFocusClick={props.onFocusClick ? handleFocusClick : null}
      />
    );
  };

  const toggleCollapsed = (val) => {
    setCollapsedHint(val);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

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
              <div className="buttons has-addons">
                <button
                  className="button is-rounded is-small"
                  onClick={() => toggleCollapsed(true)}>
                  Collapse all
                </button>
                <button
                  className="button is-rounded is-small"
                  onClick={() => toggleCollapsed(false)}>
                  Expand all
              </button>
              </div>
            </div>
          </div>
        </div>
        <Pagination
          current={page}
          total={numPages}
          onChange={handlePageChange}
          className={'mb-4' + (!props.schools.length ? ' is-hidden' : '')}
          size="small"
          rounded={true} />
        {displaySchools.map(renderCard)}
        <Pagination
          current={page}
          total={numPages}
          onChange={handlePageChange}
          className={'mb-4' + (!props.schools.length ? ' is-hidden' : '')}
          size="small"
          rounded={true} />
      </div>
    </div>
  )
};


SchoolList.propTypes = {
  schools: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortFunc: PropTypes.func,
  onFocusClick: PropTypes.func
};


export default SchoolList;