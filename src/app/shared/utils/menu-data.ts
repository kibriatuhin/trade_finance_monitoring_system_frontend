import { MenuItem } from '../models/MenuItem.model';

export const TREE_DATA: MenuItem[] = [
  {
    id: 1,
    name: 'DashBoard',
    icon: 'dashboard',
    children: [
      { id: 101, name: 'Import Monitoring', route: '/import', tabKey: 'IMPMNTG' },
      { id: 102, name: 'Export Monitoring', route: '/export', tabKey: 'EXPMNTG' },
      { id: 103, name: 'Branch Monitoring', route: '/branches', tabKey: 'BRMNTG' },
      {
        id: 104,
        name: 'Transactions Monitoring',
        children: [
          {
            id: 1041,
            name: 'Import Transactions',
            route: '/import-transactions',
            tabKey: 'IMTRNMNTG'
          },
          {
            id: 1042,
            name: 'Export Transactions',
            route: '/export-transactions',
            tabKey: 'EXTRNMNTG'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Report',
    icon: 'flight_land',
    children: [
      { id: 201, name: 'Import Details', route: '/import-details', tabKey: 'Details' },
      { id: 202, name: 'Import Payment Details', route: '/import/history', tabKey: 'ImportPayment' }
    ]
  }
];
