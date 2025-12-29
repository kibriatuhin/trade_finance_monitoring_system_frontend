import { Component } from '@angular/core';
import { Tab } from '../../shared/models/tab.model';
import { TabService } from '../../services/tabServices/tab.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

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

  // ✅ Use ChangeDetectorRef to trigger change detection manually



  constructor(
    private tabService: TabService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.tabService.tabs$.subscribe((tabs) => {
      this.tabs = tabs;
      
      // Handle navigation when active tab changes
      const activeTab = tabs.find(t => t.isActive);
      if (activeTab) {
        this.router.navigateByUrl(activeTab.route);
      } else if (tabs.length === 0) {
        this.router.navigateByUrl('/blank');
      }
      
      
  this.cdr.detectChanges();
      //this.cdr.markForCheck();
    });
  } 

  activate(tab: Tab) {
    this.tabService.activateTab(tab.route);
  }

  close(tab: Tab, event?: MouseEvent) {
    // Prevent click event from bubbling to parent (activate)
    if (event) {
      event.stopPropagation();
    }
    this.tabService.closeTab(tab.route);
  }
}
