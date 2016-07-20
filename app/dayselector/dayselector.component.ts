import { Component, OnInit, NgZone, Input, SimpleChanges, EventEmitter, Output  } from '@angular/core';
import * as moment from 'moment';

import { DATEPICKER_DIRECTIVES } from './datepicker/datepicker';


import {CORE_DIRECTIVES} from '@angular/common';
import {FORM_DIRECTIVES} from '@angular/forms';


@Component({
  selector: 'day-selector',
  directives: [DATEPICKER_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES],
  template: `
  <div class="row" style="display:inline-block; min-height:290px;" >
     <div *ngIf="independentDatepickers">
     <datepicker *ngFor="let relativeIndex of numberOfDatepickersAsArray; let i = index"
                 [mainCalendar]="true"
                 [rangeMode]="rangeMode"
                 [activeDate]="getActiveDate(i)"
                 class="md-col-4"
                 style="display:inline-block;"
                 [(ngModel)]="selectedDates"
                 [showWeeks]="true"
                 [singleDateSelection]="singleDateSelection"
                 [minDate]="minDate"
                 [maxDate]="maxDate"
                 [minMode]="minMode"
                 [maxMode]="maxMode"
                 [initDate]="initDate"
                 [showWeeks]="showWeeks"
                 [formatDay]="formatDay"
                 [formatMonth]="formatMonth"
                 [formatYear]="formatYear"
                 [formatDayHeader]="formatDayHeader"
                 [formatDayTitle]="formatDayTitle"
                 [formatMonthTitle]="formatMonthTitle"
                 [startingDay]="startingDay"
                 [yearRange]="yearRange"
                 [customClass]="customClass"
                 [dateDisabled]="dateDisabled"                 
                 [onlyCurrentMonth]="onlyCurrentMonth"
                 [shortcutPropagation]="shortcutPropagation"  
                 ></datepicker>
     </div>
     <div *ngIf="!independentDatepickers">
     <datepicker *ngFor="let relativeIndex of numberOfDatepickersAsArray; let i = index"
                [(currentActiveDate)]="currentActiveDate"
                [mainCalendar]="isMainCalendar(relativeIndex)"
                [rangeMode]="rangeMode"
                [activeDate]="getActiveDate(i)"
                class="md-col-4"
                style="display:inline-block;"
                [(ngModel)]="selectedDates"
                [singleDateSelection]="singleDateSelection"
                [minDate]="minDate"
                [maxDate]="maxDate"
                [minMode]="minMode"
                [maxMode]="maxMode"
                [initDate]="initDate"
                [showWeeks]="showWeeks"
                [formatDay]="formatDay"
                [formatMonth]="formatMonth"
                [formatYear]="formatYear"
                [formatDayHeader]="formatDayHeader"
                [formatDayTitle]="formatDayTitle"
                [formatMonthTitle]="formatMonthTitle"
                [startingDay]="startingDay"
                [yearRange]="yearRange"
                [customClass]="customClass"
                [dateDisabled]="dateDisabled"                
                [onlyCurrentMonth]="onlyCurrentMonth"
                [shortcutPropagation]="shortcutPropagation">
                </datepicker>
     </div>
     `
})
export class DaySelectorComponent {
  @Input() public initDate: Date;
  @Input() public minDate: Date;
  @Input() public maxDate: Date;
  @Input() public minMode: string;
  @Input() public maxMode: string;
  @Input() public showWeeks: boolean = true;
  @Input() public formatDay: string;
  @Input() public formatMonth: string;
  @Input() public formatYear: string;
  @Input() public formatDayHeader: string;
  @Input() public formatDayTitle: string;
  @Input() public formatMonthTitle: string;
  @Input() public startingDay: number;
  @Input() public yearRange: number;
  @Input() public onlyCurrentMonth: boolean;
  @Input() public shortcutPropagation: boolean;
  @Input() public customClass: Array<{ date: Date, mode: string, clazz: string }>;
  // todo: change type during implementation
  @Input() public dateDisabled: any;


  @Input() public independentDatepickers: boolean = false;
  @Input() public numberOfDatepickers: number = 3; // Default number of date pickers
  @Input() public singleDateSelection: boolean = false;
  @Input() public noMainDatepickers: boolean = false;


  @Input() public currentActiveDate: Date;
  @Output() public currentActiveDateChange: any = new EventEmitter();

  public activeDates: Array<any>;
  public activeDateInited: boolean = false;
  public numberOfDatepickersAsArray: Array<number> = [];
  public rangeMode: any = { active: false, dates: [], timer: 0 };
  public formattedDates: Array<Date> = [];


  @Input() public selectedDates: Array<any> = [];
  private opened: boolean = false;
  public oldCurrentActiveDate: any = this.currentActiveDate;
  public constructor(private ref: NgZone) {

  }

  public isMainCalendar(relativeIndex: number): boolean {        
    if (!this.noMainDatepickers && relativeIndex === 0) {
      return true;
    } else {
      return false;
    }

  }

  public getActiveDate(i: number) {
    console.log("GetActiveDate ran");
    if (typeof (this.activeDates) !== 'undefined') {
      return this.activeDates[i];
    } else {
      return new Date();
    }
  }

  public refreshCalendars() {
    for (let i = 0; i < this.numberOfDatepickersAsArray.length; i++) {
      if (this.numberOfDatepickersAsArray[i] === 0) {
        this.activeDates[i] = this.currentActiveDate;
      } else {
        this.activeDates[i] = moment(this.currentActiveDate).add(this.numberOfDatepickersAsArray[i], 'month').toDate();
      }
    }
  }

  ngDoCheck() {
    // If main calendar changes the others should update
    if (this.currentActiveDate !== this.oldCurrentActiveDate) {
      this.oldCurrentActiveDate = this.currentActiveDate;
      this.currentActiveDateChange.emit(this.currentActiveDate);
      this.refreshCalendars();
    }
  }

  ngAfterViewInit() {
    this.activeDates = Array(this.numberOfDatepickers).fill(new Date());
    // Init active dates for each datepicker
    if (this.independentDatepickers === true) {
      for (let i = 0; i < this.numberOfDatepickersAsArray.length; i++) {
        this.activeDates[i] = moment(this.currentActiveDate).add(this.numberOfDatepickersAsArray[i], 'month').toDate();
      }
    } else {
      this.refreshCalendars();
    }
  }
  
  ngAfterContentInit() {
    if (typeof (this.currentActiveDate) === 'undefined') {
      this.currentActiveDate = new Date();
    }
    // Init date positions
    if (this.singleDateSelection) {
      this.selectedDates.push(new Date());
    }


    let relativeIndex = Math.ceil(this.numberOfDatepickers / 2) -1;
    for (let i = 0; i < this.numberOfDatepickers; i++) {
      this.numberOfDatepickersAsArray.push(i - relativeIndex);
    }
  }


}
