import React, { useState } from 'react'
import { Button, TextField, Box } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate  = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3001/login', { email, password })
      const { userId } = response.data
      localStorage.setItem('userId', userId)
      navigate ('/exercise')
    } catch (error) {
      console.error('登录失败:', error)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          required
          id="email"
          label="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          required
          id="password"
          label="密码"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" sx={{ mt: 3, ml: 1 }}>
          登录
        </Button>
      </div>
    </Box>
  )
}

export default Login
