import React from 'react'

const fraserLink = (
  <a href="https://www.compareschoolrankings.org/"
    rel="noreferrer" target="_blank"
    title="Fraser Institute">
      Fraser Institute
  </a>
)

const eqaoLink = (
  <a href="https://www.eqao.com/the-assessments/find-my-school/"
  rel="noreferrer"
  target="_blank"
  title="Education Quality and Accountability Office">
    EQAO
  </a>
)

const bcLink = (
  <a href="https://www2.gov.bc.ca/gov/content/education-training/post-secondary-education/data-research/enrolment-data"
  rel="noreferrer"
  target="_blank"
  title="Government of British Columbia">
    the Government of British Columbia
  </a>
)

const gtaIntro = (
  <React.Fragment>
    <p>
      This is an interactive map of schools in the Greater Toronto Area. I built this
      little website while choosing a school for my child.
    </p>
    <p>
      <i>For a map of schools in Greater Vancouver
      visit <a href="https://van-schools.ca" target="_blank" rel="noreferrer">van-schools.ca</a>.</i>
    </p>
    <p>
      Information for the map was collected from public sources on the Internet,
      including school boards' websites, {fraserLink} and {eqaoLink}.
    </p>
  </React.Fragment>
)

const vanIntro = (
  <React.Fragment>
    <p>
      This is an interactive map of schools in the Greater Vancouver Area. I built this
      little website while choosing a school for my child.
    </p>
    <p>
      <i>For a map of schools in the Greater Toronto Area
      visit <a href="https://gta-schools.ca" target="_blank" rel="noreferrer">gta-schools.ca</a>.</i>
    </p>
    <p>
      Information for the map was collected from public sources on the Internet,
      including school boards' websites, {fraserLink} and {bcLink}.
    </p>
  </React.Fragment>
)

const contract = {
  gta: gtaIntro,
  van: vanIntro
}

export default contract