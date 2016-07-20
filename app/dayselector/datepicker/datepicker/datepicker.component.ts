import {Component, Self, Input, Output, EventEmitter } from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {FORM_DIRECTIVES, ControlValueAccessor, NgModel} from '@angular/forms';
import {DatePickerInnerComponent} from './datepicker-inner.component';
import {DayPickerComponent} from './daypicker.component';
import {MonthPickerComponent} from './monthpicker.component';
import {YearPickerComponent} from './yearpicker.component';

import * as moment from 'moment';

// import {DatePickerPopup} from './datepicker-popup';

/* tslint:disable:component-selector-name component-selector-type */
@Component({
  selector: 'datepicker[ngModel]',
  template: `
    <datepicker-inner [(activeDate)]="activeDate"
                      (update)="onUpdate($event)"
                      [datepickerMode]="datepickerMode"
                      [initDate]="initDate"
                      [minDate]="minDate"
                      [maxDate]="maxDate"
                      [minMode]="minMode"
                      [maxMode]="maxMode"
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
                      [templateUrl]="templateUrl"
                      [onlyCurrentMonth]="onlyCurrentMonth"
                      [shortcutPropagation]="shortcutPropagation"
                      [selectedDates]="selectedDates"
                      (click)="mainCalendar && refresh()">
      <daypicker [singleDateSelection]="singleDateSelection" [mainCalendar]="mainCalendar" [(rangeMode)]="rangeMode" tabindex="0"></daypicker>
      <monthpicker tabindex="0"></monthpicker>
      <yearpicker tabindex="0"></yearpicker>
    </datepicker-inner>
    `,
  directives: [DatePickerInnerComponent, DayPickerComponent, MonthPickerComponent, YearPickerComponent,
    FORM_DIRECTIVES, CORE_DIRECTIVES]
})
/* tslint:enable:component-selector-name component-selector-type */
export class DatePickerComponent implements ControlValueAccessor {
  @Input() public datepickerMode: string;
  @Input() public initDate: Date;
  @Input() public minDate: Date;
  @Input() public maxDate: Date;
  @Input() public minMode: string;
  @Input() public maxMode: string;
  @Input() public showWeeks: boolean;
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

  @Input() public currentActiveDate: any;
  @Output() public currentActiveDateChange: any = new EventEmitter();

  @Input() public singleDateSelection: boolean;
 
  @Input() public rangeMode: { active: boolean, dates: Array<any>, timer: number };
  @Output() public rangeModeChange: EventEmitter<Object> = new EventEmitter();

  @Input() public mainCalendar: boolean;

  public onChange: any = Function.prototype;
  public onTouched: any = Function.prototype;

  public selectedDates: NgModel;
  private _now: Date = new Date();
  private _activeDate: Date;

  @Input()
  public get activeDate(): Date {
    return this._activeDate || this._now;
  }


  public constructor( @Self() selectedDates: NgModel) {

    this.selectedDates = selectedDates;
    // hack
    selectedDates.valueAccessor = this;
  }

  public set activeDate(value: Date) {
    this._activeDate = value;
  }
  
  refresh() {    
    this.currentActiveDateChange.emit(this.activeDate);    
  }
  
  public onUpdate(event: any): void {

    let dates = this.selectedDates.model;

    if (Array.isArray(event)) {
      let datesAsString = dates.map((date: any) => { return date.toString() });
      let newDates = event.map((item: any) => { return moment(item) });
      let newDatesAsString = event.map((date: any) => { return date.toString() });
      let counter: number = 0;
      if (dates.length === 0) {
        event.forEach((item: any) => {
          dates.push(item);
        });
      } else {
        newDatesAsString.forEach((newDateAsString: any, i: number) => {
          if (datesAsString.indexOf(newDateAsString) === -1) {
            dates.push(newDates[i].toDate());
            counter++;
          }
        });

        if (counter === 0) {
            event.forEach((newDate: any, newDateIndex: number) => {
            dates.forEach((date: any, dateIndex: number) => {
              if (moment(newDate).isSame(moment(date))) {
                dates.splice(dateIndex, 1);
                counter++;
              }
            });
          });

        }
      }

    } else {
      let newDate = moment(event);
      // toggle selected on/off - if date is in selected dates array remove it
      if (!this.singleDateSelection) {
        for (let i = 0; i < dates.length; i++) {
          if (moment(dates[i]).isSame(moment(newDate), 'day')) {
            dates.splice(i, 1);
            return;
          }
        }
      }
      this.writeValue(event);
      //this.selectedDates.viewToModelUpdate(event);
      // if date is not in selected dates array, include it
      if (!this.singleDateSelection) {
        dates.push(newDate.toDate());
      } else {
        dates[0] = newDate.toDate();
      }
    }


  }

  // todo: support null value
  public writeValue(value: any): void {
  
  }

  public registerOnChange(fn: (_: any) => {}): void { this.onChange = fn; }

  public registerOnTouched(fn: () => {}): void { this.onTouched = fn; }
}
