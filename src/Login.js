import React, { useState } from 'react'
import { Button, ButtonGroup, TextField, Box } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleLogin = async e => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3001/login', {
        email,
        password
      })
      const { userId } = response.data
      localStorage.setItem('userId', userId)
      navigate('/exercise')
    } catch (error) {
      console.error('Fail to Login:', error)
    }
  }

  return (
    <Box
      component='form'
      onSubmit={handleLogin}
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' }
      }}
      noValidate
      autoComplete='off'
    >
      <div>
        <TextField
          required
          id='email'
          label={t('email')}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          required
          id='password'
          label={t('password')}
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <ButtonGroup>
          <Button type='submit' variant='contained' sx={{ mt: 3, ml: 1 }}>
            {t('login')}
          </Button>
          <Button
            variant='contained'
            sx={{ mt: 3, ml: 1 }}
            onClick={() => navigate('/register')}
          >
            {t('newAccount')}
          </Button>
        </ButtonGroup>
      </div>
    </Box>
  )
}

export default Login
