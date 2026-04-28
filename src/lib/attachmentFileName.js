const MAX_ATTACHMENT_FILE_NAME_LENGTH = 180

export function sanitizeAttachmentFileName(fileName, maxLen = MAX_ATTACHMENT_FILE_NAME_LENGTH) {
  const raw = String(fileName || '')
  const cleaned = raw
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!cleaned) return 'attachment'
  if (cleaned.length <= maxLen) return cleaned

  const dotIndex = cleaned.lastIndexOf('.')
  const hasUsableExt = dotIndex > 0 && dotIndex < cleaned.length - 1
  if (!hasUsableExt) return `${cleaned.slice(0, Math.max(1, maxLen - 3))}...`

  const ext = cleaned.slice(dotIndex)
  const base = cleaned.slice(0, dotIndex)
  const reserve = ext.length + 3
  const allowedBaseLen = Math.max(1, maxLen - reserve)
  return `${base.slice(0, allowedBaseLen)}...${ext}`
}

export { MAX_ATTACHMENT_FILE_NAME_LENGTH }
