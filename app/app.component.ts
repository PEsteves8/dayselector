import { Component } from '@angular/core';
import { DaySelectorComponent } from './dayselector/dayselector.component';
import * as moment from 'moment';

@Component({
    selector: 'my-app',
    template: `
<h1>Day Selector</h1>

<h3>Standard - 3 datepickers - Hold the mouse and let go for range mode </h3>
<h5>Clicking on the week number selects the week row</h5>
                  <day-selector [(ngModel)]="selectedDates1"
                  [(currentActiveDate)]="currentActiveDate1" 
                  [independentDatepickers]="false"
                  [numberOfDatepickers]="3"
                  [singleDateSelection]="false"                 
                  [noMainDatepickers]="false"                  
                  [minDate]="minDate"
                  [maxDate]="maxDate">                  
                  </day-selector>                  
                  <br>
                  <button (click)="clearDates()">Clear dates</button>
                  <button (click)="goToToday()">Go to today</button>
                  <button (click)="goTo21052017()">Go to 2017/05/21</button>
                  <button (click)="setMaxDate28052017()">Set max date at 2017/05/28</button>
                  <button (click)="moveMonths1(-1)">Previous month</button>
                  <button (click)="moveMonths1(1)">Next month</button>
                  <h3> Number of Dates picked = {{ selectedDates1.length }} (Selected dates array -Date- length)</h3>
                  <hr>
<!-------------------------------------------------------------------------------------------------------------------->
                  <h3>2 datepickers with independent controls - Range mode on with mouse hold as well</h3>
                  <day-selector [(ngModel)]="selectedDates2"
                  [(currentActiveDate)]="currentActiveDate2" 
                  [independentDatepickers]="true"
                  [numberOfDatepickers]="2"
                  [singleDateSelection]="false">
                  </day-selector>
                  <h3> Number of Dates picked = {{ selectedDates2.length }} (Selected dates array -Date- length)</h3>
                  <hr>
<!-------------------------------------------------------------------------------------------------------------------->
                  <h3>5 datepickers, xs, single selection no individual controls. Only with the buttons below</h3>
                  <day-selector [(ngModel)]="selectedDates3"
                  [(currentActiveDate)]="currentActiveDate3" 
                  [independentDatepickers]="false"
                  [numberOfDatepickers]="5"
                  [noMainDatepickers]="true"
                  [singleDateSelection]="true"
                  dateButtonSize="xs">
                  </day-selector><br>
                  <button (click)="moveMonths3(-1)">Previous month</button>
                  <button (click)="moveMonths3(1)">Next month</button>
                  <h3> Number of Dates picked = {{ selectedDates3.length }} (Selected dates array -Date- length)</h3>
                  <hr>
<!-------------------------------------------------------------------------------------------------------------------->
                  <h3>Single datepicker with single date selection, md</h3>
                  <day-selector [(ngModel)]="selectedDates4"
                  [(currentActiveDate)]="currentActiveDate4" 
                  [numberOfDatepickers]="1"
                  [singleDateSelection]="true"
                  dateButtonSize="md">
                  </day-selector>
                  <h3> Number of Dates picked = {{ selectedDates4.length }} (Selected dates array -Date- length)</h3>       
    `,
    directives: [DaySelectorComponent]
})
export class AppComponent {


    constructor() { }



    private clearDates() {
        this.selectedDates1.length = 0;
    }

    private goToToday() {
        this.currentActiveDate1 = new Date();
    }
    private goTo21052017() {
        this.currentActiveDate1 = new Date(2017, 4, 21);
    }

    private setMaxDate28052017() {
        this.maxDate = new Date(2017, 4, 28);
    }

    private moveMonths1(step: number) {
        // You could of course use a Date instead of moment for this
        // Normalize for day 1
        this.currentActiveDate1 = moment(this.currentActiveDate1).day(1).add(step, 'month').toDate();
    }

    private moveMonths3(step: number) {
        // You could of course use a Date instead of moment for this
        // Normalize for day 1
        this.currentActiveDate3 = moment(this.currentActiveDate3).day(1).add(step, 'month').toDate();
    }

    private currentActiveDate1: any = new Date(); // Set to today or any other date you want to start with
    private currentActiveDate2: any = new Date(); // Set to today or any other date you want to start with
    private currentActiveDate3: any = new Date(); // Set to today or any other date you want to start with
    private currentActiveDate4: any = new Date(); // Set to today or any other date you want to start with
    private selectedDates1: Array<any> = [];
    private selectedDates2: Array<any> = [];
    private selectedDates3: Array<any> = [];
    private selectedDates4: Array<any> = [];
    private dateButtonSize1: any = 'xs';
    private maxDate: Date;
    private minDate: Date = new Date(2016, 5, 26); // Months begin at 0, so this translates to May

}
