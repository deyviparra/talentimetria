import React from 'react'
import s from './page.module.scss'
import Image from 'next/image'
import Link from 'next/link'

const Page = () => {
  return (
    <div className={s.container}>
      <div className={s.contentTest}>
        <Image src='/logo.png' width={250} height={50} alt='Logo de talentimetria'></Image>
        <div className={s.section}>
          <h1>¡Gracias!</h1>
          <Image src='/thank-you.png' width={300} height={300} alt='Logo de talentimetria'></Image>
          <p>¡Gracias por completar el test!</p>

          <Link href='/' className={s.button}>Volver</Link>
        </div>
      </div>
    </div>
  )
}

export default Page
