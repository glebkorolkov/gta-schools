import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleLeft, faAngleDoubleRight, faInfoCircle, faSlidersH} from '@fortawesome/free-solid-svg-icons'
import './ControlPanel.scss'

import Control from '../Control'
import InlineControl from '../InlineControl'
import MultiCheckbox from '../MultiCheckbox'
import ButtonToggle from '../ButtonToggle'
import SingleSelect from '../SingleSelect'
import RangeSlider from '../RangeSlider'


export default class ControlPanel extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      collapsed: this.props.collapsed || false,
      filters: {},
      controls: {},
      displayMode: props.displayMode,
      aboutMode: false
    }
    this.defaults = {
      display: [
        { label: 'Map', value: 'map', selected: true },
        { label: 'List', value: 'list', selected: false }
      ],
      sortBy: [
        { label: 'School Type', value: 'type' },
        { label: 'School Board', value: 'school_board' },
        { label: 'Year', value: 'year' },
        { label: 'Fraser Rank', value: 'fraser.rank' },
        { label: 'Fraser Score', value: 'fraser.score' }
      ],
      sortByOrder: {
        'year': 'desc',
        'fraser.rank': 'asc',
        'fraser.score': 'desc'
      },
      pageSize: [
        { label: '10', value: 10 },
        { label: '25', value: 25 },
        { label: '50', value: 50 },
        { label: '100', value: 100 },
      ],
      pageSizeSelected: 25,
      schoolTypes: [
        { label: 'Elementary', checked: true },
        { label: 'Secondary', checked: true }
      ],
      schoolBoards: [
        { label: 'Toronto DSB', checked: true, value: 'TDSB' },
        { label: 'York Region DSB', checked: false, value: 'YRDSB' }
      ],
      year: {
        range: [1950, 2021]
      },
      fraser: {
        score: {
          range: [0, 10]
        }
      }
    }
    this.toggle = this.toggle.bind(this)
    this.toggleAbout = this.toggleAbout.bind(this)
    this.isMap = this.isMap.bind(this)
    this.handleDisplayControl = this.handleDisplayControl.bind(this)
    this.handleSortByControl = this.handleSortByControl.bind(this)
    this.handleSortByOrderControl = this.handleSortByOrderControl.bind(this)
    this.handlePageSizeControl = this.handlePageSizeControl.bind(this)
    this.updateFilters = this.updateFilters.bind(this)
    this.updateControls = this.updateControls.bind(this)
    this.selectedValsFromMultiCheckBoxFields = this.selectedValsFromMultiCheckBoxFields.bind(this)
    this.handleSchoolTypeFilter = this.handleSchoolTypeFilter.bind(this)
    this.handleSchoolBoardFilter = this.handleSchoolBoardFilter.bind(this)
    this.handleYearChange = this.handleYearChange.bind(this)
    this.handleFraserScoreChange = this.handleFraserScoreChange.bind(this)
    this.updateRangeFilter = this.updateRangeFilter.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.displayMode !== this.props.displayMode) {
      this.setState({displayMode: this.props.displayMode});
    }
    if (prevProps.collapsed !== this.props.collapsed) {
      this.setState({collapsed: this.props.collapsed});
    }
  }

  toggle() {
    this.setState({collapsed: !this.state.collapsed})
  }

  toggleAbout() {
    this.setState({aboutMode: !this.state.aboutMode});
  }

  isMap() {
    return this.state.controls.display && this.state.controls.display.toLowerCase() === 'map'
  }

  getDisplayToggleFields() {
    if (!this.state.displayMode) return this.defaults.display;
    const displayFields = [...this.defaults.display];
    displayFields.forEach((field) => {
      field.selected = false;
      if ((field.value && field.value === this.state.displayMode) ||
          (field.label === this.state.displayMode)) {
        field.selected = true;
      }
    });
    if (!displayFields.map((field) => field.selected).includes(true)) {
      return this.defaults.display;
    }
    return displayFields;
  }

  selectedValsFromMultiCheckBoxFields(fields) {
    return fields
      .filter(field => field.checked)
      .map(field => (field.value || field.label))
  }

  updateFilters(key, val) {
    let updatedFilters = this.state.filters
    updatedFilters[key] = val
    this.setState({ filters: updatedFilters })
    this.props.onFilterChange(this.state.filters)
  }

  handleSchoolTypeFilter(fields) {
    const includeVals = this.selectedValsFromMultiCheckBoxFields(fields)
    this.updateFilters('type', val => includeVals.includes(val))
  }

  handleSchoolBoardFilter(fields) {
    const includeVals = this.selectedValsFromMultiCheckBoxFields(fields)
    this.updateFilters('school_board', val => includeVals.includes(val))
  }

  updateControls(key, val) {
    let updatedControls = this.state.controls
    updatedControls[key] = val
    this.setState({ controls: updatedControls })
    this.props.onControlChange(this.state.controls)
  }

  handleDisplayControl(fields) {
    const selectedVals = fields
      .filter(field => field.selected)
      .map(field => (field.value || field.label))
    const selectedVal = selectedVals[0] || null
    this.updateControls('display', selectedVal)
  }

  handleSortByControl(selectedValue) {
    this.updateControls('sortBy', selectedValue)
    const sortOrder = this.defaults.sortByOrder[selectedValue] || 'asc'
    this.updateControls('sortByOrder', sortOrder)
  }

  handlePageSizeControl(selectedValue) {
    this.updateControls('pageSize', selectedValue)
  }

  handleSortByOrderControl(fields) {
    const selectedVals = fields
      .filter(field => field.selected)
      .map(field => (field.value || field.label))
    const selectedVal = selectedVals[0] || null
    this.updateControls('sortByOrder', selectedVal)
  }

  handleYearChange(payload) {
    this.updateRangeFilter(payload, 'year')
  }

  handleFraserScoreChange(payload) {
    this.updateRangeFilter(payload, 'fraser.score')
  }

  updateRangeFilter(payload, field) {
    const { range, showNa } = payload
    this.updateFilters(field, val => {
      const isBetween = (val !== null && val <= range[range.length - 1] && val >= range[0])
      const isNull = (val === null)
      return showNa ? (isBetween || isNull) : isBetween
    })
  }

  render() {
    const filters = (
      <div className={this.state.collapsed ? 'is-hidden' : null}>
        <h3 className="title is-3">Controls</h3>
        <InlineControl label="Display">
          <ButtonToggle
            fields={this.getDisplayToggleFields()}
            onChange={this.handleDisplayControl}
          />
        </InlineControl>
        <InlineControl label={this.isMap() ? 'Color by' : 'Sort by'}>
          <SingleSelect
            fields={this.defaults.sortBy}
            onChange={this.handleSortByControl}
          />
          <span className={'ml-1 ' + (true ? 'is-hidden' : '')}>
            <ButtonToggle
              fields={[
                { label: '\u2191', title: 'Descending', value: 'desc', selected: true },
                { label: '\u2193', title: 'Ascending', value: 'asc', selected: false }
              ]}
              onChange={this.handleSortByOrderControl}
              isNarrow={true}
            />
          </span>
        </InlineControl>
        <InlineControl label="Results per page" className={this.isMap() ? 'is-hidden': ''}>
          <SingleSelect
            fields={this.defaults.pageSize}
            selectedValue={this.defaults.pageSizeSelected}
            onChange={this.handlePageSizeControl}
          />
        </InlineControl>
        <Control label="School Type">
          <MultiCheckbox
            fields={this.defaults.schoolTypes}
            onChange={this.handleSchoolTypeFilter}
          />
        </Control>
        <Control label="School Board">
          <MultiCheckbox
            fields={this.defaults.schoolBoards}
            onChange={this.handleSchoolBoardFilter}
          />
        </Control>
        <Control label="Year">
          <RangeSlider
            initRange={this.defaults.year.range}
            increment={10}
            naToggle={true}
            naToggleLabel="Include schools without year"
            onChange={this.handleYearChange}
          />
        </Control>
        <Control label="Fraser Score">
          <RangeSlider
            initRange={this.defaults.fraser.score.range}
            increment={1.0}
            step={.5}
            naToggle={true}
            naToggleLabel="Include schools without Fraser score"
            onChange={this.handleFraserScoreChange}
          />
        </Control>
      </div>
    )
    const containerClasses = (
      'control-panel is-flex is-flex-direction-column is-justify-content-flex-start'
      + (this.state.collapsed ? ' collapsed' : '')
    );
    const aboutModal = (
      <div className={'modal' + (this.state.aboutMode ? ' is-active' : '')}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">About</p>
              <button className="delete" aria-label="close" onClick={this.toggleAbout}></button>
            </header>
            <section className="modal-card-body content">
              <p>This is an interactive map of schools in the Greater Toronto Area area.
                The map is under development and may not contain all schools from all school boards.</p>
              <p>Information for the map was collected from public sources available on the Internet:
                school board websites, Fraser Institute's website and others.</p>
              <p><b>The information presented on the map may be incomplete or inaccurate</b>.
                Do not rely on it and verify with respective schools and school boards before
                making any decisions.</p>
              <p>This is a private project that I work on in my free time. Please excuse any bugs
                or inconsistencies, as well as a lack of a mobile-friendly version. I do not generate any
                revenue from the website, including advertising revenue or revenue from placing advertising
                networks' cookies on your computer.</p>
            </section>
          </div>
        </div>
      </div>
    );
    return (
      <React.Fragment>
        <div className={containerClasses}>
          <div className="column">
            { filters }
            <div className="toggle">
              <FontAwesomeIcon
                className="toggle-icon"
                icon={this.state.collapsed ? faAngleDoubleRight : faAngleDoubleLeft}
                onClick={this.toggle}
                title="Toggle control panel" />
            </div>
          </div>
          <div
            className={'column control-panel-footer' + (this.state.collapsed ? ' has-text-centered' : '')}>
            <span
              className="info-marker"
              title="About this page"
              onClick={this.toggleAbout}>
              <FontAwesomeIcon icon={faInfoCircle} size="lg"/>
              {this.state.collapsed ? null : <span className="ml-1">About</span>}
            </span>
          </div>
        </div>
        {aboutModal}
        <button
          className={'button is-link mobile-toggle' + (!this.isMap() ? ' mobile-toggle-listview': '')}
          onClick={this.toggle}
          title="Toggle control panel" >
          <FontAwesomeIcon icon={faSlidersH} />
        </button>
      </React.Fragment>
    )
  }
}


ControlPanel.propTypes = {
  onFilterChange: PropTypes.func,
  onControlChange: PropTypes.func,
  displayMode: PropTypes.string,
  collapsed: PropTypes.bool
}
