/**
 * Good Agri Practices master lists: GAP Certification and Monitoring of GAP Certified Farmer.
 * Used for Fill Semester in View Records. Match by date + name (normalized); fallback to date-derived semester.
 * dateOfRequest/dateOfMonitoring in YYYY-MM-DD; name as in master list (normalized on lookup).
 */

// GAP Certification: Date of Request, Name of Applicant, Semester (from your master list)
export const GAP_CERT_MASTER_LIST = [
  // CY 2024 - FIRST SEMESTER
  ...['Amor C. Sula', 'Generalito G. Flor', 'Rondio Montera, Jr.', 'Aldrin M. Nifas', 'Avegil B. Cuaresma', 'Elsa P. Reyes', 'Jan Antonie R. Cuevas', 'Jeraldine D. Magana', 'Rousel B. Orlina', 'Luz B. Bandales', 'Jelieziel U. Dimapalitan', 'Maristella Ruado', 'Rosalina A. Ilagan', 'Edgardo M. Deveas', 'Petronilo R. Villas', 'Jerson A. Viaña', 'Virgilio V. Tarcena', 'Lester G. Evangelio', 'Clifford T. Tepico', 'Ferdinand N. Fajardo', 'Joseph T. Telebrico', 'Joel S. Losito', 'Jane V. Capinpin', 'Jimmy T. Delara', 'Romeo P. Bucayu', 'Jose A. Gonzales', 'Nelson N. Opeña', 'Jocelyn F. Balderama', 'Shelly P. Dela Cruz', 'Raff Joseph R. Egos', 'Jonas F. Tinamisan', 'Roseller T. Paglicawan', 'Fernan G. Parisan', 'Francis Lou T. Pedraza', 'James Patrick T. Pedraza', 'Alvin P. Alfaro'].map((name) => ({ dateOfRequest: '2024-01-22', nameOfApplicant: name, semester: '1st Semester' })),
  ...['Melvin C. Capalad', 'Jezreel M. Camero', 'Kenneth N. Camero', 'Roberto F. Camero', 'Isabel Imana', 'Wilma P. Imana', 'Marlon C. Maycong', 'Reynaldo B. Maycong', 'Luren A. Maycong', 'Donato B. Maycong', 'Edwin S. Hernandez', 'Rolando S. Malabunga, Sr.', 'Jaypee C. Palma', 'Precy I. Estrada', 'Livelyn F. Castillo'].map((name) => ({ dateOfRequest: '2024-01-23', nameOfApplicant: name, semester: '1st Semester' })),
  ...['Reynaldo A. Quilit', 'Marvin M. Javier', 'Virginia G. Javier', 'Danny L. Sala', 'Nestor B. Bocala', 'Rowena P. Javillonar', 'Joseph B. Dagang', 'Christine D. Robles', 'Edgar A. Dela Rosa', 'Edgardo C. Tamboong, Jr.', 'Frederick F. Verzola', 'Jonard M. Broces'].map((name) => ({ dateOfRequest: '2024-01-24', nameOfApplicant: name, semester: '1st Semester' })),
  { dateOfRequest: '2024-02-01', nameOfApplicant: 'Ma. Eliza D. Paylago', semester: '1st Semester' },
  // CY 2024 - SECOND SEMESTER
  ...['Ramona M. Pastor', 'Evalyn T. Agbayani'].map((name) => ({ dateOfRequest: '2024-08-01', nameOfApplicant: name, semester: '2nd Semester' })),
  { dateOfRequest: '2024-10-07', nameOfApplicant: 'Christopher P. Agbayani', semester: '2nd Semester' },
  { dateOfRequest: '2024-10-15', nameOfApplicant: 'Frelyn Grace P. Agbayani', semester: '2nd Semester' },
  { dateOfRequest: '2024-10-09', nameOfApplicant: 'Danilo S. Jimenez', semester: '2nd Semester' },
  ...['Lea M. Castillo', 'Leonardo P. Gamino', 'Irish J. Ellamil', 'Remalyn C. Minorca', 'Ramilyn A. Maycong', 'Jerryco C. Mamaril'].map((name) => ({ dateOfRequest: '2024-11-19', nameOfApplicant: name, semester: '2nd Semester' })),
  // CY 2025 - FIRST SEMESTER
  ...['Joy L. Perlas', 'Judy T. Tria', 'Rodolfo G. Fernandez', 'Nilo G. Bayudan', 'Virgillo B. Pulido', 'Arnold P. Mitra'].map((name) => ({ dateOfRequest: '2025-01-06', nameOfApplicant: name, semester: '1st Semester' })),
  ...['Lea M. Castillo', 'Leonardo P. Gamino', 'Irish J. Ellamil', 'Remalyn C. Minorca', 'Kenneth N. Camero', 'Fernan G. Castillo', 'Eugine G. Gamino', 'Ramilyn A. Maycong', 'Julius C. Maycong', 'Ricky C. Estalante', 'Joselito C. Mandagan Jr.', 'Jessie Boy J. Gamino', 'Ermilita C. Palma', 'Florentino S. Jacinto', 'Jerryco C. Mamaril', 'Geronia G. Imana', 'Minerva D. Tadeo', 'Jonathan S. Pacupac', 'Jomel T. Acosta', 'Lerma P. Camero', 'Mark Christopher E. Tadeo'].map((name) => ({ dateOfRequest: '2025-01-08', nameOfApplicant: name, semester: '1st Semester' })),
  ...['Raff Joseph R. Egos', 'Michael A. Paglicawan', 'Ranzel C. Dueñas', 'Jongie T. Poblete', 'Clifford B. Ross', 'Nemuel M. Cajayon', 'Rommel C. Dueñas', 'Berwyn Francis C. Fajardo', 'Ryan M. Insigne', 'Arnold C. Dueñas', 'Jethro T. Masangkay', 'Jonathan F. Sanchez'].map((name) => ({ dateOfRequest: '2025-01-14', nameOfApplicant: name, semester: '1st Semester' })),
  ...['Rondio Montera Jr.', 'Gilbert I. Dumpay', 'Jerry G. Flor', 'Rowena A. Luzon', 'Adrian M. Nifas'].map((name) => ({ dateOfRequest: '2025-01-15', nameOfApplicant: name, semester: '1st Semester' })),
  { dateOfRequest: '2025-02-27', nameOfApplicant: 'Sr. Maria Grelyn C. Cruzat, FMA', semester: '1st Semester' },
  { dateOfRequest: '2025-03-19', nameOfApplicant: 'Jovilito D. Landicho, Ph.D.', semester: '1st Semester' },
  // CY 2025 - SECOND SEMESTER (GAP Cert)
  ...['Arnel H. Padar', 'Ramil M. Ygloria', 'Antonia E. Ygloria', 'Nenabelle M. Dugenia', 'Demetrio C. Cantado', 'Arnel D. Bermudez', 'Sebiano S. Retig', 'Samson M. Caras', 'Ronald B. Martines', 'Antonio U. Alvarez Jr.', 'Edzel S. Janiva', 'Nilo M. Genovea', 'Randy M. Manadic', 'Esterilita O. Cabrestante', 'Rolando C. Parreñas', 'Krysland Jann L. Domingo', 'Rolando A. Duñgo', 'Lucia V. Desamito', 'Samson D. Ducejo', 'Antonio C. Calampinay', 'Joey E. Ygloria'].map((name) => ({ dateOfRequest: '2025-07-03', nameOfApplicant: name, semester: '2nd Semester' })),
]

// Monitoring of GAP Certified Farmer: Date of Monitoring, Name of Farmer, Semester
export const MONITORING_MASTER_LIST = [
  // CY 2024 - SECOND SEMESTER
  ...['Joy L. Perlas', 'Judy T. Tria', 'Corazon D. Babas', 'Rodolfo G. Fernandez', 'Susana G. Pablo', 'Ryan G. Jubilado', 'Arnold P. Mitra', 'Nestor B. Bocala', 'Rowena P. Javillonar'].map((name) => ({ dateOfMonitoring: '2024-08-28', nameOfFarmer: name, semester: '2nd Semester' })),
  { dateOfMonitoring: '2024-08-29', nameOfFarmer: 'Joseph V. Villola', semester: '2nd Semester' },
  { dateOfMonitoring: '2024-08-29', nameOfFarmer: 'Jovilito D. Landicho', semester: '2nd Semester' },
  { dateOfMonitoring: '2024-08-30', nameOfFarmer: 'Sr. Ailyn P. Cayanan', semester: '2nd Semester' },
  ...['Danny L. Sala', 'Virgilio B. Pulido', 'Marvin M. Javier', 'Virginia G. Javier', 'Jocelyn C. Arangale', 'Camilo M. Rosimo, Jr.', 'Rosalia P. Dacara', 'Christine D. Robles', 'Joseph B. Dagang'].map((name) => ({ dateOfMonitoring: '2024-11-25', nameOfFarmer: name, semester: '2nd Semester' })),
  ...['Melvin C. Capalad', 'Isabel Imana', 'Edwin S. Hernandez', 'Rolando S. Malabunga, Jr.', 'Jaypee C. Palma', 'Precyla I. Estrada', 'Roberto F. Camero'].map((name) => ({ dateOfMonitoring: '2024-11-26', nameOfFarmer: name, semester: '2nd Semester' })),
  ...['Marlon C. Maycong', 'Luren A. Maycong', 'Wilma P. Imana', 'Reynaldo B. Maycong', 'Livelyn F. Castillo'].map((name) => ({ dateOfMonitoring: '2024-11-27', nameOfFarmer: name, semester: '2nd Semester' })),
  { dateOfMonitoring: '2024-11-28', nameOfFarmer: 'Donato B. Maycong', semester: '2nd Semester' },
  ...['Jose A. Gonzales', 'Michael A. Paglicawan'].map((name) => ({ dateOfMonitoring: '2024-12-03', nameOfFarmer: name, semester: '2nd Semester' })),
  ...['Jonathan F. Sanchez', 'Romeo P. Bucayo'].map((name) => ({ dateOfMonitoring: '2024-12-04', nameOfFarmer: name, semester: '2nd Semester' })),
  ...['Jeliezel U. Dimapalitan', 'Rousel B. Orlina', 'Jan Antonie R. Cuevas', 'Elsa P. Reyes', 'Generalito G. Flor', 'Amor C. Sula'].map((name) => ({ dateOfMonitoring: '2024-12-05', nameOfFarmer: name, semester: '2nd Semester' })),
  ...['Rosalina A. Ilagan', 'Maristella Ruado'].map((name) => ({ dateOfMonitoring: '2024-12-06', nameOfFarmer: name, semester: '2nd Semester' })),
  // CY 2025 - SECOND SEMESTER
  ...['Rex T. Fabrigas', 'Melinda A.Latoza', 'Jocelyn C. Arangale', 'Judy T. Tria', 'Arnold P. Mitra'].map((name) => ({ dateOfMonitoring: '2025-08-27', nameOfFarmer: name, semester: '2nd Semester' })),
  ...['Rosalina P. Dacara', 'Ryan G. Jubilado', 'Joy L. Perlas', 'Nilo G. Bayudan', 'Eleseo S. Punzalan', 'Joseph V. Villola', 'Teoderico T. Bautista'].map((name) => ({ dateOfMonitoring: '2025-08-28', nameOfFarmer: name, semester: '2nd Semester' })),
  ...['Melvin C. Capalad', 'Joseliti C. Mandagan Jr.', 'Jerryco C. Mamaril', 'Eugine G. Gamino'].map((name) => ({ dateOfMonitoring: '2025-08-29', nameOfFarmer: name, semester: '2nd Semester' })),
  ...['Maristela D. Ruado', 'Jeliezel U. Dimapalitan', 'Jeraldin D. Magana', 'Jerry G. Flor', 'Adriian M. Nifas', 'Generalito G. Flor'].map((name) => ({ dateOfMonitoring: '2025-09-10', nameOfFarmer: name, semester: '2nd Semester' })),
  ...['Rosalina A. Ilagan', 'Elsa P. Reyes', 'Luz B. Bandales'].map((name) => ({ dateOfMonitoring: '2025-09-11', nameOfFarmer: name, semester: '2nd Semester' })),
  ...['Michael A. Paglicawan', 'Joel S. Losito', 'Jonathan F. Sanchez', 'Shelly P. Dela- Cruz', 'Ryan M. Insigne', 'Roseller T. Paglicawan', 'Nemuel C. Cajayon', 'Clifford B. Ross', 'Lester G. Evangelio', 'Berwyn Francis C. Fajardo', 'Raff Joseph R. Egos', 'Fernan G. Parisan'].map((name) => ({ dateOfMonitoring: '2025-09-12', nameOfFarmer: name, semester: '2nd Semester' })),
  ...['Rowena P. Javillonar', 'Nestor B. Bocala', 'Virginia G. Javier', 'Marvin M. Javier', 'Danny Sala'].map((name) => ({ dateOfMonitoring: '2025-10-14', nameOfFarmer: name, semester: '2nd Semester' })),
  ...['Edgar Dela Rosa', 'Christine D. Robles', 'Joseph B. Dagang', 'Frederick F. Verzola', 'Edgardo Tamboong'].map((name) => ({ dateOfMonitoring: '2025-10-15', nameOfFarmer: name, semester: '2nd Semester' })),
  ...['Wilma P. Imana', 'Donato B. Maycong', 'Edwin S. Hernandez', 'Rolando S. Malabunga', 'Marlon C. Maycong', 'Jezreel M. Camero', 'Precyla I. Estrada', 'Roberto F. Camero', 'Reynaldo B. Maycong', 'Luren B. Maycong', 'Jaypee C. Palma', 'Livelyn F. Castillo'].map((name) => ({ dateOfMonitoring: '2025-10-16', nameOfFarmer: name, semester: '2nd Semester' })),
  ...['Gilbert I. Dumpay', 'Amor C. Sula', 'Rondio g. Montera Jr.', 'Rowena A. Luzon', 'Jan Antonie R. Cuevas', 'Rousel B. Orlina'].map((name) => ({ dateOfMonitoring: '2025-10-28', nameOfFarmer: name, semester: '2nd Semester' })),
  ...['Clifford T. Tepico', 'Jocylyn F. Balderama', 'Romeo P. Bucayo', 'James Patrick T. Pedrasa', 'Francis Lou T. Pedraza'].map((name) => ({ dateOfMonitoring: '2025-10-29', nameOfFarmer: name, semester: '2nd Semester' })),
]

/** Normalize name for matching: trim, lowercase, single spaces, remove commas/periods */
export function normalizeNameForGAP(s) {
  if (s == null) return ''
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[,.]/g, '')
}

/** Normalize date to YYYY-MM-DD for matching */
export function normalizeDateForGAP(val) {
  if (val == null || val === '') return ''
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val.trim().slice(0, 10))) return val.trim().slice(0, 10)
  const dt = val && typeof val.toDate === 'function' ? val.toDate() : new Date(val)
  if (!dt || Number.isNaN(dt.getTime())) return ''
  const y = dt.getFullYear()
  const m = String(dt.getMonth() + 1).padStart(2, '0')
  const d = String(dt.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
