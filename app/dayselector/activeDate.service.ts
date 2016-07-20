import { Injectable, EventEmitter } from '@angular/core';
import { Subject }    from 'rxjs/subject';
@Injectable()
export class ActiveDateService {
  public activeDateSource = new Subject<any>();

  public activeDateChange = new EventEmitter<any>();
 



constructor() { }

 
  // Service message commands
  notifyDate(num: any) {
      console.log("notifyDate ran");
     // console.log("notifyDate triggered " + num + " waaaaah?");
    this.activeDateSource.next(5);
  }
 
}