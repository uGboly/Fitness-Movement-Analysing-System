import { useEffect, useRef, useState } from 'react'
import './Demo.css'
import { Button } from '@mui/material'
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils
} from '@mediapipe/tasks-vision'
import TypeOfExercise from './GestureScore/TypeOfExercise'

function Demo () {
  const demosSection = useRef()
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
    demosSection.current.classList.remove('invisible')
  }

  // Enable the live webcam view and start detection.
  async function enableCam (event) {
    if (!poseLandmarker.current) {
      await createPoseLandmarker()
    }

    if (webcamRunning === true) {
      setWebcamRunning(false)

      poseLandmarker.current = null

      const stream = video.current.srcObject
      const tracks = stream.getTracks()
      tracks.forEach(track => track.stop())
      video.current.srcObject = null

      canvasCtx.current.clearRect(
        0,
        0,
        canvasElement.current.width,
        canvasElement.current.height
      )
    } else {
      setWebcamRunning(true)
      // getUsermedia parameters.
      const constraints = {
        video: true
      }

      // Activate the webcam stream.
      navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        video.current.srcObject = stream
      })
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
            console.log(result)
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
    <section ref={demosSection} className='invisible'>
      <div className='videoView'>
        <Button
          variant='contained'
          ref={enableWebcamButton}
          className='mdc-button mdc-button--raised'
          onClick={enableCam}
        >
          {webcamRunning ? '结束健身' : '开始健身'}
        </Button>
        <div style={{ position: 'relative' }}>
          <video
            autoPlay
            playsInline
            ref={video}
            onLoadedData={predictWebcam}
            style={{
              width: '1280px',
              height: '720px',
              position: 'absolute'
            }}
          ></video>
          <canvas
            className='output_canvas'
            ref={canvasElement}
            width='1280'
            height='720'
            style={{ position: 'absolute', left: '0px', top: '0px' }}
          ></canvas>
        </div>
      </div>
    </section>
  )
}

export default Demo
