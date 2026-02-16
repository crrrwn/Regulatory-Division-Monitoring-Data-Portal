import { useState } from 'react'
import FormLayout from '../../components/FormLayout'
import CustomerRatingsTable from '../../components/CustomerRatingsTable'
import { useFormSubmit } from '../../hooks/useFormSubmit'
import { REGIONS, PROVINCES } from '../../lib/regions'

const ORG_OPTIONS = ['Single Prop', 'Corporation', 'Cooperative', 'Association', 'Club', "Gov't"]
const APPLICANT_OPTIONS = ['Owner', 'Company Rep', 'Driver', 'Others']
const SERVICE_OPTIONS = ['Private Owned', 'Hauling Services', 'Company/Coop Owned', 'Others']
const SPECIES_BIRDS = ['Broiler', 'Ducks', 'Pigeons', 'Gamefowl', 'Others']
const VEHICLE_OPTIONS = ['Truck', 'PUJ', 'Multi-Cab', 'Rebuilt/AUV', 'Pick-Up', 'Fiera/XLT', 'Others']
const BODY_OPTIONS = ['Wire mesh/crates', 'Build-in cages', 'Non-permanent/movable', 'Others']

export default function TransportCarrierForm() {
  const [ownerName, setOwnerName] = useState({ last: '', first: '', mi: '' })
  const [businessAddress, setBusinessAddress] = useState({ barangay: '', cityMuni: '', province: '', region: '' })
  const [businessOrg, setBusinessOrg] = useState([])
  const [typeOfApplicant, setTypeOfApplicant] = useState([])
  const [contactNo, setContactNo] = useState('')
  const [email, setEmail] = useState('')
  const [applicantTin, setApplicantTin] = useState('')
  const [companyTin, setCompanyTin] = useState('')
  const [typeOfServices, setTypeOfServices] = useState([])
  const [applicationType, setApplicationType] = useState('')
  const [speciesCargoBirds, setSpeciesCargoBirds] = useState([])
  const [speciesAnimals, setSpeciesAnimals] = useState('')
  const [byProducts, setByProducts] = useState('')
  const [typeOfVehicle, setTypeOfVehicle] = useState([])
  const [bodyType, setBodyType] = useState([])
  const [fleet, setFleet] = useState([{ accreditationNo: '', makeSeries: '', plateNo: '', bodyType: '', noOfWheels: '' }])
  const [ratings, setRatings] = useState({ ratingQuantity: '', ratingServicesPersonnel: '', ratingTraining: '', ratingAttitude: '', ratingPromptness: '' })
  const [recommendation, setRecommendation] = useState('')
  const { submit, loading, message } = useFormSubmit('transportCarrier')

  const toggleCheckbox = (setter, value) => setter((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]))

  const addFleetRow = () => setFleet((f) => [...f, { accreditationNo: '', makeSeries: '', plateNo: '', bodyType: '', noOfWheels: '' }])
  const updateFleet = (idx, key, val) => setFleet((f) => f.map((row, i) => (i === idx ? { ...row, [key]: val } : row)))

  const handleSubmit = async (e) => {
    e.preventDefault()
    await submit({
      ownerName,
      businessAddress,
      businessOrg,
      typeOfApplicant,
      contactNo,
      email,
      applicantTin,
      companyTin,
      typeOfServices,
      applicationType,
      speciesCargoBirds,
      speciesAnimals,
      byProducts,
      typeOfVehicle,
      bodyType,
      fleet,
      ...ratings,
      recommendation,
    })
    setOwnerName({ last: '', first: '', mi: '' })
    setBusinessAddress({ barangay: '', cityMuni: '', province: '', region: '' })
    setBusinessOrg([])
    setTypeOfApplicant([])
    setContactNo('')
    setEmail('')
    setApplicantTin('')
    setCompanyTin('')
    setTypeOfServices([])
    setApplicationType('')
    setSpeciesCargoBirds([])
    setSpeciesAnimals('')
    setByProducts('')
    setTypeOfVehicle([])
    setBodyType([])
    setFleet([{ accreditationNo: '', makeSeries: '', plateNo: '', bodyType: '', noOfWheels: '' }])
    setRatings({ ratingQuantity: '', ratingServicesPersonnel: '', ratingTraining: '', ratingAttitude: '', ratingPromptness: '' })
    setRecommendation('')
  }

  return (
    <FormLayout title="Land Transport Carrier Accreditation">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="border-b border-border pb-4">
          <h3 className="font-semibold text-primary mb-3">General Information</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-primary mb-1">Owner Last Name</label><input type="text" value={ownerName.last} onChange={(e) => setOwnerName((o) => ({ ...o, last: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-primary mb-1">First Name</label><input type="text" value={ownerName.first} onChange={(e) => setOwnerName((o) => ({ ...o, first: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-primary mb-1">MI</label><input type="text" value={ownerName.mi} onChange={(e) => setOwnerName((o) => ({ ...o, mi: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg" maxLength={2} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div><label className="block text-sm font-medium text-primary mb-1">Barangay</label><input type="text" value={businessAddress.barangay} onChange={(e) => setBusinessAddress((a) => ({ ...a, barangay: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-primary mb-1">City/Municipality</label><input type="text" value={businessAddress.cityMuni} onChange={(e) => setBusinessAddress((a) => ({ ...a, cityMuni: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-primary mb-1">Province</label><select value={businessAddress.province} onChange={(e) => setBusinessAddress((a) => ({ ...a, province: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option>{PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-primary mb-1">Region</label><select value={businessAddress.region} onChange={(e) => setBusinessAddress((a) => ({ ...a, region: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg"><option value="">Select</option>{REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}</select></div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-primary mb-2">Business Organization</label>
            <div className="flex flex-wrap gap-3">{ORG_OPTIONS.map((o) => <label key={o} className="flex items-center gap-1"><input type="checkbox" checked={businessOrg.includes(o)} onChange={() => toggleCheckbox(setBusinessOrg, o)} />{o}</label>)}</div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-primary mb-2">Type of Applicant</label>
            <div className="flex flex-wrap gap-3">{APPLICANT_OPTIONS.map((o) => <label key={o} className="flex items-center gap-1"><input type="checkbox" checked={typeOfApplicant.includes(o)} onChange={() => toggleCheckbox(setTypeOfApplicant, o)} />{o}</label>)}</div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div><label className="block text-sm font-medium text-primary mb-1">Contact No.</label><input type="text" value={contactNo} onChange={(e) => setContactNo(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-primary mb-1">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-primary mb-1">Applicant TIN</label><input type="text" value={applicantTin} onChange={(e) => setApplicantTin(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-primary mb-1">Company TIN</label><input type="text" value={companyTin} onChange={(e) => setCompanyTin(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-primary mb-2">Type of Services</label>
            <div className="flex flex-wrap gap-3">{SERVICE_OPTIONS.map((o) => <label key={o} className="flex items-center gap-1"><input type="checkbox" checked={typeOfServices.includes(o)} onChange={() => toggleCheckbox(setTypeOfServices, o)} />{o}</label>)}</div>
          </div>
        </div>

        <div className="border-b border-border pb-4">
          <h3 className="font-semibold text-primary mb-3">Land Carrier Information</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-primary mb-2">Type of Application</label>
            <label className="mr-4"><input type="radio" name="appType" value="Renewal" checked={applicationType === 'Renewal'} onChange={() => setApplicationType('Renewal')} /> Renewal</label>
            <label><input type="radio" name="appType" value="New Applicant" checked={applicationType === 'New Applicant'} onChange={() => setApplicationType('New Applicant')} /> New Applicant</label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-primary mb-2">Species/Cargo (Birds)</label>
            <div className="flex flex-wrap gap-3">{SPECIES_BIRDS.map((o) => <label key={o} className="flex items-center gap-1"><input type="checkbox" checked={speciesCargoBirds.includes(o)} onChange={() => toggleCheckbox(setSpeciesCargoBirds, o)} />{o}</label>)}</div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm font-medium text-primary mb-1">Species (Animals)</label><input type="text" value={speciesAnimals} onChange={(e) => setSpeciesAnimals(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-primary mb-1">By-Products</label><input type="text" value={byProducts} onChange={(e) => setByProducts(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg" /></div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-primary mb-2">Type of Vehicle</label>
            <div className="flex flex-wrap gap-3">{VEHICLE_OPTIONS.map((o) => <label key={o} className="flex items-center gap-1"><input type="checkbox" checked={typeOfVehicle.includes(o)} onChange={() => toggleCheckbox(setTypeOfVehicle, o)} />{o}</label>)}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Body Type</label>
            <div className="flex flex-wrap gap-3">{BODY_OPTIONS.map((o) => <label key={o} className="flex items-center gap-1"><input type="checkbox" checked={bodyType.includes(o)} onChange={() => toggleCheckbox(setBodyType, o)} />{o}</label>)}</div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-primary">Vehicle Fleet</h3>
            <button type="button" onClick={addFleetRow} className="text-sm px-3 py-1 bg-primary text-white rounded">Add Row</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border border-border text-sm">
              <thead><tr className="bg-surface"><th className="border border-border p-2">Accreditation No.</th><th className="border border-border p-2">Make/Series</th><th className="border border-border p-2">Plate No. / Conduction</th><th className="border border-border p-2">Body Type</th><th className="border border-border p-2">No. of Wheels</th></tr></thead>
              <tbody>
                {fleet.map((row, idx) => (
                  <tr key={idx}>
                    <td className="border border-border p-1"><input type="text" value={row.accreditationNo} onChange={(e) => updateFleet(idx, 'accreditationNo', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                    <td className="border border-border p-1"><input type="text" value={row.makeSeries} onChange={(e) => updateFleet(idx, 'makeSeries', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                    <td className="border border-border p-1"><input type="text" value={row.plateNo} onChange={(e) => updateFleet(idx, 'plateNo', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                    <td className="border border-border p-1"><input type="text" value={row.bodyType} onChange={(e) => updateFleet(idx, 'bodyType', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                    <td className="border border-border p-1"><input type="text" value={row.noOfWheels} onChange={(e) => updateFleet(idx, 'noOfWheels', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <CustomerRatingsTable ratings={ratings} onChange={(k, v) => setRatings((r) => ({ ...r, [k]: v }))} />

        <div>
          <label className="block text-sm font-medium text-primary mb-1">Recommendation</label>
          <textarea value={recommendation} onChange={(e) => setRecommendation((e.target.value || '').toUpperCase())} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-content text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[80px]" rows="3" placeholder="Recommendations..." />
        </div>

        {message && <p className={`p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>{message.text}</p>}
        <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">{loading ? 'Saving...' : 'Submit'}</button>
      </form>
    </FormLayout>
  )
}
