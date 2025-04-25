import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Collapse,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import menuItems from './sidebarManuItems';
import MenuIcon from "@mui/icons-material/Menu";

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (menuKey) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const getLinkClasses = (path) =>
    location.pathname === path
      ? 'bg-orange-500 text-white w-full p-2 rounded'
      : 'hover:bg-orange-400 hover:text-white w-full p-2 rounded';

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? 60 : 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isCollapsed ? 60 : 250,
          transition: 'width 0.3s',
          boxSizing: 'border-box',
          overflowX: 'hidden',
          backgroundColor: '#001f4d', // Navy blue
          color: 'white',
        },
      }}
    >
      <DrawerHeader>
        <IconButton edge="start" onClick={toggleSidebar} sx={{ mr: 2 }}>
          <MenuIcon sx={{ fontSize: "28px", color: "#ffffff" }} />
        </IconButton>
      </DrawerHeader>

      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />

      <List>
        {menuItems.map((menu, index) => (
          <React.Fragment key={index}>
            {menu.submenu ? (
              <>
                <ListItem
                  button
                  onClick={() => toggleSubmenu(menu.text)}
                  sx={{
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#002b66',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                    {menu.icon}
                  </ListItemIcon>
                  {!isCollapsed && <ListItemText primary={menu.text} />}
                  {!isCollapsed &&
                    (openSubmenus[menu.text] ? <ExpandLess /> : <ExpandMore />)}
                </ListItem>
                <Collapse in={openSubmenus[menu.text]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {menu.submenu.map((subItem, subIndex) => (
                      <ListItem
                        button
                        component={Link}
                        to={subItem.path}
                        key={subIndex}
                        className={getLinkClasses(subItem.path)}
                        sx={{
                          pl: 4,
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#002b66',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                          {subItem.icon}
                        </ListItemIcon>
                        <ListItemText primary={subItem.text} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem
                button
                component={Link}
                to={menu.path}
                className={getLinkClasses(menu.path)}
                key={menu.text}
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#002b66',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                  {menu.icon}
                </ListItemIcon>
                {!isCollapsed && <ListItemText primary={menu.text} />}
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
