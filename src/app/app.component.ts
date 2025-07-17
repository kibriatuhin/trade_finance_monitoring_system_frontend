import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import { HeaderComponent } from "./component/header/header.component";
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {BreakpointObserver, Breakpoints, LayoutModule} from '@angular/cdk/layout';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from "./layouts/main-layout/main-layout.component";
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule,MatSidenavModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
 
}
