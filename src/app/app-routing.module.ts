import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductTrackingComponent } from './product-tracking/product-tracking.component';
import { BonusTrackerComponent } from './bonus-tracker/bonus-tracker.component';

const routes: Routes = [
  {
    path:'product_tracking/:id',component:ProductTrackingComponent
  },
  {
    path:'additional-product-tracking/:id',component:BonusTrackerComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
