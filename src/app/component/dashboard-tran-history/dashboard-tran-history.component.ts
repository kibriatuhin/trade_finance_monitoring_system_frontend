import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DashboardDataService } from '../../services/dashboard/dashboard-data.service';
import { TranHistory } from '../../shared/model/TranHistory';
import { PageEvent } from '@angular/material/paginator';
import { Input } from '@angular/core';
import { OnChanges, SimpleChanges } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard-tran-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './dashboard-tran-history.component.html',
  styleUrl: './dashboard-tran-history.component.css',
})
export class DashboardTranHistoryComponent {
  displayedColumns: string[] = [
    'rn',
    'brnCode',
    'postTranBatchNum',
    'custNum',
    'importType',
    'lcCurrCode',
    'lcAmount',
    'authBy',
    'status',
    'risk',
    'entdOn',
  ];
  fetchedRawData: TranHistory[] = [];
  pageSize: any = 5;
  currentPage = 0;
  totalItems = 0;
  selectedStatus = '';
  selectedType = '';
  

  @Input() selectedYear!: number;
  dataSource = new MatTableDataSource<TranHistory>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dashboardService: DashboardDataService) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData(): void {
    this.dashboardService
      .fetchTranHistory(
        'http://localhost:9092/api/v1/importDashboard/impTranHistory',
        this.selectedYear,
        this.pageSize
      )
      .subscribe((data) => {
        this.fetchedRawData = data;
        this.applyStatusFilters();
      });
    
  }

  applyStatusFilters(): void {
    console.log('Table  Data :', this.fetchedRawData);
    let filteredData: TranHistory[] = [];

    if (this.selectedStatus === 'approved') {
      filteredData = this.fetchedRawData.filter(
        (row) => this.getStatus(row).toLowerCase() === 'approved'
      );
    } else if (this.selectedStatus === 'pending') {
      filteredData = this.fetchedRawData.filter(
        (row) => this.getStatus(row).toLowerCase() === 'pending'
      );
    } else if (this.selectedStatus === 'rejected') {
      filteredData = this.fetchedRawData.filter(
        (row) => this.getStatus(row).toLowerCase() === 'rejected'
      );
    } else {
      // All or undefined selectedOption
      filteredData = this.fetchedRawData;
    }

    this.dataSource.data = filteredData;
  }

  applyTypeFilters(): void {
    console.log('Table  Data :', this.fetchedRawData);
    let filteredData2: TranHistory[] = [];


    if (this.selectedType === 'ld') {
      filteredData2 = this.fetchedRawData.filter(
        (row) => row.importType.substring(3,5).toLowerCase() === 'ld'
      );
    } 
    else if (this.selectedType === 'am') {
      filteredData2 = this.fetchedRawData.filter(
        (row) => row.importType.substring(3,5).toLowerCase() === 'am'
      );
    }else if (this.selectedType === 'cn') {
      filteredData2 = this.fetchedRawData.filter(
        (row) => row.importType.substring(3,5).toLowerCase() === 'cn'
      );
    } else if (this.selectedType === 'bill') {
       
      filteredData2 = this.fetchedRawData.filter(
        (row) => row.importType.substring(3,7).toLowerCase() === 'bill'
      );
    }else if (this.selectedType === 'p') {
      filteredData2 = this.fetchedRawData.filter(
        (row) => row.importType.substring(3,4).toLowerCase() === 'p'
      );
    } else {
      // All or undefined selectedOption
      filteredData2 = this.fetchedRawData;
    }

    this.dataSource.data = filteredData2;

  }

  onPageChange(event: PageEvent): void {
    // Check if page size changed
    if (event.pageSize !== this.pageSize) {
      this.pageSize = event.pageSize;
      this.currentPage = 0; // Reset to first page if needed
      this.fetchData(); // Call API only on page size change
    } else {
      // Just update current page, don't call API
      this.currentPage = event.pageIndex;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedYear']) {
      //console.log('Year changed:', this.selectedYear);
      this.fetchData(); // Update API call
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onFilterKeyup(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    this.applyFilter(input.value);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }
  onStatusChange(value: string) {
    console.log('Status changed to:', value);
    // apply your filter logic
  }

  onTypeChange(value: string) {
    console.log('Type changed to:', value);
    // apply your filter logic
  }

  getStatus(row: TranHistory): string {
    const { authBy, authOn, rejBy, rejOn } = row;

    if (!authBy && !authOn && !rejBy && !rejOn) {
      return 'Pending';
    } else if (authBy && authOn) {
      return 'Approved';
    } else if (rejBy && rejOn) {
      return 'Rejected';
    } else {
      return 'In Review';
    }
  }
  onRefresh(): void {
    console.log('Refresh clicked!');
    // TODO: Add your refresh logic here, such as:
    // - Fetch new data from the backend
    // - Reset filters or pagination
    // - Show a loading spinner
  }

  getRisk(row: TranHistory): string {
    const { authBy, authOn, rejBy, rejOn } = row;

    if (!authBy && !authOn && !rejBy && !rejOn) {
      return 'Medium';
    } else if (authBy && authOn) {
      return 'Low';
    } else if (rejBy && rejOn) {
      return 'High';
    } else {
      return 'Uncertain';
    }
  }

  getStatusClasses(row: TranHistory): string {
    const status = this.getStatus(row);
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Processing':
        return 'bg-blue-100 text-blue-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  getRiskDotClass(row: TranHistory): string {
    const risk = this.getRisk(row);
    switch (risk) {
      case 'Low':
        return 'bg-green-500';
      case 'Medium':
        return 'bg-orange-500';
      case 'High':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  }
}
