import React from 'react'

import PropTypes from 'prop-types'
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

  let updateParagraph = null;
  if (props.updateDate) {
    const dt = new Date(props.updateDate);
    const frmtDt = dt.toLocaleDateString('en-CA', { month: 'long', year: 'numeric', day: 'numeric' })
    updateParagraph = <p>School data was last updated on <i>{frmtDt}</i>.</p>
  }

  const supportSection = props.paypalNo ? (
    <React.Fragment>
      <h3 className="title is-4">Support</h3>
      <p>
        Running a website is not expensive these days. I still have a few things to pay for and
        spend my time on it. If you found the map useful and would like to say thank you, please
        buy me coffee by clicking the <i>Donate</i> button. It will take you to Paypal. Thank you!
      </p>
      <form action="https://www.paypal.com/donate" method="post" target="_blank" className="donate-btn">
        <input type="hidden" name="business" value={props.paypalNo} />
        <input type="hidden" name="item_name" value="Support for gta-schools.ca website." />
        <input type="hidden" name="currency_code" value="CAD" />
        <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
        <img alt="" border="0" src="https://www.paypal.com/en_CA/i/scr/pixel.gif" width="1" height="1" />
      </form>
    </React.Fragment>
  ) : null

  const supportException = props.paypalNo ? " (except for the donation link below)" : null

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
              {updateParagraph}
              <h3 className="title is-4">Disclaimer</h3>
              <p>
                <b>Information presented on the website may be incomplete or inaccurate</b>. It was
                collected manually and programmatically without extensive verification.
                Do not rely on the information and verify it with respective schools
                or school boards before making any decisions.
              </p>
              <p>
                This website does not: collect personal information, use cookies or generate any
                revenue for its owner{supportException}.
              </p>
              {supportSection}
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
  onClose: PropTypes.func,
  updateDate: PropTypes.string,
  paypalNo: PropTypes.string
};

export default AboutPage;