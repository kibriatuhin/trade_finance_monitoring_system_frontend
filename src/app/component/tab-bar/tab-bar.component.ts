import { Component } from '@angular/core';
import { Tab } from '../../shared/model/tab.model';
import { TabService } from '../../services/tabServices/tab.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-tab-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './tab-bar.component.html',
  styleUrl: './tab-bar.component.css',
})
export class TabBarComponent {
  tabs: Tab[] = [];
  activeTab: Tab | null = null;

  constructor(private tabService: TabService, private router: Router) {
    this.tabService.tabs$.subscribe((tabs) => {
      this.tabs = tabs;

      const active = tabs.find((t) => t.isActive);
      if (active) {
        this.router.navigateByUrl(active.route);
      } else {
        this.router.navigateByUrl('/blank'); // fallback to blank
      }
    });
  }

  activate(tab: Tab) {
    this.tabService.activateTab(tab.route);
  }

  close(tab: Tab) {
    this.tabService.closeTab(tab.route);
  }
}
