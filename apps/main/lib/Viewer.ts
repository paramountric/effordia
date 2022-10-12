import {Deck, DeckProps, MapViewState, MapView} from '@deck.gl/core';
import {GeoJsonLayer} from '@deck.gl/layers';
import {Feature} from 'geojson';
import maplibreGl from 'maplibre-gl';
import MaplibreWrapper from './MaplibreWrapper';
import aveiroData from '../data/aveiro.json';

const internalProps = {
  debug: false,
  glOptions: {
    antialias: true,
    depth: true,
  },
  layers: [],
  // onWebGLInitialized: null,
  // onViewStateChange: null,
  // layerFilter: null,
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
      parameters: {
        clearColor: [250, 250, 250, 1],
      },
      useDevicePixels: true,
      views: [
        new MapView({
          id: 'main',
          controller: true,
          longitude: 8.6538,
          latitude: 40.6405,
          width: window.innerWidth,
          height: window.innerHeight,
        }),
      ],
      defaultViewState: {
        longitude: 8.6538,
        latitude: 40.6405,
      },
      viewState: {
        main: {
          longitude: 8.6538,
          latitude: 40.6405,
        },
      },
      layers: [
        new GeoJsonLayer({
          id: 'geojson-layer',
          data: aveiroData,
          pickable: true,
          stroked: false,
          filled: true,
          extruded: true,
          pointType: 'circle',
          lineWidthScale: 20,
          lineWidthMinPixels: 2,
          getFillColor: [160, 160, 180, 200],
          getLineColor: [160, 160, 160, 200],
          getPointRadius: 100,
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
              'background-color': 'rgba(255, 255, 255, 1)',
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
      attributionControl: false,
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
      container.style.background = '#100';
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
