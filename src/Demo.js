import { useEffect, useRef, useState } from 'react'
import './Demo.css'
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils
} from '@mediapipe/tasks-vision'

function Demo () {
  const demosSection = useRef()

  let poseLandmarker = useRef()
  let [runningMode, setRunningMode] = useState('VIDEO')
  let enableWebcamButton = useRef()
  let [webcamRunning, setWebcamRunning] = useState(false)
  const videoHeight = '360px'
  const videoWidth = '480px'

  const createPoseLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
    )
    poseLandmarker.current = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
        delegate: 'CPU'
      },
      runningMode: runningMode,
      numPoses: 2
    })
    demosSection.current.classList.remove('invisible')
  }

  const video = useRef()
  const canvasElement = useRef()
  const canvasCtx = useRef()
  const drawingUtils = useRef()

  // Enable the live webcam view and start detection.
  function enableCam (event) {
    if (!poseLandmarker.current) {
      console.log('Wait! poseLandmaker not loaded yet.')
      return
    }

    if (webcamRunning === true) {
      setWebcamRunning(false)
      enableWebcamButton.current.innerText = 'ENABLE PREDICTIONS'
    } else {
      setWebcamRunning(true)
      enableWebcamButton.current.innerText = 'DISABLE PREDICTIONS'
    }

    // getUsermedia parameters.
    const constraints = {
      video: true
    }

    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      video.current.srcObject = stream
      // video.current.addEventListener('loadeddata', predictWebcam)
    })
  }

  let lastVideoTime = -1
  async function predictWebcam () {
    canvasElement.current.style.height = videoHeight
    video.current.style.height = videoHeight
    canvasElement.current.style.width = videoWidth
    video.current.style.width = videoWidth
    // Now let's start detecting the stream.
    if (runningMode === 'IMAGE') {
      setRunningMode('VIDEO') 
      await poseLandmarker.current.setOptions({ runningMode: 'VIDEO' })
    }
    let startTimeMs = performance.now()
    if (lastVideoTime !== video.current.currentTime) {
      lastVideoTime = video.current.currentTime
      poseLandmarker.current.detectForVideo(video.current, startTimeMs, result => {
        canvasCtx.current.save()
        canvasCtx.current.clearRect(
          0,
          0,
          canvasElement.current.width,
          canvasElement.current.height
        )
        for (const landmark of result.landmarks) {
          drawingUtils.current.drawLandmarks(landmark, {
            radius: data => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1)
          })
          drawingUtils.current.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS)
        }
        canvasCtx.current.restore()
      })
    }

    // Call this function again to keep predicting when the browser is ready.
    if (webcamRunning === true) {
      window.requestAnimationFrame(predictWebcam)
    }
  }

  useEffect(() => {
    // Before we can use PoseLandmarker class we must wait for it to finish
    // loading. Machine Learning models can be large and take a moment to
    // get everything needed to run.
    createPoseLandmarker()
    canvasCtx.current = canvasElement.current.getContext('2d')
    drawingUtils.current = new DrawingUtils(canvasCtx.current)
  }, [])

  return (
    <section ref={demosSection} className='invisible'>
      <div id='liveView' className='videoView'>
        <button
          ref={enableWebcamButton}
          className='mdc-button mdc-button--raised'
          onClick={enableCam}
        >
          <span className='mdc-button__ripple'></span>
          <span className='mdc-button__label'>ENABLE WEBCAM</span>
        </button>
        <div style={{position: 'relative'}}>
          <video
            ref={video}
            onLoadedData={predictWebcam}
            style={{
              width: '1280px',
              height: '720px',
              position: 'absolute',
              autoplay: true,
              playsinline: true
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
