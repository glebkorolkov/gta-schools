import React from 'react';
import {Map, View} from 'ol/index';
import {Tile as TileLayer} from 'ol/layer';
import {OSM} from 'ol/source';
import {fromLonLat} from 'ol/proj';
import 'ol/ol.css';

import './OpenStreetMap.scss'


export default class OpenStreetMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.map = null;
  }

  componentDidMount() {
    this.map = new Map({
      target: 'map',
      view: new View({
        center: fromLonLat([-79.373333, 43.741667]),
        zoom: 12
      }),
      layers: [
        new TileLayer({ source: new OSM() })
      ]
    });
  }

  render() {
    return <div id="map" className="open-street-map"></div>;
  }
}