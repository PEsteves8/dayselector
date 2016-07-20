import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class RangeModeService {
  // Observable string sources
  //private rangeModeOnSource = new Subject<boolean>();
  //private rangeModeDatesSource = new Subject<Array<any>>();
  //private rangeModeDates: Array<any> = [];

  public isRangeModeOn: boolean = false;
  public rangeModeDates: Array<any> = [];  


  ///rangeModeOn$ = this.rangeModeOnSource.asObservable();
  //rangeModeDates$ = this.rangeModeDatesSource.asObservable();


  // Observable string streams
  //missionAnnounced$ = this.missionAnnouncedSource.asObservable();
  //missionConfirmed$ = this.missionConfirmedSource.asObservable();
  // Service message commands

//  rangeModeOn(newwords: string) {
      //this.rangeModeOnSource.next(state);

     // this.poo = newwords;


// }
 
/* rangeModeDates(dates: Array<any>) {
    this.rangeModeDatesSource.next(dates);
  }*/
}