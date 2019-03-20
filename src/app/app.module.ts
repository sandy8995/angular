import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductTrackingComponent } from './product-tracking/product-tracking.component';
import { AsinFilterPipe } from './asin-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BonusTrackerComponent } from './bonus-tracker/bonus-tracker.component';
import { HeaderComponent } from './header/header.component';
import {MatToolbarModule} from '@angular/material/toolbar';

@NgModule({
  declarations: [
    AppComponent,
    ProductTrackingComponent,
    AsinFilterPipe,
    BonusTrackerComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    NgxPaginationModule,
    SlimLoadingBarModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatToolbarModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
