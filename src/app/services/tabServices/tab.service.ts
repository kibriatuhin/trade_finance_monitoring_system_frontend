import { Injectable } from '@angular/core';
import { Tab } from '../../shared/models/tab.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  constructor(private router: Router) { }


  private tabs: Tab[] = [];
  private tabsSubject = new BehaviorSubject<Tab[]>(this.tabs);

  // ✅ Expose observable to components
  public tabs$ = this.tabsSubject.asObservable();

openTab(title: string, route: string) {
  const exists = this.tabs.find(t => t.route === route);
  if (!exists) {
    this.tabs.forEach(t => t.isActive = false);
    this.tabs.push({ title, route, isActive: true });
  } else {
    this.tabs.forEach(t => t.isActive = (t.route === route));
  }

  this.tabsSubject.next([...this.tabs]); // use new reference
}



 closeTab(route: string) {
  const index = this.tabs.findIndex(t => t.route === route);
  if (index !== -1) {
    const wasActive = this.tabs[index].isActive;
    this.tabs.splice(index, 1);

    if (wasActive && this.tabs.length > 0) {
      // Prefer previous tab, otherwise take the first available tab
      let nextActiveIndex = index - 1;

      if (nextActiveIndex < 0) {
        nextActiveIndex = 0;
      }

      this.tabs[nextActiveIndex].isActive = true;
      this.router.navigateByUrl(this.tabs[nextActiveIndex].route);
    } else if (wasActive && this.tabs.length === 0) {
      this.router.navigateByUrl('/blank');
    }

    // Important: Send new array reference to trigger change detection
    this.tabsSubject.next([...this.tabs]);
  }
}






activateTab(route: string) {
  let activatedTab: Tab | undefined;
  
  this.tabs.forEach(t => {
    t.isActive = (t.route === route);
    if (t.isActive) {
      activatedTab = t;
    }
  });
  
  this.tabsSubject.next([...this.tabs]);
  
  // Navigate to the activated tab
  if (activatedTab) {
    this.router.navigateByUrl(activatedTab.route);
  }
}


}
