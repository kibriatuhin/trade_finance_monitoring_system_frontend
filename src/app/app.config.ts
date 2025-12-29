import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from './services/table-pagination/CustomMatPaginatorIntl ';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimations } from '@angular/platform-browser/animations';
import { loadingInterceptor } from './services/interceptors/loading.interceptors';


/*export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(), 
             provideZoneChangeDetection({ eventCoalescing: true }), 
             provideRouter(routes), 
             provideAnimationsAsync(), 
             importProvidersFrom(BrowserAnimationsModule),
             provideHttpClient(withInterceptors([loadingInterceptor])),
             { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }, 
             provideAnimations(), // Remove provideAnimationsAsync() - it's conflicting
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }]
};*/
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([loadingInterceptor])),
    provideRouter(routes),
    provideAnimations(),   // ✅ only one
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }
  ]
};


