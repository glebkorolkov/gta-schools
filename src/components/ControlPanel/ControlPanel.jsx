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
      displayMode: props.displayMode
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
        { label: 'Fraser Score', value: 'fraser.score' },
        { label: 'ESL %', value: 'eqao.esl_percent' },
        { label: 'Special Needs %', value: 'eqao.special_percent' },
        { label: 'French Immersion', value: 'french_immersion' }
      ],
      sortByOrder: {
        'year': 'desc',
        'fraser.rank': 'asc',
        'fraser.score': 'desc',
        'eqao.esl_percent': 'desc',
        'eqao.special_percent': 'asc',
        'french_immersion': 'desc'
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
        { label: 'York Region DSB', checked: false, value: 'YRDSB' },
        { label: 'Peel DSB', checked: false, value: 'PDSB' },
        { label: 'Durham DSB', checked: false, value: 'DDSB' },
        { label: 'Halton DSB', checked: false, value: 'HDSB' },
        { label: 'Hamilton-Wentworth DSB', checked: false, value: 'HWDSB' }
      ],
      year: {
        range: [1900, 2021]
      },
      fraser: {
        score: {
          range: [0, 10]
        }
      },
      eqao: {
        esl: {
          range: [0, 100]
        },
        special: {
          range: [0, 100]
        }
      },
      frenchImmersion: [{ label: '', checked: false, value: true }]
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
    this.handleEqaoEslPercentChange = this.handleEqaoEslPercentChange.bind(this)
    this.handleEqaoSpecialPercentChange = this.handleEqaoSpecialPercentChange.bind(this)
    this.handleFrenchImmersionFlagChange = this.handleFrenchImmersionFlagChange.bind(this)
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
    if (this.props.onAboutClick) {
      this.props?.onAboutClick();
    }
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

  handleEqaoEslPercentChange(payload) {
    payload.range = payload.range.map((elem) => elem / 100)
    this.updateRangeFilter(payload, 'eqao.esl_percent')
  }

  handleEqaoSpecialPercentChange(payload) {
    payload.range = payload.range.map((elem) => elem / 100)
    this.updateRangeFilter(payload, 'eqao.special_percent')
  }

  handleFrenchImmersionFlagChange(event) {
    const isChecked = event.target.checked
    const includeVals = isChecked ? [true] : [null, true, false]
    this.updateFilters('french_immersion', val => includeVals.includes(val))
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
        <Control label="ESL %">
          <RangeSlider
            initRange={this.defaults.eqao.esl.range}
            increment={10}
            step={5}
            naToggle={true}
            naToggleLabel="Include schools w/o ESL statistics"
            // labelFormattingFunc={(val) => (val * 100).toFixed(0)}
            onChange={this.handleEqaoEslPercentChange}
          />
        </Control>
        <Control label="Special Needs %">
          <RangeSlider
            initRange={this.defaults.eqao.special.range}
            increment={10}
            step={5}
            naToggle={true}
            naToggleLabel="Include schools w/o special needs statistics"
            // labelFormattingFunc={(val) => (val * 100).toFixed(0)}
            onChange={this.handleEqaoSpecialPercentChange}
          />
        </Control>
        <InlineControl label="French Immersion Only">
          <input type="checkbox"
            checked={this.defaults.frenchImmersion.checked}
            onChange={this.handleFrenchImmersionFlagChange}
          />
        </InlineControl>
      </div>
    )
    const containerClasses = (
      'control-panel is-flex is-flex-direction-column is-justify-content-flex-start'
      + (this.state.collapsed ? ' collapsed' : '')
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
  onAboutClick: PropTypes.func,
  displayMode: PropTypes.string,
  collapsed: PropTypes.bool
}
