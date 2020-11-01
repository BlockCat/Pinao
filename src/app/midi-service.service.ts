import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class Note {
  key: number;
  hardness: number;
  duration: number;

  constructor(key: number, hardness: number, duration: number = 1) {
    this.key = key;
    this.hardness = hardness;
    this.duration = duration;
  }

  getNote(): string {
    return MidiServiceService.mapping.get(this.key);
  }
}

export class MidiServiceService {

  static mapping = new Map([
    [21, 'A,,,,'],
    [22, '^A,,,,'],
    [23, 'B,,,,'],
    [24, 'C,,,'],
    [25, '^C,,,'],
    [26, 'D,,,'],
    [27, '^D,,,'],
    [28, 'E,,,'],
    [29, 'F,,,'],
    [30, '^F,,,'],
    [31, 'G,,,'],
    [32, '^G,,,'],
    [33, 'A,,,'],
    [34, '^A,,,'],
    [35, 'B,,,'],
    [36, 'C,,'],
    [37, '^C,,'],
    [38, 'D,,'],
    [39, '^D,,'],
    [40, 'E,,'],
    [41, 'F,,'],
    [42, '^F,,'],
    [43, 'G,,'],
    [44, '^G,,'],
    [45, 'A,,'],
    [46, '^A,,'],
    [47, 'B,,'],
    [48, 'C,'],
    [49, '^C,'],
    [50, 'D,'],
    [51, '^D,'],
    [52, 'E,'],
    [53, 'F,'],
    [54, '^F,'],
    [55, 'G,'],
    [56, '^G,'],
    [57, 'A,'],
    [58, '^A,'],
    [59, 'B,'],
    [60, 'C'],
    [61, '^C'],
    [62, 'D'],
    [63, '^D'],
    [64, 'E'],
    [65, 'F'],
    [66, '^F'],
    [67, 'G'],
    [68, '^G'],
    [69, 'A'],
    [70, '^A'],
    [71, 'B'],
    [72, 'C\''],
    [73, '^C\''],
    [74, 'D\''],
    [75, '^D\''],
    [76, 'E\''],
    [77, 'F\''],
    [78, '^F\''],
    [79, 'G\''],
    [80, '^G\''],
    [81, 'A\''],
    [82, '^A\''],
    [83, 'B\''],
    [84, 'C\'\''],
    [85, '^C\'\''],
    [86, 'D\'\''],
    [87, '^D\'\''],
    [88, 'E\'\''],
    [89, 'F\'\''],
    [90, '^F\'\''],
    [91, 'G\'\''],
    [92, '^G\'\''],
    [93, 'A\'\''],
    [94, '^A\'\''],
    [95, 'B\'\''],
    [96, 'C\'\'\''],
    [97, '^C\'\'\''],
    [98, 'D\'\'\''],
    [99, '^D\'\'\''],
    [100, 'E\'\'\''],
    [101, 'F\'\'\''],
    [102, '^F\'\'\''],
    [103, 'G\'\'\''],
    [104, '^G\'\'\''],
    [105, 'A\'\'\''],
    [106, '^A\'\'\''],
    [107, 'B\'\'\''],
    [108, 'C\'\'\'\'']]);

  observer: Observable<Note>;

  constructor() {
    this.observer = new Observable<Note>(observer => {
      navigator.requestMIDIAccess().then(access => {

        const inputs = access.inputs.values();
        for (const device of inputs) {

          console.log(device.name);
          console.log(device);
          device.onmidimessage = (e) => {
            const type = e.data[0];
            const key = e.data[1];
            const hardness = e.data[2];
            // console.log(e.data);
            if (hardness > 0 /*&& type === 144*/) {
              observer.next(new Note(key, hardness));
            }
          };
        }
      }
      );
    }
    );
  }

  getNoteListener(): Observable<Note> {
    return this.observer;
  }
}
