import nodemailer from 'nodemailer'
import path from 'path';


export async function POST(request) {
  try {
    const body = await request.json()
    const { docName } = body

    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use `true` for port 465, `false` for all other ports
      auth: {
        user: 'administrador@talentimetria.com',
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    })

    const info = await transporter.sendMail({
      from: 'Talentimetria <administrador@talentimetria.com>',
      to: `henry.ospina@talentimetria.com`,
      subject: 'Resultado de tu test ESTILOS PERSONALES',
      text: 'Hola, te enviamos el resultado de tu test ESTILOS PERSONALES.',
      attachments: [
        {
          filename: `${docName}`,
          path: `${path.join('/tmp', docName)}`,
          contentType: 'application/pdf',
        },
      ],
    })

    console.log('Message sent: %s', info.messageId)

    return Response.json({ message: 'Email sent' })
  } catch (error) {
    console.log(error)
    return Response.json({ message: 'Error sending email', error })
  }
}
