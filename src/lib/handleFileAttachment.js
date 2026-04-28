import { storeFileAsChunks, FIRESTORE_FILE_PREFIX } from './firestoreFileStorage'
import { sanitizeAttachmentFileName } from './attachmentFileName'

const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25 MB

// Files whose base64 fits under this threshold are stored directly in the Firestore record field.
// base64 of 512KB file ≈ 682KB — safely under Firestore's 1MB per-document limit alongside other fields.
const DIRECT_STORE_MAX = 512 * 1024 // original file bytes

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      resolve(typeof result === 'string' ? result.split(',')[1] || result : '')
    }
    reader.onerror = () => reject(new Error('Failed to read file.'))
    reader.readAsDataURL(file)
  })
}

/**
 * Call inside any form's file input onChange handler.
 *
 * - Small files (≤ 512 KB): read as base64, store directly in form state → saved inline in Firestore record.
 * - Large files (> 512 KB): read as base64, split into ~750 KB chunks stored in Firestore _fileChunks
 *   collection, then store a "firestore:<fileId>" reference in form state.
 *
 * Either way, by the time the user submits the form, attachmentData is ready and the submit is instant.
 */
export async function handleFileAttachment(file, { collectionName, setUploading, setMessage, onSuccess, onClear }) {
  if (!file) {
    onClear?.()
    return
  }

  if (file.size > MAX_FILE_SIZE) {
    setMessage?.({ type: 'error', text: 'File too large. Max 25 MB.' })
    return
  }

  const safeName = sanitizeAttachmentFileName(file.name)
  setUploading?.(true)

  try {
    const base64 = await readFileAsBase64(file)

    if (file.size <= DIRECT_STORE_MAX) {
      // Small file — store base64 directly in the record field
      onSuccess?.({ fileName: safeName, attachmentData: base64 })
      setMessage?.(null)
    } else {
      // Large file — chunk into Firestore
      setMessage?.({ type: 'info', text: `Saving "${safeName}" to database...` })
      const { fileId } = await storeFileAsChunks({
        base64,
        fileName: safeName,
        collectionName: collectionName || 'general',
      })
      onSuccess?.({ fileName: safeName, attachmentData: `${FIRESTORE_FILE_PREFIX}${fileId}` })
      setMessage?.(null)
    }
  } catch (err) {
    console.error('[handleFileAttachment] Failed:', err)
    setMessage?.({ type: 'error', text: `Failed to save file: ${err.message || 'Unknown error'}` })
    onClear?.()
  } finally {
    setUploading?.(false)
  }
}
