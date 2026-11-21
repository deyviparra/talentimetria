import { randomUUID } from 'node:crypto'
import { sendEmailService } from '../../../services/email'
import { launchReportBrowser, waitForReportReady } from '../../../services/report-browser'
import { getEmailHTML } from '../../../utils/email'

export const maxDuration = 60

async function renderReport(url) {
  const browser = await launchReportBrowser()
  try {
    const page = await browser.newPage()
    const response = await page.goto(url, { waitUntil: 'domcontentloaded' })
    if (!response?.ok()) throw new Error('Report page unavailable')

    await waitForReportReady(page)

    const pdf = await page.pdf({
      format: 'letter',
      displayHeaderFooter: true,
      scale: 0.7,
      printBackground: true,
      margin: {
        top: '50px',
        bottom: '120px',
        left: '30px',
        right: '30px',
      },
      headerTemplate: `<div style='display:flex; justify-content: flex-end;'>
        <p style=" font-size: 12px; margin: 4px 0;"> <span class='date'></span></p>
      </div>`,
      footerTemplate: `<div style='display: flex; margin-bottom: 0px; justify-content: space-between; align-items: center; width: 100%; padding: 0 20px; background-color: #DEEDF5; height: 100px; -webkit-print-color-adjust: exact;'>
      <div>
        <p style=" font-size: 14px; margin: 4px 0;">henry.ospina@talentimetria.com</p>
        <p style=" font-size: 14px; margin: 4px 0;">Teléfono: 3005043679</p>
        <p style=" font-size: 14px; margin: 4px 0;">Talentimetria.com</p>
      </div>
      <p style=" font-size: 14px">Página <span class='pageNumber'></span></p>
    </div>`,
    })
    const content = Buffer.from(pdf)
    if (content.subarray(0, 5).toString() !== '%PDF-') {
      throw new Error('Invalid report PDF')
    }
    return content
  } finally {
    await browser.close()
  }
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ message: 'Invalid report request' }, { status: 400 })
  }

  const { docId, emailTest } = body ?? {}
  const recipient = emailTest || 'henry.ospina@talentimetria.com'
  if (typeof docId !== 'string' || !docId || typeof recipient !== 'string' ||
      !/^[^\s@,;<>]+@[^\s@,;<>]+$/.test(recipient)) {
    return Response.json({ message: 'Invalid report request' }, { status: 400 })
  }

  const url = new URL('/pdf-result', request.nextUrl.origin)
  url.searchParams.set('id', docId)
  const docName = `${randomUUID()}.pdf`
  let content
  try {
    content = await renderReport(url.href)
  } catch {
    console.error('[generateReport] PDF generation failed')
    return Response.json({ message: 'Error generating PDF' }, { status: 500 })
  }

  try {
    const info = await sendEmailService(
      recipient,
      'Resultado de tu test ESTILOS PERSONALES',
      getEmailHTML('Resultado de tu test ESTILOS PERSONALES', 'Hola, te enviamos el resultado de tu test ESTILOS PERSONALES.'),
      [{ filename: docName, content, contentType: 'application/pdf' }],
    )
    if (!info?.accepted?.some(address => address.toLowerCase() === recipient.toLowerCase())) {
      throw new Error('SMTP did not accept recipient')
    }
  } catch {
    console.error('[generateReport] SMTP submission failed')
    return Response.json({ message: 'Error sending report email' }, { status: 502 })
  }

  return Response.json({ message: 'PDF generated', docName, emailAccepted: true })
}
