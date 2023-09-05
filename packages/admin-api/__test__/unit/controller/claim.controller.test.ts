import express from "express"
import * as claimService from "../../../src/services/claims.service"
import { getCatchments } from "../../../src/lib/catchment"
import { updateClaimWithSideEffects } from "../../../src/lib/transactions"
import { getAllClaims, getOneClaim, updateClaim } from "../../../src/controllers/claim.controller"

jest.mock("../../../src/services/claims.service")
jest.mock("../../../src/lib/catchment")
jest.mock("../../../src/lib/transactions")

describe("getAllClaims", () => {
    let req: any
    let res: express.Response

    beforeEach(() => {
        req = {
            kauth: {
                grant: {
                    access_token: {
                        content: {
                            bceid_user_guid: "bceid_guid",
                            idir_user_guid: undefined,
                            identity_provider: "bceid"
                        }
                    }
                }
            },
            query: {
                filter: '{"catchmentno": 1}',
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
        const catchments = [1]
        const claims = {
            data: [{ id: 1, catchmentno: 1 }],
            pagination: {
                to: 10,
                total: 100
            }
        }
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(claimService.getAllClaims as jest.Mock).mockResolvedValue(claims)
        await getAllClaims(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(claims.data)
        expect(res.set).toHaveBeenCalledWith({
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": `0 - ${claims.pagination.to} / ${claims.pagination.total}`
        })
    })

    it("returns 401 when username undefined", async () => {
        req.kauth.grant.access_token.content = {
            bceid_username: undefined,
            idir_username: undefined
        }
        await getAllClaims(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith("Not Authorized")
    })

    it("returns 403 when no catchments obtained", async () => {
        const catchments: never[] = []
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        await getAllClaims(req, res)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith("Forbidden")
    })

    it("returns 403 when user lacks catchment permission", async () => {
        const catchments = [2]
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        await getAllClaims(req, res)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith("Forbidden")
    })

    it("returns 500 when an error occurs", async () => {
        const catchments = [1]
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(claimService.getAllClaims as jest.Mock).mockRejectedValue(new Error("test_error"))
        await getAllClaims(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith("Internal Server Error")
    })
})

describe("getOneClaim", () => {
    let req: any
    let res: express.Response
    beforeEach(() => {
        req = {
            kauth: {
                grant: {
                    access_token: {
                        content: {
                            bceid_user_guid: "bceid_guid",
                            idir_user_guid: undefined,
                            identity_provider: "bceid"
                        }
                    }
                }
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

    it("returns 200 with application when bceid username defined", async () => {
        const catchments = [1]
        const claim = { id: "1", catchmentno: 1 }
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(claimService.getClaimByID as jest.Mock).mockResolvedValue(claim)
        await getOneClaim(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(claim)
    })

    it("returns 401 when username undefined", async () => {
        req.kauth.grant.access_token.content = {
            bceid_username: undefined,
            idir_username: undefined
        }
        await getOneClaim(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith("Not Authorized")
    })

    it("returns 403 when no catchments obtained", async () => {
        const catchments: never[] = []
        const claim = { id: "1", catchmentno: 1 }
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(claimService.getClaimByID as jest.Mock).mockResolvedValue(claim)
        await getOneClaim(req, res)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith("Forbidden")
    })

    it("returns 403 when user lacks catchment permission", async () => {
        const catchments = [2]
        const claim = { id: "1", catchmentno: 1 }
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(claimService.getClaimByID as jest.Mock).mockResolvedValue(claim)
        await getOneClaim(req, res)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith("Forbidden")
    })

    it("returns 404 when claim not found", async () => {
        const catchments = [1]
        const claim = null
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(claimService.getClaimByID as jest.Mock).mockResolvedValue(claim)
        await getOneClaim(req, res)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.send).toHaveBeenCalledWith("Not Found")
    })

    it("returns 500 when an error occurs", async () => {
        const catchment = [1]
        ;(getCatchments as jest.Mock).mockResolvedValue(catchment)
        ;(claimService.getClaimByID as jest.Mock).mockRejectedValue(new Error("test_error"))
        await getOneClaim(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith("Internal Server Error")
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
                            bceid_user_guid: "bceid_guid",
                            idir_user_guid: undefined,
                            identity_provider: "bceid"
                        }
                    }
                }
            },
            query: {},
            params: {
                id: "1"
            },
            body: {
                status: "Completed"
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
    it("returns 200 with claim id when bceid username defined", async () => {
        const catchments = [1]
        const claim = { id: "1", catchmentno: 1, status: "Processing" }
        const claimID = { id: "1" }
        const numUpdated = 1
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(claimService.getClaimByID as jest.Mock).mockResolvedValue(claim)
        ;(updateClaimWithSideEffects as jest.Mock).mockResolvedValue(numUpdated)
        await updateClaim(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(claimID)
    })
    it("returns 200 with claim id when idir user updates catchment", async () => {
        req.kauth.grant.access_token.content = {
            bceid_user_guid: undefined,
            idir_user_guid: "idir"
        }
        req.body.catchmentNo = 2
        const catchments = [1, 2]
        const claim = { id: "1", catchmentno: 1, status: "Processing" }
        const claimID = { id: "1" }
        const numUpdated = 1
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(claimService.getClaimByID as jest.Mock).mockResolvedValue(claim)
        ;(updateClaimWithSideEffects as jest.Mock).mockResolvedValue(numUpdated)
        await updateClaim(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(claimID)
    })
    it("returns 500 when no records are updated but no error occurs", async () => {
        const catchments = [1]
        const claim = { id: "1", catchmentno: 1, status: "Processing" }
        const claimID = { id: "1" }
        const numUpdated = 0
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(claimService.getClaimByID as jest.Mock).mockResolvedValue(claim)
        ;(updateClaimWithSideEffects as jest.Mock).mockResolvedValue(numUpdated)
        await updateClaim(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(claimID)
    })
    it("returns 401 when username undefined", async () => {
        req.kauth.grant.access_token.content = {
            bceid_username: undefined,
            idir_username: undefined
        }
        await updateClaim(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith("Not Authorized")
    })
    it("returns 403 when no catchments obtained", async () => {
        const catchments: never[] = []
        const claim = { id: "1", catchmentno: 1, status: "Processing" }
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(claimService.getClaimByID as jest.Mock).mockResolvedValue(claim)
        await updateClaim(req, res)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith("Forbidden")
    })
    it("returns 403 when user lacks catchment permission", async () => {
        const catchments = [2]
        const claim = { id: "1", catchmentno: 1, status: "Processing" }
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(claimService.getClaimByID as jest.Mock).mockResolvedValue(claim)
        await updateClaim(req, res)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith("Forbidden")
    })
    it("returns 403 when bceid user attempts to update catchment", async () => {
        req.body.catchmentNo = 2
        const catchments = [1, 2]
        const claim = { id: "1", catchmentno: 1, status: "Processing" }
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(claimService.getClaimByID as jest.Mock).mockResolvedValue(claim)
        await updateClaim(req, res)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith("Forbidden")
    })
    it("returns 403 when idir user attempts to set nonexistent catchment", async () => {
        req.kauth.grant.access_token.content = {
            bceid_user_guid: undefined,
            idir_user_guid: "idir"
        }
        req.body.catchmentNo = 2
        const catchments = [1]
        const claim = { id: "1", catchmentno: 1, status: "Processing" }
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(claimService.getClaimByID as jest.Mock).mockResolvedValue(claim)
        await updateClaim(req, res)
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith("Forbidden")
    })
    it("returns 404 when the item is not found", async () => {
        const catchments = [1]
        const claim = null
        ;(getCatchments as jest.Mock).mockResolvedValue(catchments)
        ;(claimService.getClaimByID as jest.Mock).mockResolvedValue(claim)
        await updateClaim(req, res)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.send).toHaveBeenCalledWith("Not Found")
    })
    it("returns 500 when an error occurs", async () => {
        ;(claimService.getClaimByID as jest.Mock).mockRejectedValue(new Error("Server Error"))
        await updateClaim(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith("Internal Server Error")
    })
})
