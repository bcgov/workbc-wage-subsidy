/* eslint-disable import/prefer-default-export */
import axios from "axios"
import { getCDOGSToken } from "./common.service"

export const generateDocumentTemplate = async (templateHash: string, templateConfig: any) => {
    try {
        const token: string = await getCDOGSToken()
        console.log(token,templateConfig)
        const cdogsResponse = await axios({
            // need to use axios like this as otherwise it won't accept the Authorization header
            method: "post",
            url: `${process.env.CDOGS_URL}/api/v2/template/${templateHash}/render`,
            data: templateConfig,
            responseType: "arraybuffer",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept-Encoding": "gzip, deflate, br",
                Accept: "application/pdf",
                Connection: "keep-alive"
            }
        })
        return cdogsResponse.data
    } catch (error: any) {
        console.log("error with CDOGS")
        // console.log(error)
        throw new Error(error)
    }
}
