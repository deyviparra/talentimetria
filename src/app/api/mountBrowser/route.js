import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium-min'

export async function POST(request) {
  await puppeteer.launch({
    args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(`${URL}/chromium-v122.0.0-pack.tar`),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  })
  return Response.json({ message: 'browser mounted' })
}
