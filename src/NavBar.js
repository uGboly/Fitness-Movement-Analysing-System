import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const getButtonStyle = (path) => ({
    fontWeight: location.pathname === path ? 'bold' : 'normal',
    fontSize: location.pathname === path ? '1.1rem' : '1rem',
    color: location.pathname === path ? 'secondary.main' : 'inherit',
  });

  return (
    <AppBar position="static" sx={{marginBottom:'20px'}}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          健身动作评估系统
        </Typography>
        <Button sx={getButtonStyle('/login')} onClick={() => navigate('/login')}>登陆</Button>
        <Button sx={getButtonStyle('/register')} onClick={() => navigate('/register')}>注册</Button>
        <Button sx={getButtonStyle('/exercise')} onClick={() => navigate('/exercise')}>健身</Button>
        <Button sx={getButtonStyle('/records')} onClick={() => navigate('/records')}>记录</Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
