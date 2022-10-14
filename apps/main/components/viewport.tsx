import {useRef, useState, useEffect} from 'react';
import * as Tone from 'tone';
import {useViewer} from '../hooks/use-viewer';
import {useSelectedFeature} from '../hooks/selected-feature';

type ViewportProps = {};

const Viewport: React.FC<ViewportProps> = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {initViewer, viewer} = useViewer();
  const [playing, setPlaying] = useState<boolean>(false);
  const [red, setRed] = useState<number>(0);
  const [green, setGreen] = useState<number>(255);
  const [blue, setBlue] = useState<number>(0);
  const [elevation, setElevation] = useState<number>(0);
  const {state: selectedFeatureId, actions} = useSelectedFeature();

  useEffect(() => {
    if (canvasRef.current) {
      initViewer(canvasRef.current);
    }
  }, [initViewer]);

  const play = async () => {
    setPlaying(true);
    await Tone.start();
    if (viewer) {
      viewer.play();
    }
  };

  const generateUrl = () => {
    return `https://mtf.pmtric.com/api/state?id=${selectedFeatureId}&red=${red}&green=${green}&blue=${blue}&elevation=${elevation}`;
  };

  const playSound = async () => {
    const url = generateUrl();
    const res = await fetch(url);
  };

  const deselect = () => {
    actions.setFeatureId(null);
  };

  return (
    <div className="relative w-screen h-screen">
      {!playing && (
        <div className="z-50 absolute top-0 left-0 w-full h-full rounded-full border border-white text-white">
          <div className="bg-gray-900/75 p-4 mb-10 mt-4 text-center m-auto items-center justify-center w-96">
            <h1 className="text-xl">Aveiro - play a value supply chain.</h1>
            <h1>
              Water. Fish. Salt. Market. People. Materials. Innovation.
              Circularity. Ecosystem living
            </h1>
          </div>
          <div className="bg-gray-900/75 p-4 space-y-4 text-center m-auto items-center justify-center w-96">
            <h1>How does it work:</h1>
            <p>
              1. The map visits places (need to change those.. ideas where to
              go?). The story begin.
            </p>
            <p>
              2. You will trigger messages (see below) on the map objects (use
              their IDs) to change color and elevation (HINT: you will use
              ANOTHER device/script to trigger the messages..)
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

            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Red
            </label>
            <input
              id="red"
              min={0}
              max={255}
              value={red}
              type="range"
              onChange={e => {
                setRed(Number(e.target.value));
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Green
            </label>
            <input
              id="green"
              min={0}
              max={255}
              type="range"
              onChange={e => {
                setGreen(Number(e.target.value));
              }}
              value={green}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Blue
            </label>
            <input
              id="blue"
              value={blue}
              min={0}
              max={255}
              type="range"
              onChange={e => {
                setBlue(Number(e.target.value));
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Elevation
            </label>
            <input
              id="elevation"
              value={elevation}
              min={0}
              max={1000}
              type="range"
              onChange={e => {
                setElevation(Number(e.target.value));
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />

            <button
              onClick={playSound}
              className="p-4 text-3xl hover:bg-gray-900"
            >
              Play
            </button>
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
