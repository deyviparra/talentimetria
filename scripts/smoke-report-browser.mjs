// Run on a fresh Amazon Linux 2023 x64/arm64 instance with Node 24.
// When emulating the Vercel library detection locally: VERCEL=1 node scripts/smoke-report-browser.mjs
import assert from 'node:assert/strict'
import { launchReportBrowser, waitForReportReady } from '../src/services/report-browser.js'

for (let run = 0; run < 2; run++) {
  const browser = await launchReportBrowser()
  try {
    const page = await browser.newPage()
    await page.setContent('<main data-report-ready="false"><img id="image"><h1>Synthetic report</h1></main>')
    await assert.rejects(waitForReportReady(page, 100), { name: 'TimeoutError' })
    await page.setContent(`<main data-report-ready="true"><img id="image"><h1>Synthetic report</h1></main>`)
    await assert.rejects(waitForReportReady(page, 100), { name: 'TimeoutError' })
    await page.$eval('#image', image => {
      image.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%224%22 height=%224%22/%3E'
    })
    await waitForReportReady(page)
    const pdf = Buffer.from(await page.pdf())
    assert.ok(pdf.length > 1024)
    assert.equal(pdf.subarray(0, 5).toString(), '%PDF-')
  } finally {
    await browser.close()
  }
}
console.log('Synthetic PDF and readiness checks passed (cold + warm).')
