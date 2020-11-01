import { Component, OnInit, NgZone } from '@angular/core';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { take, map, takeWhile, takeUntil } from 'rxjs/operators';
import { MidiServiceService, Note } from '../midi-service.service';
import { NoteLearnService } from '../note-learn.service';
import { SheetService } from '../sheet.service';
import { Timer } from '../timer';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.sass']
})
export class LearnComponent implements OnInit {

  speed = 3;
  activeNoteService = new NoteLearnService(60, 84);
  timer = new Timer();

  subscription: Subscription;
  observable: Observable<number>;
  countLeft: number | String;
  currentNote: Note;

  constructor(private zone: NgZone, private sheetService: SheetService, private midiService: MidiServiceService) {
    this.sheetService.clear();
    this.midiService.getNoteListener().subscribe(x => this.onNoteEvent(x));
    this.startUpperService();
  }

  startUpperService() {
    this.activeNoteService = new NoteLearnService(60, 84);
    this.sheetService.clear();
    this.sheetService.setUpperEnabled(true);
    this.sheetService.setLowerEnabled(false);
    this.startNoteShow();
  }

  startLowerService() {
    this.activeNoteService = new NoteLearnService(40, 64);
    this.sheetService.clear();
    this.sheetService.setUpperEnabled(false);
    this.sheetService.setLowerEnabled(true);
    this.startNoteShow();
  }

  startWithSeconds(number: number) {
    this.speed = number;
    this.startNoteShow();
  }

  onNoteEvent(onNoteEvent: Note) {
    if (this.currentNote) {
      if (this.currentNote.key !== onNoteEvent.key) {
        this.failed(this.currentNote);
        // this.activeNoteService.downgradeNote(onNoteEvent);
      } else {
        this.succeed(this.currentNote);
      }
    }
  }

  succeed(note: Note) {
    // if (this.subscription.closed) {
    // this.failed(note);
    // this.startNoteShow();
    {
      this.stopTimer();
      this.activeNoteService.upgradeNote(note);
      this.startNoteShow();
    }
  }

  failed(note: Note) {
    this.stopTimer();
    this.activeNoteService.downgradeNote(note);
    this.zone.run(() => {
      this.countLeft = 'Failed the note';
    });
    // this.startNoteShow();
  }

  ngOnInit(): void {
    this.sheetService.draw('paper');
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  startNoteShow() {
    this.showNote().then(x => {
      this.zone.run(() => {
        this.countLeft = 'Failed the timer';
      });
    });
  }

  showNote(): Promise<Note> {
    return new Promise((resolve, reject) => {
      if (this.subscription != null && !this.subscription.closed) {
        this.subscription.unsubscribe();
      }
      if (this.activeNoteService.hasNext()) {
        const note = this.activeNoteService.next();

        this.sheetService.clear();
        //this.sheetService.setLowerEnabled(false);
        this.sheetService.upper = [[note]];
        this.sheetService.bottom = [[note]];
        this.sheetService.draw('paper');

        this.currentNote = note;

        this.observable = this.timer.createTimer(this.speed);
        this.subscription = this.observable.subscribe(
          (number: number) => {
            this.zone.run(() => {
              this.countLeft = number;
            });
          },
          () => { reject(); },
          () => { resolve(note); }
        );
      }
    });
  }

  stopTimer() {
    this.subscription.unsubscribe();
  }
}
