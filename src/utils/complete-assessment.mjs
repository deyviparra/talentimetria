async function withinDeadline(milliseconds, message, task) {
  const controller = new AbortController()
  let timer
  try {
    return await Promise.race([
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error(message))
          controller.abort()
        }, milliseconds)
      }),
      task(controller.signal),
    ])
  } finally {
    clearTimeout(timer)
  }
}

export async function completeAssessment({
  endpoint,
  body,
  user,
  attempt,
  saveUser,
  fetchScore = fetch,
  scoreTimeout = 35_000,
  saveTimeout = 15_000,
}) {
  if (!attempt.record) {
    const scoreFailure = 'No pudimos calcular el resultado. Tus respuestas siguen aquí. Intenta de nuevo.'
    let result
    try {
      if (!endpoint || !user) throw new Error(scoreFailure)
      result = await withinDeadline(scoreTimeout, scoreFailure, async (signal) => {
        const response = await fetchScore(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal,
        })
        if (!response.ok) throw new Error(scoreFailure)
        return response.json()
      })
      if (!['trabajo', 'personal', 'clasico'].every((key) => Array.isArray(result?.chart?.[key]))) {
        throw new Error(scoreFailure)
      }
    } catch {
      throw new Error(scoreFailure)
    }
    // A retry uses exactly the same scored record and document ID, even after a lost save response.
    attempt.record = { ...user, date: new Date(), result }
  }

  const saveFailure = 'No pudimos confirmar que el resultado se guardó. Intenta guardarlo de nuevo sin reiniciar la prueba.'
  try {
    const docId = await withinDeadline(saveTimeout, saveFailure, () =>
      saveUser({ user: attempt.record, attemptId: attempt.id }),
    )
    if (docId !== attempt.id) throw new Error(saveFailure)
    return docId
  } catch {
    throw new Error(saveFailure)
  }
}
