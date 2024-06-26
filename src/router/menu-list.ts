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
    label: 'ขอใบอนุญาตนำเข้ายา',
    icon: 'mdi mdi-list-box-outline',
    path: '/importation-drug-license',
  },
  {
    label: 'อย. แสดงความคิดเห็นใบอนุญาตนำเข้ายา',
    icon: 'mdi mdi-clipboard-check-outline',
    path: '/fda-approve-drug',
  },
  {
    label: 'กรมสรรพสามิตอนุมัติใบอนุญาตนำเข้ายา',
    icon: 'mdi mdi-clipboard-check-outline',
    path: '/excise-approve-drug',
  },
  {
    label: 'ขอใบอนุญาตนำเข้าวัตถุดิบยา',
    icon: 'mdi mdi-list-box-outline',
    path: '/importation-material-license',
  },
  {
    label: 'อย. อนุมัติใบอนุญาตนำเข้าวัตถุดิบยา',
    icon: 'mdi mdi-clipboard-check-outline',
    path: '/fda-approve-material',
  },
  // {
  //   label: 'กรมสรรพสามิตอนุมัติใบอนุญาตนำเข้าวัตถุดิบยา',
  //   icon: 'mdi mdi-clipboard-check-outline',
  //   path: '/excise-approve-material',
  // },
  {
    label: 'สถานะการขออนุมัติใบอนุญาตนำเข้ายา',
    icon: 'mdi mdi-list-status',
    path: '/license-drug-status-log',
  },
  {
    label: 'สถานะการขออนุมัติใบอนุญาตนำเข้าวัตถุดิบยา',
    icon: 'mdi mdi-list-status',
    path: '/license-materia-status-log',
  },
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
