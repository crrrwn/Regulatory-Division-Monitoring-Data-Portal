import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { db } from './firebase'

// Each chunk stores up to 750KB of base64 characters, safely under Firestore's 1MB document limit.
const CHUNK_SIZE = 750 * 1024
const CHUNKS_COLLECTION = '_fileChunks'

function generateFileId(collectionName) {
  return `${collectionName || 'file'}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

/**
 * Split base64 string into chunks and store each as a Firestore document.
 * Parallel writes so even large files finish quickly.
 * Returns a fileId string used to retrieve the file later.
 */
export async function storeFileAsChunks({ base64, fileName, collectionName }) {
  const fileId = generateFileId(collectionName)
  const chunks = []
  for (let i = 0; i < base64.length; i += CHUNK_SIZE) {
    chunks.push(base64.slice(i, i + CHUNK_SIZE))
  }
  const totalChunks = chunks.length
  await Promise.all(
    chunks.map((chunkData, i) =>
      addDoc(collection(db, CHUNKS_COLLECTION), {
        fileId,
        chunkIndex: i,
        totalChunks,
        chunkData,
        fileName,
        collectionName: collectionName || '',
        createdAt: new Date().toISOString(),
      })
    )
  )
  return { fileId, fileName, totalChunks, sizeBase64: base64.length }
}

/**
 * Fetch all chunks for a given fileId, reassemble, and return { base64, fileName }.
 */
export async function loadFileFromChunks(fileId) {
  const q = query(
    collection(db, CHUNKS_COLLECTION),
    where('fileId', '==', fileId)
  )
  const snapshot = await getDocs(q)
  if (snapshot.empty) throw new Error('File not found in database.')
  // Sort client-side — no composite index needed in Firestore
  const docs = snapshot.docs.map((d) => d.data()).sort((a, b) => a.chunkIndex - b.chunkIndex)
  return {
    base64: docs.map((d) => d.chunkData).join(''),
    fileName: docs[0]?.fileName || 'attachment',
  }
}

export const FIRESTORE_FILE_PREFIX = 'firestore:'

export function isFirestoreFileRef(value) {
  return typeof value === 'string' && value.startsWith(FIRESTORE_FILE_PREFIX)
}

export function getFileIdFromRef(value) {
  return String(value || '').replace(new RegExp(`^${FIRESTORE_FILE_PREFIX}`), '')
}
