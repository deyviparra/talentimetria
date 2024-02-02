'use client'
import React, { useState, useEffect } from 'react'
import data from './data.json'
import Image from 'next/image'
import s from './page.module.scss'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter()
  const pages = data.pages
  const [pageIdx, setPageIdx] = useState(0)
  const [pageInfo, setPageInfo] = useState(pages[pageIdx || 0])

  const handleNext = () => {
    if (pageIdx === pages.length - 1) {
      router.push('/userForm')
    } else {
      setPageInfo(pages[pageIdx + 1])
      setPageIdx(pageIdx + 1)
    }
  }

  



  return (
    <main className={s.container}>
      <section className={s.logoSection}>
        <div className={s.logo}>
          <Image src={data?.logo} alt='' objectFit='contain' fill />
        </div>
        <div className={s.imageContainer}>
          <Image src={pageInfo?.image} alt='' objectFit='contain' fill />
        </div>
        {/* <div className={s.carroussel}>
          <p> carrousel texts </p>
          <div>dots</div>
        </div> */}
      </section>
      <section className={s.infoSection}>
        <div className={s.logoInfo}>
          <Image src={data?.logo} alt='' objectFit='contain' fill />
        </div>
        <p>{pageInfo?.text}</p>
        <button onClick={handleNext}>{pageInfo?.textButton}</button>
      </section>
    </main>
  )
}

export default Page
