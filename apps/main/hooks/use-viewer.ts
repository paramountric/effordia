import {useState, useEffect, useCallback} from 'react';
import {Viewer} from '../lib/Viewer';
import {io} from 'socket.io-client';
import {useSelectedFeature} from '../hooks/selected-feature';

let socket;

const startPosition = [-8.6538, 40.6405, 12];

export const useViewer = (): {
  initViewer: (ref: HTMLElement) => void;
  viewer: Viewer | null;
  isLoading: boolean;
} => {
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const {actions} = useSelectedFeature();

  useEffect(() => {
    if (viewer) {
      viewer.render();
      viewer.rotateCamera();
      const flyTo = [
        [-8.65, 40.64, 18],
        [-8.64, 40.6, 18],
        [-8.7, 40.7, 18],
        [-8.6, 40.65, 18],
      ];
      let count = 0;
      const interval = 1000 * 8;
      const intervalId = setInterval(() => {
        if (flyTo[count]) {
          const [lon, lat, zoom] = flyTo[count];
          viewer.flyTo(lon, lat, zoom, interval);
          count++;
        } else {
          const [lon, lat, zoom] = startPosition;
          viewer.flyTo(lon, lat, zoom, interval);
          clearInterval(intervalId);
        }
      }, interval + 3000);
      return () => clearInterval(intervalId);
    }
  }, [viewer]);

  useEffect(() => {
    if (viewer) {
      const connectWs = async () => {
        await fetch('/api/ws');
        socket = io();

        socket.on('connect', () => {
          console.log('connected to ws');
        });

        socket.on('set-data', msg => {
          console.log(msg);
          console.log('update');
          if (viewer) {
            viewer.setData(msg);
          }
        });
      };

      connectWs();
      return () => {
        // for unmounting
      };
    }
  }, [viewer]);

  return {
    initViewer: ref => {
      if (viewer) {
        return;
      }
      ref.style.width = '100%';
      ref.style.height = '100%';
      ref.style.position = 'absolute';
      ref.style.top = '0px';
      ref.style.left = '0px';
      setViewer(
        new Viewer({
          //container: ref,
          parent: ref,
          longitude: startPosition[0],
          latitude: startPosition[1],
          zoom: startPosition[2],
          onSelectObject: (obj: any) => {
            actions.setFeatureId(obj.properties.aid);
          },
        })
      );
    },
    viewer,
    isLoading: false,
  };
};
