import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from './firebase'
import { sanitizeAttachmentFileName } from './attachmentFileName'

function decodeBase64ToBytes(base64) {
  const clean = String(base64 || '').trim()
  if (!clean) return new Uint8Array()
  const binary = atob(clean)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function detectMimeTypeFromFileName(fileName) {
  const lower = String(fileName || '').toLowerCase()
  if (lower.endsWith('.pdf')) return 'application/pdf'
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  if (lower.endsWith('.gif')) return 'image/gif'
  if (lower.endsWith('.webp')) return 'image/webp'
  return 'application/octet-stream'
}

export async function uploadAttachmentBase64({ base64, fileName, collectionName, docId }) {
  const safeName = sanitizeAttachmentFileName(fileName || 'attachment')
  const bytes = decodeBase64ToBytes(base64)
  const timestamp = Date.now()
  const path = `attachments/${collectionName || 'general'}/${docId || 'new'}/${timestamp}-${safeName}`
  const objectRef = ref(storage, path)
  const contentType = detectMimeTypeFromFileName(safeName)

  await uploadBytes(objectRef, bytes, {
    contentType,
    customMetadata: {
      originalName: safeName,
      source: 'regulatory-division-system',
    },
  })

  const url = await getDownloadURL(objectRef)
  return { url, path, size: bytes.byteLength, fileName: safeName }
}
