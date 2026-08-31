import { START_OFFSCREEN_CAPTURE, STOP_OFFSCREEN_CAPTURE } from '../services/extension-messaging'

console.log('Offscreen document loaded')

let activeStream: MediaStream | null = null
let audioContext: AudioContext | null = null
let mediaRecorder: MediaRecorder | null = null

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === START_OFFSCREEN_CAPTURE) {
    startOffscreenCapture(message.streamId, message.language)
      .then(() => sendResponse({ success: true }))
      .catch((err) => {
        console.error('Offscreen capture error:', err)
        sendResponse({ success: false, error: String(err) })
      })
    return true
  }

  if (message.type === STOP_OFFSCREEN_CAPTURE) {
    stopOffscreenCapture()
    sendResponse({ success: true })
    return true
  }
})

async function startOffscreenCapture(streamId: string, language: string): Promise<void> {
  if (activeStream) {
    stopOffscreenCapture()
  }

  console.log(`Starting offscreen audio capture for streamId: ${streamId}, language: ${language}`)

  activeStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      mandatory: {
        chromeMediaSource: 'tab',
        chromeMediaSourceId: streamId,
      },
    } as any,
    video: false,
  })

  console.log('Audio stream received:', activeStream)

  audioContext = new AudioContext()
  const source = audioContext.createMediaStreamSource(activeStream)
  source.connect(audioContext.destination)

  console.log('Audio processing started — tab audio routing to speakers')

  const options = MediaRecorder.isTypeSupported('audio/webm')
    ? { mimeType: 'audio/webm' }
    : undefined

  mediaRecorder = new MediaRecorder(activeStream, options)
  mediaRecorder.ondataavailable = (event: BlobEvent) => {
    if (event.data && event.data.size > 0) {
      console.log(`[Offscreen] Captured audio chunk: ${event.data.size} bytes`)
    }
  }

  mediaRecorder.start(1000)
  console.log('[Offscreen] Tab audio capture actively running')
}

function stopOffscreenCapture(): void {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
    mediaRecorder = null
  }

  if (audioContext) {
    audioContext.close()
    audioContext = null
  }

  if (activeStream) {
    activeStream.getTracks().forEach((track) => track.stop())
    activeStream = null
  }

  console.log('[Offscreen] Tab audio capture stopped')
}