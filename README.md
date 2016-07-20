# Usage & Demo

Day selector for selection of multiple dates with ranges or not and the display of multiple datepickers

- Click on a day to select that date.

- By pressing the mouse button slightly longer you activate range mode, which allows you to select an end date

[https://pesteves8.github.io/dayselector](https://pesteves8.github.io/dayselector)

# To use this component, use app/dayselector/dayselector.component.ts by cloning or downloading
## To edit, you should comment the bundle script and uncomments the systemjs scripts
## It requires bootstrap3 (and almost 4), momentjs and moment-range

### Main options

The most common options are:

 [independentDatepickers] -> Use this if you want each date picker to have it's own controls. Otherwise the datepicker in the center will control the others which will be positioned relative to it
 [numberOfDatepickers] -> Number of date pickers. Defaults to 3, but you can choose 1 and have a normal datepicker. A lot of datepickers will make the component slow
 [singleDateSelection] -> Defaults to false. If is set to true, you can only choose one date instead of multiple. It will still return an array, but with only one value
 [selectedDates]="variableinparentcomponent" -> The dates that are being selected. Choose the name of the array that you will use to get the dates to the parent component
 [noMainDatepickers] -> Is set to true, no main datepickers will exist. Useful if you want all datepickers looking the same without any controls. Controls to and from each month can be set with
                        external buttons that manipulate "currentActiveDate"
 [currentActiveDate] -> This is the date that the date pickers will use as an anchor. Set it in the parent component if you want a start date. Change it if you want to use external buttons to move the dates around
 [minDate] -> Dates before the date set here will be disabled
 [maxDate] -> Same as above for max dates

 Other options are available as this is a fork of ng2bootstrap datepicker
 

 NOTE: This was created because these features were needed for specific project. I haven't tested a lot of stuff related to the previous ng2-bootstrap
       Also, the code is in need of seeeeerious refactoring. Currently it's somewhat chaotic.
