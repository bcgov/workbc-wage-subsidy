import express from "express"
import * as claimService from "../src/services/claims.service"
import { getCatchment } from "../src/lib/catchment"
import { getAllClaims, getClaim, updateClaim, deleteClaim } from "../src/controllers/claim.controller"

jest.mock("../src/services/claims.service")
jest.mock("../src/lib/catchment")

describe("getAllClaims", () => {
    let req: any
    let res: express.Response

    beforeEach(() => {
        req = {
            kauth: {
                grant: {
                    access_token: {
                        content: {
                            identity_provider: "bceid",
                            bceid_user_guid: "test_bceid_user_guid"
                        }
                    }
                }
            },
            query: {
                sort: "id,ASC",
                filter: '{"name": "John Doe","catchmentno": "0"}',
                page: "1",
                perPage: "10"
            }
        }
        res = express.response
        res.status = jest.fn().mockReturnValue(res)
        res.send = jest.fn()
        res.set = jest.fn()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it("returns 200 with claims data", async () => {
        const catchment = ["0"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)
        const claims = {
            data: [{ id: 1, name: "John Doe" }],
            pagination: {
                to: 10,
                total: 100
            }
        }
        ;(claimService.getAllClaims as jest.Mock).mockResolvedValue(claims)
        await getAllClaims(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(claims.data)
        expect(res.set).toHaveBeenCalledWith({
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": `0 - ${claims.pagination.to} / ${claims.pagination.total}`
        })
    })
    it("return 403 when filter catchment is different then getCatchment catchments on bceid", async () => {
        const catchment = ["0"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)
        req.query.filter = '{"name": "John Doe","catchmentno": "1"}'
        await getAllClaims(req, res)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith("Not Authorized")
    })

    it("returns 403 when getCatchment throws an error", async () => {
        ;(getCatchment as jest.Mock).mockRejectedValue(new Error("Access denied"))
        await getAllClaims(req, res)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith("Not Authorized")
    })
    it("returns 500 when getAllClaims throws an error", async () => {
        const catchment = ["0"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)
        ;(claimService.getAllClaims as jest.Mock).mockRejectedValue(new Error("test_error"))
        await getAllClaims(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith("Server Error")
    })
})

describe("getClaim", () => {
    let req: any
    let res: express.Response
    beforeEach(() => {
        req = {
            kauth: {
                grant: {
                    access_token: "test_access_token"
                }
            },
            query: {
                sort: "id,ASC",
                filter: '{"name": "John Doe"}',
                page: "1",
                perPage: "10"
            },
            params: {
                id: "1"
            }
        }
        res = express.response
        res.status = jest.fn().mockReturnValue(res)
        res.send = jest.fn()
        res.set = jest.fn()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it("returns 200 with claim data", async () => {
        const catchment = ["0"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)
        const claim = [{ id: 1, name: "John Doe" }]
        ;(claimService.getClaimByID as jest.Mock).mockResolvedValue(claim)
        await getClaim(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(claim[0])
    })
    it("returns 403 when getCatchment throws an error", async () => {
        ;(getCatchment as jest.Mock).mockRejectedValue(new Error("Access denied"))
        await getClaim(req, res)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith("Not Authorized")
    })
    it("returns 500 when getClaimByID throws an error", async () => {
        const catchment = ["0"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)
        ;(claimService.getClaimByID as jest.Mock).mockRejectedValue(new Error("test_error"))
        await getClaim(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith("Server Error")
    })
    it("returns 404 when getClaimByID returns empty array", async () => {
        const catchment = ["0"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)
        ;(claimService.getClaimByID as jest.Mock).mockResolvedValue([])
        await getClaim(req, res)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.send).toHaveBeenCalledWith("Not found or Not Authorized")
    })
})

describe("updateClaim", () => {
    let req: any
    let res: express.Response
    beforeEach(() => {
        req = {
            kauth: {
                grant: {
                    access_token: {
                        content: {
                            identity_provider: "bceid"
                        }
                    }
                }
            },
            query: {
                sort: "id,ASC",
                filter: '{"name": "John Doe"}',
                page: "1",
                perPage: "10"
            },
            params: {
                id: "1"
            }
        }
        res = express.response
        res.status = jest.fn().mockReturnValue(res)
        res.send = jest.fn()
        res.set = jest.fn()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
    it("returns 200 with updated claim data", async () => {
        req.kauth.grant.access_token.content = {
            identity_provider: "idir"
        }
        req.body = {
            applicationstatus: "Submitted"
        }
        const catchment = ["0"]
        ;(getCatchment as jest.Mock).mockResolvedValue(catchment)
        const claim = [{ id: "1", name: "John Doe", applicationstatus: "Submitted" }]
        ;(claimService.updateClaim as jest.Mock).mockResolvedValue(claim)
        await updateClaim(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith({ id: claim[0].id })
    })
})
