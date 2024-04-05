interface MenuModel {
  label: string;
  icon: string;
  path?: string;
  children?: MenuModel[];
}

export const menuList: MenuModel[] = [
  {
    label: 'หน้าแรก',
    icon: 'pi pi-home',
    path: '/',
  },
  {
    label: 'ขอใบอนุญาตนำเข้า',
    icon: 'mdi mdi-list-box-outline',
    path: '/importation-license',
  },
  {
    label: 'อนุมัติใบอนุญาตนำเข้า',
    icon: 'mdi mdi-clipboard-check-outline',
    path: '/importation-license-approve',
  },
  {
    label: 'สถานะการขออนุมัติใบอนุญาตนำเข้า',
    icon: 'mdi mdi-list-status',
    path: '/license-status-log',
  },
  // {
  //   label: 'สถานะการขออนุมัติใบอนุญาตนำเข้าวัตถุดิบยา',
  //   icon: 'mdi mdi-list-status',
  //   path: '/license-materia-status-log',
  // },
  // {
  //   label: 'สถานะ',
  //   icon: 'mdi mdi-list-status',
  //   children: [
  //     {
  //       label: 'การขออนุมัติใบอนุญาตนำเข้ายา',
  //       icon: 'mdi mdi-list-status',
  //       path: '/license-drug-status-log',
  //     },
  //     {
  //       label: 'การขออนุมัติใบอนุญาตนำเข้าวัตถุดิบยา',
  //       icon: 'mdi mdi-list-status',
  //       path: '/license-materia-status-log',
  //     },
  //   ],
  // },
];

// กรอกใบอนุญาต,
// อย. อนุมัติใบอนุญาตนำเข้ายา FDA approve (import drug), กรมสรรพสามิตอนุมัติใบอนุญาตนำเข้ายา Excise approve (import),
// อย. อนุมัติใบอนุญาตนำเข้าวัตถุดิบยา FDA approve (import material),
// Request state log
// signin register
