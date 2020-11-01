declare var ABCJS: ABCJS;

// interface ABCJS {
//   renderAbc(id: String, music: String, options: any): void;
// }

interface MIDIInput {
  onmidimessage: EventHandlerNonNull;
  name: string;
}


interface MIDIAccess {
  inputs: Map<string, MIDIInput>;
  sysexEnabled: boolean;
};
interface Navigator {
  requestMIDIAccess(): Promise<MIDIAccess>;
}
