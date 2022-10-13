import {useRef, useState, useEffect} from 'react';
import {useViewer} from '../hooks/use-viewer';
import {useSelectedFeature} from '../hooks/selected-feature';

type ViewportProps = {};

const Viewport: React.FC<ViewportProps> = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {initViewer, viewer} = useViewer();
  const [playing, setPlaying] = useState<boolean>(false);
  const {state: selectedFeatureId, actions} = useSelectedFeature();

  useEffect(() => {
    if (canvasRef.current) {
      initViewer(canvasRef.current);
    }
  }, [initViewer]);

  const play = () => {
    setPlaying(true);
    if (viewer) {
      viewer.play();
    }
  };

  const deselect = () => {
    actions.setFeatureId(null);
  };

  return (
    <div className="relative w-screen h-screen">
      {!playing && (
        <div className="z-50 absolute top-0 left-0 w-full h-full rounded-full border border-white text-white">
          <div className="bg-gray-900/75 p-4 mb-10 mt-4 text-center m-auto items-center justify-center w-96">
            <h1 className="text-xl">Aveiro - play the value supply chain.</h1>
            <h1>Water. Fish. Salt. Market. People. Circularity</h1>
          </div>
          <div className="bg-gray-900/75 p-4 space-y-4 text-center m-auto items-center justify-center w-96">
            <h1>How does it work:</h1>
            <p>
              1. When you press play, the map visits places (actually not atm,
              we will see which places to go to, like some interesting places..)
            </p>
            <p>
              2. Send trigger messages on the map objects to change color and
              elevation (how many meters tall the polygon will be)
            </p>
            <p>3. There might be some sound as well</p>
            <p>
              4. Send messages like this from your environment using REST API
              calls:
              <br />
              <a
                target="_blank"
                rel="noreferrer"
                className="text-blue-500"
                href="https://mtf.pmtric.com/api/state?id=water-2&red=255&elevation=10"
              >
                https://mtf.pmtric.com/api/state?id=water-2&red=255&elevation=10
              </a>
            </p>
            <p>
              5. This is an example using all color channels:
              <br />
              <a
                target="_blank"
                rel="noreferrer"
                className="text-blue-500"
                href="https://mtf.pmtric.com/api/state?id=water-2&red=255&green=100&blue=100"
              >
                https://mtf.pmtric.com/api/state?id=water-2&red=255&green=100&blue=100
              </a>
            </p>
            <p>6. Find the id of a map object by clicking it</p>
            <button onClick={play} className="p-4 text-7xl hover:bg-gray-900">
              PLAY
            </button>
          </div>
        </div>
      )}
      {selectedFeatureId && (
        <div className="z-50 absolute top-4 right-4 border border-white text-white">
          <div className="bg-gray-900/75 text-center m-auto items-center justify-center w-96">
            <h1 className="text-xl">Selected map object ID:</h1>
            <h1 className="text-red-800">{selectedFeatureId}</h1>
            <button
              onClick={deselect}
              className="p-4 text-3xl hover:bg-gray-900"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div
        id="viewport"
        style={{width: '100%', height: '100%'}}
        ref={canvasRef}
      ></div>
    </div>
  );
};

export default Viewport;
