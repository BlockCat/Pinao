import { Note } from './midi-service.service';

export class NoteLearnService {

  private unseenNoteBucket = new Set<number>();
  private levelBuckets: Set<number>[] = [
    new Set<number>(),
    new Set<number>(),
    new Set<number>(),
    new Set<number>(),
    new Set<number>()
  ];

  private currentQueue: Note[] = [];

  private level = 400;

  constructor(start: number, end: number) {
    for (let i = start; i <= end; i++) {
      this.unseenNoteBucket.add(i);
    }
  }

  hasNext(): boolean {
    return !this.isCompleted();
  }

  next(): Note {
    if (this.currentQueue.length > 0) {
      return this.currentQueue.shift();
    } else {
      this.levelUp();
      this.fillLevelQueue();
      return this.next();
    }
  }

  // * notes(): Generator<Note> {
  //   while (!this.isCompleted()) {
  //     if (this.currentQueue.length > 0) {
  //       yield this.currentQueue.shift();
  //     } else {

  //       this.levelUp();
  //       this.fillLevelQueue();
  //     }
  //   }
  // }

  upgradeNote(note: Note): void {
    let i = 0;
    let layer = 0;
    for (const set of this.levelBuckets) {
      if (set.delete(note.key)) {
        layer = Math.min(i + 1, this.levelBuckets.length - 1);
      }
      i++;
    }

    this.levelBuckets.forEach(x => x.delete(note.key));
    this.levelBuckets[layer].add(note.key);
  }

  downgradeNote(note: Note): void {
    if (this.levelBuckets.some(x => x.delete(note.key))) {
      this.levelBuckets[0].add(note.key);
    }
  }

  isCompleted(): boolean {
    if (this.unseenNoteBucket.size > 0) {
      return false;
    }
    if (this.currentQueue.length > 0) {
      return false;
    }
    for (let i = 0; i < this.levelBuckets.length - 1; i++) {
      if (this.levelBuckets[i].size > 0) {
        return false;
      }
    }
    return true;
  }

  private levelUp(): void {
    this.level++;
    if (this.level >= this.levelBuckets.length) {
      this.level = 0;
      const newNotes = 3;
      for (let i = 0; i < newNotes; i++) {
        const ssss = Array.from(this.unseenNoteBucket);
        const note = ssss[Math.floor(Math.random() * this.unseenNoteBucket.size)];
        this.unseenNoteBucket.delete(note);
        this.levelBuckets[0].add(note);
      }
    }
  }

  private fillLevelQueue(): void {
    this.currentQueue = [];
    for (let i = 0; i <= this.level; i++) {
      //console.log(i, this.levelBuckets[i]);
      this.levelBuckets[i].forEach(l => {
        this.currentQueue.push(new Note(l, 1, 2));
      });
    }

    this.shuffleArray();

  }

  private shuffleArray(): void {
    for (let i = this.currentQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.currentQueue[i], this.currentQueue[j]] = [this.currentQueue[j], this.currentQueue[i]];
    }
  }




}
