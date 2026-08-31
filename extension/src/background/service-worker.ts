import { getTabStreamId } from '../services/audio-capture'
import {
  START_SUBTITLES,
  STOP_SUBTITLES,
  START_OFFSCREEN_CAPTURE,
  STOP_OFFSCREEN_CAPTURE,
} from '../services/extension-messaging'

const OFFSCREEN_DOCUMENT_PATH = 'offscreen.html'

async function setupOffscreenDocument(): Promise<void> {
  const hasDocument = await chrome.offscreen.hasDocument()
  if (!hasDocument) {
    await chrome.offscreen.createDocument({
      url: OFFSCREEN_DOCUMENT_PATH,
      reasons: [chrome.offscreen.Reason.USER_MEDIA],
      justification: 'Capturing tab audio for realtime subtitles',
    })
  }
}

async function closeOffscreenDocument(): Promise<void> {
  const hasDocument = await chrome.offscreen.hasDocument()
  if (hasDocument) {
    await chrome.offscreen.closeDocument()
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === START_SUBTITLES) {
    ; (async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        const streamId = await getTabStreamId(tab?.id)
        console.log('Tab stream ID received:', streamId, 'for tab:', tab?.id)

        await setupOffscreenDocument()

        await chrome.runtime.sendMessage({
          type: START_OFFSCREEN_CAPTURE,
          streamId,
          language: message.language || 'si',
        })

        await chrome.storage.session.set({
          isCapturing: true,
          language: message.language || 'si',
          streamId,
        })

        if (chrome.action?.setBadgeText) {
          await chrome.action.setBadgeText({ text: 'REC' })
          await chrome.action.setBadgeBackgroundColor({ color: '#f38ba8' })
        }

        sendResponse({ success: true, streamId })
      } catch (error) {
        console.error('Failed to capture tab:', error)
        await closeOffscreenDocument().catch(() => { })
        await chrome.storage.session.set({
          isCapturing: false,
          error: (error as Error)?.message || String(error),
        })
        if (chrome.action?.setBadgeText) {
          await chrome.action.setBadgeText({ text: '' })
        }
        sendResponse({ success: false, error: (error as Error)?.message || String(error) })
      }
    })()
    return true
  }

  if (message.type === STOP_SUBTITLES) {
    ; (async () => {
      try {
        await chrome.runtime.sendMessage({ type: STOP_OFFSCREEN_CAPTURE }).catch(() => { })
        await closeOffscreenDocument()
        await chrome.storage.session.set({ isCapturing: false })

        if (chrome.action?.setBadgeText) {
          await chrome.action.setBadgeText({ text: '' })
        }

        console.log('Subtitles capture stopped')
        sendResponse({ success: true })
      } catch (error) {
        console.error('Failed to stop subtitles:', error)
        sendResponse({ success: false, error: (error as Error)?.message || String(error) })
      }
    })()
    return true
  }
})

chrome.runtime.onInstalled.addListener(() => {
  console.log('Realtime Subtitles installed')
  chrome.storage.session.set({ isCapturing: false })
})