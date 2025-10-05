import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from './services/table-pagination/CustomMatPaginatorIntl ';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(), 
             provideZoneChangeDetection({ eventCoalescing: true }), 
             provideRouter(routes), 
             provideAnimationsAsync(), 
             { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }, 
             provideAnimations(), // Remove provideAnimationsAsync() - it's conflicting
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }]
};
