export const START_SUBTITLES = 'START_SUBTITLES'

export function startSubtitles(): void {
  chrome.runtime.sendMessage({
    type: START_SUBTITLES,
  })
}