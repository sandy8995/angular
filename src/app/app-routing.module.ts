import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductTrackingComponent } from './product-tracking/product-tracking.component';

const routes: Routes = [
  {
    path:'product_tracking',component:ProductTrackingComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
