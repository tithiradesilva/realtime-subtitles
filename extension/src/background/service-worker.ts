import { getTabStreamId } from '../services/audio-capture'

const START_SUBTITLES = 'START_SUBTITLES'

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === START_SUBTITLES) {
      getTabStreamId()
        .then((streamId) => {
          console.log('Tab stream ID received:', streamId)
        })
        .catch((error) => {
          console.error('Failed to capture tab:', error)
        })
    }
})
  
chrome.runtime.onInstalled.addListener(() => {
    console.log('Realtime Subtitles installed')
})