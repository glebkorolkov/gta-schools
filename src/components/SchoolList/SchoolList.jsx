import React from 'react';
import PropTypes from 'prop-types';

import SchoolCard from '../SchoolCard';
import Pagination from '../Pagination';
import './SchoolList.scss';


const SchoolList = (props) => {

  const pageSize = parseInt(props.pageSize) || 25;

  const [collapsedHint, setCollapsedHint] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [searchKeyword, setSearchKeyword] = React.useState('');

  let sortedSchools = props.schools;
  if (props.sortFunc)
    sortedSchools = props.sortFunc(props.schools);
  if (searchKeyword.length > 2) {
    sortedSchools = sortedSchools.filter(
      (school) => school.name.toLowerCase().includes(searchKeyword.toLowerCase())
    )
  }

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
        width={props.cardWidth}
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

  const handleSearchInput = (keyword) => {
    setSearchKeyword(keyword);
  };

  const clearSearchInput = () => {
    setSearchKeyword('');
  };

  const nothingFoundMessage = !sortedSchools.length ? (
    <div className="message is-info is-small">
      <div className="message-body">
        No schools found.
      </div>
    </div>
  ) : null;

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
        <div className="level search-box">
          <input className="input is-small is-rounded" type="text" placeholder="Find school by name"
            onChange={(event) => handleSearchInput(event.target.value)}
            value={searchKeyword} />
          <button className="delete is-small" onClick={clearSearchInput}></button>
        </div>
        <Pagination
          current={page}
          total={numPages}
          onChange={handlePageChange}
          className={'mb-4' + (!sortedSchools.length ? ' is-hidden' : '')}
          size="small"
          rounded={true} />
        {displaySchools.map(renderCard)}
        <Pagination
          current={page}
          total={numPages}
          onChange={handlePageChange}
          className={'mb-4' + (!sortedSchools.length ? ' is-hidden' : '')}
          size="small"
          rounded={true} />
        {nothingFoundMessage}
      </div>
    </div>
  )
};


SchoolList.propTypes = {
  schools: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortFunc: PropTypes.func,
  cardWidth: PropTypes.string,
  onFocusClick: PropTypes.func
};


export default SchoolList;