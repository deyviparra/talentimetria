'use server'
import { db } from '../lib/firebase'
import { collection, getDocs, addDoc } from 'firebase/firestore'

const saveUser = async ({ user }) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), user)
    console.log('User added with ID: ', docRef.id)
    return 'user added successfully'
  } catch (error) {
    console.error('Error adding document: ', error)
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

export { saveUser, getUsers }
