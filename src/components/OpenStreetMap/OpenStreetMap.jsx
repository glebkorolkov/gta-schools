import React from 'react';
import PropTypes from 'prop-types';
import {Map, View, Feature} from 'ol/index';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector} from 'ol/source';
import {Point, Polygon} from 'ol/geom';
import {Style, Circle, Stroke, Fill, Text} from 'ol/style';
import {fromLonLat} from 'ol/proj';
import 'ol/ol.css';

import './OpenStreetMap.scss'


export default class OpenStreetMap extends React.Component {

  defaultZoom = 12;

  constructor(props) {
    super(props);
    this.state = {};
    this.ol = {
      map: null,
      markerLayer: null,
      polygonLayer: null,
      hoveredMarkers: []
    }
    this.mapDiv = null;
    this.handleHover = this.handleHover.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  buildMarker(opts) {
    const marker = new Feature({
      geometry: new Point(fromLonLat([opts.position.lon, opts.position.lat])),
      name: opts.name,
      options: opts
    });
    let styleOpts = opts.icon;
    marker.setStyle(this.buildMarkerStyle(styleOpts));
    return marker;
  }

  buildMarkerStyle(styleOpts) {
    let style = null;
    if (styleOpts && styleOpts.type === 'circle') {
      const radius = styleOpts.radius || 5;
      style = new Style({
        image: new Circle({
          radius: radius,
          fill: new Fill({color: styleOpts.fillColor || 'rgba(0, 0, 0, 0)'}),
          stroke: new Stroke({
            color: styleOpts.strokeColor || 'rgba(0, 0, 0, 0)',
            width: styleOpts.strokeWidth || 1
          })
        }),
        text: new Text({
          text: null,
          font: '12px sans-serif',
          fill: new Fill({color: 'white'}),
          textBaseline: 'bottom',
          offsetY: -2 * radius,
          offsetX: 0,
          backgroundFill: new Fill({color: 'black'}),
          padding: [5, 5, 5, 5]
        })
      });
    }
    return style;
  }

  buildPolygon(opts) {
    const coords = opts.coords.map(
      (path) => path.map(
        (point) => fromLonLat(point)
      )
    );
    const feature = new Feature({
      geometry: new Polygon(coords),
      name: opts.name
    });
    const style = new Style({
      stroke: new Stroke({
        color: opts.style.strokeColor,
        width: opts.style.strokeWidth
      }),
      fill: new Fill({ color: opts.style.fillColor })
    });
    feature.setStyle(style);
    return feature;
  }

  setFeatureText(feature, text) {
    const featureStyle = feature.getStyle();
    if (featureStyle && featureStyle.getText()) {
      const markerText = featureStyle.getText();
      markerText.setText(text);
      featureStyle.setText(markerText);
      feature.setStyle(featureStyle);
    }
  }

  componentDidMount() {
    const view = new View({
      center: fromLonLat([this.props.center.lon, this.props.center.lat]),
      zoom: this.props.zoom || this.defaultZoom
    });
    const tileLayer = new TileLayer({source: new OSM()});
    const map = new Map({
      view: view,
      layers: [tileLayer]
    });
    map.on('pointermove', this.handleHover);
    map.on('click', this.handleClick)
    map.setTarget(this.mapDiv);
    this.ol.map = map;
    this.renderMarkers();
    this.renderPolygons();
    this.setSizeObserver();
  }

  setSizeObserver() {
    const sizeObserver = new ResizeObserver(() => {
      this.ol.map.updateSize();
    });
    sizeObserver.observe(this.mapDiv);
  }

  componentDidUpdate(prevProps) {
    this.renderMarkers();
    this.renderPolygons();
    if (prevProps.zoom !== this.props.zoom ||
        prevProps.center.lat !== this.props.center.lat ||
        prevProps.center.lon !== this.props.center.lon) {
        this.adjustZoomAndCenter();
      }
  }

  adjustZoomAndCenter() {
    const view = this.ol.map.getView();
    view.setZoom(this.props.zoom || this.defaultZoom);
    view.setCenter(fromLonLat([this.props.center.lon, this.props.center.lat]));
    this.ol.map.setView(view);
  }

  handleHover(event) {
    this.ol.hoveredMarkers.forEach((feature) => this.setFeatureText(feature, null));
    const hoveredFeatures = this.ol.map.getFeaturesAtPixel(event.pixel);
    if (hoveredFeatures.length) {
      const feature = hoveredFeatures[0];
      this.setFeatureText(feature, feature.get('name'));
    }
    this.ol.hoveredMarkers = hoveredFeatures;
  }

  handleClick(event) {
    let selectedMarker = null;
    const clickedFeatures = this.ol.map.getFeaturesAtPixel(event.pixel);
    if (clickedFeatures.length) {
      selectedMarker = clickedFeatures[0];
    }
    const markerId = selectedMarker && selectedMarker.get('options') ? selectedMarker.get('options').id : null
    this.props.onMarkerClick(markerId);
  }

  renderMarkers() {
    const markers = (this.props.markers || []).map((markerOpts) => this.buildMarker(markerOpts));
    const markerLayer = new VectorLayer({
      source: new Vector({features: markers}),
      zIndex: 10
    });
    if (this.ol.markerLayer) {
      this.ol.map.removeLayer(this.ol.markerLayer);
    }
    this.ol.map.addLayer(markerLayer);
    this.ol.markerLayer = markerLayer;
  }

  renderPolygons() {
    const polygons = (this.props.polygons || []).map(polyOpts => this.buildPolygon(polyOpts));
    const polygonLayer = new VectorLayer({
      source: new Vector({ features: polygons }),
      zIndex: 1
    });
    if (this.ol.polygonLayer) {
      this.ol.map.removeLayer(this.ol.polygonLayer);
    }
    this.ol.map.addLayer(polygonLayer);
    this.ol.polygonLayer = polygonLayer;
  }

  render() {
    let cssClasses = ['open-street-map'];
    if (this.props.className)
      cssClasses.push(this.props.className);
    return (
      <div
        className={cssClasses.join(' ')}
        ref={(element) => this.mapDiv = element}>
      </div>
    );
  }
}


OpenStreetMap.propTypes = {
  center: PropTypes.exact({
    lon: PropTypes.number,
    lat: PropTypes.number
  }),
  zoom: PropTypes.number,
  markers: PropTypes.arrayOf(PropTypes.object),
  polygons: PropTypes.arrayOf(PropTypes.object),
  onMarkerClick: PropTypes.func
};