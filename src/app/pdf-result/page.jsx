'use client'
import React, { useEffect, useState } from 'react'
import s from './page.module.scss'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { BarChart, Bar, Cell, XAxis, YAxis } from 'recharts'
import { getUser } from '../../actions/users'
import { useSearchParams } from 'next/navigation'

const Page = () => {
  const [work, setWork] = useState([])
  const [personal, setPersonal] = useState([])
  const [classic, setClassic] = useState([])
  const [result, setResult] = useState({})
  const [user, setUser] = useState({})
  const searchParams = useSearchParams()

  const getData = async () => {
    const id = searchParams.get('id')
    const res = await getUser({ docRefId: id })
    const userJSON = JSON.parse(res)
    const result = userJSON.result
    const discStr = 'DISC'
    const workAux = result?.chart.trabajo.map((el, idx) => {
      return { name: discStr[idx], uv: parseInt(el) }
    })
    const personalAux = result?.chart.personal.map((el, idx) => {
      return { name: discStr[idx], uv: parseInt(el) }
    })
    const classicAux = result?.chart.clasico.map((el, idx) => {
      return { name: discStr[idx], uv: parseInt(el) }
    })
    setWork(workAux)
    setPersonal(personalAux)
    setClassic(classicAux)
    setResult(result)
    setUser(userJSON)
  }

  useEffect(() => {
    getData()
  }, [])
  const colors = ['#C81D8E', '#EAA236', '#81AD44', '#2A8CCB']

  const Chart = ({ data, title }) => {
    return (
      <div className={s.chartConatiner}>
        <h3>{title}</h3>
        <BarChart
          width={300}
          height={220}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 10,
            bottom: 5,
          }}>
          {/* <CartesianGrid strokeDasharray='3 3' /> */}
          <XAxis dataKey='name' />
          <YAxis />
          <Bar dataKey='uv' fill='#8884d8' label={{ position: 'top', fontSize: '20px' }}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % 20]} />
            ))}
          </Bar>
        </BarChart>
      </div>
    )
  }

  const IconText = ({ name, size = 24, color = '#1f6f9a', text = '' }) => {
    const LucideIcon = dynamic(dynamicIconImports[name])
    return (
      <div className={s.iconText}>
        <LucideIcon color={color} size={size} />
        <p>{text}</p>
      </div>
    )
  }

  return (
    <div className={s.container}>
      <Image src='/logo.png' alt='logo' width={250} height={50} />
      <br />
      <br />

      <div className={s.userInfoContainer}>
        <IconText name='circle-user-round' size={150} />
        <div className={s.userDataBox}>
          <h2>{user.name}</h2>
          <div className={s.iconTextContainer}>
            <IconText name='square-user-round' text={user.dni} />
            <IconText name='mail' text={user.email} />
            <IconText name='cake' text={user.age + ' años'} />
            <IconText name='scan-face' text={user.gender === 'male' ? 'Masculino' : ' Femenino'} />
            <IconText name='briefcase-business' text={user.position} />
            <IconText name='building-2' text={user.sector} />
            <IconText name='flag' text={user.country} />
            <IconText name='text-select' text={user.reason} />
          </div>
        </div>
      </div>
      <p
        className={s.introduction}
        dangerouslySetInnerHTML={{ __html: result?.introduction?.replace(/\n/g, '<br>') }}></p>
      <div className={s.chartsContainer}>
        <Chart data={work} title='Trabajo:' />
        <Chart data={personal} title='Personal:' />
        <Chart data={classic} title='Clásico:' />
      </div>

      <h2>{result?.work?.title}:</h2>
      <p dangerouslySetInnerHTML={{ __html: result?.work?.text?.replace(/\n/g, '<br>') }}></p>
      <h2>{result?.personal?.title}:</h2>
      <p dangerouslySetInnerHTML={{ __html: result?.personal?.text?.replace(/\n/g, '<br>') }}></p>
      <h2>{result?.classic?.title}:</h2>
      <p dangerouslySetInnerHTML={{ __html: result?.classic?.text?.replace(/\n/g, '<br>') }}></p>
      <h2>{result?.pattern?.title}</h2>
      <div className={s.patternImg}>
        <img id='image' src={`/${result?.pattern?.title}.png`} alt='pattern' width={400} height={400} />
      </div>
      <p dangerouslySetInnerHTML={{ __html: result?.pattern?.text?.replace(/\n/g, '<br>') }}></p>
    </div>
  )
}
export default Page
