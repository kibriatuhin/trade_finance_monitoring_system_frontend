import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {

  constructor(private http: HttpClient) {}

  fetchFormattedAmount(apiUrl: string): Observable<string> {
    return this.http.get<any>(apiUrl).pipe(
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
