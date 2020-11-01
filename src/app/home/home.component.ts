import { Component, OnInit } from '@angular/core';
import { from, Observable, Subscription } from 'rxjs';
import { MidiServiceService, Note } from '../midi-service.service';
import { NoteLearnService } from '../note-learn.service';
import { SheetService } from '../sheet.service';
import { Timer } from '../timer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  abc = `X: 4
L: 1/16
K: Dmin
V:V1 clef=treble
V:V2 clef=bass
[V:V1] [C,,,,]
[V:V2] [C]
[V:V1] [DF][GG]
[V:V2] `;


  constructor(private sheetService: SheetService, private midiService: MidiServiceService) { }

  midiListener: Subscription;
  noteLearnService = new NoteLearnService(60, 84);
  timer = new Timer();
  timerRunning = false;

  subscription: Subscription;
  observable: Observable<number>;
  countLeft: number | String;

  ngOnInit(): void {

    this.sheetService.draw('paper');
    this.midiListener = this.midiService.getNoteListener().subscribe(x => {
      this.sheetService.clear();
      this.sheetService.upper = [[x]];
      this.sheetService.bottom = [[x]];

      this.sheetService.draw('paper');
    });

    this.timerRunning = true;

    const startNote = (note: Note) => {
      this.showNote().then(startNote);
    };
    this.showNote().then(startNote);
  }

  ngOnDestroy() {
    this.stopTimer();
    this.midiListener.unsubscribe();
    this.sheetService.clear();
    this.timerRunning = false;
    console.log("exit view");
  }

  showNote(): Promise<Note> {
    return new Promise((resolve, reject) => {
      if (this.subscription != null && !this.subscription.closed) {
        this.subscription.unsubscribe();
      }
      if (this.noteLearnService.hasNext()) {
        const note = this.noteLearnService.next();

        this.sheetService.clear();
        this.sheetService.setLowerEnabled(false);
        this.sheetService.upper = [[note]];
        this.sheetService.draw('paper');

        this.observable = this.timer.createTimer(1.0);
        this.subscription = this.observable.subscribe(
          (number: number) => { this.countLeft = number; },
          () => { reject(); },
          () => { resolve(note); }
        );
      }
    });
  }

  stopTimer() {
    this.timerRunning = false;
    this.subscription.unsubscribe();
  }

  randomIntFromInterval(min: number, max: number): number { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
