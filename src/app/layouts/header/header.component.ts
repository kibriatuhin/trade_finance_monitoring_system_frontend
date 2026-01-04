import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../shared/models/MenuItem.model';
import { TREE_DATA } from '../../shared/utils/menu-data';
import { Router } from '@angular/router';
import { TabService } from '../../services/tabServices/tab.service';
import { DynamicDialogComponent } from '../../component/dynamic-dialog/dynamic-dialog.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

interface FlatProgram {
  tabKey: string;
  name: string;
  route: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatMenuModule, MatButtonModule, DynamicDialogComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  allPrograms: FlatProgram[] = [];
  filteredPrograms: FlatProgram[] = [];

  showProgramDialog = false;
  dialogTitle = "Program List";

  programColumns = [
    { header: 'Program ID', field: 'tabKey' },
    { header: 'Full Name', field: 'name'  }
  ];

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;
  private overlayRef!: OverlayRef;


  treeData: MenuItem[] = TREE_DATA;
  constructor(private router: Router, private tabService: TabService, private overlay: Overlay) { }


  @Output() sideBarToggle = new EventEmitter<void>();
  isDropdownOpen = false;

  ngOnInit() {
    this.allPrograms = this.flattenTree(TREE_DATA);
  }

  onSearchKeyup(value: string) {
    const key = value.trim().toLowerCase();

    if (!key) {
      this.closeOverlay();
      return;
    }

    this.filteredPrograms = this.allPrograms.filter(p =>
      p.tabKey.toLowerCase().includes(key) ||
      p.name.toLowerCase().includes(key)
    );

    if (this.filteredPrograms.length) {
      this.openOverlay();
    } else {
      this.closeOverlay();
    }
  }

  private openOverlay() {
    if (this.overlayRef) {
      this.overlayRef.dispose(); // Remove previous overlay
    }

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.searchInput.nativeElement)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top',
          offsetX: 5, offsetY: 2
         }
      ])
      .withFlexibleDimensions(false)
      .withPush(false);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      width: this.searchInput.nativeElement.offsetWidth // overlay width same as input
    });

    const portal = new ComponentPortal(DynamicDialogComponent);
    const componentRef = this.overlayRef.attach(portal);

    componentRef.instance.columns = this.programColumns;
    componentRef.instance.data = this.filteredPrograms;
    componentRef.instance.show = true;

    // Subscribe to select event
    componentRef.instance.select.subscribe((program: FlatProgram) => {
      this.openTab(program.tabKey, program.route);
      this.closeOverlay();
    });

    // Optional: subscribe to close event
    componentRef.instance.close.subscribe(() => {
      this.closeOverlay();
    });
  }

  private closeOverlay() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined!;
    }
  }



  openTab(tabKey: string, route: string): void {
    this.tabService.openTab(tabKey, route);
  }

  onProgramSelect(program: FlatProgram) {
    this.openTab(program.tabKey, program.route);
    this.showProgramDialog = false;
  }

  private flattenTree(items: MenuItem[]): FlatProgram[] {
    const result: FlatProgram[] = [];

    const walk = (nodes: MenuItem[]) => {
      for (const n of nodes) {
        if (n.tabKey && n.route) {
          result.push({
            tabKey: n.tabKey,
            name: n.name,
            route: n.route
          });
        }
        if (n.children?.length) {
          walk(n.children);
        }
      }
    };

    walk(items);
    return result;
  }

  onSearchEnter() {
  const key = this.searchInput.nativeElement.value.trim().toLowerCase();
  if (!key) return;

  // exact match: program id OR full name
  const match = this.allPrograms.find(p =>
    p.tabKey.toLowerCase() === key ||
    p.name.toLowerCase() === key
  );

  if (match) {
    this.openTab(match.tabKey, match.route);
    this.closeOverlay();
  }
}




  sideBarToggleButton() {
    this.sideBarToggle.emit();
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onBlur() {
    // Optional: close on blur (when clicking outside)
    // You can also use a click-outside directive for better UX
    // For now, we'll keep it simple
  }

  onSetting() {
    console.log('Go to settings');
    this.isDropdownOpen = false;
    // Add your logic here
  }

  onLogout() {
    console.log('Logging out...');
    this.isDropdownOpen = false;
    // Add logout logic (e.g., auth service)
  }

}
