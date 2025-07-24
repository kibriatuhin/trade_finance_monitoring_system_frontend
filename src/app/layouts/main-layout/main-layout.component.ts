import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {BreakpointObserver, Breakpoints, LayoutModule} from '@angular/cdk/layout';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../component/header/header.component';
import { TabBarComponent } from "../../component/tab-bar/tab-bar.component";
import { TabService } from '../../services/tabServices/tab.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, RouterModule, MatSidenavModule, MatListModule, MatIconModule, CommonModule, HeaderComponent, TabBarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  title = 'TF_Monitoring_System';
  isSidebarOpen: boolean = true;
  isSubmenuOpen = false;
  isSubmenuOpen2: boolean = false;

  constructor(private tabService: TabService) {}

openTab(title: string, route: string) {
  this.tabService.openTab(title, route);
}

  toggleSubmenu() {
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }
  toggleSubmenu2() {
    this.isSubmenuOpen2 = !this.isSubmenuOpen2;
  }

  private breakpointObserver = inject(BreakpointObserver); // ✅ Correct way to use inject()

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(result => {
        this.isSidebarOpen = !result.matches;
      });
  }
}
