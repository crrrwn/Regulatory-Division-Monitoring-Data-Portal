// Firestore collection IDs and labels for View Records
export const COLLECTIONS = [
  { id: 'animalFeed', label: 'Animal Feeds Unit' },
  { id: 'animalWelfare', label: 'Animal Welfare' },
  { id: 'livestockHandlers', label: 'Livestock/Poultry/By-Products Handlers' },
  { id: 'transportCarrier', label: 'Transport Carriers' },
  { id: 'plantMaterial', label: 'Plant Material / Nursery' },
  { id: 'organicAgri', label: 'Organic Agriculture Certification' },
  { id: 'goodAgriPractices', label: 'Good Agricultural Practices' },
  { id: 'goodAnimalHusbandry', label: 'Good Animal Husbandry' },
  { id: 'organicPostMarket', label: 'Organic Post-Market Surveillance' },
  { id: 'landUseMatter', label: 'Land Use Matter' },
  { id: 'foodSafety', label: 'Food Safety' },
  { id: 'plantPestSurveillance', label: 'Plant Pest Surveillance' },
  { id: 'cfsAdmcc', label: 'CFS/ADMCC' },
  { id: 'animalDiseaseSurveillance', label: 'Animal Disease Surveillance' },
]

// For table display: which field to show as primary name per collection
export const COLLECTION_TITLE_FIELD = {
  animalFeed: 'companyName',
  animalWelfare: 'facilityName',
  livestockHandlers: 'ownershipType',
  transportCarrier: 'ownerName',
  plantMaterial: 'nurseryName',
  organicAgri: 'entityName',
  goodAgriPractices: 'farmName',
  goodAnimalHusbandry: 'farmName',
  organicPostMarket: 'establishmentName',
  landUseMatter: 'landowner',
  foodSafety: 'nameOfEstablishment',
  plantPestSurveillance: 'farmerName',
  cfsAdmcc: 'establishment',
  animalDiseaseSurveillance: 'farmOwnerName',
}

// Edit modal: same order as in each form (do not change order)
export const COLLECTION_FIELD_ORDER = {
  animalFeed: ['date', 'companyName', 'officeAddress', 'plantAddress', 'email', 'cellphone', 'natureOfBusiness', 'businessOrg', 'productLines', 'nutritionistName', 'prcIdNo', 'validity', 'certNo', 'dateIssued', 'fee', 'orNo', 'orDate', 'remarks'],
  animalWelfare: ['dateApplied', 'facilityName', 'ownerName', 'address', 'facilityType', 'speciesHandled', 'headVet', 'prcLicenseNo', 'certificateNo', 'validityDate', 'status'],
  livestockHandlers: ['ownershipType', 'singleName', 'companyName', 'repName', 'address', 'businessType', 'contact', 'applicantType', 'category', 'livestock', 'poultry', 'byProducts', 'region'],
  transportCarrier: ['ownerName', 'businessAddress', 'businessOrg', 'typeOfApplicant', 'contactNo', 'email', 'applicantTin', 'companyTin', 'typeOfServices', 'applicationType', 'speciesCargoBirds', 'speciesAnimals', 'byProducts', 'typeOfVehicle', 'bodyType', 'fleet'],
  plantMaterial: ['dateApplied', 'nurseryName', 'operatorName', 'farmLocation', 'totalArea', 'plantMaterials', 'specificVariety', 'propagatorName', 'accreditationNo', 'validityDate', 'remarks'],
  organicAgri: ['dateApplied', 'entityName', 'operatorOwner', 'location', 'scope', 'certifyingBody', 'commodities', 'conversionStartDate', 'certificationStatus', 'certificateNo', 'validityDate'],
  goodAgriPractices: ['applicationDate', 'farmName', 'farmOwner', 'farmLocation', 'cropsPlanted', 'productionArea', 'harvestEstimate', 'waterSource', 'philgapCertNo', 'dateIssued', 'expiryDate'],
  goodAnimalHusbandry: ['applicationDate', 'farmName', 'owner', 'farmAddress', 'farmType', 'population', 'biosecurityLevel', 'eccNo', 'gahpCertNo', 'validity', 'inspectionStatus'],
  organicPostMarket: ['inspectionDate', 'establishmentName', 'address', 'productName', 'brand', 'labelClaim', 'certifyingLogoPresent', 'violationFound', 'actionTaken', 'inspectorName'],
  landUseMatter: ['dateReceived', 'landowner', 'lotTitleNo', 'location', 'totalLandArea', 'existingCropUsage', 'proposedUsage', 'safdzZone', 'daClearanceNo', 'status'],
  foodSafety: ['dateOfMonitoring', 'establishmentType', 'nameOfEstablishment', 'address', 'productInspected', 'batchLotNo', 'sensoryAnalysis', 'labSampleCollected', 'labResult', 'remarks'],
  plantPestSurveillance: ['dateOfMonitoring', 'location', 'farmerName', 'cropAffected', 'stageOfCrop', 'pestDiseaseObserved', 'incidenceRate', 'damageSeverity', 'actionTaken', 'technicianName'],
  cfsAdmcc: ['date', 'establishment', 'sampleType', 'parameterTested', 'sourceOrigin', 'resultValue', 'standardLimit', 'compliance', 'referenceReportNo'],
  animalDiseaseSurveillance: ['dateReported', 'barangay', 'municipality', 'farmOwnerName', 'species', 'clinicalSigns', 'totalPopulation', 'mortality', 'laboratoryTest', 'result', 'controlMeasures'],
}
