import { maskStringV2 } from "maskdata"

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

const EmailMaskingConfig = {
    maskWith: "*",
    fixedOutputLength: 20,
    unmaskedStartCharacters: 5,
    unmaskedEndCharacters: 0
}

const maskID = (ID: string) => maskStringV2(ID, IDMaskingConfig)

const maskAddress = (address: string) => maskStringV2(address, AddressMaskingConfig)

const maskEmail = (email: string) => maskStringV2(email, EmailMaskingConfig)

export { maskID, maskAddress, maskEmail }
