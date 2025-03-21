import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  clickCount = signal<number>(0);
  clickCount$ = toObservable(this.clickCount)
  interval$ = interval(1000)
  intervalSignal = toSignal(this.interval$, {initialValue: 0}) // pay attention that without initial value obseravle start with no value
  // so initial value presented is empty
  // but after adding initial value the obseravle that was returned from interval had no value
  // but signal has initial value
  
  // new custom obsrvalbe - in the contractor it receive a fucntion with subscriber
  //and every time we subscribe to the subscriber the function will be called
  customInterval$ = new Observable((subscriber) => {
    let completeCount = 0
    const interval = setInterval(() => {
      if (completeCount >= 5) {
        // afte 5 tiems the observalbe is completed, and no more values will be emitted
        clearInterval(interval)
        subscriber.complete()
        return;
      }
      console.log("Emitting new value ...")
      subscriber.next({message: 'New Value'})
      completeCount++
    }, 2000) 
  })
  // interval = signal<number>(0)
  // doubleInterval = computed(() => this.interval() * 2)
  constructor(){
    // effect(()=> {
    //   console.log(`button was clicked ${this.clickCount()} times`)
    // })
  }
  ngOnInit(): void {
    // setInterval(() => {
    //   this.interval.update(prevValueNumber => 
    //     prevValueNumber + 1
    //   )
    // }, 1000);
    // const subscription = interval(1000).pipe(
    //   // we will pass a function to map and the new value wil be repalced as observalbe value
    //   map((val) => val * 2)
    // ).subscribe({ //rxjs function that create observalbe
    //   // if not subscribing the interval no observer will be created
    //   // using pipe operator and then we can add more operators
    //   next: (val) => console.log('val', val)
    // });
    // this.destroyRef.onDestroy(() => {
    //   subscription.unsubscribe()
    // });
    const subscription = this.clickCount$.subscribe({
      next:  clickCount => console.log(`button was clicked ${clickCount} times`)
        ,
      complete: () =>  console.log('button was clicked 5 times and completed')
        ,
    })
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe()
    });
    this.customInterval$.subscribe({
      next: (val) => console.log(val)
    })
  }
  // using signal that will be updated in each click
  onClick() {
    this.clickCount.update(prevCount => prevCount + 1)
  }

}


