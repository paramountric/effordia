import {useState, useEffect, useCallback} from 'react';
import {StylePropertySpecification} from 'maplibre-gl';

import {Viewer} from '../lib/Viewer';

export const useViewer = (): {
  initViewer: (ref: HTMLElement) => void;
  viewer: Viewer | null;
  isLoading: boolean;
} => {
  const [viewer, setViewer] = useState<Viewer | null>(null);

  useEffect(() => {
    if (viewer) {
      viewer.render();
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
        })
      );
    },
    viewer,
    isLoading: false,
  };
};
