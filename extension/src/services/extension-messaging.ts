export const START_SUBTITLES = 'START_SUBTITLES'
export const STOP_SUBTITLES = 'STOP_SUBTITLES'

export const START_OFFSCREEN_CAPTURE = 'START_OFFSCREEN_CAPTURE'
export const STOP_OFFSCREEN_CAPTURE = 'STOP_OFFSCREEN_CAPTURE'

export function startSubtitles(language: string): Promise<{ success: boolean; error?: string }> {
  return chrome.runtime.sendMessage({
    type: START_SUBTITLES,
    language,
  })
}

export function stopSubtitles(): Promise<{ success: boolean; error?: string }> {
  return chrome.runtime.sendMessage({
    type: STOP_SUBTITLES,
  })
}