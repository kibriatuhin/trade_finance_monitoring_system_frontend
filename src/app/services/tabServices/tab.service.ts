import { Injectable } from '@angular/core';
import { Tab } from '../../shared/model/tab.model';
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


 /* openTab(title: string, route: string) {
    const exists = this.tabs.find(t => t.route === route);
    if (!exists) {
      this.tabs.forEach(t => t.isActive = false);
      this.tabs.push({ title, route, isActive: true });
    } else {
      this.tabs.forEach(t => t.isActive = (t.route === route));
    }
    this.tabsSubject.next(this.tabs);
  }*/

closeTab(route: string) {
    const index = this.tabs.findIndex(t => t.route === route);
    if (index !== -1) {
      const wasActive = this.tabs[index].isActive;
      this.tabs.splice(index, 1);

      if (wasActive && this.tabs.length > 0) {
        this.tabs[this.tabs.length - 1].isActive = true;
      }

      this.tabsSubject.next(this.tabs);
    }
  }

/*closeTab(route: string): void {
  const index = this.tabs.findIndex(t => t.route === route);
  if (index === -1) return;

  const wasActive = this.tabs[index].isActive;

  // Determine next tab BEFORE removal
  let nextTab: Tab | undefined;
  if (wasActive) {
    // Prefer right tab, then left
    nextTab = this.tabs[index + 1] || this.tabs[index - 1];
  }

  // Remove the tab
  this.tabs.splice(index, 1);

  // Clear active flags
  this.tabs.forEach(t => t.isActive = false);

  // Activate next tab if exists
  if (nextTab) {
    nextTab.isActive = true;
  }

  // Emit updated tab list
  this.tabsSubject.next([...this.tabs]);

  // ✅ If all tabs are closed and the closed one was active, navigate to /blank
  if (wasActive && this.tabs.length === 0) {
    this.router.navigate(['/blank']);
  }
}*/


/*

closeTab(route: string): void {
  const index = this.tabs.findIndex(t => t.route === route);
  if (index === -1) return;

  const wasActive = this.tabs[index].isActive;

  // Determine next tab BEFORE removal
  let nextTab: Tab | undefined;
  if (wasActive) {
    // Prefer right tab, then left
    nextTab = this.tabs[index + 1] || this.tabs[index - 1];
  }

  // Remove the tab
  this.tabs.splice(index, 1);

  // Clear current active flags
  this.tabs.forEach(t => t.isActive = false);

  // Activate next tab if exists
  if (nextTab) {
    nextTab.isActive = true;
  }

  // Emit updated tab list
  this.tabsSubject.next([...this.tabs]);
} */




activateTab(route: string) {
  this.tabs.forEach(t => t.isActive = (t.route === route));
  this.tabsSubject.next([...this.tabs]); // new reference here too
}

 /* activateTab(route: string) {
    this.tabs.forEach(t => t.isActive = (t.route === route));
    this.tabsSubject.next(this.tabs);
  }*/
}
