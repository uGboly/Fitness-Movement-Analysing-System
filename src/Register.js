import React, { useState } from 'react'
import { Button, ButtonGroup, TextField, Box } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleRegister = async e => {
    e.preventDefault()
    try {
      const response = await axios.post(
        'http://localhost:3001/register',
        { email, password },
        { withCredentials: true }
      )

      if (response.data.message === 'Registration successful') {
        navigate('/exercise')
      } else {
        console.error('Unexpected response:', response.data)
      }
    } catch (error) {
      console.error('Failed to register:', error)
    }
  }

  return (
    <Box
      component='form'
      onSubmit={handleRegister}
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
        <TextField
          required
          id='password_ensure'
          label={t('passwordEnsure')}
          type='password'
        />
        <ButtonGroup>
          <Button type='submit' variant='contained' sx={{ mt: 3, ml: 1 }}>
            {t('register')}
          </Button>
          <Button
            variant='contained'
            sx={{ mt: 3, ml: 1 }}
            onClick={() => navigate('/')}
          >
            {t('returnToLogin')}
          </Button>
        </ButtonGroup>
      </div>
    </Box>
  )
}

export default Register
