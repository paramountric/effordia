import {useState, useEffect, useCallback} from 'react';
import {Viewer} from '../lib/Viewer';
import {io} from 'socket.io-client';
import {useSelectedFeature} from '../hooks/selected-feature';
import * as Tone from 'tone';

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
            const player = new Tone.Player(
              'https://tonejs.github.io/audio/berklee/gong_1.mp3'
            ).toDestination();
            Tone.loaded().then(() => {
              player.start();
            });
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
