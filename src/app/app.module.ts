import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeListComponent } from './employees/employee-list/employee-list.component';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { CustomDateParserFormatter } from './shared/services/custom-date-parser.service';
import { CustomAdapter } from './shared/services/custom-adapter.service';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgbDatepickerModule,
    FormsModule, 
    JsonPipe
  ],
  providers: [
		{ provide: NgbDateAdapter, useClass: CustomAdapter },
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
	],
  bootstrap: [AppComponent]
})
export class AppModule { }
