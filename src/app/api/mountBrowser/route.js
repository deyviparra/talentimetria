import { launchReportBrowser } from '../../../services/report-browser'

export const maxDuration = 60

export async function POST() {
  try {
    const browser = await launchReportBrowser()
    await browser.close()
    return Response.json({ message: 'browser mounted', ok: true })
  } catch {
    return Response.json({ message: 'Error mounting browser', ok: false })
  }
}
