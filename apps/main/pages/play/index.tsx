import type {NextPage} from 'next';
import React, {useEffect, useState} from 'react';
import {Midi} from '../../lib/midi';

type Device = {
  id: string;
  name: string;
};

const PlayPage: NextPage = () => {
  const [midi, setMidi] = useState<Midi | null>(null);
  const [deviceList, setDeviceList] = useState<Device[] | null>(null);

  const selectDevice = (deviceId: number) => {
    midi.connect(deviceId);
  };

  useEffect(() => {
    async function initMidi() {
      const midi = new Midi();
      const inDeviceList = await midi.getInDeviceList();
      console.log(inDeviceList);
      setMidi(midi);
      setDeviceList(inDeviceList);
    }
    if (!midi) {
      initMidi();
    }
  }, []);
  return (
    <div>
      <h1 className="m-4 text-lg">Use MIDI controller</h1>
      {deviceList &&
        deviceList.map((device: any) => (
          <button
            onClick={() => selectDevice(device.id)}
            className="p-4 m-4 bg-slate-300"
            key={device.id}
          >
            {device.name}
          </button>
        ))}
      {!deviceList && <p>Connecting to devices...</p>}
    </div>
  );
};

export default PlayPage;
