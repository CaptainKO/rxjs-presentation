import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { fromEvent, Observable, Subscription } from "rxjs";
import { tap, map } from "rxjs/operators";


class FakeObservable {
  public observers: any[] = [];

  public subscribe(observers: any) {
    this.observers.push(observers);
    return ()=> this.unsubscribe(observers);
  }

  public unsubscribe(handler: any) {
    let index = this.observers.findIndex((obs) => obs === handler);
    if (index !== -1) {
      console.log('Unsubscribed from', handler);
      this.observers.splice(index, 1);
    }
  }

  public notify(data: any) {
    this.observers.forEach(subscriber => subscriber(data));
  }
}

@Component({
  selector: 'app-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.scss'],
  providers: [
    { provide: "windowObject", useValue: window }
  ]
})
export class PatternComponent implements OnInit {


  // test pattern Obser
  private _id: any;
  constructor(@Inject('windowObject') window) {

    let obs = new FakeObservable();
    window.
    window.unsub1 = obs.subscribe((data: any) => console.log(`Observer 1:`, data));
    window.unsub2 = obs.subscribe((data: any) => console.log(`Observer 2:`, data));
    window.unsub3 = obs.subscribe((data: any) => console.log(`Observer 3:`, data));

    this._id = setInterval(() => {
      obs.notify('called');
    }, 2000);

  }

  // event$
  ngOnInit() {
    this.userInput$ = fromEvent(this.userInput.nativeElement, 'keydown')
      .pipe(
        map(({ target: { value } }) => value)
      );
  }

  @ViewChild('userInput', { static: true }) userInput: ElementRef;
  userInput$: Observable<any>;

  isSubscribed = [false, false];
  subValues: string[] = [];
  subscription: Subscription[] = [];


  subscribe(index: number) {
    this.subscription[index] = this.userInput$
      .subscribe(
        (value) => {
          this.subValues[index] = value;
          console.log(value);
        });
    this.isSubscribed[index] = true;
  }

  unsubscribe(index: number) {
    this.subscription[index].unsubscribe();
    this.isSubscribed[index] = false;
  }

  ngOnDestroy(): void {
    clearInterval(this._id)
  }
}



