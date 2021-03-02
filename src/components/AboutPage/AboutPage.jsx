import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import './AboutPage.scss';


const AboutPage = (props) => {
  const defaultClasses = 'about-page has-background-white-ter';
  const containerClasses = props.className ? [defaultClasses, props.className].join(' ') : defaultClasses;
  const fraserLink = (
    <a href="https://www.compareschoolrankings.org/"
      rel="noreferrer" target="_blank"
      title="Fraser Institute">
        Fraser Institute
    </a>);
  const eqaoLink = (
    <a href="https://www.eqao.com/the-assessments/find-my-school/"
    rel="noreferrer"
    target="_blank"
    title="Education Quality and Accountability Office">
      EQAO
    </a>);
  return (
    <div className={containerClasses}>
      <section className="hero">
        <div className="hero-body">
          <div className="container">
            <div className="content">
              <h1 className="title is-1">
                About
              </h1>
              <p>
                This is an interactive map of schools in the Greater Toronto Area area. I built this
                little website while choosing a school for my child.
              </p>
              <p>
                Information for the map was collected from public sources on the Internet,
                including school boards' websites, {fraserLink} and {eqaoLink}.
              </p>
              <h3 className="title is-4">Disclaimer</h3>
              <p>
                <b>Information presented on the website may be incomplete or inaccurate</b>. It was
                collected manually and programmatically without extensive verification.
                Do not rely on the information and verify it with respective schools
                or school boards before making any decisions.
              </p>
              <p>
                This website does not: collect personal information, use cookies or generate any
                revenue for its owner.
              </p>
            </div>
            <div>
              <button className="button is-link"
                onClick={props.onClose}>
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Close
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

AboutPage.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func
};

export default AboutPage;