import { bootstrap }    from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppComponent } from './app.component';

//enableProdMode();

/* THIS IS PART OF THE NEW ANGULAR2 FORMS. IT WON'T BE NECESSARY ONCE THE DEPRECATION PROCESS IS FINISHED */
import { disableDeprecatedForms, provideForms } from '@angular/forms';

bootstrap(AppComponent, [ disableDeprecatedForms(),
    provideForms()
]);
