import { Observable, Subscription, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';

export class Timer {
  running: boolean;

  createTimer(seconds: number): Observable<number> {
    console.log('started timer with ' + seconds + ' seconds');
    const steps = 100;

    const count = seconds * steps;
    const counter = timer(0, 1000 / steps).pipe(
      take(seconds * steps + 1),
      map((x: number) => (count - x) / steps)
    );

    return counter;
  }

  // startTimer(seconds: number, tick: (n: number) => void, complete: () => void): Observable<number> {
  //   console.log('start timer');
  //   if (this.subscription == null || this.subscription.closed) {

  //     const steps = 100;

  //     this.running = true;
  //     this.count = seconds * steps;

  //     const counter = timer(0, 1000 / steps).pipe(
  //       take(seconds * steps + 1),
  //       map((x: number) => {
  //         return (this.count - x) / steps;
  //       })
  //     );

  //     this.subscription = counter.subscribe(x => tick(x));
  //     counter.toPromise().then(x => {
  //       if (this.subscription.closed && this.running) {
  //         this.subscription.unsubscribe();
  //         complete();
  //       }
  //     });

  //     return counter;

  //   } else {
  //     this.subscription.unsubscribe();
  //     return this.startTimer(seconds, tick, complete);
  //   }
  // }

  // stopTimer(): void {
  //   this.running = false;
  //   this.subscription.unsubscribe();
  // }

}
