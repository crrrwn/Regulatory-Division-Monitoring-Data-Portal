/**
 * SAFDZ Validation master list from user's records.
 * Used for Fill Semester and Add Missing Records in View Records.
 * Semester derived from Date Received: Jan–Jun = 1st, Jul–Dec = 2nd.
 * Match by explorationPermitApplicationNo + nameOfApplicant + dateReceived.
 */

export const SAFDZ_MASTER_LIST = [
  // CY 2024 - Beijing Resources Corporation (EPA No. 374-MIMAROPA) - 3 entries
  {
    explorationPermitApplicationNo: 'EPA No. 374-MIMAROPA',
    nameOfApplicant: 'Beijing Resources Corporation',
    dateReceived: '2023-10-09',
    semester: '2nd Semester',
    province: 'Palawan',
    location: 'Narra, Palawan',
    area: '3291.10',
    dateOfReplyToRequest: '2023-10-11',
    endorsementToBSWM: '2023-10-11',
    endorsementToMGB: '2023-10-11',
    fieldValidation: 'December 11-15, 2023 - Cancelled',
  },
  {
    explorationPermitApplicationNo: 'EPA No. 374-MIMAROPA',
    nameOfApplicant: 'Beijing Resources Corporation',
    dateReceived: '2024-07-22',
    semester: '2nd Semester',
    province: 'Palawan',
    location: 'Narra, Palawan',
    area: '3291.10',
    dateOfReplyToRequest: '2024-07-29',
    endorsementToBSWM: '2024-07-29',
    endorsementToMGB: '2024-07-29',
    fieldValidation: 'September 2-6, 2024',
  },
  {
    explorationPermitApplicationNo: 'EPA No. 374-MIMAROPA',
    nameOfApplicant: 'Beijing Resources Corporation',
    dateReceived: '2024-08-27',
    semester: '2nd Semester',
    province: 'Palawan',
    location: 'Narra, Palawan',
    area: '3291.10',
    dateOfReplyToRequest: '2024-08-27',
    endorsementToBSWM: '2024-08-27',
    endorsementToMGB: '2024-08-27',
    fieldValidation: 'October 15-17, 2024',
  },
  // CY 2024 - Adnama Concrete Aggregates Inc. (EPA No. 35-MIMAROPA) - 2 entries
  {
    explorationPermitApplicationNo: 'EPA No. 35-MIMAROPA',
    nameOfApplicant: 'Adnama Concrete Aggregates Inc. (ACAI)',
    dateReceived: '2024-08-05',
    semester: '2nd Semester',
    province: 'Palawan',
    location: 'Aborlan, Palawan',
    area: '1834.03',
    dateOfReplyToRequest: '2024-08-06',
    endorsementToBSWM: '2024-08-06',
    endorsementToMGB: '2024-08-06',
    fieldValidation: 'September 17-20, 2024 - Cancelled',
  },
  {
    explorationPermitApplicationNo: 'EPA No. 35-MIMAROPA',
    nameOfApplicant: 'Adnama Concrete Aggregates Inc. (ACAI)',
    dateReceived: '2024-08-02',
    semester: '2nd Semester',
    province: 'Palawan',
    location: 'Aborlan, Palawan',
    area: '1834.03',
    dateOfReplyToRequest: '2024-08-29',
    endorsementToBSWM: '2024-08-29',
    endorsementToMGB: '2024-08-29',
    fieldValidation: 'December 9-13, 2024',
  },
  // CY 2025 - Neutron Construction & Marketing Corporation
  {
    explorationPermitApplicationNo: 'EPA No. 379-MIMAROPA',
    nameOfApplicant: 'Neutron Construction & Marketing Corporation',
    dateReceived: '2025-02-24',
    semester: '1st Semester',
    province: 'Palawan',
    location: 'Brookes Point, Palawan',
    area: '410',
    dateOfReplyToRequest: '2025-02-25',
    endorsementToBSWM: '2025-02-25',
    endorsementToMGB: '2025-02-25',
    fieldValidation: 'May 13-16, 2025',
  },
]
