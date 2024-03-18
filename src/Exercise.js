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

function Exercise() {
  const poseLandmarker = useRef()
  const [webcamRunning, setWebcamRunning] = useState(false)
  const videoHeight = '360px'
  const videoWidth = '480px'
  const video = useRef()
  const canvasElement = useRef()
  const canvasCtx = useRef()
  const drawingUtils = useRef()
  const lastVideoTime = useRef(-1)
  const animationFrameId = useRef()
  const throttledSpeakChinese = useRef(throttle(speakChinese, 2000))


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
        modelAssetPath: `http://localhost:3000/pose_landmarker_lite.task`,
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      minPoseDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    })
  }

  async function enableCam(event, isCam) {
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

  async function predictWebcam() {
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
                prevCount: prev.count,
                count: newCnt,
                status: newStatus,
                score: newScore,
                historyScores: newCnt > prev.count ? [newScore, ...prev.historyScores] : prev.historyScores
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
      animationFrameId.current && window.cancelAnimationFrame(animationFrameId.current)
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
      <Grid xs={6} style={{ position: 'relative' }}>
        <video
          autoPlay
          playsInline
          ref={video}
          onLoadedData={predictWebcam}
          onEnded={() => speakChinese(`您一共完成了${status.count}个${exerciseNameMap[type]}`)}
          style={{
            width: '480px',
            height: '360px',
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
          width='480px'
          height='360px'
          style={{
            position: 'absolute',
            left: '50px',
            top: '50px',
            transform: 'rotateY(180deg)',
            zIndex: 1
          }}
        ></canvas>
      </Grid>

      <Grid container xs={6} spacing={2}>
        <Grid xs={6}>
          <InputLabel id="type">选择健身动作类型</InputLabel>
          <Select value={type} labelId='type' onChange={e => setType(e.target.value)}>
            {/* <MenuItem value='push-up'>引体向上</MenuItem> */}
            <MenuItem value='pull-up'>俯卧撑</MenuItem>
            <MenuItem value='squat'>深蹲</MenuItem>
            <MenuItem value='walk'>行走</MenuItem>
            <MenuItem value='sit-up'>仰卧起坐</MenuItem>
          </Select>
        </Grid>
        <Grid xs={6}>
          <InputLabel id="file">选择健身视频</InputLabel>
          <TextField type='file' onChange={e => setFile(e.target.files[0])}></TextField >
        </Grid>
        <Grid xs={12}>
          <ButtonGroup variant="contained" >

            <Button
              onClick={e => enableCam(e, false)}
              disabled={webcamRunning === 'cam' || !file}
            >
              {webcamRunning === 'file' ? '关闭视频文件' : webcamRunning === 'cam' ? '请先关闭摄像头' : '打开视频文件'}
            </Button>
            <Button
              onClick={e => enableCam(e, true)}
              disabled={webcamRunning === 'file'}
            >
              {webcamRunning === 'cam' ? '关闭摄像头' : webcamRunning === 'file' ? '请先关闭视频文件' : '打开摄像头'}
            </Button>
            <Button
              onClick={async () => {
                try {
                  const response = await axios.post('http://localhost:3001/fitness-data', {
                    scores: status.historyScores,
                    userId: localStorage.getItem('userId'),
                    type
                  });
                  console.log('上传成功:', response.data);
                } catch (error) {
                  console.error('上传失败:', error);
                }
              }}
            >
              上传健身数据
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid container xs={12}>
          <Grid xs={6}><Circle text={status.count + '次'} color='primary.main' /></Grid>
          <Grid xs={6}><Circle text={status.score.toFixed(2)} color='secondary.main' /></Grid>
        </Grid>
        <Grid xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>计次</TableCell>
                  <TableCell>分数</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {status.historyScores.map((value, index, arr) => (
                  <TableRow key={index}>
                    <TableCell>第{arr.length - index}次</TableCell>
                    <TableCell>{value.toFixed(2)}</TableCell>
                  </TableRow>))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

      </Grid>
    </Grid>
  )
}

export default Exercise
