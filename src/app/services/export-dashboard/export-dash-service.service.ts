import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExportSummaryData } from '../../shared/models/export/ExportSummaryData';
import { Observable, catchError, map, of } from 'rxjs';
import { Currency } from '../../shared/interface/Currency';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ExportDashServiceService {


  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  // For Export history dashboard data
  
  fetchTotalExportSummary(apiUrl: string, queryParams: any): Observable<ExportSummaryData> {
    const fullUrl = `${this.baseUrl}${apiUrl}`;
    return this.http.get<any>(fullUrl, { params: queryParams }).pipe(
      map(response => {
        const data: ExportSummaryData = response.data;
  
        return {
          totalExportOpen: this.formatAmountShort(data.totalExportOpen),
          totalOrderOpen: this.formatAmountShort(data.totalOrderOpen),
          totalBtbOpen: this.formatAmountShort(data.totalBtbOpen),
          totalExportAmount: this.formatAmountShort(data.totalExportAmount),
          totalOrderAmount: this.formatAmountShort(data.totalOrderAmount),
          totalBtbAmount: this.formatAmountShort(data.totalBtbAmount),
          totalBtbOsAmount: this.formatAmountShort(data.totalBtbOsAmount),
          totalBtbBillAmount: this.formatAmountShort(data.totalBtbBillAmount),
          totalBtbPayAmount: this.formatAmountShort(data.totalBtbPayAmount),
          totalBtbPadAmount: this.formatAmountShort(data.totalBtbPadAmount),
          totalBtbPadOsAmount: this.formatAmountShort(data.totalBtbPadOsAmount),
          totalExOrPCAmount: this.formatAmountShort(data.totalExOrPCAmount),
          totalExOrBillAmount: this.formatAmountShort(data.totalExOrBillAmount),
          totalExOrPLAmount: this.formatAmountShort(data.totalExOrPLAmount),
          totalExOrDisbAmount: this.formatAmountShort(data.totalExOrDisbAmount),
          totalExEdfRecAmount: this.formatAmountShort(data.totalExEdfRecAmount),
          
        } as ExportSummaryData;
      }),
      catchError(err => {
        console.error('API error:', err);
        return of({
          totalExportOpen: '0',
          totalOrderOpen: '0',
          totalBtbOpen: '0',
          totalExportAmount: '0.0',
          totalOrderAmount: '0.0',
          totalBtbAmount: '0.0',
          totalBtbOsAmount:'0.0',
          totalBtbBillAmount:'0.0',
          totalBtbPayAmount:'0.0',
          totalBtbPadAmount:'0.0',
          totalBtbPadOsAmount:'0.0',
          totalExOrPCAmount:'0.0',
          totalExOrBillAmount:'0.0',
          totalExOrPLAmount:'0.0',
          totalExOrDisbAmount:'0.0',
          totalExEdfRecAmount:'0.0',
        } as ExportSummaryData);
      })
    );
  }

  fetchCurrencyData(apiUrl: string): Observable<any[]> {
  return this.http.get<any[]>(apiUrl).pipe(
    map(response => {
      return response.map(item => ({
        currCode: item.code,
        currName: item.name
      }));
    }),
    catchError(err => {
      console.error('API error:', err);
      return of([]);
    }
    )
  );
}


getCurrencies(apiUrl: string): Observable<Currency[]> {

  const fullUrl = `${this.baseUrl}${apiUrl}`;
    return this.http.get<any>(fullUrl).pipe(
      map(response => 
        response.data.map((item: any) => ({
          currCode: item.currCode,
          currName: item.currName
        }))
      )
    );
  }


  private formatAmountShort(amount: number | string): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(value)) return '0';

  if (value >= 10000000) {
    return (value / 10000000).toFixed(2) + ' Cr';
  } else if (value >= 100000) {
    return (value / 100000).toFixed(2) + ' L';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(2) + ' K';
  } else {
    return value.toString();
  }
}
}
