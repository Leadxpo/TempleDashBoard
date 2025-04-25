import React from 'react';
import {
  Dashboard as DashboardIcon,
  ManageAccounts as UserManagementIcon,
  MonetizationOn as PaymentsIcon,
  VolunteerActivism as DonateIcon,
  Block as BlockedIcon, // new suggestion
} from '@mui/icons-material';

const menuItems = [
  { path: '/dashboard', icon: <DashboardIcon />, text: 'Dashboard' },
  { path: '/users', icon: <UserManagementIcon />, text: 'Users' },
  { path: '/payments', icon: <PaymentsIcon />, text: 'Payments Data' },
  { path: '/order-data', icon: <DonateIcon />, text: 'Donate' },
  { path: '/blockednumbers', icon: <BlockedIcon />, text: 'Blocked Numbers' },
];
export default menuItems;
