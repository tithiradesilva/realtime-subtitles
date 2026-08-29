const START_SUBTITLES = 'START_SUBTITLES'

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === START_SUBTITLES) {
    console.log('START_SUBTITLES received')
  }
})

chrome.runtime.onInstalled.addListener(() => {
  console.log('Realtime Subtitles installed')
})