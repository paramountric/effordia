import {useRef, useState, useEffect} from 'react';
import * as Tone from 'tone';
import Typewriter from 'typewriter-effect';
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
  const [playIntro, setPlayIntro] = useState<boolean>(false);
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
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://mtf.pmtric.com'
        : 'http://localhost:3000';
    return `${baseUrl}/api/state?id=${selectedFeatureId}&red=${red}&green=${green}&blue=${blue}&elevation=${elevation}`;
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
          <div className="5 p-4 mb-10 mt-4 text-center m-auto items-center justify-center w-full">
            <h1 className="text-xl p-2 bg-gray-900/75">
              <Typewriter
                options={{deleteSpeed: 10, delay: 10}}
                onInit={typewriter => {
                  typewriter
                    .typeString(
                      'Aveiro. Map. Water. Fish. Salt. Mussels. Market. Bird tree. People. Innovation. Circularity. Ecosystem living.'
                    )
                    .start();
                }}
              />
            </h1>
            <h1 className="text-md p-2 mt-6 bg-gray-900/75">
              <Typewriter
                options={{deleteSpeed: 10, delay: 10}}
                onInit={typewriter => {
                  typewriter
                    .typeString(
                      'mtf.pmtric.com -> START -> Click object on map -> Set color and elevation settings for that object -> Press play'
                    )
                    .start();
                }}
              />
            </h1>
          </div>
          <div className="bg-teal-900/75 p-4 space-y-4 text-center m-auto items-center justify-center w-96">
            <button onClick={play} className="p-4 text-5xl hover:bg-gray-900">
              START
            </button>
          </div>
          <div className="bg-gray-900/75 mt-12 text-teal-400 p-4 space-y-4 text-center m-auto items-center justify-center w-96">
            <p>Mixolydian theme: Tim</p>
            <p>Environment sounds: Jung In, Geirant, Terhi</p>
            <p>Value chain inspiration: Monica</p>
            <p>Sound programming: Ápisov</p>
            <p>MIDI connection help: JP</p>
            <p>Video clip: Nuno, also thanks to Javi for the idea</p>
            <p>Map programming: Andreas</p>
          </div>
          <div className="absolute bg-gray-600/75 bottom-0 text-center m-auto items-center justify-center w-full">
            <p className="p-2">Data: OpenStreetMap</p>
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
            <p>{generateUrl()}</p>

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
