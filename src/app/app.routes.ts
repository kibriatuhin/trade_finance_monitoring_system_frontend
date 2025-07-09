import { Routes } from '@angular/router';
import { ImportDashboardComponent } from './pages/import-dashboard/import-dashboard.component';
import { ExportDashboardComponent } from './pages/export-dashboard/export-dashboard.component';
import { SettingComponent } from './pages/setting/setting.component';

export const routes: Routes = [
    {
        path: "",
        component: ImportDashboardComponent
    },
    {
        path: "import",
        component: ImportDashboardComponent
    },
    {
        path: "export",
        component: ExportDashboardComponent
    },
    {
        path: "setting",
        component: SettingComponent
    }
];
