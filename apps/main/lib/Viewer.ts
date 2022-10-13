import {Deck, DeckProps, MapViewState, MapView} from '@deck.gl/core';
import {GeoJsonLayer, ScatterplotLayer} from '@deck.gl/layers';
import {Feature, FeatureCollection} from 'geojson';
import maplibreGl, {Texture} from 'maplibre-gl';
import MaplibreWrapper from './MaplibreWrapper';
import rawAveiroData from '../data/aveiro.json';

const aveiroData: any = rawAveiroData;
const preparedAveiroOverlay = {};
const preparedAveiroFoundation = [];
const ids = {
  water: 1,
  building: 1,
  farmland: 1,
  industrial: 1,
};
let updateColors = Date.now();
let updateElevation = Date.now();

for (const feature of aveiroData.features) {
  if (feature.properties.natural === 'water') {
    feature.properties.aid = `water-${ids.water}`;
    ids.water++;
    preparedAveiroOverlay[feature.properties.aid] = feature;
  } else if (feature.properties.building) {
    feature.properties.aid = `building-${ids.building}`;
    ids.building++;
    preparedAveiroOverlay[feature.properties.aid] = feature;
  } else if (feature.properties.landuse === 'farmland') {
    feature.properties.aid = `farmland-${ids.farmland}`;
    ids.farmland++;
    preparedAveiroOverlay[feature.properties.aid] = feature;
  } else if (feature.properties.landuse === 'industrial') {
    feature.properties.aid = `industrial-${ids.industrial}`;
    ids.industrial++;
    preparedAveiroOverlay[feature.properties.aid] = feature;
  } else if (feature.properties.type === 'boundary') {
    //preparedAveiroFoundation.push(feature);
  } else {
    //preparedAveiroFoundation.push(feature);
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

  setData(data: any) {
    if (
      preparedAveiroOverlay[data.id] &&
      preparedAveiroOverlay[data.id].properties
    ) {
      let doRender = false;
      if (data.red) {
        console.log('set red', data.red);
        const color = preparedAveiroOverlay[data.id].properties.color || [
          255, 255, 255, 150,
        ];
        color[0] = Number(data.red);
        preparedAveiroOverlay[data.id].properties.color = color;
        updateColors = Date.now();
        doRender = true;
      }
      if (data.green) {
        const color = preparedAveiroOverlay[data.id].properties.color || [
          255, 255, 255, 150,
        ];
        color[1] = Number(data.green);
        preparedAveiroOverlay[data.id].properties.color = color;
        updateColors = Date.now();
        doRender = true;
      }
      if (data.blue) {
        const color = preparedAveiroOverlay[data.id].properties.color || [
          255, 255, 255, 150,
        ];
        color[2] = Number(data.blue);
        preparedAveiroOverlay[data.id].properties.color = color;
        updateColors = Date.now();
        doRender = true;
      }
      if (data.elevation) {
        console.log('set height', data.elevation);
        preparedAveiroOverlay[data.id].properties.elevation = Number(
          data.elevation
        );
        doRender = true;
        updateElevation = Date.now();
      }
      if (doRender) {
        this.render();
      }
    } else {
      console.log('not found', data);
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
        // new ScatterplotLayer({
        //   id: 'background-circle',
        //   data: {},
        //   pickable: true,
        //   opacity: 0.8,
        //   stroked: true,
        //   filled: true,
        //   radiusScale: 6,
        //   radiusMinPixels: 1,
        //   radiusMaxPixels: 100,
        //   lineWidthMinPixels: 1,
        //   getPosition: d => d.coordinates,
        //   getRadius: d => Math.sqrt(d.exits),
        //   getFillColor: d => [255, 140, 0],
        //   getLineColor: d => [0, 0, 0],
        // }),
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
        }),
        new GeoJsonLayer({
          id: 'overlay',
          data: Object.values(preparedAveiroOverlay),
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
          extruded: true,
          pointType: 'circle',
          lineWidthScale: 1,
          lineWidthMinPixels: 1,
          getFillColor: (d: any) => d.properties.color || [255, 255, 255, 100],
          getLineColor: [255, 255, 255, 200],
          getPointRadius: 10,
          getLineWidth: 1,
          getElevation: (d: any) => d.properties.elevation || 0,
          updateTriggers: {
            getFillColor: updateColors,
            getElevation: updateElevation,
          },
          transitions: {
            getElevation: 500,
            getColors: 500,
          },
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
