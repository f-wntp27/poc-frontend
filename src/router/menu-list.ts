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
    label: 'สถานะการขออนุมัติใบอนุญาต',
    icon: 'mdi mdi-list-status',
    path: '/license-status-log',
  },
  // {
  //   label: 'TEST Children',
  //   icon: 'pi pi-palette',
  //   children: [
  //     {
  //       label: 'Test 1',
  //       icon: 'pi pi-eraser',
  //       path: '/',
  //     },
  //     {
  //       label: 'Test 2',
  //       icon: 'pi pi-heart',
  //       path: '/',
  //     },
  //   ],
  // },
];

// กรอกใบอนุญาต,
// อย. อนุมัติใบอนุญาตนำเข้ายา FDA approve (import drug), กรมสรรพสามิตอนุมัติใบอนุญาตนำเข้ายา Excise approve (import),
// อย. อนุมัติใบอนุญาตนำเข้าวัตถุดิบยา FDA approve (import material),
// Request state log
// signin register
