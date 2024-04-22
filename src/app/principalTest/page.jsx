'use client'
import React, { useEffect, useState } from 'react'
import s from './page.module.scss'
import Image from 'next/image'
import testData from './data.json'
import { useRouter } from 'next/navigation'
import { saveUser, saveLog } from '../../actions/users'

const PrincipalTest = () => {
  const [userData, setUserData] = useState({})
  const [instructions, setInstructions] = useState(true)
  const [disableButton, setDisableButton] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState({})
  const [progress, setProgress] = useState(0)
  const [loader, setLoader] = useState(false)
  const [questionId, setQuestionId] = useState(0)
  const [questionResponse, setQuestionResponse] = useState({
    mas_array: [],
    menos_array: [],
  })
  const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT
  const router = useRouter()

  const sendEmail = async (docId) => {
    try {
      const body = {
        docId,
        email: userData.email,
      }
      await fetch('/api/mountBrowser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
    } catch (error) {
      console.error('Error sending email: ', error)
      saveLog({ log: { error, date: new Date() } })
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      const res = await fetch('/api/generateReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (res.ok) {
        fetch('/api/sendReport', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ docName: data.docName }),
        })
      }
    }
  }

  const saveUserDB = async (result) => {
    const userData = JSON.parse(localStorage.getItem('formTalentimetria'))
    const user = {
      ...userData,
      date: new Date(),
      result,
    }
    try {
      const docId = await saveUser({ user })
      sendEmail(docId)
      router.push(`/result`)
      return 'user added successfully'
    } catch (error) {
      await saveLog({ log: { error, date: new Date() } })
      console.error('Error saving user: ', error)
    }
  }

  useEffect(() => {
    const data = localStorage.getItem('formTalentimetria')
    setUserData(JSON.parse(data))
    setCurrentQuestion(testData.questions[0])
    setQuestionResponse({
      mas_array: new Array(testData.questions.length).fill(0),
      menos_array: new Array(testData.questions.length).fill(0),
    })
    fetch(process.env.NEXT_PUBLIC_HEALTH)
  }, [])

  const checkButton = (mas_array, menos_array, id) => {
    if (mas_array[id] != 0 && menos_array[id] != 0 && mas_array[id] != menos_array[id]) {
      setDisableButton(false)
    } else {
      setDisableButton(true)
    }
  }

  const Instructions = () => {
    return (
      <div className={s.content}>
        <Image src='/logo.png' width={250} height={50} alt='Logo de talentimetria'></Image>
        <h2>Instrucciones</h2>
        <p>
          En cada uno de los 28 grupos de palabras, escoja la palabra que más lo(a) represente y márquela en la columna
          más y escoja una palabra que menos lo(a) represente y márquela en la columna menos.
        </p>
        <p>Se recomienda responderlo pensando en su situación actual.</p>

        <div className={s.imgContainerExample}>
          <Image src='/test-example.jpg' fill objectFit='contain' alt=''></Image>
        </div>
        <button onClick={() => setInstructions(false)}>Comenzar</button>
      </div>
    )
  }

  const OptionSelector = ({ question }) => {
    const id = question?.id - 1

    const handleOnChange = (e) => {
      if (e.target.className === 'mas') {
        const mas_array = questionResponse.mas_array
        mas_array[id] = Number(e.target.value)
        setQuestionResponse({ ...questionResponse, mas_array })
        checkButton(mas_array, questionResponse.menos_array, id)
      } else {
        const menos_array = questionResponse.menos_array
        menos_array[id] = Number(e.target.value)
        setQuestionResponse({ ...questionResponse, menos_array })
        checkButton(questionResponse.mas_array, menos_array, id)
      }
    }

    return (
      <div className={s.optionComponent}>
        <div className={s.title}>
          <div className={s.empty}></div>
          <p>Más</p>
          <p>Menos</p>
        </div>
        <div className={s.optionsContainer}>
          {question?.options.map((option, idx) => (
            <div className={s.option} key={idx}>
              <label htmlFor={option}>{option}</label>
              <input
                type='radio'
                checked={idx + 1 == questionResponse.mas_array[id]}
                onChange={handleOnChange}
                name={idx + id}
                value={idx + 1}
                className='mas'
              />
              <input
                type='radio'
                checked={idx + 1 == questionResponse.menos_array[id]}
                onChange={handleOnChange}
                name={idx + id}
                value={idx + 1}
                className='menos'
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const ProgressBar = ({ value, max = 100 }) => {
    return (
      <div className={s.progressContainer}>
        <progress className={s.progressBar} max={max} value={value}></progress>
        <p>{value}% progreso</p>
      </div>
    )
  }

  const handlePrev = () => {
    if (progress > 0) {
      const testLength = testData.questions.length
      const progressValue = parseInt(((questionId - 1) / testLength) * 100)
      setProgress(progressValue)
      setQuestionId(questionId - 1)
      setCurrentQuestion(testData.questions[questionId - 1])
      checkButton(questionResponse.mas_array, questionResponse.menos_array, questionId - 1)
    } else {
      console.log('Inicio')
    }
  }

  const handleNext = async () => {
    if (progress < 100 && questionId < testData.questions.length - 1) {
      const testLength = testData.questions.length
      const progressValue = parseInt(((questionId + 1) / testLength) * 100)
      setProgress(progressValue)
      setQuestionId(questionId + 1)
      setCurrentQuestion(testData.questions[questionId + 1])
      checkButton(questionResponse.mas_array, questionResponse.menos_array, questionId + 1)
    } else {
      setLoader(true)
      const body = {
        name_input: userData.name,
        email_input: userData.email,
        cedula_input: userData.dni,
        motivo_input: userData.reason,
        mas_array: questionResponse.mas_array,
        menos_array: questionResponse.menos_array,
        profesion_input: userData.career,
        pais_input: userData.country,
        empresa_input: userData.business,
        edad_input: userData.age,
      }

      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT',
          'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Accept',
          'Access-control-Allow-Credentials': 'true',
        },
        body: JSON.stringify(body),
      })
      const data = await response.json()
      if (response.ok) {
        saveUserDB(data)
      }
    }
  }

  const Test = () => {
    return (
      <>
        {loader ? (
          <div className={s.loader}>
            <Image src='/loader.gif' height={300} width={300} alt='Cargando'></Image>
          </div>
        ) : (
          <div className={s.contentTest}>
            <Image src='/logo.png' width={250} height={50} alt='Logo de talentimetria'></Image>

            <div className={s.section}>
              <p>
                En cada uno de los 28 grupos de palabras, escoja la palabra que más lo(a) represente y márquela en la
                columna más y escoja una palabra que menos lo(a) represente y márquela en la columna menos.
              </p>
              <OptionSelector question={currentQuestion} />
              <div className={s.buttons}>
                {progress !== 0 ? (
                  <button onClick={handlePrev} className={s.back}>
                    Atrás
                  </button>
                ) : (
                  <div />
                )}
                <button
                  onClick={handleNext}
                  className={`${s.next} ${disableButton && s.disableButton}`}
                  disabled={disableButton}>
                  {progress < 96 ? 'Siguiente' : 'Finalizar'}
                </button>
              </div>
              <ProgressBar value={progress} />
            </div>
          </div>
        )}
      </>
    )
  }

  return <div className={s.container}>{instructions ? <Instructions /> : <Test />}</div>
}

export default PrincipalTest
