import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {CORE_DIRECTIVES, NgClass} from '@angular/common';
import {FORM_DIRECTIVES} from '@angular/forms';
import {Ng2BootstrapConfig, Ng2BootstrapTheme} from '../ng2-bootstrap-config';
import {DatePickerInnerComponent} from './datepicker-inner.component';

import { RangeModeService } from './rangeMode.service';

import * as moment from 'moment';
import 'moment-range';

const TEMPLATE_OPTIONS: any = {
  [Ng2BootstrapTheme.BS4]: {
    DAY_TITLE: `
        <th *ngFor="let labelz of labels" class="text-xs-center"><small aria-label="labelz.full"><b>{{labelz.abbr}}</b></small></th>
    `,
    WEEK_ROW: `
        <td *ngIf="datePicker.showWeeks" class="text-xs-center h6"><em>{{ weekNumbers[index] }}</em></td>
        <td *ngFor="let dtz of rowz" class="text-xs-center" role="gridcell" [id]="dtz.uid">
          <button type="button" style="min-width:100%;" class="btn btn-sm {{dtz.customClass}}"
                  *ngIf="!(datePicker.onlyCurrentMonth && dtz.secondary)"
                  [ngClass]="{'btn-secondary': !dtz.selected && !datePicker.isActive(dtz), 'btn-info': dtz.selected, disabled: dtz.disabled, 'isStartRange': dtz.isStartRange. 'isEndRange', rangeMode.active}"
                  [disabled]="dtz.disabled || dtz.secondary" tabindex="-1"
                  (mousedown)="startRangeMode(dtz)" (mouseup)="cancelRangeMode()">
            <span [ngClass]="{'text-muted': dtz.secondary}, 'currentDay': dtz.current}">{{dtz.label}}</span>
          </button>
        </td>
    `,
    ARROW_LEFT: '&lt;',
    ARROW_RIGHT: '&gt;'
  },
  [Ng2BootstrapTheme.BS3]: {
    DAY_TITLE: `
        <th *ngFor="let labelz of labels" class="text-center"><small aria-label="labelz.full"><b>{{labelz.abbr}}</b></small></th>
    `,
    WEEK_ROW: `
        <td *ngIf="datePicker.showWeeks" class="text-center h6"><button (click)="toggleDaysByWeek(rowz)"><em>{{ weekNumbers[index] }}</em></button></td>
        <td *ngFor="let dtz of rowz" class="text-center" role="gridcell" [id]="dtz.uid">
          <button type="button" style="min-width:100%;" class="btn btn-default btn-sm {{dtz.customClass}}"
                  *ngIf="!(datePicker.onlyCurrentMonth && dtz.secondary)"
                  [ngClass]="{'btn-info': datePicker.isActive(dtz), disabled: dtz.disabled, secondary: dtz.secondary, 'isStartRange': checkIsStartRange(dtz), 'isEndRange': rangeMode.active}"
                  [disabled]="dtz.disabled" tabindex="-1" (mousedown)="!dtz.secondary && startRangeMode(dtz)" (mouseup)="cancelRangeMode()">
            <span [ngClass]="{'text-muted': dtz.secondary, 'currentDay': dtz.current}">{{dtz.label}}</span>
          </button>
        </td>
    `,
    ARROW_LEFT: `
    <i class="glyphicon glyphicon-chevron-left"></i>
    `,
    ARROW_RIGHT: `
    <i class="glyphicon glyphicon-chevron-right"></i>
    `
  }
};

const CURRENT_THEME_TEMPLATE: any = TEMPLATE_OPTIONS[Ng2BootstrapConfig.theme || Ng2BootstrapTheme.BS3];

@Component({
  styles: [`.currentDay {
                color: #d52121;
                font-weight: bold;
               }
             .month-title {
               background-color: white;
               color: black;
               margin-bottom: 0;
               font-weight: normal;
               text-align: center;
               white-space: nowrap;
               vertical-align: middle;
               border: 1px solid transparent;
               border-color: #ccc;
               padding: 5px 10px;
               font-size: 12px;
               line-height: 1.5;
               border-radius: 3px;           
           }
           .secondary {
             color: #A4A4A4;
             background-color: #E6E6E6 !important;
             }
           .isStartRange{
               color: white;
               background: lightgreen;
               font-weight: bold;
          }
          .isEndRange:hover {
            color: white;
            background: salmon;
            font-weight: bold;
          }`],

  selector: 'daypicker',
  events: ['updateByWeek'],
  providers: [RangeModeService],
  template: `
<table *ngIf="datePicker.datepickerMode==='day'" role="grid" aria-labelledby="uniqueId+'-title'" aria-activedescendant="activeDateId">
  <thead>
    <tr>
      <th *ngIf="mainCalendar">
        <button type="button" class="btn btn-default btn-secondary btn-sm pull-left" (click)="datePicker.move(-1)" tabindex="-1">
        ${CURRENT_THEME_TEMPLATE.ARROW_LEFT}
        </button>       
      </th>
      <th [attr.colspan]="7 + datePicker.showWeeks">
     <button *ngIf="mainCalendar"  (click)="datePicker.toggleMode()" [id]="datePicker.uniqueId + '-title'"
              type="button" class="btn btn-default btn-secondary btn-sm"              
              [disabled]="datePicker.datepickerMode === datePicker.maxMode"
              [ngClass]="{disabled: datePicker.datepickerMode === datePicker.maxMode}" tabindex="-1" style="width:100%;">
        <strong>{{title}}</strong>
      </button> 

      <div *ngIf="!mainCalendar" [id]="datePicker.uniqueId + '-title'"
              class="month-title"
              tabindex="-1" style="width:100%;" [ngStyle]="{'background-color': '#e1e1ea'}">
        <strong>{{title}}</strong>
      </div>
      </th>
      <th *ngIf="mainCalendar">
        <button type="button" class="btn btn-default btn-secondary btn-sm pull-right" (click)="datePicker.move(1)" tabindex="-1">
        ${CURRENT_THEME_TEMPLATE.ARROW_RIGHT}
        </button>
      </th> 
    </tr>
    <tr>
      <th *ngIf="datePicker.showWeeks"></th>
      ${CURRENT_THEME_TEMPLATE.DAY_TITLE}
    </tr>
  </thead>
  <tbody>
    <template ngFor [ngForOf]="rows" let-rowz="$implicit" let-index="index">
      <tr *ngIf="!(datePicker.onlyCurrentMonth && rowz[0].secondary && rowz[6].secondary)">
        ${CURRENT_THEME_TEMPLATE.WEEK_ROW}
      </tr>
    </template>
  </tbody>
</table>
  `,
  directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, NgClass]
})
export class DayPickerComponent implements OnInit {


  private rangeModeTimer: number;

  @Input() public rangeMode: { active: boolean, dates: Array<any>, timer: number };
  @Output() public rangeModeChange: EventEmitter<Object>;

  @Input() public mainCalendar: boolean;

  @Input() public singleDateSelection: boolean;


  checkIsStartRange(date: any) {
    if (this.rangeMode.dates.length > 0) {
      return moment(date.date).isSame(this.rangeMode.dates[0].date, 'day');
    }
  }

 
  addIndividualDate(date: any) {
  }

  cancelRangeMode() {
    clearTimeout(this.rangeMode.timer);
  }

  startRangeMode(date: any) {

    clearTimeout(this.rangeMode.timer);

    if (this.rangeMode.active === false) {

      this.datePicker.select(date.date);


      if (!this.singleDateSelection) {
        this.rangeMode.timer = window.setTimeout(() => {

          this.rangeMode.active = true;
          date.isStartRange = true;
          this.datePicker.select(date.date);
          this.rangeMode.dates.push(date); 
          this.rangeModeChange.emit(this.rangeMode);
        }, 300);
      }
    } else {

      if (!this.singleDateSelection) {
        this.rangeMode.dates.push(date);         
        let datesArray: any = [];

        // 'moment as any' a simple way to override the issue with moment-range's (which extends moment) typings
        var range = (moment as any).range(this.rangeMode.dates[0].date, this.rangeMode.dates[1].date);

        range.by('days', (date: any) => {
          datesArray.push(date.toDate());
        });

        this.rangeMode.dates[0].isStartRange = false;
        this.datePicker.select(datesArray);
        this.rangeMode.dates.length = 0; // Put everything in default mode
        this.rangeMode.active = false;
        this.rangeModeChange.emit(this.rangeMode);
      }

    }
  }



  public labels: Array<any> = [];
  public title: string;
  public rows: Array<any> = [];
  public weekNumbers: Array<number> = [];
  public datePicker: DatePickerInnerComponent;
  
  public updateByWeek = new EventEmitter;

  public constructor(datePicker: DatePickerInnerComponent) {
    this.rangeModeChange = new EventEmitter();
    this.datePicker = datePicker;
  }

  public ngOnInit(): void {
    let self = this;

    this.datePicker.stepDay = { months: 1 };

    this.datePicker.setRefreshViewHandler(function (): void {
      let year = this.activeDate.getFullYear();
      let month = this.activeDate.getMonth();
      let firstDayOfMonth = new Date(year, month, 1);
      let difference = this.startingDay - firstDayOfMonth.getDay();
      let numDisplayedFromPreviousMonth = (difference > 0)
        ? 7 - difference
        : -difference;
      let firstDate = new Date(firstDayOfMonth.getTime());

      if (numDisplayedFromPreviousMonth > 0) {
        firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
      }

      // 42 is the number of days on a six-week calendar
      let _days: Array<Date> = self.getDates(firstDate, 42);
      let days: Array<any> = [];
      for (let i = 0; i < 42; i++) {
        let _dateObject = this.createDateObject(_days[i], this.formatDay);
        _dateObject.secondary = _days[i].getMonth() !== month;
        _dateObject.uid = this.uniqueId + '-' + i;
        days[i] = _dateObject;
      }

      self.labels = [];
      for (let j = 0; j < 7; j++) {
        self.labels[j] = {};
        self.labels[j].abbr = this.dateFilter(days[j].date, this.formatDayHeader);
        self.labels[j].full = this.dateFilter(days[j].date, 'EEEE');
      }

      self.title = this.dateFilter(this.activeDate, this.formatDayTitle);
      self.rows = this.split(days, 7);

      if (this.showWeeks) {
        self.weekNumbers = [];
        let thursdayIndex = (4 + 7 - this.startingDay) % 7;
        let numWeeks = self.rows.length;
        for (let curWeek = 0; curWeek < numWeeks; curWeek++) {
          self.weekNumbers.push(self.getISO8601WeekNumber(self.rows[curWeek][thursdayIndex].date));
        }
      }
    }, 'day');

    this.datePicker.setCompareHandler(function (date1: Date, date2: Date): number {
      let d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
      let d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
      return d1.getTime() - d2.getTime();
    }, 'day');

    this.datePicker.refreshView();
  }

  private getDates(startDate: Date, n: number): Array<Date> {
    let dates: Array<Date> = new Array(n);
    let current = new Date(startDate.getTime());
    let i = 0;
    let date: Date;
    while (i < n) {
      date = new Date(current.getTime());
      date = this.datePicker.fixTimeZone(date);
      dates[i++] = date;
      current = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1);
    }
    return dates;
  }

  private getISO8601WeekNumber(date: Date): number {
    let checkDate = new Date(date.getTime());
    // Thursday
    checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
    let time = checkDate.getTime();
    // Compare with Jan 1
    checkDate.setMonth(0);
    checkDate.setDate(1);
    return Math.floor(Math.round((time - checkDate.getTime()) / 86400000) / 7) + 1;
  }

  toggleDaysByWeek(daysOfRow: any) {

    if (!this.singleDateSelection) {
      let datesOfRow = daysOfRow.map((dateObj: any) => {
        return dateObj.date;
      });
      this.datePicker.select(datesOfRow);
    }
  }

}
