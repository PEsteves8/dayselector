import { Component, OnInit, NgZone, Input, SimpleChanges, EventEmitter, Output, Self  } from '@angular/core';
import {FORM_DIRECTIVES, ControlValueAccessor, NgModel} from '@angular/forms';

import * as moment from 'moment';

import { DATEPICKER_DIRECTIVES } from './datepicker/datepicker';


import {CORE_DIRECTIVES} from '@angular/common';



@Component({
  selector: 'day-selector[ngModel]',
  directives: [DATEPICKER_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES],
  template: `
  <div class="row" style="display:inline-block; min-height:290px;" >
     <div *ngIf="independentDatepickers">
     <datepicker *ngFor="let relativeIndex of numberOfDatepickersAsArray; let i = index"
     [selectedDates]="selectedDates.model"
                 [mainCalendar]="true"
                 [rangeMode]="rangeMode"
                 [activeDate]="getActiveDate(i)"
                 class="md-col-4"
                 style="display:inline-block;"
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
                 [dateButtonSize]="dateButtonSize" 
                 ></datepicker>
     </div>
     <div *ngIf="!independentDatepickers">
     <datepicker *ngFor="let relativeIndex of numberOfDatepickersAsArray; let i = index"
                [selectedDates]="selectedDates.model"
                [(currentActiveDate)]="currentActiveDate"
                [mainCalendar]="isMainCalendar(relativeIndex)"
                [rangeMode]="rangeMode"
                [activeDate]="getActiveDate(i)"
                class="md-col-4"
                style="display:inline-block;"
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
                [dateButtonSize]="dateButtonSize">
                </datepicker>
     </div>
     `
})
export class DaySelectorComponent implements ControlValueAccessor {
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

  @Input() public dateButtonSize: string = 'sm';

  public onChange: any = Function.prototype;
  public onTouched: any = Function.prototype;


  @Input() public independentDatepickers: boolean = false;
  @Input() public numberOfDatepickers: number = 3; // Default number of date pickers
  @Input() public singleDateSelection: boolean = false;
  @Input() public noMainDatepickers: boolean = false;


  @Input() public currentActiveDate: Date;
  @Output() public currentActiveDateChange: EventEmitter<Date> = new EventEmitter();

  public activeDates: Array<Date>;
  public activeDateInited: boolean = false;
  public numberOfDatepickersAsArray: Array<number> = [];
  public rangeMode: Object = { active: false, dates: [], timer: 0 };
  public formattedDates: Array<Date> = [];


  public selectedDates: NgModel;
  private opened: boolean = false;
  public oldCurrentActiveDate: Date = this.currentActiveDate;

  public constructor( @Self() selectedDates: NgModel, private ref: NgZone) {

    this.selectedDates = selectedDates;
    // hack
    selectedDates.valueAccessor = this;

  }

  public isMainCalendar(relativeIndex: number): boolean {
    if (!this.noMainDatepickers && relativeIndex === 0) {
      return true;
    } else {
      return false;
    }

  }

  public getActiveDate(i: number) {

    //console.log("GetActiveDate ran"); 
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
      this.selectedDates.model.push(new Date());
    }


    let relativeIndex = Math.ceil(this.numberOfDatepickers / 2) - 1;
    for (let i = 0; i < this.numberOfDatepickers; i++) {
      this.numberOfDatepickersAsArray.push(i - relativeIndex);
    }
  }

  public writeValue(value: any): void {

  }

  public registerOnChange(fn: (_: any) => {}): void { this.onChange = fn; }

  public registerOnTouched(fn: () => {}): void { this.onTouched = fn; }


}
