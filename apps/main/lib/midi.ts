// credits to jpcarrascal
// https://raw.githubusercontent.com/jpcarrascal/web-midi-poc/main/midi.js

export class Midi {
  midiInIndex: number;
  midi: any;
  midiIn: any;
  success(midi) {
    this.midi = midi;
  }
  connect(midiInIndex) {
    this.midiInIndex = midiInIndex;
    this.midiIn = this.midi.inputs.get(this.midiInIndex);
    this.midiIn.onmidimessage = this.processMidiIn.bind(this);
  }
  failure() {
    console.log('MIDI not supported :(');
  }
  async getInDeviceList() {
    if (!this.midi) {
      await navigator
        .requestMIDIAccess()
        .then(this.success.bind(this), this.failure.bind(this));
    }
    const inList = [];
    const inputs = this.midi.inputs.values();
    for (
      let input = inputs.next();
      input && !input.done;
      input = inputs.next()
    ) {
      inList.push({
        id: input.value.id,
        name: input.value.name,
      });
    }
    return inList;
  }
  processMidiIn(midiMsg) {
    //console.log(midiMsg);
    // altStartMessage: used to sync when playback has already started
    // in clock source device
    // 0xB0 & 0x07 = CC, channel 8.
    // Responding to altStartMessage regardless of channels
    if (midiMsg.data[0] == 191) {
      //CC, right channel
      console.log('CC\t' + midiMsg.data[1] + '\tvalue:' + midiMsg.data[2]);
    } else if (midiMsg.data[0] == 144) {
      console.log(
        'Note ON\t' + midiMsg.data[1] + '\tvelocity: ' + midiMsg.data[2]
      );
    } else if (midiMsg.data[0] == 128) {
      console.log(
        'Note OFF\t' + midiMsg.data[1] + '\tvelocity: ' + midiMsg.data[2]
      );
    } else {
      console.log(midiMsg.data);
    }
    // send to get api
  }
}

// function calculateTempo(time) {
//   let tempoElem = document.getElementById('ext-tempo');
//   let tempo = Math.round(60000 / (time * 4));
//   tempoElem.innerText = tempo;
// }

// function MIDIplayNote(note, vel, out) {
//   out.send([NOTE_ON, note, vel]);
//   setTimeout(out.send([NOTE_OFF, note, 0x00]), NOTE_DURATION);
// }
