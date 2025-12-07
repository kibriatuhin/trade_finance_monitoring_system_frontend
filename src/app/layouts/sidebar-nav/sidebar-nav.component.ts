import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { TabService } from "../../services/tabServices/tab.service";
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTree, MatTreeNode, MatTreeNestedDataSource } from '@angular/material/tree';
import { MatTreeModule } from '@angular/material/tree';



interface MenuItem {
  id: number;
  name: string;
  icon?: string;
  route?: string;
  tabKey?: string;
  children?: MenuItem[];
}





@Component({
    selector: "app-sidebar-nav",
    standalone: true,
    imports: [RouterModule, MatListModule, MatIconModule, MatButtonModule, CommonModule,MatTreeModule, MatTree, MatTreeNode],
    templateUrl: "./sidebar-nav.component.html",
    styleUrl: "./sidebar-nav.component.css",
})
export class SidebarNavComponent implements OnInit{
    @Input() isSidebarOpen: boolean = true;
    @Output() sidebarToggle = new EventEmitter<void>();

    
/*
    isSubmenuOpen: number[] = []; // store open submenu indexes
    isActiveMenu: number[] = []; // store active button indexes

    constructor(private tabService: TabService) {}

    openTab(title: string, route: string) {
        this.tabService.openTab(title, route);
    }

    toggleSubmenu(menuIndex: number) {
        if (this.isSubmenuOpen.includes(menuIndex)) {
            // if already open → close it
            this.isSubmenuOpen = this.isSubmenuOpen.filter((i) => i !== menuIndex);
            this.isActiveMenu = this.isActiveMenu.filter((i) => i !== menuIndex);
        } else {
            // if closed → open it
            this.isSubmenuOpen.push(menuIndex);
            this.isActiveMenu.push(menuIndex);
        }
    }*/

   // Track expanded menus
  isActiveMenu: number[] = [];
  isSubmenuOpen: number[] = [];

  // Tree control and data source
  treeControl = new NestedTreeControl<MenuItem>(node => node.children);
  treeDataSource = new MatTreeNestedDataSource<MenuItem>();

  constructor(private router: Router,private tabService: TabService) {}

  ngOnInit(): void {
    const TREE_DATA: MenuItem[] = [
      {
        id: 1,
        name: 'DashBoard',
        icon: 'dashboard',
        children: [
          { id: 101, name: 'Import Monitoring', route: '/import', tabKey: 'IMPMNTG' },
          { id: 102, name: 'Export Monitoring', route: '/export', tabKey: 'EXPMNTG' },
          { id: 103, name: 'Branch Monitoring', route: '/branches', tabKey: 'BRMNTG' },
          { id: 104, name: 'Import Transactions Monitoring', route: '/import-transactions', tabKey: 'IMTRNMNTG' },
          { id: 105, name: 'Export Transactions Monitoring', route: '/export-transactions', tabKey: 'EXTRNMNTG' }
        ]
      },
      {
        id: 2,
        name: 'Import Report',
        icon: 'flight_land',
        children: [
          { id: 201, name: 'Import Details', route: '/import-details', tabKey: 'Details' },
          { id: 202, name: 'Import Payment Details', route: '/import/history', tabKey: 'ImportPayment' }
        ]
      }
    ];

    this.treeDataSource.data = TREE_DATA;
  }

   // ✅ Correctly typed hasChild function
  hasChild = (_: number, node: MenuItem) => !!node.children && node.children.length > 0;

  toggleSubmenu(id: number): void {
    const node = this.findNodeById(id);
    if (node) {
      if (this.treeControl.isExpanded(node)) {
        this.treeControl.collapse(node);
        this.isSubmenuOpen = this.isSubmenuOpen.filter(i => i !== id);
      } else {
        this.treeControl.expand(node);
        this.isSubmenuOpen.push(id);
      }
      this.isActiveMenu = [id]; // Optional: highlight only current open menu
    }
  }

  openTab(tabKey: string, route: string): void {
   // console.log('Opening tab:', tabKey, 'Route:', route);
    this.tabService.openTab(tabKey, route);
    // Add your logic here
  }

  private findNodeById(id: number): MenuItem | undefined {
    const stack: MenuItem[] = [...this.treeDataSource.data];
    while (stack.length) {
      const node = stack.shift();
      if (node?.id === id) return node;
      if (node?.children) {
        stack.push(...node.children);
      }
    }
    return undefined;
  }
}
