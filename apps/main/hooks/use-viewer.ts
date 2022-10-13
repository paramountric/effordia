import {useState, useEffect, useCallback} from 'react';
import {Viewer} from '../lib/Viewer';
import {io} from 'socket.io-client';
import {useSelectedFeature} from '../hooks/selected-feature';

let socket;

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
          container: ref,
          longitude: -8.6538,
          latitude: 40.6405,
          zoom: 12,
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
