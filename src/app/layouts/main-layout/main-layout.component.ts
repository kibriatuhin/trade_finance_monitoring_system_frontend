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
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, RouterModule, 
    MatSidenavModule, MatListModule, MatIconModule, CommonModule, 
    HeaderComponent, TabBarComponent, SidebarNavComponent,FooterComponent],
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


 sidebarWidth = 280;
minWidth = 200;
maxWidth = 420;
isResizing = false;

startResize(event: PointerEvent) {
  event.preventDefault();
  event.stopPropagation();

  this.isResizing = true;

  document.body.classList.add('resize-active');
  document.body.classList.add('no-select');

  // ✅ pointer capture (this is why PointerEvent is needed)
  (event.target as HTMLElement).setPointerCapture(event.pointerId);

  document.addEventListener('pointermove', this.resize);
  document.addEventListener('pointerup', this.stopResize);
}

resize = (event: PointerEvent) => {
  if (!this.isResizing) return;

  const newWidth = event.clientX;

  if (newWidth >= this.minWidth && newWidth <= this.maxWidth) {
    this.sidebarWidth = newWidth;
  }
};

stopResize = () => {
  this.isResizing = false;

  document.body.classList.remove('resize-active');
  document.body.classList.remove('no-select');

  document.removeEventListener('pointermove', this.resize);
  document.removeEventListener('pointerup', this.stopResize);
};


}
