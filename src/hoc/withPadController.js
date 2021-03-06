// @flow
import * as React from 'react';
import WebMidi from 'webmidi';

type State = {
  pads: Object[],
};

function withPadController(Component: *) {
  return class extends React.Component<{}, State> {
    state = {
      pads: [
        { id: 'C3', name: 'kick', volume: 1, channel: 1, ext: 'wav', active: false },
        { id: 'D3', name: 'hat', volume: 0.1, channel: 1, ext: 'wav', active: false },
        { id: 'E3', name: 'snare', volume: 1, channel: 1, ext: 'wav', active: false },
      ],
    };

    render(): React.Node {
      return <Component {...this.state} />;
    }

    componentWillMount(): void {
      WebMidi.enable(err => {
        if (err) {
          throw new Error(`WebMidi could not be enabled. ${err}`);
        }

        let input = WebMidi.getInputByName('nanoKEY2 KEYBOARD');
        input = WebMidi.getInputById('1809568182');
        input = WebMidi.inputs[0];

        input.addListener('noteon', 'all', e => {
          const pad = this.state.pads.find(pad => pad.id === e.note.name + e.note.octave);

          if (pad !== undefined) {
            if (e.note.name + e.note.octave === pad.id && e.channel === pad.channel) {
              const pads = this.state.pads.slice();
              for (let i = 0; this.state.pads.length > i; i++) {
                if (this.state.pads[i].id === pad.id) {
                  pads[i].active = true;
                  this.setState({ pads });
                }
              }

              // $FlowFixMe
              const audio: HTMLAudioElement = new Audio(`./drumkits/${pad.name}.${pad.ext}`);
              audio.volume = pad.volume;
              audio.play();
            }
          }
        });
      });
    }
  };
}

export default withPadController;
