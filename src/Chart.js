import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { Typography } from '@mui/material'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import axios from 'axios'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { summarizeFitnessActivities } from './utils'
import { useTranslation } from 'react-i18next'

export default function Chart () {
  const [startTime, setStartTime] = useState(dayjs('2024-03-01'))
  const [endTime, setEndTime] = useState(dayjs())
  const [data, setData] = useState([])
  const { t, i18n } = useTranslation()

  const fetchData = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/fitness-stat',
        {
          startTime: startTime.valueOf(),
          endTime: endTime.valueOf()
        },
        { withCredentials: true }
      )

      setData(response.data)
      console.log(response.data)
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
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={i18n.language === 'en' ? 'en' : 'zh-cn'}
        >
          <DateTimePicker
            value={startTime}
            onChange={newTime => setStartTime(newTime)}
            label={t('selectBeginning')}
          />
        </LocalizationProvider>
      </Grid>
      <Grid
        xs={6}
        sx={{ display: 'flex', flex: 'row', justifyContent: 'center' }}
      >
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={i18n.language === 'en' ? 'en' : 'zh-cn'}
        >
          <DateTimePicker
            value={endTime}
            onChange={newTime => setEndTime(newTime)}
            label={t('selectEnd')}
          />
        </LocalizationProvider>
      </Grid>
      <Grid
        xs={12}
        sx={{
          display: 'flex',
          flex: 'row',
          justifyContent: 'center',
          paddingY: '40px'
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
                  label: t(exercise.type),
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
      {data.length > 0 && (
        <Grid xs={12} sx={{ paddingX: '30%' }}>
          <Typography>
            {summarizeFitnessActivities(data, i18n.language)}
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}
