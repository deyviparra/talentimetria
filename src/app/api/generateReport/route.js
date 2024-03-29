import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium-min'
import { promises as fs } from 'fs';
import nodemailer from 'nodemailer'
import path from 'path';

export async function GET(request) {
  return Response.json({ message: 'Hello World' })
}

export async function POST(request) {
  const body = await request.json()
  const URL = request.nextUrl.origin

  const { docId, email } = body
  try {
    const browser = await puppeteer.launch({
      args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(`${URL}/chromium-v122.0.0-pack.tar`),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    })
    const page = await browser.newPage()

    // go to the page
    await page.goto(`${URL}/pdf-result?id=${docId}`, { waitUntil: 'networkidle0' })

    //generate random name
    const randomName = Math.random().toString(36).substring(7) + '.pdf'


    await page.waitForSelector('#image')

    //generate pdf
    await page.pdf({
      path: `${path.join('/tmp', randomName)}`,
      format: 'letter',
      displayHeaderFooter: true,
      scale: 0.7,
      headerTemplate: ``,
      printBackground: true,
      margin: {
        top: '50px',
        bottom: '120px',
        left: '30px',
        right: '30px',
      },
      headerTemplate: `<div style='display:flex; justify-content: flex-end; >
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

    await browser.close()

    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use `true` for port 465, `false` for all other ports
      auth: {
        user: 'administrador@talentimetria.com',
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    })

    //send email
    const info = await transporter.sendMail({
      from: 'Talentimetria <administrador@talentimetria.com>',
      to: `${email}, henry.ospina@talentimetria.com`,
      subject: 'Resultado de tu test DISC',
      text: 'Hola, te enviamos el resultado de tu test DISC.',
      attachments: [
        {
          filename: `${randomName}`,
          path: `${path.join('/tmp', randomName)}`,
          contentType: 'application/pdf',
        },
      ],
    })

    console.log('Message sent: %s', info.messageId)
    //delete pdf
    // fs.unlinkSync(`${path.join(process.cwd(), 'tmp', randomName)}`)

    return Response.json({ message: 'Hello World POST' })
  } catch (error) {
    console.log(error)
  }
  return Response.json({ message: 'Hello World POST' })
}
