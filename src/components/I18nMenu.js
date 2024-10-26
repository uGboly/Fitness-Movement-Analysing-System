import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import TranslateIcon from '@mui/icons-material/Translate'
import { useTranslation } from 'react-i18next'

const lngs = {
  en: { nativeName: 'English' },
  zh: { nativeName: '中文' }
}

function I18nMenu () {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const { i18n } = useTranslation()

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuItemClick = (event, lng) => {
    setSelectedLanguage(lng)
    setAnchorEl(null)
    i18n.changeLanguage(lng)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <IconButton
        aria-controls={anchorEl ? 'i18n-menu' : undefined}
        aria-haspopup='true'
        color='inherit'
        onClick={handleClick}
      >
        <TranslateIcon />
      </IconButton>
      <Menu
        id='i18n-menu'
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        {Object.keys(lngs).map(lng => (
          <MenuItem
            key={lng}
            selected={lng === selectedLanguage}
            onClick={event => handleMenuItemClick(event, lng)}
          >
            {lngs[lng].nativeName}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default I18nMenu
