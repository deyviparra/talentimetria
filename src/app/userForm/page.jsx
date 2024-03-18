'use client'

import React, { useState, useEffect } from 'react'
import s from './page.module.scss'
import contriesJson from '../../utils/countries'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const UserForm = () => {
  const router = useRouter()
  const [form, setForm] = useState({})
  const [alertInput, setAlertInput] = useState({
    name: {
      message: 'El nombre es requerido',
      status: false,
    },
    email: {
      message: 'El email es requerido',
      status: false,
    },
    reason: {
      message: 'El motivo de consulta es requerido',
      status: false,
    },
    dni: {
      message: 'La cédula de ciudadanía es requerida',
      status: false,
    },
    gender: {
      message: 'El género es requerido',
      status: false,
    },
    age: {
      message: 'La edad es requerida',
      status: false,
    },
    career: {
      message: 'La ocupación es requerida',
      status: false,
    },
    address: {
      message: 'La dirección es requerida',
      status: false,
    },
    country: {
      message: 'El país es requerido',
      status: false,
    },
    business: {
      message: 'La empresa es requerida',
      status: false,
    },
    sector: {
      message: 'El sector económico es requerido',
      status: false,
    },
    position: {
      message: 'El cargo u oficio es requerido',
      status: false,
    },
  })
  const countries = contriesJson.countries

  const handleOnchangeInput = ({ target: { name, value } }) => {
    setForm({
      ...form,
      [name]: value,
    })
  }

  const formValidation = () => {
    let keys = []
    if (!form.name) keys.push('name')
    if (!form.email) keys.push('email')
    if (!form.reason) keys.push('reason')
    if (!form.dni) keys.push('dni')
    if (!form.gender) keys.push('gender')
    if (!form.age) keys.push('age')
    if (!form.career) keys.push('career')
    if (!form.address) keys.push('address')
    if (!form.country) keys.push('country')
    if (!form.business) keys.push('business')
    if (!form.sector) keys.push('sector')
    if (!form.position) keys.push('position')
    let alertAux = { ...alertInput }
    const alertKeys = Object.keys(alertAux)
    alertKeys.forEach((key) => {
      alertAux[key].status = false
    })
    keys.forEach((key) => {
      alertAux[key].status = true
    })
    setAlertInput(alertAux)
    if (keys.length == 0) {
      return true
    }
    return false
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validation = await formValidation()
    if (!validation) return

    localStorage.setItem('formTalentimetria', JSON.stringify(form))
    router.push('/principalTest')
  }

  return (
    <div className={s.container}>
      <div className={s.desktopView}>
        <Image src='/ob-1.png' width={400} height={400} alt='Imagen de talentimetria' />
        <p>Ingresa los datos a continuación</p>
      </div>

      <div className={s.formSection}>
        <div className={s.logo}>
          <Image src='/logo.png' width={250} height={50} alt='Logo de talentimetria' />
        </div>
        <h2>Ingresa los datos a continuación</h2>
        <form>
          <div className={s.textInput}>
            <label>
              Nombre completo <span>*</span>
            </label>
            <input type='text' name='name' onChange={handleOnchangeInput} placeholder='Ingresa tu nombre completo' />
            <p className={s.alert}>{alertInput['name'].status && alertInput['name'].message}</p>
          </div>
          <div className={s.textInput}>
            <label>
              Email <span>*</span>
            </label>
            <input type='text' name='email' onChange={handleOnchangeInput} placeholder='Ingresa tu email' />
            <p className={s.alert}>{alertInput['email'].status && alertInput['email'].message}</p>
          </div>
          <div className={s.textInput}>
            <label>
              Motivo de valoración <span>*</span>
            </label>
            <select
              name='reason'
              defaultValue=''
              placeholder='Selecciona el motivo de consulta'
              onChange={handleOnchangeInput}>
              <option value='' disabled hidden>
                Selecciona el motivo de consulta
              </option>
              <option value='Proceso de selección'>Proceso de selección</option>
              <option value='Valoración de personal o potencial'>Valoración de personal o potencial</option>
              <option value='Interés Personal o profesional'>Interés Personal o profesional</option>
              <option value='Otro'>Otro</option>
            </select>
            <p className={s.alert}>{alertInput['reason'].status && alertInput['reason'].message}</p>
          </div>
          <div className={s.textInput}>
            <label>
              Cédula de ciudadanía (DNI) <span>*</span>
            </label>
            <input
              type='text'
              name='dni'
              onChange={handleOnchangeInput}
              placeholder='Ingresa tu cédula de ciudadanía'
            />
            <p className={s.alert}>{alertInput['dni'].status && alertInput['dni'].message}</p>
          </div>
          <div className={s.textInput}>
            <label>
              Sexo <span>*</span>
            </label>
            <select name='gender' defaultValue='' placeholder='Selecciona tu género' onChange={handleOnchangeInput}>
              <option value='' disabled hidden>
                Selecciona tu género
              </option>
              <option value='male'>Masculino</option>
              <option value='female'>Femenino</option>
              <option value='nogender'>Prefiero no decir</option>
            </select>
            <p className={s.alert}>{alertInput['gender'].status && alertInput['gender'].message}</p>
          </div>
          <div className={s.textInput}>
            <label>
              Edad <span>*</span>
            </label>
            <input type='number' name='age' onChange={handleOnchangeInput} placeholder='Ingresa tu edad' />
            <p className={s.alert}>{alertInput['age'].status && alertInput['age'].message}</p>
          </div>
          <div className={s.textInput}>
            <label>
              Ocupación <span>*</span>
            </label>
            <select
              name='career'
              defaultValue=''
              placeholder='Selecciona tu ocupación actual'
              onChange={handleOnchangeInput}>
              <option value='' disabled hidden>
                Selecciona tu ocupación
              </option>
              <option value='Empleado'>Empleado</option>
              <option value='Estudiante'>Estudiante</option>
              <option value='BuscandoEmpleo'>En busca de empleo</option>
              <option value='Independiente'>Independiente</option>
              <option value='Otro'>Otra. Ninguna de las anteriores</option>
            </select>

            <p className={s.alert}>{alertInput['career'].status && alertInput['career'].message}</p>
          </div>
          <div className={s.textInput}>
            <label>
              Dirección de residencia <span>*</span>
            </label>
            <input
              type='text'
              name='address'
              onChange={handleOnchangeInput}
              placeholder='Ingresa tu dirección de residencia'
            />
            <p className={s.alert}>{alertInput['address'].status && alertInput['address'].message}</p>
          </div>
          <div className={s.textInput}>
            <label>
              País <span>*</span>
            </label>
            <select name='country' defaultValue='' placeholder='Selecciona tu país' onChange={handleOnchangeInput}>
              <option value='' disabled hidden>
                Selecciona tu país
              </option>
              {countries.map((country, index) => (
                <option key={index} value={country.name}>
                  {country.es_name}
                </option>
              ))}
            </select>
            <p className={s.alert}>{alertInput['country'].status && alertInput['country'].message}</p>
          </div>
          <div className={s.textInput}>
            <label>
              Empresa <span>*</span>
            </label>
            <input
              type='text'
              name='business'
              onChange={handleOnchangeInput}
              placeholder='Ingresa la empresa donde trabajas'
            />
            <p className={s.alert}>{alertInput['business'].status && alertInput['business'].message}</p>
          </div>
          <div className={s.textInput}>
            <label>
              Sector económico <span>*</span>
            </label>
            <select
              name='sector'
              defaultValue=''
              placeholder='Selecciona el sector económico'
              onChange={handleOnchangeInput}>
              <option value='' disabled hidden>
                Selecciona el sector económico
              </option>
              <option value='Comercio'>Comercio</option>
              <option value='Industria'>Industria</option>
              <option value='Servicios'>Servicios</option>
              <option value='Construcción'>Construcción</option>
              <option value='Transporte'>Transporte</option>
              <option value='Otro'>Otro</option>
            </select>
            <p className={s.alert}>{alertInput['sector'].status && alertInput['sector'].message}</p>
          </div>
          <div className={s.textInput}>
            <label>
              Cargo u oficio <span>*</span>
            </label>
            <select
              name='position'
              defaultValue=''
              placeholder='Selecciona el cargo u oficio'
              onChange={handleOnchangeInput}>
              <option value='' disabled hidden>
                Selecciona el cargo u oficio
              </option>
              <option value='Administrador'>Administrador</option>
              <option value='Auxiliar de oficina'>Auxiliar de oficina</option>
              <option value='Bachiller'>Bachiller</option>
              <option value='Contador público'>Contador público</option>
              <option value='Economista'>Economista</option>
              <option value='Estudiante'>Estudiante</option>
              <option value='Gerente'>Gerente</option>
              <option value='Ingeniero'>Ingeniero</option>
              <option value='Médico u odontólogo'>Médico u odontólogo</option>
              <option value='Enfermera'>Enfermera</option>
              <option value='Técnico medio'>Técnico medio</option>
              <option value='Psicólogo'>Psicólogo</option>
              <option value='Financiero'>Financiero</option>
              <option value='Otro'>Otro</option>
            </select>
            <p className={s.alert}>{alertInput['position'].status && alertInput['position'].message}</p>
          </div>
          <button onClick={handleSubmit}>Siguiente</button>
        </form>
      </div>
    </div>
  )
}

export default UserForm
