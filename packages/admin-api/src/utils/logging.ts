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
    emailFields: [
        "Email",
        "email",
        "baseProfile.email",
        "requestObject.ApplicantEmail",
        "requestObject.Email",
        "userInfo.email",
        "applicationJSON.Answers.ApplicantEmail"
    ],

    phoneMaskOptions: {
        maskWith: "*",
        unmaskedStartDigits: 4,
        unmaskedEndDigits: 1
    },
    phoneFields: [
        "mobileNumber",
        "phn",
        "homeNumber",
        "CaseContactInfoResponse.ContactInformation.HomePhone",
        "CaseContactInfoResponse.ContactInformation.WorkPhone",
        "CaseContactInfoResponse.ContactInformation.MessagePhone",
        "CaseContactInfoResponse.ContactInformation.CellPhone",
        "applicationJSON.Answers.ApplicantHomePhone",
        "applicationJSON.Answers.ApplicantCellPhone"
    ],

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
            // keys/tokens useful for debugging but that need to be masked //
            fields: [
                "deviceToken",
                "userID",
                "fcmToken",
                "GuID",
                "Guid",
                "userGUID",
                "Username",
                "key",
                "url",
                "clientBCeID",
                "BCSC_DID",
                "CaseContactInfoResponse.ContactInformation.BCeIDGUID",
                "CaseContactInfoResponse.ContactInformation.BCSCDID",
                "MobileDevices.*",
                "requestObject.ApplicantGUID",
                "requestObject.ApplicantBcscDID",
                "requestObject.GuID",
                "applicationJSON.Answers.ApplicantBcscDID"
            ],
            config: {
                maskWith: "*",
                fixedOutputLength: 20,
                unmaskedStartCharacters: 5,
                unmaskedEndCharacters: 0
            }
        },
        {
            // SIN/DOB //
            fields: [
                "Sin",
                "sin",
                "BirthDate",
                "dob",
                "baseProfile.birthDate",
                "CaseContactInfoResponse.ContactInformation.SIN",
                "CaseContactInfoResponse.ContactInformation.DOB",
                "requestObject.ApplicantSIN",
                "requestObject.ApplicantBirthDate",
                "requestObject.BirthDate",
                "requestObject.Sin",
                "applicationJSON.Answers.ApplicantSin",
                "actionPlans.*"
            ],
            config: {
                maskWith: "*",
                unmaskedStartCharacters: 3
            }
        },
        {
            // Personal Information //
            fields: [
                "FirstName",
                "firstName",
                "LastName",
                "lastName",
                "MiddleName",
                "middleName",
                "StreetAddressLine1",
                "applicationJSON.Answers.ApplicantBirthDate.*",
                "applicationJSON.Answers.PrimaryAddress.*",
                "applicationJSON.Answers.ApplicantGender",
                "CaseContactInfoResponse.ContactInformation.ContactAddress",
                "userInfo.firstName",
                "userInfo.lastName",
                "userInfo.middleName",
                "applicationJSON.Answers.ApplicantFirstName",
                "applicationJSON.Answers.ApplicantLastName",
                "applicationJSON.Answers.ApplicantMiddleName",
                "requestObject.ApplicantFirstName",
                "requestObject.ApplicantLastName",
                "requestObject.ApplicantMiddleName",
                "requestObject.FirstName",
                "requestObject.LastName",
                "requestObject.MiddleName",
                "requestObject.PhoneNumbers.*",
                "requestObject.phn",
                "CaseContactInfoResponse.ContactInformation.FirstName",
                "CaseContactInfoResponse.ContactInformation.LastName",
                "CaseContactInfoResponse.ContactInformation.MiddleName",
                "baseProfile.firstName",
                "baseProfile.lastName",
                "baseProfile.middleName"
            ],
            config: {
                maskWith: "*"
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
