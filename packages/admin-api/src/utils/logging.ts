import { maskJSON2, maskStringV2 } from "maskdata"

const IDMaskingConfig = {
    maskWith: "*",
    fixedOutputLength: undefined,
    unmaskedStartCharacters: 3
}

const AddressMaskingConfig = {
    maskWith: "*",
    fixedOutputLength: undefined,
    unmaskedStartCharacters: 5,
    unmaskedEndCharacters: 0
}

const JSONMaskingConfig = {
    emailMaskOptions: {
        maskWith: "*",
        unmaskedStartCharactersBeforeAt: 3,
        unmaskedEndCharactersAfterAt: 3,
        maskAtTheRate: false
    },
    emailFields: ["Email", "email"],

    phoneMaskOptions: {
        maskWith: "*",
        unmaskedStartDigits: 4,
        unmaskedEndDigits: 1
    },
    phoneFields: ["mobileNumber", "phn", "homeNumber"],

    stringMaskOptions: {
        maskWith: "*",
        maskOnlyFirstOccurance: false,
        values: [],
        maskAll: false,
        maskSpace: true
    },
    stringFields: ["baseProfile.email"],

    jwtMaskOptions: {
        maskWith: "*",
        maxMaskedCharacters: 20,
        maskDot: true,
        maskHeader: true,
        maskPayload: true,
        maskSignature: true
    },
    jwtFields: ["SigningToken"],

    genericStrings: [
        {
            fields: [
                "periodStart1",
                "periodStart2",
                "isFinalClaim",
                "employerName",
                "employerContact",
                "employerPhone",
                "businessAddress1",
                "employerCity",
                "employerPostal",
                "employeeFirstName",
                "employeeLastName",
                "dateTo1",
                "dateTo2",
                "dateTo3",
                "dateTo4",
                "dateTo5",
                "dateFrom1",
                "dateFrom2",
                "dateFrom3",
                "dateFrom4",
                "dateFrom5",
                "hoursWorked1",
                "hoursWorked2",
                "hoursWorked3",
                "hoursWorked4",
                "hoursWorked5",
                "eligibleHoursWorked1",
                "eligibleHoursWorked2",
                "eligibleHoursWorked3",
                "eligibleHoursWorked4",
                "eligibleHoursWorked5",
                "hourlyWage1",
                "hourlyWage2",
                "hourlyWage3",
                "hourlyWage4",
                "hourlyWage5",
                "eligibleHourlyWage1",
                "eligibleHourlyWage2",
                "eligibleHourlyWage3",
                "eligibleHourlyWage4",
                "eligibleHourlyWage5",
                "totalWages1",
                "totalWages2",
                "totalWages3",
                "totalWages4",
                "totalWages5",
                "eligibleWages1",
                "eligibleWages2",
                "eligibleWages3",
                "eligibleWages4",
                "eligibleWages5",
                "totalMercs1",
                "totalMercs2",
                "totalMercs3",
                "totalMercs4",
                "totalMercs5",
                "eligibleMercs1",
                "eligibleMercs2",
                "eligibleMercs3",
                "eligibleMercs4",
                "eligibleMercs5",
                "totalWages",
                "totalEligibleWages",
                "totalMercs",
                "totalEligibleMercs",
                "clientIssues1",
                "workbcCentre",
                "signatory1",
                "subsidyRateDateFrom1",
                "subsidyRateDateTo1",
                "totalWeeks1",
                "subsidyRatePercentage1",
                "totalEligibleWagesPaid1",
                "wagesEligibleForSubsidy1",
                "wagesToBeReimbursed1",
                "totalEligibleMercsPaid1",
                "mercsToBeReimbursed1",
                "totalAmountToBeReimbursed1",
                "subsidyRateDateFrom2",
                "subsidyRateDateTo2",
                "totalWeeks2",
                "subsidyRatePercentage2",
                "totalEligibleWagesPaid2",
                "wagesEligibleForSubsidy2",
                "wagesToBeReimbursed2",
                "totalEligibleMercsPaid2",
                "mercsToBeReimbursed2",
                "totalAmountToBeReimbursed2",
                "totalSubsidyClaimed",
                "comments",
                "approvedBy",
                "approvedDate",
                "submittedDate",
                "submissionID",
                "grandTotal",
                "grandEligTotal"
            ],
            config: {
                maskWith: "*",
                maskAll: true
            }
        }
    ]
}

const EmailMaskingConfig = {
    maskWith: "*",
    fixedOutputLength: 20,
    unmaskedStartCharacters: 5,
    unmaskedEndCharacters: 0
}

const maskID = (ID: string) => maskStringV2(ID, IDMaskingConfig)

const maskJSON = (log: unknown): string | undefined => {
    try {
        if (typeof log === "object" && log !== null) {
            return JSON.stringify(maskJSON2(log, JSONMaskingConfig))
        }
    } catch (error) {
        return String(log)
    }
    return String(log)
}

const maskAddress = (address: string) => maskStringV2(address, AddressMaskingConfig)

const maskEmail = (email: string) => maskStringV2(email, EmailMaskingConfig)

export { maskID, maskJSON, maskAddress, maskEmail }
