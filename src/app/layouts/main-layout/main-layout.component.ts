import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {BreakpointObserver, Breakpoints, LayoutModule} from '@angular/cdk/layout';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { TabBarComponent } from "../../component/tab-bar/tab-bar.component";
import { TabService } from '../../services/tabServices/tab.service';
import { SidebarNavComponent } from "../sidebar-nav/sidebar-nav.component";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, RouterModule, MatSidenavModule, MatListModule, MatIconModule, CommonModule, HeaderComponent, TabBarComponent, SidebarNavComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  title = 'TF_Monitoring_System';
  isSidebarOpen: boolean = true;
  isSubmenuOpen = false;
  isSubmenuOpen2: boolean = false;

  constructor(private tabService: TabService) {}

private breakpointObserver = inject(BreakpointObserver);

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(result => {
        this.isSidebarOpen = !result.matches;
      });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
