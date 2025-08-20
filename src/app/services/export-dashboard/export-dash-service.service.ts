import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExportSummaryData } from '../../shared/interface/ExportSummaryData';
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
          totalExportAmount: this.formatAmountShort(data.totalExportAmount),
          totalOrderAmount: this.formatAmountShort(data.totalOrderAmount),
          totalBtbAmount: this.formatAmountShort(data.totalBtbAmount),
          totalBtbOpen: this.formatAmountShort(data.totalBtbOpen),
          totalExpPcAmount: this.formatAmountShort(data.totalExpPcAmount),
          totalExpBillAmount: this.formatAmountShort(data.totalExpBillAmount),
          totalExpPlAmount: this.formatAmountShort(data.totalExpPlAmount),
          totalExpPcOpen: this.formatAmountShort(data.totalExpPcOpen),
          totalExpBillOpen: this.formatAmountShort(data.totalExpBillOpen),
          totalExpPlOpen: this.formatAmountShort(data.totalExpPlOpen),
          totalExpBtbBillOpen: this.formatAmountShort(data.totalExpBtbBillOpen),
          totalExpBtbBillAmount: this.formatAmountShort(data.totalExpBtbBillAmount),
          totalExpBtbPayAmount: this.formatAmountShort(data.totalExpBtbPayAmount),
          totalExpDispAmount: this.formatAmountShort(data.totalExpDispAmount),
          totalExpEdfRecvdAmount: this.formatAmountShort(data.totalExpEdfRecvdAmount),
          totalExpEdfRefundAmount: this.formatAmountShort(data.totalExpEdfRefundAmount)
        } as ExportSummaryData;
      }),
      catchError(err => {
        console.error('API error:', err);
        return of({
          totalExportOpen: '0',
          totalOrderOpen: '0',
          totalExportAmount: '0.0',
          totalOrderAmount: '0.0',
          totalBtbAmount: '0.0',
          totalBtbOpen: '0',
          totalExpPcAmount: '0.0',
          totalExpBillAmount: '0.0',
          totalExpPlAmount: '0.0',
          totalExpPcOpen: '0',
          totalExpBillOpen: '0',
          totalExpPlOpen: '0',
          totalExpBtbBillOpen: '0',
          totalExpBtbBillAmount: '0.0',
          totalExpBtbPayAmount: '0.0',
          totalExpDispAmount: '0.0',
          totalExpEdfRecvdAmount: '0.0',
          totalExpEdfRefundAmount: '0.0'
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
