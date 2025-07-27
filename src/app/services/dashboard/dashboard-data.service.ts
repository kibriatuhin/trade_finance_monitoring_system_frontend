import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { TranHistory } from '../../shared/model/TranHistory';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {

  constructor(private http: HttpClient) {}

fetchFormattedAmount(url: string, params?: any): Observable<string> {
  return this.http.get<any>(url, { params }).pipe(
    map(result => {
      const raw = Number(result.message);
      return this.formatAmountShort(raw);
    }),
    catchError(err => {
      console.error('API error:', err);
      return of('N/A');
    })
  );
}

fetchTranHistory(url: string,year: number,pageSize:any): Observable<TranHistory[]> {
  //const url = 'http://localhost:9092/api/v1/importDashboard/impTranHistory';
  const params = { year: year.toString(),size: pageSize.toString() };

  return this.http.get<any>(url, { params }).pipe(
    map(response => response.data),  // API response থেকে শুধু data array রিটার্ন করবে
    catchError(err => {
      console.error('API error:', err);
      return of([]); // error হলে empty array রিটার্ন করবে
    })
  );

}



  private formatAmountShort(amount: number): string {
    if (amount >= 10000000) {
      return (amount / 10000000).toFixed(2) + ' Cr';
    } else if (amount >= 100000) {
      return (amount / 100000).toFixed(2) + ' L';
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(2) + ' K';
    } else {
      return amount.toString();
    }
  }
}
