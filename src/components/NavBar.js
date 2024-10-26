import React from 'react'
import { AppBar, Toolbar, Button, Typography } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import I18nMenu from './I18nMenu'

function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const {t} = useTranslation()

  const getButtonStyle = (path) => ({
    fontWeight: location.pathname === path ? 'bold' : 'normal',
    fontSize: location.pathname === path ? '1.1rem' : '1rem',
    color: location.pathname === path ? 'secondary.main' : 'inherit',
  })

  return (
    <AppBar position="static" sx={{ marginBottom: '20px' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          健身动作评估系统
        </Typography>
        {
          (location.pathname === '/' || location.pathname === '/register') && (<>
            <Button sx={getButtonStyle('/')} onClick={() => navigate('/')}>{t('login')}</Button>
            <Button sx={getButtonStyle('/register')} onClick={() => navigate('/register')}>注册</Button>
          </>)
        }
        {
          (location.pathname === '/exercise' ||  location.pathname === '/chart') && (<>
            <Button sx={getButtonStyle('/exercise')} onClick={() => navigate('/exercise')}>健身</Button>
            <Button sx={getButtonStyle('/chart')} onClick={() => navigate('/chart')}>统计</Button>
          </>)
        }
        <I18nMenu/>
      </Toolbar>
    </AppBar >
  )
}

export default NavBar
