import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import { HeaderComponent } from "./component/header/header.component";
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {BreakpointObserver, Breakpoints, LayoutModule} from '@angular/cdk/layout';
import { inject } from '@angular/core';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, RouterModule,
     HeaderComponent,HeaderComponent,MatSidenavModule, MatListModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TF_Monitoring_System';
  isSidebarOpen: boolean = true;

  private breakpointObserver = inject(BreakpointObserver); // ✅ Correct way to use inject()

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(result => {
        this.isSidebarOpen = !result.matches;
      });
  }
}
