import { useEffect, useRef, useState } from 'react'
import {
  Button,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Table,
  TableHead,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  ButtonGroup
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils
} from '@mediapipe/tasks-vision'
import axios from 'axios'
import { throttle } from 'lodash'
import TypeOfExercise from './GestureScore/TypeOfExercise'
import Circle from './components/Circle'
import { speakChinese, exerciseNameMap } from './utils'
import { useTranslation } from 'react-i18next'

function Exercise () {
  const poseLandmarker = useRef()
  const [webcamRunning, setWebcamRunning] = useState(false)
  const video = useRef()
  const canvasElement = useRef()
  const canvasCtx = useRef()
  const drawingUtils = useRef()
  const lastVideoTime = useRef(-1)
  const animationFrameId = useRef()
  const throttledSpeakChinese = useRef(throttle(speakChinese, 2000))
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('md'))
  const { t, i18n } = useTranslation()

  const [file, setFile] = useState()
  const [type, setType] = useState('pull-up')
  const [status, setStatus] = useState({
    prevCount: 0,
    score: 0,
    count: 0,
    status: true,
    historyScores: []
  })

  const createPoseLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
    )
    poseLandmarker.current = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        // modelAssetPath: `http://localhost:3000/pose_landmarker_lite.task`,
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      minPoseDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    })
  }

  async function enableCam (event, isCam) {
    if (!poseLandmarker.current) {
      await createPoseLandmarker()
    }

    if (webcamRunning) {
      setWebcamRunning(false)

      poseLandmarker.current = null

      const stream = video.current.srcObject
      if (stream) {
        const tracks = stream.getTracks()
        tracks.forEach(track => track.stop())
        video.current.srcObject = null
      }
      video.current.src = null

      canvasCtx.current.clearRect(
        0,
        0,
        canvasElement.current.width,
        canvasElement.current.height
      )
    } else {
      setStatus({
        prevCount: 0,
        score: 0,
        count: 0,
        status: true,
        historyScores: []
      })
      if (isCam) {
        setWebcamRunning('cam')
        const constraints = {
          video: true
        }

        navigator.mediaDevices.getUserMedia(constraints).then(stream => {
          video.current.srcObject = stream
        })
      } else {
        setWebcamRunning('file')
        video.current.srcObject = null
        video.current.src = URL.createObjectURL(file)
      }
    }
  }

  async function predictWebcam () {
    canvasElement.current.style.height = matches ? '360px' : '180px'
    video.current.style.height = matches ? '360px' : '180px'
    canvasElement.current.style.width = matches ? '480px' : '180px'
    video.current.style.width = matches ? '480px' : '180px'
    // Now let's start detecting the stream.
    let startTimeMs = performance.now()
    if (lastVideoTime.current !== video.current.currentTime) {
      lastVideoTime.current = video.current.currentTime
      poseLandmarker.current &&
        poseLandmarker.current.detectForVideo(
          video.current,
          startTimeMs,
          result => {
            setStatus(prev => {
              const [newCnt, newStatus, newScore] = new TypeOfExercise(
                result.landmarks[0]
              ).calculateExercise(type, prev.count, prev.status, prev.score)

              return {
                prevCount: prev.count,
                count: newCnt,
                status: newStatus,
                score: newScore,
                historyScores:
                  newCnt > prev.count
                    ? [newScore, ...prev.historyScores]
                    : prev.historyScores
              }
            })

            canvasCtx.current.save()
            canvasCtx.current.clearRect(
              0,
              0,
              canvasElement.current.width,
              canvasElement.current.height
            )
            for (const landmark of result.landmarks) {
              drawingUtils.current.drawLandmarks(landmark, {
                radius: data =>
                  data.from && DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1)
              })
              drawingUtils.current.drawConnectors(
                landmark,
                PoseLandmarker.POSE_CONNECTIONS
              )
            }
            canvasCtx.current.restore()
          }
        )
    }

    if (webcamRunning) {
      animationFrameId.current = window.requestAnimationFrame(predictWebcam)
    }
  }

  useEffect(() => {
    createPoseLandmarker()
    canvasCtx.current = canvasElement.current.getContext('2d')
    drawingUtils.current = new DrawingUtils(canvasCtx.current)

    return () => {
      setStatus({
        prevCount: 0,
        score: 0,
        count: 0,
        status: true,
        historyScores: []
      })
      animationFrameId.current &&
        window.cancelAnimationFrame(animationFrameId.current)
      poseLandmarker.current = null
    }
  }, [type])

  useEffect(() => {
    if (status.prevCount + 1 === status.count) {
      throttledSpeakChinese.current(status.count)
    }
  }, [status, throttledSpeakChinese])

  return (
    <Grid container>
      <Grid xs={12} md={6} sx={{ mb: matches ? '410px' : '280px' }}>
        <div style={{ position: 'relative' }}>
          <video
            autoPlay
            playsInline
            ref={video}
            onLoadedData={predictWebcam}
            onEnded={() =>
              speakChinese(
                `您一共完成了${status.count}个${exerciseNameMap[type]}`
              )
            }
            style={{
              width: matches ? '480px' : '180px',
              height: matches ? '360px' : '180px',
              left: '50px',
              top: '50px',
              position: 'absolute',
              clear: 'both',
              display: 'block',
              transform: 'rotateY(180deg)'
            }}
          ></video>
          <canvas
            ref={canvasElement}
            width={matches ? '480px' : '180px'}
            height={matches ? '360px' : '180px'}
            style={{
              position: 'absolute',
              left: '50px',
              top: '50px',
              transform: 'rotateY(180deg)',
              zIndex: 1
            }}
          ></canvas>
        </div>
      </Grid>

      <Grid container xs={12} md={6} spacing={2} sx={{ paddingLeft: '20px' }}>
        <Grid xs={12} md={6}>
          <InputLabel id='type'>{t('actChoose')}</InputLabel>
          <Select
            value={type}
            labelId='type'
            onChange={e => setType(e.target.value)}
          >
            {/* <MenuItem value='push-up'>{t('pushUp')}</MenuItem> */}
            <MenuItem value='pull-up'>{t('pullUp')}</MenuItem>
            <MenuItem value='squat'>{t('squat')}</MenuItem>
            <MenuItem value='walk'>{t('walk')}</MenuItem>
            <MenuItem value='sit-up'>{t('sitUp')}</MenuItem>
          </Select>
        </Grid>
        <Grid xs={12} md={6}>
          <InputLabel id='file'>{t('vidChoose')}</InputLabel>
          <TextField
            type='file'
            onChange={e => setFile(e.target.files[0])}
          ></TextField>
        </Grid>
        <Grid xs={12}>
          <ButtonGroup variant='contained'>
            <Button
              onClick={e => enableCam(e, false)}
              disabled={webcamRunning === 'cam' || !file}
            >
              {webcamRunning === 'file'
                ? t('closeFile')
                : webcamRunning === 'cam'
                ? t('closeCamP')
                : t('openFile')}
            </Button>
            <Button
              onClick={e => enableCam(e, true)}
              disabled={webcamRunning === 'file'}
            >
              {webcamRunning === 'cam'
                ? t('closeCam')
                : webcamRunning === 'file'
                ? t('closeFileP')
                : t('openCam')}
            </Button>
            <Button
              onClick={async () => {
                try {
                  const response = await axios.post(
                    'http://localhost:3001/fitness-data',
                    {
                      scores: status.historyScores,
                      userId: localStorage.getItem('userId'),
                      type
                    }
                  )
                } catch (error) {
                  console.error('fail to upload:', error)
                }
              }}
            >
              {t('uploadData')}
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid container xs={12}>
          <Grid xs={6}>
            <Circle
              text={
                status.count +
                t('times') +
                (i18n.language === 'en' && status.count > 1 ? 's' : '')
              }
              color='primary.main'
            />
          </Grid>
          <Grid xs={6}>
            <Circle text={status.score.toFixed(2)} color='secondary.main' />
          </Grid>
        </Grid>
        <Grid xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('counter')}</TableCell>
                  <TableCell>{t('score')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {status.historyScores.map((value, index, arr) => (
                  <TableRow key={index}>
                    <TableCell>
                      {i18n.language != 'en' ? '第' : ''}
                      {arr.length - index}
                      {i18n.language === 'en'
                        ? arr.length - index === 1
                          ? 'st'
                          : arr.length - index === 2
                          ? 'nd'
                          : 'th'
                        : '次'}
                    </TableCell>
                    <TableCell>{value.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Exercise
