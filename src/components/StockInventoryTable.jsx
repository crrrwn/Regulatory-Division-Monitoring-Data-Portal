import React, { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { Plus, Trash2, Save, Printer } from 'lucide-react'
import 'iconify-icon'

const BLANK_ITEM = { crops: '', variety: '', noOfCertified: '', noOfNonCertifiedSexual: '', noOfNonCertifiedAsexual: '' }

export default function StockInventoryTable() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [pendingEdits, setPendingEdits] = useState({})
  const { user } = useAuth()
  const { showNotification } = useNotification()

  const getDisplayRecord = (record) => ({ ...record, ...pendingEdits[record.id] })

  useEffect(() => {
    const q = query(
      collection(db, 'plantMaterial'),
      where('formType', '==', 'stockInventory')
    )
    const unsub = onSnapshot(q, (snap) => {
      setRecords(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const addNewNursery = async () => {
    try {
      await addDoc(collection(db, 'plantMaterial'), {
        formType: 'stockInventory',
        nameOfPlantNursery: '',
        operator: '',
        location: '',
        province: '',
        asOfMonthYear: '',
        items: [{ ...BLANK_ITEM }],
        createdBy: user?.uid || null,
        createdAt: serverTimestamp(),
      })
    } catch (err) {
      showNotification({ type: 'error', title: 'Error', message: err.message || 'Failed to add.' })
    }
  }

  const deleteNursery = async (record) => {
    try {
      await deleteDoc(doc(db, 'plantMaterial', record.id))
      setPendingEdits((prev) => {
        const next = { ...prev }
        delete next[record.id]
        return next
      })
    } catch (err) {
      showNotification({ type: 'error', title: 'Error', message: err.message || 'Failed to delete.' })
    }
  }

  const updateNurseryField = (record, key, value) => {
    setPendingEdits((prev) => ({ ...prev, [record.id]: { ...prev[record.id], [key]: value } }))
  }

  const updateItem = (record, itemIdx, key, value) => {
    const disp = getDisplayRecord(record)
    const items = [...(disp.items || [])]
    items[itemIdx] = { ...items[itemIdx], [key]: value }
    const cert = parseInt(items[itemIdx].noOfCertified, 10) || 0
    const sexual = parseInt(items[itemIdx].noOfNonCertifiedSexual, 10) || 0
    const asexual = parseInt(items[itemIdx].noOfNonCertifiedAsexual, 10) || 0
    items[itemIdx].total = cert + sexual + asexual
    setPendingEdits((prev) => ({ ...prev, [record.id]: { ...prev[record.id], items } }))
  }

  const addItem = (record) => {
    const disp = getDisplayRecord(record)
    const items = [...(disp.items || []), { ...BLANK_ITEM }]
    setPendingEdits((prev) => ({ ...prev, [record.id]: { ...prev[record.id], items } }))
  }

  const removeItem = (record, itemIdx) => {
    const disp = getDisplayRecord(record)
    let items = (disp.items || []).filter((_, i) => i !== itemIdx)
    if (items.length === 0) items = [{ ...BLANK_ITEM }]
    setPendingEdits((prev) => ({ ...prev, [record.id]: { ...prev[record.id], items } }))
  }

  const [saveModal, setSaveModal] = useState(null) // null | 'saving' | 'success' | 'error'
  const [saveError, setSaveError] = useState('')

  const handlePrint = () => {
    const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    const totalAllByRec = records.map((rec) => {
      const disp = getDisplayRecord(rec)
      return (disp.items || []).reduce((sum, it) => sum + (it.total ?? 0), 0)
    })

    let bodyRows = ''
    let recIdx = 0
    for (const rec of records) {
      const disp = getDisplayRecord(rec)
      const items = disp.items || []
      const totalAll = totalAllByRec[recIdx] || 0
      recIdx++
      items.forEach((item, idx) => {
        const cert = parseInt(item.noOfCertified, 10) || 0
        const sexual = parseInt(item.noOfNonCertifiedSexual, 10) || 0
        const asexual = parseInt(item.noOfNonCertifiedAsexual, 10) || 0
        const total = cert + sexual + asexual
        const isFirst = idx === 0
        const rowCount = items.length
        bodyRows += '<tr>'
        if (isFirst) {
          bodyRows += `<td rowspan="${rowCount}" style="border:1px solid #1e4d2b;padding:8px;background:#f9faf5;font-weight:600;">${esc(disp.nameOfPlantNursery)}</td>`
          bodyRows += `<td rowspan="${rowCount}" style="border:1px solid #1e4d2b;padding:8px;background:#f9faf5;">${esc(disp.operator)}</td>`
          bodyRows += `<td rowspan="${rowCount}" style="border:1px solid #1e4d2b;padding:8px;background:#f9faf5;">${esc(disp.location)}</td>`
        }
        bodyRows += `<td style="border:1px solid #1e4d2b;padding:8px;">${esc(item.crops)}</td>`
        bodyRows += `<td style="border:1px solid #1e4d2b;padding:8px;">${esc(item.variety)}</td>`
        bodyRows += `<td style="border:1px solid #1e4d2b;padding:8px;text-align:center;">${esc(item.noOfCertified)}</td>`
        bodyRows += `<td style="border:1px solid #1e4d2b;padding:8px;text-align:center;">${esc(item.noOfNonCertifiedSexual)}</td>`
        bodyRows += `<td style="border:1px solid #1e4d2b;padding:8px;text-align:center;">${esc(item.noOfNonCertifiedAsexual)}</td>`
        bodyRows += `<td style="border:1px solid #1e4d2b;padding:8px;text-align:center;font-weight:700;">${total > 0 ? total.toLocaleString() : '—'}</td>`
        if (isFirst) {
          bodyRows += `<td rowspan="${rowCount}" style="border:1px solid #1e4d2b;padding:8px;background:#f9faf5;">${esc(disp.asOfMonthYear)}</td>`
        }
        bodyRows += '</tr>'
      })
      if (items.length > 0) {
        bodyRows += `<tr style="background:rgba(6,95,70,0.15);"><td colspan="5" style="border:1px solid #1e4d2b;padding:8px;font-weight:700;text-align:right;color:#1e4d2b;">Nursery Total</td><td colspan="3" style="border:1px solid #1e4d2b;"></td><td style="border:1px solid #1e4d2b;padding:8px;font-weight:700;text-align:center;color:#1e4d2b;">Total: ${totalAll > 0 ? totalAll.toLocaleString() : '—'}</td><td style="border:1px solid #1e4d2b;"></td></tr>`
      }
    }

    const win = window.open('', '_blank')
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Plant Nursery Stock Inventory</title>
          <style>
            @page { size: A4 landscape; margin: 8mm; }
            @media print {
              html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; overflow: visible !important; }
              thead { display: table-header-group; }
              tr { page-break-inside: avoid; }
            }
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; margin: 0; padding: 16px; }
            .print-header { margin-bottom: 12px; border-bottom: 2px solid #1e4d2b; padding-bottom: 8px; }
            .print-title { color: #1e4d2b; font-size: 20px; font-weight: 800; margin: 0; text-transform: uppercase; }
            .print-meta { color: #64748b; font-size: 12px; margin: 4px 0 0 0; }
            table { border-collapse: collapse; font-size: 12px; width: 100%; }
            th, td { border: 1px solid #1e4d2b; padding: 8px 10px; }
            th { background: #065f46; color: #fff; font-weight: 700; text-align: center; }
            td { vertical-align: top; }
          </style>
        </head>
        <body>
          <div class="print-header">
            <p class="print-title">Plant Nursery Stock Inventory</p>
            <p class="print-meta">Regulatory Division Portal • Printed ${new Date().toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name of Plant Nursery</th>
                <th>Operator</th>
                <th>Location</th>
                <th>Crops</th>
                <th>Variety</th>
                <th>No. of Certified</th>
                <th>No. of Non Certified (Sexual)</th>
                <th>No. of Non Certified (Asexual)</th>
                <th>Total</th>
                <th>As of Month/Year</th>
              </tr>
            </thead>
            <tbody>${bodyRows}</tbody>
          </table>
        </body>
      </html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close(); }, 500)
  }

  const handleSaveAll = async () => {
    const idsToSave = Object.keys(pendingEdits)
    if (idsToSave.length === 0) {
      setSaveModal('error')
      setSaveError('No changes to save.')
      return
    }
    setSaveModal('saving')
    setSaveError('')
    try {
      for (const id of idsToSave) {
        const rec = records.find((r) => r.id === id)
        if (rec) {
          const data = getDisplayRecord(rec)
          await updateDoc(doc(db, 'plantMaterial', id), {
            ...data,
            updatedAt: new Date().toISOString(),
          })
        }
      }
      setPendingEdits({})
      setSaveModal('success')
    } catch (err) {
      setSaveError(err.message || 'Failed to save.')
      setSaveModal('error')
    }
  }

  const inputClass = "w-full min-h-[52px] px-4 py-3.5 bg-white border-2 border-[#1e4d2b]/30 rounded-lg text-sm text-[#1e4d2b] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/40 focus:border-[#1e4d2b] placeholder:text-[#8a857c] text-center"
  const thClass = "py-2.5 px-3 font-semibold text-[#1e4d2b] uppercase text-[9px] text-center bg-[#065f46] text-white border-2 border-[#1e4d2b]"
  const tdBorderClass = "border-2 border-[#1e4d2b]/35"

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin w-10 h-10 border-2 border-[#1e4d2b] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="plant-material-section bg-white rounded-2xl border-2 border-[#1e4d2b]/40 shadow-xl shadow-[#1e4d2b]/10 overflow-hidden">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 px-3 xs:px-6 py-4 xs:py-5 border-b-2 border-[#1e4d2b]/30 bg-gradient-to-r from-[#f0f5ee] to-[#e8f0e5]">
        <h3 className="text-xs xs:text-sm font-bold text-[#1e4d2b] flex items-center gap-2 min-w-0">
          <span className="p-1.5 xs:p-2 rounded-lg bg-[#1e4d2b]/15 shrink-0">
            <iconify-icon icon="mdi:package-variant-closed" width="22"></iconify-icon>
          </span>
          <span className="truncate">Plant Nursery Stock Inventory</span>
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          {records.length > 0 && (
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-white border-2 border-[#1e4d2b] text-[#1e4d2b] hover:bg-[#f0f5ee] shadow-md transition-all duration-200"
            >
              <Printer size={18} /> Print
            </button>
          )}
          <button
            type="button"
            onClick={addNewNursery}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-[#1e4d2b] text-white hover:bg-[#153019] shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus size={18} /> Add Nursery
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-[#fafaf8]">
        <table className="w-full text-sm border-collapse" style={{ border: '2px solid rgba(30,77,43,0.4)' }}>
          <thead>
            <tr>
              <th className={`${thClass} min-w-[260px]`}>Name of Plant Nursery</th>
              <th className={`${thClass} min-w-[220px]`}>Operator</th>
              <th className={`${thClass} min-w-[300px]`}>Location</th>
              <th className={`${thClass} min-w-[180px]`}>Crops</th>
              <th className={`${thClass} min-w-[170px]`}>Variety</th>
              <th className={`${thClass} min-w-[160px]`}>No. of Certified</th>
              <th className={`${thClass} min-w-[200px]`}>No. of Non Certified (Sexual)</th>
              <th className={`${thClass} min-w-[200px]`}>No. of Non Certified (Asexual)</th>
              <th className={thClass}>Total</th>
              <th className={`${thClass} w-16`}>As of Month/Year</th>
              <th className={`${thClass} w-28`}>Actions</th>
              <th className={`${thClass} w-20`}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => {
              const disp = getDisplayRecord(rec)
              const items = disp.items || []
              const totalAll = items.reduce((sum, it) => sum + (it.total ?? 0), 0)
              return (
                <React.Fragment key={rec.id}>
                  {items.map((item, idx) => {
                    const cert = parseInt(item.noOfCertified, 10) || 0
                    const sexual = parseInt(item.noOfNonCertifiedSexual, 10) || 0
                    const asexual = parseInt(item.noOfNonCertifiedAsexual, 10) || 0
                    const total = cert + sexual + asexual
                    const isFirst = idx === 0
                    const rowCount = items.length
                    return (
                      <tr key={`${rec.id}-${idx}`} className="hover:bg-[#f0f5ee]/60 transition-colors">
                        {isFirst && (
                          <td rowSpan={rowCount} className={`p-4 align-top ${tdBorderClass} bg-[#f9faf5] min-w-[260px]`}>
                            <input
                              type="text"
                              value={disp.nameOfPlantNursery || ''}
                              onChange={(e) => updateNurseryField(rec, 'nameOfPlantNursery', e.target.value)}
                              className={`${inputClass} font-semibold`}
                              placeholder="Nursery name"
                            />
                          </td>
                        )}
                        {isFirst && (
                          <td rowSpan={rowCount} className={`p-4 align-top ${tdBorderClass} bg-[#f9faf5] min-w-[220px]`}>
                            <input
                              type="text"
                              value={disp.operator || ''}
                              onChange={(e) => updateNurseryField(rec, 'operator', e.target.value)}
                              className={inputClass}
                              placeholder="Operator"
                            />
                          </td>
                        )}
                        {isFirst && (
                          <td rowSpan={rowCount} className={`p-4 align-top ${tdBorderClass} bg-[#f9faf5] min-w-[300px]`}>
                            <input
                              type="text"
                              value={disp.location || ''}
                              onChange={(e) => updateNurseryField(rec, 'location', e.target.value)}
                              className={inputClass}
                              placeholder="Location"
                            />
                          </td>
                        )}
                        <td className={`p-4 min-w-[180px] ${tdBorderClass}`}>
                          <input
                            type="text"
                            value={item.crops || ''}
                            onChange={(e) => updateItem(rec, idx, 'crops', e.target.value)}
                            className={inputClass}
                            placeholder="E.G. CACAO"
                          />
                        </td>
                        <td className={`p-4 min-w-[170px] ${tdBorderClass}`}>
                          <input
                            type="text"
                            value={item.variety || ''}
                            onChange={(e) => updateItem(rec, idx, 'variety', e.target.value)}
                            className={inputClass}
                            placeholder="E.G. BR25"
                          />
                        </td>
                        <td className={`p-4 min-w-[160px] ${tdBorderClass}`}>
                          <input
                            type="number"
                            min="0"
                            value={item.noOfCertified ?? ''}
                            onChange={(e) => updateItem(rec, idx, 'noOfCertified', e.target.value)}
                            className={`${inputClass} min-w-[90px]`}
                            placeholder="0"
                          />
                        </td>
                        <td className={`p-4 min-w-[200px] ${tdBorderClass}`}>
                          <input
                            type="number"
                            min="0"
                            value={item.noOfNonCertifiedSexual ?? ''}
                            onChange={(e) => updateItem(rec, idx, 'noOfNonCertifiedSexual', e.target.value)}
                            className={`${inputClass} min-w-[90px]`}
                            placeholder="0"
                          />
                        </td>
                        <td className={`p-4 min-w-[200px] ${tdBorderClass}`}>
                          <input
                            type="number"
                            min="0"
                            value={item.noOfNonCertifiedAsexual ?? ''}
                            onChange={(e) => updateItem(rec, idx, 'noOfNonCertifiedAsexual', e.target.value)}
                            className={`${inputClass} min-w-[90px]`}
                            placeholder="0"
                          />
                        </td>
                        <td className={`p-4 text-center font-bold text-[#1e4d2b] min-w-[90px] ${tdBorderClass}`}>
                          {total > 0 ? total.toLocaleString() : '—'}
                        </td>
                        {isFirst && (
                          <td rowSpan={rowCount} className={`p-4 align-middle ${tdBorderClass} bg-[#f9faf5]`}>
                            <div className="flex items-center justify-center">
                              <input
                                id={`month-${rec.id}`}
                                type="month"
                                value={disp.asOfMonthYear || ''}
                                onChange={(e) => updateNurseryField(rec, 'asOfMonthYear', e.target.value)}
                                className="w-36 min-h-[40px] px-3 py-1.5 bg-white border-2 border-[#1e4d2b]/30 rounded-lg text-xs text-[#1e4d2b] text-center focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/40 focus:border-[#1e4d2b]"
                              />
                            </div>
                          </td>
                        )}
                        <td className={`p-4 align-middle ${tdBorderClass}`}>
                          <div className="w-full flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => addItem(rec)}
                              className="p-2 rounded-lg hover:bg-[#f0f5ee] text-[#1e4d2b] transition-colors"
                              title="Add row"
                            >
                              <Plus size={18} />
                            </button>
                            {items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeItem(rec, idx)}
                                className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                                title="Remove row"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                        {isFirst && (
                          <td rowSpan={rowCount} className={`p-4 align-middle ${tdBorderClass} bg-[#fef2f2]/60`}>
                            <div className="w-full flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => deleteNursery(rec)}
                                className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                                title="Delete nursery"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    )
                  })}
                  {items.length > 0 && (
                    <tr className="bg-[#065f46]/15 border-t-2 border-[#1e4d2b]/40">
                      <td colSpan={5} className={`py-4 px-4 font-bold text-[#1e4d2b] text-right ${tdBorderClass}`}>Nursery Total</td>
                      <td colSpan={3} className={tdBorderClass} />
                      <td className={`py-4 px-4 text-center font-bold text-[#1e4d2b] ${tdBorderClass}`}>Total: {totalAll > 0 ? totalAll.toLocaleString() : '—'}</td>
                      <td colSpan={3} className={tdBorderClass} />
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {records.length === 0 && (
        <div className="py-20 text-center text-[#5c574f] bg-[#fafaf8]">
          <iconify-icon icon="mdi:package-variant" width="48" class="opacity-40 mb-3"></iconify-icon>
          <p className="font-semibold text-[#1e4d2b]">No stock inventory records yet.</p>
          <p className="text-sm mt-1">Click &quot;Add Nursery&quot; to create one.</p>
        </div>
      )}

      {records.length > 0 && (
        <div className="px-6 py-5 border-t-2 border-[#1e4d2b]/35 bg-gradient-to-r from-[#faf8f5] to-[#f0f5ee] flex justify-end">
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saveModal === 'saving'}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#1e4d2b] to-[#153019] text-white shadow-lg shadow-[#1e4d2b]/25 hover:shadow-xl hover:shadow-[#1e4d2b]/35 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
          >
            <Save size={20} />
            Save All
          </button>
        </div>
      )}

      {/* Save Modal */}
      {saveModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"
          onClick={(e) => e.target === e.currentTarget && saveModal !== 'saving' && setSaveModal(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-[280px] overflow-hidden shadow-lg border border-[#1e4d2b]/20 modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            {saveModal === 'saving' && (
              <div className="p-5 text-center">
                <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-[#1e4d2b]/10 text-[#1e4d2b]">
                  <div className="animate-spin w-6 h-6 border-2 border-[#1e4d2b] border-t-transparent rounded-full" />
                </div>
                <p className="text-sm font-bold text-[#1e4d2b]">Saving...</p>
              </div>
            )}
            {saveModal === 'success' && (
              <>
                <div className="p-5 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-[#1e4d2b]/20 text-[#1e4d2b]">
                    <iconify-icon icon="mdi:check-circle" width="28" />
                  </div>
                  <p className="text-sm font-bold text-[#1e4d2b]">Saved!</p>
                </div>
                <div className="px-5 pb-5">
                  <button
                    type="button"
                    onClick={() => setSaveModal(null)}
                    className="w-full py-2.5 rounded-lg font-bold text-white text-sm bg-[#1e4d2b] hover:bg-[#153019] transition-colors"
                  >
                    OK
                  </button>
                </div>
              </>
            )}
            {saveModal === 'error' && (
              <>
                <div className="p-5 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-red-100 text-red-600">
                    <iconify-icon icon="mdi:alert-circle" width="28" />
                  </div>
                  <p className="text-sm font-bold text-[#1e4d2b] mb-1">Save Failed</p>
                  <p className="text-xs text-[#5c574f] mb-3">{saveError}</p>
                </div>
                <div className="px-5 pb-5">
                  <button
                    type="button"
                    onClick={() => setSaveModal(null)}
                    className="w-full py-2.5 rounded-lg font-bold text-white text-sm bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    OK
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
