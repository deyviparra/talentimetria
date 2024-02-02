'use client'
import React, { useEffect } from 'react'
import s from './page.module.scss'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.push('/onBoarding')
  }, [])

  return (
    <main className={s.main}>
      <div className={s.logo}>
        <Image src='/logo.png' width={250} height={50} alt='Logo de talentimetria' />
      </div>
      <div className={s.background}>
        <div className={s.pink}></div>
        <div className={s.blue}></div>
        <div className={s.yellow}></div>
        <div className={s.green}></div>
        <h1>Bienvenido</h1>
      </div>
    </main>
  )
}
