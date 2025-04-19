import React from 'react';
import { Dashboard as DashboardIcon, LocalMall as ProductsIcon, 
        LocalShipping as OrdersIcon, Store as BrandsIcon,
       LocalOffer as CouponsIcon, ManageAccounts as UserManagementIcon, 
       Assignment as InventoryIcon, MonetizationOn as PaymentsIcon, Category as CategoriesIcon } from '@mui/icons-material';



const menuItems = [
  { path: '/dashboard', icon: <DashboardIcon />, text: 'Dashboard' },
  { path: '/users', icon: <UserManagementIcon />, text: 'Users',},
  { path: '/payments',icon: <OrdersIcon />, text: 'Payments Data' },
  { path: '/order-data',icon: <PaymentsIcon />, text: 'Donate' },
  { path: '/blockednumbers',icon: <PaymentsIcon />, text: 'Blocked Numbers' },




 
  
];

export default menuItems;
