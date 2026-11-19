'use server'
import { db } from '../lib/firebase'
import { collection, getDocs,getDoc, addDoc, doc, runTransaction } from 'firebase/firestore'

const saveUser = async ({ user, attemptId }) => {
  if (typeof attemptId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(attemptId)) {
    throw new Error('Invalid assessment attempt')
  }
  const docRef = doc(db, 'users', attemptId)
  await runTransaction(db, async (transaction) => {
    const existing = await transaction.get(docRef)
    if (!existing.exists()) transaction.set(docRef, user)
  })
  return docRef.id
}
const saveLog = async ({ log }) => {
  try {
    const docRef = await addDoc(collection(db, 'logs'), log)
    return docRef.id
  } catch (error) {
    console.error('Error adding document: ', error)
  }
}

const updateUser = async ({docRefId, data, key}) => { 
  try {
    await updateDoc(doc(db, "users", docRefId), {
      [key]: data
    });
    console.log('User updated with ID: ', docRefId)
    return docRefId
  } catch (error) {
    console.error('Error updating document: ', error)
  }
 }

const getUsers = async () => {
  const users = []
  const querySnapshot = await getDocs(collection(db, 'users'))
  querySnapshot.forEach((doc) => {
    users.push(doc.data())
  })
  return users
}

const getUser = async ({ docRefId }) => { 
 try{
    const docRef = doc(db, "users", docRefId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return JSON.stringify(docSnap.data())
    } else {
      console.log("No such document!")
      return null
    }
 } catch (error) {
   console.error('Error getting document: ', error)
   return null
 }
 }

export { saveUser, getUsers, updateUser, getUser, saveLog }
