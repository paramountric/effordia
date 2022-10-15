// credits to jpcarrascal
// https://raw.githubusercontent.com/jpcarrascal/web-midi-poc/main/midi.js

export class Midi {
  midiInIndex: number;
  midi: any;
  midiIn: any;
  red: 0;
  blue: 0;
  green: 0;
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
  generateUrl(id = 'building-1') {
    const red = this.red * 2;
    const blue = this.blue * 2;
    const green = this.green * 2;
    const elevation = 100000;
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://mtf.pmtric.com'
        : 'http://localhost:3000';
    return `${baseUrl}/api/state?id=${id}&red=${red}&green=${green}&blue=${blue}&elevation=${elevation}`;
  }

  async playSound(id) {
    const url = this.generateUrl(id);
    const res = await fetch(url);
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
    const [signal, id, slider] = midiMsg.data;

    console.log(signal, id, slider);
    switch (id) {
      case 6:
        this.red = slider;
        break;
      case 5:
        this.green = slider;
        break;
      case 4:
        this.blue = slider;
        break;
      default:
        this.red = slider;
    }
    const objId = `building-${midiMsg.data[1] || 0}`;
    if (signal === 145) {
      this.playSound(objId);
    }
  }
}
