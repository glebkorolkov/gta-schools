import React from 'react';
import PropTypes from 'prop-types';

import './Pagination.scss';


const Pagination = (props) => {

  const currentPage = props.current;
  const totalPages = props.total;
  const allPages = Array(totalPages).fill().map((element, index) => index + 1);
  const nextPage = allPages.includes(currentPage + 1) ? currentPage + 1 : null
  const prevPage = allPages.includes(currentPage - 1) ? currentPage - 1 : null
  const firstPage = 1;
  const lastPage = allPages[allPages.length - 1];

  const makeAriaLabel = (page) => {
    return `Go to page ${page}`;
  }

  const makePageBtn = (page) => {
    return (
      <li>
        <button
          className={'pagination-link' + (page === currentPage ? ' is-current' : '')}
          aria-label={makeAriaLabel(page)}
          onClick={() => props.onChange(page)}>
          {page}
        </button>
      </li>
    );
  }

  const ellipsisSpacer = (<li><span className="pagination-ellipsis">&hellip;</span></li>);

  const makeContainerClasses = () => {
    let paginationClasses = ['pagination'];
    if (props.size) {
      paginationClasses.push(`is-${props.size.toLowerCase()}`);
    }
    if (props.rounded) {
      paginationClasses.push('is-rounded');
    }
    if (props.className) {
      paginationClasses.push(props.className);
    }
    return paginationClasses.join(' ');
  };

  return (
    <nav className={makeContainerClasses()} role="navigation" aria-label="pagination">
      <button
        className="pagination-previous"
        onClick={() => props.onChange(prevPage)}
        disabled={!prevPage}>
        Previous
      </button>
      <button
        className="pagination-next"
        onClick={() => props.onChange(nextPage)}
        disabled={!nextPage}>
        Next page
      </button>
      <ul className="pagination-list">
        {firstPage === currentPage ? null : makePageBtn(firstPage)}
        {prevPage && prevPage - firstPage > 1 ? ellipsisSpacer : null}
        {prevPage && prevPage !== firstPage ? makePageBtn(prevPage) : null}
        {makePageBtn(currentPage)}
        {nextPage && nextPage !== lastPage ? makePageBtn(nextPage) : null}
        {nextPage && lastPage - nextPage > 1 ? ellipsisSpacer : null}
        {lastPage === currentPage ? null : makePageBtn(lastPage)}
      </ul>
    </nav>
  )
};


Pagination.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onChange: PropTypes.func
};


export default Pagination;