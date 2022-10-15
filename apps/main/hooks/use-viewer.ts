import {useState, useEffect, useCallback} from 'react';
import {Viewer} from '../lib/Viewer';
import {io} from 'socket.io-client';
import {useSelectedFeature} from '../hooks/selected-feature';
import * as Tone from 'tone';

let socket;

const startPosition = [-8.6538, 40.6405, 12];
const synthNotes = ['G', 'A', 'B', 'C', 'D', 'E', 'F'];
const noteDurations = ['8n', '16n', '64n'];

function generateRangom(low, up) {
  const u = Math.max(low, up);
  const l = Math.min(low, up);
  const diff = u - l;
  const r = Math.floor(Math.random() * (diff + 1)); //'+1' because Math.random() returns 0..0.99, it does not include 'diff' value, so we do +1, so 'diff + 1' won't be included, but just 'diff' value will be.

  return l + r; //add the random number that was selected within distance between low and up to the lower limit.
}

export const useViewer = (): {
  initViewer: (ref: HTMLElement) => void;
  viewer: Viewer | null;
  isLoading: boolean;
} => {
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const [synth, setSynth] = useState<Tone.FMSynth | null>(null);

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
            const note = generateRangom(0, 6);
            const octave = generateRangom(3, 5);
            const durationPosition = generateRangom(0, 2);

            synth.triggerAttackRelease(
              synthNotes[note] + octave,
              noteDurations[durationPosition]
            );
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

      const synth = new Tone.FMSynth().toDestination();
      const reverb = new Tone.Reverb(5).toDestination();
      const delay = new Tone.PingPongDelay('4n', 0.5).toDestination();
      // const chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination().start();
      // const filter = new Tone.Filter("4n").toDestination();
      // const filter = new Tone.Filter(50, "lowpass").toDestination();
      synth.connect(reverb);
      synth.connect(delay);
      // synth.connect(chorus);
      // synth.connect(filter);

      setSynth(synth);
    },
    viewer,
    isLoading: false,
  };
};
