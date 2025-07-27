import { Routes } from '@angular/router';
import { ImportDashboardComponent } from './pages/import-dashboard/import-dashboard.component';
import { ExportDashboardComponent } from './pages/export-dashboard/export-dashboard.component';
import { SettingComponent } from './pages/setting/setting.component';
import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { ImportDetailsComponent } from './pages/import-details/import-details.component';
import { BlankComponent } from './component/blank/blank.component';
import { TransactionTableComponent } from './component/transaction-table/transaction-table.component';
import { BranchDashboardComponent } from './pages/branch-dashboard/branch-dashboard.component';

export const routes: Routes = [

{
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'blank', component: BlankComponent },
      { path: 'import', component: ImportDashboardComponent },
      { path: 'export', component: ExportDashboardComponent },
      { path: 'setting', component: SettingComponent },
      {path: 'import-details', component: ImportDetailsComponent},
      {path: 'transaction-history',component: TransactionTableComponent},
      {path : 'branches',component: BranchDashboardComponent}
    ]
  },
  {
    path: 'auth',
    component: BlankLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent }
    ]
  },
  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
 // { path: '**', redirectTo: '' } 


    // {
    //     path: "",
    //     component: ImportDashboardComponent
    // },
    // {
    //     path: "import",
    //     component: ImportDashboardComponent
    // },
    // {
    //     path: "export",
    //     component: ExportDashboardComponent
    // },
    // {
    //     path: "setting",
    //     component: SettingComponent
    // }
];
