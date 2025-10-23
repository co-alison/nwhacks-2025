import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import appTheme from "../styles/theme";

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const modes = [
    { path: "/display", label: "Display" },
    { path: "/practice", label: "Practice" },
    { path: "/quiz", label: "Quiz" },
    { path: "/modules", label: "Modules" },
  ];

  const secondaryItems = [
    { path: "/about", label: "About" },
    { path: "/gallery", label: "Gallery" },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawer = (
    <Box
      sx={{ width: 280 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '1rem',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <Typography
          sx={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#5e67bf',
          }}
        >
          Menu
        </Typography>
        <IconButton 
          onClick={toggleDrawer(false)}
          aria-label="Close menu"
          sx={{ color: '#555' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleNavigate("/")}
            sx={{
              padding: '1rem 1.5rem',
              '&:hover': {
                backgroundColor: 'rgba(94, 103, 191, 0.08)',
              },
            }}
          >
            <ListItemText 
              primary="Home"
              primaryTypographyProps={{
                fontSize: '1.1rem',
                color: '#333',
              }}
            />
          </ListItemButton>
        </ListItem>
        
        {modes.map((mode) => (
          <ListItem key={mode.path} disablePadding>
            <ListItemButton
              onClick={() => handleNavigate(mode.path)}
              selected={location.pathname.startsWith(mode.path)}
              sx={{
                padding: '1rem 1.5rem',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(94, 103, 191, 0.12)',
                  borderLeft: '4px solid #5e67bf',
                  '&:hover': {
                    backgroundColor: 'rgba(94, 103, 191, 0.2)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(94, 103, 191, 0.08)',
                },
              }}
            >
              <ListItemText 
                primary={mode.label}
                primaryTypographyProps={{
                  fontSize: '1.1rem',
                  fontWeight: location.pathname.startsWith(mode.path) ? 600 : 400,
                  color: location.pathname.startsWith(mode.path) ? '#5e67bf' : '#333',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        
        {secondaryItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => handleNavigate(item.path)}
              sx={{
                padding: '1rem 1.5rem',
                '&:hover': {
                  backgroundColor: 'rgba(94, 103, 191, 0.08)',
                },
              }}
            >
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '1.1rem',
                  color: '#555',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          top: 0,
          zIndex: 1000,
        }}
      >
        <Toolbar sx={{ 
          justifyContent: "space-between", 
          padding: { xs: "0.5rem 1rem", md: "0.5rem 2rem" },
          minHeight: { xs: '56px', sm: '64px' }
        }}>
          {/* Desktop Navigation */}
          {!isMobile && (
            <>
              <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                {/* Logo */}
                <Button
                  onClick={() => navigate("/")}
                  disableRipple
                  aria-label="Go to home page"
                  sx={{
                    fontSize: "1.4rem",
                    fontFamily: "Roboto, sans-serif",
                    padding: "0.6rem 1rem",
                    minWidth: "auto",
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "8px",
                    textTransform: "none",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(94, 103, 191, 0.08)",
                      border: "none",
                    },
                    "&:focus-visible": {
                      outline: "3px solid #5e67bf",
                      outlineOffset: "2px",
                      backgroundColor: "rgba(94, 103, 191, 0.08)",
                    },
                  }}
                >
                  <img
                    src="/website_logo.svg"
                    alt="Braillearn home"
                    style={{
                      height: "28px",
                      width: "auto",
                      display: "block",
                    }}
                  />
                </Button>

                {/* Divider */}
                <Box
                  sx={{
                    width: "1px",
                    height: "30px",
                    backgroundColor: "#e2e8f0",
                    margin: "0 0.5rem",
                  }}
                  aria-hidden="true"
                />

                {/* Mode Buttons */}
                {modes.map((mode) => (
                  <Button
                    key={mode.path}
                    onClick={() => navigate(mode.path)}
                    disableRipple
                    aria-label={`Go to ${mode.label} page`}
                    aria-current={location.pathname.startsWith(mode.path) ? "page" : undefined}
                    sx={{
                      fontSize: "1.1rem",
                      fontFamily: "Roboto, sans-serif",
                      padding: "0.6rem 1.2rem",
                      backgroundColor: location.pathname.startsWith(mode.path)
                        ? appTheme.palette.custom.buttonBackground
                        : "transparent",
                      color: location.pathname.startsWith(mode.path)
                        ? "white"
                        : "#555",
                      border: "none",
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: location.pathname.startsWith(mode.path) ? 600 : 400,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: location.pathname.startsWith(mode.path)
                          ? appTheme.palette.custom.buttonHover
                          : "rgba(94, 103, 191, 0.08)",
                        border: "none",
                      },
                      "&:focus-visible": {
                        outline: "3px solid #5e67bf",
                        outlineOffset: "2px",
                        backgroundColor: location.pathname.startsWith(mode.path)
                          ? appTheme.palette.custom.buttonHover
                          : "rgba(94, 103, 191, 0.15)",
                      },
                    }}
                  >
                    {mode.label}
                  </Button>
                ))}
              </Box>
              
              <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                {secondaryItems.map((item) => (
                  <Button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    disableRipple
                    aria-label={`Go to ${item.label} page`}
                    sx={{
                      color: "#555",
                      fontSize: "1.1rem",
                      fontFamily: "Roboto, sans-serif",
                      padding: "0.6rem 1.2rem",
                      textTransform: "none",
                      borderRadius: "8px",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "rgba(94, 103, 191, 0.08)",
                      },
                      "&:focus-visible": {
                        outline: "3px solid #5e67bf",
                        outlineOffset: "2px",
                        backgroundColor: "rgba(94, 103, 191, 0.15)",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            </>
          )}

          {/* Mobile: Logo and Hamburger */}
          {isMobile && (
            <>
              <Button
                onClick={() => navigate("/")}
                disableRipple
                aria-label="Go to home page"
                sx={{
                  fontSize: "1.4rem",
                  fontFamily: "Roboto, sans-serif",
                  padding: "0.4rem 0.6rem",
                  minWidth: "auto",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "8px",
                  textTransform: "none",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(94, 103, 191, 0.08)",
                    border: "none",
                  },
                  "&:focus-visible": {
                    outline: "3px solid #5e67bf",
                    outlineOffset: "2px",
                    backgroundColor: "rgba(94, 103, 191, 0.08)",
                  },
                }}
              >
                <img
                  src="/website_logo.svg"
                  alt="Braillearn home"
                  style={{
                    height: "28px",
                    width: "auto",
                    display: "block",
                  }}
                />
              </Button>

              <IconButton
                onClick={toggleDrawer(true)}
                aria-label="Open navigation menu"
                sx={{
                  color: "#555",
                  "&:focus-visible": {
                    outline: "3px solid #5e67bf",
                    outlineOffset: "2px",
                  },
                }}
              >
                <MenuIcon sx={{ fontSize: "2rem" }} />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Navigation;
