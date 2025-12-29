import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { TranHistory } from '../../shared/models/TranHistory';
import { BranchSummaryData } from '../../shared/interface/BranchSummaryData';
import { BranchStatusListData } from '../../shared/interface/BranchStatusListData';
import { ImportSummaryData } from '../../shared/models/import/ImportSummaryData';
import { environment } from '../../../environment/environment';
import { ImportLcOpenDetailsData } from '../../shared/models/import/ImportLcOpenDetailsData';
import { ApiResponseN, ImportPndingLcDetailsData, PendingLcPageResponse } from '../../shared/models/import/ImportPndingLcDetailsData';
import { ImportLcTotalAmountData } from '../../shared/models/import/ImportLcTotalAmountData';
import { PageResponse } from '../../shared/interface/PageResponse';
import { ApiResponse } from '../../shared/interface/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

fetchFormattedAmount(url: string, params?: any): Observable<string> {
   const fullUrl = `${this.baseUrl}${url}`;
  return this.http.get<any>(fullUrl, { params }).pipe(
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
//for branch History dashboard data
fetchFormattedBranch(url: string): Observable<BranchSummaryData> {
  const fullUrl = `${this.baseUrl}${url}`;
  return this.http.get<any>(fullUrl).pipe(
    map(response => response.data as BranchSummaryData),
    catchError(err => {
      console.error('API error:', err);
      return of({
        totalSnOutBrn: 0,
        totalSnInBrn: 0,
        totalBrn: 0,
        totalPndSnInBrn: 0,
        totalPndSnOutBrn: 0
      } as BranchSummaryData);
    })
  );
}



// For import history dashboard data
fetchTotalImportSummary(apiUrl: string, queryParams: any): Observable<ImportSummaryData> {
  const fullUrl = `${this.baseUrl}${apiUrl}`;
  return this.http.get<any>(fullUrl, { params: queryParams }).pipe(
    map(response => {
      const data: ImportSummaryData = response.data;

      return {
        importPadOs: this.formatAmountShort(data.importPadOs),
        ImportOsLiab: this.formatAmountShort(data.ImportOsLiab),
        impAccChgAmount: this.formatAmountShort(data.impAccChgAmount),
        impPendingLc: this.formatAmountShort(data.impPendingLc),
        impPayChgAmount: this.formatAmountShort(data.impPayChgAmount),
        impCommAmount: this.formatAmountShort(data.impCommAmount),
        importPayment: this.formatAmountShort(data.importPayment),
        impSwftChgAmount: this.formatAmountShort(data.impSwftChgAmount),
        importAmount: this.formatAmountShort(data.importAmount),
        importLcOpen: this.formatAmountShort(data.importLcOpen),
        importVatAmount: this.formatAmountShort(data.importVatAmount),
        importTaxAmount: this.formatAmountShort(data.importTaxAmount),
        importPadAmt: this.formatAmountShort(data.importPadAmt),
        importBillAmt: this.formatAmountShort(data.importBillAmt),
        importOpChg: this.formatAmountShort(data.importOpChg)
      } as ImportSummaryData;
    }),
    catchError(err => {
      console.error('API error:', err);
      return of({
        importPadOs: '0.0',
        ImportOsLiab: '0.0',
        impAccChgAmount: '0.0',
        impPendingLc: '0',
        impPayChgAmount: '0.0',
        impCommAmount: '0.0',
        importPayment: '0.0',
        impSwftChgAmount: '0.0',
        importAmount: '0.0',
        importLcOpen: '0',
        importVatAmount: '0.0',
        importTaxAmount: '0.0',
        importPadAmt:'0.0',
        importBillAmt:'0.0',
        importOpChg:'0.0'
      } as ImportSummaryData);
    })
  );
}





fetchBranchStatusHistory(url: string): Observable<BranchStatusListData[]> {
  const fullUrl = `${this.baseUrl}${url}`;
  return this.http.get<{ data: BranchStatusListData[] }>(fullUrl).pipe(
    map(response => response.data),
    catchError(err => {
      console.error('API error:', err);
      return of([]); // return empty array on error
    })
  );
}




fetchTranHistory(url: string,year: number,pageSize:any): Observable<TranHistory[]> {
  //const url = 'http://localhost:9092/api/v1/importDashboard/impTranHistory';
  const params = { year: year.toString(),size: pageSize.toString() };
  const fullUrl = `${this.baseUrl}${url}`;

  return this.http.get<any>(fullUrl, { params }).pipe(
    map(response => response.data),  // API response থেকে শুধু data array রিটার্ন করবে
    catchError(err => {
      console.error('API error:', err);
      return of([]); // error হলে empty array রিটার্ন করবে
    })
  );

}
private formateNumber(value: number): string {
  if(value <10){
    return '0' + value.toString();
  }
  return value.toString();
}


//for import Lc open details
fetchImportLcOpenDetails(url: string, queryParams: any): Observable<ImportLcOpenDetailsData[]> {
  const fullUrl = `${this.baseUrl}${url}`;
  return this.http.get<{ data: ImportLcOpenDetailsData[] }>(fullUrl,{ params: queryParams }).pipe(
    map(response => response.data),
    catchError(err => {
      console.error('API error:', err);
      return of([]); // return empty array on error
    })
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







// Generic API fetcher with pagination
getPagedData<T>(url: string, queryParams: any): Observable<PageResponse<T>> {
  const fullUrl = `${this.baseUrl}${url}`;

  return this.http.get<ApiResponse<PageResponse<T>>>(fullUrl, { params: queryParams }).pipe(
    map(response => {
      if (response.status === 'success' && response.data) {
        return response.data;
      } else {
        console.warn('Unexpected API response:', response);
        return this.getEmptyResponse<T>();
      }
    }),
    catchError(err => {
      console.error('Failed to fetch data:', err);
      return of(this.getEmptyResponse<T>());
    })
  );
}


private getEmptyResponse<T>(): PageResponse<T> {
  return {
    lcList: [],       
    pageNo: 0,
    pageSize: 0,
    totalElements: 0,
    totalPages: 0,
    isFirst: true,
    isLast: true
  };
}

}



