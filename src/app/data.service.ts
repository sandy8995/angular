import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  ServerUrl = 'http://amzblast.moviesdoctor.com/amzblast1/webservices/';
  keepaKey = '1rh2jq6t2rfgi13og82pmgpobllkkd347bk5m4060dftaid4qeudslrcbt9mouph';
  keepaUrl = 'https://api.keepa.com/product?key=' + this.keepaKey + '&domain=10&asin=';
  errorData: {};
  constructor(private http: HttpClient) { }
  getProducts(id: string) {
    return this.http.get<any>(this.ServerUrl + 'product_tracking.php?user_id=' + id).pipe(
      catchError(this.handleError)
    );
  }

  searchasin(asinName: string, adminview: string, user_id: string) {
    return this.http.get<any>(this.ServerUrl + 'searchasin.php?trckseasin=' + asinName + '&adminview=' + adminview + '&user_id=' + user_id)
      .pipe(
        catchError(this.handleError)
      );
  }
  addToTracker(asinName: string, id: string, proimage: string, protitle: string, price: string,check:string='') {
    return this.http.get<any>(this.ServerUrl + 'demo.php?asinval=' + asinName + '&user_id=' + id + '&proimage=' + proimage + '&protitle=' + protitle + '&price=' + price+ '&check=' + check)
      .pipe(
        catchError(this.handleError)
      );
  }
  /*addToTracker(asinName: string, id: string) {
    return this.http.get<any>(this.ServerUrl + 'demo.php?asinval=' + asinName + '&user_id=' + id)
      .pipe(
        catchError(this.handleError)
      );
  }*/
  delteAsin(asinName: string, id: string) {
    return this.http.get<any>(this.ServerUrl + 'deleteasin.php?deltrackasin=' + asinName + '&user_id=' + id)
      .pipe(
        catchError(this.handleError)
      );
  }
  startTracker(asinName: string) {
    return this.http.get<any>(this.ServerUrl + 'demo2.php?asinval=' + asinName)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAdditionProducts() {
    return this.http.get<any>(this.ServerUrl + 'additional_tracking.php').pipe(
      catchError(this.handleError)
    );
  }

  checkvariations(asinName: string) {
    return this.http.get<any>(this.ServerUrl + 'checkasin.php?casin=' + asinName).pipe(
      catchError(this.handleError)
    );
  }

  checkKeepaProduct(asinName: string) {
    return this.http.get<any>(this.ServerUrl + 'keepa.php?asinval=' + asinName)
      .pipe(
        catchError(this.handleError)
      );
  }

  checkKeepaService(asinName: string) {
    return this.http.get<any>(this.keepaUrl + asinName)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    this.errorData = {
      errorTitle: 'Oops! Request for document failed',
      errorDesc: 'Something bad happened. Please try again later.'
    };
    return throwError(this.errorData);
  }
}
