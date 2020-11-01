import { Note } from './midi-service.service';

export class SheetBar {
  public barType: BarType = BarType.TREBLE;
  public notes: Note[][];

  build(name: String, maxNotes: number, length: number): String[] {
    let m = '[' + name + '] ';
    return this.parseNotes(this.notes, maxNotes).map(x => m + x + '\n');
  }

  private parseNotes(notegroup: Note[][], maxNotes: number): string[] {
    let notes = [];
    for (let i = 0; i < notegroup.length; i += maxNotes) {
      const chunk = notegroup.slice(i, i + maxNotes);
      const line = chunk.map(x => '[' + x.map(n => n.getNote() + n.duration).join('') + ']');
      let lineString = '';
      for (let j = 0; j < chunk.length; j += 4) {
        lineString += (line.splice(j, j + 4).join(''));
      }

      notes.push(lineString);
    }
    return notes;
  }
}

export class SheetBuilder {

  public sheetBars: SheetBar[];
  public standardLength: number = 4;
  public baseNoteLength: number = 8;
  public chord: Chord = Chord.C_MAJOR;
  public title: string = null;

  public maxNotesPerLine = 70;


  build(): string {
    let m = '';

    if (this.title) {
      m += 'T:' + this.title + '\n';
    }
    m += 'X:' + this.standardLength + '\n';
    m += 'L: 1/8\n';
    m += 'K: ' + this.chord.toString() + '\n';

    this.sheetBars.forEach((x: SheetBar, i: number) => {
      m += 'V:V' + i + ' clef=' + x.barType.toString() + '\n';
    });

    const lines = this.sheetBars.map((x, i) =>
      x.build('V:V' + i, this.maxNotesPerLine, this.standardLength)
    );

    const maxLine = lines.map(x => x.length);
    const mmmm = Math.max(...maxLine);

    for (let i = 0; i < mmmm; i++) {
      for (let j = 0; j < lines.length; j++) {
        if (i < lines[j].length) {
          m += lines[j][i];
        }
      }
    }

    return m;
  }
}

export enum BarType {
  TREBLE = 'treble',
  BASS = 'bass',
}

export enum Chord {
  A_MAJOR = 'A',
  A_MINOR = 'Amin',
  B_MAJOR = 'B',
  B_MINOR = 'Bmin',
  C_MAJOR = 'C',
  C_MINOR = 'Cmin',
  D_MAJOR = 'C',
  D_MINOR = 'Dmin'
}
