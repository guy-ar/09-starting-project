import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { interval, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const subscription = interval(1000).pipe(
      // we will pass a function to map and the new value wil be repalced as observalbe value
      map((val) => val * 2)
    ).subscribe({ //rxjs function that create observalbe
      // if not subscribing the interval no observer will be created
      // using pipe operator and then we can add more operators
      next: (val) => console.log('val', val)
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe()
    });
  }

}


