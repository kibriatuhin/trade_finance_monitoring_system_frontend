import { Routes } from '@angular/router';
import { ImportDashboardComponent } from './pages/import-dashboard/import-dashboard.component';
import { ExportDashboardComponent } from './pages/export-dashboard/export-dashboard.component';
import { SettingComponent } from './pages/setting/setting.component';
import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';

export const routes: Routes = [

{
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'import', pathMatch: 'full' },
      { path: 'import', component: ImportDashboardComponent },
      { path: 'export', component: ExportDashboardComponent },
      { path: 'setting', component: SettingComponent }
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
  { path: '**', redirectTo: 'import' }


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
