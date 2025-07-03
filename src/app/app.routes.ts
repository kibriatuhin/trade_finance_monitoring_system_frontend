import { Routes } from '@angular/router';
import { ImportDashboardComponent } from './pages/import-dashboard/import-dashboard.component';
import { ExportDashboardComponent } from './pages/export-dashboard/export-dashboard.component';

export const routes: Routes = [
    {
        path: "import",
        component: ImportDashboardComponent
    },
    {
        path: "export",
        component: ExportDashboardComponent
    }
];
