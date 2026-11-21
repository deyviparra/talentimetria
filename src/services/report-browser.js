import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium-min'

const version = '147.0.1'
let executablePath

export function launchReportBrowser() {
  const arch = process.arch
  if (arch !== 'x64' && arch !== 'arm64') {
    throw new Error('Unsupported report browser architecture')
  }

  const pack = `https://github.com/Sparticuz/chromium/releases/download/v${version}/chromium-v${version}-pack.${arch}.tar`
  executablePath ??= chromium.executablePath(pack).catch(error => {
    executablePath = undefined
    throw error
  })

  return executablePath.then(path => puppeteer.launch({
    args: [...chromium.args, '--hide-scrollbars'],
    executablePath: path,
    headless: 'shell',
  }))
}

export async function waitForReportReady(page, timeout = 25_000) {
  await page.waitForFunction(() => {
    const report = document.querySelector('[data-report-ready="true"]')
    if (!report) return false
    const images = [...report.querySelectorAll('img')]
    return images.length > 0 && images.every(image => image.complete && image.naturalWidth > 0)
  }, { timeout })
}
