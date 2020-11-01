import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { MidiServiceService, Note } from './midi-service.service';
import abcjs from 'abcjs';
import { BarType, Chord, SheetBar, SheetBuilder } from './sheet_builder';

export enum Scale {
  Cmin = 'Cmin',
  C = 'C'
}

@Injectable({
  providedIn: 'root',

})
export class SheetService {


  scale: Chord = Chord.C_MAJOR;
  upper: Note[][];
  bottom: Note[][];
  upperEnable = true;
  lowerEnable = false;

  constructor(private midiService: MidiServiceService) {

    this.upper = [
      [new Note(60, 0, 2), new Note(61, 0, 2)],
      [new Note(60, 0, 2), new Note(61, 0, 2)],
      [new Note(60, 0, 2), new Note(61, 0, 2)],
      [new Note(60, 0, 2), new Note(61, 0, 2)],
      [new Note(60, 0, 2), new Note(61, 0, 2)],
      [new Note(60, 0, 2), new Note(61, 0, 2)],
      [new Note(60, 0, 2), new Note(61, 0, 2)],
      [new Note(60, 0, 2), new Note(61, 0, 2)],
      [new Note(60, 0, 2), new Note(61, 0, 2)],
      [new Note(60, 0, 2), new Note(61, 0, 2)],
      [new Note(60, 0, 2), new Note(61, 0, 2)],
      [new Note(60, 0, 2), new Note(61, 0, 2)],
      [new Note(60, 0, 2), new Note(61, 0, 2)],
      [new Note(60, 0, 2), new Note(61, 0, 2)],
      [new Note(60, 0, 2), new Note(61, 0, 2)],
      [new Note(60, 0, 2), new Note(61, 0, 2)],
      [new Note(60, 0, 2), new Note(61, 0, 2)],
      [new Note(60, 0, 2), new Note(61, 0, 2)]
    ];
    this.bottom = [
      [new Note(40, 0, 2), new Note(41, 0, 2)],
      [new Note(40, 0, 2), new Note(41, 0, 2)],
      [new Note(40, 0, 2), new Note(41, 0, 2)],
      [new Note(40, 0, 2), new Note(41, 0, 2)],
      [new Note(40, 0, 2), new Note(41, 0, 2)],
      [new Note(40, 0, 2), new Note(41, 0, 2)],
      [new Note(40, 0, 2), new Note(41, 0, 2)],
      [new Note(40, 0, 2), new Note(41, 0, 2)],
      [new Note(40, 0, 2), new Note(41, 0, 2)],
      [new Note(40, 0, 2), new Note(41, 0, 2)],
      [new Note(40, 0, 2), new Note(41, 0, 2)],
      [new Note(40, 0, 2), new Note(41, 0, 2)],
      [new Note(40, 0, 2), new Note(41, 0, 2)],
      [new Note(40, 0, 2), new Note(41, 0, 2)],
      [new Note(40, 0, 2), new Note(41, 0, 2)],
      [new Note(40, 0, 2), new Note(41, 0, 2)],
      [new Note(40, 0, 2), new Note(41, 0, 2)],
      [new Note(40, 0, 2), new Note(41, 0, 2)]
    ];

  }


  getMusic(): string {
    let builder = new SheetBuilder();

    builder.standardLength = 4;
    builder.baseNoteLength = 8;
    builder.chord = this.scale;
    builder.maxNotesPerLine = 70;
    builder.sheetBars = [];

    if (this.upperEnable) {
      const bar = new SheetBar();
      bar.barType = BarType.TREBLE;
      bar.notes = this.upper;

      builder.sheetBars.push(bar);
    }

    if (this.lowerEnable) {
      const bar = new SheetBar();
      bar.barType = BarType.BASS;
      bar.notes = this.bottom;
      builder.sheetBars.push(bar);
    }

    return builder.build();


    //     if (this.upperEnable && this.lowerEnable) {
    //       let m = `X: 4
    // L: 1/8
    // K: ${this.scale.toString()}
    // V:V1 clef=treble
    // V:V2 clef=bass`;
    //       const up = this.getUpperBars();
    //       const down = this.getLowerBars();

    //       for (let i = 0; i < up.length || i < down.length; i++) {
    //         m += '\n[V:V1] ';
    //         if (i < up.length) {
    //           m += up[i];
    //         }
    //         m += '\n[V:V2] ';
    //         if (i < down.length) {
    //           m += down[i];
    //         }
    //       }

    //       return m;
    //     }
    //     if (this.upperEnable) {

    //       let m = `X: 4
    // L: 1/8
    // K: ${this.scale.toString()}
    // V:V1 clef=treble`;
    //       const up = this.getUpperBars();
    //       for (const u of up) {
    //         m += '\n[V:V1] ';
    //         m += u;
    //       }
    //       return m;
    //     }

    //     if (this.lowerEnable) {
    //       let m = `X: 4
    // L: 1/8
    // K: ${this.scale.toString()}
    // V:V1 clef=bass`;
    //       const up = this.getLowerBars();
    //       for (let i = 0; i < up.length; i++) {
    //         m += '\n[V:V1] ';
    //         m += up[i];
    //       }

    //       return m;
    //     }

    //     return '';
  }

  getUpperBars(): string[] {
    return this.parseNotes(this.upper);
  }

  getLowerBars(): string[] {
    return this.parseNotes(this.bottom);
  }

  clear() {
    this.upper = [];
    this.bottom = [];
  }

  setUpperEnabled(enable: boolean): void {
    this.upperEnable = enable;
  }
  setLowerEnabled(enable: boolean): void {
    this.lowerEnable = enable;
  }

  private parseNotes(notegroup: Note[][]): string[] {
    let notes = [];
    const size = 64;
    for (let i = 0; i < notegroup.length; i += size) {
      const chunk = notegroup.slice(i, i + size);
      const line = chunk.map(x => '[' + x.map(n => n.getNote() + n.duration).join('') + ']');
      let lineString = '';
      for (let j = 0; j < chunk.length; j += 4) {
        lineString += (line.splice(j, j + 4).join(''));
      }

      notes.push(lineString);
    }
    return notes;
  }

  draw(id: string) {
    // if (document.getElementsByName(id).length > 0) {
    let t = abcjs.renderAbc(id, this.getMusic(), {
      format: {
        responsive: "resize"
      },
      scale: 2,
      add_classes: true,
      viewportHorizontal: true,
      viewportVertical: true,
    });

    // const tags = document.getElementById(id).getElementsByTagName('path');

    // for (const i in tags) {
    //   tags.item(i).removeAttribute('fill');
    //   tags.item(i).removeAttribute('stroke');
    //   // console.log(tags.item(i));
    // }
    // }
  }

  getNote(key: number, hardness: number = 140, duration: number = 1): Note {
    return new Note(key, hardness, duration);
  }
}
