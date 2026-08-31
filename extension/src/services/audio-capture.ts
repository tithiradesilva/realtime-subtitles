export async function getTabStreamId(targetTabId?: number): Promise<string> {
  const options: chrome.tabCapture.GetMediaStreamOptions = {}
  if (targetTabId !== undefined) {
    options.targetTabId = targetTabId
  }
  return chrome.tabCapture.getMediaStreamId(options)
}