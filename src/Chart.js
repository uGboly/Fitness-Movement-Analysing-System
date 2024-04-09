import React, { useState } from 'react'
import { Button } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import dayjs from 'dayjs'
import axios from 'axios'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

export default function Chart () {
  const [startTime, setStartTime] = useState(dayjs())
  const [endTime, setEndTime] = useState(dayjs())
  const [data, setData] = useState([])

  const fetchData = async () => {
    const userId = +localStorage.getItem('userId')
    try {
      const response = await axios.post('http://localhost:3001/fitness-stat', {
        userId,
        startTime: startTime.valueOf(),
        endTime: endTime.valueOf()
      })
      setData(response.data)
    } catch (error) {
      console.error('Error fetching fitness data:', error)
    }
  }

  return (
    <Grid container>
      <Grid xs={6}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            value={startTime}
            onChange={newTime => setStartTime(newTime)}
            label='选择开始时间'
          />
        </LocalizationProvider>
      </Grid>
      <Grid xs={6}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            value={endTime}
            onChange={newTime => setEndTime(newTime)}
            label='选择结束时间'
          />
        </LocalizationProvider>
      </Grid>
      <Grid>
        <Button onClick={fetchData}>获取数据</Button>
        <Button onClick={()=>console.log(data)}>打印数据</Button>
      </Grid>
      <Grid>
        你选择的时间是{startTime.valueOf()} 和{endTime.valueOf()}
      </Grid>
    </Grid>
  )
}
