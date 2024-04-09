import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import axios from 'axios'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { exerciseNameMap } from './utils'

export default function Chart () {
  const [startTime, setStartTime] = useState(dayjs('2024-03-01'))
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

  useEffect(() => {
    fetchData()
  }, [startTime, endTime])

  return (
    <Grid container>
      <Grid
        xs={6}
        sx={{ display: 'flex', flex: 'row', justifyContent: 'center' }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='zh-cn'>
          <DateTimePicker
            value={startTime}
            onChange={newTime => setStartTime(newTime)}
            label='选择开始时间'
          />
        </LocalizationProvider>
      </Grid>
      <Grid
        xs={6}
        sx={{ display: 'flex', flex: 'row', justifyContent: 'center' }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='zh-cn'>
          <DateTimePicker
            value={endTime}
            onChange={newTime => setEndTime(newTime)}
            label='选择结束时间'
          />
        </LocalizationProvider>
      </Grid>
      <Grid
        xs={12}
        sx={{
          display: 'flex',
          flex: 'row',
          justifyContent: 'center',
          paddingTop: '40px'
        }}
      >
        <PieChart
          series={[
            {
              arcLabel: item => `${item.label} (${item.value})`,
              arcLabelMinAngle: 45,
              data: data.map((exercise, index) => {
                return {
                  id: index,
                  label: exerciseNameMap[exercise.type],
                  value: exercise.count
                }
              })
            }
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: 'white',
              fontWeight: 'bold'
            }
          }}
          width={500}
          height={300}
        />
      </Grid>
    </Grid>
  )
}
