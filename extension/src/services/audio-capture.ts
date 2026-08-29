export async function getTabStreamId(): Promise<string> {
    return chrome.tabCapture.getMediaStreamId()
}