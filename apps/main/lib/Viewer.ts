import {Deck, DeckProps, MapViewState, MapView} from '@deck.gl/core';
import {GeoJsonLayer} from '@deck.gl/layers';
import {Feature, FeatureCollection} from 'geojson';
import maplibreGl, {Texture} from 'maplibre-gl';
import MaplibreWrapper from './MaplibreWrapper';
import rawAveiroData from '../data/aveiro.json';

const aveiroData: any = rawAveiroData;
const preparedAveiroOverlay = [];
const preparedAveiroFoundation = [];
const ids = {
  water: 1,
  building: 1,
  farmland: 1,
  industrial: 1,
};
for (const feature of aveiroData.features) {
  if (feature.properties.natural === 'water') {
    feature.properties.aid = ids.water;
    ids.water++;
    preparedAveiroOverlay.push(feature);
  } else if (feature.properties.building) {
    feature.properties.aid = ids.building;
    ids.building++;
    preparedAveiroOverlay.push(feature);
  } else if (feature.properties.landuse === 'farmland') {
    feature.properties.aid = ids.farmland;
    ids.farmland++;
    preparedAveiroOverlay.push(feature);
  } else if (feature.properties.landuse === 'industrial') {
    feature.properties.aid = ids.industrial;
    ids.industrial++;
    preparedAveiroOverlay.push(feature);
  } else if (feature.properties.type === 'boundary') {
    preparedAveiroFoundation.push(feature);
  } else {
    preparedAveiroFoundation.push(feature);
  }
}

const internalProps = {
  debug: false,
  glOptions: {
    antialias: true,
    depth: true,
  },
  layers: [],
};

type ViewerProps = DeckProps & {
  onSelectObject?: () => Feature | null;
};

class Viewer {
  gl: WebGL2RenderingContext | null = null;
  deck: Deck;
  maplibreMap?: maplibregl.Map;
  selectedObject: Feature | null = null;
  props: ViewerProps;
  constructor(props: ViewerProps, maplibreOptions?: maplibregl.MapOptions) {
    const resolvedProps = Object.assign({}, internalProps, props);
    this.props = resolvedProps;

    this.maplibre(Object.assign({}, resolvedProps, maplibreOptions));
  }

  onWebGLInitialized(gl: any) {
    this.gl = gl;
  }

  setSelectedObject(object: any) {
    this.selectedObject = object;
    if (this.props.onSelectObject) {
      this.props.onSelectObject(object);
    }
  }

  setProps(props: ViewerProps) {
    this.props = Object.assign({}, this.props, props);
    this.render();
  }

  render() {
    if (!this.deck) {
      return;
    }
    this.deck.setProps({
      // parameters: {
      //   clearColor: [250, 250, 250, 1],
      // },
      // useDevicePixels: true,
      // views: [
      //   new MapView({
      //     id: 'main',
      //     controller: true,
      //     longitude: 8.6538,
      //     latitude: 40.6405,
      //     width: window.innerWidth,
      //     height: window.innerHeight,
      //   }),
      // ],
      // viewState: {
      //   main: {
      //     longitude: 8.6538,
      //     latitude: 40.6405,
      //   },
      // },
      // layerFilter: ({layer, viewport}) => {
      //   return true;
      // },
      // onViewStateChange: ({
      //   viewState,
      //   viewId,
      //   interactionState,
      //   oldViewState,
      // }) => {
      //   console.log(viewState);
      //   return viewState;
      // },
      layers: [
        new GeoJsonLayer({
          id: 'foundation',
          data: preparedAveiroFoundation,
          pickable: true,
          stroked: true,
          filled: false,
          extruded: false,
          pointType: 'circle',
          lineWidthScale: 1,
          lineWidthMinPixels: 1,
          getFillColor: (d: any) => d.properties.color || [160, 160, 180, 200],
          getLineColor: [255, 255, 255, 200],
          getPointRadius: 10,
          getLineWidth: 1,
          getElevation: 30,
        }),
        new GeoJsonLayer({
          id: 'overlay',
          data: preparedAveiroOverlay,
          onClick: (d: any) => {
            if (d.object) {
              if (!d.object.id) {
                d.object.id = d.object.properties.uuid;
              }
              console.log(d.object.id);
              return;
            }
          },
          pickable: true,
          stroked: true,
          filled: true,
          extruded: false,
          pointType: 'circle',
          lineWidthScale: 1,
          lineWidthMinPixels: 1,
          getFillColor: (d: any) => d.properties.color || [160, 160, 180, 200],
          getLineColor: [255, 255, 255, 200],
          getPointRadius: 10,
          getLineWidth: 1,
          getElevation: 30,
        }),
      ],
    });
  }

  private maplibre(props) {
    const maplibreOptions = {
      container: 'canvas',
      accessToken: 'wtf',
      renderWorldCopies: false,
      antialias: true,
      style: {
        id: 'aveiro-style',
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: {
              'background-color': 'rgba(0, 0, 0, 255)',
            },
          },
        ],
        sources: {},
        version: 8,
      },
      center: [props.longitude || 0, props.latitude || 0],
      zoom: props.zoom || 14, // starting zoom
      minZoom: props.minZoom || 10,
      pitch: props.pitch || 60,
      attributionControl: true,
    } as maplibregl.MapOptions;
    if (props.container) {
      maplibreOptions.container = props.container;
    } else {
      const container = document.createElement('div');
      container.setAttribute('id', 'canvas');
      container.style.width = '100%'; //window.innerWidth;
      container.style.height = '100%'; //window.innerHeight;
      container.style.position = 'absolute';
      container.style.top = '0px';
      container.style.left = '0px';
      document.body.appendChild(container);
      props.container = container;
    }

    this.maplibreMap = new maplibreGl.Map(maplibreOptions);

    this.maplibreMap.on('load', () => {
      if (!this.maplibreMap) {
        return;
      }
      const gl = this.maplibreMap.painter.context.gl;
      this.deck = new Deck(
        Object.assign(props, {
          gl,
        })
      );

      this.maplibreMap.addLayer(
        new MaplibreWrapper({
          id: 'viewer',
          deck: this.deck,
        }) as maplibregl.LayerSpecification
      );

      this.render();
    });
  }
}

export {Viewer};
export type {ViewerProps};
