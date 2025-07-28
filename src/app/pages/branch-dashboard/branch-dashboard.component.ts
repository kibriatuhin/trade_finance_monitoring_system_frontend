import { Component } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { DashboardDataService } from '../../services/dashboard/dashboard-data.service';
import { BranchSummaryData } from '../../shared/interface/BranchSummaryData';
import { DynamicMaterialTableComponent } from '../../component/dynamic-material-table/dynamic-material-table.component';
import { BranchStatusListData } from '../../shared/interface/BranchStatusListData';
import { Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-branch-dashboard',
  standalone: true,
  imports: [MatCardModule, MatCard, DynamicMaterialTableComponent],
  templateUrl: './branch-dashboard.component.html',
  styleUrl: './branch-dashboard.component.css',
})
export class BranchDashboardComponent {
  branchSummaryData: BranchSummaryData = {
    totalSnOutBrn: 0,
    totalSnInBrn: 0,
    totalBrn: 0,
  };
  totalItems = 0;
  pageSize =0;
  currentPage = 0;

  branchSummary: BranchStatusListData[] = [];

  constructor(private dashboardService: DashboardDataService) {}

  ngOnInit(): void {
    this.loadDashboardData(); // initial load
  }

  loadDashboardData(): void {
    this.dashboardService
      .fetchFormattedBranch('http://localhost:9092/api/v1/branch/adBrnSummary')
      .subscribe((data) => {
        console.log('Branch Summary Data:', data);
        this.branchSummaryData = data;
      });

    this.dashboardService
      .fetchBranchStatusHistory(
        'http://localhost:9092/api/v1/branch/brnHistory'
      )
      .subscribe((data: BranchStatusListData[]) => {
        console.log('Branch table status Data:', data);
        this.branchSummary = data;
        this.totalItems = data.length;
      });
  }

  onPageChangeHandler(event:PageEvent){
     if (event.pageSize !== this.pageSize) {
      this.pageSize = event.pageSize;
      this.currentPage = 0; // Reset to first page if needed
      //this.fetchData(); // Call API only on page size change
    } else {
      // Just update current page, don't call API
      this.currentPage = event.pageIndex;
    }
  }
}
