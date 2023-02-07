import Vue from 'vue'
import 'ol/ol.css'

import Map from 'ol/Map.js'
import View from 'ol/View.js'
import * as olProj from 'ol/proj';
import * as olInteractions from 'ol/interaction';
import * as olStyle from 'ol/style';
import * as olGeom from 'ol/geom';
import * as olSource from 'ol/source';
import * as olLayer from 'ol/layer';
import Overlay from 'ol/Overlay.js'
import Feature from 'ol/Feature.js'
import * as olExtent from 'ol/extent';
// import Polygon from 'ol/Polygon.js'


import TileJSON from 'ol/source/TileJSON.js';
import TileLayer from 'ol/layer/Tile.js';

const ol = {
  Map: Map,
  View: View,
  TileJSON: TileJSON,
  TileLayer: TileLayer,
  olProj: olProj,
  olInteractions: olInteractions,
  olStyle: olStyle,
  Overlay: Overlay,
  Feature: Feature,
  olGeom: olGeom,
  olSource: olSource,
  olLayer: olLayer,
  olExtent: olExtent,
};

Vue.ol = ol