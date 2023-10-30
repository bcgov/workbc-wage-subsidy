export interface UserInfo {
    username: string
    firstName: string
    fullName: string
    email: string
    idp: string
    public: boolean
}

export interface NeedEmployeeData {
    applicationType: string
    lateEntry: boolean
    userInfo: UserInfo
    internalId: string
    applicationId: string
    storefrontId: number
    catchmentNo: number
    applicationType: string
    workBcCentre: string
    formHandler: string
    areYouCurrentlyWorkingWithAWorkBcCentre: string
    operatingName: string
    businessNumber: string
    businessAddress: string
    businessCity: string
    businessProvince: string
    businessPostal: string
    businessPhone: string
    businessFax: string
    employerEmail: string
    otherWorkAddress: boolean
    sectorType: string
    typeOfIndustry: string
    organizationSize: string
    CEWSAndOrCRHP: string
    employeeDisplacement: string
    labourDispute: string
    unionConcurrence: string
    liabilityCoverage: string
    wageSubsidy: string
    WSBCCoverage: string
    orgEligibilityConsent: boolean
    lawComplianceConsent: boolean
    next2: boolean
    positionTitle0: string
    numberOfPositions0: number
    startDate0: string
    wage0: string
    hours0: string
    applicationMERCs0: string
    duties0: string
    skills0: string
    workExperience0: string
    previous: boolean
    next4: boolean
    signatoryTitle: string
    signatory1: string
    organizationConsent: boolean
    submit: boolean
    previous1: boolean
    validateAddress: boolean
    catchmentNoStoreFront: string
    matchedToCentre: string
    employeeEmail0: string
}

export type Notification = {
    id: number
    email: string
    catchmentno: number
    type: string
}
