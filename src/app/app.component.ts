import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import { HeaderComponent } from "./layouts/header/header.component";
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {BreakpointObserver, Breakpoints, LayoutModule} from '@angular/cdk/layout';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from "./layouts/main-layout/main-layout.component";

import { NgxSpinnerModule } from "ngx-spinner";
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
    RouterModule,MatSidenavModule, 
    CommonModule,NgxSpinnerModule,
    NgxEchartsModule ,
    OverlayModule

  ],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: { echarts: () => import('echarts') } // <-- provide config manually
    }
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TF_Monitoring_System';
}
