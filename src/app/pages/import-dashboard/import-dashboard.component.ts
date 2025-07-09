import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { DashboardDataService } from '../../services/dashboard/dashboard-data.service';

@Component({
  selector: 'app-import-dashboard',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './import-dashboard.component.html',
  styleUrl: './import-dashboard.component.css'
})
export class ImportDashboardComponent {
  totalLcAmount: string = '0.00';
  totalLcCommAmount: string = '0.00';
  totalLcSwftAmount: string = '0.00';
  http = inject(HttpClient);

 constructor(private dashboardService: DashboardDataService) {}

ngOnInit() {
  this.dashboardService.fetchFormattedAmount('http://localhost:9092/api/v1/importDashboard/totalImportAmount')
    .subscribe(value => this.totalLcAmount = value);

  this.dashboardService.fetchFormattedAmount('http://localhost:9092/api/v1/importDashboard/totalImportCommAmount')
    .subscribe(value => this.totalLcCommAmount = value);

  this.dashboardService.fetchFormattedAmount('http://localhost:9092/api/v1/importDashboard/totalImportSwftAmount')
    .subscribe(value => this.totalLcSwftAmount = value);
}

}
