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
  Collapse,Typography
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
  height: '80px', // Increased height
  padding: theme.spacing(0, 2),
  backgroundColor: '#001f4d',
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
     <DrawerHeader sx={{ justifyContent: "space-between", px: 1 }}>
     <IconButton edge="start" onClick={toggleSidebar}>
    <MenuIcon sx={{ fontSize: "50px", color: "#ffffff" }} />
  </IconButton>
  <Typography
    variant="h6"
    sx={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: 'bold' }}
  >
    Admin Dashboard
  </Typography>

  
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
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: 'white',
                '& svg': {
                  fontSize: '1.8rem', // Icon size increased
                },
              }}
            >
              {menu.icon}
            </ListItemIcon>

            {!isCollapsed && (
              <ListItemText
                primary={menu.text}
                primaryTypographyProps={{
                  fontSize: '1.1rem', // Text size increased
                  fontWeight: 'bold',  // Text made bold
                }}
              />
            )}

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
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: 'white',
                      '& svg': {
                        fontSize: '1.6rem', // Submenu icon size
                      },
                    }}
                  >
                    {subItem.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={subItem.text}
                    primaryTypographyProps={{
                      fontSize: '1rem', // Submenu text size
                      fontWeight: 'bold',
                    }}
                  />
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
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: 'white',
              '& svg': {
                fontSize: '1.8rem', // Main menu icon size
              },
            }}
          >
            {menu.icon}
          </ListItemIcon>

          {!isCollapsed && (
            <ListItemText
              primary={menu.text}
              primaryTypographyProps={{
                fontSize: '1.2rem', // Main menu text size
                // fontWeight: 'bold',
              }}
            />
          )}
        </ListItem>
      )}
    </React.Fragment>
  ))}
</List>

    </Drawer>
  );
};

export default Sidebar;
