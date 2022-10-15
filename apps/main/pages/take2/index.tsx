import {useRef, useState, useEffect} from 'react';
import * as Tone from 'tone';
import Typewriter from 'typewriter-effect';
import Link from 'next/link';

const Take2: React.FC<any> = () => {
  const [playing, setPlaying] = useState<boolean>(false);

  const play = async () => {
    setPlaying(true);
    await Tone.start();
  };

  const goToStart = () => {};

  return (
    <div className="bg-black relative w-screen h-screen">
      {playing ? (
        <div className="z-50 bg-gray-700 absolute top-0 left-0 w-full h-full rounded-full border border-white text-white">
          <div className="5 p-4 mb-10 mt-4 text-center m-auto items-center justify-center w-full">
            <h1 className="text-xl p-2 bg-gray-900/75">
              <Typewriter
                options={{deleteSpeed: 10, delay: 10}}
                onInit={typewriter => {
                  typewriter
                    .typeString(
                      'Aveiro Map. Second take. Click the objects in the map -> adjust color and elevation setings -> press play button'
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
                      '(this time you also play if you want at mtf.pmtric.com RAISE YOUR VOLUME!)'
                    )
                    .start();
                }}
              />
            </h1>
          </div>
          <div className="bg-teal-900/75 p-4 space-y-4 text-center m-auto items-center justify-center w-96">
            <Link href="/">
              <button
                onClick={goToStart}
                className="p-4 text-5xl hover:bg-gray-900"
              >
                Go
              </button>
            </Link>
          </div>
          <div className="flex justify-center">
            <video className="w-1/2 mb-4">
              <source src="/video/salt-pans.mp4" type="video/mp4" />
              Sorry, your browser doesnt support videos.
            </video>
          </div>
        </div>
      ) : (
        <div className="bg-teal-900/75 p-4 space-y-4 text-center m-auto items-center justify-center w-96">
          <button
            onClick={play}
            className="p-4 text-gray-300 text-5xl hover:bg-gray-900"
          >
            Take 2
          </button>
        </div>
      )}
    </div>
  );
};

export default Take2;
