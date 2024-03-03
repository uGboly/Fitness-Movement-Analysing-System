import './Demo.css'

function Demo () {
  return (
    <section id='demos' className='invisible'>
      <div id='liveView' className='videoView'>
        <button id='webcamButton' className='mdc-button mdc-button--raised'>
          <span className='mdc-button__ripple'></span>
          <span className='mdc-button__label'>ENABLE WEBCAM</span>
        </button>
        <div style='position: relative,'>
          <video
            id='webcam'
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
            id='output_canvas'
            width='1280'
            height='720'
            style={{ position: absolute, left: '0px', top: '0px' }}
          ></canvas>
        </div>
      </div>
    </section>
  )
}

export default Demo
