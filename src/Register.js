import React, { useState } from 'react'
import { Button, ButtonGroup, TextField, Box } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async e => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3001/register', {
        email,
        password
      })
      const { userId } = response.data
      localStorage.setItem('userId', userId)
      navigate('/exercise')
    } catch (error) {
      console.error('注册失败:', error)
      // 处理错误
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
          label='邮箱'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          required
          id='password'
          label='密码'
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <TextField
          required
          id='password_ensure'
          label='确认密码'
          type='password'
        />
        <ButtonGroup>
          <Button type='submit' variant='contained' sx={{ mt: 3, ml: 1 }}>
            注册
          </Button>
          <Button variant='contained' sx={{ mt: 3, ml: 1 }}>
            返回登录页面
          </Button>
        </ButtonGroup>
      </div>
    </Box>
  )
}

export default Register
