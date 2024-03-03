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
  Input,
  Select,
  MenuItem
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils
} from '@mediapipe/tasks-vision'
import TypeOfExercise from './GestureScore/TypeOfExercise'

function Demo () {
  const poseLandmarker = useRef()
  const enableWebcamButton = useRef()
  const [webcamRunning, setWebcamRunning] = useState(false)
  const videoHeight = '360px'
  const videoWidth = '480px'
  const video = useRef()
  const canvasElement = useRef()
  const canvasCtx = useRef()
  const drawingUtils = useRef()
  const lastVideoTime = useRef(-1)

  const [file, setFile] = useState()
  const [type, setType] = useState('push-up')
  const [status, setStatus] = useState({
    score: 0,
    count: 0,
    status: false
  })

  const createPoseLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
    )
    poseLandmarker.current = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      numPoses: 2
    })
  }

  // Enable the live webcam view and start detection.
  async function enableCam (event, isCam) {
    if (!poseLandmarker.current) {
      await createPoseLandmarker()
    }

    if (webcamRunning === true) {
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
      setWebcamRunning(true)
      setStatus({
        score: 0,
        count: 0,
        status: false
      })
      if (isCam) {
        // getUsermedia parameters.
        const constraints = {
          video: true
        }

        // Activate the webcam stream.
        navigator.mediaDevices.getUserMedia(constraints).then(stream => {
          video.current.srcObject = stream
        })
      } else {
        setWebcamRunning(true)
        video.current.srcObject = null
        video.current.src = URL.createObjectURL(file)
      }
    }
  }

  async function predictWebcam () {
    canvasElement.current.style.height = videoHeight
    video.current.style.height = videoHeight
    canvasElement.current.style.width = videoWidth
    video.current.style.width = videoWidth
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
                count: newCnt,
                status: newStatus,
                score: newScore
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

    // Call this function again to keep predicting when the browser is ready.
    if (webcamRunning === true) {
      window.requestAnimationFrame(predictWebcam)
    }
  }

  useEffect(() => {
    createPoseLandmarker()
    canvasCtx.current = canvasElement.current.getContext('2d')
    drawingUtils.current = new DrawingUtils(canvasCtx.current)
  }, [])

  return (
    <Grid container>
      <Grid item xs={6} style={{ position: 'relative' }}>
        <video
          autoPlay
          playsInline
          ref={video}
          onLoadedData={predictWebcam}
          style={{
            width: '480px',
            height: '360px',
            position: 'absolute',
            clear: 'both',
            display: 'block',
            transform: 'rotateY(180deg)'
          }}
        ></video>
        <canvas
          ref={canvasElement}
          width='480px'
          height='360px'
          style={{
            position: 'absolute',
            left: '0px',
            top: '0px',
            transform: 'rotateY(180deg)',
            zIndex: 1
          }}
        ></canvas>
      </Grid>

      <Grid item xs={6}>
        <Input type='file' onChange={e => setFile(e.target.files[0])}></Input>
        <Select value={type} onChange={e => setType(e.target.value)}>
          <MenuItem value='push-up'>引体向上</MenuItem>
          <MenuItem value='pull-up'>俯卧撑</MenuItem>
          <MenuItem value='squat'>深蹲</MenuItem>
          <MenuItem value='walk'>行走</MenuItem>
          <MenuItem value='sit-up'>仰卧起坐</MenuItem>
        </Select>
        <Button
          variant='contained'
          ref={enableWebcamButton}
          onClick={e => enableCam(e, false)}
        >
          {webcamRunning ? '关闭视频' : '打开视频'}
        </Button>
        <Button
          variant='contained'
          ref={enableWebcamButton}
          onClick={e => enableCam(e, true)}
        >
          {webcamRunning ? '结束健身' : '开始健身'}
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>计数</TableCell>
                <TableCell>状态</TableCell>
                <TableCell>平均分</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{status.count}</TableCell>
                <TableCell>{status.status ? '完成' : '  未完成'}</TableCell>
                <TableCell>{status.score.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default Demo
