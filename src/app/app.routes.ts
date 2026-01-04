import { Routes } from '@angular/router';
import { ImportDashboardComponent } from './pages/import-dashboard/import-dashboard.component';
import { ExportDashboardComponent } from './pages/export-dashboard/export-dashboard.component';
import { SettingComponent } from './pages/setting/setting.component';
import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

import { ImportDetailsComponent } from './pages/import-details/import-details.component';
import { BlankComponent } from './component/blank/blank.component';
import { TransactionTableComponent } from './component/transaction-table/transaction-table.component';
import { BranchDashboardComponent } from './pages/branch-dashboard/branch-dashboard.component';
import { ImportTransactionDashboardComponent } from './pages/import-transaction-dashboard/import-transaction-dashboard.component';
import { ExportTransactionDashboardComponent } from './pages/export-transaction-dashboard/export-transaction-dashboard.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { TestLoginComponent } from './component/test-login/test-login.component';


export const routes: Routes = [

  // 👉 1️⃣ Default route = Login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // 👉 2️⃣ Login Page
  {
    path: 'login',
    component: LoginComponent
  },
{ path: 'testlogin', component: TestLoginComponent },
  // 👉 3️⃣ After login pages (Main Layout)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {path:'home',component:HomePageComponent},
      { path: 'import', component: ImportDashboardComponent },
      { path: 'export', component: ExportDashboardComponent },
      { path: 'setting', component: SettingComponent },
      { path: 'import-details', component: ImportDetailsComponent },
      { path: 'transaction-history', component: TransactionTableComponent },
      { path: 'branches', component: BranchDashboardComponent },
      { path: 'import-transactions', component: ImportTransactionDashboardComponent },
      { path: 'export-transactions', component: ExportTransactionDashboardComponent }
    ]
  }

];
/*
export const routes: Routes = [

{
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: BlankComponent }, // Default route
      { path: 'blank', component: BlankComponent },
      { path: 'import', component: ImportDashboardComponent },
      { path: 'export', component: ExportDashboardComponent },
      { path: 'setting', component: SettingComponent },
      {path: 'import-details', component: ImportDetailsComponent},
      {path: 'transaction-history',component: TransactionTableComponent},
      {path : 'branches',component: BranchDashboardComponent},
      {path:'import-transactions', component: ImportTransactionDashboardComponent},
      {path: 'export-transactions', component: ExportTransactionDashboardComponent}
    ]
  },
];*/
