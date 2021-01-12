import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import './AboutPage.scss';


const AboutPage = (props) => {
  const defaultClasses = 'about-page has-background-white-ter';
  const containerClasses = props.className ? [defaultClasses, props.className].join(' ') : defaultClasses;
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
                little website while choosing a school for my daughter.
              </p>
              <p>
                Information for the map was collected from public sources available on the Internet,
                including school boards' websites and Fraser Institute.
              </p>
              <p>
                It is a private project that I work on in my free time. I apologize in advance for
                any bugs or inconsistencies.
              </p>
              <h3 className="title is-4">Disclaimer</h3>
              <p>
                <b>Information presented on the map may be incomplete or inaccurate</b>. It was
                collected manually and programmatically from public sources on the Internet.
                Do not rely on the information on this website and verify it with respective schools
                and school boards before making decisions.
              </p>
              <p>
                This website does not collect personal information, use cookies or generate any
                revenue for the owner.
              </p>
            </div>
            <div>
              <button class="button is-link"
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